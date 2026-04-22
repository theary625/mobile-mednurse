const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const buildExtractionPrompt = (genericName: string, brandNames: string[]) => {
  const brandStr = brandNames.length > 0 ? brandNames.join(', ') : 'unknown';
  return `You are a clinical pharmacist. Extract structured medication data from this FDA prescribing information label.

CRITICAL: Extract data for the medication "${genericName}" (brand name(s): ${brandStr}).
The medication may appear under alternate names, abbreviations, salt forms, or as part of a combination product.
For example: "5-HTP" = "5-hydroxytryptophan" = "oxitriptan", "Acetaminophen/Codeine" may appear as separate ingredients in a combination label.
If the document clearly contains prescribing information relevant to "${genericName}" (even under a different name form), extract the data and set "matched" to true.
Only set "matched" to false if the document is genuinely about a completely different, unrelated medication.

Return ONLY a valid JSON object with these exact fields. Use empty strings for missing text fields and empty arrays for missing array fields. Do not include any markdown formatting.

{
  "matched": true,
  "extracted_generic_name": "the generic name as it appears in the label",
  "extracted_brand_names": ["brand name(s) as they appear in the label"],
  "dosage_form": "tablet, capsule, injection, solution, cream, etc.",
  "strengths": ["available strengths e.g. 5 mg, 10 mg, 25 mg/mL"],
  "manufacturer": "manufacturer or labeler name",
  "dosing_info": {
    "standard_dose": "standard adult dose with route and frequency",
    "max_dose": "maximum recommended dose",
    "pediatric_dose": "pediatric dosing if applicable",
    "renal_adjustment": "dose adjustment for renal impairment",
    "hepatic_adjustment": "dose adjustment for hepatic impairment",
    "indication": "FDA-approved indications"
  },
  "safety_info": {
    "boxed_warning": "full boxed warning text or null if none",
    "contraindications": ["array of contraindications"],
    "precautions": ["array of key warnings and precautions"]
  },
  "pharmacokinetics": {
    "absorption": "absorption details including bioavailability",
    "distribution": "distribution and protein binding",
    "metabolism": "metabolic pathway (enzymes involved)",
    "excretion": "route of elimination",
    "half_life": "elimination half-life"
  },
  "adverse_reactions": {
    "common": ["most common adverse reactions with frequency if available"],
    "serious": ["serious adverse reactions"],
    "frequency": "overall incidence summary"
  },
  "drug_interactions_info": [
    {"drug": "interacting drug/class", "effect": "interaction effect", "recommendation": "clinical recommendation", "severity": "major|moderate|minor"}
  ],
  "adjustments": {
    "renal": "renal impairment adjustments",
    "hepatic": "hepatic impairment adjustments",
    "geriatric": "geriatric considerations"
  },
  "administration_info": {
    "route": "route(s) of administration",
    "method": "administration method details",
    "preparation": "preparation/reconstitution instructions"
  },
  "monitoring": {
    "labs": ["lab tests to monitor with frequency, e.g. CBC weekly x4 then monthly"],
    "vitals": ["vital signs to monitor, e.g. blood pressure before each dose"],
    "parameters": ["other clinical parameters to assess"]
  },
  "hold_parameters": {
    "conditions": ["conditions when medication should be held, e.g. HR < 60, SBP < 90"],
    "thresholds": ["specific numeric thresholds for holding"]
  },
  "red_flags": {
    "signs": ["signs requiring immediate intervention, e.g. signs of bleeding, anaphylaxis"],
    "symptoms": ["symptoms to watch for that require urgent notification"]
  },
  "expected_effect": {
    "therapeutic_outcome": "expected therapeutic effect",
    "onset": "expected onset of action",
    "peak": "time to peak effect",
    "duration": "duration of effect"
  },
  "documentation_reminders": {
    "assessments": ["what to document before/during/after administration"],
    "parameters": ["key parameters to chart"]
  },
  "pause_triggers": {
    "conditions": ["conditions that should trigger pausing or reassessing the medication"],
    "actions": ["recommended actions when triggers are met"]
  },
  "timing_rules": {
    "meal_relation": "timing relative to meals (e.g. take on empty stomach, 30 min before meals)",
    "drug_spacing": "spacing relative to other drugs (e.g. give 2h apart from antacids)",
    "time_of_day": "preferred time of day if applicable"
  },
  "safe_method": {
    "rights_check": "specific safety checks for this medication",
    "double_check": "whether independent double-check is required and why",
    "look_alike_sound_alike": "LASA concerns if any"
  },
  "rate_dilution": {
    "dilution": "dilution/reconstitution instructions for IV medications",
    "rate": "infusion rate or IV push rate",
    "max_concentration": "maximum concentration",
    "compatible_solutions": ["compatible IV solutions e.g. NS, D5W"]
  },
  "line_compatibility": {
    "y_site_compatible": ["drugs compatible via Y-site"],
    "y_site_incompatible": ["drugs incompatible via Y-site"],
    "notes": "additional line/compatibility notes"
  },
  "required_resources": {
    "equipment": ["equipment needed, e.g. infusion pump, filter needle"],
    "supplies": ["supplies needed"],
    "monitoring_equipment": ["monitoring devices needed, e.g. cardiac monitor, pulse oximeter"]
  },
  "patient_education": {
    "key_points": ["essential teaching points for the patient"],
    "side_effects_to_report": ["side effects the patient should report immediately"],
    "lifestyle_modifications": ["dietary or lifestyle changes needed"]
  },
  "special_populations": {
    "pregnancy": "pregnancy category and considerations",
    "lactation": "breastfeeding considerations",
    "pediatric": "pediatric use information",
    "geriatric": "geriatric use information"
  }
}

Focus on clinically actionable information. Be concise but complete. For fields not found in the label, use empty strings or empty arrays as appropriate.`;
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { medicationId, fdaLabelUrl } = await req.json();

    if (!medicationId) {
      return new Response(
        JSON.stringify({ success: false, error: 'medicationId is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(medicationId)) {
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid medication ID format' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { data: medication, error: medError } = await supabase
      .from('medications')
      .select('id, generic_name, brand_names, fda_label_url')
      .eq('id', medicationId)
      .single();

    if (medError || !medication) {
      return new Response(
        JSON.stringify({ success: false, error: 'Medication not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const labelUrl = fdaLabelUrl || medication.fda_label_url;
    if (!labelUrl) {
      return new Response(
        JSON.stringify({ success: false, error: 'No FDA label URL set for this medication' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Extracting FDA label for ${medication.generic_name} from: ${labelUrl}`);

    const firecrawlKey = Deno.env.get('FIRECRAWL_API_KEY');
    if (!firecrawlKey) {
      return new Response(
        JSON.stringify({ success: false, error: 'Firecrawl connector not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const scrapeResponse = await fetch('https://api.firecrawl.dev/v1/scrape', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${firecrawlKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: labelUrl,
        formats: ['markdown'],
        onlyMainContent: false,
        waitFor: 5000,
      }),
    });

    const scrapeData = await scrapeResponse.json();
    if (!scrapeResponse.ok) {
      console.error('Firecrawl error:', scrapeData);
      return new Response(
        JSON.stringify({ success: false, error: 'Failed to scrape FDA label URL' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const markdown = scrapeData.data?.markdown || scrapeData.markdown || '';
    console.log(`Scraped ${markdown.length} chars of markdown`);

    if (markdown.length < 100) {
      return new Response(
        JSON.stringify({ success: false, error: 'Scraped content too short — the URL may not contain a valid FDA label' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const lovableApiKey = Deno.env.get('LOVABLE_API_KEY');
    if (!lovableApiKey) {
      return new Response(
        JSON.stringify({ success: false, error: 'AI service not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const truncatedMarkdown = markdown.length > 80000 ? markdown.substring(0, 80000) + '\n\n[CONTENT TRUNCATED]' : markdown;

    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${lovableApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: buildExtractionPrompt(medication.generic_name, medication.brand_names || []) },
          { role: 'user', content: `Extract structured data ONLY for "${medication.generic_name}" from this FDA prescribing information:\n\n${truncatedMarkdown}` },
        ],
      }),
    });

    if (!aiResponse.ok) {
      const aiErrorText = await aiResponse.text();
      console.error('AI gateway error:', aiResponse.status, aiErrorText);
      
      if (aiResponse.status === 429) {
        return new Response(
          JSON.stringify({ success: false, error: 'AI rate limit exceeded. Please try again in a moment.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (aiResponse.status === 402) {
        return new Response(
          JSON.stringify({ success: false, error: 'AI credits exhausted. Please add credits.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      return new Response(
        JSON.stringify({ success: false, error: 'AI extraction failed' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const aiResult = await aiResponse.json();
    const rawContent = aiResult.choices?.[0]?.message?.content || '';
    console.log('AI response length:', rawContent.length);

    let extractedData: Record<string, unknown>;
    try {
      const jsonStr = rawContent.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
      extractedData = JSON.parse(jsonStr);
    } catch (parseErr) {
      console.error('Failed to parse AI response:', rawContent.substring(0, 500));
      return new Response(
        JSON.stringify({ success: false, error: 'AI returned invalid JSON. Please retry.' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Post-extraction verification
    if (extractedData.matched === false) {
      const extractedName = extractedData.extracted_generic_name || 'unknown';
      console.warn(`AI matched=false for "${medication.generic_name}". Label appears to be for: "${extractedName}"`);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: `FDA label is for "${extractedName}", not "${medication.generic_name}". The URL may be incorrect.`,
          extracted_generic_name: extractedData.extracted_generic_name,
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const extractedGeneric = (extractedData.extracted_generic_name as string || '').toLowerCase().trim();
    const expectedGeneric = medication.generic_name.toLowerCase().trim();
    
    const namesMatch = (expected: string, extracted: string): boolean => {
      if (!extracted) return true;
      if (extracted.includes(expected) || expected.includes(extracted)) return true;
      const expectedParts = expected.split(/[\/\-,\s]+and\s+|[\/,]+/).map(s => s.trim()).filter(Boolean);
      const extractedParts = extracted.split(/[\/\-,\s]+and\s+|[\/,]+/).map(s => s.trim()).filter(Boolean);
      if (expectedParts.some(ep => extracted.includes(ep))) return true;
      if (extractedParts.some(ep => expected.includes(ep))) return true;
      const expectedAlpha = expected.replace(/[^a-z0-9]/g, '');
      const extractedAlpha = extracted.replace(/[^a-z0-9]/g, '');
      if (extractedAlpha.includes(expectedAlpha) || expectedAlpha.includes(extractedAlpha)) return true;
      const abbrevMatch = (abbrev: string, full: string): boolean => {
        const letters = abbrev.replace(/[^a-z]/g, '').split('');
        let idx = 0;
        for (const char of full) {
          if (char === letters[idx]) idx++;
          if (idx === letters.length) return true;
        }
        return false;
      };
      if (expectedAlpha.length <= 5 && abbrevMatch(expectedAlpha, extractedAlpha)) return true;
      if (extractedAlpha.length <= 5 && abbrevMatch(extractedAlpha, expectedAlpha)) return true;
      return false;
    };
    
    if (!namesMatch(expectedGeneric, extractedGeneric)) {
      console.warn(`Name mismatch: expected "${medication.generic_name}", extracted "${extractedData.extracted_generic_name}"`);
      console.log(`Proceeding despite name difference since AI matched=true`);
    }

    const extractedBrands = extractedData.extracted_brand_names as string[] | undefined;

    // Build update payload with ALL extractable fields
    const updatePayload: Record<string, unknown> = {
      last_synced_at: new Date().toISOString(),
    };

    // Populate brand_names from label if currently empty
    if (extractedBrands && extractedBrands.length > 0 && (!medication.brand_names || medication.brand_names.length === 0)) {
      updatePayload.brand_names = extractedBrands;
    }

    // Helper to check if a value is non-empty (not null, not empty string, not empty array, not empty object)
    const isNonEmpty = (val: unknown): boolean => {
      if (val === null || val === undefined || val === '') return false;
      if (Array.isArray(val) && val.length === 0) return false;
      if (typeof val === 'object' && !Array.isArray(val) && Object.keys(val as object).length === 0) return false;
      return true;
    };

    // Original 7 fields
    if (isNonEmpty(extractedData.dosing_info)) updatePayload.dosing_info = extractedData.dosing_info;
    if (isNonEmpty(extractedData.safety_info)) updatePayload.safety_info = extractedData.safety_info;
    if (isNonEmpty(extractedData.pharmacokinetics)) updatePayload.pharmacokinetics = extractedData.pharmacokinetics;
    if (isNonEmpty(extractedData.adverse_reactions)) updatePayload.adverse_reactions = extractedData.adverse_reactions;
    if (isNonEmpty(extractedData.drug_interactions_info)) updatePayload.drug_interactions_info = extractedData.drug_interactions_info;
    if (isNonEmpty(extractedData.adjustments)) updatePayload.adjustments = extractedData.adjustments;
    if (isNonEmpty(extractedData.administration_info)) updatePayload.administration_info = extractedData.administration_info;

    // New nursing-specific fields
    if (isNonEmpty(extractedData.monitoring)) updatePayload.monitoring = extractedData.monitoring;
    if (isNonEmpty(extractedData.hold_parameters)) updatePayload.hold_parameters = extractedData.hold_parameters;
    if (isNonEmpty(extractedData.red_flags)) updatePayload.red_flags = extractedData.red_flags;
    if (isNonEmpty(extractedData.expected_effect)) updatePayload.expected_effect = extractedData.expected_effect;
    if (isNonEmpty(extractedData.documentation_reminders)) updatePayload.documentation_reminders = extractedData.documentation_reminders;
    if (isNonEmpty(extractedData.pause_triggers)) updatePayload.pause_triggers = extractedData.pause_triggers;
    if (isNonEmpty(extractedData.timing_rules)) updatePayload.timing_rules = extractedData.timing_rules;
    if (isNonEmpty(extractedData.safe_method)) updatePayload.safe_method = extractedData.safe_method;
    if (isNonEmpty(extractedData.rate_dilution)) updatePayload.rate_dilution = extractedData.rate_dilution;
    if (isNonEmpty(extractedData.line_compatibility)) updatePayload.line_compatibility = extractedData.line_compatibility;
    if (isNonEmpty(extractedData.required_resources)) updatePayload.required_resources = extractedData.required_resources;
    if (isNonEmpty(extractedData.patient_education)) updatePayload.patient_education = extractedData.patient_education;

    // Simple fields
    if (isNonEmpty(extractedData.dosage_form)) updatePayload.dosage_form = extractedData.dosage_form;
    if (isNonEmpty(extractedData.strengths)) updatePayload.strengths = extractedData.strengths;
    if (isNonEmpty(extractedData.manufacturer)) updatePayload.manufacturer = extractedData.manufacturer;

    // Store full extraction in fda_label_data for reference
    updatePayload.fda_label_data = {
      ...extractedData,
      extraction_date: new Date().toISOString(),
      source_url: labelUrl,
      extraction_method: 'ai_firecrawl',
    };

    // Set high_alert if boxed warning found
    const safetyInfo = extractedData.safety_info as Record<string, unknown> | undefined;
    if (safetyInfo?.boxed_warning && safetyInfo.boxed_warning !== 'null' && safetyInfo.boxed_warning !== '') {
      updatePayload.high_alert = true;
    }

    const { error: updateError } = await supabase
      .from('medications')
      .update(updatePayload)
      .eq('id', medicationId);

    if (updateError) {
      console.error('DB update error:', updateError);
      return new Response(
        JSON.stringify({ success: false, error: 'Failed to save extracted data to database' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Successfully extracted and saved FDA label data for ${medication.generic_name}`);

    return new Response(
      JSON.stringify({
        success: true,
        data: extractedData,
        fields_populated: Object.keys(updatePayload).filter(k => k !== 'last_synced_at'),
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('extract-fda-label error:', error);
    return new Response(
      JSON.stringify({ success: false, error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
