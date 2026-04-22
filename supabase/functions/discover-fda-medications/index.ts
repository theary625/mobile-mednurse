import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Top hospital medications by therapeutic category
const COMMON_HOSPITAL_MEDICATIONS = [
  // Cardiovascular
  'metoprolol', 'lisinopril', 'amlodipine', 'atorvastatin', 'losartan', 'carvedilol', 
  'diltiazem', 'verapamil', 'hydralazine', 'labetalol', 'nicardipine', 'clevidipine',
  'esmolol', 'nitroprusside', 'nitroglycerin', 'isosorbide', 'digoxin', 'amiodarone',
  'flecainide', 'propafenone', 'dofetilide', 'sotalol', 'dronedarone',
  
  // Antibiotics
  'ceftriaxone', 'cefepime', 'ceftazidime', 'cefazolin', 'cefoxitin', 'cefuroxime',
  'piperacillin', 'ampicillin', 'nafcillin', 'oxacillin', 'penicillin', 
  'vancomycin', 'daptomycin', 'linezolid', 'tedizolid', 'telavancin',
  'meropenem', 'imipenem', 'ertapenem', 'doripenem', 'aztreonam',
  'ciprofloxacin', 'levofloxacin', 'moxifloxacin', 'gentamicin', 'tobramycin', 
  'amikacin', 'azithromycin', 'clarithromycin', 'doxycycline', 'tigecycline',
  'metronidazole', 'clindamycin', 'trimethoprim', 'nitrofurantoin',
  'caspofungin', 'micafungin', 'anidulafungin', 'fluconazole', 'voriconazole',
  'amphotericin', 'isavuconazole', 'posaconazole',
  
  // Anticoagulants
  'heparin', 'enoxaparin', 'fondaparinux', 'bivalirudin', 'argatroban',
  'warfarin', 'rivaroxaban', 'apixaban', 'edoxaban', 'dabigatran',
  'alteplase', 'reteplase', 'tenecteplase', 'streptokinase',
  
  // Vasopressors/Inotropes
  'norepinephrine', 'epinephrine', 'dopamine', 'dobutamine', 'vasopressin',
  'phenylephrine', 'milrinone', 'isoproterenol', 'angiotensin',
  
  // Sedatives/Analgesics
  'propofol', 'midazolam', 'lorazepam', 'diazepam', 'ketamine', 'dexmedetomidine',
  'fentanyl', 'morphine', 'hydromorphone', 'remifentanil', 'sufentanil',
  'meperidine', 'methadone', 'buprenorphine', 'naloxone', 'naltrexone',
  'acetaminophen', 'ibuprofen', 'ketorolac', 'celecoxib', 'meloxicam',
  
  // Neuromuscular Blockers
  'rocuronium', 'vecuronium', 'cisatracurium', 'succinylcholine', 'sugammadex',
  
  // Electrolytes/Fluids
  'potassium chloride', 'magnesium sulfate', 'calcium gluconate', 'calcium chloride',
  'sodium bicarbonate', 'sodium chloride', 'dextrose', 'phosphorus',
  
  // GI Medications
  'pantoprazole', 'omeprazole', 'esomeprazole', 'famotidine', 'ranitidine',
  'ondansetron', 'granisetron', 'prochlorperazine', 'promethazine', 'metoclopramide',
  'lactulose', 'polyethylene glycol', 'bisacodyl', 'docusate', 'senna',
  
  // Diabetes
  'insulin regular', 'insulin lispro', 'insulin aspart', 'insulin glargine', 
  'insulin detemir', 'insulin degludec', 'metformin', 'glipizide', 'glyburide',
  'sitagliptin', 'empagliflozin', 'dapagliflozin', 'liraglutide', 'semaglutide',
  
  // Steroids
  'methylprednisolone', 'prednisone', 'prednisolone', 'dexamethasone', 
  'hydrocortisone', 'fludrocortisone', 'budesonide', 'triamcinolone',
  
  // Respiratory
  'albuterol', 'ipratropium', 'tiotropium', 'budesonide', 'fluticasone',
  'montelukast', 'theophylline', 'epoprostenol', 'treprostinil',
  
  // Anticonvulsants
  'levetiracetam', 'phenytoin', 'fosphenytoin', 'valproic acid', 'carbamazepine',
  'lacosamide', 'phenobarbital', 'lorazepam', 'diazepam', 'topiramate',
  
  // Psychiatry
  'haloperidol', 'olanzapine', 'quetiapine', 'risperidone', 'aripiprazole',
  'sertraline', 'escitalopram', 'fluoxetine', 'venlafaxine', 'duloxetine',
  'trazodone', 'mirtazapine', 'bupropion', 'lithium',
  
  // Diuretics
  'furosemide', 'bumetanide', 'torsemide', 'hydrochlorothiazide', 'chlorthalidone',
  'spironolactone', 'eplerenone', 'metolazone', 'acetazolamide', 'mannitol',
  
  // Blood Products/Reversal
  'albumin', 'fresh frozen plasma', 'prothrombin complex', 'factor viii',
  'phytonadione', 'protamine', 'idarucizumab', 'andexanet',
  
  // Immunosuppressants
  'tacrolimus', 'cyclosporine', 'mycophenolate', 'azathioprine', 'sirolimus',
  'basiliximab', 'rituximab', 'infliximab', 'adalimumab',
  
  // Chemotherapy (common supportive)
  'filgrastim', 'pegfilgrastim', 'epoetin', 'darbepoetin', 'iron sucrose',
  'leucovorin', 'mesna', 'dexrazoxane', 'amifostine',
];

