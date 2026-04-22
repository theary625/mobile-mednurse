
-- Update Heparin with comprehensive data
UPDATE public.medications SET
  dosing_info = '{
    "standard": {
      "bolus": "60-80 units/kg (max 5,000 units)",
      "infusion": "12-18 units/kg/hr (max 1,000 units/hr initially)"
    },
    "indications": {
      "DVT_PE_treatment": "80 units/kg bolus, then 18 units/kg/hr",
      "ACS": "60 units/kg bolus (max 4,000 units), then 12 units/kg/hr",
      "VTE_prophylaxis": "5,000 units SQ q8-12h",
      "dialysis": "1,000-5,000 units per session"
    },
    "adjustments": "Titrate based on aPTT (goal 1.5-2.5x control or 60-80 seconds)"
  }'::jsonb,
  administration_info = '{
    "IV": {
      "bolus": "Direct IV push over 1-2 minutes",
      "infusion": "Continuous via infusion pump only",
      "concentration": "25,000 units/250mL (100 units/mL) or 25,000 units/500mL (50 units/mL)",
      "compatibility": "NS, D5W",
      "filter": "Not required",
      "line": "Dedicated line preferred"
    },
    "subcutaneous": {
      "sites": "Abdomen (avoid 2 inches around umbilicus), rotate sites",
      "technique": "Do NOT aspirate, do NOT massage after injection",
      "needle": "25-27 gauge, 5/8 inch"
    }
  }'::jsonb,
  safety_info = '{
    "black_box_warnings": ["Epidural/spinal hematoma risk with neuraxial anesthesia", "HIT (heparin-induced thrombocytopenia) can cause life-threatening thrombosis"],
    "contraindications": ["Active major bleeding", "Severe thrombocytopenia", "History of HIT", "Uncontrolled hypertension"],
    "warnings": ["Monitor for bleeding signs", "Obtain baseline and serial platelet counts", "Have protamine available for reversal"]
  }'::jsonb,
  monitoring = '{
    "required": ["aPTT q6h until stable, then daily", "Platelet count at baseline, day 3-5, then q2-3 days", "Hemoglobin/hematocrit", "Signs of bleeding"],
    "frequency": "aPTT 6 hours after any rate change",
    "targets": {
      "aPTT": "60-80 seconds (1.5-2.5x control)",
      "anti_Xa": "0.3-0.7 units/mL (if used instead of aPTT)"
    }
  }'::jsonb,
  hold_parameters = '{
    "aPTT": ">120 seconds - hold and notify MD",
    "platelet_count": "<100,000 or 50% drop from baseline - evaluate for HIT",
    "active_bleeding": "Hold immediately and notify MD",
    "pre_procedure": "Hold 4-6 hours before invasive procedures"
  }'::jsonb,
  clinical_pearls = ARRAY[
    'Always use infusion pump - never gravity drip',
    'HIT typically occurs 5-10 days after starting heparin',
    'Protamine reversal: 1 mg per 100 units heparin (max 50 mg)',
    'aPTT drawn from same arm as heparin infusion may be falsely elevated',
    'Weight-based dosing reduces time to therapeutic range',
    'Check aPTT 6 hours after ANY rate change'
  ],
  nursing_guide = '{
    "IV": {
      "appropriateness": {
        "checks": ["Verify no HIT history", "Check baseline aPTT and platelets", "Confirm weight-based dosing", "Review bleeding precautions"],
        "red_flags": ["History of HIT", "Active bleeding", "Recent surgery", "Platelet count <100,000"]
      },
      "special_preparation": {
        "equipment": ["Infusion pump (required)", "Premixed bag preferred", "IV tubing"],
        "verification": ["Two-nurse verification required", "Confirm concentration and rate", "Check patient weight for dosing"]
      },
      "administration": {
        "steps": ["Verify order and patient", "Prime tubing", "Program pump accurately", "Start infusion", "Document time and rate"],
        "rate_considerations": "Never bolus through pump - use syringe for bolus doses"
      },
      "post_administration": {
        "monitoring": ["aPTT in 6 hours", "Bleeding assessment q4h", "Platelet count per protocol"],
        "documentation": ["Rate, concentration, site", "aPTT results and adjustments", "Bleeding assessments"]
      },
      "patient_teaching": ["Report unusual bruising/bleeding", "Use soft toothbrush", "Electric razor only", "Avoid contact sports"]
    }
  }'::jsonb,
  pharmacokinetics = '{
    "absorption": "IV immediate, SQ 20-30 minutes",
    "distribution": "Plasma proteins, does not cross placenta significantly",
    "metabolism": "Hepatic (saturable) and reticuloendothelial system",
    "excretion": "Renal (partially)",
    "half_life": "Dose-dependent: 30-90 minutes IV"
  }'::jsonb,
  adverse_reactions = '{
    "common": ["Bleeding", "Injection site reactions", "Elevated LFTs"],
    "serious": ["HIT", "Hemorrhage", "Osteoporosis (long-term use)", "Hyperkalemia", "Skin necrosis"],
    "bleeding_sites": ["GI", "Urinary", "Soft tissue", "Intracranial (rare but serious)"]
  }'::jsonb,
  drug_interactions_info = '{
    "major": [
      {"drug": "Other anticoagulants", "effect": "Additive bleeding risk"},
      {"drug": "Thrombolytics", "effect": "Severe bleeding risk"},
      {"drug": "NSAIDs", "effect": "Increased bleeding risk"},
      {"drug": "Antiplatelet agents", "effect": "Additive bleeding risk"}
    ],
    "moderate": [
      {"drug": "SSRIs/SNRIs", "effect": "Increased bleeding risk"},
      {"drug": "Penicillins (high dose)", "effect": "May prolong aPTT"}
    ]
  }'::jsonb,
  high_alert = true,
  double_check_required = true
