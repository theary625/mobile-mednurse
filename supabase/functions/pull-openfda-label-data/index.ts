const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

interface OpenFDAResult {
  set_id?: string;
  dosage_and_administration?: string[];
  contraindications?: string[];
  warnings_and_cautions?: string[];
  warnings?: string[];
  boxed_warning?: string[];
  adverse_reactions?: string[];
  drug_interactions?: string[];
  clinical_pharmacology?: string[];
  pregnancy?: string[];
  nursing_mothers?: string[];
  pediatric_use?: string[];
  geriatric_use?: string[];
  openfda?: {
    brand_name?: string[];
    generic_name?: string[];
    manufacturer_name?: string[];
    substance_name?: string[];
  };
}

async function searchOpenFDA(query: string): Promise<OpenFDAResult | null> {
  const encodedQuery = encodeURIComponent(query);
  const url = `https://api.fda.gov/drug/label.json?search=${encodedQuery}&limit=1`;
  
  console.log('Fetching OpenFDA:', url);
  const resp = await fetch(url, {
    headers: { 'User-Agent': 'MedNurse-DataSync/1.0' },
  });

  if (!resp.ok) {
    if (resp.status === 404) return null;
    throw new Error(`OpenFDA API error: ${resp.status}`);
  }

  const json = await resp.json();
  return json?.results?.[0] ?? null;
}

async function findLabelForMedication(genericName: string, brandNames: string[] | null): Promise<OpenFDAResult | null> {
  // Strategy 1: exact generic name
  let result = await searchOpenFDA(`openfda.generic_name:"${genericName}"`);
  if (result) return result;

  // Strategy 2: substance name
  result = await searchOpenFDA(`openfda.substance_name:"${genericName}"`);
  if (result) return result;

  // Strategy 3: brand name (if available)
  if (brandNames && brandNames.length > 0) {
    result = await searchOpenFDA(`openfda.brand_name:"${brandNames[0]}"`);
    if (result) return result;
  }

  // Strategy 4: For combination drugs, try first component
  if (genericName.includes('/')) {
    const firstComponent = genericName.split('/')[0].trim();
    result = await searchOpenFDA(`openfda.generic_name:"${firstComponent}"`);
    if (result) return result;
  }

  // Strategy 5: free-text search
  result = await searchOpenFDA(genericName);
  return result;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { medicationId } = await req.json();

    if (!medicationId) {
      return new Response(
        JSON.stringify({ success: false, error: 'medicationId is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Fetch medication from DB
    const { data: med, error: fetchError } = await supabase
      .from('medications')
      .select('id, generic_name, brand_names')
      .eq('id', medicationId)
      .single();

    if (fetchError || !med) {
      return new Response(
        JSON.stringify({ success: false, error: 'Medication not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Searching OpenFDA for: ${med.generic_name}`);

    const labelResult = await findLabelForMedication(med.generic_name, med.brand_names);

    if (!labelResult) {
      return new Response(
        JSON.stringify({ success: false, error: `No FDA label found for "${med.generic_name}"`, not_found: true }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Map OpenFDA fields to DB columns
    const fieldsPopulated: string[] = [];
    const updatePayload: Record<string, unknown> = {
      last_synced_at: new Date().toISOString(),
      sync_source: 'openfda',
      openfda_data: labelResult,
    };

    // dosing_info
    const dosingText = labelResult.dosage_and_administration?.[0];
    if (dosingText) {
      updatePayload.dosing_info = { standard_dose: dosingText, source: 'openfda' };
      fieldsPopulated.push('dosing_info');
    }

    // safety_info
    const contraindications = labelResult.contraindications?.[0] || '';
    const warnings = labelResult.warnings_and_cautions?.[0] || labelResult.warnings?.[0] || '';
    const boxedWarning = labelResult.boxed_warning?.[0] || '';
    if (contraindications || warnings || boxedWarning) {
      updatePayload.safety_info = {
        contraindications,
        precautions: warnings,
        boxed_warning: boxedWarning,
        source: 'openfda',
      };
      fieldsPopulated.push('safety_info');
      if (boxedWarning) {
        updatePayload.high_alert = true;
        fieldsPopulated.push('high_alert');
      }
    }

    // pharmacokinetics
    const pkText = labelResult.clinical_pharmacology?.[0];
    if (pkText) {
      updatePayload.pharmacokinetics = { raw_text: pkText, source: 'openfda' };
      fieldsPopulated.push('pharmacokinetics');
    }

    // adverse_reactions
    const arText = labelResult.adverse_reactions?.[0];
    if (arText) {
      updatePayload.adverse_reactions = { common: arText, source: 'openfda' };
      fieldsPopulated.push('adverse_reactions');
    }

    // drug_interactions_info
    const diText = labelResult.drug_interactions?.[0];
    if (diText) {
      updatePayload.drug_interactions_info = { raw_text: diText, source: 'openfda' };
      fieldsPopulated.push('drug_interactions_info');
    }

    // fda_set_id and fda_label_url
    if (labelResult.set_id) {
      updatePayload.fda_set_id = labelResult.set_id;
      updatePayload.fda_label_url = `https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=${labelResult.set_id}`;
      fieldsPopulated.push('fda_set_id', 'fda_label_url');
    }

    // brand_names (only if currently empty)
    const openfdaBrands = labelResult.openfda?.brand_name;
    if (openfdaBrands && openfdaBrands.length > 0 && (!med.brand_names || med.brand_names.length === 0)) {
      updatePayload.brand_names = openfdaBrands;
      fieldsPopulated.push('brand_names');
    }

    // Special populations (store in nursing_guide if we have them)
    const specialPops = {
      pregnancy: labelResult.pregnancy?.[0] || null,
      nursing_mothers: labelResult.nursing_mothers?.[0] || null,
      pediatric_use: labelResult.pediatric_use?.[0] || null,
      geriatric_use: labelResult.geriatric_use?.[0] || null,
    };
    if (Object.values(specialPops).some(Boolean)) {
      updatePayload.patient_education = { special_populations: specialPops, source: 'openfda' };
      fieldsPopulated.push('patient_education');
    }

    // Save to DB
    const { error: updateError } = await supabase
      .from('medications')
      .update(updatePayload)
      .eq('id', medicationId);

    if (updateError) {
      console.error('DB update error:', updateError);
      return new Response(
        JSON.stringify({ success: false, error: updateError.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`✓ ${med.generic_name}: populated ${fieldsPopulated.length} fields`);

    return new Response(
      JSON.stringify({
        success: true,
        medication: med.generic_name,
        fields_populated: fieldsPopulated,
        set_id: labelResult.set_id,
        brand_names_found: labelResult.openfda?.brand_name,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('pull-openfda-label-data error:', error);
    return new Response(
      JSON.stringify({ success: false, error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
