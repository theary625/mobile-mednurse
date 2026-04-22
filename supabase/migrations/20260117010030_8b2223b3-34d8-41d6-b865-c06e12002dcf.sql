
-- Update Enoxaparin with comprehensive data
UPDATE public.medications SET
  high_alert = true,
  double_check_required = true,
  dosing_info = '{
    "adult": {
      "dvt_pe_treatment": "1 mg/kg SubQ q12h OR 1.5 mg/kg SubQ daily",
      "prophylaxis_moderate": "40 mg SubQ daily",
      "prophylaxis_high_risk": "30 mg SubQ q12h (orthopedic surgery)",
      "acs_with_pci": "0.5 mg/kg IV bolus, then 1 mg/kg SubQ q12h",
      "acs_medical": "1 mg/kg SubQ q12h"
    },
    "pediatric": {
      "treatment": "<2 months: 1.5 mg/kg q12h; ≥2 months: 1 mg/kg q12h",
      "prophylaxis": "0.5 mg/kg q12h"
    },
    "obesity": "Use actual body weight; consider anti-Xa monitoring",
    "renal_crcl_30": "Reduce to q24h for treatment; 30mg daily for prophylaxis"
  }'::jsonb,
  administration_info = '{
    "SubQ": {
      "sites": "Abdomen (alternate left and right anterolateral/posterolateral)",
      "technique": "Do NOT expel air bubble; inject at 90° angle; do NOT rub",
      "rotation": "Rotate sites to minimize bruising"
    },
    "IV": {
      "use": "STEMI/ACS with PCI only",
      "method": "0.5 mg/kg bolus through IV line"
    },
    "general": {
      "independent_double_check": "Required for treatment doses",
      "do_not_interchange": "NOT interchangeable unit-for-unit with heparin"
    }
  }'::jsonb,
  safety_info = '{
    "contraindications": ["Active major bleeding", "History of HIT with enoxaparin", "Severe thrombocytopenia"],
    "precautions": ["Renal impairment (CrCl <30)", "Elderly", "Low body weight", "Spinal/epidural anesthesia"],
    "black_box_warning": "Epidural/spinal hematomas: Risk with neuraxial anesthesia. Can result in paralysis. Consider timing of doses around procedures."
  }'::jsonb,
  monitoring = '{
    "parameters": ["Anti-Xa level (if indicated)", "Platelet count", "Hemoglobin", "Signs of bleeding", "Creatinine"],
    "frequency": {
      "platelets": "Baseline, then periodic if therapy >4 days",
      "anti_xa": "4 hours post-dose if monitoring needed (obesity, renal impairment)"
    },
    "therapeutic_goals": {
      "treatment_q12h": "Peak anti-Xa 0.6-1.0 units/mL",
      "treatment_q24h": "Peak anti-Xa 1.0-2.0 units/mL",
      "prophylaxis": "Monitoring typically not needed"
    }
  }'::jsonb,
  hold_parameters = '{
    "bleeding": "Hold for active bleeding",
    "platelets": "Hold if platelets <100,000 or drop >50%",
    "procedure": "Hold 12-24 hours before surgery depending on dose"
  }'::jsonb,
  clinical_pearls = ARRAY[
    'Do NOT expel the air bubble from the prefilled syringe',
    'NOT interchangeable with unfractionated heparin or other LMWHs',
    'Anti-Xa levels needed in obesity, renal impairment, pregnancy',
    'No reliable reversal agent (protamine provides partial reversal only)',
    'Adjust dose for CrCl <30 mL/min to prevent accumulation'
  ],
  nursing_guide = '{
    "SubQ": {
      "appropriateness": {
        "when_to_use": "DVT/PE treatment, VTE prophylaxis, ACS",
        "when_to_avoid": "Active bleeding, severe renal impairment without adjustment, HIT"
      },
      "preparation": {
        "verification": "Independent double-check for treatment doses",
        "supplies": "Prefilled syringe, alcohol swab"
      },
      "administration": {
        "site": "Abdomen 2 inches from umbilicus; alternate sides",
        "technique": "90° angle; do NOT expel air bubble; do NOT rub"
      },
      "post_admin": {
        "monitoring": "Signs of bleeding, injection site bruising",
        "documentation": "Site used, dose, any bleeding"
      },
      "patient_teaching": "Expect small bruises; report unusual bleeding or blood in stool/urine"
    }
  }'::jsonb,
  pharmacokinetics = '{
    "absorption": {
      "bioavailability": "92% (SubQ)",
      "onset": "3-5 hours (peak anti-Xa)",
      "peak": "3-5 hours"
    },
    "distribution": {
      "vd": "4.3 L",
      "protein_binding": "Low"
    },
    "metabolism": {
      "primary": "Hepatic (depolymerization, desulfation)",
      "note": "Less protein binding than UFH"
    },
    "excretion": {
      "route": "Renal (40% as active fragments)",
      "renal_impairment": "Significant accumulation with CrCl <30"
    },
    "half_life": {
      "normal": "4.5-7 hours",
      "renal_impairment": "Prolonged significantly"
    }
  }'::jsonb,
  adverse_reactions = '{
    "frequency_based": {
      "common": ["Injection site bruising", "Bleeding", "Anemia", "Thrombocytopenia"],
      "less_common": ["Injection site pain", "Elevated LFTs", "Hyperkalemia"],
      "rare": ["HIT", "Skin necrosis", "Osteoporosis (long-term)"]
    },
    "body_system": {
      "hematologic": ["Bleeding", "Thrombocytopenia", "HIT", "Anemia"],
      "dermatologic": ["Injection site bruising/hematoma", "Skin necrosis", "Alopecia"],
      "metabolic": ["Hyperkalemia"],
      "hepatic": ["Elevated transaminases"]
    }
  }'::jsonb,
  drug_interactions_info = '{
    "major": [
      {
        "drug": "Other anticoagulants",
        "effect": "Significantly increased bleeding",
        "mechanism": "Additive anticoagulation",
        "management": "Avoid concurrent use except during transitions"
      },
      {
        "drug": "Antiplatelet agents",
        "effect": "Increased bleeding risk",
        "mechanism": "Additive effects on hemostasis",
        "management": "Often used together in ACS - monitor closely"
      }
    ],
    "moderate": [
      {
        "drug": "NSAIDs",
        "effect": "Increased bleeding",
        "mechanism": "Platelet inhibition + GI irritation",
        "management": "Avoid if possible; use GI prophylaxis"
      }
    ],
    "reversal": [
      {
        "agent": "Protamine sulfate",
        "efficacy": "Partial - neutralizes 60% of anti-Xa activity",
        "dose": "1mg protamine per 1mg enoxaparin (within 8 hours of dose)"
      }
    ]
  }'::jsonb