WHERE LOWER(generic_name) = 'heparin';

-- Update Apixaban with comprehensive data
UPDATE public.medications SET
  dosing_info = '{
    "indications": {
      "atrial_fibrillation": {
        "standard": "5 mg PO BID",
        "reduced_dose": "2.5 mg PO BID if 2+ of: age ≥80, weight ≤60 kg, or SCr ≥1.5"
      },
      "DVT_PE_treatment": {
        "initial": "10 mg PO BID x 7 days",
        "maintenance": "5 mg PO BID after 7 days"
      },
      "DVT_PE_prophylaxis": "2.5 mg PO BID",
      "VTE_prevention_post_surgery": "2.5 mg PO BID starting 12-24h post-op"
    }
  }'::jsonb,
  administration_info = '{
    "oral": {
      "with_food": "May take with or without food",
      "crushing": "Can crush and mix with water, apple juice, or applesauce",
      "tube_feeding": "Can give via NG/G-tube - suspend in 60mL water",
      "missed_dose": "Take as soon as remembered; skip if <6h until next dose"
    }
  }'::jsonb,
  safety_info = '{
    "black_box_warnings": ["Spinal/epidural hematoma risk with neuraxial procedures", "Premature discontinuation increases stroke/thrombotic risk"],
    "contraindications": ["Active pathological bleeding", "Severe hypersensitivity to apixaban"],
    "warnings": ["No routine monitoring but anti-Xa levels can be obtained if needed", "Consider renal function in dosing decisions"]
  }'::jsonb,
  monitoring = '{
    "required": ["Signs/symptoms of bleeding", "Renal function (at least annually)", "Hemoglobin if bleeding suspected"],
    "labs": {
      "routine": "No routine coagulation monitoring required",
      "if_needed": "Anti-Xa (apixaban-specific calibrated assay)"
    }
  }'::jsonb,
  hold_parameters = '{
    "before_procedures": {
      "low_bleeding_risk": "Hold 24 hours",
      "moderate_high_risk": "Hold 48 hours",
      "neuraxial_anesthesia": "Hold 48-72 hours"
    },
    "active_bleeding": "Hold immediately",
    "CrCl_15": "Use with caution; consider alternative"
  }'::jsonb,
  clinical_pearls = ARRAY[
    'No routine INR/aPTT monitoring needed - these tests not reliable for apixaban',
    'Dose reduction criteria: 2 of 3 (age ≥80, weight ≤60 kg, SCr ≥1.5)',
    'Reversal agent: Andexanet alfa (Andexxa)',
    'Can be crushed - helpful for patients with swallowing difficulties',
    'Renal dosing less critical than dabigatran but still consider function',
    'Avoid with strong dual P-gp and CYP3A4 inhibitors/inducers'
  ],
  nursing_guide = '{
    "oral": {
      "appropriateness": {
        "checks": ["Verify indication", "Check dose reduction criteria", "Assess renal function", "Review drug interactions"],
        "red_flags": ["Active bleeding", "Recent major surgery", "Severe hepatic impairment", "Triple positive antiphospholipid syndrome"]
      },
      "administration": {
        "steps": ["Verify dose (5 mg vs 2.5 mg)", "May give with or without food", "Document time of administration"],
        "special_considerations": "Can crush and give with water/applesauce if needed"
      },
      "post_administration": {
        "monitoring": ["Watch for bleeding signs", "Assess for bruising", "Monitor hemoglobin if concerned"],
        "documentation": ["Dose given", "Any bleeding observations"]
      },
      "patient_teaching": ["Take at same times daily", "Do not double up missed doses", "Report unusual bleeding/bruising", "Carry anticoagulant card", "Inform all healthcare providers"]
    }
  }'::jsonb,
  pharmacokinetics = '{
    "absorption": "Bioavailability ~50%, peak 3-4 hours",
    "distribution": "87% protein bound",
    "metabolism": "CYP3A4, minimal renal",
    "excretion": "27% renal, 73% fecal",
    "half_life": "12 hours"
  }'::jsonb,
  adverse_reactions = '{
    "common": ["Bleeding", "Bruising", "Nausea"],
    "serious": ["Major hemorrhage", "Intracranial bleeding", "GI bleeding", "Anemia"]
  }'::jsonb,
  drug_interactions_info = '{
    "major": [
      {"drug": "Strong CYP3A4 + P-gp inhibitors (ketoconazole, ritonavir)", "effect": "Increased apixaban levels - reduce dose or avoid"},
      {"drug": "Strong CYP3A4 + P-gp inducers (rifampin, phenytoin)", "effect": "Decreased apixaban levels - avoid"},
      {"drug": "Other anticoagulants", "effect": "Additive bleeding risk"}
    ],
    "moderate": [
      {"drug": "Aspirin", "effect": "Increased bleeding risk"},
      {"drug": "NSAIDs", "effect": "Increased bleeding risk"},
      {"drug": "Diltiazem/verapamil", "effect": "Modest increase in apixaban levels"}
    ]
  }'::jsonb,
  high_alert = true
