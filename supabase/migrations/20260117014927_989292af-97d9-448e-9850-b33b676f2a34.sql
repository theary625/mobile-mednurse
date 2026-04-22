
-- Update Ceftriaxone with comprehensive data
UPDATE public.medications SET
  dosing_info = '{
    "standard_dose": "1-2 g IV/IM q24h",
    "max_dose": "4 g/day",
    "frequency": "Once daily (q24h) or divided q12h for meningitis",
    "indications": {
      "pneumonia": "1-2 g IV q24h",
      "meningitis": "2 g IV q12h",
      "gonorrhea": "500 mg IM x1 dose",
      "skin_soft_tissue": "1-2 g IV q24h",
      "intra_abdominal": "1-2 g IV q24h (with metronidazole)",
      "sepsis": "2 g IV q24h"
    }
  }'::jsonb,
  administration_info = '{
    "routes": {
      "IV": {
        "method": "Intermittent IV infusion or IV push",
        "dilution": "Dilute in 50-100 mL NS or D5W",
        "rate": "Infuse over 30 minutes; push over 2-4 minutes",
        "compatibility": "Do NOT mix with calcium-containing solutions",
        "notes": ["Incompatible with calcium - can form precipitate", "Flush line before/after calcium products", "Y-site incompatible with many drugs"]
      },
      "IM": {
        "method": "Deep IM injection",
        "dilution": "Reconstitute with lidocaine 1% for pain reduction",
        "site": "Large muscle mass (gluteal)",
        "notes": ["Max 1 g per injection site", "Painful without lidocaine"]
      }
    }
  }'::jsonb,
  safety_info = '{
    "contraindications": ["Cephalosporin allergy", "Neonates with hyperbilirubinemia", "Neonates receiving calcium-containing IV products"],
    "warnings": ["Calcium-ceftriaxone precipitates - fatal in neonates", "C. diff associated diarrhea", "Biliary sludging/pseudolithiasis", "Cross-reactivity with penicillin allergy (1-2%)"],
    "pregnancy_category": "B",
    "geriatric_considerations": "No adjustment needed; monitor renal function"
  }'::jsonb,
  monitoring = '{
    "vitals_required": false,
    "cardiac_monitoring": false,
    "spo2_monitoring": false,
    "neuro_monitoring": false,
    "frequency": "Daily during therapy",
    "parameters": ["Signs of infection", "CBC", "Renal function", "LFTs with prolonged use", "Signs of C. diff"]
  }'::jsonb,
  clinical_pearls = ARRAY[
    'Long half-life allows once-daily dosing',
    'NEVER mix with calcium-containing solutions - fatal precipitates reported in neonates',
    'Biliary sludging may cause RUQ pain - reversible on discontinuation',
    'High biliary excretion - good for cholangitis',
    'Crosses blood-brain barrier - use higher doses for meningitis',
    '1-2% cross-reactivity with penicillin allergy'
  ],
  nursing_guide = '{
    "IV": {
      "appropriateness": "Most infections requiring parenteral cephalosporin",
      "special_preparation": ["Verify NO calcium in same line", "Check allergy history including penicillins"],
      "administration": ["Infuse over 30 min", "Flush line if calcium products given separately", "Do not Y-site with calcium"],
      "post_administration": ["Monitor for allergic reaction", "Assess for C. diff symptoms", "Document response to therapy"],
      "patient_teaching": ["Report diarrhea especially bloody/watery", "Complete full course", "Report rash or breathing difficulty"]
    },
    "IM": {
      "appropriateness": "Outpatient treatment, gonorrhea, when IV not available",
      "special_preparation": ["Reconstitute with 1% lidocaine", "Use large gauge needle"],
      "administration": ["Deep gluteal injection", "Max 1g per site", "Aspirate before injection"],
      "patient_teaching": ["Injection site may be sore", "Report signs of infection worsening"]
    }
  }'::jsonb,
  pharmacokinetics = '{
    "absorption": "IM: Complete absorption",
    "distribution": "Widely distributed, crosses BBB when meninges inflamed",
    "metabolism": "Minimal hepatic metabolism",
    "excretion": "Biliary (40%) and renal (60%)",
    "half_life": "6-9 hours"
  }'::jsonb,
  adverse_reactions = '{
    "common": ["Diarrhea", "Injection site pain", "Rash", "Eosinophilia"],
    "serious": ["Anaphylaxis", "C. difficile colitis", "Biliary sludging", "Hemolytic anemia", "Calcium-ceftriaxone precipitates"],
    "frequency": {"diarrhea": "3-5%", "rash": "1-2%", "injection_pain": "5-10%"}
  }'::jsonb,
  drug_interactions_info = '{
    "major": ["Calcium-containing products - precipitation risk", "Warfarin - increased INR"],
    "moderate": ["Probenecid - increased ceftriaxone levels"],
    "contraindicated": ["Calcium IV in neonates"]
  }'::jsonb,
  safe_method = '{"preferred_method": "IV infusion", "infusion_time": "30 minutes", "requires_pump": false}'::jsonb,
  red_flags = '{"early_danger_signs": ["Anaphylaxis", "Severe diarrhea/C. diff", "RUQ pain (biliary sludge)", "Jaundice in neonates"]}'::jsonb
