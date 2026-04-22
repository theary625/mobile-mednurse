-- Batch 3: Opioids and Insulin

-- MORPHINE
UPDATE medications SET nursing_guide = '{
  "IV_Push": {
    "appropriateness": {
      "hold_if": ["Respiratory rate <12", "Sedation score >=3", "SBP <90 mmHg", "Known allergy", "Acute asthma/airway obstruction", "Paralytic ileus"],
      "required_labs": ["Pain score baseline", "Sedation level", "Respiratory rate", "BP"],
      "allergy_alerts": ["Document specific opioid allergy - cross-reactivity varies", "Codeine allergy may cross-react"]
    },
    "special_prep": {
      "has_special_requirements": false,
      "notes": "May give undiluted or dilute in NS. Have naloxone readily available."
    },
    "administration": {
      "rate": "Push slowly over 2-3 minutes (at least 4-5 mg/min)",
      "max_rate": "Do not exceed 4-5 mg/min",
      "why_rate_matters": "Rapid push increases risk of respiratory depression and histamine release (flushing, hypotension).",
      "line_type": "Any patent IV",
      "flush": "Flush with NS after administration"
    },
    "post_admin": {
      "reassess_timing": "15-30 minutes for pain relief, q1h for sedation/RR",
      "expected_response": "Pain relief within 5-20 minutes IV, peak 20 minutes",
      "watch_for": ["Respiratory depression", "Hypotension", "Excessive sedation", "Nausea/vomiting", "Urinary retention", "Pruritus"],
      "document": ["Pain score before/after", "Respiratory rate", "Sedation level", "BP", "Any adverse effects"]
    },
    "patient_teaching": {
      "tell_patient": "This pain medication works quickly but may make you drowsy.",
      "what_to_expect": "You may feel sleepy, nauseated, or itchy. These are common side effects.",
      "report_immediately": ["Difficulty breathing", "Severe dizziness", "Severe itching or rash"]
    }
  },
  "PO": {
    "appropriateness": {
      "hold_if": ["Unable to swallow safely", "Severe respiratory depression", "GI obstruction", "Recent MAO inhibitor use"],
      "required_labs": ["Pain score", "Sedation level", "Bowel function"],
      "allergy_alerts": ["Document specific reaction type"]
    },
    "special_prep": {
      "has_special_requirements": false,
      "notes": "Immediate-release and extended-release formulations available. ER forms should NOT be crushed."
    },
    "administration": {
      "timing": "IR: q4h PRN. ER: q8-12h scheduled",
      "with_food": "May take with food if GI upset",
      "special_notes": "ER tablets must be swallowed whole - crushing causes dose dumping and overdose risk"
    },
    "post_admin": {
      "reassess_timing": "30-60 minutes for IR, ongoing for ER",
      "expected_response": "Pain relief within 30-60 minutes",
      "watch_for": ["Sedation", "Constipation", "Nausea", "Respiratory depression"],
      "document": ["Pain score", "Sedation level", "Bowel function", "Any adverse effects"]
    },
    "patient_teaching": {
      "tell_patient": "Take this medication as prescribed. It may cause constipation - drink fluids and take stool softeners.",
      "what_to_expect": "Drowsiness is common initially. Avoid driving or alcohol.",
      "report_immediately": ["Difficulty breathing", "Severe drowsiness", "Severe constipation"]
    }
  }
}'::jsonb WHERE generic_name = 'Morphine';

