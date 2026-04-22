const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

export interface FDALabelData {
  // Identification
  set_id: string;
  nda_number: string;
  application_type: string;
  drug_name: string;
  manufacturer: string;
  revision_date: string;
  source_url: string;

  // Dosage & Administration (Section 2)
  dosage_and_administration: {
    recommended_dosage: string;
    dose_modifications: string;
    preparation_instructions: string;
    administration_instructions: string;
    raw_text: string;
  };

  // Warnings & Precautions (Section 5)
  warnings_and_precautions: {
    boxed_warning: string | null;
    contraindications: string[];
    warnings: string[];
    precautions: string[];
    raw_text: string;
  };

  // Clinical Pharmacology (Section 12)
  pharmacokinetics: {
    absorption: string;
    distribution: string;
    metabolism: string;
    excretion: string;
    half_life: string;
    raw_text: string;
  };

  // Adverse Reactions (Section 6)
  adverse_reactions: {
    most_common: string[];
    serious: string[];
    postmarketing: string[];
    raw_text: string;
  };

  // Drug Interactions (Section 7)
  drug_interactions: Array<{
    drug: string;
    effect: string;
    recommendation: string;
  }>;

  // Use in Specific Populations (Section 8)
  special_populations: {
    pregnancy: string;
    lactation: string;
    pediatric: string;
    geriatric: string;
    renal_impairment: string;
    hepatic_impairment: string;
  };

  // Storage and Handling (Section 16)
  storage_handling: string;

  // Full markdown for reference
  full_markdown: string;
}

