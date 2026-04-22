import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const COMPREHENSIVE_CONTENT_PROMPT = `You are a clinical pharmacist creating comprehensive medication content for a nursing reference platform. Generate ALL content sections in a single JSON response.

Return EXACTLY this JSON structure (no markdown, no code blocks):

{
  "nursing_guide": {
    "quick_reference": {
      "indication": "Primary clinical use",
      "mechanism": "How it works (1 sentence)",
      "onset": "Time to effect",
      "duration": "Duration of action",
      "peak": "Peak effect time"
    },
    "administration": {
      "routes": ["Available routes"],
      "timing": "When to give",
      "food_interaction": "With/without food if PO",
      "special_instructions": "Key admin notes"
    },
    "safety": {
      "hold_parameters": ["When NOT to give - be specific with vital sign thresholds"],
      "max_dose": "Maximum safe dose per 24h",
      "black_box_warnings": ["FDA boxed warnings if any, or empty array"],
      "contraindications": ["Major contraindications"]
    },
    "monitoring": {
      "pre_admin": ["Check before giving"],
      "during": ["Watch for during admin"],
      "post_admin": ["Monitor after giving"],
      "labs": ["Relevant labs with target ranges"]
    },
    "adverse_effects": {
      "common": ["Frequent side effects (>10%)"],
      "serious": ["Call MD immediately if these occur"],
      "interventions": "How to manage common AEs"
    },
    "patient_teaching": {
      "what_to_expect": "Tell patient this about the medication",
      "report_immediately": ["Warning signs patient should report"],
      "lifestyle": "Relevant lifestyle advice (diet, activity)"
    }
  },
  "clinical_details": {
    "pharmacokinetics": {
      "absorption": "Absorption details",
      "distribution": "Distribution/protein binding",
      "metabolism": "Hepatic metabolism pathway",
      "excretion": "Elimination route",
      "half_life": "Elimination half-life"
    },
    "dosing_info": {
      "standard_dose": "Usual adult dose",
      "pediatric_dose": "Pediatric dosing if applicable",
      "max_dose": "Maximum daily dose",
      "renal_adjustment": "Dose adjustment for renal impairment",
      "hepatic_adjustment": "Dose adjustment for hepatic impairment"
    },
    "adverse_reactions": {
      "common": ["Common adverse reactions"],
      "serious": ["Serious/life-threatening reactions"],
      "frequency": "Overall incidence data"
    },
    "drug_interactions": [
      {"drug": "Interacting drug/class", "severity": "major/moderate/minor", "effect": "What happens", "recommendation": "What to do"}
    ]
  },
  "patient_education": {
    "overview": "Simple explanation of what this medication does",
    "how_to_take": "Clear instructions for taking the medication",
    "side_effects": "Common side effects in plain language",
    "when_to_call_doctor": ["Plain-language warning signs"],
    "storage": "How to store the medication",
    "missed_dose": "What to do if a dose is missed",
    "food_drug_interactions": "Foods/drinks to avoid"
  },
  "safety_info": {
    "boxed_warning": "FDA boxed warning text or null",
    "contraindications": ["Absolute contraindications"],
    "warnings": ["Key warnings"],
    "precautions": ["Important precautions"]
  }
}

Be specific, practical, and evidence-based. Use current clinical guidelines. Include specific vital sign thresholds for hold parameters.`;

interface MedicationRecord {
  id: string;
  generic_name: string;
  brand_names: string[] | null;
  drug_class: string | null;
  route: string[] | null;
  high_alert: boolean | null;
  controlled_substance: boolean | null;
  openfda_data: Record<string, unknown> | null;
  fda_label_data: Record<string, unknown> | null;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const lovableApiKey = Deno.env.get("LOVABLE_API_KEY");

