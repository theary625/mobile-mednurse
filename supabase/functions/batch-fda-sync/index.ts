import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface MedicationToSync {
  id: string;
  generic_name: string;
}

interface SyncResult {
  medication_id: string;
  medication_name: string;
  success: boolean;
  error?: string;
  set_id?: string;
  source?: string;
}

interface OpenFDAResult {
  setId: string;
  brandName?: string;
  genericName?: string;
  manufacturer?: string;
  labelUrl: string;
}

// Extract the primary drug name from compound names
function extractPrimaryDrugName(name: string): string {
  // Remove common suffixes and parenthetical content
  let cleanName = name
    .replace(/\s*\([^)]*\)\s*/g, '') // Remove (Antidote), (Cardiovascular), etc.
    .replace(/\s+(Nasal|Ophthalmic|Topical|Otic)\s*/gi, '') // Remove route suffixes
    .trim();
  
  // For combination drugs, try the first component
  if (cleanName.includes('/')) {
    cleanName = cleanName.split('/')[0].trim();
  }
  if (cleanName.includes('-')) {
    // Handle cases like "Amoxicillin-Clavulanate" - use first part
    const parts = cleanName.split('-');
    if (parts[0].length > 3) {
      cleanName = parts[0].trim();
    }
  }
  if (cleanName.includes(' with ')) {
    cleanName = cleanName.split(' with ')[0].trim();
  }
  
  // Remove percentage (like "Albumin 25%")
  cleanName = cleanName.replace(/\s*\d+%?\s*$/, '').trim();
  
  return cleanName || name;
}

