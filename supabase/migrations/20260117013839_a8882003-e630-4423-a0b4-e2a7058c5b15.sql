
-- Update Atenolol with comprehensive data
UPDATE public.medications SET
  high_alert = false,
  dosing_info = '{
    "adult": {
      "hypertension": {"initial": "25-50 mg once daily", "maintenance": "50-100 mg once daily", "max": "100 mg/day"},
      "angina": {"initial": "50 mg once daily", "maintenance": "100-200 mg/day", "max": "200 mg/day"},
      "post_MI": {"dose": "100 mg once daily or 50 mg twice daily"}
    },
    "pediatric": {"dose": "0.5-1 mg/kg/day", "max": "2 mg/kg/day up to 100 mg"},
    "geriatric": "Start at lower doses, titrate slowly"
  }',
  administration_info = '{
    "PO": {
      "appropriateness": "Primary route for all indications",
      "preparation": "No special preparation needed",
      "administration": "Give with or without food, but be consistent",
      "post_administration": "Monitor HR and BP",
      "patient_teaching": "Take at same time daily, do not stop abruptly"
    }
  }',
  safety_info = '{
    "black_box_warnings": ["Do not withdraw abruptly - risk of exacerbation of angina, MI, and ventricular arrhythmias"],
    "contraindications": ["Sinus bradycardia", "Heart block greater than first degree", "Cardiogenic shock", "Uncompensated heart failure", "Sick sinus syndrome"],
    "warnings": ["May mask hypoglycemia symptoms in diabetics", "Use caution in peripheral vascular disease", "May worsen psoriasis"]
  }',
  monitoring = '{"vitals": true, "cardiac": true, "frequency": "Before each dose initially, then as clinically indicated", "parameters": ["Heart rate", "Blood pressure", "Signs of heart failure"]}',
  hold_parameters = '{"bp": {"systolic_min": 90}, "hr": {"min": 50}}',
  clinical_pearls = ARRAY[
    'Cardioselective beta-blocker - less bronchospasm risk than non-selective',
    'Renally eliminated - reduce dose in renal impairment',
    'Less lipophilic - fewer CNS side effects than propranolol',
    'Taper over 1-2 weeks to discontinue',
    'May need dose adjustment with hemodialysis'
  ],
  nursing_guide = '{
    "PO": {
      "appropriateness": "Standard oral administration",
      "special_preparation": "Can be crushed if needed",
      "administration_steps": ["Check HR and BP before administration", "Hold if HR <50 or SBP <90", "Give consistently with or without food"],
      "post_administration": "Monitor for bradycardia and hypotension",
      "patient_teaching": "Do not stop suddenly, report dizziness or slow heartbeat"
    }
  }',
  pharmacokinetics = '{"absorption": "50% absorbed orally", "distribution": "Low protein binding 6-16%, minimal CNS penetration", "metabolism": "Minimal hepatic metabolism", "excretion": "Primarily renal unchanged", "half_life": "6-7 hours, prolonged in renal impairment"}',
  adverse_reactions = '{"common": ["Fatigue", "Cold extremities", "Bradycardia", "Dizziness"], "serious": ["Heart block", "Bronchospasm", "Heart failure exacerbation", "Severe bradycardia"], "frequency": {"fatigue": "26%", "cold_extremities": "12%", "dizziness": "13%"}}',
  drug_interactions_info = '{"major": ["Clonidine - rebound hypertension if atenolol stopped first", "Verapamil/Diltiazem - additive AV block"], "moderate": ["Digoxin - additive bradycardia", "NSAIDs - reduced antihypertensive effect", "Insulin - masked hypoglycemia"]}'
WHERE LOWER(generic_name) = 'atenolol';

