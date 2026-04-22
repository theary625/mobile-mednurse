
-- Update Insulin (Regular) with comprehensive data
UPDATE public.medications SET
  high_alert = true,
  double_check_required = true,
  dosing_info = '{
    "adult": {
      "dka_hhs": "0.1 units/kg/hr IV infusion; may give 0.1 units/kg bolus first",
      "hyperkalemia": "10 units regular insulin IV with 25g dextrose",
      "sliding_scale": "Per institutional protocol based on blood glucose",
      "tpn": "0.1 units per gram of dextrose in TPN"
    },
    "pediatric": {
      "dka": "0.05-0.1 units/kg/hr IV infusion (no bolus recommended)"
    }
  }'::jsonb,
  administration_info = '{
    "IV": {
      "methods": {
        "Continuous_Infusion": {
          "concentration": "1 unit/mL (100 units in 100mL NS)",
          "priming": "Prime tubing with 20mL of insulin solution (insulin binds to tubing)",
          "rate": "Per protocol based on blood glucose"
        },
        "IV_Push": {
          "use": "For hyperkalemia only",
          "dilution": "May give undiluted",
          "rate": "Over 1-2 minutes"
        }
      },
      "compatibility": "NS only (not compatible with D5W for infusion stability)",
      "stability": "24 hours at room temperature"
    },
    "SubQ": {
      "sites": "Abdomen, thigh, upper arm, buttocks",
      "rotation": "Rotate injection sites systematically",
      "technique": "Inject at 90° angle; do not massage"
    },
    "general": {
      "independent_double_check": "REQUIRED for all insulin doses",
      "storage": "Refrigerate unopened; room temp 28 days once opened"
    }
  }'::jsonb,
  safety_info = '{
    "contraindications": ["Hypoglycemia", "Hypokalemia (correct first)"],
    "precautions": ["Renal impairment (increased hypoglycemia risk)", "Hepatic impairment", "Elderly", "NPO patients"],
    "high_alert": "One of the most common medications causing serious harm"
  }'::jsonb,
  monitoring = '{
    "parameters": ["Blood glucose", "Potassium", "Signs of hypoglycemia"],
    "frequency": {
      "dka_protocol": "Hourly glucose and q2h BMP",
      "sliding_scale": "Before meals and at bedtime",
      "drip": "Hourly until stable, then q2h"
    }
  }'::jsonb,
  hold_parameters = '{
    "glucose": "Hold if blood glucose <70 mg/dL",
    "potassium": "Hold if K+ <3.3 mEq/L (replace potassium first)",
    "npo": "Reassess basal vs meal-time dosing"
  }'::jsonb,
  clinical_pearls = ARRAY[
    'Regular insulin is the ONLY insulin that can be given IV',
    'Prime IV tubing with 20mL insulin solution - insulin binds to plastic',
    'Always verify with independent double-check before administration',
    '1 unit of insulin typically lowers glucose by 25-50 mg/dL',
    'In DKA, do not stop insulin until anion gap closes, even if glucose normalizes - add dextrose instead'
  ],
  nursing_guide = '{
    "IV": {
      "appropriateness": {
        "when_to_use": "DKA, HHS, hyperkalemia, perioperative glycemic control",
        "when_to_avoid": "Hypoglycemia, severe hypokalemia"
      },
      "preparation": {
        "supplies": "NS bag, insulin vial, infusion pump, glucose meter",
        "priming": "MUST prime tubing with 20mL of prepared solution"
      },
      "administration": {
        "verification": "Independent double-check required",
        "pump": "Always use infusion pump; dedicated line preferred"
      },
      "post_admin": {
        "monitoring": "Hourly glucose checks; q2h potassium",
        "documentation": "Glucose levels, rate changes, any hypoglycemia treatment"
      },
      "patient_teaching": "Report symptoms of low blood sugar: shakiness, sweating, confusion"
    },
    "SubQ": {
      "appropriateness": {
        "when_to_use": "Type 1 DM, Type 2 DM, hyperglycemia management"
      },
      "administration": {
        "timing": "Give 30 minutes before meals (regular insulin)",
        "technique": "Rotate sites; do not inject into lipohypertrophy areas"
      }
    }
  }'::jsonb,
  pharmacokinetics = '{
    "absorption": {
      "subq_onset": "30-60 minutes",
      "subq_peak": "2-4 hours",
      "iv_onset": "Immediate",
      "factors": "Injection site, exercise, temperature affect absorption"
    },
    "distribution": {
      "vd": "0.1-0.2 L/kg",
      "protein_binding": "Low"
    },
    "metabolism": {
      "primary": "Liver (60%), kidney (40%)",
      "pathway": "Insulinase enzyme degradation"
    },
    "excretion": {
      "route": "Renal",
      "unchanged": "Minimal"
    },
    "half_life": {
      "iv": "5-10 minutes",
      "subq": "60-90 minutes"
    },
    "duration": {
      "regular_subq": "5-8 hours",
      "iv_infusion": "Effect stops within 30-60 min of discontinuation"
    }
  }'::jsonb,
  adverse_reactions = '{
    "frequency_based": {
      "common": ["Hypoglycemia", "Injection site reactions", "Weight gain", "Lipohypertrophy"],
      "less_common": ["Hypokalemia", "Edema", "Allergic reactions"],
      "rare": ["Anaphylaxis", "Lipoatrophy"]
    },
    "body_system": {
      "metabolic": ["Hypoglycemia", "Hypokalemia", "Weight gain"],
      "dermatologic": ["Injection site reactions", "Lipohypertrophy", "Lipoatrophy"],
      "immunologic": ["Local allergic reactions", "Systemic allergic reactions"]
    }
  }'::jsonb,
  drug_interactions_info = '{
    "major": [
      {
        "drug": "Beta-blockers",
        "effect": "Mask hypoglycemia symptoms (except sweating)",
        "mechanism": "Block adrenergic response to low glucose",
        "management": "Monitor glucose more frequently; educate patient"
      },
      {
        "drug": "ACE inhibitors/ARBs",
        "effect": "Increased hypoglycemia risk",
        "mechanism": "Improved insulin sensitivity",
        "management": "Monitor glucose; may need insulin dose reduction"
      }
    ],
    "moderate": [
      {
        "drug": "Corticosteroids",
        "effect": "Decreased insulin effectiveness",
        "mechanism": "Gluconeogenesis stimulation",
        "management": "Increase insulin dose during steroid therapy"
      },
      {
        "drug": "Thiazide diuretics",
        "effect": "Hyperglycemia",
        "mechanism": "Impaired insulin secretion",
        "management": "Monitor glucose; adjust insulin as needed"
      }
    ],
    "reversal": [
      {
        "agent": "Dextrose 50%",
        "dose": "25-50 mL IV for severe hypoglycemia",
        "alternative": "Glucagon 1mg IM/SubQ if no IV access"
      }
    ]
  }'::jsonb