WHERE LOWER(generic_name) = 'apixaban';

-- Update Rivaroxaban with comprehensive data
UPDATE public.medications SET
  dosing_info = '{
    "indications": {
      "atrial_fibrillation": {
        "CrCl_50": "20 mg PO daily with evening meal",
        "CrCl_15_50": "15 mg PO daily with evening meal"
      },
      "DVT_PE_treatment": {
        "initial": "15 mg PO BID with food x 21 days",
        "maintenance": "20 mg PO daily with food after 21 days"
      },
      "VTE_prevention_post_surgery": {
        "hip": "10 mg PO daily x 35 days",
        "knee": "10 mg PO daily x 12 days"
      },
      "secondary_prevention": "10 mg PO daily (after 6 months treatment)"
    }
  }'::jsonb,
  administration_info = '{
    "oral": {
      "with_food": "MUST take with food (15 mg and 20 mg doses) - increases absorption",
      "crushing": "15 mg and 20 mg can be crushed and mixed with applesauce",
      "tube_feeding": "Can give via NG tube - follow with enteral feeding",
      "timing": "Take at same time daily"
    }
  }'::jsonb,
  safety_info = '{
    "black_box_warnings": ["Spinal/epidural hematoma risk with neuraxial procedures", "Premature discontinuation increases stroke risk in AF"],
    "contraindications": ["Active pathological bleeding", "Severe hepatic impairment (Child-Pugh B/C with coagulopathy)"],
    "warnings": ["Avoid in severe renal impairment (CrCl <15)", "Food significantly affects absorption of higher doses"]
  }'::jsonb,
  monitoring = '{
    "required": ["Bleeding signs/symptoms", "Renal function annually or more often if impaired", "Hemoglobin if bleeding suspected"],
    "labs": {
      "routine": "No routine coagulation monitoring",
      "if_needed": "Anti-Xa (rivaroxaban-calibrated) or PT (qualitative only)"
    }
  }'::jsonb,
  hold_parameters = '{
    "before_procedures": {
      "low_bleeding_risk": "Hold 24 hours",
      "moderate_high_risk": "Hold 48 hours",
      "neuraxial": "Hold minimum 24 hours (longer if renal impairment)"
    },
    "CrCl_15": "Avoid use"
  }'::jsonb,
  clinical_pearls = ARRAY[
    'MUST take 15 mg and 20 mg doses WITH FOOD - absorption reduced by 66% without food',
    '10 mg dose can be taken with or without food',
    'No reversal agent approved but andexanet alfa may be used off-label',
    '4-factor PCC can be used for life-threatening bleeding',
    'More dependent on renal function than apixaban',
    'Once daily dosing may improve compliance vs BID medications'
  ],
  nursing_guide = '{
    "oral": {
      "appropriateness": {
        "checks": ["Verify CrCl for dosing", "Confirm meal timing", "Check drug interactions", "Assess bleeding risk"],
        "red_flags": ["CrCl <15 mL/min", "Severe hepatic impairment", "Active bleeding", "Triple positive APS"]
      },
      "administration": {
        "steps": ["Give WITH food (critical for 15/20 mg)", "Verify correct dose for indication", "Document administration time"],
        "critical": "Food increases absorption - do not give on empty stomach"
      },
      "post_administration": {
        "monitoring": ["Bleeding assessment", "Bruising", "Dark stools/hematuria"],
        "documentation": ["Dose, time, given with food"]
      },
      "patient_teaching": ["Always take with food", "Take at same time daily", "Report bleeding", "Carry ID card", "Do not stop without MD guidance"]
    }
  }'::jsonb,
  pharmacokinetics = '{
    "absorption": "Bioavailability 80-100% with food, peak 2-4 hours",
    "distribution": "92-95% protein bound",
    "metabolism": "CYP3A4/3A5 and CYP2J2",
    "excretion": "36% renal unchanged, 33% renal as metabolites",
    "half_life": "5-9 hours (up to 13 hours in elderly)"
  }'::jsonb,
  adverse_reactions = '{
    "common": ["Bleeding", "Bruising", "Headache", "GI upset"],
    "serious": ["Major hemorrhage", "Intracranial bleeding", "GI bleeding", "Hepatotoxicity (rare)"]
  }'::jsonb,
  drug_interactions_info = '{
    "major": [
      {"drug": "Strong CYP3A4 + P-gp inhibitors (ketoconazole, ritonavir)", "effect": "Increased rivaroxaban levels - avoid"},
      {"drug": "Strong CYP3A4 + P-gp inducers (rifampin)", "effect": "Decreased levels by 50% - avoid"},
      {"drug": "Other anticoagulants", "effect": "Additive bleeding risk"}
    ],
    "moderate": [
      {"drug": "Aspirin", "effect": "Increased bleeding risk"},
      {"drug": "NSAIDs", "effect": "Increased bleeding risk"}
    ]
  }'::jsonb,
  high_alert = true
