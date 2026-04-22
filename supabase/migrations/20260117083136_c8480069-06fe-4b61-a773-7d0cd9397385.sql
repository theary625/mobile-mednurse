-- Batch 2: Thrombolytics and Anticoagulants

-- ALTEPLASE (tPA)
UPDATE medications SET nursing_guide = '{
  "IV_Infusion": {
    "appropriateness": {
      "hold_if": ["Active internal bleeding", "Recent (3 mo) intracranial hemorrhage", "Recent (3 mo) stroke", "Intracranial neoplasm/AVM", "Severe uncontrolled HTN >185/110", "Known bleeding diathesis", "Recent major surgery/trauma"],
      "required_labs": ["Baseline PT/INR", "aPTT", "Platelets", "Fibrinogen", "Type and Screen", "CT head completed (stroke)", "ECG (MI)"],
      "allergy_alerts": ["Previous alteplase reaction"]
    },
    "special_prep": {
      "has_special_requirements": true,
      "notes": "Reconstitute 100mg vial with sterile water. Gently swirl - do not shake. Use within 8 hours. Stroke: 0.9 mg/kg (max 90mg). MI: 100mg total.",
      "filter_needle": false,
      "light_protection": false
    },
    "administration": {
      "rate": "STROKE: 10% bolus over 1 min, remainder over 60 min. MI: 15mg bolus, then 50mg/30min, then 35mg/60min",
      "max_rate": "Do not exceed weight-based dosing. Stroke max = 90mg total",
      "why_rate_matters": "Precise timing critical for efficacy. Bleeding risk increases with dose.",
      "line_type": "Dedicated peripheral IV. Minimize all invasive procedures.",
      "flush": "Dedicated line, flush with NS before and after"
    },
    "post_admin": {
      "reassess_timing": "Neuro checks q15min x 2h, then q30min x 6h, then q1h x 16h. BP q15min x 2h",
      "expected_response": "Stroke: Neurologic improvement 30-60min. MI: Chest pain relief, ST changes",
      "watch_for": ["Any bleeding (gums, IV sites, GI, urinary)", "Neurologic decline (ICH)", "Angioedema", "Reperfusion arrhythmias (MI)", "Hypotension"],
      "document": ["Exact start/end times", "Neuro assessments", "Vital signs per protocol", "Any bleeding", "NIHSS scores (stroke)"]
    },
    "patient_teaching": {
      "tell_patient": "This medication dissolves the blood clot. You will be watched very closely for the next 24 hours.",
      "what_to_expect": "Frequent vital signs and neurological checks. No invasive procedures for 24 hours.",
      "report_immediately": ["Any new headache", "Vision changes", "Weakness or numbness", "Bleeding from anywhere", "Nausea/vomiting"]
    }
  }
}'::jsonb WHERE generic_name = 'Alteplase (tPA)';

-- TENECTEPLASE
UPDATE medications SET nursing_guide = '{
  "IV_Push": {
    "appropriateness": {
      "hold_if": ["Active internal bleeding", "History of CVA", "Recent intracranial surgery", "Intracranial neoplasm", "Severe uncontrolled HTN", "Known bleeding diathesis"],
      "required_labs": ["Baseline PT/INR", "aPTT", "Platelets", "Fibrinogen", "Type and Screen", "ECG", "Troponin"],
      "allergy_alerts": ["Previous tenecteplase or alteplase reaction"]
    },
    "special_prep": {
      "has_special_requirements": true,
      "notes": "Reconstitute 50mg vial with 10mL sterile water. Weight-based dosing. Single bolus - easier than tPA.",
      "filter_needle": false,
      "light_protection": false
    },
    "administration": {
      "rate": "Single IV bolus over 5 seconds",
      "max_rate": "50mg maximum regardless of weight",
      "why_rate_matters": "Single bolus simplifies administration. No infusion required.",
      "line_type": "Dedicated IV line. May use with heparin via separate line.",
      "flush": "Flush with NS before and after"
    },
    "post_admin": {
      "reassess_timing": "Continuous cardiac monitoring. Vitals q15min x 1h, then q30min x 6h",
      "expected_response": "ST-segment resolution, chest pain relief within 60-90 min",
      "watch_for": ["Bleeding (any site)", "Reperfusion arrhythmias", "Hypotension", "Allergic reaction", "Re-occlusion"],
      "document": ["Exact time of bolus", "Weight-based dose given", "ECG changes", "Bleeding assessment", "Vital signs"]
    },
    "patient_teaching": {
      "tell_patient": "This clot-dissolving medication was given as a single injection to open your blocked artery.",
      "what_to_expect": "Close monitoring for the next several hours. Avoid any cuts or trauma.",
      "report_immediately": ["Chest pain returning", "Any bleeding", "Shortness of breath", "Dizziness"]
    }
  }
}'::jsonb WHERE generic_name = 'Tenecteplase';

