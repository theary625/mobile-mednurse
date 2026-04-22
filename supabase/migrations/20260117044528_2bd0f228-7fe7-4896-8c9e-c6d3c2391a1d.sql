
-- Update Vancomycin with comprehensive data
UPDATE medications SET
  dosing_info = '{
    "standard_dose": "15-20 mg/kg IV every 8-12 hours",
    "loading_dose": "25-30 mg/kg IV for severe infections",
    "max_dose": "Trough-guided dosing, target AUC 400-600",
    "indications": {
      "MRSA": "15-20 mg/kg IV q8-12h",
      "endocarditis": "15-20 mg/kg IV q8-12h for 6 weeks",
      "meningitis": "15-20 mg/kg IV q8-12h",
      "C_difficile": "125 mg PO q6h for 10 days"
    }
  }'::jsonb,
  administration_info = '{
    "routes": ["IV", "PO"],
    "IV": {
      "dilution": "Dilute in NS or D5W to concentration ≤5 mg/mL",
      "rate": "Infuse over at least 60 minutes (10 mg/min max)",
      "compatibility": "Compatible with most common IV fluids",
      "extravasation_risk": "Vesicant - causes tissue necrosis"
    },
    "PO": {
      "indication": "C. difficile colitis only - not absorbed systemically",
      "administration": "May be given with or without food"
    }
  }'::jsonb,
  safety_info = '{
    "black_box_warning": null,
    "contraindications": ["Known hypersensitivity to vancomycin"],
    "warnings": ["Nephrotoxicity", "Ototoxicity", "Red man syndrome", "DRESS syndrome"],
    "precautions": ["Renal impairment", "Hearing impairment", "Concurrent nephrotoxins"]
  }'::jsonb,
  monitoring = '{
    "vitals": true,
    "cardiac": false,
    "spo2": false,
    "neuro": false,
    "labs": ["Trough levels", "SCr", "BUN", "CBC"],
    "frequency": "Trough before 4th dose, then q48-72h",
    "parameters": ["Renal function", "Hearing", "Signs of Red Man Syndrome"]
  }'::jsonb,
  hold_parameters = '{
    "trough_high": ">20 mcg/mL - hold and notify provider",
    "scr_increase": ">0.5 mg/dL from baseline",
    "signs_toxicity": "Tinnitus, hearing changes"
  }'::jsonb,
  clinical_pearls = ARRAY[
    'Infuse over at least 60 minutes to prevent Red Man Syndrome',
    'Red Man Syndrome is a rate-related histamine release, not true allergy',
    'Trough levels drawn 30 min before 4th dose for steady state',
    'PO vancomycin only for C. diff - not absorbed systemically',
    'Adjust dose based on renal function using CrCl',
    'AUC-guided dosing preferred over trough-only monitoring',
    'Concomitant nephrotoxins (aminoglycosides, NSAIDs) increase renal risk'
  ]::text[],
  nursing_guide = '{
    "IV": {
      "appropriateness": "First-line for MRSA and serious gram-positive infections",
      "special_preparation": "Reconstitute with SWFI, then dilute in NS or D5W to ≤5 mg/mL",
      "administration": "Dedicated IV line preferred. Infuse over minimum 60 minutes. Extend to 90-120 min if dose >1.5g",
      "post_administration": "Monitor for Red Man Syndrome (flushing, rash). Flush line well",
      "patient_teaching": "Report any flushing, itching, rash, or ringing in ears immediately"
    },
    "PO": {
      "appropriateness": "C. difficile colitis treatment only",
      "administration": "Can be given with or without food. Complete full course",
      "patient_teaching": "This form stays in the gut - for intestinal infection only"
    }
  }'::jsonb,
  pharmacokinetics = '{
    "absorption": "Not absorbed orally (PO for local GI effect only)",
    "distribution": "Vd 0.4-1 L/kg, poor CNS penetration without inflammation",
    "metabolism": "Not significantly metabolized",
    "excretion": "Renal elimination (80-90% unchanged)",
    "half_life": "4-6 hours (prolonged in renal impairment)"
  }'::jsonb,
  adverse_reactions = '{
    "common": ["Red Man Syndrome", "Phlebitis", "Nausea"],
    "serious": ["Nephrotoxicity", "Ototoxicity", "DRESS syndrome", "Stevens-Johnson syndrome"],
    "rare": ["Neutropenia", "Thrombocytopenia", "Linear IgA bullous dermatosis"]
  }'::jsonb,
  drug_interactions_info = '{
    "major": [
      {"drug": "Aminoglycosides", "effect": "Increased nephrotoxicity and ototoxicity"},
      {"drug": "Amphotericin B", "effect": "Additive nephrotoxicity"},
      {"drug": "Cisplatin", "effect": "Increased ototoxicity risk"}
    ],
    "moderate": [
      {"drug": "NSAIDs", "effect": "May increase nephrotoxicity"},
      {"drug": "Loop diuretics", "effect": "Increased ototoxicity risk"},
      {"drug": "Piperacillin-tazobactam", "effect": "Possible increased AKI risk (controversial)"}
    ]
  }'::jsonb
