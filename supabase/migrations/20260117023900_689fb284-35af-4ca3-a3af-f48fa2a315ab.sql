
-- Update Metoprolol with comprehensive data
UPDATE public.medications SET
  dosing_info = '{
    "adult": {
      "iv": "5 mg every 5 minutes x3 doses (max 15 mg)",
      "oral_tartrate": "25-100 mg twice daily",
      "oral_succinate": "25-200 mg once daily",
      "afib_rvr": "5 mg IV every 5 min, max 15 mg",
      "ami": "5 mg IV q5min x3, then 50 mg PO q6h x48h, then 100 mg BID"
    },
    "pediatric": {
      "oral": "1-2 mg/kg/day divided BID (max 6 mg/kg/day)",
      "iv": "0.1-0.2 mg/kg (max 5 mg/dose)"
    },
    "renal_adjustment": "No adjustment required",
    "hepatic_adjustment": "Reduce dose in severe impairment",
    "max_dose": "400 mg/day PO, 15 mg IV"
  }'::jsonb,
  administration_info = '{
    "iv_push": {
      "dilution": "May give undiluted",
      "rate": "Give over 1-2 minutes",
      "compatibility": "NS, D5W"
    },
    "oral": {
      "tartrate": "Give with food, can be crushed",
      "succinate": "Swallow whole or cut in half, do not crush"
    },
    "conversion": "Tartrate 50 mg BID = Succinate 100 mg daily",
    "monitoring_during_iv": "Continuous ECG and BP monitoring"
  }'::jsonb,
  safety_info = '{
    "black_box_warnings": [
      "Do not abruptly discontinue - risk of exacerbation of angina, MI, arrhythmias",
      "Taper over 1-2 weeks when discontinuing"
    ],
    "contraindications": [
      "Sinus bradycardia, heart block >1st degree without pacemaker",
      "Cardiogenic shock",
      "Decompensated heart failure",
      "Sick sinus syndrome without pacemaker"
    ],
    "warnings": [
      "May mask hypoglycemia symptoms in diabetics",
      "Use caution in bronchospastic disease",
      "May worsen peripheral vascular disease",
      "Avoid in cocaine-induced chest pain"
    ]
  }'::jsonb,
  monitoring = '{
    "parameters": ["Heart rate", "Blood pressure", "ECG", "Signs of heart failure"],
    "frequency": "Continuous during IV, every 4 hours when stabilized",
    "target_hr": "60-80 bpm for rate control"
  }'::jsonb,
  hold_parameters = '{
    "heart_rate": {"below": 55},
    "blood_pressure": {"systolic_below": 90},
    "symptoms": "New or worsening heart failure, bronchospasm"
  }'::jsonb,
  clinical_pearls = ARRAY[
    'Tartrate = immediate release BID, Succinate = extended release daily',
    'IV:PO conversion roughly 1:2.5',
    'Beta-1 selective but selectivity lost at higher doses',
    'Do NOT give IV in decompensated HF',
    'Wait 10 min after last IV dose before starting PO',
    'Can mask tachycardia from hypoglycemia'
  ]::text[],
  nursing_guide = '{
    "iv": {
      "appropriateness": {
        "when_to_use": "Afib with RVR, acute MI, hypertensive emergency with tachycardia",
        "when_to_avoid": "Decompensated HF, bradycardia, hypotension, heart block, asthma"
      },
      "preparation": {
        "steps": ["Verify HR >60, SBP >90", "Ensure continuous monitoring", "Have atropine available"],
        "required_supplies": ["Metoprolol vial", "Syringe", "Cardiac monitor", "Atropine at bedside"]
      },
      "administration": {
        "method": "Slow IV push over 1-2 minutes",
        "monitoring_during": "Continuous ECG and BP, watch for bradycardia"
      },
      "post_administration": {
        "monitoring": "HR and BP every 5 minutes for 15 minutes, then every 15 min x4",
        "documentation": "Time, dose, HR/BP before and after, rhythm"
      },
      "patient_teaching": ["Report dizziness or lightheadedness", "Remain supine during IV administration"]
    }
  }'::jsonb,
  pharmacokinetics = '{
    "onset": {"iv": "5-10 minutes", "po": "1-2 hours"},
    "peak": {"iv": "20 minutes", "po_tartrate": "1-2 hours", "po_succinate": "6-12 hours"},
    "duration": {"iv": "5-8 hours", "po": "12-24 hours"},
    "half_life": "3-7 hours",
    "metabolism": "Hepatic CYP2D6",
    "excretion": "Renal 95%"
  }'::jsonb,
  adverse_reactions = '{
    "common": ["Fatigue", "Dizziness", "Bradycardia", "Hypotension", "Cold extremities"],
    "serious": ["Severe bradycardia", "Heart block", "Cardiogenic shock", "Bronchospasm", "Heart failure exacerbation"],
    "management": {
      "bradycardia": "Atropine 0.5-1 mg IV, glucagon 3-10 mg IV if severe",
      "hypotension": "Fluids, vasopressors if needed",
      "bronchospasm": "Beta-2 agonists, discontinue metoprolol"
    }
  }'::jsonb,
  drug_interactions_info = '{
    "major": [
      {"drug": "Calcium channel blockers (non-DHP)", "effect": "Additive bradycardia and heart block"},
      {"drug": "Clonidine", "effect": "Rebound hypertension if clonidine stopped first"},
      {"drug": "Digoxin", "effect": "Additive bradycardia"}
    ],
    "moderate": [
      {"drug": "CYP2D6 inhibitors (fluoxetine, paroxetine)", "effect": "Increased metoprolol levels"},
      {"drug": "Insulin/oral hypoglycemics", "effect": "Masked hypoglycemia symptoms"}
    ]
  }'::jsonb
