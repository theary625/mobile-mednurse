
-- Update Ondansetron with comprehensive data
UPDATE medications SET
  dosing_info = '{
    "adult": {
      "nausea_vomiting": "4-8 mg IV/PO q8h PRN",
      "chemotherapy": "8-24 mg IV/PO before chemo, then q8-12h",
      "postoperative": "4 mg IV at induction or post-op",
      "max_daily": "32 mg/day"
    },
    "pediatric": {
      "over_4_years": "0.1-0.15 mg/kg IV/PO, max 4 mg/dose",
      "chemotherapy": "0.15 mg/kg x 3 doses"
    }
  }'::jsonb,
  administration_info = '{
    "iv_push": {
      "rate": "Over 2-5 minutes undiluted",
      "concentration": "2 mg/mL"
    },
    "iv_infusion": {
      "dilution": "In 50 mL NS or D5W",
      "rate": "Over 15-30 minutes"
    },
    "oral": {
      "timing": "30-60 minutes before emetogenic therapy",
      "odt": "Place on tongue, dissolves rapidly"
    }
  }'::jsonb,
  safety_info = '{
    "black_box_warning": null,
    "contraindications": ["Hypersensitivity to ondansetron", "Concomitant apomorphine use", "Congenital long QT syndrome"],
    "warnings": ["QT prolongation risk", "Serotonin syndrome with serotonergic drugs", "Masking of progressive ileus"],
    "pregnancy_category": "B"
  }'::jsonb,
  monitoring = '{
    "cardiac": true,
    "vitals": false,
    "ecg": "Baseline and periodic ECG for high doses or QT risk factors",
    "frequency": "Before high-dose therapy",
    "parameters": ["QTc interval", "Signs of serotonin syndrome"]
  }'::jsonb,
  hold_parameters = '{
    "qtc_prolongation": "Hold if QTc > 500 ms",
    "serotonin_syndrome": "Discontinue immediately if suspected"
  }'::jsonb,
  clinical_pearls = ARRAY[
    'Most effective when given prophylactically before nausea trigger',
    'ODT formulation convenient for patients with difficulty swallowing',
    'Constipation is common side effect - consider bowel regimen',
    'QT prolongation risk increases with IV route and higher doses',
    'First-line for chemotherapy and post-operative nausea'
  ]::text[],
  nursing_guide = '{
    "iv": {
      "appropriateness": {"suitable": true, "notes": "Preferred for rapid onset"},
      "special_preparation": {"required": false, "steps": ["May give undiluted or dilute in 50 mL NS"]},
      "administration": {"method": "IV push over 2-5 min or infusion over 15 min", "rate": "Slow IV push preferred"},
      "post_admin": {"monitoring": ["Assess nausea relief", "Monitor for headache"], "timing": "30 minutes post-dose"},
      "patient_teaching": ["May cause headache", "Report chest discomfort or palpitations", "Effective for 8-12 hours"]
    },
    "po": {
      "appropriateness": {"suitable": true, "notes": "First-line for mild-moderate nausea"},
      "administration": {"method": "With or without food", "timing": "30-60 min before trigger"},
      "patient_teaching": ["ODT dissolves on tongue without water", "May cause constipation"]
    }
  }'::jsonb,
  pharmacokinetics = '{
    "absorption": {"oral_bioavailability": "60%", "peak": "1-2 hours PO, immediate IV"},
    "distribution": {"protein_binding": "70-76%", "vd": "1.8-2.4 L/kg"},
    "metabolism": {"primary": "Hepatic via CYP3A4, 1A2, 2D6", "active_metabolites": false},
    "excretion": {"primary": "Renal 5% unchanged", "half_life": "3-6 hours"}
  }'::jsonb,
  adverse_reactions = '{
    "common": ["Headache", "Constipation", "Fatigue", "Dizziness"],
    "serious": ["QT prolongation", "Torsades de pointes", "Serotonin syndrome", "Anaphylaxis"],
    "frequency": {"headache": "10-25%", "constipation": "5-10%"}
  }'::jsonb,
  drug_interactions_info = '{
    "major": [
      {"drug": "Apomorphine", "effect": "Profound hypotension - CONTRAINDICATED"},
      {"drug": "QT-prolonging drugs", "effect": "Additive QT prolongation risk"}
    ],
    "moderate": [
      {"drug": "Serotonergic drugs", "effect": "Increased serotonin syndrome risk"},
      {"drug": "Tramadol", "effect": "Reduced tramadol efficacy"}
    ]
  }'::jsonb
