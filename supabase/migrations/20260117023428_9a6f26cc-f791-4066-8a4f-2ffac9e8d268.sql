
-- Update Morphine with comprehensive data
UPDATE public.medications SET
  dosing_info = '{
    "adult": {
      "iv_push": "2-4 mg every 3-4 hours PRN",
      "iv_pca": "1-2 mg demand dose, 6-10 min lockout",
      "oral_ir": "15-30 mg every 4 hours PRN",
      "oral_er": "15-30 mg every 8-12 hours",
      "epidural": "2-5 mg single dose"
    },
    "pediatric": {
      "iv": "0.05-0.1 mg/kg every 2-4 hours",
      "oral": "0.2-0.5 mg/kg every 4-6 hours"
    },
    "renal_adjustment": "CrCl <30: Reduce dose 50-75%, avoid in ESRD",
    "hepatic_adjustment": "Reduce dose 50% in severe impairment",
    "max_dose": "No absolute max, titrate to effect",
    "equianalgesic": "10 mg IV = 30 mg PO"
  }'::jsonb,
  administration_info = '{
    "iv_push": {
      "dilution": "May give undiluted or dilute to 1-2 mg/mL",
      "rate": "Give over 4-5 minutes",
      "compatibility": "NS, D5W"
    },
    "iv_infusion": {
      "concentration": "0.1-1 mg/mL",
      "rate": "0.8-10 mg/hour typical"
    },
    "pca_settings": {
      "concentration": "1 mg/mL standard",
      "demand_dose": "1-2 mg",
      "lockout": "6-10 minutes",
      "max_hourly": "10-20 mg"
    },
    "storage": "Room temperature, protect from light"
  }'::jsonb,
  safety_info = '{
    "black_box_warnings": [
      "Respiratory depression risk especially in opioid-naive patients",
      "Accidental ingestion can be fatal in children",
      "Prolonged use during pregnancy causes neonatal withdrawal",
      "Concomitant use with benzodiazepines may result in death"
    ],
    "contraindications": [
      "Significant respiratory depression",
      "Acute or severe bronchial asthma without monitoring",
      "Known or suspected paralytic ileus",
      "Hypersensitivity to morphine"
    ],
    "warnings": [
      "Life-threatening respiratory depression",
      "Adrenal insufficiency with prolonged use",
      "Severe hypotension risk",
      "Risk of seizures in susceptible patients"
    ]
  }'::jsonb,
  monitoring = '{
    "parameters": ["Respiratory rate", "SpO2", "Pain score", "Sedation level", "Blood pressure", "Bowel function"],
    "frequency": "Every 1-2 hours initially, then every 4 hours",
    "sedation_scale": "RASS or Pasero scale recommended",
    "respiratory_monitoring": "Continuous pulse oximetry for high-risk patients"
  }'::jsonb,
  hold_parameters = '{
    "respiratory_rate": {"below": 10},
    "spo2": {"below": 92},
    "sedation": "RASS -3 or lower, or unable to arouse",
    "blood_pressure": {"systolic_below": 90}
  }'::jsonb,
  clinical_pearls = ARRAY[
    'Start low, go slow in opioid-naive patients',
    'Administer bowel regimen prophylactically',
    'Active metabolite (M6G) accumulates in renal failure',
    'Histamine release may cause itching/flushing - not allergy',
    'Peak effect 15-20 min IV, 60-90 min PO',
    'Always have naloxone readily available'
  ]::text[],
  nursing_guide = '{
    "iv": {
      "appropriateness": {
        "when_to_use": "Acute severe pain, post-operative, unable to take PO",
        "when_to_avoid": "Respiratory compromise, severe hypotension, ileus"
      },
      "preparation": {
        "steps": ["Verify order and dose", "Check for allergies", "Prepare naloxone if high-risk", "May give undiluted or dilute in NS"],
        "required_supplies": ["Morphine vial", "Syringe", "Alcohol swabs", "Naloxone at bedside"]
      },
      "administration": {
        "method": "Slow IV push over 4-5 minutes",
        "monitoring_during": "Watch for respiratory depression, hypotension"
      },
      "post_administration": {
        "monitoring": "Pain score, RR, SpO2, sedation level at 15 min, 30 min, 1 hour",
        "documentation": "Time, dose, pain scores pre/post, vitals, response"
      },
      "patient_teaching": ["Report difficulty breathing", "Use call light before ambulating", "Expected drowsiness", "Side rails up"]
    }
  }'::jsonb,
  pharmacokinetics = '{
    "onset": {"iv": "5-10 minutes", "po": "30-60 minutes"},
    "peak": {"iv": "15-20 minutes", "po": "60-90 minutes"},
    "duration": {"iv": "3-4 hours", "po": "4-6 hours"},
    "half_life": "2-4 hours (M6G: 6-12 hours)",
    "metabolism": "Hepatic glucuronidation to M3G (inactive) and M6G (active)",
    "excretion": "Renal 90%"
  }'::jsonb,
  adverse_reactions = '{
    "common": ["Nausea/vomiting", "Constipation", "Sedation", "Pruritus", "Dizziness"],
    "serious": ["Respiratory depression", "Severe hypotension", "Seizures", "Serotonin syndrome"],
    "management": {
      "nausea": "Antiemetics, often resolves in 3-5 days",
      "constipation": "Stimulant laxative + stool softener prophylaxis",
      "pruritus": "Diphenhydramine, nalbuphine, or rotate opioid",
      "respiratory_depression": "Naloxone 0.04-0.4 mg IV, repeat PRN"
    }
  }'::jsonb,
  drug_interactions_info = '{
    "major": [
      {"drug": "Benzodiazepines", "effect": "Additive respiratory depression - BLACK BOX"},
      {"drug": "MAOIs", "effect": "Serotonin syndrome, hyperpyrexia - contraindicated within 14 days"},
      {"drug": "Other CNS depressants", "effect": "Additive sedation and respiratory depression"}
    ],
    "moderate": [
      {"drug": "Anticholinergics", "effect": "Increased constipation, urinary retention"},
      {"drug": "Muscle relaxants", "effect": "Enhanced CNS depression"}
    ]
  }'::jsonb
