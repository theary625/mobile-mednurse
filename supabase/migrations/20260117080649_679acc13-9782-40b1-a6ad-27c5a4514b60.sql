
-- Complete Anticoagulants Category: Update 6 remaining medications with comprehensive data

-- 1. Dalteparin (Fragmin) - Low Molecular Weight Heparin
UPDATE public.medications SET
  dosing_info = '{
    "indications": {
      "vte_prophylaxis_abdominal_surgery": {
        "dose": "2500-5000 units SubQ daily",
        "timing": "Start 1-2 hours pre-op, continue 5-10 days",
        "high_risk": "5000 units SubQ daily for high-risk patients"
      },
      "vte_prophylaxis_medical": {
        "dose": "5000 units SubQ daily",
        "duration": "Duration of immobility or hospitalization"
      },
      "vte_treatment": {
        "dose": "200 units/kg SubQ once daily OR 100 units/kg SubQ twice daily",
        "max_dose": "18,000 units/day",
        "duration": "5-10 days, overlap with warfarin until INR 2-3"
      },
      "cancer_associated_vte": {
        "month_1": "200 units/kg SubQ daily (max 18,000 units)",
        "months_2_6": "150 units/kg SubQ daily",
        "duration": "6 months or duration of active cancer"
      },
      "unstable_angina_nstemi": {
        "dose": "120 units/kg SubQ q12h (max 10,000 units/dose)",
        "duration": "5-8 days with aspirin"
      }
    },
    "weight_based_dosing": true,
    "renal_adjustment": {
      "crcl_less_than_30": "Monitor anti-Xa levels; consider dose reduction",
      "hemodialysis": "Use with caution; extended half-life"
    }
  }'::jsonb,
  administration_info = '{
    "routes": ["SubQ"],
    "subq_technique": {
      "sites": ["Abdomen (avoid 2 inches around navel)", "Outer thigh", "Upper outer arm"],
      "needle_angle": "45-90 degrees depending on subcutaneous tissue",
      "do_not_aspirate": true,
      "do_not_rub": true,
      "rotate_sites": true
    },
    "prefilled_syringes": "Available in various strengths; do not expel air bubble",
    "storage": "Room temperature; protect from light",
    "compatibility": "Do not mix with other injections"
  }'::jsonb,
  safety_info = '{
    "black_box_warning": "Epidural/spinal hematoma risk with neuraxial anesthesia or spinal puncture. Risk increased with indwelling catheters, concurrent anticoagulants/antiplatelets, history of spinal deformity or surgery. Monitor for neurological impairment.",
    "contraindications": [
      "Active major bleeding",
      "History of heparin-induced thrombocytopenia (HIT)",
      "Hypersensitivity to dalteparin or pork products",
      "Unstable angina undergoing non-Q-wave MI treatment with concurrent major bleeding"
    ],
    "warnings": [
      "Not for IM injection",
      "Use with caution in renal impairment",
      "Increased bleeding risk with platelet inhibitors",
      "Benzyl alcohol in multi-dose vials (avoid in neonates)"
    ],
    "pregnancy_category": "B (preferred LMWH in pregnancy)"
  }'::jsonb,
  monitoring = '{
    "baseline": ["CBC with platelets", "Creatinine", "PT/INR (if transitioning to warfarin)"],
    "ongoing": {
      "platelets": "Day 1, then every 2-3 days for first 2 weeks, then weekly",
      "anti_xa_level": {
        "when_to_check": "Obesity, renal impairment, pregnancy, extremes of weight",
        "timing": "4 hours post-dose",
        "therapeutic_range": {
          "twice_daily": "0.6-1.0 units/mL",
          "once_daily": "1.0-2.0 units/mL peak"
        }
      },
      "signs_of_bleeding": "Daily assessment",
      "neurological_status": "If epidural/spinal anesthesia"
    },
    "hit_monitoring": "Suspect if platelet drop >50% or thrombosis while on therapy"
  }'::jsonb,
  hold_parameters = '{
    "hold_if": [
      "Platelets < 100,000/mcL",
      "Active bleeding",
      "Scheduled invasive procedure",
      "Signs of HIT"
    ],
    "pre_procedure": {
      "prophylactic_dose": "Hold 12 hours before procedure",
      "therapeutic_dose": "Hold 24 hours before procedure",
      "high_bleeding_risk": "Hold 24+ hours; check anti-Xa if needed"
    },
    "notify_provider": [
      "Platelet drop > 30-50%",
      "New thrombosis while on therapy",
      "Unexplained bleeding",
      "Neurological changes (if epidural catheter)"
    ]
  }'::jsonb,
  clinical_pearls = ARRAY[
    'Do NOT expel air bubble from prefilled syringe - it ensures complete dose delivery',
    'Preferred anticoagulant for cancer-associated VTE (CLOT trial)',
    'No routine anti-Xa monitoring needed except special populations',
    'Can use in pregnancy - does not cross placenta',
    'HIT can occur but less common than with UFH',
    'Protamine only partially reverses effect (60-80%)',
    'Longer half-life than UFH allows once or twice daily dosing'
  ]::text[],
  nursing_guide = '{
    "subq": {
      "appropriateness": {
        "use_when": ["VTE prophylaxis", "VTE treatment", "Cancer-associated VTE", "ACS management"],
        "avoid_when": ["Active major bleeding", "HIT history", "Need for rapid reversal"]
      },
      "special_prep": {
        "steps": [
          "Verify dose matches indication and weight",
          "Check platelet count (baseline and ongoing)",
          "Select appropriate prefilled syringe or multi-dose vial",
          "Do NOT expel air bubble from prefilled syringe"
        ],
        "safety_checks": ["Verify no IM injection ordered", "Check for procedure scheduled within 12-24 hours"]
      },
      "administration": {
        "steps": [
          "Position patient supine or sitting",
          "Select injection site (abdomen preferred)",
          "Clean site with alcohol; allow to dry",
          "Pinch skin fold throughout injection",
          "Insert needle at 45-90 degree angle",
          "Inject slowly; do not aspirate",
          "Release skin fold after removing needle",
          "Apply gentle pressure; do not rub"
        ],
        "timing": "Give at same time(s) daily"
      },
      "post_administration": {
        "monitoring": ["Observe for injection site reactions", "Monitor for bleeding signs"],
        "documentation": ["Site used", "Patient tolerance", "Any bleeding observed"]
      },
      "patient_teaching": [
        "Injection technique for home administration",
        "Site rotation importance",
        "Signs of bleeding to report",
        "Avoid IM injections and contact sports",
        "Inform all healthcare providers of anticoagulant use"
      ]
    }
  }'::jsonb,
  pharmacokinetics = '{
    "absorption": {
      "bioavailability": "87% (SubQ)",
      "onset": "1-2 hours to peak anti-Xa activity",
      "peak": "4 hours post-dose"
    },
    "distribution": {
      "volume": "40-60 mL/kg",
      "protein_binding": "Low"
    },
    "metabolism": {
      "pathway": "Hepatic desulfation and depolymerization",
      "active_metabolites": false
    },
    "excretion": {
      "primary_route": "Renal",
      "half_life": "3-5 hours (prolonged in renal impairment)"
    }
  }'::jsonb,
  adverse_reactions = '{
    "common": ["Injection site reactions", "Bruising", "Minor bleeding"],
    "serious": ["Major hemorrhage", "Thrombocytopenia", "HIT", "Spinal/epidural hematoma", "Skin necrosis"],
    "life_threatening": ["Fatal bleeding", "Retroperitoneal hemorrhage", "Intracranial hemorrhage"]
  }'::jsonb,
  drug_interactions_info = '{
    "major": [
      {"drug": "Other anticoagulants", "effect": "Additive bleeding risk", "management": "Avoid combination or use with extreme caution"},
      {"drug": "Thrombolytics", "effect": "Markedly increased bleeding risk", "management": "Discontinue dalteparin before thrombolytic therapy"},
      {"drug": "NSAIDs", "effect": "Increased bleeding risk", "management": "Monitor closely; avoid if possible"}
    ],
    "moderate": [
      {"drug": "Aspirin", "effect": "Increased bleeding risk", "management": "May be used together in ACS; monitor closely"},
      {"drug": "Clopidogrel/Prasugrel", "effect": "Additive antiplatelet effect", "management": "Monitor for bleeding"}
    ],
    "monitoring_required": ["Platelet count", "Hemoglobin/hematocrit", "Signs of bleeding"]
  }'::jsonb