WHERE LOWER(generic_name) = 'rivaroxaban';

-- Update Dabigatran with comprehensive data
UPDATE public.medications SET
  dosing_info = '{
    "indications": {
      "atrial_fibrillation": {
        "CrCl_30": "150 mg PO BID",
        "CrCl_15_30": "75 mg PO BID",
        "with_P_gp_inhibitor": "Reduce dose based on CrCl"
      },
      "DVT_PE_treatment": "150 mg PO BID (after 5-10 days parenteral anticoagulation)",
      "VTE_prevention_post_surgery": {
        "standard": "110 mg first dose, then 220 mg daily",
        "renal_impairment": "75 mg first dose, then 150 mg daily if CrCl 30-50"
      }
    }
  }'::jsonb,
  administration_info = '{
    "oral": {
      "with_food": "May take with or without food",
      "swallow_whole": "MUST swallow capsules whole - do NOT break, chew, or open",
      "storage": "Keep in original bottle, discard 4 months after opening",
      "timing": "Take at same times daily, approximately 12 hours apart"
    }
  }'::jsonb,
  safety_info = '{
    "black_box_warnings": ["Spinal/epidural hematoma risk", "Premature discontinuation increases stroke risk"],
    "contraindications": ["Active pathological bleeding", "Mechanical heart valves", "Severe renal impairment (CrCl <30 for AF in some countries)"],
    "warnings": ["Most renally dependent DOAC - monitor renal function closely", "Do NOT open capsules - bioavailability increases 75%"]
  }'::jsonb,
  monitoring = '{
    "required": ["Renal function at baseline and at least annually", "More frequent renal monitoring if CrCl 30-50", "Signs of bleeding"],
    "labs": {
      "routine": "No routine coagulation monitoring",
      "if_needed": "Dilute thrombin time (dTT) or ecarin clotting time (ECT)"
    }
  }'::jsonb,
  hold_parameters = '{
    "before_procedures": {
      "CrCl_50_normal_risk": "Hold 24 hours",
      "CrCl_50_high_risk": "Hold 48 hours",
      "CrCl_30_50": "Hold 48-72 hours for standard, 72-96 for high risk",
      "neuraxial": "Hold minimum 72 hours"
    },
    "CrCl_30": "Contraindicated for AF in EU; use 75 mg BID in US if CrCl 15-30"
  }'::jsonb,
  clinical_pearls = ARRAY[
    'Most renally cleared DOAC (80%) - very CrCl dependent',
    'Only DOAC with specific reversal agent (idarucizumab/Praxbind)',
    'NEVER open, break, or crush capsules - causes 75% increase in bioavailability',
    'Keep in original container, protect from moisture',
    'Higher GI bleed risk compared to other DOACs',
    'Capsule contains tartaric acid to enhance absorption'
  ],
  nursing_guide = '{
    "oral": {
      "appropriateness": {
        "checks": ["Calculate CrCl", "Check for mechanical valve (contraindicated)", "Review P-gp inhibitor interactions", "Assess GI history"],
        "red_flags": ["CrCl <30 (or <15)", "Mechanical heart valve", "Active GI bleeding history"]
      },
      "administration": {
        "steps": ["Verify renal function", "Give capsule WHOLE - never crush", "May give with or without food", "Document time"],
        "critical": "Capsules MUST be swallowed whole - do not open, break, or chew"
      },
      "post_administration": {
        "monitoring": ["Bleeding assessment", "GI symptoms", "Renal function trends"],
        "documentation": ["Dose, time, capsule given intact"]
      },
      "patient_teaching": ["Swallow whole - never open capsules", "Keep in original bottle", "Report bleeding/bruising", "Discard 4 months after opening", "Stay hydrated"]
    }
  }'::jsonb,
  pharmacokinetics = '{
    "absorption": "Prodrug (dabigatran etexilate), bioavailability 3-7%, peak 1-2 hours",
    "distribution": "35% protein bound",
    "metabolism": "Converted by esterases to active dabigatran, not CYP-dependent",
    "excretion": "80% renal unchanged",
    "half_life": "12-17 hours (up to 28 hours if CrCl <30)"
  }'::jsonb,
  adverse_reactions = '{
    "common": ["Dyspepsia (10-15%)", "GI bleeding", "Gastritis-like symptoms"],
    "serious": ["Major hemorrhage", "GI bleeding (higher than warfarin)", "Intracranial bleeding (lower than warfarin)"]
  }'::jsonb,
  drug_interactions_info = '{
    "major": [
      {"drug": "P-gp inhibitors + CrCl <50 (ketoconazole, dronedarone)", "effect": "Avoid combination"},
      {"drug": "P-gp inducers (rifampin)", "effect": "Decreased levels - avoid"},
      {"drug": "Other anticoagulants", "effect": "Additive bleeding risk"}
    ],
    "moderate": [
      {"drug": "Verapamil", "effect": "Increase dabigatran levels 12-180%"},
      {"drug": "Amiodarone", "effect": "Increase dabigatran by 12-60%"},
      {"drug": "Quinidine", "effect": "Increase dabigatran by 50%"}
    ]
  }'::jsonb,
  high_alert = true
