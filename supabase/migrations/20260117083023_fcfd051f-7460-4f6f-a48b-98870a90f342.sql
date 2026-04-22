-- Batch 1: Vasopressors with properly escaped apostrophes

-- DOPAMINE
UPDATE medications SET nursing_guide = '{
  "IV_Infusion": {
    "appropriateness": {
      "hold_if": ["Pheochromocytoma", "Uncorrected tachyarrhythmias", "Ventricular fibrillation", "Hypovolemia (must correct first)"],
      "required_labs": ["Baseline BP", "Heart rate", "MAP goal established", "Volume status assessed"],
      "allergy_alerts": ["Sulfite sensitivity (some formulations contain sulfites)"]
    },
    "special_prep": {
      "has_special_requirements": true,
      "notes": "Must dilute before infusion. Standard: 400mg/250mL D5W or NS = 1600 mcg/mL. Use infusion pump ONLY.",
      "filter_needle": false,
      "light_protection": false
    },
    "administration": {
      "rate": "Start 2-5 mcg/kg/min, titrate to effect",
      "max_rate": "20 mcg/kg/min (higher doses = alpha effects dominate)",
      "why_rate_matters": "Low dose (1-5): renal/splanchnic. Medium (5-10): cardiac. High (10-20): vasoconstriction",
      "line_type": "Central line preferred. If peripheral, use large vein, check q1h for infiltration",
      "flush": "Dedicated line - do not flush or bolus"
    },
    "post_admin": {
      "reassess_timing": "Continuous BP monitoring, q15min during titration",
      "expected_response": "Increased MAP within 5-10 minutes",
      "watch_for": ["Tachycardia", "Arrhythmias", "Tissue necrosis if extravasation", "Peripheral ischemia"],
      "document": ["Infusion rate", "MAP/BP response", "HR", "UOP", "Peripheral perfusion"]
    },
    "patient_teaching": {
      "tell_patient": "This medication is helping your blood pressure. You will have continuous monitoring.",
      "what_to_expect": "You may feel your heart beating faster. This is expected.",
      "report_immediately": ["Chest pain", "Numbness in fingers/toes", "Pain at IV site", "Irregular heartbeat"]
    }
  }
}'::jsonb WHERE generic_name = 'Dopamine';

-- NOREPINEPHRINE
UPDATE medications SET nursing_guide = '{
  "IV_Infusion": {
    "appropriateness": {
      "hold_if": ["Hypovolemia uncorrected", "Mesenteric/peripheral vascular thrombosis", "Profound hypoxia/hypercarbia"],
      "required_labs": ["Baseline MAP", "Lactate", "Volume status", "Central access confirmed"],
      "allergy_alerts": ["Sulfite allergy (contains sodium metabisulfite)"]
    },
    "special_prep": {
      "has_special_requirements": true,
      "notes": "Dilute 4mg in 250mL D5W or NS (16 mcg/mL) or 8mg in 250mL (32 mcg/mL). Use infusion pump ONLY.",
      "filter_needle": false,
      "light_protection": false
    },
    "administration": {
      "rate": "Start 0.05-0.1 mcg/kg/min, titrate q2-5min to MAP goal",
      "max_rate": "No absolute max, titrate to clinical response (typically 0.1-2 mcg/kg/min)",
      "why_rate_matters": "Potent vasoconstrictor - rapid BP changes occur. Small dose changes = big effect.",
      "line_type": "CENTRAL LINE STRONGLY PREFERRED. Peripheral only if central access delayed - use large vein, monitor q1h",
      "flush": "Dedicated lumen - never flush or bolus"
    },
    "post_admin": {
      "reassess_timing": "Continuous arterial line or q5min NIBP during titration",
      "expected_response": "Increased MAP within 1-2 minutes",
      "watch_for": ["Bradycardia (reflex)", "Arrhythmias", "Extravasation necrosis", "Peripheral/digital ischemia", "Reduced UOP"],
      "document": ["Rate (mcg/min or mcg/kg/min)", "MAP trend", "HR", "Peripheral perfusion", "UOP", "Lactate clearance"]
    },
    "patient_teaching": {
      "tell_patient": "This medication helps maintain your blood pressure. You will be closely monitored.",
      "what_to_expect": "Continuous blood pressure monitoring is normal.",
      "report_immediately": ["Burning or pain at IV site", "Cold or pale fingers/toes", "Chest discomfort"]
    }
  }
}'::jsonb WHERE generic_name = 'Norepinephrine';