WHERE LOWER(generic_name) = 'insulin regular' OR LOWER(generic_name) = 'regular insulin' OR LOWER(generic_name) LIKE '%insulin%regular%';

-- Update Warfarin with comprehensive data  
UPDATE public.medications SET
  high_alert = true,
  double_check_required = false,
  dosing_info = '{
    "adult": {
      "initial": "2-5 mg daily (lower if elderly, malnourished, liver disease)",
      "maintenance": "2-10 mg daily based on INR",
      "genotype_guided": "Consider CYP2C9/VKORC1 testing for initial dosing"
    },
    "pediatric": {
      "initial": "0.1-0.2 mg/kg/day",
      "maintenance": "Highly variable; titrate to INR"
    },
    "geriatric": "Start low (2-3 mg daily); increased sensitivity"
  }'::jsonb,
  administration_info = '{
    "PO": {
      "timing": "Give at same time daily (usually evening)",
      "with_food": "May take with or without food; be consistent",
      "missed_dose": "Take as soon as remembered same day; do not double"
    },
    "IV": {
      "use": "Rarely used; for patients who cannot take PO",
      "reconstitution": "2.7 mL sterile water for 5mg vial",
      "rate": "Slow IV injection over 1-2 minutes"
    }
  }'::jsonb,
  safety_info = '{
    "contraindications": ["Active major bleeding", "Pregnancy (teratogenic)", "Severe hepatic disease", "Recent CNS/eye surgery", "Unsupervised patients"],
    "precautions": ["Falls risk", "Alcoholism", "Dietary vitamin K changes", "Drug interactions"],
    "black_box_warning": "May cause major or fatal bleeding. Regular INR monitoring required. Many drug and food interactions."
  }'::jsonb,
  monitoring = '{
    "parameters": ["INR/PT", "Signs of bleeding", "Hemoglobin/Hematocrit"],
    "frequency": {
      "initiation": "Daily until stable, then 2-3x weekly, then weekly, then monthly",
      "stable": "Every 4-12 weeks",
      "dose_change": "Within 3-7 days of change"
    },
    "therapeutic_goals": {
      "afib_vte": "INR 2.0-3.0",
      "mechanical_valve": "INR 2.5-3.5"
    }
  }'::jsonb,
  hold_parameters = '{
    "inr": "Hold if INR >4.0; notify provider if >3.5",
    "bleeding": "Hold for any active bleeding",
    "procedure": "Hold 5 days before surgery; consider bridging"
  }'::jsonb,
  clinical_pearls = ARRAY[
    'INR takes 3-5 days to reflect dose changes due to long half-life',
    'Vitamin K-rich foods (leafy greens) decrease warfarin effect - counsel consistency, not avoidance',
    'Antibiotics commonly increase INR by killing gut flora that produce vitamin K',
    'Reversal: Vitamin K (slow), FFP (moderate), 4-factor PCC (rapid), Kcentra for life-threatening bleeding',
    'CYP2C9 and VKORC1 polymorphisms affect dosing requirements'
  ],
  nursing_guide = '{
    "PO": {
      "appropriateness": {
        "when_to_use": "AFib, VTE treatment/prevention, mechanical valves, hypercoagulable states",
        "when_to_avoid": "Active bleeding, pregnancy, noncompliance risk"
      },
      "administration": {
        "timing": "Same time daily, typically evening",
        "verification": "Check INR result before giving if ordered"
      },
      "post_admin": {
        "monitoring": "Signs of bleeding, INR results, bruising",
        "documentation": "INR level, dose given, any bleeding"
      },
      "patient_teaching": "Consistent vitamin K intake; avoid NSAIDs/aspirin unless prescribed; report bleeding/bruising; wear medical ID"
    }
  }'::jsonb,
  pharmacokinetics = '{
    "absorption": {
      "bioavailability": ">90%",
      "onset": "24-72 hours (full effect 5-7 days)",
      "peak": "4 hours",
      "food_effect": "Minimal; vitamin K content matters"
    },
    "distribution": {
      "protein_binding": "99% (albumin)",
      "vd": "0.14 L/kg",
      "crosses_placenta": "Yes (teratogenic)"
    },
    "metabolism": {
      "primary": "Hepatic via CYP2C9, 2C19, 3A4",
      "active_metabolites": "None",
      "genetic_factors": "CYP2C9/VKORC1 polymorphisms significantly affect"
    },
    "excretion": {
      "route": "Renal (metabolites)",
      "unchanged": "Minimal"
    },
    "half_life": {
      "range": "20-60 hours",
      "average": "40 hours",
      "clinical_note": "Explains 3-5 day delay for INR changes"
    }
  }'::jsonb,
  adverse_reactions = '{
    "frequency_based": {
      "common": ["Bleeding", "Bruising", "Hematuria", "GI bleeding"],
      "less_common": ["Purple toe syndrome", "Skin necrosis", "Alopecia"],
      "rare": ["Calciphylaxis", "Cholesterol microembolization"]
    },
    "body_system": {
      "hematologic": ["Major bleeding", "Minor bleeding", "Anemia"],
      "dermatologic": ["Bruising", "Skin necrosis (early therapy)", "Purple toe syndrome", "Alopecia"],
      "gi": ["GI bleeding", "Nausea"],
      "genitourinary": ["Hematuria", "Menorrhagia"],
      "cns": ["Intracranial hemorrhage"]
    }
  }'::jsonb,
  drug_interactions_info = '{
    "major": [
      {
        "drug": "NSAIDs/Aspirin",
        "effect": "Significantly increased bleeding risk",
        "mechanism": "Platelet inhibition + GI irritation",
        "management": "Avoid unless specifically indicated; use PPI if needed"
      },
      {
        "drug": "Fluconazole/Metronidazole",
        "effect": "Markedly increased INR",
        "mechanism": "CYP2C9 inhibition",
        "management": "Reduce warfarin dose 25-50%; monitor INR closely"
      },
      {
        "drug": "Rifampin",
        "effect": "Markedly decreased INR",
        "mechanism": "CYP enzyme induction",
        "management": "May need 2-3x warfarin dose; frequent monitoring"
      }
    ],
    "moderate": [
      {
        "drug": "Antibiotics (broad-spectrum)",
        "effect": "Increased INR",
        "mechanism": "Reduced vitamin K production by gut flora",
        "management": "Monitor INR more frequently during antibiotic course"
      },
      {
        "drug": "Amiodarone",
        "effect": "Increased INR",
        "mechanism": "CYP2C9 inhibition",
        "management": "Reduce warfarin by 30-50%; lasts weeks after stopping amio"
      }
    ],
    "food_interactions": [
      {
        "item": "Vitamin K-rich foods (leafy greens, broccoli)",
        "effect": "Decreased INR",
        "management": "Maintain consistent intake; do not avoid entirely"
      },
      {
        "item": "Cranberry juice",
        "effect": "Increased INR",
        "management": "Limit intake; monitor INR if consumed regularly"
      }
    ],
    "reversal": [
      {
        "agent": "Vitamin K (phytonadione)",
        "dose": "1-10 mg PO/IV depending on INR and bleeding",
        "onset": "6-24 hours"
      },
      {
        "agent": "4-Factor PCC (Kcentra)",
        "dose": "25-50 units/kg based on INR",
        "onset": "Minutes; for life-threatening bleeding"
      }
    ]
  }'::jsonb