WHERE LOWER(generic_name) = 'ceftriaxone';

-- Update Piperacillin/Tazobactam with comprehensive data
UPDATE public.medications SET
  dosing_info = '{
    "standard_dose": "3.375 g IV q6h or 4.5 g IV q6-8h",
    "max_dose": "18 g piperacillin/day",
    "frequency": "q6h standard; q8h extended infusion",
    "indications": {
      "hospital_acquired_pneumonia": "4.5 g IV q6h",
      "intra_abdominal": "3.375 g IV q6h",
      "skin_soft_tissue": "3.375 g IV q6h",
      "febrile_neutropenia": "4.5 g IV q6h",
      "pseudomonas": "4.5 g IV q6h or extended infusion"
    },
    "renal_adjustment": {
      "CrCl_20_40": "2.25 g IV q6h",
      "CrCl_less_20": "2.25 g IV q8h",
      "hemodialysis": "2.25 g IV q8h + dose after HD"
    }
  }'::jsonb,
  administration_info = '{
    "routes": {
      "IV": {
        "method": "Intermittent infusion or extended infusion",
        "dilution": "50-150 mL NS or D5W",
        "rate": "Standard: 30 minutes; Extended: 4 hours",
        "compatibility": "Incompatible with aminoglycosides - flush between",
        "notes": ["Extended infusion improves PK/PD for Pseudomonas", "Contains sodium - consider in CHF/HTN", "Y-site incompatible with vancomycin"]
      }
    }
  }'::jsonb,
  safety_info = '{
    "contraindications": ["Penicillin allergy with anaphylaxis history"],
    "warnings": ["Sodium content (2.35 mEq/g)", "Bleeding risk - inhibits platelet aggregation", "Seizures at high doses", "C. diff associated diarrhea", "Hypokalemia"],
    "pregnancy_category": "B",
    "geriatric_considerations": "Adjust for renal function; monitor for bleeding"
  }'::jsonb,
  monitoring = '{
    "vitals_required": false,
    "cardiac_monitoring": false,
    "spo2_monitoring": false,
    "neuro_monitoring": false,
    "frequency": "Daily",
    "parameters": ["Renal function", "CBC/platelets", "Signs of bleeding", "K+ levels", "Signs of C. diff"]
  }'::jsonb,
  clinical_pearls = ARRAY[
    'Extended infusion (4 hours) improves time above MIC for resistant organisms',
    'Covers Pseudomonas - but resistance increasing',
    'Contains significant sodium - 2.35 mEq per gram piperacillin',
    'Inhibits platelet aggregation - watch for bleeding',
    'Space aminoglycosides by 1+ hour to avoid inactivation',
    'Can cause false-positive galactomannan for Aspergillus'
  ],
  nursing_guide = '{
    "IV": {
      "appropriateness": "Broad-spectrum coverage including Pseudomonas and anaerobes",
      "special_preparation": ["Verify penicillin allergy status", "Reconstitute properly", "Check renal function for dosing"],
      "administration": ["Standard: 30 min infusion", "Extended: 4 hour infusion", "Do NOT Y-site with aminoglycosides"],
      "post_administration": ["Monitor for allergic reaction", "Assess for bleeding", "Check K+ levels", "Monitor for C. diff"],
      "patient_teaching": ["Report diarrhea", "Report unusual bleeding/bruising", "Complete full course"]
    }
  }'::jsonb,
  pharmacokinetics = '{
    "absorption": "IV only",
    "distribution": "Widely distributed, low protein binding (30%)",
    "metabolism": "Minimal",
    "excretion": "Renal (70% unchanged)",
    "half_life": "0.7-1.2 hours"
  }'::jsonb,
  adverse_reactions = '{
    "common": ["Diarrhea", "Nausea", "Rash", "Thrombophlebitis"],
    "serious": ["Anaphylaxis", "C. difficile colitis", "Bleeding", "Seizures", "Hypokalemia"],
    "frequency": {"diarrhea": "7-11%", "rash": "1-2%", "nausea": "3-5%"}
  }'::jsonb,
  drug_interactions_info = '{
    "major": ["Aminoglycosides - inactivation if mixed", "Methotrexate - decreased clearance"],
    "moderate": ["Warfarin - increased bleeding risk", "Probenecid - increased levels"],
    "monitoring_required": ["Anticoagulants", "Vecuronium - prolonged paralysis"]
  }'::jsonb,
  safe_method = '{"preferred_method": "IV infusion", "infusion_time": "30 min standard or 4 hours extended", "requires_pump": true}'::jsonb,
  red_flags = '{"early_danger_signs": ["Anaphylaxis", "Severe diarrhea", "Unusual bleeding", "Seizures"]}'::jsonb