-- Update Amlodipine with comprehensive data
UPDATE public.medications SET
  high_alert = false,
  dosing_info = '{
    "adult": {
      "hypertension": {"initial": "5 mg once daily", "maintenance": "5-10 mg once daily", "max": "10 mg/day"},
      "angina": {"initial": "5-10 mg once daily", "max": "10 mg/day"}
    },
    "pediatric": {"age_6_17": "2.5-5 mg once daily"},
    "geriatric": "Start 2.5 mg once daily",
    "hepatic_impairment": "Start 2.5 mg once daily"
  }',
  administration_info = '{
    "PO": {
      "appropriateness": "Only available route",
      "preparation": "No special preparation",
      "administration": "May be given with or without food",
      "post_administration": "Monitor for peripheral edema and hypotension",
      "patient_teaching": "May take 1-2 weeks for full effect"
    }
  }',
  safety_info = '{
    "black_box_warnings": [],
    "contraindications": ["Hypersensitivity to amlodipine or dihydropyridines"],
    "warnings": ["May worsen angina or cause MI in severe obstructive CAD", "Use with caution in severe aortic stenosis", "Increased angina risk on initiation or dose increase"]
  }',
  monitoring = '{"vitals": true, "frequency": "Weekly during titration, then as clinically indicated", "parameters": ["Blood pressure", "Heart rate", "Peripheral edema", "Symptoms of heart failure"]}',
  hold_parameters = '{"bp": {"systolic_min": 90}}',
  clinical_pearls = ARRAY[
    'Long half-life allows once daily dosing',
    'Peripheral edema is dose-dependent - consider lower doses or adding ACEI/ARB',
    'No significant first-pass metabolism',
    'Safe in renal impairment - no dose adjustment needed',
    'Grapefruit juice may increase levels - moderate intake'
  ],
  nursing_guide = '{
    "PO": {
      "appropriateness": "Standard oral calcium channel blocker",
      "special_preparation": "Can be crushed if needed",
      "administration_steps": ["Check blood pressure before administration", "Assess for peripheral edema", "Can give with or without food"],
      "post_administration": "Monitor for hypotension, especially initially",
      "patient_teaching": "Report ankle swelling, avoid grapefruit juice excess"
    }
  }',
  pharmacokinetics = '{"absorption": "64-90% bioavailability", "distribution": "93% protein bound", "metabolism": "Extensive hepatic via CYP3A4", "excretion": "10% unchanged in urine, 60% as metabolites", "half_life": "30-50 hours"}',
  adverse_reactions = '{"common": ["Peripheral edema", "Headache", "Flushing", "Fatigue", "Dizziness"], "serious": ["Hypotension", "Worsening angina", "MI"], "frequency": {"edema": "1.8-10.8%", "headache": "7.3%", "flushing": "1.5-4.5%"}}',
  drug_interactions_info = '{"major": ["Strong CYP3A4 inhibitors - increased amlodipine levels"], "moderate": ["Simvastatin - limit to 20mg with amlodipine", "Cyclosporine - increased cyclosporine levels", "Sildenafil - additive hypotension"]}'
WHERE LOWER(generic_name) = 'amlodipine';

-- Update Hydralazine with comprehensive data
UPDATE public.medications SET
  high_alert = true,
  dosing_info = '{
    "adult": {
      "hypertension_oral": {"initial": "10 mg 4 times daily for 2-4 days", "maintenance": "25-50 mg 4 times daily", "max": "300 mg/day"},
      "hypertensive_emergency_IV": {"dose": "10-20 mg IV/IM", "repeat": "Every 4-6 hours as needed"},
      "heart_failure": {"dose": "25-100 mg 3-4 times daily with isosorbide dinitrate"}
    },
    "pediatric": {"oral": "0.75-1 mg/kg/day divided q6h, max 25 mg/dose", "IV_IM": "0.1-0.2 mg/kg/dose q4-6h, max 20 mg"},
    "renal_impairment": "Extend dosing interval"
  }',
  administration_info = '{
    "IV": {
      "appropriateness": "Hypertensive emergencies, when oral not possible",
      "preparation": "May give undiluted or dilute in NS",
      "rate": "Slow IV push over 1 minute",
      "post_administration": "Monitor BP continuously for 15-30 minutes",
      "patient_teaching": "Report headache, palpitations, chest pain"
    },
    "PO": {
      "appropriateness": "Chronic hypertension management",
      "preparation": "Give with food to enhance absorption",
      "administration": "Space doses evenly throughout day",
      "post_administration": "Monitor BP at each dose initially"
    }
  }',
  safety_info = '{
    "black_box_warnings": [],
    "contraindications": ["CAD", "Mitral valve rheumatic heart disease", "Hypersensitivity"],
    "warnings": ["Drug-induced lupus with prolonged use >200mg/day", "Reflex tachycardia - often combined with beta-blocker", "May worsen angina"]
  }',
  monitoring = '{"vitals": true, "cardiac": true, "frequency": "Continuous during IV, before each oral dose initially", "parameters": ["Blood pressure", "Heart rate", "Signs of lupus-like syndrome", "ANA if prolonged therapy"]}',
  hold_parameters = '{"bp": {"systolic_min": 90}, "hr": {"max": 120}}',
  clinical_pearls = ARRAY[
    'Causes reflex tachycardia - usually combined with beta-blocker',
    'Used with isosorbide dinitrate for HF in African Americans (A-HeFT trial)',
    'Check ANA periodically with chronic use >6 months',
    'Slow acetylators at higher risk for lupus-like syndrome',
    'IV onset 10-20 minutes, peak 20-40 minutes'
  ],
  nursing_guide = '{
    "IV": {
      "appropriateness": "Hypertensive urgency/emergency",
      "special_preparation": "May use undiluted, protect from light",
      "administration_steps": ["Verify BP before administration", "Give slow IV push over 1 minute minimum", "Have patient supine", "Monitor BP q5min x 30min"],
      "post_administration": "Watch for reflex tachycardia and rebound hypertension",
      "patient_teaching": "Report chest pain, palpitations, or headache immediately"
    },
    "PO": {
      "appropriateness": "Chronic hypertension, heart failure",
      "special_preparation": "Give with food",
      "administration_steps": ["Check BP and HR", "Give with meals for better absorption"],
      "post_administration": "Monitor for lupus-like symptoms with chronic use",
      "patient_teaching": "Take with food, report joint pain or fever"
    }
  }',
  pharmacokinetics = '{"absorption": "Variable oral bioavailability 26-55%", "distribution": "87% protein bound", "metabolism": "Hepatic acetylation - slow vs fast acetylators", "excretion": "Renal", "half_life": "2-8 hours depending on acetylator status"}',
  adverse_reactions = '{"common": ["Headache", "Palpitations", "Tachycardia", "Flushing", "Nasal congestion"], "serious": ["Drug-induced lupus", "Angina exacerbation", "Blood dyscrasias"], "frequency": {"headache": "4-17%", "tachycardia": "5-14%"}}',
  drug_interactions_info = '{"major": ["MAOIs - severe hypotension"], "moderate": ["Diazoxide - severe hypotension", "NSAIDs - reduced antihypertensive effect", "Other antihypertensives - additive effects"]}'
