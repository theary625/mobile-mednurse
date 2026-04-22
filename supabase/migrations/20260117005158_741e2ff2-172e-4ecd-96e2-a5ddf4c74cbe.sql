
-- Insert Metoprolol with comprehensive data
INSERT INTO public.medications (
  generic_name,
  brand_names,
  drug_class,
  route,
  dosage_form,
  strengths,
  high_alert,
  controlled_substance,
  double_check_required,
  dosing_info,
  administration_info,
  safety_info,
  monitoring,
  adjustments,
  hold_parameters,
  clinical_pearls,
  nursing_guide,
  pharmacokinetics,
  adverse_reactions,
  drug_interactions_info
) VALUES (
  'metoprolol',
  ARRAY['Lopressor', 'Toprol-XL'],
  'Beta-blocker',
  ARRAY['PO', 'IV'],
  'Tablet, Extended-release tablet, Injectable',
  ARRAY['25mg', '50mg', '100mg', '200mg', '1mg/mL injection'],
  true,
  false,
  false,
  '{
    "adult": {
      "hypertension": "Initial: 25-100mg daily; Max: 450mg/day",
      "heart_failure": "Initial: 12.5-25mg daily; Target: 200mg daily",
      "angina": "Initial: 50mg twice daily; Max: 400mg/day",
      "afib_rate_control": "2.5-5mg IV bolus over 2 min; may repeat q5min up to 15mg",
      "ami": "5mg IV q2min x3 doses, then 50mg PO q6h x48h"
    },
    "pediatric": {
      "hypertension": "1-2mg/kg/day divided BID; Max: 6mg/kg/day"
    },
    "geriatric": "Start at lower doses; titrate slowly"
  }'::jsonb,
  '{
    "IV": {
      "methods": {
        "IV_Push": {
          "dilution": "May give undiluted",
          "concentration": "1mg/mL",
          "rate": "Administer over 1-2 minutes per 5mg dose",
          "max_rate": "5mg over 2 minutes"
        }
      },
      "compatibility": "D5W, NS, LR",
      "stability": "24 hours at room temperature"
    },
    "PO": {
      "timing": "With or immediately after meals",
      "extended_release": "Do not crush, chew, or split XL formulation",
      "immediate_release": "May be crushed if needed"
    },
    "general": {
      "monitoring_during_admin": "Heart rate and blood pressure before each dose",
      "hold_parameters": "Hold if HR <60 or SBP <90"
    }
  }'::jsonb,
  '{
    "contraindications": ["Sinus bradycardia", "Heart block >1st degree", "Cardiogenic shock", "Decompensated heart failure", "Sick sinus syndrome"],
    "precautions": ["Diabetes (masks hypoglycemia symptoms)", "Peripheral vascular disease", "Bronchospastic disease", "Thyroid disorders"],
    "black_box_warning": "Do not abruptly discontinue - taper over 1-2 weeks to avoid rebound hypertension, MI, or arrhythmias"
  }'::jsonb,
  '{
    "parameters": ["Heart rate", "Blood pressure", "ECG", "Signs of heart failure"],
    "frequency": "Before each dose; continuously during IV administration",
    "therapeutic_goals": {
      "heart_rate": "60-80 bpm at rest",
      "blood_pressure": "Per individual goal"
    }
  }'::jsonb,
  '{
    "renal": {
      "no_adjustment": "No dose adjustment needed for renal impairment",
      "dialysis": "Not dialyzable; no supplemental dose needed"
    },
    "hepatic": {
      "mild_moderate": "Consider dose reduction",
      "severe": "Start with lower doses; monitor closely"
    }
  }'::jsonb,
  '{
    "hr_threshold": "Hold if HR <60 bpm",
    "bp_threshold": "Hold if SBP <90 mmHg",
    "symptoms": "Hold for symptomatic bradycardia, heart block, or acute heart failure"
  }'::jsonb,
  ARRAY[
    'Metoprolol succinate (Toprol-XL) is for once-daily dosing; tartrate (Lopressor) is dosed BID-TID',
    'Food increases absorption of tartrate formulation by 40%',
    'Beta-1 selective at low doses but loses selectivity at higher doses',
    'Can mask tachycardia and tremor associated with hypoglycemia in diabetics',
    'Avoid abrupt discontinuation - can precipitate rebound hypertension or MI'
  ],
  '{
    "IV": {
      "appropriateness": {
        "when_to_use": "SVT, afib/flutter rate control, perioperative hypertension, acute MI",
        "when_to_avoid": "Decompensated heart failure, cardiogenic shock, severe bradycardia"
      },
      "preparation": {
        "supplies": "Syringe, cardiac monitor",
        "dilution": "Give undiluted"
      },
      "administration": {
        "rate": "1-2 minutes per 5mg dose",
        "technique": "Slow IV push with continuous cardiac monitoring"
      },
      "post_admin": {
        "monitoring": "HR, BP, ECG rhythm q5min x 15min, then q15min x 1hr",
        "documentation": "Pre/post HR and BP, rhythm, patient response"
      },
      "patient_teaching": "You may feel your heart slow down; report dizziness or lightheadedness"
    },
    "PO": {
      "appropriateness": {
        "when_to_use": "Chronic hypertension, heart failure, angina, rate control",
        "when_to_avoid": "Severe bradycardia, hypotension, acute decompensation"
      },
      "administration": {
        "timing": "With food to enhance absorption (tartrate)",
        "technique": "XL tablets must be swallowed whole"
      },
      "patient_teaching": "Take at same time daily; do not stop suddenly; monitor pulse"
    }
  }'::jsonb,
  '{
    "absorption": {
      "bioavailability": "50% (tartrate); 77% (succinate)",
      "onset_po": "1-2 hours",
      "onset_iv": "1-2 minutes",
      "peak_po": "1-2 hours (tartrate); 6-12 hours (succinate)",
      "peak_iv": "20 minutes",
      "food_effect": "Increases absorption of tartrate by 40%"
    },
    "distribution": {
      "protein_binding": "12%",
      "vd": "3.2-5.6 L/kg",
      "crosses_bbb": "Yes - lipophilic",
      "crosses_placenta": "Yes"
    },
    "metabolism": {
      "primary_pathway": "Hepatic via CYP2D6",
      "active_metabolites": "Alpha-hydroxymetoprolol (weak activity)",
      "genetic_polymorphism": "CYP2D6 poor metabolizers have higher levels"
    },
    "excretion": {
      "primary_route": "Renal (95%)",
      "unchanged_drug": "3-10%",
      "fecal": "<5%"
    },
    "half_life": {
      "normal": "3-7 hours (tartrate); 3-7 hours (succinate)",
      "hepatic_impairment": "Prolonged",
      "cyp2d6_poor_metabolizers": "Up to 9 hours"
    },
    "duration": {
      "immediate_release": "6-12 hours",
      "extended_release": "24 hours"
    }
  }'::jsonb,
  '{
    "frequency_based": {
      "common": ["Fatigue", "Dizziness", "Bradycardia", "Hypotension", "Cold extremities", "Depression"],
      "less_common": ["Bronchospasm", "Heart failure worsening", "Nightmares", "Erectile dysfunction"],
      "rare": ["Alopecia", "Thrombocytopenia", "Psoriasis-like rash"]
    },
    "body_system": {
      "cardiovascular": ["Bradycardia", "Hypotension", "Heart block", "Peripheral edema", "Cold extremities"],
      "cns": ["Fatigue", "Dizziness", "Depression", "Nightmares", "Confusion"],
      "respiratory": ["Bronchospasm", "Dyspnea", "Wheezing"],
      "gi": ["Nausea", "Diarrhea", "Constipation"],
      "metabolic": ["Masking hypoglycemia", "Weight gain"]
    }
  }'::jsonb,
  '{
    "major": [
      {
        "drug": "Verapamil/Diltiazem",
        "effect": "Severe bradycardia, heart block, heart failure",
        "mechanism": "Additive negative chronotropic and inotropic effects",
        "management": "Avoid combination; if used, monitor closely"
      },
      {
        "drug": "Clonidine",
        "effect": "Rebound hypertension if clonidine stopped first",
        "mechanism": "Unopposed alpha stimulation",
        "management": "Taper beta-blocker first before discontinuing clonidine"
      }
    ],
    "moderate": [
      {
        "drug": "Insulin/Oral hypoglycemics",
        "effect": "Masked hypoglycemia symptoms (except sweating)",
        "mechanism": "Beta-blockade masks tachycardia",
        "management": "Monitor blood glucose more frequently"
      },
      {
        "drug": "CYP2D6 inhibitors (fluoxetine, paroxetine)",
        "effect": "Increased metoprolol levels",
        "mechanism": "Inhibited metabolism",
        "management": "Consider dose reduction; monitor HR/BP"
      }
    ],
    "minor": [
      {
        "drug": "NSAIDs",
        "effect": "Reduced antihypertensive effect",
        "mechanism": "Prostaglandin inhibition",
        "management": "Monitor blood pressure"
      }
    ]
  }'::jsonb
);