WHERE LOWER(generic_name) LIKE '%piperacillin%tazobactam%' OR LOWER(generic_name) = 'piperacillin-tazobactam' OR LOWER(generic_name) = 'piperacillin/tazobactam';

-- Update Azithromycin with comprehensive data
UPDATE public.medications SET
  dosing_info = '{
    "standard_dose": "PO: 500 mg day 1, then 250 mg days 2-5; IV: 500 mg daily",
    "max_dose": "500 mg/day IV; 2 g single dose for STIs",
    "frequency": "Once daily",
    "indications": {
      "community_acquired_pneumonia": "500 mg PO/IV x1, then 250 mg daily x4 days",
      "copd_exacerbation": "500 mg daily x3 days",
      "sinusitis": "500 mg daily x3 days",
      "chlamydia": "1 g PO x1 dose",
      "gonorrhea": "2 g PO x1 dose (with ceftriaxone)",
      "mac_prophylaxis": "1200 mg weekly"
    }
  }'::jsonb,
  administration_info = '{
    "routes": {
      "PO": {
        "method": "Oral tablets, suspension, or Z-pack",
        "timing": "May take with or without food",
        "notes": ["Suspension can be taken with food to improve taste", "Extended-release: take on empty stomach"]
      },
      "IV": {
        "method": "Intermittent IV infusion",
        "dilution": "250-500 mL NS or D5W (1-2 mg/mL)",
        "rate": "Infuse over 1-3 hours (1 mg/mL over 3h; 2 mg/mL over 1h)",
        "notes": ["Do NOT give as bolus or IM", "Pain/inflammation at injection site common"]
      }
    }
  }'::jsonb,
  safety_info = '{
    "black_box_warning": null,
    "contraindications": ["History of cholestatic jaundice with azithromycin", "Macrolide hypersensitivity"],
    "warnings": ["QT prolongation - avoid with other QT-prolonging drugs", "Hepatotoxicity", "Myasthenia gravis exacerbation", "C. diff colitis"],
    "pregnancy_category": "B",
    "geriatric_considerations": "Monitor QTc; increased risk of cardiac events"
  }'::jsonb,
  monitoring = '{
    "vitals_required": false,
    "cardiac_monitoring": false,
    "spo2_monitoring": false,
    "neuro_monitoring": false,
    "frequency": "As needed",
    "parameters": ["Signs of infection resolution", "LFTs if prolonged use", "ECG if QT risk factors", "Signs of C. diff"]
  }'::jsonb,
  clinical_pearls = ARRAY[
    'Long tissue half-life - 5 days of tissue coverage from Z-pack',
    'QT prolongation risk - avoid in patients with cardiac risk factors',
    'CYP3A4 inhibitor - fewer interactions than erythromycin',
    'Good atypical coverage: Mycoplasma, Chlamydia, Legionella',
    'Can be used in true penicillin allergy',
    'IV form causes significant phlebitis - use large vein'
  ],
  nursing_guide = '{
    "PO": {
      "appropriateness": "Community-acquired respiratory infections, STIs, MAC prophylaxis",
      "administration": ["May give with or without food", "Suspension: shake well", "Z-pack: explain dosing schedule"],
      "patient_teaching": ["Take all doses even if feeling better", "Report palpitations or fainting", "May cause GI upset"]
    },
    "IV": {
      "appropriateness": "When PO not possible, CAP requiring hospitalization",
      "special_preparation": ["Dilute to 1-2 mg/mL", "Use large bore IV in large vein"],
      "administration": ["Infuse over 1-3 hours", "Never give as push or bolus", "Monitor for phlebitis"],
      "post_administration": ["Assess IV site for inflammation", "Transition to PO when possible"],
      "patient_teaching": ["Report IV site pain", "Report palpitations"]
    }
  }'::jsonb,
  pharmacokinetics = '{
    "absorption": "PO: 37% bioavailable; food increases tolerability",
    "distribution": "Extensive tissue distribution, concentrates in phagocytes",
    "metabolism": "Hepatic demethylation",
    "excretion": "Biliary (major), renal (6%)",
    "half_life": "68 hours (tissue half-life)"
  }'::jsonb,
  adverse_reactions = '{
    "common": ["Diarrhea", "Nausea", "Abdominal pain", "Headache"],
    "serious": ["QT prolongation/Torsades", "Hepatotoxicity", "C. difficile colitis", "Anaphylaxis"],
    "frequency": {"diarrhea": "5-14%", "nausea": "3-6%", "abdominal_pain": "3-7%"}
  }'::jsonb,
  drug_interactions_info = '{
    "major": ["QT-prolonging drugs - additive risk", "Nelfinavir - increased azithromycin"],
    "moderate": ["Warfarin - monitor INR", "Digoxin - increased levels"],
    "monitoring_required": ["Antiarrhythmics", "Antipsychotics"]
  }'::jsonb,
  safe_method = '{"preferred_method": "PO preferred; IV infusion if needed", "infusion_time": "1-3 hours", "requires_pump": false}'::jsonb,
  red_flags = '{"early_danger_signs": ["Palpitations/syncope (QT)", "Jaundice", "Severe diarrhea", "Anaphylaxis"]}'::jsonb