WHERE LOWER(generic_name) = 'dalteparin';

-- 2. Edoxaban (Savaysa) - Direct Factor Xa Inhibitor
UPDATE public.medications SET
  dosing_info = '{
    "indications": {
      "atrial_fibrillation": {
        "standard_dose": "60 mg PO once daily",
        "reduced_dose": "30 mg PO once daily",
        "reduce_if": ["CrCl 15-50 mL/min", "Body weight ≤60 kg", "Concurrent P-gp inhibitors"]
      },
      "vte_treatment": {
        "dose": "60 mg PO once daily",
        "prerequisite": "After 5-10 days of parenteral anticoagulation",
        "reduced_dose": "30 mg PO once daily for CrCl 15-50, weight ≤60 kg, or P-gp inhibitors",
        "duration": "At least 3 months; extended treatment based on risk-benefit"
      }
    },
    "important_note": "Do NOT use in AFib if CrCl >95 mL/min (reduced efficacy vs warfarin)",
    "renal_adjustment": {
      "crcl_greater_than_95": "Do NOT use for AFib",
      "crcl_51_95": "60 mg once daily",
      "crcl_15_50": "30 mg once daily",
      "crcl_less_than_15": "Not recommended"
    }
  }'::jsonb,
  administration_info = '{
    "routes": ["PO"],
    "with_food": "Can be taken with or without food",
    "timing": "Once daily at same time each day",
    "missed_dose": "Take as soon as remembered on same day; skip if next day",
    "crushing": "Can be crushed and mixed with applesauce for immediate administration",
    "ng_tube": "Can be crushed and suspended in water for NG tube"
  }'::jsonb,
  safety_info = '{
    "black_box_warning": "1) Reduced efficacy in nonvalvular AFib with CrCl >95 mL/min - use another anticoagulant. 2) Premature discontinuation increases thrombotic risk. 3) Spinal/epidural hematoma risk with neuraxial procedures.",
    "contraindications": [
      "Active pathological bleeding",
      "CrCl >95 mL/min for AFib indication"
    ],
    "warnings": [
      "Increased bleeding risk with antiplatelet agents",
      "Avoid in moderate-severe hepatic impairment",
      "Mechanical heart valves - not studied",
      "Triple-positive antiphospholipid syndrome - avoid"
    ],
    "reversal": "Andexanet alfa (Andexxa) - Factor Xa inhibitor reversal agent"
  }'::jsonb,
  monitoring = '{
    "baseline": ["CrCl (Cockcroft-Gault)", "CBC", "LFTs", "PT/INR for reference"],
    "ongoing": {
      "renal_function": "At least annually; more frequent if CrCl 15-50",
      "hemoglobin": "Periodic monitoring for occult bleeding",
      "signs_of_bleeding": "Each visit"
    },
    "note": "No routine coagulation monitoring required; anti-Xa levels can assess presence but not for dose adjustment"
  }'::jsonb,
  hold_parameters = '{
    "hold_if": [
      "Active bleeding",
      "Scheduled surgery or invasive procedure",
      "CrCl drops below 15 mL/min"
    ],
    "pre_procedure": {
      "low_bleeding_risk": "Hold 24 hours",
      "high_bleeding_risk": "Hold ≥48 hours",
      "resume": "When adequate hemostasis achieved"
    },
    "bridging": "Generally not recommended; short half-life allows perioperative management"
  }'::jsonb,
  clinical_pearls = ARRAY[
    'UNIQUE: Do NOT use in AFib if CrCl >95 mL/min (less effective than warfarin)',
    'Must start after 5-10 days of parenteral anticoagulant for VTE treatment',
    'Once-daily dosing improves compliance vs twice-daily DOACs',
    'Can be crushed for patients with swallowing difficulties',
    'P-gp inhibitors (dronedarone, some HIV drugs) require dose reduction',
    'Andexanet alfa available for reversal in life-threatening bleeding',
    'Lower GI bleeding risk compared to rivaroxaban in some studies'
  ]::text[],
  nursing_guide = '{
    "po": {
      "appropriateness": {
        "use_when": ["Nonvalvular AFib with CrCl 15-95 mL/min", "VTE treatment after parenteral anticoagulation"],
        "avoid_when": ["AFib with CrCl >95 mL/min", "Severe hepatic impairment", "Mechanical heart valves"]
      },
      "special_prep": {
        "steps": [
          "Verify CrCl is 15-95 mL/min for AFib indication",
          "Confirm prior parenteral anticoagulation if for VTE treatment",
          "Check for dose-reducing factors (renal, weight, P-gp inhibitors)",
          "Assess for bleeding risk factors"
        ],
        "safety_checks": ["Renal function documented", "Correct dose for indication and patient factors"]
      },
      "administration": {
        "steps": [
          "Verify patient identity and dose",
          "Can give with or without food",
          "May crush and mix with applesauce if needed",
          "Document administration time"
        ],
        "timing": "Same time each day"
      },
      "post_administration": {
        "monitoring": ["Signs of bleeding", "Bruising", "Dark stools or urine"],
        "documentation": ["Time given", "Patient tolerance"]
      },
      "patient_teaching": [
        "Take at same time daily",
        "Do not stop without provider guidance - stroke risk",
        "Report bleeding, bruising, dark stools, blood in urine",
        "Inform all healthcare providers and dentists",
        "Carry anticoagulant card"
      ]
    }
  }'::jsonb,
  pharmacokinetics = '{
    "absorption": {
      "bioavailability": "62%",
      "onset": "1-2 hours to peak",
      "food_effect": "No significant effect"
    },
    "distribution": {
      "volume": "107 L",
      "protein_binding": "55%"
    },
    "metabolism": {
      "pathway": "Minimal; hydrolysis, conjugation, CYP3A4 (<4%)",
      "active_metabolites": false
    },
    "excretion": {
      "renal": "50% (35% unchanged)",
      "fecal": "50%",
      "half_life": "10-14 hours"
    }
  }'::jsonb,
  adverse_reactions = '{
    "common": ["Bleeding", "Anemia", "Rash", "Abnormal LFTs"],
    "serious": ["Major bleeding", "Intracranial hemorrhage", "GI bleeding"],
    "life_threatening": ["Fatal bleeding", "Hemorrhagic stroke"]
  }'::jsonb,
  drug_interactions_info = '{
    "major": [
      {"drug": "Rifampin", "effect": "Significantly reduces edoxaban levels", "management": "Avoid concomitant use"},
      {"drug": "Other anticoagulants", "effect": "Additive bleeding risk", "management": "Avoid combination"}
    ],
    "moderate": [
      {"drug": "P-gp inhibitors (dronedarone, quinidine, verapamil)", "effect": "Increased edoxaban levels", "management": "Reduce dose to 30 mg daily"},
      {"drug": "Aspirin >100 mg", "effect": "Increased bleeding risk", "management": "Use with caution"},
      {"drug": "NSAIDs", "effect": "Increased GI bleeding risk", "management": "Monitor closely"}
    ],
    "note": "P-gp inhibitors require dose reduction but some P-gp inhibitors (amiodarone) do not require adjustment"
  }'::jsonb