WHERE LOWER(generic_name) = 'hydralazine';

-- Update Losartan with comprehensive data
UPDATE public.medications SET
  high_alert = false,
  dosing_info = '{
    "adult": {
      "hypertension": {"initial": "50 mg once daily", "maintenance": "25-100 mg daily in 1-2 doses", "max": "100 mg/day"},
      "diabetic_nephropathy": {"dose": "50 mg once daily, increase to 100 mg based on BP"},
      "stroke_prevention_with_LVH": {"dose": "50 mg once daily, may add HCTZ and/or increase to 100 mg"}
    },
    "pediatric": {"age_6_and_older": "0.7 mg/kg once daily, max 50 mg"},
    "hepatic_impairment": "Start 25 mg once daily"
  }',
  administration_info = '{
    "PO": {
      "appropriateness": "Only available route",
      "preparation": "No special preparation",
      "administration": "May give with or without food",
      "post_administration": "Monitor BP and renal function",
      "patient_teaching": "Avoid potassium supplements and salt substitutes"
    }
  }',
  safety_info = '{
    "black_box_warnings": ["Can cause fetal harm when administered to pregnant women - discontinue as soon as pregnancy detected"],
    "contraindications": ["Pregnancy", "Hypersensitivity to losartan", "Concomitant use with aliskiren in diabetes"],
    "warnings": ["May cause hyperkalemia", "Can cause hypotension especially if volume depleted", "May worsen renal function"]
  }',
  monitoring = '{"vitals": true, "labs": ["Potassium", "BUN", "Creatinine"], "frequency": "Within 2-4 weeks of initiation, then periodically", "parameters": ["Blood pressure", "Renal function", "Potassium"]}',
  hold_parameters = '{"bp": {"systolic_min": 90}, "labs": {"potassium_max": 5.5, "creatinine_increase_percent": 30}}',
  clinical_pearls = ARRAY[
    'Active metabolite (E-3174) more potent - CYP2C9 polymorphisms affect response',
    'Only ARB with proven stroke prevention benefit (LIFE trial)',
    'Uricosuric effect may lower uric acid',
    'Can use if ACE inhibitor-induced cough',
    'Check K+ and creatinine 1-2 weeks after starting'
  ],
  nursing_guide = '{
    "PO": {
      "appropriateness": "Standard oral administration",
      "special_preparation": "Can be crushed, suspension can be compounded",
      "administration_steps": ["Check blood pressure", "Review potassium level", "May give with or without food"],
      "post_administration": "Monitor for hypotension, especially if on diuretics",
      "patient_teaching": "Avoid potassium supplements, report swelling or decreased urine output"
    }
  }',
  pharmacokinetics = '{"absorption": "33% bioavailability, not affected by food", "distribution": "99% protein bound", "metabolism": "Hepatic via CYP2C9 to active metabolite E-3174", "excretion": "35% renal, 60% fecal", "half_life": "2 hours (losartan), 6-9 hours (E-3174)"}',
  adverse_reactions = '{"common": ["Dizziness", "Upper respiratory infection", "Nasal congestion", "Back pain"], "serious": ["Hyperkalemia", "Acute renal failure", "Angioedema (rare)", "Hypotension"], "frequency": {"dizziness": "3%", "hyperkalemia": "1.5%"}}',
  drug_interactions_info = '{"major": ["Aliskiren in diabetic patients - increased risk of hypotension, hyperkalemia, renal impairment"], "moderate": ["Potassium-sparing diuretics - hyperkalemia risk", "NSAIDs - reduced effect, increased renal risk", "Lithium - increased lithium levels", "Rifampin - decreased losartan efficacy"]}'
