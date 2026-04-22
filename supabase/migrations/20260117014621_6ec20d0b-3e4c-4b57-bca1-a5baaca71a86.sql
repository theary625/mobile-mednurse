
-- Update Propofol with comprehensive data
UPDATE public.medications SET
  high_alert = true,
  dosing_info = '{
    "standard_dose": "Induction: 1.5-2.5 mg/kg IV; Maintenance: 25-75 mcg/kg/min",
    "max_dose": "Typically 4 mg/kg/hr for ICU sedation",
    "frequency": "Continuous infusion",
    "indications": {
      "sedation": "ICU sedation, procedural sedation",
      "anesthesia": "Induction and maintenance of general anesthesia"
    }
  }'::jsonb,
  administration_info = '{
    "routes": {
      "IV": {
        "method": "IV bolus for induction, continuous infusion for maintenance",
        "dilution": "Undiluted for bolus; may run undiluted or dilute in D5W only",
        "rate": "Induction: over 20-30 seconds; Infusion: titrate to effect",
        "compatibility": "Dedicated line preferred due to lipid emulsion",
        "notes": ["Strict aseptic technique - lipid supports bacterial growth", "Change tubing every 12 hours", "Shake well before use"]
      }
    },
    "preparation": "Ready to use emulsion - do not dilute unless needed",
    "stability": "Use within 12 hours of opening vial"
  }'::jsonb,
  safety_info = '{
    "black_box_warning": "Should only be administered by persons trained in general anesthesia. Not for use in pediatric ICU sedation.",
    "contraindications": ["Allergy to eggs, soy, or sulfites", "Pediatric ICU sedation contraindicated"],
    "warnings": ["Profound respiratory depression", "Hypotension especially in hypovolemic patients", "Propofol infusion syndrome with prolonged high-dose use"],
    "pregnancy_category": "B",
    "geriatric_considerations": "Reduce induction dose by 20-40%"
  }'::jsonb,
  monitoring = '{
    "vitals_required": true,
    "cardiac_monitoring": true,
    "spo2_monitoring": true,
    "neuro_monitoring": true,
    "frequency": "Continuous during infusion",
    "parameters": ["BP", "HR", "RR", "SpO2", "Level of sedation (RASS/SAS)", "Triglycerides (prolonged use)"]
  }'::jsonb,
  hold_parameters = '{
    "blood_pressure": {"systolic_min": 90, "map_min": 65},
    "heart_rate": {"min": 50},
    "respiratory_rate": {"min": 8},
    "custom": ["Hold for apnea", "Hold for triglycerides >400 mg/dL"]
  }'::jsonb,
  clinical_pearls = ARRAY[
    'Contains 1.1 kcal/mL from lipid - count toward nutritional intake',
    'Green discoloration of urine is benign',
    'Propofol infusion syndrome: unexplained metabolic acidosis, rhabdomyolysis, hyperkalemia, renal failure',
    'Pain on injection - consider lidocaine pretreatment',
    'Rapid offset allows for frequent neuro assessments'
  ],
  nursing_guide = '{
    "IV": {
      "appropriateness": "First-line for short-term sedation requiring rapid awakening",
      "special_preparation": ["Shake vial gently", "Strict aseptic technique", "Draw up immediately before use"],
      "administration": ["Dedicated IV line preferred", "Use 0.2 micron filter if available", "Never mix with other medications"],
      "post_administration": ["Continuous hemodynamic monitoring", "RASS assessment q1-4h", "Daily sedation vacation"],
      "patient_teaching": ["Explain amnesia is expected", "Burning sensation at IV site normal"]
    }
  }'::jsonb,
  pharmacokinetics = '{
    "absorption": "IV only - immediate onset",
    "distribution": "Highly lipophilic, large Vd 2-10 L/kg",
    "metabolism": "Hepatic and extrahepatic conjugation",
    "excretion": "Renal (metabolites)",
    "half_life": "Initial 2-8 min, terminal 4-7 hours"
  }'::jsonb,
  adverse_reactions = '{
    "common": ["Hypotension", "Injection site pain", "Apnea", "Nausea"],
    "serious": ["Propofol infusion syndrome", "Profound hypotension", "Respiratory arrest", "Anaphylaxis"],
    "frequency": {"hypotension": "25-40%", "apnea": "10-20%", "injection_pain": "15-30%"}
  }'::jsonb,
  drug_interactions_info = '{
    "major": ["CNS depressants - enhanced sedation", "Opioids - respiratory depression"],
    "moderate": ["Antihypertensives - additive hypotension"],
    "monitoring_required": ["All sedatives", "Vasopressors may be needed"]
  }'::jsonb,
  double_check_required = true,
  safe_method = '{"preferred_method": "Continuous IV infusion", "infusion_time": "Titrated", "requires_pump": true}'::jsonb,
  rate_dilution = '{"standard_concentration": "10 mg/mL undiluted", "max_rate": "4 mg/kg/hr for ICU sedation"}'::jsonb,
  red_flags = '{"early_danger_signs": ["Unexplained metabolic acidosis", "Rising triglycerides", "Rhabdomyolysis", "Green urine (benign but notable)"]}'::jsonb