WHERE LOWER(generic_name) = 'enoxaparin';

-- Update Dopamine with comprehensive data
UPDATE public.medications SET
  high_alert = true,
  double_check_required = true,
  dosing_info = '{
    "adult": {
      "low_dose_renal": "1-5 mcg/kg/min (dopaminergic effects - renal/splanchnic vasodilation)",
      "moderate_dose_cardiac": "5-10 mcg/kg/min (beta effects - increased contractility)",
      "high_dose_vasopressor": "10-20 mcg/kg/min (alpha effects - vasoconstriction)",
      "max": ">20 mcg/kg/min rarely beneficial; consider adding norepinephrine"
    },
    "pediatric": {
      "initial": "1-5 mcg/kg/min",
      "titration": "Increase by 1-4 mcg/kg/min increments to effect"
    }
  }'::jsonb,
  administration_info = '{
    "IV": {
      "methods": {
        "Continuous_Infusion": {
          "standard_concentration": "800 mg in 500mL (1600 mcg/mL) or 400 mg in 250mL",
          "line": "Central line STRONGLY preferred (vesicant)",
          "infusion_pump": "REQUIRED - never run by gravity"
        }
      },
      "compatibility": "D5W (preferred), NS",
      "stability": "24 hours at room temperature",
      "extravasation": "Vesicant - infiltration causes tissue necrosis"
    },
    "general": {
      "do_not_bolus": "Never give as IV push or bolus",
      "wean": "Wean gradually; do not stop abruptly"
    }
  }'::jsonb,
  safety_info = '{
    "contraindications": ["Pheochromocytoma", "Uncorrected tachyarrhythmias", "Ventricular fibrillation"],
    "precautions": ["Hypovolemia (correct first)", "MAO inhibitor use within 2-3 weeks", "Occlusive vascular disease"],
    "vesicant": "Causes severe tissue necrosis on extravasation - phentolamine is antidote"
  }'::jsonb,
  monitoring = '{
    "parameters": ["Blood pressure", "Heart rate", "Urine output", "ECG", "Peripheral perfusion", "IV site"],
    "frequency": {
      "continuous": "BP, HR, SpO2 on continuous monitor",
      "iv_site": "Check hourly for signs of infiltration"
    }
  }'::jsonb,
  hold_parameters = '{
    "tachycardia": "Reduce rate if HR >120-130 or new arrhythmia",
    "hypertension": "Reduce rate if SBP >180 or per target",
    "extravasation": "STOP immediately if infiltration suspected"
  }'::jsonb,
  clinical_pearls = ARRAY[
    'Dose-dependent receptor effects: low=dopaminergic, moderate=beta, high=alpha',
    'Low-dose dopamine for renal protection is NOT supported by evidence',
    'Central line strongly preferred due to vesicant properties',
    'Phentolamine 5-10 mg in 10mL NS is antidote for extravasation',
    'Norepinephrine is often preferred first-line vasopressor for septic shock'
  ],
  nursing_guide = '{
    "IV": {
      "appropriateness": {
        "when_to_use": "Cardiogenic shock, symptomatic bradycardia (if atropine fails), hypotension",
        "when_to_avoid": "Hypovolemia (correct first), pheochromocytoma"
      },
      "preparation": {
        "line": "Central line STRONGLY preferred",
        "concentration": "Standard concentrations only; verify with pharmacy",
        "pump": "Infusion pump required"
      },
      "administration": {
        "rate": "Start low, titrate to effect",
        "monitoring": "Continuous BP/HR; check IV site hourly"
      },
      "post_admin": {
        "monitoring": "BP, HR, urine output, perfusion, IV site",
        "documentation": "Rate, BP, HR, urine output q1h minimum"
      },
      "extravasation": "STOP infusion immediately; call provider; prepare phentolamine"
    }
  }'::jsonb,
  pharmacokinetics = '{
    "absorption": {
      "route": "IV only",
      "onset": "2-5 minutes"
    },
    "distribution": {
      "vd": "Limited; does not cross BBB",
      "note": "Does not reach CNS"
    },
    "metabolism": {
      "primary": "MAO, COMT",
      "location": "Liver, kidneys, plasma"
    },
    "excretion": {
      "route": "Renal (80%)",
      "form": "Metabolites (homovanillic acid)"
    },
    "half_life": {
      "normal": "2 minutes",
      "note": "Very short; effects stop within minutes of discontinuation"
    },
    "duration": {
      "effect": "Less than 10 minutes after stopping"
    }
  }'::jsonb,
  adverse_reactions = '{
    "frequency_based": {
      "common": ["Tachycardia", "Arrhythmias", "Hypertension", "Nausea", "Headache"],
      "less_common": ["Angina", "Dyspnea", "Piloerection", "Anxiety"],
      "rare": ["Tissue necrosis (extravasation)", "Gangrene of extremities"]
    },
    "body_system": {
      "cardiovascular": ["Tachycardia", "Arrhythmias", "Hypertension", "Hypotension (paradoxical at low doses)", "Angina", "Ectopic beats"],
      "cns": ["Headache", "Anxiety"],
      "gi": ["Nausea", "Vomiting"],
      "local": ["Tissue necrosis on extravasation", "Gangrene"],
      "respiratory": ["Dyspnea"]
    }
  }'::jsonb,
  drug_interactions_info = '{
    "major": [
      {
        "drug": "MAO inhibitors",
        "effect": "Severe hypertensive crisis",
        "mechanism": "Impaired dopamine metabolism",
        "management": "Reduce dopamine dose to 1/10th if MAOIs used within 2-3 weeks"
      },
      {
        "drug": "Phenytoin",
        "effect": "Hypotension and bradycardia",
        "mechanism": "Unknown",
        "management": "Avoid combination if possible"
      }
    ],
    "moderate": [
      {
        "drug": "Beta-blockers",
        "effect": "Unopposed alpha effects - severe hypertension",
        "mechanism": "Beta blockade leaves alpha vasoconstriction",
        "management": "Use with caution; monitor closely"
      }
    ],
    "antidote": [
      {
        "agent": "Phentolamine",
        "use": "Extravasation antidote",
        "dose": "5-10 mg in 10-15 mL NS; inject into affected area",
        "timing": "Within 12 hours of extravasation"
      }
    ]
  }'::jsonb