WHERE LOWER(generic_name) = 'edoxaban';

-- 3. Argatroban - Direct Thrombin Inhibitor (IV)
UPDATE public.medications SET
  dosing_info = '{
    "indications": {
      "hit_treatment": {
        "initial_dose": "2 mcg/kg/min continuous IV infusion",
        "hepatic_impairment": "0.5 mcg/kg/min initial dose",
        "titration": "Adjust to aPTT 1.5-3x baseline (not to exceed 100 seconds)",
        "max_dose": "10 mcg/kg/min"
      },
      "pci_in_hit": {
        "bolus": "350 mcg/kg IV bolus",
        "infusion": "25 mcg/kg/min during procedure",
        "titrate_to": "ACT 300-450 seconds",
        "additional_bolus": "150 mcg/kg if ACT <300 seconds"
      }
    },
    "hepatic_adjustment": {
      "moderate_impairment": "Start at 0.5 mcg/kg/min",
      "titrate_carefully": "Longer half-life in hepatic dysfunction"
    },
    "no_renal_adjustment": "No dose adjustment needed for renal impairment"
  }'::jsonb,
  administration_info = '{
    "routes": ["IV"],
    "preparation": {
      "dilution": "Dilute in NS, D5W, or LR to 1 mg/mL",
      "stability": "24 hours at room temperature; protect from light",
      "final_concentration": "Standard: 1 mg/mL"
    },
    "administration": {
      "method": "Continuous IV infusion via infusion pump",
      "do_not_bolus": "For HIT treatment (bolus only for PCI)",
      "dedicated_line": "Preferred to avoid interruptions"
    }
  }'::jsonb,
  safety_info = '{
    "black_box_warning": null,
    "contraindications": [
      "Active major bleeding",
      "Hypersensitivity to argatroban"
    ],
    "warnings": [
      "Hepatic impairment - reduce dose and monitor closely",
      "Increased bleeding risk with thrombolytics",
      "Affects INR - special considerations when transitioning to warfarin",
      "Unexplained aPTT elevation may indicate overdose"
    ],
    "reversal": "No specific reversal agent; supportive care, half-life is short (39-51 min)"
  }'::jsonb,
  monitoring = '{
    "baseline": ["aPTT", "CBC with platelets", "LFTs", "INR (for warfarin transition)"],
    "ongoing": {
      "aptt": {
        "initial": "2 hours after starting or dose change",
        "target": "1.5-3x baseline (max 100 seconds)",
        "frequency": "Every 2-4 hours until stable, then daily"
      },
      "platelets": "Daily (expect recovery if HIT)",
      "hemoglobin": "Daily for bleeding assessment",
      "act": "During PCI procedures; target 300-450 seconds"
    },
    "warfarin_transition": {
      "challenge": "Argatroban elevates INR independently",
      "method": "Overlap until INR >4 on combination therapy; recheck INR 4-6h after stopping argatroban"
    }
  }'::jsonb,
  hold_parameters = '{
    "hold_if": [
      "Active major bleeding",
      "aPTT > 100 seconds",
      "Severe thrombocytopenia unrelated to HIT"
    ],
    "reduce_rate_if": [
      "aPTT above target range",
      "Minor bleeding"
    ],
    "notify_provider": [
      "Bleeding at any site",
      "aPTT persistently above/below target",
      "Platelet count not recovering",
      "New thrombosis"
    ]
  }'::jsonb,
  clinical_pearls = ARRAY[
    'First-line treatment for HIT - can use immediately when HIT suspected',
    'Hepatically cleared - ideal for HIT patients with renal impairment',
    'Short half-life (39-51 min) allows for quick offset if bleeding occurs',
    'RAISES INR independently - complicates warfarin transition',
    'For warfarin transition: overlap until combined INR >4, then recheck 4-6h after stopping argatroban',
    'No bolus for HIT treatment (only for PCI)',
    'Platelet recovery typically begins within 1-3 days if HIT diagnosed correctly'
  ]::text[],
  nursing_guide = '{
    "iv": {
      "appropriateness": {
        "use_when": ["Confirmed or suspected HIT", "PCI in patients with HIT history"],
        "avoid_when": ["Active major bleeding", "Severe hepatic failure"]
      },
      "special_prep": {
        "steps": [
          "Obtain baseline aPTT, CBC, LFTs",
          "Verify weight for dose calculation",
          "Prepare infusion: dilute to 1 mg/mL",
          "Set up dedicated IV line with infusion pump"
        ],
        "safety_checks": ["Check hepatic function for dose adjustment", "Document HIT diagnosis/suspicion"]
      },
      "administration": {
        "steps": [
          "Start at ordered rate (usually 2 mcg/kg/min)",
          "Use infusion pump - no gravity drip",
          "Ensure continuous infusion - no interruptions",
          "Label IV line clearly as anticoagulant"
        ],
        "titration": "Per aPTT results every 2-4 hours initially"
      },
      "post_administration": {
        "monitoring": ["aPTT 2h after start or rate change", "Bleeding assessment q4h", "Platelet count daily"],
        "documentation": ["Rate changes with aPTT results", "Bleeding assessments", "Platelet trend"]
      },
      "patient_teaching": [
        "Purpose is to treat/prevent clots from HIT",
        "Report any bleeding or bruising immediately",
        "Importance of blood draws for monitoring",
        "Will transition to another anticoagulant when stable"
      ]
    }
  }'::jsonb,
  pharmacokinetics = '{
    "absorption": {
      "route": "IV only",
      "onset": "Immediate anticoagulation"
    },
    "distribution": {
      "volume": "174 mL/kg",
      "protein_binding": "54% (primarily albumin)"
    },
    "metabolism": {
      "pathway": "Hepatic - hydroxylation and aromatization",
      "cyp_enzymes": "CYP3A4/5",
      "active_metabolites": "M1 metabolite (weak activity)"
    },
    "excretion": {
      "primary_route": "Feces (65% as metabolites)",
      "renal": "22%",
      "half_life": "39-51 minutes (prolonged in hepatic impairment)"
    }
  }'::jsonb,
  adverse_reactions = '{
    "common": ["Bleeding", "Hypotension", "Fever", "Nausea", "Diarrhea"],
    "serious": ["Major hemorrhage", "GI bleeding", "Hemoptysis"],
    "life_threatening": ["Intracranial hemorrhage", "Retroperitoneal bleeding"]
  }'::jsonb,
  drug_interactions_info = '{
    "major": [
      {"drug": "Thrombolytics", "effect": "Markedly increased bleeding risk", "management": "Use with extreme caution; reduce argatroban dose"},
      {"drug": "Other anticoagulants", "effect": "Additive bleeding risk", "management": "Avoid overlap except during transition"}
    ],
    "moderate": [
      {"drug": "Antiplatelet agents", "effect": "Increased bleeding risk", "management": "Monitor closely"},
      {"drug": "Warfarin", "effect": "Argatroban raises INR; complex transition", "management": "Use specialized transition protocol"}
    ],
    "lab_interference": "Prolongs PT/INR, aPTT, TT, ACT"
  }'::jsonb
