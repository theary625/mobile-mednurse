
-- Update Propofol with comprehensive data
UPDATE medications SET
  dosing_info = '{
    "induction_dose": "1.5-2.5 mg/kg IV (reduce in elderly)",
    "maintenance_infusion": "25-200 mcg/kg/min",
    "sedation_ICU": "5-50 mcg/kg/min",
    "max_dose": "Avoid >5 mg/kg/hr for >48 hours (PRIS risk)",
    "indications": {
      "induction": "1.5-2.5 mg/kg IV bolus",
      "maintenance_anesthesia": "100-200 mcg/kg/min",
      "ICU_sedation": "5-50 mcg/kg/min titrated to RASS",
      "procedural_sedation": "0.5-1 mg/kg then 25-75 mcg/kg/min"
    }
  }'::jsonb,
  administration_info = '{
    "routes": ["IV"],
    "IV_bolus": {
      "rate": "Give over 20-30 seconds for induction",
      "dilution": "Use undiluted or dilute with D5W only (minimum 2 mg/mL)"
    },
    "IV_infusion": {
      "concentration": "Undiluted (10 mg/mL) preferred",
      "line": "Dedicated line preferred due to incompatibilities",
      "filter": "Do not use filter <5 microns"
    },
    "special_notes": "Lipid emulsion - strict aseptic technique required"
  }'::jsonb,
  safety_info = '{
    "black_box_warning": "Should only be administered by persons trained in general anesthesia. Not for sedation in pediatric ICU patients.",
    "contraindications": ["Hypersensitivity to propofol, eggs, soybeans, or sulfites", "When general anesthesia is contraindicated"],
    "warnings": ["Propofol infusion syndrome (PRIS)", "Respiratory depression", "Hypotension", "Bradycardia"],
    "precautions": ["Cardiac impairment", "Respiratory disease", "Increased ICP", "Lipid disorders", "Pancreatitis history"]
  }'::jsonb,
  monitoring = '{
    "vitals": true,
    "cardiac": true,
    "spo2": true,
    "neuro": true,
    "labs": ["Triglycerides q48h if prolonged use", "CK if PRIS suspected", "Lactate", "ABG"],
    "frequency": "Continuous during infusion",
    "parameters": ["Respiratory status", "LOC/sedation depth", "Blood pressure", "Heart rate", "Signs of PRIS"]
  }'::jsonb,
  hold_parameters = '{
    "hypotension": "SBP <90 mmHg or MAP <65 mmHg",
    "bradycardia": "HR <50 bpm",
    "triglycerides": ">500 mg/dL",
    "PRIS_signs": "Unexplained acidosis, rhabdomyolysis, hyperkalemia, cardiac failure"
  }'::jsonb,
  clinical_pearls = ARRAY[
    'Propofol infusion syndrome (PRIS): >5 mg/kg/hr for >48h increases risk',
    'Contains lipid - count toward nutrition calories (1.1 kcal/mL)',
    'Check triglycerides every 48 hours with prolonged infusion',
    'Strict aseptic technique - discard unused portion after 12 hours',
    'Causes significant hypotension - have vasopressors available',
    'Green discoloration of urine is harmless',
    'Pain on injection common - can pretreat with lidocaine',
    'No analgesic properties - must provide separate pain management'
  ]::text[],
  nursing_guide = '{
    "IV": {
      "appropriateness": "General anesthesia, ICU sedation, procedural sedation",
      "special_preparation": "Shake well before use. Strict aseptic technique. Use within 12 hours of opening",
      "administration": "Bolus over 20-30 seconds. Titrate infusion to sedation goal (RASS). Dedicated line preferred",
      "post_administration": "Continuous monitoring required. Assess sedation depth frequently. Monitor for hypotension",
      "patient_teaching": "Patient will not remember procedure. Explain grogginess expected after waking"
    }
  }'::jsonb,
  pharmacokinetics = '{
    "absorption": "IV only",
    "distribution": "Vd 2-10 L/kg, highly lipophilic, rapid CNS penetration",
    "metabolism": "Hepatic glucuronidation and hydroxylation",
    "excretion": "Renal (88% as metabolites)",
    "half_life": "Initial 2-8 min, terminal 4-7 hours (context-sensitive)"
  }'::jsonb,
  adverse_reactions = '{
    "common": ["Hypotension", "Injection site pain", "Apnea", "Bradycardia"],
    "serious": ["Propofol infusion syndrome", "Severe hypotension", "Respiratory arrest", "Anaphylaxis"],
    "rare": ["Pancreatitis", "Green urine", "Seizure-like activity", "Sexual disinhibition"]
  }'::jsonb,
  drug_interactions_info = '{
    "major": [
      {"drug": "Opioids", "effect": "Synergistic respiratory depression - reduce doses"},
      {"drug": "Benzodiazepines", "effect": "Enhanced sedation and hypotension"}
    ],
    "moderate": [
      {"drug": "Antihypertensives", "effect": "Additive hypotension"},
      {"drug": "Alfentanil", "effect": "Increased propofol levels"},
      {"drug": "Droperidol", "effect": "Additive QT prolongation risk"}
    ]
  }'::jsonb