-- HEPARIN
UPDATE medications SET nursing_guide = '{
  "IV_Infusion": {
    "appropriateness": {
      "hold_if": ["Active major bleeding", "Severe thrombocytopenia <50,000", "History of HIT", "Recent CNS surgery/trauma", "Uncontrolled hypertension"],
      "required_labs": ["Baseline aPTT", "Platelet count", "Hemoglobin/Hematocrit", "Creatinine"],
      "allergy_alerts": ["History of HIT (use alternative anticoagulant)", "Pork allergy (some formulations)"]
    },
    "special_prep": {
      "has_special_requirements": true,
      "notes": "Standard concentration: 25,000 units/250mL D5W or NS. Use infusion pump. Verify units/mL before programming.",
      "filter_needle": false,
      "light_protection": false
    },
    "administration": {
      "rate": "Per protocol - typically 18 units/kg/hr initial, adjust per aPTT",
      "max_rate": "Per institutional protocol, typically capped",
      "why_rate_matters": "Narrow therapeutic window. Sub-therapeutic = clot. Supra-therapeutic = bleeding.",
      "line_type": "Peripheral or central IV",
      "flush": "Dedicated line or via compatible pump"
    },
    "post_admin": {
      "reassess_timing": "aPTT 6 hours after start/rate change, then daily when stable",
      "expected_response": "aPTT goal 60-80 seconds (or per protocol)",
      "watch_for": ["Bleeding (GI, GU, skin, gums)", "Thrombocytopenia (HIT)", "Hematoma at injection sites", "Signs of PE/DVT despite therapy"],
      "document": ["Rate in units/hr", "aPTT results", "Platelet counts", "Bleeding assessment", "Protocol adjustments"]
    },
    "patient_teaching": {
      "tell_patient": "This medication thins your blood to prevent or treat blood clots.",
      "what_to_expect": "Frequent blood tests to monitor the medication level. Easy bruising is common.",
      "report_immediately": ["Blood in urine or stool", "Unusual bruising", "Nosebleeds that do not stop", "Vomiting blood", "Severe headache"]
    }
  },
  "SubQ": {
    "appropriateness": {
      "hold_if": ["Active major bleeding", "Platelet count <50,000", "History of HIT"],
      "required_labs": ["Platelet count baseline", "No routine aPTT monitoring needed for prophylaxis"],
      "allergy_alerts": ["History of HIT", "Pork sensitivity"]
    },
    "special_prep": {
      "has_special_requirements": false,
      "notes": "Pre-filled syringes available. Do not expel air bubble - it locks medication in tissue."
    },
    "administration": {
      "rate": "Inject slowly over 30 seconds",
      "timing": "Prophylaxis: q8-12h. Rotate injection sites.",
      "line_type": "N/A - subcutaneous",
      "special_notes": "Inject into fatty tissue of abdomen (2 inches from umbilicus). Do not aspirate. Do not massage after."
    },
    "post_admin": {
      "reassess_timing": "Monitor for bruising at injection sites, daily platelet count x 4 days minimum",
      "expected_response": "DVT/PE prevention",
      "watch_for": ["Bruising at injection site", "Signs of bleeding", "Platelet count drop (HIT)"],
      "document": ["Dose", "Injection site", "Platelet count", "Bleeding assessment"]
    },
    "patient_teaching": {
      "tell_patient": "These injections help prevent blood clots in your legs.",
      "what_to_expect": "You will get injections in your abdomen. Some bruising is normal.",
      "report_immediately": ["Excessive bruising", "Blood in stool or urine", "Signs of clot (leg swelling, chest pain)"]
    }
  }
}'::jsonb WHERE generic_name = 'Heparin';

