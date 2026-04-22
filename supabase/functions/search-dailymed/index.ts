const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

export interface DailyMedSearchResult {
  drug_name: string;
  manufacturer: string;
  ndc_codes: string[];
  label_url: string;
  set_id: string;
  last_updated: string;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { drugName, limit = 10 } = await req.json();

    if (!drugName) {
      return new Response(
        JSON.stringify({ success: false, error: 'Drug name is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const apiKey = Deno.env.get('FIRECRAWL_API_KEY');
    if (!apiKey) {
      console.error('FIRECRAWL_API_KEY not configured');
      return new Response(
        JSON.stringify({ success: false, error: 'Firecrawl connector not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Searching DailyMed for:', drugName);

    // Search DailyMed API directly first (faster than scraping)
    const searchUrl = `https://dailymed.nlm.nih.gov/dailymed/services/v2/spls.json?drug_name=${encodeURIComponent(drugName)}&pagesize=${limit}`;
    
    const searchResponse = await fetch(searchUrl, {
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!searchResponse.ok) {
      console.error('DailyMed API error:', searchResponse.status);
      // Fall back to scraping if API fails
      return await scrapeSearchResults(drugName, apiKey, corsHeaders, limit);
    }

    const searchData = await searchResponse.json();
    
    if (!searchData.data || searchData.data.length === 0) {
      return new Response(
        JSON.stringify({ success: true, results: [] }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const results: DailyMedSearchResult[] = searchData.data.map((item: {
      title?: string;
      labeler?: string;
      products?: Array<{ ndc?: string }>;
      setid?: string;
      published_date?: string;
    }) => ({
      drug_name: item.title || drugName,
      manufacturer: item.labeler || 'Unknown',
      ndc_codes: item.products?.map((p: { ndc?: string }) => p.ndc).filter(Boolean) || [],
      label_url: `https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=${item.setid}`,
      set_id: item.setid || '',
      last_updated: item.published_date || '',
    }));

    console.log(`Found ${results.length} results for "${drugName}"`);

    return new Response(
      JSON.stringify({ success: true, results }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error searching DailyMed:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to search';
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

async function scrapeSearchResults(
  drugName: string, 
  apiKey: string, 
  corsHeaders: Record<string, string>,
  limit: number
): Promise<Response> {
  console.log('Falling back to Firecrawl scraping for search');
  
  const searchPageUrl = `https://dailymed.nlm.nih.gov/dailymed/search.cfm?query=${encodeURIComponent(drugName)}&searchdb=label`;
  
  const response = await fetch('https://api.firecrawl.dev/v1/scrape', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      url: searchPageUrl,
      formats: ['markdown', 'links'],
      onlyMainContent: true,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    console.error('Firecrawl API error:', data);
    return new Response(
      JSON.stringify({ success: false, error: data.error || 'Scraping failed' }),
      { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  // Extract drug label links from scraped content
  const links = data.data?.links || [];
  const labelLinks = links.filter((link: string) => 
    link.includes('drugInfo.cfm') || link.includes('setid=')
  ).slice(0, limit);

  const results: DailyMedSearchResult[] = labelLinks.map((link: string) => {
    const setIdMatch = link.match(/setid=([a-f0-9-]+)/i);
    return {
      drug_name: drugName,
      manufacturer: 'Unknown',
      ndc_codes: [],
      label_url: link,
      set_id: setIdMatch ? setIdMatch[1] : '',
      last_updated: '',
    };
  });

  return new Response(
    JSON.stringify({ success: true, results }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}