WHERE LOWER(generic_name) = 'propofol';

-- Update Dexmedetomidine with comprehensive data
UPDATE medications SET
  dosing_info = '{
    "loading_dose": "1 mcg/kg IV over 10-20 minutes (optional)",
    "maintenance_infusion": "0.2-0.7 mcg/kg/hr (max 1.5 mcg/kg/hr)",
    "max_duration": "Usually <24 hours, but can extend with monitoring",
    "indications": {
      "ICU_sedation": "0.2-0.7 mcg/kg/hr titrated to RASS",
      "procedural_sedation": "1 mcg/kg load then 0.2-1 mcg/kg/hr",
      "awake_intubation": "1 mcg/kg over 10 min then 0.7 mcg/kg/hr",
      "alcohol_withdrawal": "0.2-1.5 mcg/kg/hr as adjunct"
    }
  }'::jsonb,
  administration_info = '{
    "routes": ["IV"],
    "IV_infusion": {
      "dilution": "Dilute to 4 mcg/mL in NS or D5W",
      "loading": "1 mcg/kg over 10-20 minutes (may omit if hypotension concern)",
      "maintenance": "0.2-0.7 mcg/kg/hr via infusion pump only"
    },
    "special_notes": "Do not give as bolus. Must use infusion pump."
  }'::jsonb,
  safety_info = '{
    "black_box_warning": null,
    "contraindications": ["Hypersensitivity to dexmedetomidine"],
    "warnings": ["Bradycardia", "Hypotension", "Transient hypertension with loading", "Heart block"],
    "precautions": ["Advanced heart block without pacemaker", "Severe ventricular dysfunction", "Hypovolemia", "Hepatic impairment"]
  }'::jsonb,
  monitoring = '{
    "vitals": true,
    "cardiac": true,
    "spo2": true,
    "neuro": true,
    "labs": ["LFTs for prolonged use"],
    "frequency": "Continuous during infusion",
    "parameters": ["Heart rate", "Blood pressure", "Sedation depth (RASS)", "Respiratory status"]
  }'::jsonb,
  hold_parameters = '{
    "bradycardia": "HR <50 bpm or symptomatic",
    "hypotension": "SBP <90 or MAP <60",
    "heart_block": "New or worsening AV block"
  }'::jsonb,
  clinical_pearls = ARRAY[
    'Unique sedative - patients are arousable and cooperative',
    'Minimal respiratory depression compared to other sedatives',
    'Antisympathetic effects - expect bradycardia and hypotension',
    'Loading dose often omitted in hemodynamically unstable patients',
    'Excellent for alcohol/benzo withdrawal as adjunct',
    'Opioid-sparing properties - reduces pain medication needs',
    'May cause transient hypertension during loading (peripheral vasoconstriction)',
    'Good for awake fiberoptic intubation - preserves airway reflexes'
  ]::text[],
  nursing_guide = '{
    "IV": {
      "appropriateness": "Light sedation, awake intubation, alcohol withdrawal adjunct",
      "special_preparation": "Dilute to 4 mcg/mL. Use only with infusion pump",
      "administration": "Optional load over 10-20 min. Maintenance 0.2-0.7 mcg/kg/hr. Titrate to RASS",
      "post_administration": "May take 30-60 min to fully wear off. Monitor for rebound agitation",
      "patient_teaching": "You may be sleepy but arousable. Report any chest discomfort or dizziness"
    }
  }'::jsonb,
  pharmacokinetics = '{
    "absorption": "IV only",
    "distribution": "Vd 1.3 L/kg, high protein binding (94%)",
    "metabolism": "Hepatic glucuronidation and CYP2A6",
    "excretion": "Renal (95% as metabolites)",
    "half_life": "2-3 hours"
  }'::jsonb,
  adverse_reactions = '{
    "common": ["Hypotension", "Bradycardia", "Dry mouth", "Nausea"],
    "serious": ["Severe bradycardia", "Cardiac arrest", "Sinus arrest", "Transient hypertension"],
    "rare": ["Respiratory depression", "AV block", "Atrial fibrillation"]
  }'::jsonb,
  drug_interactions_info = '{
    "major": [
      {"drug": "Beta-blockers", "effect": "Additive bradycardia - use with caution"},
      {"drug": "Digoxin", "effect": "Enhanced bradycardia risk"}
    ],
    "moderate": [
      {"drug": "Opioids", "effect": "Synergistic sedation - may reduce opioid requirements"},
      {"drug": "Antihypertensives", "effect": "Additive hypotension"},
      {"drug": "Vasodilators", "effect": "Enhanced hypotensive effect"}
    ]
  }'::jsonb