WHERE LOWER(generic_name) = 'propofol';

-- Update Midazolam with comprehensive data
UPDATE public.medications SET
  high_alert = true,
  controlled_substance = true,
  dosing_info = '{
    "standard_dose": "Sedation: 0.5-2 mg IV; Infusion: 0.02-0.1 mg/kg/hr",
    "max_dose": "Titrate to effect; no absolute max",
    "frequency": "PRN or continuous infusion",
    "indications": {
      "procedural_sedation": "0.5-2 mg IV",
      "icu_sedation": "Continuous infusion",
      "anxiety": "0.5-1 mg IV/IM",
      "seizures": "IM: 10 mg; IN: 5 mg per nostril"
    }
  }'::jsonb,
  administration_info = '{
    "routes": {
      "IV": {
        "method": "Slow IV push or continuous infusion",
        "dilution": "May dilute in NS or D5W",
        "rate": "Push over 2-5 minutes; titrate infusion",
        "compatibility": "Compatible with most IV fluids",
        "notes": ["Have flumazenil available", "Reduce dose in elderly"]
      },
      "IM": {
        "method": "Deep IM injection",
        "site": "Large muscle mass",
        "notes": ["Onset 5-15 minutes", "Preferred for seizures in prehospital"]
      },
      "Intranasal": {
        "method": "Atomized spray",
        "dose": "5 mg per nostril using MAD device",
        "notes": ["Useful for seizures when no IV access"]
      }
    }
  }'::jsonb,
  safety_info = '{
    "black_box_warning": "Concurrent use with opioids may result in profound sedation, respiratory depression, coma, and death.",
    "contraindications": ["Acute narrow-angle glaucoma", "Known hypersensitivity"],
    "warnings": ["Respiratory depression", "Paradoxical reactions in elderly/peds", "Prolonged sedation in renal/hepatic impairment"],
    "pregnancy_category": "D",
    "geriatric_considerations": "Reduce dose by 50% in elderly"
  }'::jsonb,
  monitoring = '{
    "vitals_required": true,
    "cardiac_monitoring": true,
    "spo2_monitoring": true,
    "neuro_monitoring": true,
    "frequency": "Continuous during procedure, q15-30min after",
    "parameters": ["BP", "HR", "RR", "SpO2", "Level of sedation"]
  }'::jsonb,
  hold_parameters = '{
    "blood_pressure": {"systolic_min": 90},
    "heart_rate": {"min": 50},
    "respiratory_rate": {"min": 10},
    "custom": ["Hold for oversedation", "Hold if SpO2 <92%"]
  }'::jsonb,
  clinical_pearls = ARRAY[
    'Water-soluble - more predictable IM absorption than diazepam',
    'Active metabolite (1-hydroxymidazolam) accumulates in renal failure',
    'Paradoxical agitation more common in elderly and children',
    'Flumazenil reversal may precipitate seizures in chronic benzo users',
    'Context-sensitive half-time increases with prolonged infusions'
  ],
  nursing_guide = '{
    "IV": {
      "appropriateness": "Short procedures, ICU sedation when propofol contraindicated",
      "special_preparation": ["Verify flumazenil availability", "Know patient benzo history"],
      "administration": ["Push slowly over 2-5 min", "Titrate to effect", "Monitor for respiratory depression"],
      "post_administration": ["Continuous SpO2 monitoring", "Assess for paradoxical reactions", "Document sedation level"],
      "patient_teaching": ["Anterograde amnesia expected", "No driving for 24 hours"]
    },
    "IM": {
      "appropriateness": "When IV access unavailable, seizure emergency",
      "administration": ["Deep IM into large muscle", "Onset 5-15 minutes"],
      "post_administration": ["Monitor for respiratory depression", "Prepare for IV conversion if needed"]
    }
  }'::jsonb,
  pharmacokinetics = '{
    "absorption": "IM: 90% bioavailable; IN: 60-70%",
    "distribution": "Vd 1-3.1 L/kg, 97% protein bound",
    "metabolism": "Hepatic CYP3A4 to active metabolite",
    "excretion": "Renal (metabolites)",
    "half_life": "1.5-2.5 hours (prolonged in renal failure)"
  }'::jsonb,
  adverse_reactions = '{
    "common": ["Respiratory depression", "Hypotension", "Amnesia", "Drowsiness"],
    "serious": ["Respiratory arrest", "Paradoxical agitation", "Anaphylaxis"],
    "frequency": {"respiratory_depression": "5-15%", "hypotension": "5-10%"}
  }'::jsonb,
  drug_interactions_info = '{
    "major": ["Opioids - profound respiratory depression", "CYP3A4 inhibitors - increased effect"],
    "moderate": ["CNS depressants - enhanced sedation", "Rifampin - decreased effect"],
    "contraindicated": ["Concurrent high-dose opioids without monitoring"]
  }'::jsonb,
  double_check_required = true,
  safe_method = '{"preferred_method": "Slow IV push or infusion", "infusion_time": "Push over 2-5 min", "requires_pump": true}'::jsonb,
  red_flags = '{"early_danger_signs": ["Respiratory depression", "Paradoxical agitation", "Prolonged sedation"]}'::jsonb
