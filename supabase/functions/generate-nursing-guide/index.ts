import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const NURSING_GUIDE_PROMPT = `You are a clinical pharmacist and nursing educator creating evidence-based medication administration guides. Generate a comprehensive nursing guide for safe medication administration.

IMPORTANT: For IV medications, generate SEPARATE entries for each applicable administration method (IV_Push, IV_Infusion, IV_Piggyback). Each method has unique safety considerations.

For the medication provided, create a detailed nursing guide following this exact JSON structure:

{
  "IV_Push": {
    "appropriateness": {
      "indication_check": "When IV push is appropriate",
      "hold_conditions": ["Conditions to hold IV push"],
      "required_labs": ["Labs needed before push dosing"]
    },
    "special_prep": {
      "reconstitution": "How to reconstitute",
      "dilution": "Dilution for push",
      "stability": "Stability after prep"
    },
    "administration": {
      "rate": "Push rate (e.g., over 2-5 minutes)",
      "flush_before": "Pre-flush requirements",
      "flush_after": "Post-flush requirements",
      "max_rate": "Maximum push rate - NEVER exceed"
    },
    "post_admin": {
      "monitor_for": ["What to watch for after push"],
      "reassess_at": "When to reassess"
    },
    "patient_teaching": {
      "what_to_tell_patient": "What patient should expect",
      "report_immediately": ["Warning signs to report"]
    }
  },
  "IV_Infusion": {
    "appropriateness": {
      "indication_check": "When continuous infusion is appropriate",
      "hold_conditions": ["Conditions to hold infusion"],
      "required_labs": ["Labs needed"]
    },
    "special_prep": {
      "concentration_options": [
        {"name": "Standard", "mix": "X units in Y mL", "final_concentration": "Z units/mL", "use_case": "When to use"}
      ],
      "line_requirements": {
        "preferred": "Central line recommended",
        "peripheral_acceptable": "If peripheral OK, conditions"
      }
    },
    "administration": {
      "rate_info": {
        "adult_initial": "Starting rate",
        "adult_titration": "How to titrate",
        "adult_usual_range": "Typical range"
      },
      "titration_goal": "Target parameter",
      "max_rate": {"threshold": "Maximum rate", "guidance": "What to do at max"},
      "pump_requirement": "Pump type required"
    },
    "weaning": {
      "criteria": ["When ready to wean"],
      "method": "How to wean",
      "caution": "Weaning precautions"
    },
    "post_admin": {
      "monitor_for": ["Monitoring parameters"],
      "reassess_at": ["Reassessment intervals"]
    },
    "patient_teaching": {
      "what_to_tell_patient": "What patient should expect",
      "report_immediately": ["Warning signs"]
    }
  },
  "PO": {
    "appropriateness": {...},
    "administration": {...},
    "post_admin": {...},
    "patient_teaching": {...}
  }
}

Include only the routes applicable to the medication. Be specific, practical, and evidence-based. Focus on bedside safety.`;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY");
    const lovableApiKey = Deno.env.get("LOVABLE_API_KEY");

    if (!supabaseUrl || !supabaseServiceKey || !supabaseAnonKey) {
      throw new Error("Missing Supabase environment variables");
    }

    if (!lovableApiKey) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Verify admin access
    const authHeader = req.headers.get("Authorization") || "";
    const jwt = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;
    
    if (!jwt) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const authedClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: `Bearer ${jwt}` } },
    });

    const { data: userData, error: userErr } = await authedClient.auth.getUser();
    if (userErr || !userData?.user) {
      return new Response(JSON.stringify({ error: "Invalid auth" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const adminClient = createClient(supabaseUrl, supabaseServiceKey);

    // Check admin role
    const { data: roleRow } = await adminClient
      .from("user_roles")
      .select("role")
      .eq("user_id", userData.user.id)
      .in("role", ["admin", "super_admin"])
      .maybeSingle();

    if (!roleRow) {
      return new Response(JSON.stringify({ error: "Admin access required" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = await req.json();
    const { medicationId, route } = body;

    if (!medicationId) {
      return new Response(JSON.stringify({ error: "medicationId is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Get medication details
    const { data: medication, error: medErr } = await adminClient
      .from("medications")
      .select("*")
      .eq("id", medicationId)
      .single();

    if (medErr || !medication) {
      return new Response(JSON.stringify({ error: "Medication not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Create sync log
    const { data: syncLog } = await adminClient
      .from("medication_sync_logs")
      .insert({
        sync_type: "ai_nursing_guide",
        initiated_by: userData.user.id,
        status: "running",
      })
      .select()
      .single();

    try {
      // Build context from existing data
      const context = buildMedicationContext(medication, route);

      // Call Lovable AI
      const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${lovableApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [
            { role: "system", content: NURSING_GUIDE_PROMPT },
            { role: "user", content: context },
          ],
          temperature: 0.3,
        }),
      });

      if (!aiResponse.ok) {
        if (aiResponse.status === 429) {
          throw new Error("Rate limit exceeded. Please try again later.");
        }
        if (aiResponse.status === 402) {
          throw new Error("AI credits exhausted. Please add credits to continue.");
        }
        throw new Error(`AI API error: ${aiResponse.status}`);
      }

      const aiData = await aiResponse.json();
      const content = aiData.choices?.[0]?.message?.content;

      if (!content) {
        throw new Error("No content generated from AI");
      }

      // Parse the JSON from the response
      let nursingGuide;
      try {
        // Extract JSON from markdown code blocks if present
        const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
        const jsonStr = jsonMatch ? jsonMatch[1] : content;
        nursingGuide = JSON.parse(jsonStr.trim());
      } catch (parseErr) {
        console.error("Failed to parse AI response:", content);
        throw new Error("Failed to parse AI-generated guide");
      }

      // Store AI-generated content (pending review)
      const routeKey = route || "general";
      const currentGuide = (medication.nursing_guide as Record<string, unknown>) || {};
      const currentAiContent = (medication.ai_generated_content as Record<string, unknown>) || {};

      // Store in ai_generated_content for review
      const updatedAiContent = {
        ...currentAiContent,
        [routeKey]: {
          guide: nursingGuide,
          generated_at: new Date().toISOString(),
          generated_by: userData.user.id,
        },
      };

      const { error: updateErr } = await adminClient
        .from("medications")
        .update({
          ai_generated_content: updatedAiContent,
          content_status: medication.content_status === "approved" ? "approved" : "pending_review",
        })
        .eq("id", medicationId);

      if (updateErr) {
        throw updateErr;
      }

      // Update sync log
      if (syncLog) {
        await adminClient
          .from("medication_sync_logs")
          .update({
            status: "completed",
            completed_at: new Date().toISOString(),
            medications_updated: 1,
          })
          .eq("id", syncLog.id);
      }

      return new Response(JSON.stringify({
        success: true,
        nursingGuide,
        route: routeKey,
        message: "Nursing guide generated and saved for review",
      }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });

    } catch (genError) {
      // Update sync log with failure
      if (syncLog) {
        await adminClient
          .from("medication_sync_logs")
          .update({
            status: "failed",
            completed_at: new Date().toISOString(),
            errors: [{ error: genError instanceof Error ? genError.message : "Unknown error" }],
          })
          .eq("id", syncLog.id);
      }
      throw genError;
    }

  } catch (error) {
    console.error("generate-nursing-guide error:", error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : "Unknown error" 
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

function buildMedicationContext(medication: Record<string, unknown>, route?: string): string {
  const parts: string[] = [];

  parts.push(`Medication: ${medication.generic_name}`);
  
  if (medication.brand_names && Array.isArray(medication.brand_names)) {
    parts.push(`Brand Names: ${(medication.brand_names as string[]).join(", ")}`);
  }
  
  if (medication.drug_class) {
    parts.push(`Drug Class: ${medication.drug_class}`);
  }
  
  if (route) {
    parts.push(`Route: ${route}`);
  } else if (medication.route && Array.isArray(medication.route)) {
    parts.push(`Routes: ${(medication.route as string[]).join(", ")}`);
  }

  if (medication.high_alert) {
    parts.push("⚠️ HIGH-ALERT MEDICATION");
  }

  if (medication.controlled_substance) {
    parts.push("⚠️ CONTROLLED SUBSTANCE");
  }

  // Include OpenFDA data if available
  const openfdaData = medication.openfda_data as Record<string, unknown> | null;
  if (openfdaData) {
    if (openfdaData.indications && Array.isArray(openfdaData.indications)) {
      parts.push(`Indications: ${(openfdaData.indications as string[]).slice(0, 2).join("; ").slice(0, 500)}...`);
    }
    if (openfdaData.warnings && Array.isArray(openfdaData.warnings)) {
      parts.push(`Key Warnings: ${(openfdaData.warnings as string[]).slice(0, 2).join("; ").slice(0, 500)}...`);
    }
    if (openfdaData.dosage_admin && Array.isArray(openfdaData.dosage_admin)) {
      parts.push(`Dosage Info: ${(openfdaData.dosage_admin as string[]).slice(0, 1).join("; ").slice(0, 500)}...`);
    }
  }

  // Include existing safety info
  if (medication.safety_info) {
    parts.push(`Existing Safety Info: ${JSON.stringify(medication.safety_info).slice(0, 300)}...`);
  }

  parts.push("\nGenerate a comprehensive, evidence-based nursing administration guide for this medication.");

  return parts.join("\n");
}