WHERE LOWER(generic_name) = 'argatroban';

-- 4. Bivalirudin (Angiomax) - Direct Thrombin Inhibitor
UPDATE public.medications SET
  dosing_info = '{
    "indications": {
      "pci": {
        "bolus": "0.75 mg/kg IV bolus",
        "infusion": "1.75 mg/kg/hr during procedure",
        "post_procedure": "Can continue at 0.2 mg/kg/hr for up to 20 hours if needed"
      },
      "hit_acs": {
        "bolus": "0.75 mg/kg IV bolus",
        "infusion": "1.75 mg/kg/hr",
        "duration": "Duration of procedure or until stable"
      }
    },
    "renal_adjustment": {
      "crcl_30_59": "No bolus adjustment; reduce infusion to 1.4 mg/kg/hr",
      "crcl_less_than_30": "No bolus adjustment; reduce infusion to 1 mg/kg/hr",
      "hemodialysis": "Reduce infusion to 0.25 mg/kg/hr"
    },
    "no_hepatic_adjustment": "No adjustment needed for hepatic impairment"
  }'::jsonb,
  administration_info = '{
    "routes": ["IV"],
    "preparation": {
      "reconstitution": "Reconstitute 250 mg vial with 5 mL sterile water",
      "further_dilution": "Dilute to 50 mL with D5W or NS (5 mg/mL)",
      "stability": "24 hours refrigerated after reconstitution"
    },
    "administration": {
      "bolus": "IV push over seconds",
      "infusion": "Continuous via infusion pump",
      "y_site_compatible": "Check compatibility - limited data"
    }
  }'::jsonb,
  safety_info = '{
    "black_box_warning": null,
    "contraindications": [
      "Active major bleeding",
      "Hypersensitivity to bivalirudin"
    ],
    "warnings": [
      "Bleeding risk increases with renal impairment",
      "Acute stent thrombosis risk - ensure adequate antiplatelet therapy",
      "No reversal agent - short half-life is safety advantage"
    ],
    "reversal": "No specific antidote; short half-life (25 min) allows rapid offset; hemodialysis removes 25%"
  }'::jsonb,
  monitoring = '{
    "during_pci": {
      "act": {
        "check": "5 minutes after bolus",
        "target": "300-450 seconds",
        "if_low": "Additional bolus 0.3 mg/kg; increase infusion"
      }
    },
    "post_procedure": {
      "aptt": "If extended infusion; target 1.5-2.5x baseline",
      "sheath_management": "Check ACT before sheath removal (target <180-200 sec)",
      "access_site": "Q15 min x 4, then Q1h until stable"
    },
    "bleeding_assessment": "Continuous during procedure; Q1-2h post-procedure"
  }'::jsonb,
  hold_parameters = '{
    "stop_infusion_if": [
      "Major bleeding",
      "ACT persistently >500 seconds",
      "Severe hypotension suggesting hemorrhage"
    ],
    "sheath_removal": {
      "when": "ACT <180-200 seconds (usually 2 hours post-infusion stop)",
      "manual_pressure": "15-30 minutes or until hemostasis"
    },
    "notify_provider": [
      "ACT out of range",
      "Bleeding at access site or elsewhere",
      "Signs of acute stent thrombosis"
    ]
  }'::jsonb,
  clinical_pearls = ARRAY[
    'Very short half-life (25 min) - excellent safety profile for bleeding',
    'Renally cleared - adjust dose in renal impairment',
    'Alternative to heparin in HIT patients undergoing PCI',
    'Less bleeding than heparin+GPI in PCI - HORIZONS-AMI trial',
    'Acute stent thrombosis risk higher - ensure P2Y12 inhibitor on board',
    'ACT is primary monitoring parameter during PCI',
    'Can use immediately in suspected HIT - no HIT-like syndrome'
  ]::text[],
  nursing_guide = '{
    "iv": {
      "appropriateness": {
        "use_when": ["PCI anticoagulation", "HIT patients undergoing PCI", "Alternative to heparin in ACS"],
        "avoid_when": ["Active major bleeding", "Known hypersensitivity"]
      },
      "special_prep": {
        "steps": [
          "Obtain accurate patient weight",
          "Assess renal function for dose adjustment",
          "Reconstitute: 250 mg in 5 mL sterile water, then dilute to 5 mg/mL",
          "Prepare bolus and infusion simultaneously"
        ],
        "safety_checks": ["Verify weight-based dose calculations", "Check for P2Y12 inhibitor ordered"]
      },
      "administration": {
        "steps": [
          "Give bolus IV push (0.75 mg/kg)",
          "Immediately start infusion (1.75 mg/kg/hr)",
          "Check ACT 5 minutes after bolus",
          "Maintain infusion throughout PCI"
        ],
        "act_protocol": "Additional 0.3 mg/kg bolus if ACT <300 seconds"
      },
      "post_administration": {
        "monitoring": ["ACT q30 min during procedure", "Access site Q15 min post-sheath removal", "Hemoglobin if prolonged infusion"],
        "documentation": ["ACT values", "Total drug given", "Sheath removal time and hemostasis"]
      },
      "patient_teaching": [
        "Lie flat and keep leg straight until sheath removed",
        "Report any pain, warmth, or wetness at groin/wrist",
        "Importance of not moving during pressure holding",
        "When OK to ambulate post-procedure"
      ]
    }
  }'::jsonb,
  pharmacokinetics = '{
    "absorption": {
      "route": "IV only",
      "onset": "Immediate"
    },
    "distribution": {
      "volume": "0.1 L/kg",
      "protein_binding": "Does not bind to plasma proteins"
    },
    "metabolism": {
      "pathway": "Proteolytic cleavage (blood enzymes)",
      "cyp_independent": true
    },
    "excretion": {
      "renal": "20% unchanged",
      "half_life": "25 minutes (prolonged in renal impairment up to 3.5 hours in dialysis)"
    }
  }'::jsonb,
  adverse_reactions = '{
    "common": ["Minor bleeding", "Back pain", "Nausea", "Hypotension", "Headache"],
    "serious": ["Major bleeding", "Access site hemorrhage", "Retroperitoneal bleeding"],
    "procedural": ["Acute stent thrombosis (rare)", "Coronary artery dissection (procedure-related)"]
  }'::jsonb,
  drug_interactions_info = '{
    "major": [
      {"drug": "Thrombolytics", "effect": "Significantly increased bleeding", "management": "Avoid concomitant use"},
      {"drug": "Other parenteral anticoagulants", "effect": "Additive effect", "management": "Do not overlap"}
    ],
    "moderate": [
      {"drug": "GPIIb/IIIa inhibitors", "effect": "Increased bleeding", "management": "Generally not needed with bivalirudin; used in rescue situations only"},
      {"drug": "Antiplatelet agents", "effect": "Expected use in PCI; increased bleeding risk", "management": "Standard of care; monitor access site"}
    ],
    "note": "Does not interact with heparin antibodies - ideal for HIT"
  }'::jsonb