WHERE generic_name ILIKE 'ondansetron';

-- Update Promethazine with comprehensive data
UPDATE medications SET
  dosing_info = '{
    "adult": {
      "nausea_vomiting": "12.5-25 mg PO/IM/IV/PR q4-6h PRN",
      "motion_sickness": "25 mg PO 30-60 min before travel, then q8-12h PRN",
      "sedation": "25-50 mg PO/IM at bedtime",
      "max_daily": "100 mg/day"
    },
    "pediatric": {
      "over_2_years": "0.25-1 mg/kg/dose q4-6h PRN, max 25 mg/dose",
      "warning": "CONTRAINDICATED under 2 years - respiratory depression risk"
    }
  }'::jsonb,
  administration_info = '{
    "iv_push": {
      "rate": "Maximum 25 mg/minute - MUST BE SLOW",
      "concentration": "25 mg/mL max",
      "warning": "HIGH VESICANT - severe tissue injury if extravasated"
    },
    "im": {
      "site": "Deep IM into large muscle",
      "preferred": "IM preferred over IV when possible"
    },
    "rectal": {
      "timing": "Use when oral/parenteral not feasible"
    }
  }'::jsonb,
  safety_info = '{
    "black_box_warning": "CONTRAINDICATED in children < 2 years due to fatal respiratory depression. Severe tissue injury including gangrene with IV/SC injection - IM preferred.",
    "contraindications": ["Children < 2 years", "Comatose states", "CNS depression", "Intra-arterial injection"],
    "warnings": ["Severe tissue necrosis with extravasation", "Respiratory depression", "Anticholinergic effects", "Lower seizure threshold"],
    "pregnancy_category": "C"
  }'::jsonb,
  monitoring = '{
    "vitals": true,
    "respiratory": true,
    "neuro": true,
    "frequency": "Q2-4h during parenteral use",
    "parameters": ["Respiratory rate", "Level of sedation", "IV site for extravasation", "Blood pressure"]
  }'::jsonb,
  hold_parameters = '{
    "respiratory_rate": "Hold if RR < 12",
    "sedation": "Hold if excessively sedated",
    "blood_pressure": "Hold if SBP < 90"
  }'::jsonb,
  clinical_pearls = ARRAY[
    'IM is preferred over IV due to severe extravasation risk',
    'If IV required: give through large bore, running IV, very slowly',
    'BLACK BOX: Never use in children under 2 years',
    'Highly sedating - warn patients about drowsiness',
    'Has antihistamine, anticholinergic, and antiemetic properties',
    'Check IV site frequently - vesicant can cause gangrene'
  ]::text[],
  nursing_guide = '{
    "iv": {
      "appropriateness": {"suitable": true, "notes": "USE WITH EXTREME CAUTION - IM preferred"},
      "special_preparation": {"required": true, "steps": ["Dilute to max 25 mg/mL", "Use LARGE BORE IV in running line", "Have antidote ready"]},
      "administration": {"method": "IV push SLOWLY over at least 10-15 min", "rate": "MAX 25 mg/min", "warning": "SEVERE VESICANT"},
      "post_admin": {"monitoring": ["IV site q5min during infusion", "Respiratory status", "Sedation level"], "timing": "Continuous during and 30 min after"},
      "patient_teaching": ["Report any burning at IV site IMMEDIATELY", "Will cause drowsiness", "Do not drive"]
    },
    "im": {
      "appropriateness": {"suitable": true, "notes": "PREFERRED parenteral route"},
      "administration": {"method": "Deep IM into large muscle", "site": "Avoid deltoid in children"},
      "post_admin": {"monitoring": ["Injection site", "Sedation", "Respirations"]},
      "patient_teaching": ["May cause injection site pain", "Drowsiness expected"]
    }
  }'::jsonb,
  pharmacokinetics = '{
    "absorption": {"oral_bioavailability": "25% due to first-pass", "peak": "2-3 hours PO, 20 min IM"},
    "distribution": {"protein_binding": "93%", "vd": "Large", "crosses_bbb": true},
    "metabolism": {"primary": "Hepatic", "active_metabolites": false},
    "excretion": {"primary": "Renal and fecal", "half_life": "10-19 hours"}
  }'::jsonb,
  adverse_reactions = '{
    "common": ["Sedation", "Dizziness", "Dry mouth", "Blurred vision", "Constipation"],
    "serious": ["Respiratory depression", "Tissue necrosis/gangrene", "Neuroleptic malignant syndrome", "Seizures", "Tardive dyskinesia"],
    "frequency": {"sedation": "Very common", "tissue_necrosis": "Rare but severe"}
  }'::jsonb,
  drug_interactions_info = '{
    "major": [
      {"drug": "CNS depressants", "effect": "Additive respiratory depression"},
      {"drug": "MAOIs", "effect": "Enhanced anticholinergic and hypotensive effects"},
      {"drug": "Opioids", "effect": "Enhanced sedation and respiratory depression"}
    ],
    "moderate": [
      {"drug": "Anticholinergics", "effect": "Additive anticholinergic effects"},
      {"drug": "Antihypertensives", "effect": "Enhanced hypotension"}
    ]
  }'::jsonb
