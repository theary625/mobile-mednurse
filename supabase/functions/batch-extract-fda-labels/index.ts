const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// All 18 completeness-tracked fields
const ALL_FIELDS = [
  'dosing_info', 'safety_info', 'pharmacokinetics', 'adverse_reactions', 'drug_interactions_info',
  'adjustments', 'administration_info', 'monitoring', 'hold_parameters', 'red_flags',
  'expected_effect', 'documentation_reminders', 'pause_triggers', 'timing_rules',
  'safe_method', 'rate_dilution', 'line_compatibility', 'required_resources',
  'patient_education', 'dosage_form', 'strengths', 'manufacturer',
];

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { batchSize = 5, offset = 0, onlyFullyMissing = true } = await req.json();

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Find medications with FDA label URLs but missing structured data
    let query = supabase
      .from('medications')
      .select('id, generic_name, brand_names, fda_label_url')
      .not('fda_label_url', 'is', null)
      .neq('fda_label_url', '')
      .neq('content_status', 'extraction_failed');

    if (onlyFullyMissing) {
      // All key fields are null
      for (const field of ALL_FIELDS) {
        query = query.is(field, null);
      }
    } else {
      // At least one field is null (use OR filter)
      const orFilter = ALL_FIELDS.map(f => `${f}.is.null`).join(',');
      query = query.or(orFilter);
    }

    const { data: medications, error: fetchError } = await query
      .order('generic_name')
      .range(offset, offset + batchSize - 1);

    if (fetchError) {
      console.error('Fetch error:', fetchError);
      return new Response(
        JSON.stringify({ success: false, error: 'Failed to fetch medications' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!medications || medications.length === 0) {
      return new Response(
        JSON.stringify({ success: true, message: 'No more medications to process', results: [], totalProcessed: 0, remaining: 0 }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get total count for progress
    let countQuery = supabase
      .from('medications')
      .select('id', { count: 'exact', head: true })
      .not('fda_label_url', 'is', null)
      .neq('fda_label_url', '')
      .neq('content_status', 'extraction_failed');

    if (onlyFullyMissing) {
      for (const field of ALL_FIELDS) {
        countQuery = countQuery.is(field, null);
      }
    } else {
      const orFilter = ALL_FIELDS.map(f => `${f}.is.null`).join(',');
      countQuery = countQuery.or(orFilter);
    }

    const { count: totalRemaining } = await countQuery;

    // Process each medication by calling the existing extract-fda-label function
    const results: Array<{ id: string; name: string; success: boolean; error?: string; fields?: string[] }> = [];

    for (const med of medications) {
      try {
        console.log(`Processing: ${med.generic_name} (${med.id})`);

        const extractUrl = `${supabaseUrl}/functions/v1/extract-fda-label`;
        const extractResponse = await fetch(extractUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${supabaseServiceKey}`,
          },
          body: JSON.stringify({ medicationId: med.id }),
        });

        const extractData = await extractResponse.json();

        if (extractResponse.ok && extractData.success) {
          results.push({
            id: med.id,
            name: med.generic_name,
            success: true,
            fields: extractData.fields_populated,
          });
          console.log(`✓ ${med.generic_name}: ${(extractData.fields_populated || []).length} fields`);
        } else {
          // Mark failed medications so they're skipped in future batches
          await supabase
            .from('medications')
            .update({ 
              content_status: 'extraction_failed',
              last_synced_at: new Date().toISOString(),
            })
            .eq('id', med.id);

          results.push({
            id: med.id,
            name: med.generic_name,
            success: false,
            error: extractData.error || `HTTP ${extractResponse.status}`,
          });
          console.warn(`✗ ${med.generic_name}: ${extractData.error}`);
        }

        // Rate limit: wait 2s between extractions
        if (medications.indexOf(med) < medications.length - 1) {
          await new Promise(r => setTimeout(r, 2000));
        }
      } catch (err) {
        // Mark failed medications so they're skipped in future batches
        await supabase
          .from('medications')
          .update({ 
            content_status: 'extraction_failed',
            last_synced_at: new Date().toISOString(),
          })
          .eq('id', med.id);

        results.push({
          id: med.id,
          name: med.generic_name,
          success: false,
          error: err instanceof Error ? err.message : 'Unknown error',
        });
        console.error(`✗ ${med.generic_name}:`, err);
      }
    }

    const succeeded = results.filter(r => r.success).length;
    const failed = results.filter(r => !r.success).length;

    return new Response(
      JSON.stringify({
        success: true,
        results,
        totalProcessed: results.length,
        succeeded,
        failed,
        remaining: Math.max(0, (totalRemaining || 0) - succeeded),
        nextOffset: offset + batchSize,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('batch-extract error:', error);
    return new Response(
      JSON.stringify({ success: false, error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