-- ENOXAPARIN
UPDATE medications SET nursing_guide = '{
  "SubQ": {
    "appropriateness": {
      "hold_if": ["Active major bleeding", "Platelet count <50,000", "History of HIT with LMWH", "Severe renal impairment (CrCl <30) without dose adjustment", "Recent spinal/epidural procedure or planned procedure"],
      "required_labs": ["Baseline platelet count", "Creatinine/CrCl", "Hemoglobin", "Anti-Xa level if monitoring needed"],
      "allergy_alerts": ["History of HIT (absolute contraindication)", "Pork allergy (derived from pork intestine)"]
    },
    "special_prep": {
      "has_special_requirements": false,
      "notes": "Pre-filled syringes available. Do NOT expel air bubble before injection (locks medication in tissue)."
    },
    "administration": {
      "rate": "Inject slowly over 10-30 seconds",
      "timing": "Prophylaxis: q12h or q24h. Treatment: q12h or q24h weight-based.",
      "special_notes": "Inject into fatty tissue of abdomen (at least 2 inches from umbilicus). Alternate sides. Do NOT aspirate. Do NOT rub after.",
      "with_food": "N/A - subcutaneous"
    },
    "post_admin": {
      "reassess_timing": "Platelet count day 4 and periodically. Anti-Xa if obese, renal impairment, or pregnancy.",
      "expected_response": "VTE prevention or treatment without bleeding",
      "watch_for": ["Bruising at injection site", "Signs of bleeding", "Platelet count drop (HIT)", "Spinal hematoma symptoms (if epidural)"],
      "document": ["Dose (mg)", "Injection site", "Platelet count", "Bleeding assessment", "Renal function"]
    },
    "patient_teaching": {
      "tell_patient": "These injections prevent blood clots. You will receive them in your abdomen.",
      "what_to_expect": "Bruising at injection sites is common and expected.",
      "report_immediately": ["Unusual bleeding", "Blood in urine or stool", "Black stools", "Severe back pain or weakness/numbness (if had epidural)", "Signs of blood clot despite treatment"]
    }
  }
}'::jsonb WHERE generic_name = 'Enoxaparin';

-- WARFARIN
UPDATE medications SET nursing_guide = '{
  "PO": {
    "appropriateness": {
      "hold_if": ["Active major bleeding", "INR significantly supratherapeutic (>4-5, or per protocol)", "Recent major surgery/trauma without clearance", "Unable to monitor INR"],
      "required_labs": ["Baseline INR/PT", "Hemoglobin", "Platelet count", "Renal/hepatic function"],
      "allergy_alerts": ["Rare hypersensitivity"]
    },
    "special_prep": {
      "has_special_requirements": false,
      "notes": "Comes in multiple strengths with color-coding. Verify correct strength. Interacts with many medications and foods."
    },
    "administration": {
      "timing": "Once daily, same time each day (usually evening)",
      "with_food": "Can take with or without food. Consistent vitamin K intake important.",
      "special_notes": "MANY drug interactions - review all medications. Counsel on vitamin K foods."
    },
    "post_admin": {
      "reassess_timing": "INR daily until stable, then weekly, then monthly",
      "expected_response": "INR in target range (typically 2-3, 2.5-3.5 for mechanical valves)",
      "watch_for": ["Bleeding (gums, bruising, dark stools, blood in urine)", "Supratherapeutic INR", "Subtherapeutic INR (clot risk)", "Skin necrosis (rare)"],
      "document": ["Dose", "INR result", "Next INR due", "Bleeding assessment", "Any dose changes"]
    },
    "patient_teaching": {
      "tell_patient": "This blood thinner requires regular blood tests and consistent diet. Many medications interact with it.",
      "what_to_expect": "Regular INR blood tests. Easy bruising is common. Consistent vitamin K intake (green vegetables) important.",
      "report_immediately": ["Blood in urine or stool", "Prolonged bleeding from cuts", "Severe headache", "Unusual bruising", "Black tarry stools", "Vomiting blood"]
    }
  }
}'::jsonb WHERE generic_name = 'Warfarin';