WHERE LOWER(generic_name) = 'azithromycin';

-- Update Ciprofloxacin with comprehensive data
UPDATE public.medications SET
  dosing_info = '{
    "standard_dose": "PO: 250-750 mg q12h; IV: 200-400 mg q8-12h",
    "max_dose": "1500 mg/day PO; 1200 mg/day IV",
    "frequency": "Every 8-12 hours",
    "indications": {
      "uti_uncomplicated": "250 mg PO q12h x3 days",
      "uti_complicated": "500 mg PO q12h or 400 mg IV q12h x7-14 days",
      "respiratory": "500-750 mg PO q12h",
      "intra_abdominal": "400 mg IV q12h (with metronidazole)",
      "anthrax": "500 mg PO q12h or 400 mg IV q12h"
    },
    "renal_adjustment": {
      "CrCl_30_50": "250-500 mg q12h",
      "CrCl_5_29": "250-500 mg q18h",
      "hemodialysis": "250-500 mg q24h after HD"
    }
  }'::jsonb,
  administration_info = '{
    "routes": {
      "PO": {
        "method": "Oral tablets or suspension",
        "timing": "May take with or without food; avoid dairy/calcium within 2 hours",
        "notes": ["Do NOT take with dairy, calcium, antacids, or iron", "Take 2 hours before or 6 hours after these products"]
      },
      "IV": {
        "method": "Intermittent IV infusion",
        "dilution": "Premixed bags available; 1-2 mg/mL",
        "rate": "Infuse over 60 minutes",
        "notes": ["Slow infusion reduces phlebitis risk", "Avoid rapid infusion"]
      }
    }
  }'::jsonb,
  safety_info = '{
    "black_box_warning": "Fluoroquinolones associated with disabling and potentially irreversible serious adverse reactions including tendinitis/tendon rupture, peripheral neuropathy, and CNS effects. Reserve for conditions with no alternative.",
    "contraindications": ["Fluoroquinolone hypersensitivity", "Concurrent tizanidine use"],
    "warnings": ["Tendon rupture - especially with steroids and age >60", "QT prolongation", "Peripheral neuropathy", "CNS effects", "Aortic aneurysm risk", "Hypoglycemia"],
    "pregnancy_category": "C",
    "geriatric_considerations": "Increased tendon rupture risk; adjust for renal function"
  }'::jsonb,
  monitoring = '{
    "vitals_required": false,
    "cardiac_monitoring": false,
    "spo2_monitoring": false,
    "neuro_monitoring": false,
    "frequency": "As needed",
    "parameters": ["Tendon pain", "Neurologic symptoms", "Signs of C. diff", "Blood glucose in diabetics"]
  }'::jsonb,
  clinical_pearls = ARRAY[
    'BLACK BOX: Reserve for infections with no safer alternative',
    'Chelates with divalent cations - separate from calcium, iron, antacids by 2 hours',
    'Excellent Pseudomonas coverage (though resistance increasing)',
    'Tendon rupture risk highest with concurrent steroids and age >60',
    'Strong CYP1A2 inhibitor - major theophylline and tizanidine interactions',
    'Peripheral neuropathy may be irreversible',
    'Good oral bioavailability - IV to PO conversion often possible'
  ],
  nursing_guide = '{
    "PO": {
      "appropriateness": "UTIs, respiratory infections, when IV not needed",
      "administration": ["Counsel on calcium/dairy/antacid separation", "Ensure adequate hydration", "Give at consistent times"],
      "patient_teaching": ["Avoid dairy within 2 hours of dose", "Stop and report tendon pain immediately", "Report numbness/tingling", "Use sun protection"]
    },
    "IV": {
      "appropriateness": "Serious infections, NPO status",
      "special_preparation": ["Check renal function for dosing", "Verify no tizanidine use"],
      "administration": ["Infuse over 60 minutes", "Do not give rapidly", "Monitor IV site"],
      "post_administration": ["Transition to PO when feasible", "Monitor for phlebitis", "Assess for adverse effects"],
      "patient_teaching": ["Report tendon pain", "Report numbness/tingling"]
    }
  }'::jsonb,
  pharmacokinetics = '{
    "absorption": "PO: 70-80% bioavailable; decreased by cations",
    "distribution": "Widely distributed, concentrates in tissues",
    "metabolism": "Hepatic CYP1A2 (partial)",
    "excretion": "Renal (40-50% unchanged)",
    "half_life": "4-6 hours"
  }'::jsonb,
  adverse_reactions = '{
    "common": ["Nausea", "Diarrhea", "Headache", "Dizziness"],
    "serious": ["Tendon rupture", "Peripheral neuropathy", "QT prolongation", "C. difficile colitis", "Aortic aneurysm", "Hypoglycemia"],
    "frequency": {"nausea": "2-5%", "diarrhea": "2-5%", "headache": "1-2%"}
  }'::jsonb,
  drug_interactions_info = '{
    "major": ["Tizanidine - CONTRAINDICATED", "Theophylline - toxicity risk", "QT-prolonging drugs"],
    "moderate": ["Warfarin - increased INR", "Antacids/calcium/iron - decreased absorption", "NSAIDs - seizure risk"],
    "contraindicated": ["Tizanidine"]
  }'::jsonb,
  safe_method = '{"preferred_method": "PO when possible; IV infusion", "infusion_time": "60 minutes", "requires_pump": false}'::jsonb,
  red_flags = '{"early_danger_signs": ["Tendon pain - STOP drug", "Numbness/tingling", "Palpitations", "Severe diarrhea", "Confusion/hallucinations"]}'::jsonb