const FDA_LABEL_EXTRACTION_PROMPT = `Extract structured medication label data from this FDA prescribing information. Return a JSON object with these exact fields:

{
  "drug_name": "generic name of the drug",
  "manufacturer": "manufacturer/labeler name",
  "nda_number": "NDA, ANDA, or BLA number if found",
  "revision_date": "label revision date",
  "boxed_warning": "full text of any boxed warning or null if none",
  "recommended_dosage": "recommended dosage information",
  "dose_modifications": "dose modification instructions",
  "preparation_instructions": "how to prepare/reconstitute the medication",
  "administration_instructions": "how to administer (route, rate, method)",
  "contraindications": ["array of contraindications"],
  "warnings": ["array of key warnings"],
  "precautions": ["array of precautions"],
  "absorption": "absorption information",
  "distribution": "distribution/protein binding info",
  "metabolism": "metabolism pathway",
  "excretion": "excretion route",
  "half_life": "elimination half-life",
  "common_adverse_reactions": ["most common adverse reactions"],
  "serious_adverse_reactions": ["serious/severe adverse reactions"],
  "drug_interactions": [{"drug": "name", "effect": "interaction effect", "recommendation": "what to do"}],
  "pregnancy": "pregnancy considerations",
  "lactation": "breastfeeding considerations",
  "pediatric": "pediatric use info",
  "geriatric": "geriatric use info",
  "renal_impairment": "renal dosing adjustments",
  "hepatic_impairment": "hepatic dosing adjustments",
  "storage": "storage and handling requirements"
}

Focus on extracting clinically relevant information. Use empty strings or empty arrays for sections not found.`;

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { labelUrl, setId } = await req.json();

    if (!labelUrl && !setId) {
      return new Response(
        JSON.stringify({ success: false, error: 'Label URL or Set ID is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const targetSetId = setId || extractSetIdFromUrl(labelUrl || '');
    if (!targetSetId) {
      return new Response(
        JSON.stringify({ success: false, error: 'Could not determine Set ID' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Fetching FDA label for Set ID:', targetSetId);

    const apiKey = Deno.env.get('FIRECRAWL_API_KEY');
    if (!apiKey) {
      console.error('FIRECRAWL_API_KEY not configured');
      return new Response(
        JSON.stringify({ success: false, error: 'Firecrawl connector not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Fetch label metadata from DailyMed search API (this works reliably)
    const searchUrl = `https://dailymed.nlm.nih.gov/dailymed/services/v2/spls.json?setid=${targetSetId}`;
    console.log('Fetching SPL metadata from:', searchUrl);
    
    let splData: SPLData | undefined;
    try {
      const splResponse = await fetch(searchUrl, {
        headers: { 'Accept': 'application/json' },
      });
      if (splResponse.ok) {
        const splJson = await splResponse.json();
        splData = splJson.data?.[0];
        console.log('SPL data received, title:', splData?.title);
      }
    } catch (err) {
      console.log('Could not fetch SPL metadata, continuing with scrape only');
    }

    // Scrape the full label page directly
    const labelPageUrl = `https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=${targetSetId}`;
    console.log('Scraping full label from:', labelPageUrl);
    
    const response = await fetch('https://api.firecrawl.dev/v1/scrape', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: labelPageUrl,
        formats: ['markdown'],
        onlyMainContent: false, // Get full page content
        waitFor: 5000, // Wait longer for dynamic content
      }),
    });

    const firecrawlData = await response.json();
    
    if (!response.ok) {
      console.error('Firecrawl API error:', firecrawlData);
      return new Response(
        JSON.stringify({ success: false, error: firecrawlData.error || 'Scraping failed' }),
        { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const markdown = firecrawlData.data?.markdown || '';
    console.log('Scraped markdown length:', markdown.length);
    
    // Build label data combining SPL metadata and scraped content
    const extractedJson = extractFromMarkdown(markdown);
    const labelData = buildLabelFromSPL(splData, targetSetId, markdown, extractedJson);

    console.log('Successfully scraped label for:', labelData.drug_name);

    return new Response(
      JSON.stringify({ success: true, data: labelData }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error scraping FDA label:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to scrape label';
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

function extractSetIdFromUrl(url: string): string | null {
  const match = url.match(/setid=([a-f0-9-]+)/i);
  return match ? match[1] : null;
}

function detectApplicationType(ndaNumber: string): string {
  if (!ndaNumber) return '';
  const upper = ndaNumber.toUpperCase();
  if (upper.includes('NDA')) return 'NDA';
  if (upper.includes('ANDA')) return 'ANDA';
  if (upper.includes('BLA')) return 'BLA';
  return 'Unknown';
}

function extractBoxedWarning(markdown: string): string | null {
  // Look for boxed warning patterns
  const patterns = [
    /(?:BOXED WARNING|WARNING:?\s*$)([\s\S]*?)(?=\n#{1,3}\s|\n\*{3}|---)/im,
    /(?:BLACK BOX WARNING)([\s\S]*?)(?=\n#{1,3}\s|\n\*{3}|---)/im,
  ];

  for (const pattern of patterns) {
    const match = markdown.match(pattern);
    if (match) {
      return match[1].trim().substring(0, 2000); // Limit length
    }
  }

  return null;
}

function extractSection(markdown: string, sectionHeaders: string[]): string {
  for (const header of sectionHeaders) {
    const pattern = new RegExp(
      `(?:^|\\n)#+\\s*${header}[\\s\\S]*?([\\s\\S]*?)(?=\\n#{1,2}\\s|$)`,
      'im'
    );
    const match = markdown.match(pattern);
    if (match) {
      return match[1].trim().substring(0, 5000); // Limit length
    }
  }
  return '';
}

interface ExtractedData {
  drug_name: string;
  manufacturer: string;
  nda_number: string;
  revision_date: string;
  boxed_warning: string | null;
  recommended_dosage: string;
  dose_modifications: string;
  preparation_instructions: string;
  administration_instructions: string;
  contraindications: string[];
  warnings: string[];
  precautions: string[];
  absorption: string;
  distribution: string;
  metabolism: string;
  excretion: string;
  half_life: string;
  common_adverse_reactions: string[];
  serious_adverse_reactions: string[];
  drug_interactions: Array<{ drug: string; effect: string; recommendation: string }>;
  pregnancy: string;
  lactation: string;
  pediatric: string;
  geriatric: string;
  renal_impairment: string;
  hepatic_impairment: string;
  storage: string;
}

function extractFromMarkdown(markdown: string): ExtractedData {
  const result: ExtractedData = {
    drug_name: '',
    manufacturer: '',
    nda_number: '',
    revision_date: '',
    boxed_warning: null,
    recommended_dosage: '',
    dose_modifications: '',
    preparation_instructions: '',
    administration_instructions: '',
    contraindications: [],
    warnings: [],
    precautions: [],
    absorption: '',
    distribution: '',
    metabolism: '',
    excretion: '',
    half_life: '',
    common_adverse_reactions: [],
    serious_adverse_reactions: [],
    drug_interactions: [],
    pregnancy: '',
    lactation: '',
    pediatric: '',
    geriatric: '',
    renal_impairment: '',
    hepatic_impairment: '',
    storage: '',
  };

  // Extract drug name from title
  const titleMatch = markdown.match(/^#\s*(.+?)(?:\s*-|\n)/m);
  if (titleMatch) {
    result.drug_name = titleMatch[1].trim();
  }

  // Extract boxed warning
  const boxedMatch = markdown.match(/(?:BOXED WARNING|WARNING:?\s*$|BLACK BOX)([\s\S]*?)(?=\n#{1,3}\s|\n\*{3}|---)/im);
  if (boxedMatch) {
    result.boxed_warning = boxedMatch[1].trim().substring(0, 2000);
  }

  // Extract dosage section
  const dosageSection = extractSection(markdown, ['DOSAGE AND ADMINISTRATION', '2 DOSAGE']);
  if (dosageSection) {
    result.recommended_dosage = dosageSection.substring(0, 1000);
    
    // Look for IV administration info
    const ivMatch = dosageSection.match(/(?:intravenous|IV|infusion)[^.]*\./gi);
    if (ivMatch) {
      result.administration_instructions = ivMatch.join(' ').substring(0, 500);
    }
  }

  // Extract contraindications
  const contraSection = extractSection(markdown, ['CONTRAINDICATIONS', '4 CONTRAINDICATIONS']);
  if (contraSection) {
    const items = contraSection.split(/\n[-•*]\s*/);
    result.contraindications = items.filter(item => item.trim().length > 10).slice(0, 10);
  }

  // Extract warnings
  const warningsSection = extractSection(markdown, ['WARNINGS AND PRECAUTIONS', '5 WARNINGS']);
  if (warningsSection) {
    // Look for subsection headers as warnings
    const warningHeaders = warningsSection.match(/\*\*([^*]+)\*\*/g);
    if (warningHeaders) {
      result.warnings = warningHeaders.map(w => w.replace(/\*\*/g, '')).slice(0, 10);
    }
  }

  // Extract pharmacokinetics
  const pkSection = extractSection(markdown, ['CLINICAL PHARMACOLOGY', '12 CLINICAL PHARMACOLOGY', 'Pharmacokinetics']);
  if (pkSection) {
    const halfLifeMatch = pkSection.match(/half[- ]life[^.]*?(\d+[^.]*(?:hours?|minutes?|min|hr)[^.]*)/i);
    if (halfLifeMatch) {
      result.half_life = halfLifeMatch[0].substring(0, 200);
    }
    
    const metabolismMatch = pkSection.match(/(?:metaboli[sz]ed?|metabolism)[^.]*\./i);
    if (metabolismMatch) {
      result.metabolism = metabolismMatch[0].substring(0, 200);
    }
    
    const excretionMatch = pkSection.match(/(?:excret(?:ed|ion)|eliminated)[^.]*\./i);
    if (excretionMatch) {
      result.excretion = excretionMatch[0].substring(0, 200);
    }
  }

  // Extract adverse reactions
  const adverseSection = extractSection(markdown, ['ADVERSE REACTIONS', '6 ADVERSE']);
  if (adverseSection) {
    const commonMatch = adverseSection.match(/(?:most common|common adverse)[^:]*:([^.]+)/i);
    if (commonMatch) {
      result.common_adverse_reactions = commonMatch[1].split(/,|and/).map(s => s.trim()).filter(s => s.length > 2);
    }
  }

  // Extract special populations
  const pregSection = extractSection(markdown, ['Pregnancy', '8.1 Pregnancy']);
  if (pregSection) {
    result.pregnancy = pregSection.substring(0, 500);
  }
  
  const renalMatch = markdown.match(/(?:renal impairment|kidney)[^.]*(?:dose|dosage|adjustment)[^.]*\./i);
  if (renalMatch) {
    result.renal_impairment = renalMatch[0].substring(0, 300);
  }
  
  const hepaticMatch = markdown.match(/(?:hepatic impairment|liver)[^.]*(?:dose|dosage|adjustment)[^.]*\./i);
  if (hepaticMatch) {
    result.hepatic_impairment = hepaticMatch[0].substring(0, 300);
  }

  // Extract storage
  const storageSection = extractSection(markdown, ['STORAGE', 'HOW SUPPLIED/STORAGE', '16 HOW SUPPLIED']);
  if (storageSection) {
    const storageMatch = storageSection.match(/(?:store|storage)[^.]*\./i);
    if (storageMatch) {
      result.storage = storageMatch[0].substring(0, 200);
    }
  }

  return result;
}

interface SPLData {
  title?: string;
  labeler?: string;
  published_date?: string;
  products?: Array<{ active_ingredients?: Array<{ name?: string }> }>;
}

function buildLabelFromSPL(
  splData: SPLData | undefined,
  setId: string,
  markdown: string,
  extracted: Partial<ExtractedData>
): FDALabelData {
  const sourceUrl = `https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=${setId}`;
  
  return {
    set_id: setId,
    nda_number: extracted.nda_number || '',
    application_type: detectApplicationType(extracted.nda_number || ''),
    drug_name: extracted.drug_name || splData?.title || '',
    manufacturer: extracted.manufacturer || splData?.labeler || '',
    revision_date: extracted.revision_date || splData?.published_date || '',
    source_url: sourceUrl,

    dosage_and_administration: {
      recommended_dosage: extracted.recommended_dosage || '',
      dose_modifications: extracted.dose_modifications || '',
      preparation_instructions: extracted.preparation_instructions || '',
      administration_instructions: extracted.administration_instructions || '',
      raw_text: extractSection(markdown, ['DOSAGE AND ADMINISTRATION', '2 DOSAGE', '2. DOSAGE']),
    },

    warnings_and_precautions: {
      boxed_warning: extracted.boxed_warning || extractBoxedWarning(markdown),
      contraindications: extracted.contraindications || [],
      warnings: extracted.warnings || [],
      precautions: extracted.precautions || [],
      raw_text: extractSection(markdown, ['WARNINGS AND PRECAUTIONS', '5 WARNINGS', '5. WARNINGS']),
    },

    pharmacokinetics: {
      absorption: extracted.absorption || '',
      distribution: extracted.distribution || '',
      metabolism: extracted.metabolism || '',
      excretion: extracted.excretion || '',
      half_life: extracted.half_life || '',
      raw_text: extractSection(markdown, ['CLINICAL PHARMACOLOGY', '12 CLINICAL PHARMACOLOGY', '12. CLINICAL']),
    },

    adverse_reactions: {
      most_common: extracted.common_adverse_reactions || [],
      serious: extracted.serious_adverse_reactions || [],
      postmarketing: [],
      raw_text: extractSection(markdown, ['ADVERSE REACTIONS', '6 ADVERSE', '6. ADVERSE']),
    },

    drug_interactions: extracted.drug_interactions || [],

    special_populations: {
      pregnancy: extracted.pregnancy || '',
      lactation: extracted.lactation || '',
      pediatric: extracted.pediatric || '',
      geriatric: extracted.geriatric || '',
      renal_impairment: extracted.renal_impairment || '',
      hepatic_impairment: extracted.hepatic_impairment || '',
    },

    storage_handling: extracted.storage || '',

    full_markdown: markdown,
  };
}