WHERE LOWER(generic_name) = 'bivalirudin';

-- 5. Betrixaban (Bevyxxa) - Factor Xa Inhibitor
UPDATE public.medications SET
  dosing_info = '{
    "indications": {
      "vte_prophylaxis": {
        "indication": "Extended VTE prophylaxis in acutely ill hospitalized patients at risk",
        "initial_dose": "160 mg on Day 1",
        "maintenance": "80 mg once daily",
        "duration": "35-42 days total",
        "start_timing": "Day 1 of hospitalization"
      }
    },
    "renal_adjustment": {
      "crcl_15_30": "Initial 80 mg, then 40 mg once daily",
      "crcl_less_than_15": "Not studied; avoid use"
    },
    "p_gp_inhibitors": {
      "dose": "Initial 80 mg, then 40 mg once daily",
      "examples": "P-gp inhibitors include ketoconazole, amiodarone, others"
    }
  }'::jsonb,
  administration_info = '{
    "routes": ["PO"],
    "with_food": "Take with food",
    "timing": "Once daily at same time",
    "missed_dose": "Take as soon as remembered on same day; resume normal schedule next day",
    "crushing": "Not studied; use caution",
    "storage": "Room temperature"
  }'::jsonb,
  safety_info = '{
    "black_box_warning": "Spinal/epidural hematoma risk with neuraxial anesthesia or spinal puncture in anticoagulated patients. Monitor for neurological impairment.",
    "contraindications": [
      "Active pathological bleeding",
      "Severe hypersensitivity to betrixaban"
    ],
    "warnings": [
      "Discontinuation increases thrombotic risk",
      "Not for treatment of acute VTE",
      "Triple-positive antiphospholipid syndrome - avoid",
      "Severe hepatic impairment - avoid"
    ],
    "reversal": "No specific reversal agent; andexanet alfa may be considered (not specifically studied)"
  }'::jsonb,
  monitoring = '{
    "baseline": ["CrCl", "CBC", "LFTs"],
    "ongoing": {
      "renal_function": "Reassess if clinical status changes",
      "bleeding_signs": "Daily assessment",
      "mobility": "Assess for ability to resume ambulation"
    },
    "note": "No routine coagulation monitoring required; prolongs PT and anti-Xa if measured"
  }'::jsonb,
  hold_parameters = '{
    "hold_if": [
      "Active bleeding",
      "Scheduled invasive procedure",
      "Neuraxial procedure planned"
    ],
    "pre_procedure": {
      "timing": "Hold at least 72 hours before elective procedure (long half-life)",
      "neuraxial": "72 hours before spinal/epidural; 5 hours after catheter removal before restart"
    },
    "notify_provider": [
      "Bleeding signs",
      "New neurological symptoms",
      "Planned procedures"
    ]
  }'::jsonb,
  clinical_pearls = ARRAY[
    'Only DOAC specifically for extended VTE prophylaxis in hospitalized medical patients',
    'APEX trial: 35-42 days of prophylaxis reduced VTE vs 6-14 days enoxaparin',
    'Long half-life (19-27 hours) requires 72+ hours hold before procedures',
    'Must take WITH FOOD - improves absorption',
    'Not for VTE treatment - only prophylaxis',
    'Limited use due to narrow indication and generic LMWH alternatives',
    'P-gp substrate - reduce dose with P-gp inhibitors'
  ]::text[],
  nursing_guide = '{
    "po": {
      "appropriateness": {
        "use_when": ["Extended VTE prophylaxis in acutely ill hospitalized patients", "High VTE risk with limited mobility"],
        "avoid_when": ["Active VTE requiring treatment", "CrCl <15 mL/min", "Severe hepatic impairment"]
      },
      "special_prep": {
        "steps": [
          "Confirm indication (prophylaxis, not treatment)",
          "Verify renal function for dosing",
          "Check for P-gp inhibitors requiring dose reduction",
          "Assess VTE risk factors and mobility status"
        ],
        "safety_checks": ["No active bleeding", "No scheduled procedures requiring hold"]
      },
      "administration": {
        "steps": [
          "Give with food (required for absorption)",
          "Day 1: Loading dose 160 mg (or 80 mg if reduced)",
          "Day 2+: Maintenance 80 mg daily (or 40 mg if reduced)",
          "Same time each day"
        ],
        "duration": "Total 35-42 days from initiation"
      },
      "post_administration": {
        "monitoring": ["Bleeding signs daily", "Mobility assessment", "Discharge planning for completion"],
        "documentation": ["Dose given", "Day of therapy", "Discharge plan for therapy completion"]
      },
      "patient_teaching": [
        "Must take with food",
        "Complete full course even after discharge",
        "Report bleeding, bruising, dark stools",
        "Do not stop without provider guidance",
        "Inform other providers of anticoagulant use"
      ]
    }
  }'::jsonb,
  pharmacokinetics = '{
    "absorption": {
      "bioavailability": "34% (increased with food)",
      "peak": "3-4 hours",
      "food_effect": "Required - increases absorption"
    },
    "distribution": {
      "volume": "32 L",
      "protein_binding": "60%"
    },
    "metabolism": {
      "pathway": "Minimal metabolism; hydrolysis to inactive metabolites",
      "cyp_independent": true
    },
    "excretion": {
      "fecal": "85% (mostly unchanged)",
      "renal": "11%",
      "half_life": "19-27 hours"
    }
  }'::jsonb,
  adverse_reactions = '{
    "common": ["Bleeding", "Hypokalemia", "Urinary tract infection", "Constipation", "Diarrhea"],
    "serious": ["Major bleeding", "Epidural/spinal hematoma"],
    "life_threatening": ["Intracranial hemorrhage", "Fatal bleeding (rare)"]
  }'::jsonb,
  drug_interactions_info = '{
    "major": [
      {"drug": "P-gp inhibitors (ketoconazole, amiodarone, verapamil)", "effect": "Increased betrixaban levels", "management": "Reduce dose: 80 mg day 1, then 40 mg daily"},
      {"drug": "P-gp inducers (rifampin)", "effect": "Decreased betrixaban levels", "management": "Avoid concomitant use"}
    ],
    "moderate": [
      {"drug": "Aspirin", "effect": "Increased bleeding risk", "management": "Use lowest effective aspirin dose"},
      {"drug": "NSAIDs", "effect": "Increased bleeding risk", "management": "Avoid if possible"}
    ]
  }'::jsonb