WHERE LOWER(generic_name) = 'dopamine';

-- Update Norepinephrine with comprehensive data
UPDATE public.medications SET
  high_alert = true,
  double_check_required = true,
  dosing_info = '{
    "adult": {
      "initial": "0.1-0.3 mcg/kg/min OR 2-4 mcg/min",
      "titration": "Increase by 1-2 mcg/min q5-10min to target MAP",
      "usual_range": "2-30 mcg/min",
      "max": "No absolute max; titrate to effect (rarely >30 mcg/min helps)"
    },
    "pediatric": {
      "initial": "0.05-0.1 mcg/kg/min",
      "titration": "Titrate to effect; typical range 0.1-2 mcg/kg/min"
    }
  }'::jsonb,
  administration_info = '{
    "IV": {
      "methods": {
        "Continuous_Infusion": {
          "standard_concentration": "4 mg in 250mL D5W (16 mcg/mL) or 8 mg in 250mL (32 mcg/mL)",
          "line": "Central line REQUIRED when possible (vesicant)",
          "peripheral": "May use temporarily in emergency via large bore IV"
        }
      },
      "compatibility": "D5W (preferred - degrades in NS), NS (shorter stability)",
      "protect_from_light": "Yes",
      "stability": "24 hours at room temperature protected from light"
    },
    "general": {
      "do_not_bolus": "NEVER give as IV push",
      "infusion_pump": "REQUIRED",
      "wean": "Wean gradually; do not stop abruptly"
    }
  }'::jsonb,
  safety_info = '{
    "contraindications": ["Hypovolemia (correct first)", "Mesenteric or peripheral vascular thrombosis (relative)"],
    "precautions": ["Peripheral vascular disease", "MAO inhibitor use", "Hyperthyroidism"],
    "vesicant": "Causes severe tissue necrosis on extravasation - phentolamine is antidote"
  }'::jsonb,
  monitoring = '{
    "parameters": ["Blood pressure (arterial line preferred)", "Heart rate", "Urine output", "Lactate", "IV site"],
    "frequency": {
      "continuous": "Arterial BP, HR, SpO2",
      "iv_site": "Hourly minimum for infiltration"
    },
    "targets": {
      "map": "≥65 mmHg (or per clinical target)"
    }
  }'::jsonb,
  hold_parameters = '{
    "map": "Wean when MAP stable at goal with decreasing lactate",
    "extravasation": "STOP immediately if infiltration suspected",
    "arrhythmia": "Reassess if new significant arrhythmia"
  }'::jsonb,
  clinical_pearls = ARRAY[
    'First-line vasopressor for septic shock per Surviving Sepsis guidelines',
    'Primarily alpha-1 effects (vasoconstriction) with some beta-1 (increased contractility)',
    'Central line required when possible - vesicant causing tissue necrosis',
    'D5W preferred diluent (more stable); NS acceptable short-term',
    'Phentolamine 5-10 mg in 10mL NS is antidote for extravasation'
  ],
  nursing_guide = '{
    "IV": {
      "appropriateness": {
        "when_to_use": "Septic shock, cardiogenic shock, profound hypotension",
        "when_to_avoid": "Hypovolemia without resuscitation"
      },
      "preparation": {
        "line": "Central line required when possible",
        "diluent": "D5W preferred for stability",
        "light_protection": "Protect from light"
      },
      "administration": {
        "pump": "Infusion pump required",
        "titration": "Per MAP goal; typical target ≥65 mmHg"
      },
      "post_admin": {
        "monitoring": "Continuous arterial BP, HR; check IV site hourly",
        "documentation": "Rate changes, BP/MAP, urine output"
      },
      "extravasation": "STOP immediately; call provider; prepare phentolamine"
    }
  }'::jsonb,
  pharmacokinetics = '{
    "absorption": {
      "route": "IV only",
      "onset": "Immediate (1-2 minutes)"
    },
    "distribution": {
      "vd": "Limited",
      "crosses_bbb": "No"
    },
    "metabolism": {
      "primary": "MAO and COMT",
      "location": "Liver, other tissues"
    },
    "excretion": {
      "route": "Renal (metabolites)"
    },
    "half_life": {
      "normal": "2-3 minutes"
    },
    "duration": {
      "effect": "1-2 minutes after stopping"
    }
  }'::jsonb,
  adverse_reactions = '{
    "frequency_based": {
      "common": ["Hypertension", "Reflex bradycardia", "Arrhythmias", "Headache"],
      "less_common": ["Peripheral ischemia", "Anxiety", "Dyspnea"],
      "rare": ["Tissue necrosis (extravasation)", "Organ ischemia", "Gangrene"]
    },
    "body_system": {
      "cardiovascular": ["Hypertension", "Bradycardia (reflex)", "Arrhythmias", "Peripheral ischemia", "Decreased cardiac output (excessive afterload)"],
      "local": ["Tissue necrosis on extravasation", "Gangrene"],
      "cns": ["Headache", "Anxiety"],
      "metabolic": ["Increased lactate (excessive dose)"]
    }
  }'::jsonb,
  drug_interactions_info = '{
    "major": [
      {
        "drug": "MAO inhibitors",
        "effect": "Severe prolonged hypertension",
        "mechanism": "Impaired norepinephrine metabolism",
        "management": "Reduce dose significantly if MAOIs used within 2-3 weeks"
      },
      {
        "drug": "Tricyclic antidepressants",
        "effect": "Enhanced pressor response",
        "mechanism": "Inhibited norepinephrine reuptake",
        "management": "Use lower doses; monitor closely"
      }
    ],
    "moderate": [
      {
        "drug": "Beta-blockers",
        "effect": "Severe hypertension from unopposed alpha effects",
        "mechanism": "Loss of beta-mediated vasodilation",
        "management": "Monitor closely; may need dose adjustment"
      }
    ],
    "antidote": [
      {
        "agent": "Phentolamine",
        "use": "Extravasation antidote",
        "dose": "5-10 mg in 10-15 mL NS; inject into affected area",
        "timing": "Within 12 hours of extravasation"
      }
    ]
  }'::jsonb
WHERE LOWER(generic_name) = 'norepinephrine';