WHERE LOWER(generic_name) = 'losartan';

-- Update Carvedilol with comprehensive data
UPDATE public.medications SET
  high_alert = false,
  dosing_info = '{
    "adult": {
      "heart_failure": {"initial": "3.125 mg twice daily", "titration": "Double dose every 2 weeks as tolerated", "max": "25 mg twice daily (<85kg), 50 mg twice daily (>85kg)"},
      "hypertension": {"initial": "6.25 mg twice daily", "maintenance": "6.25-25 mg twice daily", "max": "50 mg/day"},
      "post_MI_LV_dysfunction": {"initial": "3.125-6.25 mg twice daily", "titration": "Increase every 3-10 days", "max": "25 mg twice daily"}
    },
    "extended_release": {
      "heart_failure": {"initial": "10 mg once daily", "titration": "Double every 2 weeks", "max": "80 mg once daily"}
    },
    "hepatic_impairment": "Avoid in severe impairment"
  }',
  administration_info = '{
    "PO": {
      "appropriateness": "Only available route",
      "preparation": "Take with food to reduce orthostatic hypotension",
      "administration": "Immediate-release: twice daily with food. Extended-release: once daily in morning with food",
      "post_administration": "Monitor HR, BP, weight, symptoms of HF",
      "patient_teaching": "Take with food, rise slowly from sitting/lying"
    }
  }',
  safety_info = '{
    "black_box_warnings": ["Do not withdraw abruptly - risk of exacerbation of angina, MI, and ventricular arrhythmias"],
    "contraindications": ["Bronchial asthma or bronchospasm", "Decompensated heart failure requiring IV inotropes", "Second or third degree AV block", "Sick sinus syndrome", "Severe bradycardia", "Cardiogenic shock", "Severe hepatic impairment"],
    "warnings": ["May worsen heart failure initially - start low, go slow", "Mask hypoglycemia in diabetics", "May precipitate heart failure in patients with latent cardiac insufficiency"]
  }',
  monitoring = '{"vitals": true, "cardiac": true, "frequency": "Before each dose during titration, then as indicated", "parameters": ["Heart rate", "Blood pressure", "Weight daily", "Signs of heart failure decompensation"]}',
  hold_parameters = '{"bp": {"systolic_min": 85}, "hr": {"min": 55}}',
  clinical_pearls = ARRAY[
    'Non-selective beta-blocker with alpha-1 blocking activity - causes vasodilation',
    'One of three beta-blockers proven to reduce mortality in HF (with bisoprolol, metoprolol succinate)',
    'Start low and go slow in HF - symptoms may worsen initially',
    'MUST take with food to slow absorption and reduce orthostatic hypotension',
    'May worsen hyperglycemia control - monitor in diabetics'
  ],
  nursing_guide = '{
    "PO": {
      "appropriateness": "Standard oral beta-blocker with alpha activity",
      "special_preparation": "Extended-release capsules may be opened and sprinkled on applesauce",
      "administration_steps": ["Check HR and BP - hold if HR <55 or SBP <85", "Assess for signs of HF decompensation", "GIVE WITH FOOD", "Have patient sit for 1-2 minutes before standing"],
      "post_administration": "Monitor for orthostatic hypotension, bradycardia, weight gain",
      "patient_teaching": "Take with food every time, rise slowly, weigh daily, report weight gain >3 lbs"
    }
  }',
  pharmacokinetics = '{"absorption": "Rapidly absorbed, 25-35% bioavailability due to first-pass", "distribution": ">98% protein bound, lipophilic - crosses BBB", "metabolism": "Extensive hepatic via CYP2D6 and CYP2C9", "excretion": "Primarily biliary/fecal, <2% unchanged in urine", "half_life": "7-10 hours, longer in poor CYP2D6 metabolizers"}',
  adverse_reactions = '{"common": ["Dizziness", "Fatigue", "Hypotension", "Diarrhea", "Weight gain", "Hyperglycemia"], "serious": ["Severe bradycardia", "Heart block", "Heart failure worsening", "Bronchospasm"], "frequency": {"dizziness": "32%", "fatigue": "24%", "hypotension": "9%", "diarrhea": "12%"}}',
  drug_interactions_info = '{"major": ["Clonidine - rebound hypertension if carvedilol stopped first", "CYP2D6 inhibitors (fluoxetine, paroxetine) - increased carvedilol levels"], "moderate": ["Digoxin - increased digoxin levels", "Calcium channel blockers - additive effects", "Insulin/oral hypoglycemics - masked hypoglycemia, worsened glucose control", "Rifampin - decreased carvedilol levels 70%"]}'
WHERE LOWER(generic_name) = 'carvedilol';