WHERE LOWER(generic_name) = 'metoprolol';

-- Update Diltiazem with comprehensive data
UPDATE public.medications SET
  dosing_info = '{
    "adult": {
      "iv_bolus": "0.25 mg/kg over 2 min (typical 20 mg), may repeat 0.35 mg/kg",
      "iv_infusion": "5-15 mg/hour after bolus",
      "oral_ir": "30-120 mg TID-QID",
      "oral_er": "120-360 mg once daily",
      "afib_rvr": "0.25 mg/kg IV bolus, then 5-15 mg/hr infusion"
    },
    "pediatric": {
      "oral": "1.5-2 mg/kg/day divided TID-QID"
    },
    "renal_adjustment": "No adjustment required, not removed by dialysis",
    "hepatic_adjustment": "Reduce dose by 50% in severe impairment",
    "max_dose": "360 mg/day PO, 15 mg/hour IV"
  }'::jsonb,
  administration_info = '{
    "iv_bolus": {
      "dilution": "May give undiluted or dilute in NS/D5W",
      "rate": "Over 2 minutes",
      "compatibility": "NS, D5W"
    },
    "iv_infusion": {
      "concentration": "0.45-1 mg/mL typical",
      "rate": "5-15 mg/hour",
      "stability": "24 hours at room temp, refrigerate if longer"
    },
    "oral": {
      "er_forms": "Swallow whole, do not crush or chew",
      "food": "May give with or without food"
    }
  }'::jsonb,
  safety_info = '{
    "black_box_warnings": [],
    "contraindications": [
      "Sick sinus syndrome without pacemaker",
      "2nd or 3rd degree AV block without pacemaker",
      "Severe hypotension (SBP <90)",
      "Acute MI with pulmonary congestion",
      "Concurrent IV beta-blocker within 2-4 hours",
      "Atrial fibrillation with accessory pathway (WPW)"
    ],
    "warnings": [
      "Negative inotrope - use caution in HF",
      "May cause bradycardia and heart block",
      "Hepatotoxicity rare but reported",
      "Risk of severe hypotension"
    ]
  }'::jsonb,
  monitoring = '{
    "parameters": ["Heart rate", "Blood pressure", "ECG rhythm", "Liver function with chronic use"],
    "frequency": "Continuous during IV infusion, every 4 hours when stable",
    "target_hr": "60-110 bpm for Afib rate control"
  }'::jsonb,
  hold_parameters = '{
    "heart_rate": {"below": 55},
    "blood_pressure": {"systolic_below": 90},
    "ecg": "New heart block, prolonged PR"
  }'::jsonb,
  clinical_pearls = ARRAY[
    'Do NOT give IV within 2-4 hours of IV beta-blocker',
    'More negative inotropic than verapamil',
    'Avoid in WPW with Afib - can accelerate conduction down accessory pathway',
    'Second bolus (0.35 mg/kg) often needed for adequate rate control',
    'Start infusion AFTER bolus takes effect',
    'ER formulations are NOT interchangeable'
  ]::text[],
  nursing_guide = '{
    "iv": {
      "appropriateness": {
        "when_to_use": "Afib/Aflutter with RVR, SVT, hypertensive urgency",
        "when_to_avoid": "WPW, HF with reduced EF, recent IV beta-blocker, hypotension, bradycardia"
      },
      "preparation": {
        "steps": ["Verify no recent IV beta-blocker", "Check for WPW on ECG", "Prepare infusion pump", "Have calcium available"],
        "required_supplies": ["Diltiazem vials", "NS for dilution", "Infusion pump", "Calcium gluconate at bedside"]
      },
      "administration": {
        "method": "Bolus over 2 minutes, then continuous infusion",
        "monitoring_during": "Continuous ECG and BP"
      },
      "post_administration": {
        "monitoring": "HR, BP every 5-15 min during titration, ECG rhythm",
        "documentation": "Bolus time/dose, infusion rate, HR/BP response"
      },
      "patient_teaching": ["Report dizziness or palpitations", "Remain on monitor during infusion"]
    }
  }'::jsonb,
  pharmacokinetics = '{
    "onset": {"iv": "3-5 minutes", "po_ir": "30-60 minutes"},
    "peak": {"iv": "7-11 minutes", "po_ir": "2-4 hours", "po_er": "10-14 hours"},
    "duration": {"iv": "1-3 hours", "po_er": "24 hours"},
    "half_life": "3-4.5 hours (up to 8 hours with chronic use)",
    "metabolism": "Hepatic CYP3A4 extensive first-pass",
    "excretion": "Renal 35%, fecal 65%",
    "bioavailability": "40% due to first-pass"
  }'::jsonb,
  adverse_reactions = '{
    "common": ["Bradycardia", "Hypotension", "Peripheral edema", "Dizziness", "Headache", "Flushing"],
    "serious": ["Severe bradycardia", "Heart block", "Cardiogenic shock", "Hepatotoxicity"],
    "management": {
      "bradycardia": "Stop infusion, atropine if symptomatic",
      "hypotension": "Stop infusion, fluids, calcium gluconate 1-2 g IV",
      "heart_block": "Stop infusion, atropine, temporary pacing if needed"
    }
  }'::jsonb,
  drug_interactions_info = '{
    "major": [
      {"drug": "Beta-blockers IV", "effect": "Severe bradycardia, heart block, HF - avoid within 2-4 hours"},
      {"drug": "Digoxin", "effect": "Increased digoxin levels 20-40%"},
      {"drug": "Simvastatin", "effect": "Increased statin levels - limit simvastatin to 10 mg"}
    ],
    "moderate": [
      {"drug": "CYP3A4 substrates", "effect": "Diltiazem inhibits CYP3A4, increases levels"},
      {"drug": "Cyclosporine", "effect": "Increased cyclosporine levels"}
    ]
  }'::jsonb