// Search OpenFDA drug labels as fallback
async function searchOpenFDA(drugName: string): Promise<OpenFDAResult | null> {
  try {
    // Try generic name search first
    const searchTerms = [
      `openfda.generic_name:"${drugName}"`,
      `openfda.brand_name:"${drugName}"`,
      `openfda.substance_name:"${drugName}"`,
    ];
    
    for (const searchTerm of searchTerms) {
      const url = `https://api.fda.gov/drug/label.json?search=${encodeURIComponent(searchTerm)}&limit=1`;
      const response = await fetch(url);
      
      if (response.ok) {
        const data = await response.json();
        if (data.results && data.results.length > 0) {
          const result = data.results[0];
          const setId = result.set_id || result.id;
          
          return {
            setId,
            brandName: result.openfda?.brand_name?.[0],
            genericName: result.openfda?.generic_name?.[0],
            manufacturer: result.openfda?.manufacturer_name?.[0],
            labelUrl: `https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=${setId}`,
          };
        }
      }
    }
    
    // Try a broader search without quotes
    const broadUrl = `https://api.fda.gov/drug/label.json?search=${encodeURIComponent(drugName)}&limit=5`;
    const broadResponse = await fetch(broadUrl);
    
    if (broadResponse.ok) {
      const data = await broadResponse.json();
      if (data.results && data.results.length > 0) {
        // Find best match by checking if drug name appears in generic or brand name
        const lowerName = drugName.toLowerCase();
        const match = data.results.find((r: { openfda?: { generic_name?: string[]; brand_name?: string[] } }) => {
          const generic = r.openfda?.generic_name?.[0]?.toLowerCase() || '';
          const brand = r.openfda?.brand_name?.[0]?.toLowerCase() || '';
          return generic.includes(lowerName) || brand.includes(lowerName) || 
                 lowerName.includes(generic) || lowerName.includes(brand);
        }) || data.results[0];
        
        const setId = match.set_id || match.id;
        return {
          setId,
          brandName: match.openfda?.brand_name?.[0],
          genericName: match.openfda?.generic_name?.[0],
          manufacturer: match.openfda?.manufacturer_name?.[0],
          labelUrl: `https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=${setId}`,
        };
      }
    }
    
    return null;
  } catch (error) {
    console.error(`OpenFDA search error for ${drugName}:`, error);
    return null;
  }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { medicationIds, mode = 'selected' } = await req.json();

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    let medications: MedicationToSync[] = [];

    if (mode === 'missing') {
      // Get all medications missing FDA label data
      const { data, error } = await supabase
        .from('medications')
        .select('id, generic_name')
        .is('fda_set_id', null)
        .order('generic_name')
        .limit(25);

      if (error) throw error;
      medications = data || [];
    } else if (mode === 'outdated') {
      // Get medications with old FDA data (more than 90 days)
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - 90);
      
      const { data, error } = await supabase
        .from('medications')
        .select('id, generic_name')
        .not('fda_set_id', 'is', null)
        .lt('last_synced_at', cutoffDate.toISOString())
        .order('last_synced_at')
        .limit(25);

      if (error) throw error;
      medications = data || [];
    } else if (medicationIds && Array.isArray(medicationIds)) {
      // Get specific medications
      const { data, error } = await supabase
        .from('medications')
        .select('id, generic_name')
        .in('id', medicationIds);

      if (error) throw error;
      medications = data || [];
    }

    if (medications.length === 0) {
      return new Response(
        JSON.stringify({ success: true, results: [], message: 'No medications to sync' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Starting batch sync for ${medications.length} medications`);

    const results: SyncResult[] = [];
    const firecrawlKey = Deno.env.get('FIRECRAWL_API_KEY');

    for (const med of medications) {
      try {
        // Extract primary drug name for better search results
        const searchName = extractPrimaryDrugName(med.generic_name);
        console.log(`Processing: ${med.generic_name} (searching: ${searchName})`);
        
        // Search DailyMed for this medication - try generic name first
        let searchUrl = `https://dailymed.nlm.nih.gov/dailymed/services/v2/spls.json?drug_name=${encodeURIComponent(searchName)}&pagesize=5`;
        let searchResponse = await fetch(searchUrl);
        
        if (!searchResponse.ok) {
          console.error(`DailyMed API error for ${med.generic_name}: ${searchResponse.status}`);
          results.push({
            medication_id: med.id,
            medication_name: med.generic_name,
            success: false,
            error: `DailyMed search failed: ${searchResponse.status}`,
          });
          continue;
        }

        let searchData = await searchResponse.json();
        
        // If no results, try with full generic name (in case extraction removed something important)
        if ((!searchData.data || searchData.data.length === 0) && searchName !== med.generic_name) {
          console.log(`Retrying with full name: ${med.generic_name}`);
          searchUrl = `https://dailymed.nlm.nih.gov/dailymed/services/v2/spls.json?drug_name=${encodeURIComponent(med.generic_name)}&pagesize=5`;
          searchResponse = await fetch(searchUrl);
          if (searchResponse.ok) {
            searchData = await searchResponse.json();
          }
        }
        
        let labelInfo = null;
        let setId = '';
        let syncSource = 'dailymed';
        
        if (!searchData.data || searchData.data.length === 0) {
          // Try OpenFDA as fallback
          console.log(`DailyMed empty, trying OpenFDA for: ${med.generic_name}`);
          const openfdaResult = await searchOpenFDA(searchName);
          
          if (!openfdaResult) {
            // Also try full name on OpenFDA
            const openfdaFullResult = searchName !== med.generic_name 
              ? await searchOpenFDA(med.generic_name)
              : null;
              
            if (!openfdaFullResult) {
              console.log(`No FDA label found (DailyMed + OpenFDA) for: ${med.generic_name}`);
              
              // Mark as synced with no FDA data to avoid repeated attempts
              await supabase
                .from('medications')
                .update({ 
                  last_synced_at: new Date().toISOString(),
                  sync_source: 'not_found'
                })
                .eq('id', med.id);
                
              results.push({
                medication_id: med.id,
                medication_name: med.generic_name,
                success: false,
                error: 'No FDA label found in DailyMed or OpenFDA',
              });
              continue;
            } else {
              setId = openfdaFullResult.setId;
              labelInfo = {
                title: openfdaFullResult.brandName || openfdaFullResult.genericName || med.generic_name,
                labeler: openfdaFullResult.manufacturer,
                published_date: null,
              };
              syncSource = 'openfda';
              console.log(`Found via OpenFDA (full name) for ${med.generic_name}: ${setId}`);
            }
          } else {
            setId = openfdaResult.setId;
            labelInfo = {
              title: openfdaResult.brandName || openfdaResult.genericName || med.generic_name,
              labeler: openfdaResult.manufacturer,
              published_date: null,
            };
            syncSource = 'openfda';
            console.log(`Found via OpenFDA for ${med.generic_name}: ${setId}`);
          }
        } else {
          labelInfo = searchData.data[0];
          setId = labelInfo.setid;
          console.log(`Found via DailyMed for ${med.generic_name}: ${setId}`);
        }

        // Update medication with basic FDA info
        const updateData: Record<string, unknown> = {
          fda_set_id: setId,
          fda_label_url: `https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=${setId}`,
          fda_label_revision_date: labelInfo.published_date || null,
          last_synced_at: new Date().toISOString(),
          sync_source: syncSource,
        };

        // If we have Firecrawl, try to scrape the full label
        if (firecrawlKey) {
          try {
            const labelPageUrl = `https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=${setId}`;
            const scrapeResponse = await fetch('https://api.firecrawl.dev/v1/scrape', {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${firecrawlKey}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                url: labelPageUrl,
                formats: ['markdown'],
                onlyMainContent: false,
                waitFor: 3000,
              }),
            });

            if (scrapeResponse.ok) {
              const scrapeData = await scrapeResponse.json();
              const markdown = scrapeData.data?.markdown || '';
              
              // Store the scraped content
              updateData.fda_label_data = {
                title: labelInfo.title,
                manufacturer: labelInfo.labeler,
                full_markdown: markdown.substring(0, 50000), // Limit size
                scraped_at: new Date().toISOString(),
              };
            }
          } catch (scrapeErr) {
            console.error(`Scrape error for ${med.generic_name}:`, scrapeErr);
            // Continue without full scrape data
          }
        }

        const { error: updateError } = await supabase
          .from('medications')
          .update(updateData)
          .eq('id', med.id);

        if (updateError) {
          console.error(`Update error for ${med.generic_name}:`, updateError.message);
          results.push({
            medication_id: med.id,
            medication_name: med.generic_name,
            success: false,
            error: updateError.message,
          });
        } else {
          results.push({
            medication_id: med.id,
            medication_name: med.generic_name,
            success: true,
            set_id: setId,
            source: syncSource,
          });
        }

        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 300));

      } catch (err) {
        console.error(`Error processing ${med.generic_name}:`, err);
        results.push({
          medication_id: med.id,
          medication_name: med.generic_name,
          success: false,
          error: err instanceof Error ? err.message : 'Unknown error',
        });
      }
    }

    const successCount = results.filter(r => r.success).length;
    const failCount = results.filter(r => !r.success).length;

    console.log(`Batch sync complete: ${successCount} succeeded, ${failCount} failed`);

    return new Response(
      JSON.stringify({
        success: true,
        total: medications.length,
        succeeded: successCount,
        failed: failCount,
        results,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Batch sync error:', error);
    return new Response(
      JSON.stringify({ success: false, error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