WHERE LOWER(generic_name) = 'vancomycin';

-- Update Ceftriaxone with comprehensive data
UPDATE medications SET
  dosing_info = '{
    "standard_dose": "1-2 g IV/IM every 24 hours",
    "max_dose": "4 g/day",
    "indications": {
      "pneumonia": "1-2 g IV q24h",
      "meningitis": "2 g IV q12h",
      "gonorrhea": "500 mg IM once",
      "sepsis": "2 g IV q24h",
      "surgical_prophylaxis": "2 g IV within 60 min of incision"
    }
  }'::jsonb,
  administration_info = '{
    "routes": ["IV", "IM"],
    "IV_push": {
      "dilution": "Reconstitute with SWFI or NS",
      "rate": "Give over 2-4 minutes",
      "max_concentration": "100 mg/mL"
    },
    "IV_infusion": {
      "dilution": "Dilute in 50-100 mL NS or D5W",
      "rate": "Infuse over 30 minutes",
      "concentration": "10-40 mg/mL"
    },
    "IM": {
      "dilution": "Reconstitute with 1% lidocaine without epinephrine",
      "site": "Large muscle mass (gluteus, lateral thigh)",
      "max_volume": "2 mL per site"
    }
  }'::jsonb,
  safety_info = '{
    "black_box_warning": null,
    "contraindications": [
      "Hypersensitivity to cephalosporins",
      "Neonates with hyperbilirubinemia",
      "Neonates receiving calcium-containing IV products"
    ],
    "warnings": ["C. difficile-associated diarrhea", "Biliary sludging", "Hemolytic anemia"],
    "precautions": ["Penicillin allergy (cross-reactivity ~1%)", "Renal/hepatic impairment", "Prolonged use"]
  }'::jsonb,
  monitoring = '{
    "vitals": true,
    "cardiac": false,
    "spo2": false,
    "neuro": false,
    "labs": ["CBC", "LFTs", "BMP if prolonged use"],
    "frequency": "Baseline, then as indicated",
    "parameters": ["Signs of hypersensitivity", "Diarrhea", "Signs of superinfection"]
  }'::jsonb,
  hold_parameters = '{
    "signs_allergy": "Rash, urticaria, angioedema, anaphylaxis",
    "severe_diarrhea": "May indicate C. diff - collect stool specimen"
  }'::jsonb,
  clinical_pearls = ARRAY[
    'Once-daily dosing due to long half-life (6-9 hours)',
    'Do NOT mix with calcium-containing solutions (precipitate risk)',
    'Use lidocaine for IM reconstitution to reduce pain',
    'Good CNS penetration - suitable for meningitis',
    'Can cause biliary pseudolithiasis - usually reversible',
    'Cross-reactivity with penicillins is low (~1%)',
    'No dose adjustment needed for renal impairment alone'
  ]::text[],
  nursing_guide = '{
    "IV": {
      "appropriateness": "Broad-spectrum coverage for serious infections",
      "special_preparation": "Never mix with calcium-containing solutions. Reconstitute with SWFI or NS",
      "administration": "Infuse over 30 minutes for IVPB. May give IVP over 2-4 min if needed",
      "post_administration": "Monitor for allergic reaction. Observe injection site",
      "patient_teaching": "Report rash, itching, diarrhea, or difficulty breathing"
    },
    "IM": {
      "appropriateness": "Single-dose treatment (e.g., gonorrhea) or when IV not available",
      "special_preparation": "Reconstitute with 1% lidocaine without epinephrine to reduce pain",
      "administration": "Inject deep into large muscle. Use Z-track technique",
      "patient_teaching": "Some soreness at injection site is normal"
    }
  }'::jsonb,
  pharmacokinetics = '{
    "absorption": "IM bioavailability 100%",
    "distribution": "Vd 6-14 L, good CSF penetration with inflammation",
    "metabolism": "Not significantly metabolized",
    "excretion": "33-67% renal, 33-67% biliary",
    "half_life": "6-9 hours"
  }'::jsonb,
  adverse_reactions = '{
    "common": ["Diarrhea", "Injection site reaction", "Rash"],
    "serious": ["Anaphylaxis", "C. difficile colitis", "Hemolytic anemia", "Biliary sludging"],
    "rare": ["Stevens-Johnson syndrome", "Seizures", "Agranulocytosis"]
  }'::jsonb,
  drug_interactions_info = '{
    "major": [
      {"drug": "Calcium-containing IV products", "effect": "Fatal precipitates in neonates - contraindicated"},
      {"drug": "Warfarin", "effect": "May increase INR - monitor closely"}
    ],
    "moderate": [
      {"drug": "Aminoglycosides", "effect": "Synergistic activity but physical incompatibility"},
      {"drug": "Probenecid", "effect": "Decreases renal excretion"}
    ]
  }'::jsonb