WHERE generic_name ILIKE 'promethazine';

-- Update Metoclopramide with comprehensive data
UPDATE medications SET
  dosing_info = '{
    "adult": {
      "nausea_vomiting": "10-20 mg IV/IM/PO q6h PRN",
      "gastroparesis": "10 mg PO 30 min before meals and at bedtime",
      "gerd": "10-15 mg PO 30 min before meals",
      "max_daily": "40 mg/day for gastroparesis",
      "duration_limit": "Do not use > 12 weeks due to tardive dyskinesia risk"
    },
    "pediatric": {
      "standard": "0.1-0.2 mg/kg/dose IV/PO q6-8h, max 10 mg/dose"
    }
  }'::jsonb,
  administration_info = '{
    "iv_push": {
      "rate": "Over 1-2 minutes",
      "warning": "Rapid IV may cause intense anxiety/restlessness"
    },
    "iv_infusion": {
      "dilution": "In 50 mL NS or D5W",
      "rate": "Over 15-30 minutes preferred"
    },
    "oral": {
      "timing": "30 minutes before meals for gastroparesis",
      "with_food": "Take before meals, not with"
    }
  }'::jsonb,
  safety_info = '{
    "black_box_warning": "Tardive dyskinesia risk - can be irreversible. Risk increases with duration and total cumulative dose. Avoid treatment > 12 weeks.",
    "contraindications": ["GI obstruction/perforation", "Pheochromocytoma", "Seizure disorders", "Concomitant drugs causing EPS"],
    "warnings": ["Tardive dyskinesia", "Neuroleptic malignant syndrome", "Depression", "Parkinsonism", "QT prolongation"],
    "pregnancy_category": "B"
  }'::jsonb,
  monitoring = '{
    "neuro": true,
    "vitals": true,
    "frequency": "Each administration and ongoing for EPS",
    "parameters": ["Extrapyramidal symptoms", "Tardive dyskinesia signs", "Depression/mood changes", "QTc if prolonged use"]
  }'::jsonb,
  hold_parameters = '{
    "eps_symptoms": "Hold and notify MD if dystonia, akathisia, or parkinsonism",
    "tardive_dyskinesia": "DISCONTINUE if involuntary movements noted"
  }'::jsonb,
  clinical_pearls = ARRAY[
    'BLACK BOX: Limit use to 12 weeks to minimize tardive dyskinesia risk',
    'Diphenhydramine can treat acute dystonic reactions',
    'Prokinetic effect useful for gastroparesis and ileus',
    'Avoid in Parkinson''s disease - worsens symptoms',
    'Young women at higher risk for dystonic reactions',
    'Can cause acute anxiety/restlessness - reassure patient'
  ]::text[],
  nursing_guide = '{
    "iv": {
      "appropriateness": {"suitable": true, "notes": "Slow IV preferred to avoid akathisia"},
      "special_preparation": {"required": false, "steps": ["May dilute in NS for slower infusion"]},
      "administration": {"method": "Slow IV push over 1-2 min or infuse over 15-30 min", "rate": "Slow to prevent restlessness"},
      "post_admin": {"monitoring": ["Acute dystonic reaction", "Restlessness/akathisia", "Level of alertness"], "timing": "30-60 min post-dose"},
      "patient_teaching": ["May cause restlessness initially", "Report muscle stiffness or involuntary movements", "Drowsiness possible"]
    },
    "po": {
      "appropriateness": {"suitable": true, "notes": "First-line for gastroparesis"},
      "administration": {"method": "30 minutes before meals", "timing": "Before breakfast, lunch, dinner, and bedtime"},
      "patient_teaching": ["Take before meals for best effect", "Report any abnormal movements", "Avoid alcohol"]
    }
  }'::jsonb,
  pharmacokinetics = '{
    "absorption": {"oral_bioavailability": "80%", "peak": "1-2 hours PO, 10-15 min IV"},
    "distribution": {"protein_binding": "30%", "vd": "3.5 L/kg", "crosses_bbb": true},
    "metabolism": {"primary": "Hepatic", "cyp_enzymes": "CYP2D6"},
    "excretion": {"primary": "Renal 85%", "half_life": "5-6 hours, prolonged in renal impairment"}
  }'::jsonb,
  adverse_reactions = '{
    "common": ["Drowsiness", "Fatigue", "Restlessness", "Diarrhea"],
    "serious": ["Tardive dyskinesia", "Neuroleptic malignant syndrome", "Acute dystonic reactions", "Depression", "QT prolongation"],
    "frequency": {"drowsiness": "10-20%", "tardive_dyskinesia": "Up to 20% with prolonged use"}
  }'::jsonb,
  drug_interactions_info = '{
    "major": [
      {"drug": "Dopamine agonists", "effect": "Antagonizes antiparkinson effects"},
      {"drug": "MAOIs", "effect": "Hypertensive crisis risk"}
    ],
    "moderate": [
      {"drug": "CNS depressants", "effect": "Additive sedation"},
      {"drug": "Anticholinergics", "effect": "Antagonizes prokinetic effects"},
      {"drug": "SSRIs", "effect": "Increased EPS risk"}
    ]
  }'::jsonb