WHERE LOWER(generic_name) = 'midazolam';

-- Update Dexmedetomidine with comprehensive data  
UPDATE public.medications SET
  high_alert = true,
  dosing_info = '{
    "standard_dose": "Loading: 1 mcg/kg over 10-20 min (optional); Maintenance: 0.2-0.7 mcg/kg/hr",
    "max_dose": "1.5 mcg/kg/hr (higher doses increase bradycardia risk)",
    "frequency": "Continuous infusion",
    "indications": {
      "icu_sedation": "Light to moderate sedation, allows patient interaction",
      "procedural_sedation": "MAC sedation, awake fiber-optic intubation"
    }
  }'::jsonb,
  administration_info = '{
    "routes": {
      "IV": {
        "method": "Continuous IV infusion; loading dose optional",
        "dilution": "Premixed 4 mcg/mL or dilute in NS to 4 mcg/mL",
        "rate": "Loading over 10-20 min; maintenance 0.2-0.7 mcg/kg/hr",
        "compatibility": "Compatible with NS, D5W, LR",
        "notes": ["Skip loading dose if hypotensive or bradycardic", "May use without loading for ICU"]
      }
    }
  }'::jsonb,
  safety_info = '{
    "contraindications": ["Advanced heart block without pacemaker"],
    "warnings": ["Bradycardia", "Hypotension", "Transient hypertension with loading dose", "Not for rapid sequence intubation"],
    "pregnancy_category": "C",
    "geriatric_considerations": "Consider lower doses; increased sensitivity"
  }'::jsonb,
  monitoring = '{
    "vitals_required": true,
    "cardiac_monitoring": true,
    "spo2_monitoring": true,
    "neuro_monitoring": true,
    "frequency": "Continuous during infusion",
    "parameters": ["HR (bradycardia common)", "BP", "Level of sedation (RASS)", "SpO2"]
  }'::jsonb,
  hold_parameters = '{
    "blood_pressure": {"systolic_min": 90, "map_min": 60},
    "heart_rate": {"min": 50},
    "custom": ["Hold for HR <45", "Consider stopping if persistent bradycardia"]
  }'::jsonb,
  clinical_pearls = ARRAY[
    'Unique: provides sedation without respiratory depression',
    'Patients are arousable and cooperative - ideal for neuro exams',
    'Does NOT prevent recall - not a true anesthetic',
    'Bradycardia is dose-dependent - most common adverse effect',
    'Hypertension may occur initially with loading dose (central alpha-2 vs peripheral)',
    'Reduces delirium incidence compared to benzodiazepines'
  ],
  nursing_guide = '{
    "IV": {
      "appropriateness": "ICU sedation, spontaneously breathing patients, delirium prevention",
      "special_preparation": ["Verify no advanced heart block", "Prepare premixed solution"],
      "administration": ["Consider skipping load if HR <60 or hypotensive", "Titrate slowly q30min"],
      "post_administration": ["Monitor HR closely first 1 hour", "RASS assessment q4h", "Watch for rebound hypertension if stopped abruptly"],
      "patient_teaching": ["Will feel sleepy but arousable", "Report dizziness"]
    }
  }'::jsonb,
  pharmacokinetics = '{
    "absorption": "IV only",
    "distribution": "Vd 1.3 L/kg, 94% protein bound",
    "metabolism": "Hepatic glucuronidation and CYP2A6",
    "excretion": "Renal (metabolites)",
    "half_life": "Terminal 2-3 hours"
  }'::jsonb,
  adverse_reactions = '{
    "common": ["Bradycardia (25-40%)", "Hypotension (25-30%)", "Dry mouth"],
    "serious": ["Sinus arrest", "Transient hypertension", "Cardiac arrest (rare)"],
    "frequency": {"bradycardia": "25-40%", "hypotension": "25-30%"}
  }'::jsonb,
  drug_interactions_info = '{
    "major": ["Other bradycardic agents - additive effect", "Beta-blockers"],
    "moderate": ["Vasodilators - enhanced hypotension", "Anesthetics - potentiation"],
    "monitoring_required": ["Digoxin", "Calcium channel blockers"]
  }'::jsonb,
  double_check_required = true,
  safe_method = '{"preferred_method": "Continuous IV infusion", "infusion_time": "Loading 10-20 min", "requires_pump": true}'::jsonb,
  red_flags = '{"early_danger_signs": ["HR <45 bpm", "Symptomatic bradycardia", "Hypotension requiring vasopressors"]}'::jsonb