WHERE LOWER(generic_name) = 'ceftriaxone';

-- Update Piperacillin-Tazobactam with comprehensive data
UPDATE medications SET
  dosing_info = '{
    "standard_dose": "3.375 g IV every 6 hours",
    "extended_infusion": "3.375 g IV over 4 hours every 8 hours",
    "max_dose": "18 g piperacillin/day",
    "indications": {
      "nosocomial_pneumonia": "4.5 g IV q6h",
      "intra_abdominal": "3.375 g IV q6h",
      "skin_soft_tissue": "3.375 g IV q6h",
      "febrile_neutropenia": "4.5 g IV q6h"
    },
    "renal_adjustment": {
      "CrCl_20-40": "2.25 g IV q6h",
      "CrCl_less_than_20": "2.25 g IV q8h",
      "hemodialysis": "2.25 g IV q8h + 0.75 g after HD"
    }
  }'::jsonb,
  administration_info = '{
    "routes": ["IV"],
    "IV_intermittent": {
      "dilution": "Reconstitute then dilute in 50-150 mL NS or D5W",
      "rate": "Infuse over 30 minutes",
      "concentration": "20-80 mg/mL"
    },
    "IV_extended": {
      "dilution": "Dilute in 100-150 mL",
      "rate": "Infuse over 4 hours",
      "rationale": "Extended infusion optimizes time above MIC"
    }
  }'::jsonb,
  safety_info = '{
    "black_box_warning": null,
    "contraindications": ["Hypersensitivity to penicillins, cephalosporins, or beta-lactam inhibitors"],
    "warnings": ["C. difficile-associated diarrhea", "Seizures at high doses", "Bleeding manifestations"],
    "precautions": ["Renal impairment", "Sodium content (2.35 mEq/g)", "Prolonged use - superinfection risk"]
  }'::jsonb,
  monitoring = '{
    "vitals": true,
    "cardiac": false,
    "spo2": false,
    "neuro": true,
    "labs": ["CBC", "BMP", "LFTs", "PT/INR if bleeding risk"],
    "frequency": "Baseline, then twice weekly for prolonged therapy",
    "parameters": ["Signs of bleeding", "Diarrhea", "Seizure activity", "Renal function"]
  }'::jsonb,
  hold_parameters = '{
    "severe_diarrhea": "May indicate C. diff",
    "seizures": "Hold and notify provider",
    "signs_allergy": "Rash, urticaria, anaphylaxis"
  }'::jsonb,
  clinical_pearls = ARRAY[
    'Extended infusion (over 4 hours) improves clinical outcomes for serious infections',
    'Contains significant sodium - consider in heart failure/fluid restriction',
    'Good Pseudomonas coverage when used appropriately',
    'Often combined with vancomycin for broad empiric coverage',
    'Monitor for bleeding due to anti-platelet effect',
    'Physically incompatible with aminoglycosides - use separate lines',
    'Adjust dose for renal impairment'
  ]::text[],
  nursing_guide = '{
    "IV": {
      "appropriateness": "Broad-spectrum including Pseudomonas and anaerobes",
      "special_preparation": "Reconstitute with SWFI or NS, then dilute. Check for particulates",
      "administration": "Standard: 30-min infusion. Extended: 4-hour infusion for severe infections",
      "post_administration": "Monitor for allergic reaction and diarrhea",
      "patient_teaching": "Report rash, diarrhea, bleeding, or signs of infection worsening"
    }
  }'::jsonb,
  pharmacokinetics = '{
    "absorption": "IV only",
    "distribution": "Vd 0.18-0.3 L/kg, good tissue penetration",
    "metabolism": "Minimal hepatic metabolism",
    "excretion": "Primarily renal (70% unchanged)",
    "half_life": "Piperacillin 0.7-1.2 hours, Tazobactam 0.7-0.9 hours"
  }'::jsonb,
  adverse_reactions = '{
    "common": ["Diarrhea", "Constipation", "Nausea", "Headache", "Insomnia"],
    "serious": ["C. difficile colitis", "Anaphylaxis", "Seizures", "Leukopenia", "Bleeding"],
    "rare": ["Stevens-Johnson syndrome", "Interstitial nephritis", "Hemolytic anemia"]
  }'::jsonb,
  drug_interactions_info = '{
    "major": [
      {"drug": "Methotrexate", "effect": "Decreased methotrexate clearance - increased toxicity"},
      {"drug": "Probenecid", "effect": "Prolongs half-life of piperacillin"}
    ],
    "moderate": [
      {"drug": "Aminoglycosides", "effect": "Physical incompatibility - use separate lines"},
      {"drug": "Warfarin", "effect": "May increase bleeding risk"},
      {"drug": "Vancomycin", "effect": "Possible increased AKI risk (controversial)"}
    ]
  }'::jsonb