WHERE generic_name ILIKE 'metoclopramide';

-- Update Prochlorperazine with comprehensive data
UPDATE medications SET
  dosing_info = '{
    "adult": {
      "nausea_vomiting": "5-10 mg PO/IM q6-8h PRN or 25 mg PR q12h",
      "severe_nausea": "5-10 mg IV slow push, may repeat q3-4h, max 40 mg/day",
      "migraine": "10 mg IV with diphenhydramine",
      "max_daily": "40 mg/day"
    },
    "pediatric": {
      "over_2_years_weight_over_9kg": "0.1-0.15 mg/kg/dose IM/PO q6-8h",
      "warning": "Not recommended under 2 years or < 9 kg"
    }
  }'::jsonb,
  administration_info = '{
    "iv_push": {
      "rate": "5 mg/minute or slower",
      "dilution": "May dilute in NS",
      "warning": "Rapid IV increases hypotension and EPS risk"
    },
    "im": {
      "site": "Deep IM",
      "preferred": "IM often preferred over IV"
    },
    "rectal": {
      "dose": "25 mg suppository",
      "useful_when": "Patient unable to take oral or parenteral"
    }
  }'::jsonb,
  safety_info = '{
    "black_box_warning": "Increased mortality in elderly with dementia-related psychosis - not approved for this use.",
    "contraindications": ["Comatose states", "Children < 2 years or < 9 kg", "Pediatric surgery", "CNS depression"],
    "warnings": ["Extrapyramidal symptoms", "Tardive dyskinesia", "Neuroleptic malignant syndrome", "Orthostatic hypotension", "Lower seizure threshold"],
    "pregnancy_category": "C"
  }'::jsonb,
  monitoring = '{
    "vitals": true,
    "neuro": true,
    "orthostatic_bp": true,
    "frequency": "Before and after parenteral doses",
    "parameters": ["Blood pressure", "Extrapyramidal symptoms", "Level of sedation", "Temperature"]
  }'::jsonb,
  hold_parameters = '{
    "blood_pressure": "Hold if SBP < 90 or orthostatic",
    "eps_symptoms": "Hold and give diphenhydramine if dystonia",
    "temperature": "Hold if fever - NMS concern"
  }'::jsonb,
  clinical_pearls = ARRAY[
    'Very effective for nausea but high EPS risk - have diphenhydramine ready',
    'Young patients especially prone to acute dystonic reactions',
    'Commonly used IV with diphenhydramine for severe migraine in ED',
    'More potent antiemetic than promethazine but more EPS',
    'Rectal route useful for patients who cannot take oral',
    'Causes less sedation than promethazine'
  ]::text[],
  nursing_guide = '{
    "iv": {
      "appropriateness": {"suitable": true, "notes": "Use slow push to minimize hypotension"},
      "special_preparation": {"required": false, "steps": ["May give undiluted or dilute in NS", "Have diphenhydramine available for EPS"]},
      "administration": {"method": "Slow IV push over at least 5 min", "rate": "Max 5 mg/minute"},
      "post_admin": {"monitoring": ["Blood pressure - orthostatic risk", "Acute dystonia", "Akathisia"], "timing": "Q15 min x 1 hour"},
      "patient_teaching": ["Rise slowly - may cause dizziness", "Report muscle stiffness or restlessness", "Effective within 10-20 minutes"]
    },
    "im": {
      "appropriateness": {"suitable": true, "notes": "Good alternative to IV"},
      "administration": {"method": "Deep IM into large muscle"},
      "post_admin": {"monitoring": ["Injection site", "Blood pressure", "EPS symptoms"]},
      "patient_teaching": ["May cause injection site discomfort", "Dizziness and drowsiness expected"]
    }
  }'::jsonb,
  pharmacokinetics = '{
    "absorption": {"oral_bioavailability": "Variable", "peak": "3-4 hours PO, 10-20 min IM"},
    "distribution": {"protein_binding": "91-99%", "vd": "Large", "crosses_bbb": true},
    "metabolism": {"primary": "Hepatic extensive", "active_metabolites": true},
    "excretion": {"primary": "Renal and fecal", "half_life": "6-8 hours"}
  }'::jsonb,
  adverse_reactions = '{
    "common": ["Drowsiness", "Dizziness", "Dry mouth", "Blurred vision", "Constipation"],
    "serious": ["Acute dystonia", "Akathisia", "Tardive dyskinesia", "Neuroleptic malignant syndrome", "Agranulocytosis"],
    "frequency": {"drowsiness": "Common", "dystonia": "More common in young patients"}
  }'::jsonb,
  drug_interactions_info = '{
    "major": [
      {"drug": "CNS depressants", "effect": "Additive sedation and respiratory depression"},
      {"drug": "Anticholinergics", "effect": "Additive effects - may mask EPS"},
      {"drug": "Dopamine agonists", "effect": "Antagonizes effects"}
    ],
    "moderate": [
      {"drug": "Antihypertensives", "effect": "Enhanced hypotension"},
      {"drug": "Lithium", "effect": "May mask lithium toxicity symptoms"}
    ]
  }'::jsonb
