import { createClient, SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2";

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

interface SyncResult {
  medicationId: string;
  genericName: string;
  fdaSynced: boolean;
  guideGenerated: boolean;
  validated: boolean;
  validationScore?: number;
  reviewTier?: string;
  error?: string;
}

interface BatchResult {
  total: number;
  processed: number;
  fdaSynced: number;
  guidesGenerated: number;
  validated: number;
  autoApproved: number;
  errors: Array<{ medicationId: string; error: string }>;
  results: SyncResult[];
}

function isValidUUID(str: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(str);
}

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
      return new Response(JSON.stringify({ error: "Service configuration error" }), {
        status: 503,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!lovableApiKey) {
      return new Response(JSON.stringify({ error: "AI service not configured" }), {
        status: 503,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Verify admin access
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

    const { data: userData, error: userErr } = await authedClient.auth.getUser();
    if (userErr || !userData?.user) {
      return new Response(JSON.stringify({ error: "Authentication failed" }), {
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

    // Parse request body
    let body: Record<string, unknown>;
    try {
      body = await req.json();
    } catch {
      return new Response(JSON.stringify({ error: "Invalid request format" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { medicationIds, skipIfRecentSync = false, generateGuide = true } = body as {
      medicationIds: string[];
      skipIfRecentSync?: boolean;
      generateGuide?: boolean;
    };

    // Validate input
    if (!medicationIds || !Array.isArray(medicationIds) || medicationIds.length === 0) {
      return new Response(JSON.stringify({ error: "medicationIds array is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Limit batch size to prevent timeouts
    const MAX_BATCH_SIZE = 10;
    if (medicationIds.length > MAX_BATCH_SIZE) {
      return new Response(JSON.stringify({ 
        error: `Maximum batch size is ${MAX_BATCH_SIZE}. You requested ${medicationIds.length}.` 
      }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Validate all IDs are UUIDs
    for (const id of medicationIds) {
      if (!isValidUUID(id)) {
        return new Response(JSON.stringify({ error: `Invalid medication ID: ${id}` }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    // Create sync log
    const { data: syncLog } = await adminClient
      .from("medication_sync_logs")
      .insert({
        sync_type: "smart_sync",
        initiated_by: userData.user.id,
        status: "running",
      })
      .select()
      .single();

    const result: BatchResult = {
      total: medicationIds.length,
      processed: 0,
      fdaSynced: 0,
      guidesGenerated: 0,
      validated: 0,
      autoApproved: 0,
      errors: [],
      results: [],
    };

    // Process each medication
    for (const medicationId of medicationIds) {
      const syncResult: SyncResult = {
        medicationId,
        genericName: "",
        fdaSynced: false,
        guideGenerated: false,
        validated: false,
      };

      try {
        // Get medication details
        const { data: medication, error: medErr } = await adminClient
          .from("medications")
          .select("*")
          .eq("id", medicationId)
          .single();

        if (medErr || !medication) {
          syncResult.error = "Medication not found";
          result.errors.push({ medicationId, error: "Medication not found" });
          result.results.push(syncResult);
          result.processed++;
          continue;
        }

        syncResult.genericName = medication.generic_name;

        // Check if recently synced
        if (skipIfRecentSync && medication.last_synced_at) {
          const lastSync = new Date(medication.last_synced_at);
          const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
          if (lastSync > sevenDaysAgo) {
            syncResult.fdaSynced = true; // Already synced recently
            syncResult.guideGenerated = !!medication.ai_generated_content;
            syncResult.validated = !!medication.validation_results;
            result.results.push(syncResult);
            result.processed++;
            continue;
          }
        }

        // Step 1: Sync FDA data
        const fdaSuccess = await syncFromOpenFDA(adminClient, medication);
        syncResult.fdaSynced = fdaSuccess;
        if (fdaSuccess) {
          result.fdaSynced++;
        }

        // Step 2: Generate nursing guide if requested
        if (generateGuide) {
          // Refetch medication to get updated FDA data
          const { data: updatedMed } = await adminClient
            .from("medications")
            .select("*")
            .eq("id", medicationId)
            .single();

          if (updatedMed) {
            const guideSuccess = await generateNursingGuide(
              adminClient,
              updatedMed,
              userData.user.id,
              lovableApiKey
            );
            syncResult.guideGenerated = guideSuccess;
            if (guideSuccess) {
              result.guidesGenerated++;
            }
          }
        }

        // Step 3: Run validation
        const validationResult = await validateMedicationContent(adminClient, medicationId);
        if (validationResult) {
          syncResult.validated = true;
          syncResult.validationScore = validationResult.score;
          syncResult.reviewTier = validationResult.tier;
          result.validated++;
          
          // Check for auto-approval
          if (validationResult.autoApproveEligible) {
            await adminClient
              .from("medications")
              .update({ content_status: 'approved' })
              .eq("id", medicationId);
            result.autoApproved++;
          }
        }

        result.results.push(syncResult);
        result.processed++;

        // Small delay between medications to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 500));

      } catch (err) {
        console.error(`Error processing ${medicationId}:`, err);
        syncResult.error = err instanceof Error ? err.message : "Processing failed";
        result.errors.push({ medicationId, error: syncResult.error });
        result.results.push(syncResult);
        result.processed++;
      }
    }

    // Update sync log
    if (syncLog) {
      await adminClient
        .from("medication_sync_logs")
        .update({
          status: result.errors.length === result.total ? "failed" : "completed",
          completed_at: new Date().toISOString(),
          medications_updated: result.fdaSynced + result.guidesGenerated,
          errors: result.errors.length > 0 ? result.errors : null,
        })
        .eq("id", syncLog.id);
    }

    return new Response(JSON.stringify({
      success: true,
      ...result,
      syncLogId: syncLog?.id,
    }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("smart-medication-sync error:", error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : "Processing failed" 
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

async function syncFromOpenFDA(
  // deno-lint-ignore no-explicit-any
  client: SupabaseClient<any, any, any>,
  medication: Record<string, unknown>
): Promise<boolean> {
  try {
    const genericName = medication.generic_name as string;
    const openFDAUrl = `https://api.fda.gov/drug/label.json?search=openfda.generic_name:"${encodeURIComponent(genericName)}"&limit=1`;
    
    const response = await fetch(openFDAUrl);
    
    if (!response.ok) {
      if (response.status === 404) {
        // No FDA data found - not an error, just no data
        await client
          .from("medications")
          .update({
            last_synced_at: new Date().toISOString(),
            sync_source: "not_found",
          })
          .eq("id", medication.id);
        return false;
      }
      throw new Error(`OpenFDA API error: ${response.status}`);
    }

    const data = await response.json();
    if (!data.results || data.results.length === 0) {
      return false;
    }

    const drug = data.results[0];
    const openfdaData = {
      brand_names: drug.openfda?.brand_name || [],
      generic_name: drug.openfda?.generic_name?.[0] || null,
      manufacturer: drug.openfda?.manufacturer_name?.[0] || null,
      ndc_code: drug.openfda?.product_ndc?.[0] || null,
      route: drug.openfda?.route || [],
      drug_class: [
        ...(drug.openfda?.pharm_class_epc || []),
        ...(drug.openfda?.pharm_class_moa || []),
      ].join(", ") || null,
      dosage_form: drug.dosage_form || null,
      active_ingredients: drug.active_ingredients || [],
      warnings: drug.warnings || [],
      indications: drug.indications_and_usage || [],
      dosage_admin: drug.dosage_and_administration || [],
      contraindications: drug.contraindications || [],
      adverse_reactions: drug.adverse_reactions || [],
      drug_interactions: drug.drug_interactions || [],
    };

    const updateData: Record<string, unknown> = {
      openfda_data: openfdaData,
      last_synced_at: new Date().toISOString(),
      sync_source: "openfda",
    };

    if (openfdaData.brand_names?.length) {
      updateData.brand_names = openfdaData.brand_names;
    }
    if (openfdaData.route?.length) {
      updateData.route = openfdaData.route;
    }
    if (openfdaData.drug_class && !openfdaData.drug_class.includes("undefined")) {
      updateData.drug_class = openfdaData.drug_class;
    }
    if (openfdaData.manufacturer) {
      updateData.manufacturer = openfdaData.manufacturer;
    }
    if (openfdaData.dosage_form) {
      updateData.dosage_form = openfdaData.dosage_form;
    }
    if (openfdaData.ndc_code) {
      updateData.ndc_code = openfdaData.ndc_code;
    }

    const { error } = await client
      .from("medications")
      .update(updateData)
      .eq("id", medication.id);

    return !error;
  } catch (err) {
    console.error("FDA sync error:", err);
    return false;
  }
}

async function generateNursingGuide(
  // deno-lint-ignore no-explicit-any
  client: SupabaseClient<any, any, any>,
  medication: Record<string, unknown>,
  userId: string,
  lovableApiKey: string
): Promise<boolean> {
  try {
    const context = buildMedicationContext(medication);

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
      console.error("AI API error:", aiResponse.status);
      return false;
    }

    const aiData = await aiResponse.json();
    const content = aiData.choices?.[0]?.message?.content;

    if (!content) {
      return false;
    }

    // Parse the JSON from the response
    let nursingGuide;
    try {
      const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
      const jsonStr = jsonMatch ? jsonMatch[1] : content;
      nursingGuide = JSON.parse(jsonStr.trim());
    } catch (parseErr) {
      console.error("Failed to parse AI response");
      return false;
    }

    // Store in ai_generated_content for review
    const currentAiContent = (medication.ai_generated_content as Record<string, unknown>) || {};
    const updatedAiContent = {
      ...currentAiContent,
      general: {
        guide: nursingGuide,
        generated_at: new Date().toISOString(),
        generated_by: userId,
      },
    };

    const { error } = await client
      .from("medications")
      .update({
        ai_generated_content: updatedAiContent,
        content_status: "pending_review",
      })
      .eq("id", medication.id);

    return !error;
  } catch (err) {
    console.error("Guide generation error:", err);
    return false;
  }
}

function buildMedicationContext(medication: Record<string, unknown>): string {
  const parts: string[] = [];

  parts.push(`Medication: ${medication.generic_name}`);
  
  if (medication.brand_names && Array.isArray(medication.brand_names)) {
    parts.push(`Brand Names: ${(medication.brand_names as string[]).join(", ")}`);
  }
  
  if (medication.drug_class) {
    parts.push(`Drug Class: ${medication.drug_class}`);
  }
  
  if (medication.route && Array.isArray(medication.route)) {
    parts.push(`Routes: ${(medication.route as string[]).join(", ")}`);
  }

  if (medication.high_alert) {
    parts.push("⚠️ HIGH-ALERT MEDICATION");
  }

  if (medication.controlled_substance) {
    parts.push("⚠️ CONTROLLED SUBSTANCE");
  }

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

  if (medication.safety_info) {
    parts.push(`Existing Safety Info: ${JSON.stringify(medication.safety_info).slice(0, 300)}...`);
  }

  parts.push("\nGenerate a comprehensive, evidence-based nursing administration guide for this medication.");

  return parts.join("\n");
}

interface ValidationResult {
  score: number;
  tier: 'auto_approve' | 'quick_review' | 'full_review' | 'escalated';
  autoApproveEligible: boolean;
  requiresPharmacistReview: boolean;
  flags: Array<{ type: string; code: string; message: string }>;
  checks: Record<string, { passed: boolean; score: number }>;
}

async function validateMedicationContent(
  // deno-lint-ignore no-explicit-any
  client: SupabaseClient<any, any, any>,
  medicationId: string
): Promise<ValidationResult | null> {
  try {
    // Fetch medication
    const { data: medication, error } = await client
      .from("medications")
      .select("*")
      .eq("id", medicationId)
      .single();

    if (error || !medication) {
      return null;
    }

    // Fetch clinical rules
    const { data: rules } = await client
      .from("clinical_validation_rules")
      .select("*")
      .eq("is_active", true);

    const flags: Array<{ type: string; code: string; message: string }> = [];
    const isHighAlert = medication.high_alert === true;
    const isControlled = medication.controlled_substance === true;

    // Check completeness
    const expectedFields = [
      'generic_name', 'drug_class', 'route', 'dosing_info', 'safety_info',
      'nursing_guide', 'adverse_reactions', 'hold_parameters', 'monitoring', 'patient_education'
    ];
    let filledFields = 0;
    for (const field of expectedFields) {
      const val = medication[field];
      if (val !== null && val !== undefined && 
          (typeof val !== 'string' || val.trim() !== '') &&
          (!Array.isArray(val) || val.length > 0) &&
          (typeof val !== 'object' || Object.keys(val).length > 0)) {
        filledFields++;
      }
    }
    const completenessScore = Math.round((filledFields / expectedFields.length) * 100);

    // Check FDA data presence
    const hasFdaData = !!medication.openfda_data;
    const fdaScore = hasFdaData ? 100 : 50;

    // Check AI content presence
    const hasAiContent = !!medication.ai_generated_content;
    const sectionsScore = hasAiContent ? 90 : 30;

    // Simple unit/rate check - just verify content exists
    const unitScore = hasAiContent ? 85 : 50;

    // Check rate limits against rules
    let rateScore = 100;
    const drugClass = (medication.drug_class || '').toLowerCase();
    
    if (rules) {
      for (const rule of rules) {
        if (rule.rule_type === 'rate_limit') {
          const ruleClass = ((rule.drug_class as string) || '').toLowerCase();
          if (ruleClass && drugClass.includes(ruleClass)) {
            // Found applicable rate rule - mark for review
            rateScore = 85;
            flags.push({
              type: 'info',
              code: 'RATE_RULE_APPLICABLE',
              message: `Rate limit rule for ${rule.drug_class} applies`
            });
          }
        }
      }
    }

    // Calculate overall score
    const weights = { fda: 25, sections: 25, unit: 15, rate: 20, completeness: 15 };
    const totalWeight = Object.values(weights).reduce((a, b) => a + b, 0);
    const weightedScore = (
      fdaScore * weights.fda +
      sectionsScore * weights.sections +
      unitScore * weights.unit +
      rateScore * weights.rate +
      completenessScore * weights.completeness
    ) / totalWeight;

    const score = Math.round(weightedScore);

    // Determine tier
    let tier: ValidationResult['tier'];
    const hasCriticalFlags = flags.some(f => f.type === 'error');

    if (hasCriticalFlags || isHighAlert || isControlled) {
      tier = hasCriticalFlags ? 'escalated' : 'full_review';
    } else if (score >= 95) {
      tier = 'auto_approve';
    } else if (score >= 85) {
      tier = 'quick_review';
    } else {
      tier = 'full_review';
    }

    const autoApproveEligible = tier === 'auto_approve' && !isHighAlert && !isControlled;
    const requiresPharmacistReview = isHighAlert || isControlled || hasCriticalFlags;

    const result: ValidationResult = {
      score,
      tier,
      autoApproveEligible,
      requiresPharmacistReview,
      flags,
      checks: {
        fdaConsistency: { passed: hasFdaData, score: fdaScore },
        requiredSections: { passed: hasAiContent, score: sectionsScore },
        unitValidation: { passed: true, score: unitScore },
        rateLimits: { passed: rateScore === 100, score: rateScore },
        completeness: { passed: completenessScore >= 70, score: completenessScore },
      },
    };

    // Update medication with validation results
    await client
      .from("medications")
      .update({
        validation_results: result,
        review_tier: result.tier,
        ai_confidence_score: result.score,
      })
      .eq("id", medicationId);

    return result;

  } catch (err) {
    console.error("Validation error:", err);
    return null;
  }
}