-- EPINEPHRINE
UPDATE medications SET nursing_guide = '{
  "IV_Infusion": {
    "appropriateness": {
      "hold_if": ["Ventricular fibrillation (use per ACLS)", "Angle-closure glaucoma (relative)", "Sulfite allergy (some formulations)"],
      "required_labs": ["Baseline vitals", "Cardiac rhythm", "Potassium (hypokalemia risk)", "Glucose (may increase)"],
      "allergy_alerts": ["Sulfite sensitivity"]
    },
    "special_prep": {
      "has_special_requirements": true,
      "notes": "For infusion: 1mg in 250mL NS = 4 mcg/mL. Use infusion pump. Have crash cart nearby.",
      "filter_needle": false,
      "light_protection": true
    },
    "administration": {
      "rate": "Start 0.01-0.05 mcg/kg/min, titrate to effect",
      "max_rate": "0.3 mcg/kg/min (higher in refractory shock)",
      "why_rate_matters": "Low dose: beta effects (inotropic). Higher dose: alpha effects (vasoconstriction). Very potent.",
      "line_type": "Central line preferred. Peripheral acceptable short-term with close monitoring.",
      "flush": "Dedicated line - never bolus unless cardiac arrest"
    },
    "post_admin": {
      "reassess_timing": "Continuous cardiac monitoring, q5min BP during titration",
      "expected_response": "Increased HR, BP, and cardiac output within 1-2 minutes",
      "watch_for": ["Tachyarrhythmias", "Hypertensive crisis", "Hyperglycemia", "Hypokalemia", "Tissue necrosis if extravasation"],
      "document": ["Infusion rate", "BP/MAP", "HR and rhythm", "Glucose", "Peripheral perfusion"]
    },
    "patient_teaching": {
      "tell_patient": "This medication is supporting your heart and blood pressure.",
      "what_to_expect": "Your heart may beat faster. You will have continuous monitoring.",
      "report_immediately": ["Chest pain", "Palpitations", "Severe headache", "Difficulty breathing"]
    }
  },
  "IV_Push": {
    "appropriateness": {
      "hold_if": ["Active cardiac arrest - follow ACLS", "Do not bolus for infusion purposes"],
      "required_labs": ["Cardiac rhythm", "ACLS protocol in effect"],
      "allergy_alerts": ["Sulfite sensitivity"]
    },
    "special_prep": {
      "has_special_requirements": true,
      "notes": "For cardiac arrest: 1mg (1:10,000 concentration = 0.1 mg/mL). Verify concentration before push.",
      "filter_needle": false,
      "light_protection": false
    },
    "administration": {
      "rate": "Rapid IV push followed by 20mL NS flush",
      "max_rate": "Give as fast as possible during arrest",
      "why_rate_matters": "Cardiac arrest requires immediate drug delivery to central circulation.",
      "line_type": "Any IV access during arrest - ideally proximal or central",
      "flush": "20mL NS flush immediately after, elevate arm"
    },
    "post_admin": {
      "reassess_timing": "Immediately - check rhythm after each dose",
      "expected_response": "ROSC within 3-5 minutes if effective",
      "watch_for": ["ROSC", "Rhythm changes", "Return of pulse"],
      "document": ["Time given", "Rhythm before/after", "ROSC time if achieved"]
    },
    "patient_teaching": {
      "tell_patient": "N/A - cardiac arrest situation",
      "what_to_expect": "N/A",
      "report_immediately": []
    }
  }
}'::jsonb WHERE generic_name = 'Epinephrine';

-- VASOPRESSIN
UPDATE medications SET nursing_guide = '{
  "IV_Infusion": {
    "appropriateness": {
      "hold_if": ["Hypersensitivity to vasopressin", "Chronic nephritis with nitrogen retention"],
      "required_labs": ["Baseline BP/MAP", "Sodium level", "Fluid status"],
      "allergy_alerts": ["Rare hypersensitivity reactions"]
    },
    "special_prep": {
      "has_special_requirements": true,
      "notes": "Dilute 20-40 units in 100-250mL NS or D5W. Use infusion pump. Fixed-dose typically used in septic shock.",
      "filter_needle": false,
      "light_protection": false
    },
    "administration": {
      "rate": "Septic shock: Fixed 0.03-0.04 units/min (not titrated). GI bleed: 0.2-0.4 units/min",
      "max_rate": "0.04 units/min for septic shock, 0.4 units/min for GI bleed",
      "why_rate_matters": "Fixed low-dose for shock (adjunct to norepi). Higher doses cause ischemia.",
      "line_type": "Central line preferred, peripheral acceptable for short duration",
      "flush": "Dedicated line preferred"
    },
    "post_admin": {
      "reassess_timing": "q15-30min initially, then q1h when stable",
      "expected_response": "Improved MAP, decreased norepinephrine requirement",
      "watch_for": ["Hyponatremia", "Peripheral/mesenteric ischemia", "Bradycardia", "Decreased UOP", "Chest pain"],
      "document": ["Infusion rate", "MAP", "Other vasopressor doses", "Sodium", "UOP", "Peripheral perfusion"]
    },
    "patient_teaching": {
      "tell_patient": "This medication helps maintain your blood pressure alongside other medications.",
      "what_to_expect": "You will continue to be closely monitored.",
      "report_immediately": ["Abdominal pain", "Chest pain", "Cold or discolored fingers/toes"]
    }
  }
}'::jsonb WHERE generic_name = 'Vasopressin';