WHERE LOWER(generic_name) = 'ciprofloxacin';

-- Update Meropenem with comprehensive data
UPDATE public.medications SET
  dosing_info = '{
    "standard_dose": "1 g IV q8h",
    "max_dose": "6 g/day (2 g q8h)",
    "frequency": "Every 8 hours",
    "indications": {
      "meningitis": "2 g IV q8h",
      "intra_abdominal": "1 g IV q8h",
      "skin_soft_tissue": "500 mg-1 g IV q8h",
      "pneumonia": "1 g IV q8h",
      "febrile_neutropenia": "1 g IV q8h",
      "pseudomonas": "2 g IV q8h or extended infusion"
    },
    "renal_adjustment": {
      "CrCl_26_50": "1 g q12h",
      "CrCl_10_25": "500 mg q12h",
      "CrCl_less_10": "500 mg q24h",
      "hemodialysis": "500 mg q24h + dose after HD"
    }
  }'::jsonb,
  administration_info = '{
    "routes": {
      "IV": {
        "method": "Intermittent infusion or extended infusion",
        "dilution": "50-250 mL NS or D5W",
        "rate": "Standard: 15-30 minutes; Extended: 3 hours",
        "compatibility": "Compatible with common IV fluids",
        "notes": ["Extended infusion (3h) optimizes PK/PD", "Stable only 4 hours at room temp", "Less seizure risk than imipenem"]
      }
    }
  }'::jsonb,
  safety_info = '{
    "contraindications": ["Carbapenem hypersensitivity", "Anaphylaxis to beta-lactams (relative)"],
    "warnings": ["Seizure risk (lower than imipenem)", "C. diff colitis", "Cross-reactivity with penicillins (1%)", "Thrombocytopenia with prolonged use"],
    "pregnancy_category": "B",
    "geriatric_considerations": "Adjust for renal function; monitor for CNS effects"
  }'::jsonb,
  monitoring = '{
    "vitals_required": false,
    "cardiac_monitoring": false,
    "spo2_monitoring": false,
    "neuro_monitoring": true,
    "frequency": "Daily",
    "parameters": ["Renal function", "CBC", "Signs of seizure activity", "Signs of C. diff", "Infection markers"]
  }'::jsonb,
  clinical_pearls = ARRAY[
    'Broadest spectrum beta-lactam - save for resistant organisms',
    'Lower seizure risk than imipenem - preferred for CNS infections',
    'Extended infusion (3 hours) improves efficacy for resistant organisms',
    'Degrades valproic acid - avoid combination or monitor levels closely',
    'Limited stability - use within 4 hours of preparation at room temp',
    'Does NOT cover MRSA or VRE'
  ],
  nursing_guide = '{
    "IV": {
      "appropriateness": "Serious infections, resistant gram-negatives, CNS infections",
      "special_preparation": ["Verify beta-lactam allergy status", "Check renal function", "Prepare close to infusion time"],
      "administration": ["Standard: 15-30 min infusion", "Extended: 3 hour infusion", "Monitor for seizures", "Assess for allergy"],
      "post_administration": ["Monitor for CNS effects", "Assess for C. diff", "Document response", "Consider de-escalation when cultures return"],
      "patient_teaching": ["Report diarrhea", "Report confusion or seizure activity", "Report rash or allergic symptoms"]
    }
  }'::jsonb,
  pharmacokinetics = '{
    "absorption": "IV only",
    "distribution": "Widely distributed, good CNS penetration",
    "metabolism": "Minimal hepatic hydrolysis",
    "excretion": "Renal (70% unchanged)",
    "half_life": "1 hour (prolonged in renal impairment)"
  }'::jsonb,
  adverse_reactions = '{
    "common": ["Diarrhea", "Nausea/vomiting", "Headache", "Rash", "Thrombophlebitis"],
    "serious": ["Seizures", "C. difficile colitis", "Anaphylaxis", "Thrombocytopenia", "Stevens-Johnson syndrome"],
    "frequency": {"diarrhea": "4-5%", "nausea": "3-4%", "headache": "2-4%", "rash": "2-3%"}
  }'::jsonb,
  drug_interactions_info = '{
    "major": ["Valproic acid - significantly decreased valproate levels", "Probenecid - increased meropenem levels"],
    "moderate": ["Live vaccines - reduced efficacy"],
    "contraindicated": ["Avoid valproic acid combination if possible"]
  }'::jsonb,
  safe_method = '{"preferred_method": "IV infusion", "infusion_time": "15-30 min standard or 3 hours extended", "requires_pump": true}'::jsonb,
  red_flags = '{"early_danger_signs": ["Seizures", "Severe allergic reaction", "Severe diarrhea", "Breakthrough seizures in epileptics on valproate"]}'::jsonb
WHERE LOWER(generic_name) = 'meropenem';