WHERE LOWER(generic_name) = 'dexmedetomidine';

-- Update Midazolam with comprehensive data
UPDATE medications SET
  dosing_info = '{
    "sedation_IV": "0.5-2 mg IV slow push, titrate every 2-3 min",
    "sedation_IM": "0.07-0.08 mg/kg IM",
    "infusion": "0.02-0.1 mg/kg/hr",
    "max_single_dose": "2.5 mg/dose for healthy adults",
    "indications": {
      "procedural_sedation": "0.5-2 mg IV q2-3min to effect",
      "ICU_sedation": "0.02-0.1 mg/kg/hr infusion",
      "preoperative": "0.02-0.04 mg/kg IV",
      "status_epilepticus": "0.2 mg/kg IM (max 10 mg)"
    }
  }'::jsonb,
  administration_info = '{
    "routes": ["IV", "IM", "Intranasal", "PO"],
    "IV_push": {
      "rate": "Give over at least 2-3 minutes",
      "dilution": "May dilute with NS or D5W",
      "titration": "Wait 2-3 min between doses to assess effect"
    },
    "IV_infusion": {
      "concentration": "0.5-1 mg/mL",
      "rate": "0.02-0.1 mg/kg/hr titrated to sedation goal"
    },
    "IM": {
      "site": "Large muscle mass",
      "onset": "15-30 minutes"
    },
    "intranasal": {
      "device": "Use atomizer device",
      "dose": "0.2 mg/kg (max 10 mg)"
    }
  }'::jsonb,
  safety_info = '{
    "black_box_warning": "Concomitant use with opioids may result in profound sedation, respiratory depression, coma, and death. Reserve for patients without alternatives. Limit doses and duration.",
    "contraindications": ["Hypersensitivity to benzodiazepines", "Acute narrow-angle glaucoma", "Severe respiratory insufficiency"],
    "warnings": ["Respiratory depression", "Paradoxical reactions", "Anterograde amnesia", "Dependence with prolonged use"],
    "precautions": ["COPD", "Sleep apnea", "Hepatic impairment", "Elderly", "Debilitated patients"]
  }'::jsonb,
  monitoring = '{
    "vitals": true,
    "cardiac": false,
    "spo2": true,
    "neuro": true,
    "labs": [],
    "frequency": "Continuous during procedure, q15min after",
    "parameters": ["Respiratory status", "Level of consciousness", "Oxygen saturation", "Blood pressure"]
  }'::jsonb,
  hold_parameters = '{
    "respiratory_depression": "RR <10 or SpO2 <90%",
    "oversedation": "Unarousable to stimulation",
    "hypotension": "SBP <90 mmHg"
  }'::jsonb,
  clinical_pearls = ARRAY[
    'BLACK BOX: Opioid combination increases respiratory depression risk',
    'Rapid onset (1-3 min IV) but short duration (30-60 min)',
    'Flumazenil is the reversal agent - but may precipitate seizures',
    'Causes anterograde amnesia - useful for procedures',
    'Reduce dose 30-50% in elderly and debilitated',
    'Prolonged sedation with continuous infusion due to accumulation',
    'ICU patients may develop tolerance requiring dose escalation',
    'Active metabolite accumulates in renal failure'
  ]::text[],
  nursing_guide = '{
    "IV": {
      "appropriateness": "Procedural sedation, preoperative anxiolysis, ICU sedation",
      "special_preparation": "Have resuscitation equipment and flumazenil available",
      "administration": "Give slowly over 2-3 min. Wait 2-3 min between doses. Titrate to effect",
      "post_administration": "Continuous SpO2 monitoring. Patient must have escort home",
      "patient_teaching": "You will not remember the procedure. Do not drive for 24 hours. No important decisions"
    },
    "IM": {
      "appropriateness": "When IV access unavailable, seizures, agitation",
      "administration": "Deep IM into large muscle. Onset 15-30 minutes",
      "patient_teaching": "May feel drowsy. Stay in safe environment"
    }
  }'::jsonb,
  pharmacokinetics = '{
    "absorption": "IM bioavailability >90%, intranasal ~60%",
    "distribution": "Vd 1-3 L/kg, 97% protein bound",
    "metabolism": "Hepatic CYP3A4 to active metabolite (1-hydroxymidazolam)",
    "excretion": "Renal (60-80% as metabolites)",
    "half_life": "1.5-2.5 hours (prolonged in elderly, obesity, hepatic disease)"
  }'::jsonb,
  adverse_reactions = '{
    "common": ["Respiratory depression", "Hypotension", "Drowsiness", "Amnesia", "Hiccups"],
    "serious": ["Respiratory arrest", "Paradoxical agitation", "Airway obstruction", "Cardiac arrest"],
    "rare": ["Anaphylaxis", "Seizures on withdrawal", "Laryngospasm"]
  }'::jsonb,
  drug_interactions_info = '{
    "major": [
      {"drug": "Opioids", "effect": "BLACK BOX - profound sedation and respiratory depression"},
      {"drug": "CYP3A4 inhibitors", "effect": "Increased midazolam levels (ketoconazole, ritonavir)"}
    ],
    "moderate": [
      {"drug": "CNS depressants", "effect": "Additive sedation"},
      {"drug": "Grapefruit juice", "effect": "Increased oral bioavailability"},
      {"drug": "Rifampin", "effect": "Decreased midazolam effect"}
    ]
  }'::jsonb