WHERE LOWER(generic_name) = 'dexmedetomidine';

-- Update Lorazepam with comprehensive data
UPDATE public.medications SET
  high_alert = true,
  controlled_substance = true,
  dosing_info = '{
    "standard_dose": "Anxiety/Sedation: 0.5-2 mg IV/IM/PO; Status epilepticus: 4 mg IV",
    "max_dose": "8 mg/dose for status epilepticus; 10 mg/day for anxiety",
    "frequency": "q4-6h PRN or continuous infusion",
    "indications": {
      "anxiety": "0.5-2 mg PO/IV q4-6h",
      "sedation": "0.5-2 mg IV q2-4h PRN",
      "status_epilepticus": "4 mg IV, may repeat once",
      "alcohol_withdrawal": "1-4 mg IV q4-6h PRN per CIWA"
    }
  }'::jsonb,
  administration_info = '{
    "routes": {
      "IV": {
        "method": "Slow IV push or diluted infusion",
        "dilution": "Dilute 1:1 with NS or D5W for push",
        "rate": "Max 2 mg/min",
        "compatibility": "Limited - contains propylene glycol",
        "notes": ["Refrigerate - precipitates at room temp", "Contains propylene glycol - monitor toxicity"]
      },
      "IM": {
        "method": "Deep IM injection",
        "site": "Large muscle mass",
        "notes": ["Absorption more predictable than diazepam IM"]
      },
      "PO": {
        "method": "Oral tablet or concentrate",
        "notes": ["Can be given sublingually for faster onset"]
      }
    }
  }'::jsonb,
  safety_info = '{
    "black_box_warning": "Concurrent use with opioids may result in profound sedation, respiratory depression, coma, and death.",
    "contraindications": ["Acute narrow-angle glaucoma", "Known hypersensitivity"],
    "warnings": ["Propylene glycol toxicity with prolonged high-dose IV", "Respiratory depression", "Paradoxical reactions"],
    "pregnancy_category": "D",
    "geriatric_considerations": "Reduce dose by 50%; increased sensitivity and fall risk"
  }'::jsonb,
  monitoring = '{
    "vitals_required": true,
    "cardiac_monitoring": false,
    "spo2_monitoring": true,
    "neuro_monitoring": true,
    "frequency": "q15-30min during acute use",
    "parameters": ["BP", "RR", "SpO2", "Sedation level", "Propylene glycol gap (prolonged IV)"]
  }'::jsonb,
  hold_parameters = '{
    "respiratory_rate": {"min": 10},
    "custom": ["Hold for oversedation", "Hold if anion gap acidosis (propylene glycol)"]
  }'::jsonb,
  clinical_pearls = ARRAY[
    'Preferred benzodiazepine in liver failure - no active metabolites',
    'Propylene glycol toxicity: anion gap acidosis, osmolar gap, renal failure',
    'Monitor propylene glycol gap if infusion >48 hours or >1 mg/kg/day',
    'IM absorption more reliable than diazepam',
    'Can cause significant delirium in ICU - use with caution'
  ],
  nursing_guide = '{
    "IV": {
      "appropriateness": "Seizures, severe anxiety, alcohol withdrawal, procedural sedation",
      "special_preparation": ["Refrigerate until use", "Dilute before push", "Have flumazenil available"],
      "administration": ["Push no faster than 2 mg/min", "Watch for injection site reaction", "Monitor respirations"],
      "post_administration": ["Continuous pulse oximetry", "Fall precautions", "Reassess q15-30min"],
      "patient_teaching": ["Will cause drowsiness and amnesia", "No driving for 24 hours"]
    },
    "PO": {
      "appropriateness": "Mild-moderate anxiety, scheduled dosing",
      "administration": ["May give without regard to food", "Can dissolve under tongue for faster effect"],
      "patient_teaching": ["Avoid alcohol", "Take as directed - can be habit forming"]
    }
  }'::jsonb,
  pharmacokinetics = '{
    "absorption": "PO: 90% bioavailable; IM: complete",
    "distribution": "Vd 1.3 L/kg, 85% protein bound",
    "metabolism": "Hepatic glucuronidation (no CYP450)",
    "excretion": "Renal (inactive metabolites)",
    "half_life": "10-20 hours"
  }'::jsonb,
  adverse_reactions = '{
    "common": ["Sedation", "Respiratory depression", "Amnesia", "Weakness"],
    "serious": ["Respiratory arrest", "Propylene glycol toxicity", "Paradoxical agitation"],
    "frequency": {"sedation": "40-50%", "respiratory_depression": "5-10%"}
  }'::jsonb,
  drug_interactions_info = '{
    "major": ["Opioids - profound respiratory depression", "Alcohol - enhanced CNS depression"],
    "moderate": ["Probenecid - increased lorazepam levels", "Valproate - increased lorazepam levels"],
    "contraindicated": ["High-dose opioids without monitoring"]
  }'::jsonb,
  double_check_required = true,
  safe_method = '{"preferred_method": "Slow IV push", "infusion_time": "Over 2-5 minutes", "requires_pump": false}'::jsonb,
  red_flags = '{"early_danger_signs": ["Anion gap acidosis", "Osmolar gap", "Respiratory depression", "Paradoxical agitation"]}'::jsonb