WHERE LOWER(generic_name) = 'morphine';

-- Update Fentanyl with comprehensive data
UPDATE public.medications SET
  dosing_info = '{
    "adult": {
      "iv_bolus": "25-100 mcg every 1-2 hours PRN",
      "iv_infusion": "25-100 mcg/hour",
      "pca": "10-25 mcg demand, 5-10 min lockout",
      "transdermal": "12-25 mcg/hr patch, change every 72 hours",
      "intranasal": "100-200 mcg per spray",
      "procedural_sedation": "1-2 mcg/kg"
    },
    "pediatric": {
      "iv": "0.5-2 mcg/kg every 1-2 hours",
      "infusion": "0.5-2 mcg/kg/hour"
    },
    "renal_adjustment": "Use with caution, no specific adjustment",
    "hepatic_adjustment": "Reduce dose in severe impairment",
    "equianalgesic": "100 mcg IV = 10 mg morphine IV"
  }'::jsonb,
  administration_info = '{
    "iv_push": {
      "dilution": "May give undiluted",
      "rate": "Over 1-2 minutes (faster = chest wall rigidity)",
      "compatibility": "NS, D5W, LR"
    },
    "iv_infusion": {
      "concentration": "10-50 mcg/mL",
      "rate": "25-100 mcg/hour typical"
    },
    "transdermal": {
      "application": "Clean, dry, hairless skin on torso or upper arm",
      "rotation": "Rotate sites, avoid heat exposure"
    },
    "critical_note": "Highly lipophilic - rapid onset but redistributes"
  }'::jsonb,
  safety_info = '{
    "black_box_warnings": [
      "Life-threatening respiratory depression",
      "Transdermal: Only for opioid-tolerant patients",
      "Accidental exposure, especially in children, can be fatal",
      "Concomitant use with CYP3A4 inhibitors may cause fatal overdose",
      "Concomitant benzodiazepines increase overdose risk"
    ],
    "contraindications": [
      "Opioid non-tolerant patients (for transdermal)",
      "Significant respiratory depression",
      "Acute or severe bronchial asthma",
      "Known or suspected GI obstruction"
    ],
    "warnings": [
      "Chest wall rigidity with rapid IV administration",
      "QT prolongation with high doses",
      "Serotonin syndrome risk",
      "Heat increases transdermal absorption"
    ]
  }'::jsonb,
  monitoring = '{
    "parameters": ["Respiratory rate", "SpO2", "Pain score", "Sedation level", "Heart rate", "ECG for high doses"],
    "frequency": "Continuous monitoring during infusion, every 1 hour for bolus",
    "chest_wall_rigidity": "Monitor during rapid IV administration",
    "patch_monitoring": "Check adhesion and site every shift"
  }'::jsonb,
  hold_parameters = '{
    "respiratory_rate": {"below": 10},
    "spo2": {"below": 92},
    "sedation": "Difficult to arouse",
    "heart_rate": {"below": 50}
  }'::jsonb,
  clinical_pearls = ARRAY[
    '100x more potent than morphine - use mcg not mg',
    'Rapid IV push can cause chest wall rigidity - give slowly',
    'Short duration of single dose due to redistribution',
    'Transdermal takes 12-24 hours to reach steady state',
    'Do not cut patches - alters delivery',
    'Remove patch before MRI (aluminum in some brands)',
    'Fever increases transdermal absorption 30%'
  ]::text[],
  nursing_guide = '{
    "iv": {
      "appropriateness": {
        "when_to_use": "Procedural sedation, severe pain, rapid onset needed",
        "when_to_avoid": "Respiratory compromise, opioid-naive for high doses"
      },
      "preparation": {
        "steps": ["Verify mcg vs mg dosing", "Calculate weight-based dose", "Have naloxone ready", "Verify IV patency"],
        "required_supplies": ["Fentanyl vial", "Syringe", "Naloxone at bedside", "Monitoring equipment"]
      },
      "administration": {
        "method": "Slow IV push over 1-2 minutes to prevent rigidity",
        "monitoring_during": "Continuous SpO2, watch for chest wall rigidity"
      },
      "post_administration": {
        "monitoring": "RR, SpO2, sedation continuously for 15 min, then every 15 min x4",
        "documentation": "Time, dose, indication, response, vitals"
      },
      "patient_teaching": ["Rapid onset expected", "Report chest tightness", "Will wear off quickly"]
    }
  }'::jsonb,
  pharmacokinetics = '{
    "onset": {"iv": "1-2 minutes", "transdermal": "12-24 hours"},
    "peak": {"iv": "3-5 minutes", "transdermal": "24-72 hours"},
    "duration": {"iv": "30-60 minutes single dose", "transdermal": "72 hours"},
    "half_life": "2-4 hours (longer with infusion due to accumulation)",
    "metabolism": "Hepatic CYP3A4 to norfentanyl (inactive)",
    "excretion": "Renal 75%",
    "lipophilicity": "High - rapid CNS penetration"
  }'::jsonb,
  adverse_reactions = '{
    "common": ["Nausea", "Constipation", "Sedation", "Dizziness", "Pruritus"],
    "serious": ["Respiratory depression", "Chest wall rigidity", "Bradycardia", "QT prolongation", "Serotonin syndrome"],
    "management": {
      "chest_rigidity": "Stop infusion, may need neuromuscular blocker + intubation",
      "respiratory_depression": "Naloxone 0.04-0.4 mg IV, may need repeat doses",
      "bradycardia": "Atropine if symptomatic"
    }
  }'::jsonb,
  drug_interactions_info = '{
    "major": [
      {"drug": "CYP3A4 inhibitors (azoles, macrolides)", "effect": "Increased fentanyl levels - fatal overdose risk"},
      {"drug": "Benzodiazepines", "effect": "Profound sedation, respiratory depression - BLACK BOX"},
      {"drug": "MAOIs", "effect": "Serotonin syndrome - avoid within 14 days"}
    ],
    "moderate": [
      {"drug": "CYP3A4 inducers", "effect": "Decreased fentanyl effect"},
      {"drug": "Other CNS depressants", "effect": "Additive sedation"}
    ]
  }'::jsonb