WHERE LOWER(generic_name) = 'midazolam';

-- Update Lorazepam with comprehensive data
UPDATE medications SET
  dosing_info = '{
    "sedation": "0.5-2 mg IV/IM/PO every 4-6 hours PRN",
    "status_epilepticus": "4 mg IV, may repeat once in 5-10 min",
    "alcohol_withdrawal": "1-4 mg IV/PO every 1-4 hours PRN per CIWA",
    "max_dose": "8 mg/day for anxiety, higher for status epilepticus",
    "indications": {
      "anxiety": "0.5-2 mg PO q8h",
      "insomnia": "1-4 mg PO at bedtime",
      "status_epilepticus": "4 mg IV over 2 min, repeat x1 if needed",
      "alcohol_withdrawal": "1-4 mg IV/PO q1-4h PRN CIWA >8",
      "procedural_sedation": "0.5-2 mg IV"
    }
  }'::jsonb,
  administration_info = '{
    "routes": ["IV", "IM", "PO"],
    "IV_push": {
      "rate": "Maximum 2 mg/min",
      "dilution": "Dilute with equal volume NS or D5W",
      "concentration": "Max 0.4 mg/mL for infusion"
    },
    "IM": {
      "site": "Deep IM into large muscle",
      "note": "Well absorbed IM unlike diazepam"
    },
    "PO": {
      "administration": "May give with or without food"
    },
    "storage": "Refrigerate IV formulation"
  }'::jsonb,
  safety_info = '{
    "black_box_warning": "Concomitant use with opioids may result in profound sedation, respiratory depression, coma, and death.",
    "contraindications": ["Hypersensitivity to benzodiazepines", "Acute narrow-angle glaucoma", "Severe respiratory insufficiency", "Sleep apnea syndrome"],
    "warnings": ["Respiratory depression", "Paradoxical reactions", "Dependence/withdrawal", "Propylene glycol toxicity with high-dose IV"],
    "precautions": ["Hepatic/renal impairment", "Elderly", "Depression", "History of substance abuse"]
  }'::jsonb,
  monitoring = '{
    "vitals": true,
    "cardiac": false,
    "spo2": true,
    "neuro": true,
    "labs": ["Osmol gap if high-dose IV (propylene glycol)", "LFTs with prolonged use"],
    "frequency": "Q4h with scheduled dosing, continuous with IV",
    "parameters": ["Respiratory status", "Sedation level", "CIWA score if alcohol withdrawal"]
  }'::jsonb,
  hold_parameters = '{
    "respiratory_depression": "RR <10 or SpO2 <90%",
    "oversedation": "Difficult to arouse",
    "CIWA_low": "CIWA <8 for alcohol withdrawal dosing"
  }'::jsonb,
  clinical_pearls = ARRAY[
    'BLACK BOX: Opioid combination increases respiratory depression risk',
    'Preferred benzodiazepine for IM use - reliable absorption',
    'No active metabolites - safer in hepatic impairment than diazepam',
    'First-line for status epilepticus with IV access',
    'CIWA-guided dosing preferred for alcohol withdrawal',
    'IV contains propylene glycol - monitor osmol gap with high doses',
    'Refrigerate IV formulation for stability',
    'Intermediate onset IV (1-5 min) and duration (6-8 hours)'
  ]::text[],
  nursing_guide = '{
    "IV": {
      "appropriateness": "Status epilepticus, severe agitation, alcohol withdrawal, procedural sedation",
      "special_preparation": "Dilute with equal volume NS or D5W. Have flumazenil available",
      "administration": "Give no faster than 2 mg/min. Monitor respirations closely",
      "post_administration": "Assess sedation level and respiratory status frequently",
      "patient_teaching": "May cause drowsiness and memory impairment. Do not drive"
    },
    "PO": {
      "appropriateness": "Anxiety, insomnia, alcohol withdrawal (mild-moderate)",
      "administration": "May give with or without food",
      "patient_teaching": "Do not combine with alcohol. May cause dependence with prolonged use"
    }
  }'::jsonb,
  pharmacokinetics = '{
    "absorption": "PO bioavailability 90%, IM well absorbed",
    "distribution": "Vd 1.3 L/kg, 85% protein bound",
    "metabolism": "Hepatic glucuronidation (no CYP, no active metabolites)",
    "excretion": "Renal (88% as glucuronide)",
    "half_life": "10-20 hours"
  }'::jsonb,
  adverse_reactions = '{
    "common": ["Sedation", "Dizziness", "Weakness", "Unsteadiness"],
    "serious": ["Respiratory depression", "Paradoxical agitation", "Dependence", "Propylene glycol toxicity"],
    "rare": ["Anaphylaxis", "Blood dyscrasias", "Hepatotoxicity"]
  }'::jsonb,
  drug_interactions_info = '{
    "major": [
      {"drug": "Opioids", "effect": "BLACK BOX - profound sedation, respiratory depression"},
      {"drug": "Alcohol", "effect": "Synergistic CNS depression"}
    ],
    "moderate": [
      {"drug": "CNS depressants", "effect": "Additive sedation"},
      {"drug": "Probenecid", "effect": "Increased lorazepam effect (decreased clearance)"},
      {"drug": "Valproate", "effect": "Increased lorazepam levels"}
    ]
  }'::jsonb