WHERE LOWER(generic_name) = 'warfarin';

-- Update Potassium Chloride with comprehensive data
UPDATE public.medications SET
  high_alert = true,
  double_check_required = true,
  dosing_info = '{
    "adult": {
      "oral_replacement": {
        "mild_deficit": "40-80 mEq/day in divided doses",
        "moderate_deficit": "80-120 mEq/day in divided doses",
        "max_single_dose": "40 mEq PO"
      },
      "iv_replacement": {
        "peripheral": "Max 10 mEq/hr; max concentration 40 mEq/L",
        "central": "Max 20 mEq/hr; max concentration 80 mEq/L",
        "severe_hypokalemia": "May give up to 40 mEq/hr with cardiac monitoring"
      }
    },
    "pediatric": {
      "replacement": "0.5-1 mEq/kg/dose; max 40 mEq/dose"
    }
  }'::jsonb,
  administration_info = '{
    "IV": {
      "methods": {
        "Peripheral_IV": {
          "max_concentration": "40 mEq/L",
          "max_rate": "10 mEq/hr",
          "dilution": "ALWAYS dilute before administration"
        },
        "Central_Line": {
          "max_concentration": "80 mEq/L",
          "max_rate": "20 mEq/hr (up to 40 mEq/hr with monitoring)"
        }
      },
      "compatibility": "NS, D5W, LR",
      "monitoring": "Cardiac monitoring for rates >10 mEq/hr",
      "phlebitis": "High risk - use large vein; consider central access for large doses"
    },
    "PO": {
      "forms": "Extended-release tablets, oral solution, powder packets",
      "administration": "Take with full glass of water and food to reduce GI upset",
      "extended_release": "Do not crush or chew; may cause GI ulceration"
    },
    "general": {
      "never_iv_push": "NEVER give undiluted IV push - causes cardiac arrest",
      "independent_double_check": "REQUIRED for all IV potassium"
    }
  }'::jsonb,
  safety_info = '{
    "contraindications": ["Hyperkalemia", "Severe renal impairment (use with caution)", "Addison disease", "Concurrent potassium-sparing diuretics (relative)"],
    "precautions": ["Cardiac disease", "Acid-base disturbances", "Digitalis toxicity", "Impaired GI motility"],
    "high_alert": "IV potassium can cause fatal cardiac arrhythmias if given too rapidly"
  }'::jsonb,
  monitoring = '{
    "parameters": ["Serum potassium", "Magnesium", "ECG", "Renal function"],
    "frequency": {
      "iv_replacement": "Repeat K+ 2-4 hours after infusion",
      "oral": "Daily to weekly depending on clinical situation"
    },
    "therapeutic_goals": {
      "general": "K+ 3.5-5.0 mEq/L",
      "cardiac": "K+ 4.0-5.0 mEq/L preferred"
    }
  }'::jsonb,
  hold_parameters = '{
    "potassium": "Hold if K+ >5.0 mEq/L",
    "ecg_changes": "Hold for peaked T waves, widened QRS",
    "renal": "Use extreme caution if oliguric or anuric"
  }'::jsonb,
  clinical_pearls = ARRAY[
    'NEVER give IV push - can cause fatal cardiac arrest',
    'Replace magnesium first - hypomagnesemia causes refractory hypokalemia',
    '10 mEq KCl raises serum K+ by approximately 0.1 mEq/L',
    'Acidosis shifts K+ out of cells (falsely elevated); alkalosis shifts K+ into cells',
    'Max peripheral infusion rate is 10 mEq/hr to prevent phlebitis and arrhythmias'
  ],
  nursing_guide = '{
    "IV": {
      "appropriateness": {
        "when_to_use": "K+ <3.0 mEq/L, symptomatic hypokalemia, NPO patient, arrhythmias",
        "when_to_avoid": "Hyperkalemia, severe renal failure without monitoring"
      },
      "preparation": {
        "verification": "Independent double-check REQUIRED",
        "dilution": "ALWAYS verify dilution - never give concentrated",
        "supplies": "Infusion pump mandatory; cardiac monitor for high rates"
      },
      "administration": {
        "rate": "Max 10 mEq/hr peripheral; 20 mEq/hr central",
        "monitoring": "ECG for rates >10 mEq/hr; check IV site frequently"
      },
      "post_admin": {
        "monitoring": "Repeat K+ 2-4 hours post-infusion; assess for phlebitis",
        "documentation": "Rate, total dose, IV site, repeat K+ level"
      },
      "patient_teaching": "Report burning at IV site immediately"
    },
    "PO": {
      "administration": {
        "technique": "Take with full glass of water and food",
        "extended_release": "Swallow whole; do not crush"
      },
      "patient_teaching": "Report nausea, vomiting, or abdominal pain"
    }
  }'::jsonb,
  pharmacokinetics = '{
    "absorption": {
      "po_bioavailability": "Well absorbed",
      "onset_iv": "Immediate",
      "onset_po": "30-60 minutes"
    },
    "distribution": {
      "primary": "Intracellular (98%)",
      "serum": "Only 2% of total body K+ is extracellular",
      "shifts": "pH, insulin, catecholamines affect distribution"
    },
    "excretion": {
      "primary": "Renal (90%)",
      "gi": "10%",
      "regulation": "Aldosterone promotes renal excretion"
    },
    "clinical_notes": {
      "deficit": "200-400 mEq total body deficit per 1 mEq/L drop in serum K+",
      "replacement": "Slow process; takes time to replenish intracellular stores"
    }
  }'::jsonb,
  adverse_reactions = '{
    "frequency_based": {
      "common": ["GI upset (PO)", "Phlebitis (IV)", "Nausea", "Diarrhea"],
      "less_common": ["Hyperkalemia", "ECG changes", "Arrhythmias"],
      "rare": ["Cardiac arrest (IV push)", "GI ulceration/perforation"]
    },
    "body_system": {
      "cardiovascular": ["Arrhythmias", "Cardiac arrest", "ECG changes (peaked T, widened QRS)"],
      "gi": ["Nausea", "Vomiting", "Diarrhea", "GI ulceration", "GI bleeding"],
      "local": ["Phlebitis", "Pain at injection site", "Tissue necrosis (extravasation)"]
    }
  }'::jsonb,
  drug_interactions_info = '{
    "major": [
      {
        "drug": "Potassium-sparing diuretics (spironolactone, eplerenone)",
        "effect": "Severe hyperkalemia",
        "mechanism": "Additive potassium retention",
        "management": "Avoid combination or monitor K+ very closely"
      },
      {
        "drug": "ACE inhibitors/ARBs",
        "effect": "Hyperkalemia risk",
        "mechanism": "Reduced aldosterone, decreased K+ excretion",
        "management": "Monitor K+ closely; use cautiously"
      }
    ],
    "moderate": [
      {
        "drug": "Digoxin",
        "effect": "Hypokalemia increases digoxin toxicity",
        "mechanism": "K+ and digoxin compete for Na-K-ATPase",
        "management": "Maintain K+ 4.0-5.0 in digitalized patients"
      },
      {
        "drug": "NSAIDs",
        "effect": "Hyperkalemia risk",
        "mechanism": "Reduced renal prostaglandins, decreased K+ excretion",
        "management": "Monitor K+ if used together"
      }
    ]
  }'::jsonb
WHERE LOWER(generic_name) = 'potassium chloride';
