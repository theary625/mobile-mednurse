const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { batchSize = 10, offset = 0, onlyMissingData = true, countOnly = false } = await req.json();

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Count query (shared)
    let countQuery = supabase
      .from('medications')
      .select('id', { count: 'exact', head: true });

    if (onlyMissingData) {
      countQuery = countQuery.or('dosing_info.is.null,safety_info.is.null,pharmacokinetics.is.null');
    }

    const { count: totalCount } = await countQuery;

    // If countOnly, return just the total without processing
    if (countOnly) {
      return new Response(
        JSON.stringify({ success: true, totalCount: totalCount || 0 }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Build query for medications missing key clinical data
    let query = supabase
      .from('medications')
      .select('id, generic_name, brand_names');

    if (onlyMissingData) {
      query = query.or('dosing_info.is.null,safety_info.is.null,pharmacokinetics.is.null');
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
        JSON.stringify({
          success: true,
          message: 'No more medications to process',
          results: [],
          totalProcessed: 0,
          succeeded: 0,
          failed: 0,
          remaining: 0,
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Process each medication
    const results: Array<{ id: string; name: string; success: boolean; error?: string; fields?: string[]; not_found?: boolean }> = [];

    for (const med of medications) {
      try {
        console.log(`Processing: ${med.generic_name} (${med.id})`);

        const pullUrl = `${supabaseUrl}/functions/v1/pull-openfda-label-data`;
        const pullResponse = await fetch(pullUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${supabaseServiceKey}`,
          },
          body: JSON.stringify({ medicationId: med.id }),
        });

        const pullData = await pullResponse.json();

        if (pullResponse.ok && pullData.success) {
          results.push({
            id: med.id,
            name: med.generic_name,
            success: true,
            fields: pullData.fields_populated,
          });
          console.log(`✓ ${med.generic_name}: ${(pullData.fields_populated || []).length} fields`);
        } else {
          results.push({
            id: med.id,
            name: med.generic_name,
            success: false,
            error: pullData.error || `HTTP ${pullResponse.status}`,
            not_found: pullData.not_found || false,
          });
          console.warn(`✗ ${med.generic_name}: ${pullData.error}`);
        }

        // Rate limit: 200ms delay between calls (~300 requests/min, well within OpenFDA's 240 req/min without key)
        if (medications.indexOf(med) < medications.length - 1) {
          await new Promise(r => setTimeout(r, 200));
        }
      } catch (err) {
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
    const notFound = results.filter(r => r.not_found).length;

    return new Response(
      JSON.stringify({
        success: true,
        results,
        totalProcessed: results.length,
        succeeded,
        failed,
        notFound,
        remaining: Math.max(0, (totalCount || 0) - offset - results.length),
        nextOffset: offset + batchSize,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('batch-openfda-label-sync error:', error);
    return new Response(
      JSON.stringify({ success: false, error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