WHERE generic_name ILIKE 'prochlorperazine';

-- Update Scopolamine with comprehensive data
UPDATE medications SET
  dosing_info = '{
    "adult": {
      "motion_sickness_patch": "1 patch (1 mg/72 hr) applied behind ear 4 hours before travel",
      "nausea_vomiting": "0.3-0.6 mg IM/IV/SC q6-8h PRN",
      "preoperative": "0.3-0.6 mg IM 30-60 min before anesthesia",
      "end_of_life_secretions": "0.2-0.4 mg SC q4-6h PRN"
    },
    "pediatric": {
      "motion_sickness": "Not recommended < 12 years for patch",
      "injection": "0.006 mg/kg, max 0.3 mg"
    }
  }'::jsonb,
  administration_info = '{
    "transdermal": {
      "application": "Behind ear on hairless, intact skin",
      "timing": "Apply 4 hours before needed, effective for 72 hours",
      "removal": "Remove and replace behind opposite ear after 72 hours"
    },
    "iv_push": {
      "rate": "Over 2-3 minutes",
      "dilution": "May give undiluted"
    },
    "subcutaneous": {
      "use": "Common for palliative care/secretions",
      "rate": "May give as continuous infusion"
    }
  }'::jsonb,
  safety_info = '{
    "black_box_warning": null,
    "contraindications": ["Angle-closure glaucoma", "GI/urinary obstruction", "Myasthenia gravis", "Severe ulcerative colitis"],
    "warnings": ["CNS depression", "Anticholinergic toxicity", "Heat intolerance", "Paradoxical CNS excitation in elderly", "Withdrawal symptoms if abrupt discontinuation"],
    "pregnancy_category": "C"
  }'::jsonb,
  monitoring = '{
    "vitals": true,
    "neuro": true,
    "urinary_output": true,
    "frequency": "Q4-6h with parenteral use",
    "parameters": ["Mental status", "Urinary retention", "Heart rate", "Dry mouth/secretions", "Pupil size"]
  }'::jsonb,
  hold_parameters = '{
    "heart_rate": "Hold if HR > 120",
    "urinary_retention": "Hold if unable to void",
    "confusion": "Hold if significant CNS changes, especially in elderly"
  }'::jsonb,
  clinical_pearls = ARRAY[
    'Wash hands after applying/removing patch - drug on fingers can affect eyes',
    'One patch lasts 72 hours - replace behind alternate ear',
    'Excellent for motion sickness and end-of-life secretions',
    'Elderly very susceptible to anticholinergic CNS effects',
    'May cause withdrawal symptoms if used > 3 days then stopped abruptly',
    'Pupil dilation can occur from touching patch then rubbing eye'
  ]::text[],
  nursing_guide = '{
    "transdermal": {
      "appropriateness": {"suitable": true, "notes": "First-line for motion sickness prevention"},
      "special_preparation": {"required": true, "steps": ["Clean, dry, hairless area behind ear", "Patient should wash hands before and after application"]},
      "administration": {"method": "Apply to clean skin behind ear", "timing": "4 hours before travel or procedure"},
      "post_admin": {"monitoring": ["Dry mouth", "Drowsiness", "Vision changes", "Urinary retention"], "timing": "Ongoing during use"},
      "patient_teaching": ["Wash hands after handling patch", "Do not touch eyes after handling", "Remove after 72 hours", "May cause drowsiness - avoid driving initially"]
    },
    "iv": {
      "appropriateness": {"suitable": true, "notes": "For acute use or when patch not appropriate"},
      "special_preparation": {"required": false, "steps": ["May give undiluted"]},
      "administration": {"method": "Slow IV push over 2-3 min"},
      "post_admin": {"monitoring": ["Heart rate", "Mental status", "Urinary output"], "timing": "Q1h x 4h"},
      "patient_teaching": ["Will cause dry mouth", "Report inability to urinate", "May affect vision"]
    }
  }'::jsonb,
  pharmacokinetics = '{
    "absorption": {"transdermal": "Slowly absorbed over 72 hours", "peak": "24 hours transdermal, 20-60 min parenteral"},
    "distribution": {"protein_binding": "Variable", "vd": "Widely distributed", "crosses_bbb": true},
    "metabolism": {"primary": "Hepatic", "active_metabolites": false},
    "excretion": {"primary": "Renal", "half_life": "8 hours"}
  }'::jsonb,
  adverse_reactions = '{
    "common": ["Dry mouth", "Drowsiness", "Blurred vision", "Dizziness", "Urinary retention"],
    "serious": ["Anticholinergic toxicity", "Angle-closure glaucoma", "Paradoxical CNS excitation", "Seizures", "Withdrawal symptoms"],
    "frequency": {"dry_mouth": "Very common", "drowsiness": "Common"}
  }'::jsonb,
  drug_interactions_info = '{
    "major": [
      {"drug": "Other anticholinergics", "effect": "Additive toxicity - confusion, urinary retention, ileus"},
      {"drug": "CNS depressants", "effect": "Enhanced sedation"}
    ],
    "moderate": [
      {"drug": "Potassium chloride solid oral", "effect": "Increased GI ulceration risk"},
      {"drug": "Antihistamines", "effect": "Additive anticholinergic effects"},
      {"drug": "Opioids", "effect": "Increased constipation and urinary retention"}
    ]
  }'::jsonb
WHERE generic_name ILIKE 'scopolamine';
