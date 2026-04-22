import { createClient, SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface OpenFDADrug {
  openfda?: {
    brand_name?: string[];
    generic_name?: string[];
    manufacturer_name?: string[];
    product_ndc?: string[];
    route?: string[];
    pharm_class_epc?: string[];
    pharm_class_moa?: string[];
  };
  dosage_form?: string;
  active_ingredients?: Array<{ name: string; strength: string }>;
  warnings?: string[];
  indications_and_usage?: string[];
  dosage_and_administration?: string[];
  contraindications?: string[];
  adverse_reactions?: string[];
  drug_interactions?: string[];
}

interface SyncResult {
  created: number;
  updated: number;
  errors: Array<{ drug: string; error: string }>;
}

// Input validation helpers
function isValidUUID(str: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(str);
}

function sanitizeSearchTerm(term: string): string {
  // Remove potentially dangerous characters, keep alphanumeric and common drug name chars
  return term.replace(/[^a-zA-Z0-9\s\-]/g, '').trim().slice(0, 200);
}

function validateLimit(limit: unknown): number {
  const num = typeof limit === 'number' ? limit : parseInt(String(limit), 10);
  if (isNaN(num) || num < 1) return 100;
  return Math.min(Math.max(num, 1), 500); // Max 500
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY");

    if (!supabaseUrl || !supabaseServiceKey || !supabaseAnonKey) {
      console.error("Missing Supabase environment variables");
      return new Response(JSON.stringify({ error: "Service configuration error" }), {
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

    // Check admin role (admin or super_admin)
    const { data: roleRow } = await adminClient
      .from("user_roles")
      .select("role")
      .eq("user_id", userData.user.id)
      .in("role", ["admin", "super_admin"])
      .maybeSingle();

    if (!roleRow) {
      return new Response(JSON.stringify({ error: "Insufficient permissions" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Parse and validate input
    let body: Record<string, unknown>;
    try {
      body = await req.json();
    } catch {
      return new Response(JSON.stringify({ error: "Invalid request format" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const rawSearchTerm = body.searchTerm;
    const rawLimit = body.limit;
    const rawMedicationId = body.medicationId;

    // Validate inputs
    let searchTerm: string | undefined;
    if (rawSearchTerm !== undefined) {
      if (typeof rawSearchTerm !== 'string') {
        return new Response(JSON.stringify({ error: "Invalid search term format" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      searchTerm = sanitizeSearchTerm(rawSearchTerm);
      if (searchTerm.length === 0) {
        return new Response(JSON.stringify({ error: "Search term cannot be empty" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    let medicationId: string | undefined;
    if (rawMedicationId !== undefined) {
      if (typeof rawMedicationId !== 'string' || !isValidUUID(rawMedicationId)) {
        return new Response(JSON.stringify({ error: "Invalid medication ID format" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      medicationId = rawMedicationId;
    }

    const limit = validateLimit(rawLimit);

    // Create sync log entry
    const { data: syncLog, error: syncLogErr } = await adminClient
      .from("medication_sync_logs")
      .insert({
        sync_type: "openfda",
        initiated_by: userData.user.id,
        status: "running",
      })
      .select()
      .single();

    if (syncLogErr) {
      console.error("Failed to create sync log:", syncLogErr);
    }

    const result: SyncResult = { created: 0, updated: 0, errors: [] };

    try {
      // If medicationId provided, sync single medication
      if (medicationId) {
        const { data: medication } = await adminClient
          .from("medications")
          .select("generic_name")
          .eq("id", medicationId)
          .single();

        if (medication) {
          await syncSingleDrug(adminClient, medication.generic_name, medicationId, result);
        }
      } else if (searchTerm) {
        // Search OpenFDA for drugs matching term
        const openFDAUrl = `https://api.fda.gov/drug/label.json?search=openfda.generic_name:"${encodeURIComponent(searchTerm)}"&limit=${limit}`;
        
        console.log("Fetching from OpenFDA for term:", searchTerm);
        const response = await fetch(openFDAUrl);
        
        if (!response.ok) {
          if (response.status === 404) {
            // No results found
            console.log("No OpenFDA results for:", searchTerm);
          } else {
            console.error("OpenFDA API error:", response.status);
            result.errors.push({ drug: searchTerm, error: "External API unavailable" });
          }
        } else {
          const data = await response.json();
          
          if (data.results && Array.isArray(data.results)) {
            for (const drug of data.results) {
              await processDrugResult(adminClient, drug, result);
            }
          }
        }
      } else {
        // Sync all existing medications that haven't been synced recently
        const { data: medications } = await adminClient
          .from("medications")
          .select("id, generic_name")
          .or("last_synced_at.is.null,last_synced_at.lt." + new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
          .limit(50);

        if (medications) {
          for (const med of medications) {
            await syncSingleDrug(adminClient, med.generic_name, med.id, result);
            // Small delay to avoid rate limiting
            await new Promise(resolve => setTimeout(resolve, 200));
          }
        }
      }

      // Update sync log
      if (syncLog) {
        await adminClient
          .from("medication_sync_logs")
          .update({
            status: "completed",
            completed_at: new Date().toISOString(),
            medications_created: result.created,
            medications_updated: result.updated,
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

    } catch (syncError) {
      console.error("Sync processing error:", syncError);
      // Update sync log with failure
      if (syncLog) {
        await adminClient
          .from("medication_sync_logs")
          .update({
            status: "failed",
            completed_at: new Date().toISOString(),
            errors: [{ error: "Sync processing failed" }],
          })
          .eq("id", syncLog.id);
      }
      return new Response(JSON.stringify({ error: "Sync processing failed" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

  } catch (error) {
    console.error("sync-openfda error:", error);
    return new Response(JSON.stringify({ error: "An error occurred processing your request" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

async function syncSingleDrug(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  client: SupabaseClient<any, any, any>,
  genericName: string,
  medicationId: string,
  result: SyncResult
) {
  try {
    const openFDAUrl = `https://api.fda.gov/drug/label.json?search=openfda.generic_name:"${encodeURIComponent(genericName)}"&limit=1`;
    const response = await fetch(openFDAUrl);
    
    if (!response.ok) {
      if (response.status !== 404) {
        result.errors.push({ drug: genericName, error: "External API unavailable" });
      }
      return;
    }
    
    const data = await response.json();
    if (data.results && data.results.length > 0) {
      const drug = data.results[0];
      const openfdaData = extractOpenFDAData(drug);
      
      const updateData: Record<string, unknown> = {
        openfda_data: openfdaData,
        last_synced_at: new Date().toISOString(),
        sync_source: "openfda",
      };

      // Only update fields if they have values
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
        .eq("id", medicationId);

      if (error) {
        console.error("Database update error:", error);
        result.errors.push({ drug: genericName, error: "Failed to update record" });
      } else {
        result.updated++;
      }
    }
  } catch (e) {
    console.error("syncSingleDrug error:", e);
    result.errors.push({ drug: genericName, error: "Processing failed" });
  }
}

async function processDrugResult(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  client: SupabaseClient<any, any, any>,
  drug: OpenFDADrug,
  result: SyncResult
) {
  const genericName = drug.openfda?.generic_name?.[0];
  if (!genericName) return;

  const openfdaData = extractOpenFDAData(drug);

  // Check if medication exists
  const { data: existing } = await client
    .from("medications")
    .select("id")
    .ilike("generic_name", genericName)
    .maybeSingle();

  if (existing) {
    // Update existing
    const { error } = await client
      .from("medications")
      .update({
        openfda_data: openfdaData,
        last_synced_at: new Date().toISOString(),
        sync_source: "openfda",
        brand_names: openfdaData.brand_names || [],
        route: openfdaData.route || [],
        drug_class: openfdaData.drug_class || null,
        manufacturer: openfdaData.manufacturer || null,
        dosage_form: openfdaData.dosage_form || null,
        ndc_code: openfdaData.ndc_code || null,
      })
      .eq("id", existing.id);

    if (error) {
      console.error("Database update error:", error);
      result.errors.push({ drug: genericName, error: "Failed to update record" });
    } else {
      result.updated++;
    }
  } else {
    // Create new
    const { error } = await client
      .from("medications")
      .insert({
        generic_name: genericName,
        brand_names: openfdaData.brand_names || [],
        route: openfdaData.route || [],
        drug_class: openfdaData.drug_class || null,
        manufacturer: openfdaData.manufacturer || null,
        dosage_form: openfdaData.dosage_form || null,
        ndc_code: openfdaData.ndc_code || null,
        openfda_data: openfdaData,
        last_synced_at: new Date().toISOString(),
        sync_source: "openfda",
        content_status: "draft",
      });

    if (error) {
      console.error("Database insert error:", error);
      result.errors.push({ drug: genericName, error: "Failed to create record" });
    } else {
      result.created++;
    }
  }
}

function extractOpenFDAData(drug: OpenFDADrug) {
  return {
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
}
