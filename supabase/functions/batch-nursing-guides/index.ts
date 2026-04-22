import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const NURSING_GUIDE_PROMPT = `You are a clinical pharmacist creating evidence-based medication administration guides for bedside nurses.

Generate a concise nursing guide in JSON format following the MedNurse Quick Guide template:
{
  "header": {
    "class": "Drug class (e.g. Beta-blocker, Loop diuretic)",
    "main_use": "Primary clinical indication in 1 sentence",
    "route": "Available routes (e.g. PO, IV, IM)"
  },
  "before_you_give": {
    "verify": ["Key verifications before administration"],
    "check": ["Vital signs or assessments to check"],
    "hold_if": ["Specific parameters to hold medication"],
    "review_labs": ["Labs to review before giving"],
    "do_not_give_if": ["Absolute contraindications or conditions"]
  },
  "preparation": {
    "form": "Dosage form (tablet, vial, premix, etc.)",
    "reconstitute": "Reconstitution instructions if applicable, or null",
    "dilute": "Dilution instructions if applicable, or null",
    "compatible_with": ["Compatible IV fluids or solutions"],
    "equipment_needed": ["Required equipment (pump, filter, etc.)"]
  },
  "administration": {
    "dose": "Typical dose range",
    "route": "Primary route for this guide entry",
    "give_over": "Rate or duration of administration",
    "special_instructions": ["Key administration notes"]
  },
  "what_to_monitor": {
    "monitor": ["Ongoing monitoring parameters"],
    "watch_for": ["Adverse effects or complications to watch for"],
    "stop_if": ["Conditions that require stopping the medication"]
  },
  "after_you_give": {
    "reassess_in": "When to reassess (e.g. 15 min, 1 hour)",
    "expected_effect": "What therapeutic response to expect",
    "document": ["What to document"],
    "follow_up": ["Follow-up actions or labs"]
  },
  "high_risk_alerts": {
    "alert": ["Critical safety alerts"],
    "common_error": ["Common medication errors to avoid"],
    "key_warning": ["Black box warnings or critical warnings"]
  },
  "patient_teaching": {
    "tell_patient": ["What to tell the patient"],
    "report_immediately": ["Symptoms patient should report immediately"]
  }
}

Be specific, practical, and evidence-based. Focus on bedside nursing safety.
Use arrays for list items. Use null for fields that don't apply to this medication.
Every field should have clinically useful content — avoid generic filler.`;

interface MedicationToProcess {
  id: string;
  generic_name: string;
  drug_class: string | null;
  route: string[] | null;
  high_alert: boolean;
  controlled_substance: boolean;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const lovableApiKey = Deno.env.get("LOVABLE_API_KEY");

    if (!lovableApiKey) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { limit = 5, medicationIds } = await req.json();

    let medications: MedicationToProcess[] = [];

    if (medicationIds && Array.isArray(medicationIds)) {
      const { data, error } = await supabase
        .from("medications")
        .select("id, generic_name, drug_class, route, high_alert, controlled_substance")
        .in("id", medicationIds);

      if (error) throw error;
      medications = data || [];
    } else {
      // Get medications needing guides (prioritize unique names)
      const { data, error } = await supabase
        .from("medications")
        .select("id, generic_name, drug_class, route, high_alert, controlled_substance")
        .or("nursing_guide.is.null,nursing_guide.eq.{}")
        .not("generic_name", "like", "%,%")
        .order("generic_name")
        .limit(limit * 3); // Get more to dedupe

      if (error) throw error;
      
      // Deduplicate by generic_name
      const seen = new Set<string>();
      medications = (data || []).filter(m => {
        const name = m.generic_name.toLowerCase();
        if (seen.has(name)) return false;
        seen.add(name);
        return true;
      }).slice(0, limit);
    }

    if (medications.length === 0) {
      return new Response(JSON.stringify({
        success: true,
        message: "No medications need nursing guides",
        generated: 0,
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log(`Generating nursing guides for ${medications.length} medications`);

    const results: { id: string; name: string; success: boolean; error?: string }[] = [];

    for (const med of medications) {
      try {
        console.log(`Generating guide for: ${med.generic_name}`);

        const context = buildContext(med);

        const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${lovableApiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "google/gemini-2.5-flash",
            messages: [
              { role: "system", content: NURSING_GUIDE_PROMPT },
              { role: "user", content: context },
            ],
            temperature: 0.2,
          }),
        });

        if (!aiResponse.ok) {
          const status = aiResponse.status;
          if (status === 429) {
            console.log("Rate limited, stopping batch");
            results.push({ id: med.id, name: med.generic_name, success: false, error: "Rate limited" });
            break;
          }
          throw new Error(`AI error: ${status}`);
        }

        const aiData = await aiResponse.json();
        const content = aiData.choices?.[0]?.message?.content;

        if (!content) {
          throw new Error("No content from AI");
        }

        // Parse JSON from response
        let nursingGuide;
        try {
          const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
          const jsonStr = jsonMatch ? jsonMatch[1] : content;
          nursingGuide = JSON.parse(jsonStr.trim());
        } catch {
          console.error("Parse error for", med.generic_name);
          throw new Error("Failed to parse guide");
        }

        // Update medication
        const { error: updateErr } = await supabase
          .from("medications")
          .update({
            nursing_guide: nursingGuide,
            content_status: "pending_review",
          })
          .eq("id", med.id);

        if (updateErr) throw updateErr;

        results.push({ id: med.id, name: med.generic_name, success: true });
        console.log(`✓ Generated guide for ${med.generic_name}`);

        // Rate limit delay
        await new Promise(r => setTimeout(r, 500));

      } catch (err) {
        console.error(`Error for ${med.generic_name}:`, err);
        results.push({
          id: med.id,
          name: med.generic_name,
          success: false,
          error: err instanceof Error ? err.message : "Unknown error",
        });
      }
    }

    const successCount = results.filter(r => r.success).length;

    return new Response(JSON.stringify({
      success: true,
      generated: successCount,
      failed: results.length - successCount,
      results,
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Batch nursing guides error:", error);
    return new Response(JSON.stringify({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

function buildContext(med: MedicationToProcess): string {
  const parts = [`Medication: ${med.generic_name}`];
  
  if (med.drug_class) parts.push(`Drug Class: ${med.drug_class}`);
  if (med.route?.length) parts.push(`Routes: ${med.route.join(", ")}`);
  if (med.high_alert) parts.push("⚠️ HIGH-ALERT MEDICATION");
  if (med.controlled_substance) parts.push("⚠️ CONTROLLED SUBSTANCE");
  
  parts.push("\nGenerate a comprehensive nursing administration guide.");
  
  return parts.join("\n");
}