WHERE LOWER(generic_name) = 'fentanyl';

-- Update Hydromorphone with comprehensive data
UPDATE public.medications SET
  dosing_info = '{
    "adult": {
      "iv_push": "0.2-1 mg every 2-3 hours PRN",
      "iv_pca": "0.2-0.4 mg demand dose, 6-10 min lockout",
      "oral_ir": "2-4 mg every 4-6 hours PRN",
      "oral_er": "8-64 mg every 24 hours",
      "subcutaneous": "1-2 mg every 3-4 hours"
    },
    "pediatric": {
      "iv": "0.015 mg/kg every 3-4 hours (max 2 mg/dose)",
      "oral": "0.03-0.08 mg/kg every 3-4 hours"
    },
    "renal_adjustment": "CrCl <30: Reduce dose 50-75%",
    "hepatic_adjustment": "Moderate: Reduce by 50%, Severe: Reduce by 75%",
    "equianalgesic": "1.5 mg IV = 7.5 mg PO = 10 mg morphine IV"
  }'::jsonb,
  administration_info = '{
    "iv_push": {
      "dilution": "May give undiluted or dilute to 0.2 mg/mL",
      "rate": "Give over 2-3 minutes",
      "compatibility": "NS, D5W"
    },
    "pca_settings": {
      "concentration": "0.2 mg/mL or 1 mg/mL",
      "demand_dose": "0.2-0.4 mg",
      "lockout": "6-10 minutes"
    },
    "high_concentration": "Dilaudid HP (10 mg/mL) for opioid-tolerant only",
    "storage": "Room temperature, protect from light"
  }'::jsonb,
  safety_info = '{
    "black_box_warnings": [
      "High potency formulation (HP) only for opioid-tolerant patients",
      "Respiratory depression risk especially in opioid-naive",
      "Accidental exposure can be fatal in children",
      "Concomitant benzodiazepines increase overdose risk"
    ],
    "contraindications": [
      "Significant respiratory depression",
      "Acute or severe bronchial asthma",
      "GI obstruction including paralytic ileus",
      "Opioid-naive patients for HP formulation"
    ],
    "warnings": [
      "7x more potent than morphine mg per mg",
      "Dose calculation errors can be fatal",
      "Risk of abuse and addiction",
      "Adrenal insufficiency with prolonged use"
    ]
  }'::jsonb,
  monitoring = '{
    "parameters": ["Respiratory rate", "SpO2", "Pain score", "Sedation level", "Blood pressure"],
    "frequency": "Every 1-2 hours initially, every 4 hours when stable",
    "high_risk": "More frequent monitoring in elderly, opioid-naive, renal impairment"
  }'::jsonb,
  hold_parameters = '{
    "respiratory_rate": {"below": 10},
    "spo2": {"below": 92},
    "sedation": "Unable to arouse or RASS -3 or lower",
    "blood_pressure": {"systolic_below": 90}
  }'::jsonb,
  clinical_pearls = ARRAY[
    '7x more potent than morphine - verify dose carefully',
    'HP formulation is 10 mg/mL - for tolerant patients ONLY',
    'Less histamine release than morphine - good for itching issues',
    'No active metabolites - better in renal failure than morphine',
    'Peak effect 10-20 min IV',
    'Good alternative when morphine causes excessive itching'
  ]::text[],
  nursing_guide = '{
    "iv": {
      "appropriateness": {
        "when_to_use": "Severe pain, morphine intolerance, renal impairment",
        "when_to_avoid": "Respiratory compromise, opioid-naive for HP formulation"
      },
      "preparation": {
        "steps": ["VERIFY CONCENTRATION (1 mg/mL vs 10 mg/mL HP)", "Double-check dose calculation", "Prepare naloxone", "Dilute if needed"],
        "required_supplies": ["Hydromorphone vial", "Correct syringe", "Naloxone at bedside"],
        "critical_check": "HP formulation requires opioid-tolerant verification"
      },
      "administration": {
        "method": "Slow IV push over 2-3 minutes",
        "monitoring_during": "Respiratory rate, sedation level, blood pressure"
      },
      "post_administration": {
        "monitoring": "Pain score, RR, SpO2 at 15, 30, 60 minutes",
        "documentation": "Concentration used, dose, time, response, vitals"
      },
      "patient_teaching": ["Report breathing difficulty", "Expected drowsiness", "Call for assistance before ambulating"]
    }
  }'::jsonb,
  pharmacokinetics = '{
    "onset": {"iv": "5 minutes", "po": "15-30 minutes"},
    "peak": {"iv": "10-20 minutes", "po": "30-60 minutes"},
    "duration": {"iv": "3-4 hours", "po": "4-5 hours"},
    "half_life": "2-3 hours",
    "metabolism": "Hepatic glucuronidation to H3G (inactive, neuroexcitatory)",
    "excretion": "Renal",
    "advantage": "No active metabolite accumulation like morphine M6G"
  }'::jsonb,
  adverse_reactions = '{
    "common": ["Nausea", "Constipation", "Sedation", "Dizziness", "Headache"],
    "serious": ["Respiratory depression", "Severe hypotension", "Seizures (H3G accumulation)", "Serotonin syndrome"],
    "management": {
      "nausea": "Antiemetics PRN",
      "constipation": "Bowel regimen prophylaxis",
      "respiratory_depression": "Naloxone 0.04-0.4 mg IV"
    }
  }'::jsonb,
  drug_interactions_info = '{
    "major": [
      {"drug": "Benzodiazepines", "effect": "Profound sedation, respiratory depression - BLACK BOX"},
      {"drug": "MAOIs", "effect": "Serotonin syndrome - contraindicated within 14 days"},
      {"drug": "Other opioids", "effect": "Additive respiratory depression"}
    ],
    "moderate": [
      {"drug": "CNS depressants", "effect": "Enhanced sedation"},
      {"drug": "Anticholinergics", "effect": "Increased constipation, urinary retention"}
    ]
  }'::jsonb