WHERE LOWER(generic_name) = 'betrixaban';

-- 6. 4-Factor PCC (Kcentra/Beriplex) - Prothrombin Complex Concentrate
UPDATE public.medications SET
  dosing_info = '{
    "indications": {
      "warfarin_reversal": {
        "pre_treatment_inr_2_4": "25 units/kg (max 2500 units)",
        "pre_treatment_inr_4_6": "35 units/kg (max 3500 units)",
        "pre_treatment_inr_greater_than_6": "50 units/kg (max 5000 units)",
        "vitamin_k": "Administer Vitamin K 10 mg IV concurrently for sustained reversal"
      },
      "life_threatening_bleeding": {
        "dose": "25-50 units/kg based on INR",
        "indication": "ICH, GI bleed, trauma, surgical bleeding in warfarin patients"
      },
      "urgent_surgery": {
        "dose": "25-50 units/kg based on INR",
        "timing": "Administer as close to procedure as possible"
      }
    },
    "factor_xa_inhibitor_reversal": {
      "note": "Off-label use; consider when andexanet alfa unavailable",
      "dose": "25-50 units/kg",
      "evidence": "Limited; some guidelines support use"
    },
    "max_rate": "0.12 mL/kg/min (approximately 3 units/kg/min)"
  }'::jsonb,
  administration_info = '{
    "routes": ["IV"],
    "preparation": {
      "reconstitution": "Use provided diluent; gently swirl to dissolve",
      "final_concentration": "25 units/mL after reconstitution",
      "stability": "Use within 4 hours of reconstitution at room temperature"
    },
    "administration": {
      "rate": "Initial 0.12 mL/kg/min (max 8.4 mL/min)",
      "infusion_time": "Typical infusion 10-15 minutes",
      "slow_rate_if": "Infusion-related reactions occur",
      "filter": "Use filter needle/filter spike for withdrawal from vial"
    }
  }'::jsonb,
  safety_info = '{
    "black_box_warning": "Patients being treated with Vitamin K antagonists have underlying disease states that predispose them to thromboembolic events. Potential benefit should be weighed against risk of thromboembolic complications.",
    "contraindications": [
      "Known anaphylaxis to product or components",
      "DIC (disseminated intravascular coagulation)",
      "Heparin-induced thrombocytopenia (contains heparin)"
    ],
    "warnings": [
      "Thromboembolic risk (arterial and venous)",
      "Contains heparin - contraindicated in HIT",
      "Made from human plasma - infectious disease transmission risk (minimal with processing)",
      "Fluid overload in large doses"
    ],
    "reversal": "Not applicable - this IS a reversal agent"
  }'::jsonb,
  monitoring = '{
    "immediate": {
      "inr": "Check 30 minutes after infusion completion",
      "vitals": "During and 20 minutes after infusion"
    },
    "post_infusion": {
      "inr": "6-8 hours post-infusion; ensure vitamin K taking effect",
      "thrombosis_signs": "Monitor for new clots 24-72 hours post-infusion",
      "bleeding_status": "Assess for hemostasis"
    },
    "infusion_reactions": "Monitor for anaphylaxis, hypotension, tachycardia"
  }'::jsonb,
  hold_parameters = '{
    "do_not_give_if": [
      "Active DIC",
      "Known HIT (product contains heparin)",
      "Anaphylaxis to previous dose or plasma products"
    ],
    "slow_or_stop_infusion": [
      "Hypotension",
      "Tachycardia",
      "Chest tightness or wheezing",
      "Urticaria/flushing"
    ],
    "notify_provider": [
      "INR not corrected",
      "Infusion reaction",
      "Signs of thrombosis post-infusion",
      "Continued bleeding despite INR correction"
    ]
  }'::jsonb,
  clinical_pearls = ARRAY[
    'NOT a substitute for fresh frozen plasma - contains no Factor V or protein C/S',
    'MUST give with Vitamin K for sustained reversal - PCC effect wears off in 12-24 hours',
    'Faster and lower volume than FFP - less fluid overload',
    'Contains heparin - CONTRAINDICATED in HIT',
    'Dose based on PRE-TREATMENT INR - must know INR before dosing',
    'Check INR 30 minutes post-infusion to confirm correction',
    'Can use for life-threatening bleeding on factor Xa inhibitors when andexanet unavailable (off-label)',
    'Thromboembolic events reported - use lowest effective dose'
  ]::text[],
  nursing_guide = '{
    "iv": {
      "appropriateness": {
        "use_when": ["Life-threatening bleeding on warfarin", "Urgent surgery in warfarin patient", "ICH on warfarin"],
        "avoid_when": ["Active DIC", "History of HIT (contains heparin)", "Anaphylaxis to product"]
      },
      "special_prep": {
        "steps": [
          "Obtain STAT INR for dosing calculation",
          "Calculate dose based on weight and INR",
          "Reconstitute with provided diluent; swirl gently",
          "Use filter needle for withdrawal",
          "Prepare Vitamin K 10 mg IV to give concurrently"
        ],
        "safety_checks": ["No HIT history", "INR known", "Vitamin K ordered", "Emergency equipment available"]
      },
      "administration": {
        "steps": [
          "Administer via dedicated IV line",
          "Initial rate: 0.12 mL/kg/min (max 8.4 mL/min)",
          "Monitor vitals continuously during infusion",
          "Complete infusion within 10-15 minutes if tolerated",
          "Administer Vitamin K concurrently (separate line)"
        ],
        "slow_rate_for": "Any signs of infusion reaction (hypotension, tachycardia, flushing)"
      },
      "post_administration": {
        "monitoring": ["INR 30 min post-infusion", "Bleeding assessment", "Signs of thrombosis", "Vitals x 20 min"],
        "documentation": ["Pre-treatment INR", "Dose given", "Post-infusion INR", "Vitamin K given", "Clinical response"]
      },
      "patient_teaching": [
        "Purpose of medication - emergency reversal of blood thinner",
        "Signs of allergic reaction to report",
        "Risk of blood clots after treatment",
        "Ongoing monitoring needed"
      ]
    }
  }'::jsonb,
  pharmacokinetics = '{
    "absorption": {
      "route": "IV only",
      "onset": "Rapid - INR correction within 10-30 minutes"
    },
    "distribution": {
      "content": "Contains Factors II, VII, IX, X; Proteins C and S",
      "volume": "Corresponds to plasma volume"
    },
    "metabolism": {
      "pathway": "Utilized as clotting factors in coagulation cascade"
    },
    "excretion": {
      "half_life": {
        "factor_ii": "60-72 hours",
        "factor_vii": "4-6 hours",
        "factor_ix": "24 hours",
        "factor_x": "30-40 hours"
      },
      "clinical_duration": "Effect lasts 12-24 hours without vitamin K"
    }
  }'::jsonb,
  adverse_reactions = '{
    "common": ["Headache", "Nausea/vomiting", "Hypotension", "Anemia"],
    "serious": ["Thromboembolic events (DVT, PE, stroke, MI)", "DIC", "Infusion reactions"],
    "life_threatening": ["Anaphylaxis", "Fatal thromboembolic events"]
  }'::jsonb,
  drug_interactions_info = '{
    "major": [
      {"drug": "Heparin/LMWH", "effect": "Product contains heparin; additive effect", "management": "Be aware of heparin content; avoid in HIT"},
      {"drug": "Other procoagulant agents", "effect": "Increased thrombotic risk", "management": "Use caution with prothrombin factors"}
    ],
    "moderate": [
      {"drug": "Antifibrinolytics (TXA, aminocaproic acid)", "effect": "Potential increased thrombotic risk", "management": "Use together only if clinically necessary"}
    ],
    "note": "Primary use is to reverse anticoagulant effect - monitor for both bleeding and thrombosis"
  }'::jsonb
WHERE LOWER(generic_name) = '4-factor pcc' OR LOWER(generic_name) LIKE '%prothrombin complex%' OR LOWER(generic_name) LIKE '%kcentra%';