interface DiscoveredMedication {
  name: string;
  brand_names: string[];
  manufacturer: string;
  set_id: string;
  source: string;
}

async function searchOpenFDA(drugName: string): Promise<DiscoveredMedication | null> {
  try {
    const searchTerms = [
      `openfda.generic_name:"${drugName}"`,
      `openfda.brand_name:"${drugName}"`,
    ];
    
    for (const searchTerm of searchTerms) {
      const url = `https://api.fda.gov/drug/label.json?search=${encodeURIComponent(searchTerm)}&limit=1`;
      const response = await fetch(url);
      
      if (response.ok) {
        const data = await response.json();
        if (data.results && data.results.length > 0) {
          const result = data.results[0];
          return {
            name: result.openfda?.generic_name?.[0] || drugName,
            brand_names: result.openfda?.brand_name || [],
            manufacturer: result.openfda?.manufacturer_name?.[0] || '',
            set_id: result.set_id || result.id,
            source: 'openfda',
          };
        }
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
    const { action = 'discover', limit = 50 } = await req.json();

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get existing medications
    const { data: existingMeds, error: fetchError } = await supabase
      .from('medications')
      .select('generic_name');

    if (fetchError) throw fetchError;

    const existingNames = new Set(
      (existingMeds || []).map(m => m.generic_name.toLowerCase())
    );

    if (action === 'discover') {
      // Find medications we don't have
      const missing: { name: string; found_in_fda: boolean }[] = [];
      let checked = 0;

      for (const med of COMMON_HOSPITAL_MEDICATIONS) {
        if (checked >= limit) break;
        
        const lowerMed = med.toLowerCase();
        const alreadyExists = Array.from(existingNames).some(existing => 
          existing.includes(lowerMed) || lowerMed.includes(existing.split(' ')[0])
        );
        
        if (!alreadyExists) {
          // Quick check if it exists in FDA
          const fdaResult = await searchOpenFDA(med);
          missing.push({
            name: med,
            found_in_fda: fdaResult !== null,
          });
          checked++;
          
          // Rate limiting
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      }

      return new Response(
        JSON.stringify({
          success: true,
          total_checked: checked,
          missing_medications: missing,
          existing_count: existingNames.size,
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (action === 'import') {
      // Import missing medications from FDA
      const imported: string[] = [];
      const failed: string[] = [];
      let processed = 0;

      for (const med of COMMON_HOSPITAL_MEDICATIONS) {
        if (processed >= limit) break;

        const lowerMed = med.toLowerCase();
        const alreadyExists = Array.from(existingNames).some(existing =>
          existing.includes(lowerMed) || lowerMed.includes(existing.split(' ')[0])
        );

        if (!alreadyExists) {
          const fdaResult = await searchOpenFDA(med);
          
          if (fdaResult) {
            // Insert new medication
            const { error: insertError } = await supabase
              .from('medications')
              .insert({
                generic_name: fdaResult.name.charAt(0).toUpperCase() + fdaResult.name.slice(1).toLowerCase(),
                brand_names: fdaResult.brand_names.slice(0, 5),
                manufacturer: fdaResult.manufacturer,
                fda_set_id: fdaResult.set_id,
                fda_label_url: `https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=${fdaResult.set_id}`,
                sync_source: 'openfda_import',
                last_synced_at: new Date().toISOString(),
                content_status: 'draft',
              });

            if (insertError) {
              console.error(`Insert error for ${med}:`, insertError.message);
              failed.push(med);
            } else {
              imported.push(fdaResult.name);
            }
          } else {
            failed.push(med);
          }
          
          processed++;
          await new Promise(resolve => setTimeout(resolve, 200));
        }
      }

      return new Response(
        JSON.stringify({
          success: true,
          imported_count: imported.length,
          failed_count: failed.length,
          imported,
          failed,
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ success: false, error: 'Invalid action' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Discover FDA medications error:', error);
    return new Response(
      JSON.stringify({ success: false, error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