WHERE LOWER(generic_name) = 'lorazepam';

-- Update Ketamine with comprehensive data
UPDATE public.medications SET
  high_alert = true,
  controlled_substance = true,
  dosing_info = '{
    "standard_dose": "Procedural sedation: 1-2 mg/kg IV; Analgesia: 0.1-0.3 mg/kg IV; RSI: 1.5-2 mg/kg IV",
    "max_dose": "No absolute max; titrate to effect",
    "frequency": "PRN or continuous infusion",
    "indications": {
      "procedural_sedation": "1-2 mg/kg IV",
      "analgesia": "0.1-0.5 mg/kg IV (sub-dissociative)",
      "rsi_induction": "1.5-2 mg/kg IV",
      "status_asthmaticus": "1-2 mg/kg IV bolus",
      "depression": "0.5 mg/kg IV over 40 min"
    }
  }'::jsonb,
  administration_info = '{
    "routes": {
      "IV": {
        "method": "Slow IV push or infusion",
        "dilution": "May dilute in NS or D5W",
        "rate": "Push over 1-2 min for procedural; 40 min for depression",
        "compatibility": "Compatible with most IV fluids",
        "notes": ["Bronchodilator effect", "Maintains airway reflexes at typical doses", "Can cause emergence reactions"]
      },
      "IM": {
        "method": "Deep IM injection",
        "dose": "4-5 mg/kg for sedation",
        "notes": ["Onset 3-5 min", "Useful when no IV access"]
      }
    }
  }'::jsonb,
  safety_info = '{
    "contraindications": ["Age <3 months", "Known psychotic disorders", "Conditions where increased BP dangerous"],
    "warnings": ["Emergence reactions", "Laryngospasm (rare)", "Increased ICP (debated)", "Increased ocular pressure", "Sialorrhea"],
    "pregnancy_category": "B",
    "geriatric_considerations": "Reduce dose; increased sensitivity"
  }'::jsonb,
  monitoring = '{
    "vitals_required": true,
    "cardiac_monitoring": true,
    "spo2_monitoring": true,
    "neuro_monitoring": true,
    "frequency": "Continuous during procedure",
    "parameters": ["BP (expect increase)", "HR", "RR", "SpO2", "Level of sedation", "Emergence symptoms"]
  }'::jsonb,
  hold_parameters = '{
    "blood_pressure": {"systolic_max": 180},
    "heart_rate": {"max": 120},
    "custom": ["Caution in uncontrolled hypertension", "Caution in coronary artery disease"]
  }'::jsonb,
  clinical_pearls = ARRAY[
    'Unique: provides anesthesia, analgesia, and amnesia',
    'Sympathomimetic - increases BP and HR (good for shock)',
    'Bronchodilator - preferred in status asthmaticus',
    'Emergence reactions: vivid dreams, hallucinations - treat with benzos',
    'Pre-treat with glycopyrrolate or atropine to reduce secretions',
    'Does NOT cause respiratory depression at typical doses',
    'Nystagmus indicates adequate sedation'
  ],
  nursing_guide = '{
    "IV": {
      "appropriateness": "Procedural sedation, RSI in hypotensive patient, analgesia, status asthmaticus",
      "special_preparation": ["Have suction ready for secretions", "Consider glycopyrrolate pretreatment", "Low-stimulation environment post-procedure"],
      "administration": ["Push slowly over 1-2 min", "Watch for apnea with rapid push", "Expect vital sign changes"],
      "post_administration": ["Monitor for emergence reactions", "Keep environment calm and quiet", "Have midazolam ready for emergence"],
      "patient_teaching": ["May have vivid dreams", "Normal to feel disconnected", "Full recovery may take 1-2 hours"]
    },
    "IM": {
      "appropriateness": "When IV access not available, combative patient",
      "administration": ["Large muscle mass", "Onset 3-5 min", "Peak effect 20 min"],
      "post_administration": ["Prepare for IV placement", "Monitor as for IV route"]
    }
  }'::jsonb,
  pharmacokinetics = '{
    "absorption": "IM: bioavailable with 3-5 min onset",
    "distribution": "Vd 3 L/kg, highly lipophilic",
    "metabolism": "Hepatic CYP3A4, CYP2B6 to norketamine",
    "excretion": "Renal (metabolites)",
    "half_life": "Alpha 10-15 min, terminal 2-3 hours"
  }'::jsonb,
  adverse_reactions = '{
    "common": ["Emergence reactions (12%)", "Hypertension", "Tachycardia", "Hypersalivation", "Nausea"],
    "serious": ["Laryngospasm (0.3%)", "Apnea (rare with slow push)", "Severe emergence delirium"],
    "frequency": {"emergence": "12%", "hypertension": "25%", "hypersalivation": "15%"}
  }'::jsonb,
  drug_interactions_info = '{
    "major": ["CNS depressants - prolonged recovery"],
    "moderate": ["Sympathomimetics - enhanced cardiovascular effects", "CYP3A4 inhibitors - increased ketamine levels"],
    "monitoring_required": ["Thyroid medications", "Antihypertensives"]
  }'::jsonb,
  double_check_required = true,
  safe_method = '{"preferred_method": "Slow IV push", "infusion_time": "Over 1-2 minutes", "requires_pump": false}'::jsonb,
  red_flags = '{"early_danger_signs": ["Laryngospasm", "Severe emergence reaction", "Severe hypertension", "Apnea"]}'::jsonb
WHERE LOWER(generic_name) = 'ketamine';