-- DOBUTAMINE
UPDATE medications SET nursing_guide = '{
  "IV_Infusion": {
    "appropriateness": {
      "hold_if": ["Hypertrophic cardiomyopathy with outflow obstruction", "Hypersensitivity", "Uncorrected hypovolemia", "Severe aortic stenosis"],
      "required_labs": ["Baseline BP", "HR", "CVP/wedge if available", "Lactate", "UOP"],
      "allergy_alerts": ["Sulfite sensitivity (contains sodium bisulfite)"]
    },
    "special_prep": {
      "has_special_requirements": true,
      "notes": "Dilute 250mg in 250mL D5W or NS = 1000 mcg/mL. Use infusion pump. Protect from light not required.",
      "filter_needle": false,
      "light_protection": false
    },
    "administration": {
      "rate": "Start 2.5-5 mcg/kg/min, titrate to effect (cardiac output, BP)",
      "max_rate": "20 mcg/kg/min (higher doses increase arrhythmia risk)",
      "why_rate_matters": "Primary inotrope - increases cardiac contractility. Higher doses may worsen tachycardia.",
      "line_type": "Central or large peripheral vein. Peripheral OK short-term.",
      "flush": "Dedicated line preferred, compatible with NS"
    },
    "post_admin": {
      "reassess_timing": "Continuous cardiac monitoring. Reassess hemodynamics q15min during titration.",
      "expected_response": "Increased cardiac output, improved end-organ perfusion, decreased lactate",
      "watch_for": ["Tachycardia (common)", "Arrhythmias (VT, PVCs)", "Hypotension (vasodilation)", "Angina", "Hypokalemia"],
      "document": ["Rate (mcg/kg/min)", "BP", "HR/rhythm", "UOP", "Lactate trend", "Signs of perfusion"]
    },
    "patient_teaching": {
      "tell_patient": "This medication helps your heart pump more effectively.",
      "what_to_expect": "Your heart rate may increase. Continuous monitoring is required.",
      "report_immediately": ["Chest pain", "Palpitations", "Difficulty breathing"]
    }
  }
}'::jsonb WHERE generic_name = 'Dobutamine';

-- PHENYLEPHRINE
UPDATE medications SET nursing_guide = '{
  "IV_Infusion": {
    "appropriateness": {
      "hold_if": ["Severe hypertension", "Ventricular tachycardia", "Hypersensitivity"],
      "required_labs": ["Baseline BP", "Heart rate", "ECG rhythm"],
      "allergy_alerts": ["Cross-sensitivity with other sympathomimetics rare"]
    },
    "special_prep": {
      "has_special_requirements": true,
      "notes": "Dilute 10mg in 250mL NS = 40 mcg/mL. Use infusion pump.",
      "filter_needle": false,
      "light_protection": false
    },
    "administration": {
      "rate": "Start 40-60 mcg/min, titrate to BP goal",
      "max_rate": "180-360 mcg/min",
      "why_rate_matters": "Pure alpha-agonist - causes vasoconstriction. Reflex bradycardia is expected.",
      "line_type": "Central preferred, peripheral acceptable with close monitoring",
      "flush": "Dedicated line"
    },
    "post_admin": {
      "reassess_timing": "Continuous BP monitoring, q5min during titration",
      "expected_response": "Increased BP within 1-2 minutes, may see reflex bradycardia",
      "watch_for": ["Reflex bradycardia (expected)", "Hypertensive overshoot", "Tissue ischemia", "Extravasation"],
      "document": ["Infusion rate", "BP/MAP", "HR (bradycardia expected)", "Peripheral perfusion"]
    },
    "patient_teaching": {
      "tell_patient": "This medication helps raise your blood pressure.",
      "what_to_expect": "Your heart rate may slow - this is normal with this medication.",
      "report_immediately": ["Severe headache", "Chest tightness", "Pain at IV site"]
    }
  },
  "IV_Push": {
    "appropriateness": {
      "hold_if": ["Severe hypertension", "Hypersensitivity"],
      "required_labs": ["Current BP", "HR"],
      "allergy_alerts": []
    },
    "special_prep": {
      "has_special_requirements": true,
      "notes": "Dilute to 100-200 mcg/mL. Common for OR/procedural hypotension.",
      "filter_needle": false,
      "light_protection": false
    },
    "administration": {
      "rate": "Give 50-200 mcg over 1-2 seconds",
      "max_rate": "Bolus appropriate for acute hypotension",
      "why_rate_matters": "Short duration (15-20 min). May need repeat doses.",
      "line_type": "Any patent IV",
      "flush": "Flush after to ensure delivery"
    },
    "post_admin": {
      "reassess_timing": "Within 1-2 minutes, repeat BP q5min",
      "expected_response": "BP increase within 30-60 seconds",
      "watch_for": ["Reflex bradycardia", "Hypertension overshoot"],
      "document": ["Dose given", "BP before/after", "HR"]
    },
    "patient_teaching": {
      "tell_patient": "This medication quickly raises your blood pressure.",
      "what_to_expect": "Effect is brief, you may need additional doses.",
      "report_immediately": ["Severe headache", "Chest pain"]
    }
  }
}'::jsonb WHERE generic_name = 'Phenylephrine';