    if (!lovableApiKey) {
      return new Response(JSON.stringify({ error: "AI service not configured" }), {
        status: 503,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Auth check
    const authHeader = req.headers.get("Authorization") || "";
    const jwt = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;
    if (!jwt) {
      return new Response(JSON.stringify({ error: "Authentication required" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const authedClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: `Bearer ${jwt}` } },
    });
    const { data: { user }, error: userErr } = await authedClient.auth.getUser(jwt);
    if (userErr || !user) {
      console.error("Auth error:", userErr);
      return new Response(JSON.stringify({ error: "Authentication failed" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const userId = user.id;

    const adminClient = createClient(supabaseUrl, supabaseServiceKey);
    const { data: roleRow } = await adminClient
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .in("role", ["admin", "super_admin"])
      .maybeSingle();

    if (!roleRow) {
      return new Response(JSON.stringify({ error: "Admin access required" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { medicationIds, autoApprove = false } = await req.json() as {
      medicationIds: string[];
      autoApprove?: boolean;
    };

    if (!medicationIds?.length || medicationIds.length > 10) {
      return new Response(JSON.stringify({ error: "Provide 1-10 medication IDs" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Fetch medications
    const { data: medications, error: fetchErr } = await adminClient
      .from("medications")
      .select("id, generic_name, brand_names, drug_class, route, high_alert, controlled_substance, openfda_data, fda_label_data")
      .in("id", medicationIds);

    if (fetchErr || !medications?.length) {
      return new Response(JSON.stringify({ error: "No medications found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const results: Array<{
      id: string;
      name: string;
      success: boolean;
      approved: boolean;
      error?: string;
    }> = [];

    for (const med of medications as MedicationRecord[]) {
      try {
        console.log(`Content Factory: generating for ${med.generic_name}`);

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
              { role: "system", content: COMPREHENSIVE_CONTENT_PROMPT },
              { role: "user", content: context },
            ],
            temperature: 0.2,
          }),
        });

        if (!aiResponse.ok) {
          if (aiResponse.status === 429) {
            results.push({ id: med.id, name: med.generic_name, success: false, approved: false, error: "Rate limited" });
            break;
          }
          throw new Error(`AI error: ${aiResponse.status}`);
        }

        const aiData = await aiResponse.json();
        const content = aiData.choices?.[0]?.message?.content;
        if (!content) throw new Error("No AI content");

        // Parse JSON
        let parsed: Record<string, unknown>;
        try {
          const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
          const jsonStr = jsonMatch ? jsonMatch[1] : content;
          parsed = JSON.parse(jsonStr.trim());
        } catch {
          throw new Error("Failed to parse AI response");
        }

        const nursingGuide = parsed.nursing_guide || {};
        const clinicalDetails = parsed.clinical_details || {};
        const patientEducation = parsed.patient_education || {};
        const safetyInfo = parsed.safety_info || {};

        // Determine if auto-approvable
        const isHighRisk = med.high_alert || med.controlled_substance;
        const shouldAutoApprove = autoApprove && !isHighRisk;

        // Update medication with all content
        const updatePayload: Record<string, unknown> = {
          nursing_guide: nursingGuide,
          patient_education: patientEducation,
          safety_info: safetyInfo,
          ai_generated_content: { 
            factory_generated: true, 
            generated_at: new Date().toISOString(),
            clinical_details: clinicalDetails,
          },
          content_status: shouldAutoApprove ? "approved" : "pending_review",
          last_synced_at: new Date().toISOString(),
        };

        // Map clinical details to their respective columns
        const cd = clinicalDetails as Record<string, unknown>;
        if (cd.pharmacokinetics) updatePayload.pharmacokinetics = cd.pharmacokinetics;
        if (cd.dosing_info) updatePayload.dosing_info = cd.dosing_info;
        if (cd.adverse_reactions) updatePayload.adverse_reactions = cd.adverse_reactions;
        if (cd.drug_interactions) updatePayload.drug_interactions_info = cd.drug_interactions;

        if (shouldAutoApprove) {
          updatePayload.reviewed_by = userId;
          updatePayload.reviewed_at = new Date().toISOString();
          updatePayload.review_notes = "Auto-approved via Content Factory";
        }

        const { error: updateErr } = await adminClient
          .from("medications")
          .update(updatePayload)
          .eq("id", med.id);

        if (updateErr) throw updateErr;

        results.push({
          id: med.id,
          name: med.generic_name,
          success: true,
          approved: shouldAutoApprove,
        });

        console.log(`✓ ${med.generic_name} - ${shouldAutoApprove ? "auto-approved" : "pending review"}`);
        await new Promise(r => setTimeout(r, 500));
      } catch (err) {
        console.error(`Error for ${med.generic_name}:`, err);
        results.push({
          id: med.id,
          name: med.generic_name,
          success: false,
          approved: false,
          error: err instanceof Error ? err.message : "Unknown error",
        });
      }
    }

    const successCount = results.filter(r => r.success).length;
    const approvedCount = results.filter(r => r.approved).length;

    return new Response(JSON.stringify({
      success: true,
      generated: successCount,
      approved: approvedCount,
      pendingReview: successCount - approvedCount,
      failed: results.length - successCount,
      results,
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Content Factory error:", error);
    return new Response(JSON.stringify({
      error: error instanceof Error ? error.message : "Unknown error",
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

function buildContext(med: MedicationRecord): string {
  const parts = [`Medication: ${med.generic_name}`];
  if (med.brand_names?.length) parts.push(`Brand Names: ${med.brand_names.join(", ")}`);
  if (med.drug_class) parts.push(`Drug Class: ${med.drug_class}`);
  if (med.route?.length) parts.push(`Routes: ${med.route.join(", ")}`);
  if (med.high_alert) parts.push("⚠️ HIGH-ALERT MEDICATION");
  if (med.controlled_substance) parts.push("⚠️ CONTROLLED SUBSTANCE");

  // Include FDA data context if available
  if (med.openfda_data) {
    const fda = med.openfda_data as Record<string, unknown>;
    if (fda.warnings) parts.push(`FDA Warnings: ${JSON.stringify(fda.warnings).slice(0, 500)}`);
    if (fda.indications) parts.push(`Indications: ${JSON.stringify(fda.indications).slice(0, 300)}`);
    if (fda.dosage_admin) parts.push(`Dosage: ${JSON.stringify(fda.dosage_admin).slice(0, 300)}`);
  }

  parts.push("\nGenerate comprehensive content for ALL sections: nursing guide, clinical details, patient education, and safety info.");
  return parts.join("\n");
}