-- FENTANYL
UPDATE medications SET nursing_guide = '{
  "IV_Push": {
    "appropriateness": {
      "hold_if": ["Respiratory rate <10-12", "Sedation score >=3", "SBP <90", "Known allergy", "Acute asthma/severe respiratory disease"],
      "required_labs": ["Pain score", "Sedation level", "Respiratory rate", "BP"],
      "allergy_alerts": ["Synthetic opioid - less cross-reactivity with morphine"]
    },
    "special_prep": {
      "has_special_requirements": false,
      "notes": "50 mcg/mL concentration. May dilute if desired. Have naloxone available."
    },
    "administration": {
      "rate": "Push slowly over 1-2 minutes",
      "max_rate": "25-50 mcg over 1-2 minutes",
      "why_rate_matters": "Rapid push can cause chest wall rigidity (wooden chest), apnea, bradycardia.",
      "line_type": "Any patent IV",
      "flush": "Flush with NS"
    },
    "post_admin": {
      "reassess_timing": "5-15 minutes for peak effect, ongoing for sedation",
      "expected_response": "Rapid pain relief (2-3 min onset), short duration (30-60 min)",
      "watch_for": ["Respiratory depression", "Chest wall rigidity (high doses/rapid)", "Bradycardia", "Hypotension", "Nausea"],
      "document": ["Pain score before/after", "RR", "Sedation level", "BP", "HR"]
    },
    "patient_teaching": {
      "tell_patient": "This is a strong, fast-acting pain medication.",
      "what_to_expect": "Quick pain relief but may need repeat doses. Drowsiness is common.",
      "report_immediately": ["Difficulty breathing", "Chest tightness", "Severe dizziness"]
    }
  },
  "IV_Infusion": {
    "appropriateness": {
      "hold_if": ["Respiratory rate <10 (if not mechanically ventilated)", "Hemodynamic instability without vasopressors", "Known allergy"],
      "required_labs": ["Baseline sedation score", "Pain score", "Hemodynamics", "Ventilator settings if applicable"],
      "allergy_alerts": ["Document any opioid reactions"]
    },
    "special_prep": {
      "has_special_requirements": true,
      "notes": "Typically 10-50 mcg/mL concentration. Use infusion pump. ICU setting usually required."
    },
    "administration": {
      "rate": "ICU sedation: 25-100 mcg/hr, titrate to RASS/pain goal",
      "max_rate": "Per protocol, typically 200-300 mcg/hr",
      "why_rate_matters": "Accumulates with prolonged infusion. Tolerance develops requiring dose increases.",
      "line_type": "Central or peripheral IV with infusion pump",
      "flush": "Dedicated line or compatible Y-site"
    },
    "post_admin": {
      "reassess_timing": "q1-2h sedation assessment (RASS), q4h pain assessment",
      "expected_response": "Target RASS/sedation goal, adequate pain control",
      "watch_for": ["Over-sedation", "Respiratory depression (if not ventilated)", "Ileus", "Tolerance requiring increased doses"],
      "document": ["Rate (mcg/hr)", "RASS score", "Pain score", "Pupil size", "Bowel function"]
    },
    "patient_teaching": {
      "tell_patient": "This medication keeps you comfortable while you are very ill. You may not remember this time.",
      "what_to_expect": "Family: Patient will be sedated. This is intentional to keep them comfortable.",
      "report_immediately": []
    }
  },
  "Transdermal": {
    "appropriateness": {
      "hold_if": ["Opioid-naive patient (NEVER for naive patients)", "Acute pain", "Fever >40C (increased absorption)", "Damaged skin at application site"],
      "required_labs": ["Opioid tolerance confirmed", "Current opioid requirement calculated"],
      "allergy_alerts": ["Document opioid reactions"]
    },
    "special_prep": {
      "has_special_requirements": true,
      "notes": "For CHRONIC PAIN in OPIOID-TOLERANT patients ONLY. Calculate equianalgesic dose carefully. Takes 12-24h for effect."
    },
    "administration": {
      "timing": "Apply q72h (some patients need q48h)",
      "special_notes": "Apply to flat, non-hairy, non-irritated skin (chest, back, upper arm). Do not cut patches. Remove old patch before applying new.",
      "rate": "N/A - continuous transdermal",
      "with_food": "N/A"
    },
    "post_admin": {
      "reassess_timing": "First patch: assess at 24h and 72h. Ongoing: with each change",
      "expected_response": "Stable pain control without peaks/troughs",
      "watch_for": ["Respiratory depression (especially first 24-72h)", "Fever increasing absorption", "Application site reactions", "Patch falling off"],
      "document": ["Patch strength", "Application site", "Date/time applied", "Removal of old patch", "Pain scores"]
    },
    "patient_teaching": {
      "tell_patient": "This patch provides continuous pain relief. It takes 12-24 hours to start working fully.",
      "what_to_expect": "Change patch every 3 days. You may need short-acting pain medication for breakthrough pain initially.",
      "report_immediately": ["Difficulty breathing", "Extreme drowsiness", "Fever", "Patch falls off"]
    }
  }
}'::jsonb WHERE generic_name = 'Fentanyl';