WHERE LOWER(generic_name) = 'hydromorphone';

-- Update Oxycodone with comprehensive data
UPDATE public.medications SET
  dosing_info = '{
    "adult": {
      "oral_ir": "5-15 mg every 4-6 hours PRN",
      "oral_er": "10-80 mg every 12 hours",
      "opioid_naive_start": "5-10 mg every 4-6 hours PRN"
    },
    "pediatric": {
      "oral": "0.1-0.2 mg/kg every 4-6 hours PRN"
    },
    "elderly": "Start at lower doses, increase interval",
    "renal_adjustment": "CrCl <60: Reduce dose 50%, titrate carefully",
    "hepatic_adjustment": "Reduce dose by 50-66% in moderate-severe impairment",
    "equianalgesic": "20 mg PO = 30 mg morphine PO"
  }'::jsonb,
  administration_info = '{
    "oral_immediate_release": {
      "forms": "Tablets, capsules, liquid",
      "administration": "May give with or without food",
      "crushing": "IR forms may be crushed if needed"
    },
    "oral_extended_release": {
      "forms": "OxyContin tablets",
      "administration": "Swallow whole - do not crush, chew, or dissolve",
      "critical": "Crushing can cause fatal overdose by releasing full dose at once"
    },
    "combination_products": {
      "with_acetaminophen": "Percocet - monitor total acetaminophen dose",
      "max_acetaminophen": "3-4 g/day from all sources"
    }
  }'::jsonb,
  safety_info = '{
    "black_box_warnings": [
      "Respiratory depression risk in opioid-naive patients",
      "ER formulation only for opioid-tolerant patients requiring around-the-clock analgesia",
      "Crushing ER tablets can cause fatal overdose",
      "Concomitant benzodiazepines increase overdose risk",
      "Neonatal opioid withdrawal syndrome"
    ],
    "contraindications": [
      "Significant respiratory depression",
      "Acute or severe bronchial asthma without monitoring",
      "GI obstruction",
      "Hypersensitivity to oxycodone"
    ],
    "warnings": [
      "High abuse potential - Schedule II",
      "Risk of addiction even at prescribed doses",
      "Severe hypotension risk",
      "Adrenal insufficiency with prolonged use"
    ]
  }'::jsonb,
  monitoring = '{
    "parameters": ["Pain score", "Respiratory rate", "Sedation level", "Bowel function", "Signs of misuse"],
    "frequency": "Every 4 hours initially, then with each dose",
    "abuse_monitoring": "Check prescription drug monitoring program"
  }'::jsonb,
  hold_parameters = '{
    "respiratory_rate": {"below": 10},
    "sedation": "Difficult to arouse",
    "blood_pressure": {"systolic_below": 90}
  }'::jsonb,
  clinical_pearls = ARRAY[
    '1.5x more potent than morphine PO mg per mg',
    'Good oral bioavailability (60-87%)',
    'ER formulation for chronic, around-the-clock pain only',
    'Always check total acetaminophen when using combination products',
    'Monitor for constipation - prophylactic bowel regimen',
    'High abuse potential - assess risk before prescribing'
  ]::text[],
  nursing_guide = '{
    "oral": {
      "appropriateness": {
        "when_to_use": "Moderate to severe pain, able to take PO",
        "when_to_avoid": "GI obstruction, unable to swallow ER tablets whole"
      },
      "preparation": {
        "steps": ["Verify IR vs ER formulation", "Check for combination products", "Calculate total daily acetaminophen if applicable"],
        "required_supplies": ["Medication", "Water", "Pain assessment tool"]
      },
      "administration": {
        "method": "Administer with water, with or without food",
        "er_critical": "ER tablets must be swallowed WHOLE - never crush"
      },
      "post_administration": {
        "monitoring": "Pain score at 1 hour, respiratory rate, sedation",
        "documentation": "Time, formulation, dose, pain score pre/post"
      },
      "patient_teaching": ["Take exactly as prescribed", "Do not crush ER tablets", "Report constipation", "Avoid alcohol", "Store securely"]
    }
  }'::jsonb,
  pharmacokinetics = '{
    "onset": {"ir": "10-15 minutes", "er": "1 hour"},
    "peak": {"ir": "30-60 minutes", "er": "3-4 hours"},
    "duration": {"ir": "3-6 hours", "er": "12 hours"},
    "half_life": "3.5-5.5 hours",
    "bioavailability": "60-87%",
    "metabolism": "Hepatic CYP3A4 and CYP2D6 to noroxycodone and oxymorphone",
    "excretion": "Renal 19% unchanged"
  }'::jsonb,
  adverse_reactions = '{
    "common": ["Constipation", "Nausea", "Sedation", "Dizziness", "Pruritus", "Headache"],
    "serious": ["Respiratory depression", "Severe hypotension", "Seizures", "Serotonin syndrome", "Addiction"],
    "management": {
      "constipation": "Prophylactic stimulant laxative + stool softener",
      "nausea": "Antiemetics, usually improves after 3-5 days",
      "overdose": "Naloxone, supportive care"
    }
  }'::jsonb,
  drug_interactions_info = '{
    "major": [
      {"drug": "Benzodiazepines", "effect": "Profound sedation, respiratory depression - BLACK BOX"},
      {"drug": "CYP3A4 inhibitors", "effect": "Increased oxycodone levels"},
      {"drug": "MAOIs", "effect": "Serotonin syndrome risk"}
    ],
    "moderate": [
      {"drug": "CYP2D6 inhibitors", "effect": "May reduce analgesic effect via decreased oxymorphone"},
      {"drug": "Other CNS depressants", "effect": "Additive sedation"},
      {"drug": "Alcohol", "effect": "Enhanced CNS depression, accelerated ER release"}
    ]
  }'::jsonb