-- Insert Lisinopril with comprehensive data
INSERT INTO public.medications (
  generic_name,
  brand_names,
  drug_class,
  route,
  dosage_form,
  strengths,
  high_alert,
  controlled_substance,
  double_check_required,
  dosing_info,
  administration_info,
  safety_info,
  monitoring,
  adjustments,
  hold_parameters,
  clinical_pearls,
  nursing_guide,
  pharmacokinetics,
  adverse_reactions,
  drug_interactions_info
) VALUES (
  'lisinopril',
  ARRAY['Prinivil', 'Zestril', 'Qbrelis'],
  'ACE Inhibitor',
  ARRAY['PO'],
  'Tablet, Oral solution',
  ARRAY['2.5mg', '5mg', '10mg', '20mg', '30mg', '40mg', '1mg/mL solution'],
  false,
  false,
  false,
  '{
    "adult": {
      "hypertension": "Initial: 10mg daily; Usual: 20-40mg daily; Max: 80mg/day",
      "heart_failure": "Initial: 2.5-5mg daily; Target: 20-40mg daily",
      "post_mi": "Initial: 5mg within 24h, then 5mg after 24h, then 10mg daily",
      "diabetic_nephropathy": "10-20mg daily"
    },
    "pediatric": {
      "hypertension_6_years_plus": "Initial: 0.07mg/kg once daily; Max: 0.61mg/kg or 40mg/day"
    },
    "geriatric": "Start at lower doses; monitor renal function and potassium"
  }'::jsonb,
  '{
    "PO": {
      "timing": "Once daily at consistent time",
      "with_food": "May take with or without food",
      "administration": "Swallow tablets whole; oral solution may be used for those who cannot swallow tablets"
    },
    "general": {
      "first_dose_effect": "May cause significant first-dose hypotension, especially if volume depleted",
      "monitoring_during_admin": "Blood pressure 2-4 hours after first dose"
    }
  }'::jsonb,
  '{
    "contraindications": ["History of angioedema with ACE inhibitor", "Bilateral renal artery stenosis", "Pregnancy (2nd/3rd trimester)", "Concurrent use with aliskiren in diabetes"],
    "precautions": ["Hypotension risk if volume depleted", "Hyperkalemia risk", "Renal impairment", "Aortic stenosis"],
    "black_box_warning": "Pregnancy: Discontinue as soon as pregnancy is detected. Can cause fetal harm and death when administered during 2nd and 3rd trimesters."
  }'::jsonb,
  '{
    "parameters": ["Blood pressure", "Serum creatinine", "BUN", "Potassium", "Signs of angioedema"],
    "frequency": "BMP at baseline, 1-2 weeks after initiation/dose change, then periodically",
    "therapeutic_goals": {
      "blood_pressure": "Per individual goal",
      "renal_function": "Cr increase <30% from baseline acceptable"
    }
  }'::jsonb,
  '{
    "renal": {
      "crcl_30_80": "Initial: 5-10mg daily",
      "crcl_10_30": "Initial: 2.5-5mg daily",
      "crcl_less_10": "Initial: 2.5mg daily",
      "dialysis": "Initial: 2.5mg daily; give post-dialysis on dialysis days"
    },
    "hepatic": {
      "no_adjustment": "No dose adjustment required"
    }
  }'::jsonb,
  '{
    "bp_threshold": "Hold if SBP <90 mmHg",
    "potassium": "Hold if K+ >5.5 mEq/L; reassess at >5.0",
    "creatinine": "Hold if Cr increases >30% from baseline",
    "symptoms": "Hold for angioedema, persistent cough, or symptomatic hypotension"
  }'::jsonb,
  ARRAY[
    'African American patients may have reduced response; consider adding thiazide diuretic or CCB',
    'ACE inhibitor cough occurs in 5-20% of patients; usually develops within 1-6 months',
    'Angioedema can occur at any time during therapy; higher risk in African Americans',
    'Check K+ and Cr 1-2 weeks after starting or increasing dose',
    'One of few ACE inhibitors that does not require hepatic activation (no prodrug)'
  ],
  '{
    "PO": {
      "appropriateness": {
        "when_to_use": "Hypertension, heart failure with reduced EF, post-MI, diabetic nephropathy",
        "when_to_avoid": "Pregnancy, history of angioedema with ACE inhibitors, bilateral RAS"
      },
      "preparation": {
        "supplies": "Blood pressure cuff, recent BMP results"
      },
      "administration": {
        "timing": "Give at consistent time daily; first dose may cause hypotension",
        "technique": "Monitor BP 2-4 hours after first dose if high-risk patient"
      },
      "post_admin": {
        "monitoring": "BP, watch for dizziness/lightheadedness, signs of angioedema",
        "documentation": "BP before and after first dose, any adverse effects"
      },
      "patient_teaching": "Report swelling of face/lips/tongue immediately; avoid salt substitutes containing potassium; may cause dry cough"
    }
  }'::jsonb,
  '{
    "absorption": {
      "bioavailability": "25%",
      "onset": "1 hour",
      "peak": "6-8 hours",
      "food_effect": "No significant effect"
    },
    "distribution": {
      "protein_binding": "Minimal (<10%)",
      "vd": "Not extensively distributed",
      "crosses_bbb": "No",
      "crosses_placenta": "Yes (contraindicated)"
    },
    "metabolism": {
      "primary_pathway": "Not metabolized (active drug)",
      "active_metabolites": "None - lisinopril is the active form",
      "prodrug": "No (unlike enalapril, this is already active)"
    },
    "excretion": {
      "primary_route": "Renal (100%)",
      "unchanged_drug": "100%",
      "fecal": "None"
    },
    "half_life": {
      "normal": "12 hours",
      "renal_impairment": "Prolonged proportional to CrCl reduction",
      "accumulation": "Significant in renal impairment"
    },
    "duration": {
      "antihypertensive_effect": "24 hours"
    },
    "dialysis": {
      "hemodialysis": "Removed; dose after dialysis",
      "peritoneal": "Partially removed"
    }
  }'::jsonb,
  '{
    "frequency_based": {
      "common": ["Cough (5-20%)", "Dizziness", "Headache", "Hypotension", "Hyperkalemia"],
      "less_common": ["Fatigue", "Diarrhea", "Nausea", "Rash", "Taste disturbance"],
      "rare": ["Angioedema (0.1-0.5%)", "Neutropenia", "Hepatotoxicity", "Pancreatitis"]
    },
    "body_system": {
      "cardiovascular": ["Hypotension", "Orthostatic hypotension", "Syncope", "Chest pain"],
      "respiratory": ["Dry persistent cough", "Upper respiratory symptoms"],
      "renal": ["Increased creatinine", "Acute kidney injury", "Proteinuria"],
      "metabolic": ["Hyperkalemia", "Hyponatremia"],
      "dermatologic": ["Rash", "Pruritus", "Angioedema"],
      "gi": ["Diarrhea", "Nausea", "Dysgeusia"],
      "hematologic": ["Neutropenia", "Agranulocytosis (rare)"]
    }
  }'::jsonb,
  '{
    "major": [
      {
        "drug": "Potassium supplements/K-sparing diuretics",
        "effect": "Severe hyperkalemia",
        "mechanism": "Additive potassium retention",
        "management": "Monitor K+ closely; avoid K+ supplements unless hypokalemic"
      },
      {
        "drug": "Aliskiren (in diabetes)",
        "effect": "Hyperkalemia, hypotension, renal impairment",
        "mechanism": "Dual RAAS blockade",
        "management": "Contraindicated in diabetic patients"
      },
      {
        "drug": "Sacubitril/valsartan (Entresto)",
        "effect": "Angioedema risk",
        "mechanism": "Combined neprilysin and ACE inhibition",
        "management": "36-hour washout period required between drugs"
      }
    ],
    "moderate": [
      {
        "drug": "NSAIDs",
        "effect": "Reduced antihypertensive effect; increased renal risk",
        "mechanism": "Prostaglandin inhibition",
        "management": "Monitor BP and renal function"
      },
      {
        "drug": "Lithium",
        "effect": "Increased lithium levels and toxicity",
        "mechanism": "Reduced renal lithium clearance",
        "management": "Monitor lithium levels; may need dose reduction"
      }
    ],
    "minor": [
      {
        "drug": "Antacids",
        "effect": "Reduced lisinopril absorption",
        "mechanism": "Decreased GI absorption",
        "management": "Separate administration by 2 hours"
      }
    ],
    "food_interactions": [
      {
        "item": "Salt substitutes (potassium-containing)",
        "effect": "Hyperkalemia",
        "management": "Avoid use; educate patient"
      }
    ]
  }'::jsonb
);