-- HYDROMORPHONE
UPDATE medications SET nursing_guide = '{
  "IV_Push": {
    "appropriateness": {
      "hold_if": ["Respiratory rate <12", "Sedation score >=3", "SBP <90", "Known allergy", "Severe asthma attack"],
      "required_labs": ["Pain score", "Sedation level", "Respiratory rate", "BP"],
      "allergy_alerts": ["More potent than morphine - 7x stronger. Verify dose is correct."]
    },
    "special_prep": {
      "has_special_requirements": false,
      "notes": "Available in 1mg/mL and 2mg/mL - VERIFY CONCENTRATION. May dilute in NS. High-concentration 10mg/mL for PCA only."
    },
    "administration": {
      "rate": "Push slowly over 2-3 minutes",
      "max_rate": "0.5 mg/minute",
      "why_rate_matters": "Very potent opioid. Rapid push increases respiratory depression and histamine release risk.",
      "line_type": "Any patent IV",
      "flush": "Flush with NS"
    },
    "post_admin": {
      "reassess_timing": "15-30 minutes for pain relief",
      "expected_response": "Pain relief within 5-15 minutes, peak 15-30 minutes",
      "watch_for": ["Respiratory depression", "Hypotension", "Excessive sedation", "Nausea/vomiting"],
      "document": ["Pain score before/after", "RR", "Sedation level", "BP", "Any adverse effects"]
    },
    "patient_teaching": {
      "tell_patient": "This is a strong pain medication that works quickly.",
      "what_to_expect": "Drowsiness, possible nausea. Works faster than oral pain medications.",
      "report_immediately": ["Difficulty breathing", "Severe dizziness", "Confusion"]
    }
  },
  "PO": {
    "appropriateness": {
      "hold_if": ["Unable to swallow", "Respiratory depression", "GI obstruction", "Severe hepatic impairment"],
      "required_labs": ["Pain score", "Sedation level", "Bowel function"],
      "allergy_alerts": ["Verify dose - oral is approximately 5x less potent than IV"]
    },
    "special_prep": {
      "has_special_requirements": false,
      "notes": "Immediate-release and extended-release (Exalgo) available. ER must NOT be crushed."
    },
    "administration": {
      "timing": "IR: q3-4h PRN. ER: q24h (Exalgo)",
      "with_food": "May take with food if GI upset",
      "special_notes": "ER tablets must be swallowed whole. Cutting/crushing causes overdose risk."
    },
    "post_admin": {
      "reassess_timing": "30-60 minutes for IR",
      "expected_response": "Pain relief within 30-60 minutes",
      "watch_for": ["Sedation", "Constipation", "Nausea", "Respiratory depression"],
      "document": ["Pain score", "Sedation", "Bowel function", "Adverse effects"]
    },
    "patient_teaching": {
      "tell_patient": "This medication is stronger than some other pain pills. Take only as prescribed.",
      "what_to_expect": "Drowsiness, constipation common. Take stool softeners.",
      "report_immediately": ["Difficulty breathing", "Severe drowsiness", "Unable to wake easily"]
    }
  }
}'::jsonb WHERE generic_name = 'Hydromorphone';

-- INSULIN REGULAR
UPDATE medications SET nursing_guide = '{
  "IV_Infusion": {
    "appropriateness": {
      "hold_if": ["Hypoglycemia <70 mg/dL", "No IV access", "Unable to monitor glucose hourly"],
      "required_labs": ["Baseline glucose", "Potassium (insulin drives K+ intracellular)", "BMP", "Anion gap if DKA"],
      "allergy_alerts": ["Rare insulin allergy"]
    },
    "special_prep": {
      "has_special_requirements": true,
      "notes": "Standard: 100 units Regular insulin in 100mL NS = 1 unit/mL. Prime tubing with 20mL (insulin binds to tubing). Use infusion pump.",
      "filter_needle": false,
      "light_protection": false
    },
    "administration": {
      "rate": "DKA: Start 0.1-0.14 units/kg/hr. Hyperglycemia: per protocol. Hyperkalemia: fixed dose protocols.",
      "max_rate": "Varies by indication and protocol",
      "why_rate_matters": "Narrow therapeutic window. Too fast = hypoglycemia/hypokalemia. Too slow = uncontrolled glucose.",
      "line_type": "Dedicated IV line or Y-site compatible",
      "flush": "Use NS, prime tubing to saturate binding sites"
    },
    "post_admin": {
      "reassess_timing": "BG hourly minimum. Potassium q2-4h. DKA: BG q1h, BMP q2-4h",
      "expected_response": "BG decrease 50-75 mg/dL per hour. DKA: anion gap closure",
      "watch_for": ["Hypoglycemia", "Hypokalemia", "Cerebral edema (DKA - rare)", "Fluid overload"],
      "document": ["Rate (units/hr)", "BG values q1h", "Potassium levels", "Anion gap trend", "Any hypoglycemia treatment"]
    },
    "patient_teaching": {
      "tell_patient": "IV insulin helps control your blood sugar more precisely than injections.",
      "what_to_expect": "Frequent finger sticks to check blood sugar, at least every hour.",
      "report_immediately": ["Sweating, shakiness, confusion (low blood sugar)", "Hunger", "Dizziness"]
    }
  },
  "SubQ": {
    "appropriateness": {
      "hold_if": ["Hypoglycemia <70 mg/dL (treat first)", "NPO for surgery (coordinate with team)", "Active DKA (use IV)"],
      "required_labs": ["Current blood glucose", "Recent A1c", "Renal function (dosing)"],
      "allergy_alerts": ["Rare insulin allergy"]
    },
    "special_prep": {
      "has_special_requirements": false,
      "notes": "Verify correct insulin type (rapid, short, intermediate, long). Check concentration (U-100 vs U-500)."
    },
    "administration": {
      "timing": "Rapid-acting: give with meals. Regular: 30 min before meals. Long-acting: same time daily.",
      "special_notes": "Rotate injection sites. Abdomen fastest absorption, then arms, then thighs.",
      "rate": "Inject slowly",
      "with_food": "Meal-time insulin: patient must eat. Hold or reduce if NPO."
    },
    "post_admin": {
      "reassess_timing": "BG per protocol: typically AC and HS, or q6h if NPO",
      "expected_response": "Post-meal BG <180 mg/dL. Fasting <130 mg/dL (goals vary)",
      "watch_for": ["Hypoglycemia symptoms", "Injection site reactions", "Lipohypertrophy"],
      "document": ["Insulin type/dose", "Injection site", "Pre-dose BG", "Carb intake if meal-time"]
    },
    "patient_teaching": {
      "tell_patient": "This insulin helps control your blood sugar. It is important to eat after receiving mealtime insulin.",
      "what_to_expect": "We will check your blood sugar before meals and at bedtime.",
      "report_immediately": ["Sweating, shaking, confusion", "Skipped meal after insulin", "BG under 70"]
    }
  }
}'::jsonb WHERE generic_name = 'Insulin (Regular)';