WHERE LOWER(generic_name) = 'oxycodone';

-- Update Ketorolac with comprehensive data
UPDATE public.medications SET
  dosing_info = '{
    "adult": {
      "iv_im": "15-30 mg every 6 hours (max 120 mg/day)",
      "iv_single_dose": "30 mg (15 mg if elderly/renal impaired/low weight)",
      "oral": "10 mg every 4-6 hours (max 40 mg/day)",
      "max_duration": "5 days total (all routes combined)"
    },
    "pediatric": {
      "iv_im": "0.5 mg/kg every 6 hours (max 30 mg/dose)",
      "single_dose": "0.5 mg/kg (max 15 mg)"
    },
    "elderly": "15 mg IV/IM every 6 hours max",
    "renal_adjustment": "CrCl <30: Contraindicated; Moderate impairment: 15 mg max",
    "weight_adjustment": "<50 kg: 15 mg IV/IM max per dose",
    "critical": "MAX 5 DAYS TOTAL for all routes"
  }'::jsonb,
  administration_info = '{
    "iv_push": {
      "dilution": "May give undiluted",
      "rate": "Over at least 15 seconds",
      "compatibility": "NS, D5W, LR"
    },
    "im_injection": {
      "site": "Deep IM into large muscle mass",
      "volume": "Should not exceed 2 mL per site"
    },
    "oral": {
      "note": "Only as continuation of IV/IM therapy",
      "administration": "With food to reduce GI upset"
    },
    "warning": "DO NOT exceed 5 days total therapy"
  }'::jsonb,
  safety_info = '{
    "black_box_warnings": [
      "GI bleeding, ulceration, and perforation risk",
      "Contraindicated for perioperative pain in CABG surgery",
      "Increased cardiovascular thrombotic events (MI, stroke)",
      "Maximum 5 days therapy due to GI and renal risks",
      "Contraindicated in patients with active GI bleeding"
    ],
    "contraindications": [
      "Active peptic ulcer or GI bleeding",
      "Advanced renal impairment or risk of renal failure",
      "Cerebrovascular bleeding",
      "Concurrent aspirin or other NSAIDs",
      "Labor and delivery",
      "Nursing mothers"
    ],
    "warnings": [
      "Renal toxicity especially with dehydration",
      "Bleeding risk - inhibits platelet aggregation",
      "Hypersensitivity reactions",
      "Serious skin reactions (SJS, TEN)"
    ]
  }'::jsonb,
  monitoring = '{
    "parameters": ["Renal function (BUN/Cr)", "CBC", "GI symptoms", "Blood pressure", "Signs of bleeding"],
    "frequency": "BUN/Cr before and after short course, daily if risk factors",
    "hydration": "Ensure adequate hydration during therapy"
  }'::jsonb,
  hold_parameters = '{
    "renal_function": "Hold if creatinine rising or Cr >1.5",
    "gi_symptoms": "New abdominal pain, black stools, hematemesis",
    "bleeding": "Any signs of bleeding",
    "duration": "Stop at 5 days regardless"
  }'::jsonb,
  clinical_pearls = ARRAY[
    'STRICT 5-day maximum - count ALL routes',
    'Not a first-line analgesic - use for breakthrough or opioid-sparing',
    'Equivalent to 6-12 mg morphine for analgesia',
    'No respiratory depression - good opioid adjunct',
    'Avoid in dehydrated patients - high AKI risk',
    'Does NOT have anti-inflammatory effect at analgesic doses',
    'IV and IM are equally effective - IV preferred if access available'
  ]::text[],
  nursing_guide = '{
    "iv": {
      "appropriateness": {
        "when_to_use": "Short-term moderate-severe pain, opioid-sparing, no contraindications",
        "when_to_avoid": "Renal impairment, GI risk, bleeding risk, >5 days use, CABG patients"
      },
      "preparation": {
        "steps": ["Verify no contraindications", "Check renal function", "Count previous ketorolac doses", "Verify duration <5 days"],
        "required_supplies": ["Ketorolac vial", "Syringe", "Saline flush"]
      },
      "administration": {
        "method": "Slow IV push over 15+ seconds",
        "monitoring_during": "Pain response, vital signs"
      },
      "post_administration": {
        "monitoring": "Pain score, urine output, GI symptoms, signs of bleeding",
        "documentation": "Dose, cumulative days of therapy, response"
      },
      "patient_teaching": ["Report stomach pain or black stools", "Short-term use only", "Stay hydrated", "Report decreased urination"]
    }
  }'::jsonb,
  pharmacokinetics = '{
    "onset": {"iv": "10 minutes", "im": "30 minutes", "po": "30-60 minutes"},
    "peak": {"iv": "1-2 hours", "im": "1-2 hours", "po": "2-3 hours"},
    "duration": "4-6 hours",
    "half_life": "5-6 hours (9-10 hours in elderly)",
    "metabolism": "Hepatic conjugation",
    "excretion": "Renal 91%",
    "protein_binding": "99%"
  }'::jsonb,
  adverse_reactions = '{
    "common": ["Nausea", "Dyspepsia", "GI pain", "Headache", "Dizziness", "Drowsiness"],
    "serious": ["GI bleeding/perforation", "Acute kidney injury", "Cardiovascular events", "Anaphylaxis", "Stevens-Johnson syndrome"],
    "frequency": "GI events occur in 1-4% of patients even with short use",
    "management": {
      "gi_bleeding": "Discontinue immediately, PPI, GI consult",
      "aki": "Discontinue, aggressive hydration, monitor",
      "anaphylaxis": "Epinephrine, supportive care"
    }
  }'::jsonb,
  drug_interactions_info = '{
    "major": [
      {"drug": "Anticoagulants (warfarin, DOACs)", "effect": "Increased bleeding risk"},
      {"drug": "Other NSAIDs/aspirin", "effect": "Additive GI and renal toxicity - contraindicated"},
      {"drug": "Lithium", "effect": "Increased lithium levels"},
      {"drug": "Methotrexate", "effect": "Increased methotrexate toxicity"}
    ],
    "moderate": [
      {"drug": "ACE inhibitors/ARBs", "effect": "Reduced antihypertensive effect, increased renal risk"},
      {"drug": "Diuretics", "effect": "Reduced diuretic effect"},
      {"drug": "SSRIs", "effect": "Increased GI bleeding risk"}
    ]
  }'::jsonb
WHERE LOWER(generic_name) = 'ketorolac';