WHERE LOWER(generic_name) = 'diltiazem';

-- Update Amiodarone with comprehensive data
UPDATE public.medications SET
  dosing_info = '{
    "adult": {
      "vf_pulseless_vt": "300 mg IV push, may repeat 150 mg once",
      "stable_vt": "150 mg IV over 10 min, then 1 mg/min x6h, then 0.5 mg/min x18h",
      "afib_conversion": "150 mg IV over 10 min, may repeat, then infusion",
      "oral_loading": "800-1600 mg/day divided for 1-3 weeks",
      "oral_maintenance": "200-400 mg daily",
      "total_iv_load": "Usually 900-1050 mg over 24 hours"
    },
    "pediatric": {
      "vf_pulseless_vt": "5 mg/kg IV bolus (max 300 mg)",
      "perfusing_arrhythmia": "5 mg/kg IV over 20-60 min"
    },
    "renal_adjustment": "No adjustment needed",
    "hepatic_adjustment": "Reduce dose if hepatotoxicity develops",
    "max_dose": "2.2 g IV in 24 hours"
  }'::jsonb,
  administration_info = '{
    "iv_push": {
      "indication": "Cardiac arrest only",
      "dilution": "May give undiluted in arrest",
      "rate": "Rapid push in arrest"
    },
    "iv_infusion": {
      "concentration": "1.5-6 mg/mL (higher concentrations require central line)",
      "rate": "1 mg/min x6h, then 0.5 mg/min",
      "line": "Central line preferred for concentrations >2 mg/mL",
      "filter": "Use 0.22 micron in-line filter"
    },
    "compatibility": "D5W preferred (may precipitate in NS)",
    "phlebitis": "High risk - use central line when possible"
  }'::jsonb,
  safety_info = '{
    "black_box_warnings": [
      "Pulmonary toxicity (potentially fatal pneumonitis/fibrosis)",
      "Hepatotoxicity",
      "Proarrhythmia including torsades de pointes",
      "Use only for life-threatening arrhythmias"
    ],
    "contraindications": [
      "Cardiogenic shock",
      "Sick sinus syndrome without pacemaker",
      "2nd/3rd degree AV block without pacemaker",
      "Known hypersensitivity to iodine",
      "Baseline QT prolongation"
    ],
    "warnings": [
      "Thyroid dysfunction (hyper or hypothyroidism)",
      "Corneal microdeposits (nearly universal)",
      "Photosensitivity - use sunscreen",
      "Contains iodine - affects thyroid tests"
    ]
  }'::jsonb,
  monitoring = '{
    "parameters": ["ECG/QTc", "Liver function", "Thyroid function", "Pulmonary function", "Eye exam"],
    "frequency": "Baseline LFTs, TFTs, PFTs, eye exam; then TFTs every 6 months, LFTs every 6 months",
    "ecg": "QTc at baseline and periodically, watch for >500 ms",
    "chest_xray": "Baseline and annually for pulmonary toxicity"
  }'::jsonb,
  hold_parameters = '{
    "qtc": {"above": 500},
    "heart_rate": {"below": 50},
    "blood_pressure": {"systolic_below": 90},
    "labs": "New transaminase elevation >3x ULN, new thyroid abnormality"
  }'::jsonb,
  clinical_pearls = ARRAY[
    'Extremely long half-life (40-55 days) - effects persist weeks after stopping',
    'Load is required due to massive volume of distribution',
    'Contains 37% iodine by weight - affects thyroid',
    'Use D5W not NS to prevent precipitation',
    'Central line preferred to avoid phlebitis',
    'Blue-gray skin discoloration with chronic use',
    'Interacts with virtually everything via CYP450'
  ]::text[],
  nursing_guide = '{
    "iv": {
      "appropriateness": {
        "when_to_use": "VF/pulseless VT, stable VT, Afib rate control when others fail",
        "when_to_avoid": "Baseline QTc prolongation, severe hypotension, sinus node dysfunction"
      },
      "preparation": {
        "steps": ["Obtain baseline QTc", "Mix in D5W (not NS)", "Use in-line filter", "Central line if concentration >2 mg/mL"],
        "required_supplies": ["Amiodarone vials", "D5W", "0.22 micron filter", "Infusion pump"]
      },
      "administration": {
        "method": "Load 150 mg over 10 min, then maintenance infusion",
        "monitoring_during": "Continuous ECG, BP every 15 min, watch for hypotension"
      },
      "post_administration": {
        "monitoring": "QTc daily, LFTs at 24h, BP and HR",
        "documentation": "Total mg given, QTc trend, rhythm response"
      },
      "patient_teaching": ["Medication stays in body for weeks", "Avoid excessive sun exposure", "Report vision changes or breathing difficulty"]
    }
  }'::jsonb,
  pharmacokinetics = '{
    "onset": {"iv": "Immediate to hours", "po": "Days to weeks"},
    "peak": {"iv": "End of infusion", "po": "3-7 hours"},
    "duration": "Weeks to months after discontinuation",
    "half_life": "40-55 days (range 15-142 days)",
    "metabolism": "Hepatic CYP3A4 to active desethylamiodarone",
    "excretion": "Biliary, minimal renal",
    "volume_of_distribution": "Massive (66 L/kg) - accumulates in tissues"
  }'::jsonb,
  adverse_reactions = '{
    "common": ["Hypotension (IV)", "Bradycardia", "Nausea", "Corneal deposits", "Photosensitivity"],
    "serious": ["Pulmonary fibrosis", "Hepatotoxicity", "Thyroid dysfunction", "Torsades de pointes", "Optic neuropathy"],
    "management": {
      "hypotension": "Slow infusion rate, fluids, vasopressors if severe",
      "pulmonary_toxicity": "Discontinue, corticosteroids may help",
      "thyrotoxicosis": "Discontinue, antithyroid drugs, may need thyroidectomy"
    }
  }'::jsonb,
  drug_interactions_info = '{
    "major": [
      {"drug": "Warfarin", "effect": "Increases INR 30-50% - reduce warfarin dose by 1/3 to 1/2"},
      {"drug": "Digoxin", "effect": "Increases digoxin 70-100% - reduce digoxin dose by 50%"},
      {"drug": "QT prolonging drugs", "effect": "Additive QT prolongation - avoid combination"},
      {"drug": "Simvastatin/lovastatin", "effect": "Increased statin levels - use max 20 mg simvastatin"}
    ],
    "moderate": [
      {"drug": "Beta-blockers", "effect": "Additive bradycardia"},
      {"drug": "Diltiazem/verapamil", "effect": "Additive negative chronotropy"}
    ]
  }'::jsonb