-- OXYCODONE
UPDATE medications SET nursing_guide = '{
  "PO": {
    "appropriateness": {
      "hold_if": ["Respiratory rate <12", "Sedation score >=3", "Unable to swallow safely", "GI obstruction", "Known allergy"],
      "required_labs": ["Pain score", "Sedation level", "Respiratory rate", "Bowel function"],
      "allergy_alerts": ["Document specific opioid reaction - cross-reactivity varies"]
    },
    "special_prep": {
      "has_special_requirements": false,
      "notes": "IR and ER formulations available. ER (OxyContin) must NOT be crushed, chewed, or cut - causes dose dumping."
    },
    "administration": {
      "timing": "IR: q4-6h PRN. ER: q12h scheduled",
      "with_food": "May take with food if GI upset",
      "special_notes": "ER formulations must be swallowed whole. Never crush or cut."
    },
    "post_admin": {
      "reassess_timing": "30-60 minutes for IR, ongoing for ER",
      "expected_response": "Pain relief within 30-60 minutes for IR",
      "watch_for": ["Respiratory depression", "Sedation", "Constipation", "Nausea/vomiting"],
      "document": ["Pain score before/after", "Sedation level", "RR", "Bowel function"]
    },
    "patient_teaching": {
      "tell_patient": "Take this medication only as prescribed. It can cause constipation.",
      "what_to_expect": "Drowsiness is common initially. Avoid alcohol and driving.",
      "report_immediately": ["Difficulty breathing", "Extreme drowsiness", "Severe constipation", "Unable to wake normally"]
    }
  }
}'::jsonb WHERE generic_name = 'Oxycodone';

-- METHADONE
UPDATE medications SET nursing_guide = '{
  "PO": {
    "appropriateness": {
      "hold_if": ["Respiratory rate <12", "QTc >500ms", "Recent alcohol/sedative use", "Sedation score >=3", "Known allergy"],
      "required_labs": ["Baseline ECG (QTc)", "Pain score", "Sedation level", "Electrolytes (K, Mg)"],
      "allergy_alerts": ["Long half-life - accumulates over days. Opioid cross-reactivity varies."]
    },
    "special_prep": {
      "has_special_requirements": false,
      "notes": "VERY LONG half-life (15-60 hours). Doses accumulate over 5-7 days. Start low, increase slowly."
    },
    "administration": {
      "timing": "Dosing varies: q8-12h for pain, daily for opioid use disorder",
      "with_food": "May take with or without food",
      "special_notes": "Respiratory depression may occur days after dose increase. QT prolongation risk - monitor ECG."
    },
    "post_admin": {
      "reassess_timing": "Assess daily for first 5-7 days of new dose. ECG at baseline and with dose changes.",
      "expected_response": "Steady pain control without peaks/troughs (takes 5-7 days to stabilize)",
      "watch_for": ["Delayed respiratory depression (day 2-5)", "QT prolongation", "Sedation", "Constipation", "Drug interactions"],
      "document": ["Dose and frequency", "Pain score", "Sedation", "RR", "QTc", "Other medications"]
    },
    "patient_teaching": {
      "tell_patient": "This medication builds up in your body over several days. Do not increase dose without provider guidance.",
      "what_to_expect": "Full effect takes 5-7 days. Regular ECG monitoring required.",
      "report_immediately": ["Difficulty breathing", "Extreme drowsiness", "Fainting or dizziness", "Irregular heartbeat"]
    }
  }
}'::jsonb WHERE generic_name = 'Methadone';