WHERE LOWER(generic_name) = 'piperacillin-tazobactam' OR LOWER(generic_name) = 'piperacillin/tazobactam';

-- Update Azithromycin with comprehensive data
UPDATE medications SET
  dosing_info = '{
    "standard_dose": "500 mg PO/IV day 1, then 250 mg daily days 2-5",
    "Z-pack": "500 mg day 1, then 250 mg days 2-5 (total 1.5 g)",
    "single_dose": "1 g PO once for chlamydia",
    "indications": {
      "CAP": "500 mg PO/IV daily x 3 days or Z-pack",
      "chlamydia": "1 g PO once",
      "MAC_prophylaxis": "1200 mg PO weekly",
      "pertussis": "500 mg day 1, then 250 mg days 2-5"
    }
  }'::jsonb,
  administration_info = '{
    "routes": ["PO", "IV"],
    "PO": {
      "tablets": "May take with or without food",
      "suspension": "Shake well. Extended-release: take on empty stomach"
    },
    "IV": {
      "dilution": "Reconstitute with SWFI, then dilute to 1-2 mg/mL",
      "rate": "Infuse 500 mg over at least 60 minutes",
      "concentration": "1-2 mg/mL (max 2 mg/mL)"
    }
  }'::jsonb,
  safety_info = '{
    "black_box_warning": null,
    "contraindications": ["Hypersensitivity to azithromycin or macrolides", "History of cholestatic jaundice with azithromycin"],
    "warnings": ["QT prolongation", "Hepatotoxicity", "C. difficile-associated diarrhea", "Myasthenia gravis exacerbation"],
    "precautions": ["Pre-existing cardiac disease", "Electrolyte abnormalities", "Concurrent QT-prolonging drugs"]
  }'::jsonb,
  monitoring = '{
    "vitals": true,
    "cardiac": true,
    "spo2": false,
    "neuro": false,
    "labs": ["LFTs if prolonged use", "ECG if cardiac risk"],
    "frequency": "As clinically indicated",
    "parameters": ["QT interval if at risk", "Signs of hepatotoxicity", "Diarrhea"]
  }'::jsonb,
  hold_parameters = '{
    "QTc_prolongation": "QTc >500 ms or increase >60 ms",
    "liver_toxicity": "Jaundice, elevated LFTs >3x ULN",
    "severe_diarrhea": "May indicate C. diff"
  }'::jsonb,
  clinical_pearls = ARRAY[
    'Long half-life (68 hours) allows for short courses',
    'Tissue concentrations remain therapeutic for 5-7 days after last dose',
    'QT prolongation risk - avoid with other QT-prolonging drugs',
    'Excellent atypical coverage (Mycoplasma, Chlamydia, Legionella)',
    'IV infusion must be over at least 60 minutes to prevent pain/inflammation',
    'Food does not affect absorption of immediate-release forms',
    'Drug interactions less common than with erythromycin or clarithromycin'
  ]::text[],
  nursing_guide = '{
    "PO": {
      "appropriateness": "Respiratory infections, STIs, atypical pathogens",
      "administration": "Tablets may be taken with or without food. Shake suspension well",
      "patient_teaching": "Complete full course even if feeling better. Report irregular heartbeat or palpitations"
    },
    "IV": {
      "appropriateness": "When oral not tolerated or for serious infections",
      "special_preparation": "Reconstitute with SWFI, then dilute to 1-2 mg/mL in NS or D5W",
      "administration": "Infuse over at least 60 minutes. Do not give as bolus",
      "post_administration": "Monitor IV site for pain/phlebitis",
      "patient_teaching": "Report pain at IV site, palpitations, or yellowing of skin/eyes"
    }
  }'::jsonb,
  pharmacokinetics = '{
    "absorption": "37% oral bioavailability",
    "distribution": "Vd 31 L/kg, extensive tissue penetration, concentrates in WBCs",
    "metabolism": "Hepatic demethylation",
    "excretion": "Primarily biliary (unchanged)",
    "half_life": "68 hours (allows short courses)"
  }'::jsonb,
  adverse_reactions = '{
    "common": ["Diarrhea", "Nausea", "Abdominal pain", "Headache"],
    "serious": ["QT prolongation/Torsades", "Hepatotoxicity", "C. difficile colitis", "Anaphylaxis"],
    "rare": ["Stevens-Johnson syndrome", "Hearing loss", "Myasthenia gravis exacerbation"]
  }'::jsonb,
  drug_interactions_info = '{
    "major": [
      {"drug": "QT-prolonging drugs", "effect": "Additive QT prolongation - avoid combination"},
      {"drug": "Nelfinavir", "effect": "Increased azithromycin levels"}
    ],
    "moderate": [
      {"drug": "Warfarin", "effect": "May increase INR - monitor"},
      {"drug": "Digoxin", "effect": "May increase digoxin levels"},
      {"drug": "Antacids", "effect": "Separate by 2 hours (aluminum/magnesium)"}
    ]
  }'::jsonb