WHERE LOWER(generic_name) = 'dabigatran';

-- Update Fondaparinux with comprehensive data
UPDATE public.medications SET
  dosing_info = '{
    "indications": {
      "DVT_PE_treatment": {
        "weight_50": "5 mg SQ daily",
        "weight_50_100": "7.5 mg SQ daily",
        "weight_100": "10 mg SQ daily"
      },
      "VTE_prophylaxis": {
        "surgical": "2.5 mg SQ daily starting 6-8 hours post-op",
        "medical": "2.5 mg SQ daily"
      },
      "HIT": "Weight-based dosing as bridge to warfarin"
    },
    "renal_adjustment": {
      "CrCl_30_50": "Use with caution",
      "CrCl_30": "Contraindicated"
    }
  }'::jsonb,
  administration_info = '{
    "subcutaneous": {
      "sites": "Rotate between left and right anterolateral or posterolateral abdominal wall",
      "technique": "Pinch skin fold, insert needle at 90 degrees, do NOT expel air bubble before injection",
      "needle": "Pre-filled syringes with safety needle",
      "timing": "Give at same time daily"
    }
  }'::jsonb,
  safety_info = '{
    "black_box_warnings": ["Spinal/epidural hematoma risk with neuraxial anesthesia"],
    "contraindications": ["CrCl <30 mL/min", "Body weight <50 kg for prophylaxis dosing", "Active major bleeding", "Bacterial endocarditis", "Thrombocytopenia with positive anti-platelet antibody test"],
    "warnings": ["No antidote available", "Do not use interchangeably with heparin or LMWH", "Cannot be used for HIT with renal impairment"]
  }'::jsonb,
  monitoring = '{
    "required": ["Renal function at baseline and periodically", "CBC including platelets", "Signs of bleeding", "Injection site reactions"],
    "labs": {
      "routine": "No routine anticoagulation monitoring",
      "if_needed": "Anti-Xa (fondaparinux-calibrated assay)"
    }
  }'::jsonb,
  hold_parameters = '{
    "before_procedures": {
      "standard": "Hold 24-36 hours (2 half-lives)",
      "high_bleeding_risk": "Hold 48-72 hours",
      "neuraxial": "Hold minimum 36-42 hours, resume 6-12 hours after"
    },
    "CrCl_30": "Contraindicated - drug accumulates"
  }'::jsonb,
  clinical_pearls = ARRAY[
    'Does NOT cause HIT - safe alternative for HIT patients (if CrCl >30)',
    'Synthetic factor Xa inhibitor - no animal-derived components',
    'Long half-life (17-21 hours) allows once-daily dosing',
    'NO REVERSAL AGENT - supportive care for bleeding',
    'Weight-based dosing for treatment, fixed dose for prophylaxis',
    'Do not expel air bubble from syringe before injection'
  ],
  nursing_guide = '{
    "subcutaneous": {
      "appropriateness": {
        "checks": ["Verify CrCl >30", "Check weight for treatment dosing", "Confirm no HIT antibodies if prophylaxis", "Assess bleeding risk"],
        "red_flags": ["CrCl <30", "Weight <50 kg for prophylaxis", "Active bleeding", "Recent CNS/eye surgery"]
      },
      "special_preparation": {
        "equipment": ["Pre-filled syringe", "Alcohol swab"],
        "verification": ["Check dose matches weight (treatment)", "Verify expiration date"]
      },
      "administration": {
        "steps": ["Select site (rotate)", "Clean with alcohol", "Pinch skin fold", "Insert at 90°", "Inject - do NOT expel air bubble", "Activate safety device"],
        "critical": "Do NOT expel air bubble - ensures complete dose delivery"
      },
      "post_administration": {
        "monitoring": ["Injection site assessment", "Bleeding signs", "Platelet trends"],
        "documentation": ["Dose, site, time", "Any reactions"]
      },
      "patient_teaching": ["Rotate injection sites", "Report unusual bruising/bleeding", "Keep follow-up for labs", "Safe needle disposal"]
    }
  }'::jsonb,
  pharmacokinetics = '{
    "absorption": "Bioavailability 100% SQ, peak 2-3 hours",
    "distribution": "Primarily blood, minimal tissue distribution",
    "metabolism": "Not metabolized",
    "excretion": "Renal unchanged (64-77%)",
    "half_life": "17-21 hours (prolonged in renal impairment)"
  }'::jsonb,
  adverse_reactions = '{
    "common": ["Bleeding", "Anemia", "Injection site reactions", "Thrombocytopenia (not HIT)"],
    "serious": ["Major hemorrhage", "Thrombocytopenia", "Elevated LFTs"]
  }'::jsonb,
  drug_interactions_info = '{
    "major": [
      {"drug": "Other anticoagulants", "effect": "Additive bleeding risk"},
      {"drug": "Thrombolytics", "effect": "Significantly increased bleeding risk"}
    ],
    "moderate": [
      {"drug": "Antiplatelet agents", "effect": "Increased bleeding risk"},
      {"drug": "NSAIDs", "effect": "Increased bleeding risk"},
      {"drug": "SSRIs", "effect": "May increase bleeding tendency"}
    ]
  }'::jsonb,
  high_alert = true
WHERE LOWER(generic_name) = 'fondaparinux';