-- Insert Heparin with comprehensive data (HIGH ALERT medication)
INSERT INTO public.medications (
  generic_name,
  brand_names,
  drug_class,
  route,
  dosage_form,
  strengths,
  high_alert,
  controlled_substance,
  double_check_required,
  dosing_info,
  administration_info,
  safety_info,
  monitoring,
  adjustments,
  hold_parameters,
  clinical_pearls,
  nursing_guide,
  pharmacokinetics,
  adverse_reactions,
  drug_interactions_info
) VALUES (
  'heparin',
  ARRAY['Heparin Sodium'],
  'Anticoagulant',
  ARRAY['IV', 'SubQ'],
  'Injectable solution',
  ARRAY['1,000 units/mL', '5,000 units/mL', '10,000 units/mL', '25,000 units/500mL premix'],
  true,
  false,
  true,
  '{
    "adult": {
      "vte_treatment": {
        "weight_based": "80 units/kg bolus, then 18 units/kg/hr infusion",
        "fixed_dose": "5,000 unit bolus, then 1,000-1,300 units/hr"
      },
      "dvt_pe_prophylaxis": "5,000 units SubQ q8-12h",
      "cardiac_surgery": "300-400 units/kg IV",
      "acs_with_pci": "60-70 units/kg bolus (max 5,000 units)",
      "acs_medical": "60 units/kg bolus (max 4,000 units), then 12 units/kg/hr (max 1,000 units/hr)"
    },
    "pediatric": {
      "treatment": "75 units/kg bolus, then 20 units/kg/hr",
      "prophylaxis": "10-15 units/kg/hr"
    },
    "obesity": "Use actual body weight for bolus; consider lower maintenance based on ABW",
    "geriatric": "May require lower doses due to increased bleeding risk"
  }'::jsonb,
  '{
    "IV": {
      "methods": {
        "IV_Bolus": {
          "dilution": "May give undiluted or dilute in 50-100mL NS",
          "concentration": "1,000-10,000 units/mL (undiluted)",
          "rate": "Over 1-2 minutes for bolus"
        },
        "Continuous_Infusion": {
          "standard_concentration": "25,000 units in 500mL (50 units/mL) or 25,000 units in 250mL (100 units/mL)",
          "rate": "Per weight-based protocol or fixed-dose protocol",
          "titration": "Adjust based on aPTT per institutional protocol"
        }
      },
      "compatibility": "D5W, NS, LR (check concentration-specific compatibility)",
      "stability": "24 hours at room temperature",
      "line_flush": "Use saline for line maintenance; avoid heparin flush unless specifically ordered"
    },
    "SubQ": {
      "sites": "Abdomen (avoid 2 inches around umbilicus), upper arm, thigh",
      "technique": "Do NOT aspirate; do NOT massage after injection",
      "rotation": "Rotate sites systematically"
    },
    "general": {
      "independent_double_check": "REQUIRED for all heparin doses except flush solutions",
      "look_alike_sound_alike": "Distinguish from hespan (hetastarch); verify concentration carefully"
    }
  }'::jsonb,
  '{
    "contraindications": ["Active major bleeding", "Severe thrombocytopenia", "History of HIT", "Uncontrolled severe hypertension", "Intracranial hemorrhage"],
    "precautions": ["Recent surgery", "Bacterial endocarditis", "Active peptic ulcer", "Hepatic disease", "Renal impairment", "Elderly", "Recent LP or spinal anesthesia"],
    "black_box_warning": "Epidural/spinal hematomas: Risk with neuraxial anesthesia or spinal puncture. Can result in paralysis. Weigh benefits vs risks. Monitor for neurologic impairment."
  }'::jsonb,
  '{
    "parameters": ["aPTT", "Anti-Xa (if available)", "Platelet count", "Hemoglobin/Hematocrit", "Signs of bleeding"],
    "frequency": {
      "aPTT": "6 hours after bolus/rate change until therapeutic, then daily",
      "platelets": "Baseline, then every 2-3 days for first 14 days or while on therapy",
      "hgb_hct": "Baseline, then as clinically indicated"
    },
    "therapeutic_goals": {
      "aPTT": "1.5-2.5x control (typically 60-100 seconds; per institutional protocol)",
      "anti_Xa": "0.3-0.7 units/mL for treatment"
    }
  }'::jsonb,
  '{
    "renal": {
      "no_adjustment": "No specific dose adjustment, but increased bleeding risk",
      "monitoring": "More frequent monitoring recommended"
    },
    "hepatic": {
      "mild_moderate": "Use with caution; increased bleeding risk",
      "severe": "May have prolonged effect; monitor closely"
    },
    "obesity": {
      "bolus": "Use actual body weight",
      "infusion": "Consider adjusted body weight for obese patients; follow institutional protocol"
    }
  }'::jsonb,
  '{
    "bleeding": "Hold for active bleeding; notify provider immediately",
    "platelet_drop": "Hold if platelets <100,000 or drop >50% from baseline (concern for HIT)",
    "procedure": "Hold per institutional protocol prior to invasive procedures",
    "aptt_supratherapeutic": "Hold infusion per protocol if aPTT significantly elevated"
  }'::jsonb,
  ARRAY[
    'Always perform independent double-check before administration',
    'HIT typically occurs 5-14 days after starting heparin; monitor platelets',
    'Protamine sulfate is the reversal agent (1mg neutralizes ~100 units heparin)',
    'Do NOT use interchangeably with low molecular weight heparins (enoxaparin)',
    'Avoid IM injections and invasive procedures while anticoagulated',
    'SubQ prophylactic dosing does not require aPTT monitoring'
  ],
  '{
    "IV": {
      "appropriateness": {
        "when_to_use": "VTE treatment, ACS, cardiac surgery, bridging anticoagulation",
        "when_to_avoid": "Active bleeding, HIT, severe thrombocytopenia"
      },
      "preparation": {
        "supplies": "IV tubing, infusion pump, recent aPTT and platelets",
        "verification": "Independent double-check of dose, concentration, rate"
      },
      "administration": {
        "bolus": "Administer over 1-2 minutes",
        "infusion": "Use infusion pump; never run by gravity",
        "technique": "Dedicate line or lumen if possible"
      },
      "post_admin": {
        "monitoring": "aPTT 6h after bolus/change; daily platelets; assess for bleeding",
        "documentation": "Time of bolus, infusion rate, aPTT results, any bleeding"
      },
      "patient_teaching": "Report any unusual bleeding, bruising, or blood in urine/stool"
    },
    "SubQ": {
      "appropriateness": {
        "when_to_use": "DVT prophylaxis",
        "when_to_avoid": "Active bleeding, HIT, need for full anticoagulation"
      },
      "preparation": {
        "supplies": "Prefilled syringe or draw from vial, alcohol swab"
      },
      "administration": {
        "site": "Abdomen preferred; rotate sites",
        "technique": "Pinch skin; inject at 90° or 45°; do NOT aspirate or rub"
      },
      "patient_teaching": "You may notice small bruises at injection sites; this is normal"
    }
  }'::jsonb,
  '{
    "absorption": {
      "bioavailability": "IV: 100%; SubQ: 30% (variable)",
      "onset_iv": "Immediate",
      "onset_subq": "20-30 minutes",
      "peak_iv": "Immediate (anticoagulant effect)",
      "peak_subq": "2-4 hours"
    },
    "distribution": {
      "protein_binding": "Extensive to plasma proteins, endothelial cells, macrophages",
      "vd": "0.07 L/kg (remains primarily intravascular)",
      "crosses_bbb": "No",
      "crosses_placenta": "No (safe in pregnancy for anticoagulation)"
    },
    "metabolism": {
      "primary_pathway": "Reticuloendothelial system (RES) - saturable",
      "secondary_pathway": "Renal - nonsaturable (dose-dependent)",
      "active_metabolites": "None"
    },
    "excretion": {
      "primary_route": "Reticuloendothelial system",
      "secondary_route": "Renal (partially)",
      "unchanged_drug": "Up to 50% (dose-dependent)"
    },
    "half_life": {
      "dose_dependent": "30 min (25 units/kg) to 150 min (400 units/kg)",
      "average": "60-90 minutes at therapeutic doses",
      "notes": "Nonlinear pharmacokinetics; increases with dose"
    },
    "duration": {
      "iv_bolus": "2-4 hours",
      "subq": "8-12 hours"
    },
    "special_considerations": {
      "obesity": "Increased Vd; may need higher loading doses",
      "pregnancy": "Does not cross placenta; anticoagulant of choice"
    }
  }'::jsonb,
  '{
    "frequency_based": {
      "common": ["Bleeding (hemorrhage)", "Bruising", "Injection site reactions", "Thrombocytopenia"],
      "less_common": ["Osteoporosis (long-term use)", "Alopecia", "Hyperkalemia"],
      "rare": ["HIT (heparin-induced thrombocytopenia) with thrombosis", "Anaphylaxis", "Skin necrosis"]
    },
    "body_system": {
      "hematologic": ["Hemorrhage (any site)", "Thrombocytopenia", "HIT with thrombosis", "Anemia"],
      "cardiovascular": ["Hemorrhagic stroke", "Retroperitoneal bleeding"],
      "gi": ["GI bleeding", "Hepatic enzyme elevation"],
      "dermatologic": ["Injection site hematoma", "Skin necrosis", "Alopecia"],
      "musculoskeletal": ["Osteoporosis (with prolonged use)"],
      "metabolic": ["Hyperkalemia (aldosterone suppression)"],
      "immunologic": ["Hypersensitivity reactions", "Anaphylaxis"]
    }
  }'::jsonb,
  '{
    "major": [
      {
        "drug": "Other anticoagulants (warfarin, DOACs, LMWH)",
        "effect": "Significantly increased bleeding risk",
        "mechanism": "Additive anticoagulation",
        "management": "Use only during transition with careful monitoring"
      },
      {
        "drug": "Thrombolytics (tPA, alteplase)",
        "effect": "Major hemorrhage risk",
        "mechanism": "Combined anticoagulation and fibrinolysis",
        "management": "Specific protocols for concurrent use; close monitoring"
      },
      {
        "drug": "Antiplatelet agents (aspirin, clopidogrel)",
        "effect": "Increased bleeding risk",
        "mechanism": "Impaired platelet function plus anticoagulation",
        "management": "Often used together in ACS; monitor for bleeding"
      }
    ],
    "moderate": [
      {
        "drug": "NSAIDs",
        "effect": "Increased bleeding risk",
        "mechanism": "GI irritation and platelet inhibition",
        "management": "Avoid if possible; use GI prophylaxis"
      },
      {
        "drug": "SSRIs",
        "effect": "Increased bleeding risk",
        "mechanism": "Reduced platelet serotonin",
        "management": "Monitor for bleeding; consider GI prophylaxis"
      }
    ],
    "minor": [
      {
        "drug": "Nitroglycerin IV",
        "effect": "Reduced heparin effect",
        "mechanism": "Unclear; may increase heparin metabolism",
        "management": "Monitor aPTT; may need higher heparin doses"
      }
    ],
    "reversal": [
      {
        "agent": "Protamine sulfate",
        "dose": "1mg neutralizes ~100 units heparin",
        "max_dose": "50mg",
        "precautions": "Risk of hypotension, bradycardia, anaphylaxis (especially in fish allergy or prior protamine exposure)"
      }
    ]
  }'::jsonb
);