WHERE LOWER(generic_name) = 'lorazepam';

-- Update Ketamine with comprehensive data
UPDATE medications SET
  dosing_info = '{
    "induction": "1-2 mg/kg IV OR 4-6 mg/kg IM",
    "sedation": "0.2-0.5 mg/kg IV",
    "analgesia": "0.1-0.3 mg/kg IV (subdissociative)",
    "infusion": "0.1-0.5 mg/kg/hr",
    "indications": {
      "induction": "1-2 mg/kg IV over 1 min OR 4-6 mg/kg IM",
      "procedural_sedation": "0.5-1 mg/kg IV with redosing PRN",
      "analgesia_subdissociative": "0.1-0.3 mg/kg IV over 10 min",
      "refractory_status_epilepticus": "1-2 mg/kg bolus then 1-10 mg/kg/hr",
      "depression": "0.5 mg/kg IV over 40 min (specialty use)"
    }
  }'::jsonb,
  administration_info = '{
    "routes": ["IV", "IM", "PO", "Intranasal"],
    "IV_push": {
      "rate": "Give over 1-2 minutes minimum for induction",
      "subdissociative": "Give over 10-15 minutes to reduce side effects"
    },
    "IV_infusion": {
      "concentration": "1-2 mg/mL",
      "rate": "0.1-0.5 mg/kg/hr for analgesia/sedation"
    },
    "IM": {
      "onset": "3-5 minutes",
      "site": "Large muscle mass"
    }
  }'::jsonb,
  safety_info = '{
    "black_box_warning": null,
    "contraindications": ["Conditions where increased BP would be hazardous (aneurysm, uncontrolled HTN)", "Hypersensitivity to ketamine"],
    "warnings": ["Emergence reactions", "Increased ICP (controversial)", "Increased IOP", "Laryngospasm"],
    "precautions": ["Coronary artery disease", "Psychiatric history", "Alcohol intoxication", "Globe injury"]
  }'::jsonb,
  monitoring = '{
    "vitals": true,
    "cardiac": true,
    "spo2": true,
    "neuro": true,
    "labs": [],
    "frequency": "Continuous during administration",
    "parameters": ["Blood pressure", "Heart rate", "Respiratory status", "Emergence reactions", "Laryngospasm signs"]
  }'::jsonb,
  hold_parameters = '{
    "severe_hypertension": "SBP >180 or DBP >110",
    "laryngospasm": "Signs of airway obstruction",
    "severe_emergence": "Uncontrollable agitation"
  }'::jsonb,
  clinical_pearls = ARRAY[
    'Unique dissociative anesthetic - provides sedation AND analgesia',
    'Preserves airway reflexes and spontaneous respiration',
    'Causes sympathetic stimulation - increases HR and BP',
    'Emergence reactions common (10-20%) - pretreat with benzodiazepine',
    'Excellent for burn dressing changes and painful procedures',
    'Subdissociative doses (0.1-0.3 mg/kg) for pain without sedation',
    'Bronchodilator - safe in asthmatics, good for status asthmaticus',
    'Increases secretions - consider glycopyrrolate pretreatment',
    'Low-dose adjunct reduces opioid requirements postoperatively'
  ]::text[],
  nursing_guide = '{
    "IV": {
      "appropriateness": "Induction (hemodynamically unstable), procedural sedation, analgesia",
      "special_preparation": "Have suction ready (increased secretions). Consider benzo pretreatment for emergence",
      "administration": "Slow push over 1-2 min for induction. For analgesia, give over 10-15 min",
      "post_administration": "Monitor for emergence reactions. Keep environment calm and quiet",
      "patient_teaching": "You may have vivid dreams. This is normal. Stay in calm environment after"
    },
    "IM": {
      "appropriateness": "When IV access unavailable, agitated patient, prehospital",
      "administration": "Deep IM into large muscle. Onset 3-5 minutes",
      "patient_teaching": "May feel disconnected or dream-like. This is expected"
    }
  }'::jsonb,
  pharmacokinetics = '{
    "absorption": "IM bioavailability 93%, intranasal 25-50%",
    "distribution": "Vd 3 L/kg, highly lipophilic, rapid CNS penetration",
    "metabolism": "Hepatic CYP3A4 and CYP2B6 to norketamine (active)",
    "excretion": "Renal (90% as metabolites)",
    "half_life": "2-3 hours (alpha), 10-12 hours (beta)"
  }'::jsonb,
  adverse_reactions = '{
    "common": ["Emergence reactions", "Nausea/vomiting", "Increased secretions", "Nystagmus", "Hypertension"],
    "serious": ["Laryngospasm", "Respiratory depression (high doses)", "Severe emergence psychosis", "Apnea"],
    "rare": ["Anaphylaxis", "Cardiac arrhythmias", "Intracranial hypertension"]
  }'::jsonb,
  drug_interactions_info = '{
    "major": [
      {"drug": "MAOIs", "effect": "Exaggerated hypertensive response"},
      {"drug": "Thyroid hormones", "effect": "Increased hypertension and tachycardia risk"}
    ],
    "moderate": [
      {"drug": "Benzodiazepines", "effect": "Reduces emergence reactions - often given together"},
      {"drug": "Opioids", "effect": "Synergistic analgesia, may prolong recovery"},
      {"drug": "Halothane", "effect": "Reduced ketamine metabolism"}
    ]
  }'::jsonb
WHERE LOWER(generic_name) = 'ketamine';