WHERE LOWER(generic_name) = 'amiodarone';

-- Update Digoxin with comprehensive data
UPDATE public.medications SET
  dosing_info = '{
    "adult": {
      "iv_loading": "0.25-0.5 mg, may give additional 0.25 mg q4-8h (max 1-1.5 mg/24h)",
      "oral_loading": "0.5-0.75 mg, then 0.25-0.5 mg q6-8h (max 1-1.5 mg/24h)",
      "maintenance": "0.125-0.25 mg daily",
      "afib_maintenance": "0.125-0.25 mg daily (target level 0.5-1 ng/mL)",
      "hf_maintenance": "0.125-0.25 mg daily (target level 0.5-0.9 ng/mL)"
    },
    "pediatric": {
      "loading": "Age-based: 20-35 mcg/kg divided over 24h",
      "maintenance": "5-10 mcg/kg/day divided BID"
    },
    "renal_adjustment": "CrCl 10-50: 25-75% of dose; CrCl <10: 10-25% of dose",
    "elderly": "Start 0.0625-0.125 mg daily",
    "therapeutic_range": "0.5-2 ng/mL (0.5-1 ng/mL preferred in HF)"
  }'::jsonb,
  administration_info = '{
    "iv": {
      "dilution": "May give undiluted or dilute with NS/D5W",
      "rate": "Over 5 minutes minimum",
      "compatibility": "NS, D5W (not compatible with many drugs)"
    },
    "oral": {
      "tablets": "May give without regard to meals",
      "liquid": "Use calibrated dropper"
    },
    "timing": "Give at same time daily, check HR before each dose"
  }'::jsonb,
  safety_info = '{
    "black_box_warnings": [],
    "contraindications": [
      "Ventricular fibrillation",
      "Hypertrophic cardiomyopathy with outflow obstruction",
      "WPW syndrome with atrial fibrillation",
      "Known hypersensitivity"
    ],
    "warnings": [
      "Narrow therapeutic index - toxicity common",
      "Hypokalemia/hypomagnesemia increase toxicity risk",
      "Renal impairment increases levels",
      "Elderly more susceptible to toxicity"
    ]
  }'::jsonb,
  monitoring = '{
    "parameters": ["Heart rate and rhythm", "Digoxin level", "Potassium", "Magnesium", "Creatinine", "Signs of toxicity"],
    "frequency": "Check level 6-8 hours post-dose or at trough, K/Mg/Cr weekly then monthly",
    "therapeutic_level": "0.5-1 ng/mL for HF, 0.5-2 ng/mL for Afib",
    "toxicity_signs": "Nausea, vomiting, visual changes (yellow/green halos), arrhythmias"
  }'::jsonb,
  hold_parameters = '{
    "heart_rate": {"below": 60},
    "digoxin_level": {"above": 2},
    "potassium": {"below": 3.5},
    "symptoms": "Nausea, visual disturbances, new arrhythmias"
  }'::jsonb,
  clinical_pearls = ARRAY[
    'Check apical HR for full minute before each dose - hold if <60',
    'Toxicity risk increases with hypokalemia - always check K+',
    'Lower target level (0.5-0.9) in HF is safer and equally effective',
    'Visual changes (yellow halos) are classic toxicity sign',
    'Renal function determines maintenance dose',
    'Digibind (digoxin immune fab) is antidote for life-threatening toxicity',
    'Takes 5-7 days to reach steady state'
  ]::text[],
  nursing_guide = '{
    "iv": {
      "appropriateness": {
        "when_to_use": "Afib with RVR when rapid control needed, unable to take PO",
        "when_to_avoid": "WPW with Afib, hypokalemia, suspected toxicity, VF"
      },
      "preparation": {
        "steps": ["Check apical HR x1 min", "Verify K+ is >3.5", "Review current digoxin level if on maintenance", "Check renal function"],
        "required_supplies": ["Digoxin ampule", "Syringe", "Cardiac monitor"]
      },
      "administration": {
        "method": "Slow IV push over 5 minutes minimum",
        "monitoring_during": "ECG for arrhythmias, HR response"
      },
      "post_administration": {
        "monitoring": "HR and rhythm, signs of toxicity (nausea, visual changes)",
        "documentation": "Apical HR pre-dose, dose given, response"
      },
      "patient_teaching": ["Report nausea or vision changes", "Take pulse before each dose at home"]
    }
  }'::jsonb,
  pharmacokinetics = '{
    "onset": {"iv": "5-30 minutes", "po": "1-2 hours"},
    "peak": {"iv": "1-4 hours", "po": "2-6 hours"},
    "duration": "3-4 days (half-life dependent)",
    "half_life": "36-48 hours (prolonged in renal failure)",
    "metabolism": "Minimal hepatic, mostly excreted unchanged",
    "excretion": "Renal 60-80% unchanged",
    "volume_of_distribution": "Large, binds to tissues"
  }'::jsonb,
  adverse_reactions = '{
    "common": ["Nausea", "Fatigue", "Dizziness", "Headache"],
    "serious": ["Digoxin toxicity", "Fatal arrhythmias (VT, VF, heart block)", "Visual disturbances"],
    "toxicity_signs": ["GI: Anorexia, nausea, vomiting", "CNS: Confusion, fatigue", "Visual: Yellow-green halos, blurred vision", "Cardiac: Any new arrhythmia"],
    "management": {
      "mild_toxicity": "Hold digoxin, correct K+/Mg, monitor",
      "severe_toxicity": "Digoxin immune fab (Digibind) - dose based on level or amount ingested",
      "arrhythmias": "Treat arrhythmias, avoid cardioversion if possible"
    }
  }'::jsonb,
  drug_interactions_info = '{
    "major": [
      {"drug": "Amiodarone", "effect": "Increases digoxin 70-100% - reduce digoxin by 50%"},
      {"drug": "Verapamil", "effect": "Increases digoxin 50-75% - reduce dose"},
      {"drug": "Dronedarone", "effect": "Increases digoxin 2.5x - reduce digoxin by 50%"},
      {"drug": "Quinidine", "effect": "Doubles digoxin level - reduce by 50%"}
    ],
    "moderate": [
      {"drug": "Diuretics", "effect": "Hypokalemia increases toxicity risk"},
      {"drug": "Diltiazem", "effect": "Increases digoxin 20-40%"}
    ]
  }'::jsonb