WHERE LOWER(generic_name) = 'azithromycin';

-- Update Ciprofloxacin with comprehensive data
UPDATE medications SET
  dosing_info = '{
    "standard_dose": "250-750 mg PO every 12 hours OR 200-400 mg IV every 12 hours",
    "max_dose": "1500 mg/day PO, 800 mg/day IV",
    "indications": {
      "UTI_uncomplicated": "250 mg PO q12h x 3 days",
      "UTI_complicated": "500 mg PO q12h OR 400 mg IV q12h",
      "pneumonia": "400 mg IV q8h",
      "anthrax_prophylaxis": "500 mg PO q12h x 60 days",
      "intra_abdominal": "400 mg IV q12h + metronidazole"
    },
    "renal_adjustment": {
      "CrCl_30-50": "250-500 mg PO q12h",
      "CrCl_5-29": "250-500 mg PO q18-24h",
      "hemodialysis": "250-500 mg q24h after dialysis"
    }
  }'::jsonb,
  administration_info = '{
    "routes": ["PO", "IV"],
    "PO": {
      "tablets": "Take with or without food, but avoid dairy alone",
      "timing": "2 hours before or 6 hours after antacids, calcium, iron, zinc",
      "hydration": "Maintain adequate hydration to prevent crystalluria"
    },
    "IV": {
      "dilution": "Premixed bags available, or dilute to 1-2 mg/mL",
      "rate": "Infuse 200 mg over 30 min, 400 mg over 60 min",
      "concentration": "1-2 mg/mL"
    }
  }'::jsonb,
  safety_info = '{
    "black_box_warning": "Tendinitis and tendon rupture risk. Peripheral neuropathy. CNS effects. Exacerbation of myasthenia gravis.",
    "contraindications": ["Hypersensitivity to fluoroquinolones", "Concurrent tizanidine use"],
    "warnings": ["QT prolongation", "Aortic aneurysm risk", "Hypoglycemia", "Photosensitivity", "C. diff"],
    "precautions": ["Age >60", "Corticosteroid use", "Renal impairment", "Diabetes", "History of seizures"]
  }'::jsonb,
  monitoring = '{
    "vitals": true,
    "cardiac": true,
    "spo2": false,
    "neuro": true,
    "labs": ["BMP", "Blood glucose if diabetic", "ECG if cardiac risk"],
    "frequency": "As clinically indicated",
    "parameters": ["Tendon pain", "Neurological symptoms", "QT interval", "Blood glucose"]
  }'::jsonb,
  hold_parameters = '{
    "tendon_pain": "STOP immediately - tendon rupture risk",
    "neuropathy": "Tingling, numbness - may be irreversible",
    "CNS_effects": "Seizures, confusion, hallucinations",
    "QTc_prolongation": "QTc >500 ms"
  }'::jsonb,
  clinical_pearls = ARRAY[
    'BLACK BOX WARNING: Tendinitis/rupture, neuropathy, CNS effects, MG exacerbation',
    'Avoid in elderly and those on corticosteroids (increased tendon rupture risk)',
    'Excellent bioavailability PO (70-80%) - IV to PO conversion usually 1:1',
    'Chelates with divalent cations - separate from calcium, antacids, iron',
    'Monitor blood glucose in diabetics - both hypo and hyperglycemia reported',
    'Reserve for infections without safer alternatives',
    'Photosensitivity - advise sun protection'
  ]::text[],
  nursing_guide = '{
    "PO": {
      "appropriateness": "Reserve for infections without safer alternatives due to black box warnings",
      "administration": "Give 2 hours before or 6 hours after antacids, dairy, calcium, iron",
      "patient_teaching": "Report tendon pain immediately - STOP taking. Avoid excessive sun. Stay well hydrated. Report numbness/tingling"
    },
    "IV": {
      "appropriateness": "When oral not tolerated or for serious infections",
      "special_preparation": "Use premixed bags or dilute to 1-2 mg/mL",
      "administration": "200 mg over 30 min, 400 mg over 60 min. Avoid rapid infusion",
      "post_administration": "Monitor IV site. Assess for adverse effects",
      "patient_teaching": "Report tendon pain, weakness, numbness, or confusion immediately"
    }
  }'::jsonb,
  pharmacokinetics = '{
    "absorption": "70-80% oral bioavailability",
    "distribution": "Vd 2-3 L/kg, good tissue penetration",
    "metabolism": "Hepatic (15% CYP1A2)",
    "excretion": "40-50% renal unchanged, 15% fecal",
    "half_life": "4 hours (prolonged in renal impairment)"
  }'::jsonb,
  adverse_reactions = '{
    "common": ["Nausea", "Diarrhea", "Headache", "Dizziness", "Insomnia"],
    "serious": ["Tendon rupture", "Peripheral neuropathy", "QT prolongation", "Seizures", "Aortic aneurysm", "C. diff"],
    "rare": ["Stevens-Johnson syndrome", "Hepatic failure", "Psychosis"]
  }'::jsonb,
  drug_interactions_info = '{
    "major": [
      {"drug": "Tizanidine", "effect": "Contraindicated - dramatic increase in tizanidine levels"},
      {"drug": "Theophylline", "effect": "Increased theophylline levels - toxicity risk"},
      {"drug": "QT-prolonging drugs", "effect": "Additive QT prolongation"}
    ],
    "moderate": [
      {"drug": "Antacids/Calcium/Iron", "effect": "Chelation - separate administration times"},
      {"drug": "Warfarin", "effect": "Increased INR - monitor closely"},
      {"drug": "Sulfonylureas", "effect": "Hypoglycemia risk"},
      {"drug": "Caffeine", "effect": "Reduced caffeine metabolism"}
    ]
  }'::jsonb
WHERE LOWER(generic_name) = 'ciprofloxacin';