WHERE LOWER(generic_name) = 'digoxin';

-- Update Hydralazine with comprehensive data
UPDATE public.medications SET
  dosing_info = '{
    "adult": {
      "iv": "5-20 mg every 4-6 hours PRN",
      "im": "10-50 mg every 4-6 hours PRN",
      "oral": "10-50 mg QID",
      "hypertensive_urgency": "10-20 mg IV every 4-6 hours",
      "hf_with_nitrates": "25-100 mg TID-QID (with isosorbide)"
    },
    "pediatric": {
      "iv_im": "0.1-0.2 mg/kg every 4-6 hours (max 20 mg/dose)",
      "oral": "0.75-1 mg/kg/day divided TID-QID"
    },
    "preeclampsia": "5 mg IV, then 5-10 mg every 20-40 minutes (max 20 mg)",
    "renal_adjustment": "CrCl 10-50: Give every 8 hours; CrCl <10: Give every 8-16 hours",
    "max_dose": "300 mg/day PO, 40 mg/dose IV"
  }'::jsonb,
  administration_info = '{
    "iv": {
      "dilution": "May give undiluted or dilute in NS",
      "rate": "Slow push over 1 minute",
      "compatibility": "NS"
    },
    "im": {
      "site": "Deep IM into large muscle",
      "note": "IM absorption erratic - IV preferred"
    },
    "oral": {
      "administration": "Give with food to enhance absorption",
      "note": "Consistent administration with meals recommended"
    },
    "storage": "Color change indicates degradation - discard if discolored"
  }'::jsonb,
  safety_info = '{
    "black_box_warnings": [],
    "contraindications": [
      "Coronary artery disease",
      "Mitral valve rheumatic heart disease",
      "Hypersensitivity to hydralazine",
      "Dissecting aortic aneurysm"
    ],
    "warnings": [
      "Reflex tachycardia - often given with beta-blocker",
      "Drug-induced lupus with high doses (>200 mg/day) or prolonged use",
      "May precipitate angina in CAD",
      "Peripheral neuropathy (pyridoxine deficiency)"
    ]
  }'::jsonb,
  monitoring = '{
    "parameters": ["Blood pressure", "Heart rate", "Signs of lupus-like syndrome", "CBC", "ANA if prolonged use"],
    "frequency": "BP every 5-15 min during IV therapy, then every 4 hours",
    "lupus_monitoring": "ANA at baseline and periodically with chronic high-dose use"
  }'::jsonb,
  hold_parameters = '{
    "blood_pressure": {"systolic_below": 90},
    "heart_rate": {"above": 120},
    "symptoms": "Chest pain, joint pain, fever (lupus symptoms)"
  }'::jsonb,
  clinical_pearls = ARRAY[
    'Causes reflex tachycardia - often combined with beta-blocker',
    'Drug of choice for hypertensive urgency in pregnancy',
    'Drug-induced lupus more common in slow acetylators',
    'Part of hydralazine/isosorbide for HFrEF in Black patients',
    'Keep total daily dose <200 mg to minimize lupus risk',
    'Color change in solution indicates degradation - do not use'
  ]::text[],
  nursing_guide = '{
    "iv": {
      "appropriateness": {
        "when_to_use": "Hypertensive urgency, preeclampsia/eclampsia, HF",
        "when_to_avoid": "CAD, aortic dissection, mitral stenosis, tachycardia"
      },
      "preparation": {
        "steps": ["Inspect for color change", "May give undiluted", "Have BP cuff ready for frequent monitoring"],
        "required_supplies": ["Hydralazine vial", "Syringe", "BP cuff", "Cardiac monitor"]
      },
      "administration": {
        "method": "Slow IV push over 1 minute",
        "monitoring_during": "BP every 5 minutes, heart rate"
      },
      "post_administration": {
        "monitoring": "BP and HR every 5 min x15 min, then every 15 min x1 hour",
        "documentation": "Time, dose, BP/HR before and after, response"
      },
      "patient_teaching": ["Report headache or palpitations", "Rise slowly to avoid dizziness", "Report joint pain with chronic use"]
    }
  }'::jsonb,
  pharmacokinetics = '{
    "onset": {"iv": "5-20 minutes", "po": "20-30 minutes"},
    "peak": {"iv": "10-80 minutes", "po": "1-2 hours"},
    "duration": {"iv": "2-6 hours", "po": "2-6 hours"},
    "half_life": "3-7 hours",
    "metabolism": "Hepatic acetylation (genetic variability - fast vs slow acetylators)",
    "excretion": "Renal",
    "bioavailability": "26-55% (first-pass metabolism)"
  }'::jsonb,
  adverse_reactions = '{
    "common": ["Headache", "Tachycardia", "Palpitations", "Flushing", "Nausea", "Dizziness"],
    "serious": ["Drug-induced lupus", "Angina exacerbation", "Severe hypotension", "Peripheral neuropathy"],
    "management": {
      "tachycardia": "Add beta-blocker for rate control",
      "hypotension": "Fluids, vasopressors if severe",
      "drug_induced_lupus": "Discontinue hydralazine - usually reversible"
    }
  }'::jsonb,
  drug_interactions_info = '{
    "major": [
      {"drug": "MAOIs", "effect": "Severe hypotension - avoid combination"}
    ],
    "moderate": [
      {"drug": "Other antihypertensives", "effect": "Additive hypotension"},
      {"drug": "NSAIDs", "effect": "Reduced antihypertensive effect"},
      {"drug": "Beta-blockers", "effect": "Actually beneficial - reduces reflex tachycardia"}
    ]
  }'::jsonb
WHERE LOWER(generic_name) = 'hydralazine';
