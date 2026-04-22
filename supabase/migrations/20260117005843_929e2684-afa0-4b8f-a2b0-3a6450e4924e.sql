
-- Update Digoxin with comprehensive data
UPDATE public.medications SET
  high_alert = true,
  double_check_required = true,
  dosing_info = '{
    "adult": {
      "afib_rate_control": {
        "loading": "0.25-0.5 mg IV, then 0.25 mg q6h x2 doses (max 1-1.5 mg/24h)",
        "maintenance": "0.125-0.25 mg daily"
      },
      "heart_failure": "0.125-0.25 mg daily (no loading typically)",
      "renal_adjustment": "Reduce dose or frequency with CrCl <50"
    },
    "pediatric": {
      "digitalizing": "Age and weight-based; consult references",
      "maintenance": "25-35% of total digitalizing dose divided BID"
    },
    "geriatric": "Start 0.0625-0.125 mg daily; increased sensitivity"
  }'::jsonb,
  administration_info = '{
    "IV": {
      "methods": {
        "IV_Push": {
          "dilution": "May give undiluted or dilute with D5W/NS",
          "rate": "Over at least 5 minutes",
          "caution": "Rapid administration may cause systemic vasoconstriction"
        }
      },
      "compatibility": "D5W, NS"
    },
    "PO": {
      "timing": "Same time daily; may take without regard to meals",
      "tablets_vs_elixir": "Bioavailability differs - do not interchange mg for mg"
    },
    "general": {
      "apical_pulse": "Always check apical pulse for full minute before giving",
      "hold_parameters": "Hold if HR <60 (adult) or <90-110 (pediatric per age)"
    }
  }'::jsonb,
  safety_info = '{
    "contraindications": ["Ventricular fibrillation", "Hypertrophic cardiomyopathy with outflow obstruction", "Wolff-Parkinson-White syndrome", "AV block (without pacemaker)"],
    "precautions": ["Hypokalemia (increases toxicity)", "Hypomagnesemia", "Hypercalcemia", "Hypothyroidism", "Renal impairment"],
    "narrow_therapeutic_index": "Therapeutic level 0.8-2.0 ng/mL; toxicity common at >2.0 ng/mL"
  }'::jsonb,
  monitoring = '{
    "parameters": ["Digoxin level", "Heart rate/rhythm", "Potassium", "Magnesium", "Creatinine", "ECG"],
    "frequency": {
      "level": "5-7 days after initiation or dose change (at steady state)",
      "electrolytes": "Baseline and regularly; hypoK+ increases toxicity"
    },
    "therapeutic_range": "0.8-2.0 ng/mL (0.5-0.9 for HF preferred)",
    "timing": "Draw level at least 6-8 hours after last dose"
  }'::jsonb,
  hold_parameters = '{
    "heart_rate": "Hold if HR <60 bpm (adult); notify provider",
    "toxicity_signs": "Hold for N/V, visual changes, arrhythmias",
    "potassium": "Verify K+ >4.0 before giving; hold if severely low"
  }'::jsonb,
  clinical_pearls = ARRAY[
    'Always check apical pulse for full minute before administration',
    'Hypokalemia dramatically increases digoxin toxicity risk',
    'Signs of toxicity: N/V, visual disturbances (yellow-green halos), arrhythmias',
    'Therapeutic range for HFrEF is lower (0.5-0.9 ng/mL) than historical range',
    'Digoxin Immune Fab (Digibind) is reversal agent for toxicity'
  ],
  nursing_guide = '{
    "IV": {
      "appropriateness": {
        "when_to_use": "Rapid rate control in AFib, acute HF exacerbation",
        "when_to_avoid": "Preexisting bradycardia, AV block, WPW, hypokalemia"
      },
      "preparation": {
        "supplies": "Cardiac monitor, recent K+ and Mg levels"
      },
      "administration": {
        "rate": "Over at least 5 minutes",
        "monitoring": "Continuous ECG during loading doses"
      },
      "post_admin": {
        "monitoring": "Heart rate, rhythm, signs of toxicity",
        "documentation": "Apical pulse, rhythm, digoxin level when drawn"
      }
    },
    "PO": {
      "administration": {
        "apical_pulse": "Check for full minute; hold if <60",
        "timing": "Same time daily"
      },
      "patient_teaching": "Learn to take pulse; report slow rate, nausea, visual changes"
    }
  }'::jsonb,
  pharmacokinetics = '{
    "absorption": {
      "bioavailability": "60-80% (tablets); 70-85% (elixir); 100% (IV)",
      "onset_po": "1-2 hours",
      "onset_iv": "5-30 minutes",
      "peak_po": "2-6 hours"
    },
    "distribution": {
      "vd": "5-7 L/kg (large due to tissue binding)",
      "protein_binding": "20-25%",
      "tissue_distribution": "Heart, kidney, skeletal muscle"
    },
    "metabolism": {
      "primary": "Minimal hepatic metabolism",
      "note": "Excreted largely unchanged"
    },
    "excretion": {
      "route": "Renal (60-80% unchanged)",
      "renal_impairment": "Significantly prolongs half-life"
    },
    "half_life": {
      "normal": "36-48 hours",
      "renal_impairment": "3.5-5 days",
      "clinical_note": "Takes 5-7 days to reach steady state"
    }
  }'::jsonb,
  adverse_reactions = '{
    "frequency_based": {
      "common": ["Nausea", "Vomiting", "Anorexia", "Fatigue"],
      "less_common": ["Visual disturbances", "Confusion", "Headache", "Arrhythmias"],
      "rare": ["Gynecomastia", "Thrombocytopenia"]
    },
    "body_system": {
      "cardiovascular": ["Bradycardia", "AV block", "Atrial tachycardia with block", "Ventricular arrhythmias"],
      "gi": ["Nausea", "Vomiting", "Anorexia", "Diarrhea"],
      "cns": ["Fatigue", "Weakness", "Confusion", "Delirium (elderly)"],
      "visual": ["Yellow-green halos", "Blurred vision", "Photophobia"]
    },
    "toxicity_triad": "GI symptoms + Visual changes + Arrhythmias"
  }'::jsonb,
  drug_interactions_info = '{
    "major": [
      {
        "drug": "Amiodarone",
        "effect": "Increases digoxin level 70-100%",
        "mechanism": "Inhibits P-glycoprotein",
        "management": "Reduce digoxin dose by 50% when starting amiodarone"
      },
      {
        "drug": "Verapamil/Diltiazem",
        "effect": "Increased digoxin levels + additive bradycardia",
        "mechanism": "P-glycoprotein inhibition",
        "management": "Reduce digoxin dose; monitor HR closely"
      },
      {
        "drug": "Quinidine",
        "effect": "Doubles digoxin level",
        "mechanism": "Reduced renal clearance + displacement",
        "management": "Reduce digoxin dose by 50%"
      }
    ],
    "moderate": [
      {
        "drug": "Diuretics (loop, thiazide)",
        "effect": "Increased toxicity risk",
        "mechanism": "Hypokalemia increases sensitivity",
        "management": "Monitor and maintain K+ >4.0 mEq/L"
      }
    ],
    "reversal": [
      {
        "agent": "Digoxin Immune Fab (Digibind/DigiFab)",
        "indication": "Life-threatening toxicity, K+ >5.5, ventricular arrhythmias",
        "dose": "Based on digoxin level or estimated body load"
      }
    ]
  }'::jsonb
WHERE LOWER(generic_name) = 'digoxin';

-- Update Morphine with comprehensive data
UPDATE public.medications SET
  high_alert = true,
  double_check_required = true,
  controlled_substance = true,
  dosing_info = '{
    "adult": {
      "acute_pain_iv": "2-4 mg q3-4h PRN; titrate to effect",
      "acute_pain_po": "15-30 mg q3-4h PRN (immediate release)",
      "chronic_pain": "Start low; convert to extended-release when stable",
      "pca": "Demand: 1-2 mg; Lockout: 6-10 min; consider basal 0.5-1 mg/hr"
    },
    "pediatric": {
      "iv": "0.05-0.1 mg/kg q3-4h PRN (max 15 mg/dose)",
      "po": "0.2-0.5 mg/kg q4-6h PRN"
    },
    "geriatric": "Start at 25-50% of adult dose; titrate carefully",
    "opioid_naive": "Use lower starting doses; reassess frequently"
  }'::jsonb,
  administration_info = '{
    "IV": {
      "methods": {
        "IV_Push": {
          "dilution": "Dilute to at least 1-2 mg/mL",
          "rate": "Over 4-5 minutes (2 mg/min max)",
          "monitoring": "Watch for respiratory depression"
        },
        "IV_Infusion": {
          "concentration": "1 mg/mL typical",
          "titration": "Per pain assessment and sedation level"
        },
        "PCA": {
          "concentration": "1 mg/mL standard",
          "programming": "Verify all settings with independent double-check"
        }
      },
      "compatibility": "NS, D5W"
    },
    "PO": {
      "immediate_release": "May crush tablets; give with or without food",
      "extended_release": "NEVER crush, chew, or split - can cause fatal overdose"
    },
    "SubQ": {
      "use": "When IV not available; slower onset",
      "max_volume": "2-3 mL per site"
    },
    "general": {
      "equianalgesic": "10 mg IV = 30 mg PO",
      "narcan_available": "Have naloxone readily available"
    }
  }'::jsonb,
  safety_info = '{
    "contraindications": ["Severe respiratory depression", "Acute/severe bronchial asthma (unmonitored)", "GI obstruction (especially paralytic ileus)", "Known hypersensitivity"],
    "precautions": ["COPD", "Sleep apnea", "Renal impairment (active metabolite accumulation)", "Hepatic impairment", "Elderly", "Concurrent CNS depressants"],
    "black_box_warning": "Risk of addiction, abuse, misuse, life-threatening respiratory depression. Concurrent benzodiazepines or CNS depressants increases risk. Extended-release formulations for opioid-tolerant patients only."
  }'::jsonb,
  monitoring = '{
    "parameters": ["Pain score", "Respiratory rate", "Sedation level", "Blood pressure", "O2 saturation"],
    "frequency": {
      "post_iv": "Q15-30min x 2, then q1h x 2, then q4h",
      "pca": "Per institutional protocol; typically q1-2h initially"
    },
    "hold_thresholds": {
      "respiratory_rate": "<10-12/min",
      "sedation": "Difficult to arouse"
    }
  }'::jsonb,
  hold_parameters = '{
    "respiratory_rate": "Hold if RR <10-12/min",
    "sedation": "Hold if oversedated (difficult to arouse)",
    "hypotension": "Hold if SBP <90 and symptomatic"
  }'::jsonb,
  clinical_pearls = ARRAY[
    'Active metabolite (M6G) accumulates in renal impairment - use with caution or choose alternative',
    'Histamine release can cause hypotension, flushing, pruritus',
    'Always have naloxone available; give 0.4-2 mg IV for reversal',
    'Extended-release formulations are NOT interchangeable mg for mg',
    'Use pain and sedation scales to guide dosing; not just patient request'
  ],
  nursing_guide = '{
    "IV": {
      "appropriateness": {
        "when_to_use": "Acute moderate-severe pain, post-operative, trauma, palliative",
        "when_to_avoid": "Severe respiratory compromise, unmonitored setting with risk factors"
      },
      "preparation": {
        "supplies": "Naloxone at bedside, pulse oximeter",
        "verification": "Independent double-check required"
      },
      "administration": {
        "rate": "Over 4-5 minutes for IV push",
        "assessment": "Pain score, sedation, RR before and after"
      },
      "post_admin": {
        "monitoring": "RR, sedation, BP, SpO2 q15-30min initially",
        "documentation": "Pain score, sedation scale, VS, dose given, response"
      },
      "patient_teaching": "Call for help if feel too drowsy; do not operate machinery"
    }
  }'::jsonb,
  pharmacokinetics = '{
    "absorption": {
      "bioavailability_po": "20-40% (significant first-pass)",
      "onset_iv": "5-10 minutes",
      "onset_po": "30-60 minutes",
      "peak_iv": "20 minutes",
      "peak_po": "1 hour"
    },
    "distribution": {
      "protein_binding": "30-35%",
      "vd": "3-4 L/kg",
      "crosses_bbb": "Yes (slowly)"
    },
    "metabolism": {
      "primary": "Hepatic glucuronidation",
      "metabolites": "M3G (inactive), M6G (active - 10x potency)",
      "renal_concern": "M6G accumulates in renal impairment"
    },
    "excretion": {
      "route": "Renal (85%)",
      "unchanged": "10%"
    },
    "half_life": {
      "normal": "2-4 hours",
      "m6g_half_life": "6-8 hours (longer in renal impairment)"
    },
    "duration": {
      "iv": "3-5 hours",
      "po_ir": "4-6 hours",
      "po_er": "8-24 hours depending on formulation"
    }
  }'::jsonb,
  adverse_reactions = '{
    "frequency_based": {
      "common": ["Constipation", "Nausea", "Vomiting", "Drowsiness", "Pruritus", "Dizziness"],
      "less_common": ["Respiratory depression", "Hypotension", "Urinary retention", "Confusion"],
      "rare": ["Anaphylaxis", "Seizures", "Serotonin syndrome (with SSRIs)"]
    },
    "body_system": {
      "cns": ["Sedation", "Drowsiness", "Confusion", "Euphoria", "Dysphoria", "Seizures (high doses)"],
      "respiratory": ["Respiratory depression", "Cough suppression"],
      "cardiovascular": ["Hypotension", "Bradycardia", "Histamine release"],
      "gi": ["Constipation", "Nausea", "Vomiting", "Delayed gastric emptying"],
      "genitourinary": ["Urinary retention"],
      "dermatologic": ["Pruritus", "Flushing"]
    }
  }'::jsonb,
  drug_interactions_info = '{
    "major": [
      {
        "drug": "Benzodiazepines",
        "effect": "Profound sedation, respiratory depression, death",
        "mechanism": "Synergistic CNS depression",
        "management": "Avoid if possible; if necessary, use lowest doses"
      },
      {
        "drug": "MAO inhibitors",
        "effect": "Severe reactions - serotonin syndrome or respiratory depression",
        "mechanism": "Impaired metabolism; serotonergic effects",
        "management": "Avoid combination; 14-day washout needed"
      }
    ],
    "moderate": [
      {
        "drug": "Other CNS depressants (alcohol, sedatives)",
        "effect": "Additive sedation and respiratory depression",
        "mechanism": "Synergistic effects",
        "management": "Reduce opioid dose; monitor closely"
      },
      {
        "drug": "Anticholinergics",
        "effect": "Severe constipation, urinary retention, ileus",
        "mechanism": "Additive effects",
        "management": "Aggressive bowel regimen; monitor"
      }
    ],
    "reversal": [
      {
        "agent": "Naloxone (Narcan)",
        "dose": "0.4-2 mg IV/IM/SubQ; may repeat q2-3min",
        "duration": "30-90 min (shorter than morphine - may need redosing)",
        "caution": "May precipitate withdrawal in opioid-dependent patients"
      }
    ]
  }'::jsonb
WHERE LOWER(generic_name) = 'morphine' OR LOWER(generic_name) = 'morphine sulfate';

-- Update Vancomycin with comprehensive data
UPDATE public.medications SET
  high_alert = false,
  double_check_required = false,
  dosing_info = '{
    "adult": {
      "standard": "15-20 mg/kg IV q8-12h (actual body weight)",
      "loading": "25-30 mg/kg IV x1 for serious infections",
      "obese": "Use actual body weight up to max 4.5g/day",
      "max_single_dose": "2000-2500 mg"
    },
    "pediatric": {
      "standard": "15 mg/kg q6h (serious infections)",
      "meningitis": "15 mg/kg q6h"
    },
    "renal_adjustment": "Significant adjustments needed; use AUC-based dosing when possible"
  }'::jsonb,
  administration_info = '{
    "IV": {
      "methods": {
        "Intermittent_Infusion": {
          "dilution": "Final concentration 5 mg/mL or less",
          "rate": "Infuse over at least 60 min (1g); 10-15 mg/min max",
          "red_man": "Slowing infusion rate prevents/treats"
        },
        "Continuous_Infusion": {
          "use": "Some institutions use for easier monitoring",
          "target": "Maintain plateau level 20-25 mcg/mL"
        }
      },
      "compatibility": "D5W, NS",
      "stability": "14 days refrigerated after reconstitution",
      "vesicant": "Yes - avoid extravasation"
    },
    "PO": {
      "indication": "C. diff colitis ONLY - not absorbed systemically",
      "dose": "125-500 mg QID x 10-14 days"
    }
  }'::jsonb,
  safety_info = '{
    "contraindications": ["Known hypersensitivity"],
    "precautions": ["Renal impairment", "Concurrent nephrotoxins", "Concurrent ototoxins", "Elderly"],
    "infusion_reaction": "Red man syndrome - histamine mediated; slow infusion rate"
  }'::jsonb,
  monitoring = '{
    "parameters": ["Trough level (or AUC)", "SCr/BUN", "CBC", "Signs of nephrotoxicity"],
    "frequency": {
      "trough": "Before 4th or 5th dose (steady state)",
      "auc_monitoring": "Per institutional protocol if available",
      "renal_function": "2-3 times weekly initially"
    },
    "therapeutic_goals": {
      "trough_based": "10-20 mcg/mL (15-20 for serious infections)",
      "auc_based": "AUC/MIC 400-600 (preferred method)"
    }
  }'::jsonb,
  hold_parameters = '{
    "level": "Hold if trough >20 mcg/mL until level decreases",
    "renal": "Hold for acute kidney injury; reassess dosing"
  }'::jsonb,
  clinical_pearls = ARRAY[
    'Red man syndrome is infusion-related (histamine), not true allergy - slow the rate',
    'AUC-based monitoring is now preferred over trough-only monitoring',
    'Oral vancomycin is for C. diff ONLY - not absorbed; does not treat systemic infections',
    'True vancomycin allergy is rare; most reactions are infusion-related',
    'Consider loading dose for serious infections to achieve therapeutic levels faster'
  ],
  nursing_guide = '{
    "IV": {
      "appropriateness": {
        "when_to_use": "MRSA infections, serious gram-positive infections, penicillin allergy",
        "when_to_avoid": "Known true allergy; oral route adequate for C. diff"
      },
      "preparation": {
        "reconstitution": "Add to at least 200mL fluid for 1g dose",
        "final_concentration": "≤5 mg/mL to reduce phlebitis"
      },
      "administration": {
        "rate": "Over at least 60 minutes for 1g; 10-15 mg/min max",
        "line": "Dedicated line preferred; flush before/after"
      },
      "post_admin": {
        "monitoring": "Watch for red man syndrome, nephrotoxicity",
        "levels": "Draw trough 30 min before 4th or 5th dose"
      },
      "patient_teaching": "Report flushing, rash, or itching during infusion"
    }
  }'::jsonb,
  pharmacokinetics = '{
    "absorption": {
      "po_bioavailability": "<5% (essentially not absorbed)",
      "note": "IV only for systemic infections"
    },
    "distribution": {
      "protein_binding": "30-55%",
      "vd": "0.4-1 L/kg",
      "tissue_penetration": "Variable; poor CSF penetration (inflamed meninges help)"
    },
    "metabolism": {
      "primary": "Not significantly metabolized"
    },
    "excretion": {
      "route": "Renal (90% unchanged)",
      "renal_impairment": "Major dose adjustments required"
    },
    "half_life": {
      "normal": "4-6 hours",
      "renal_impairment": "Up to 7-12 days in ESRD",
      "dialysis": "Poorly dialyzable by conventional HD; removed by high-flux"
    }
  }'::jsonb,
  adverse_reactions = '{
    "frequency_based": {
      "common": ["Red man syndrome", "Phlebitis", "Nephrotoxicity", "Nausea"],
      "less_common": ["Ototoxicity", "Neutropenia", "Thrombocytopenia"],
      "rare": ["DRESS syndrome", "Stevens-Johnson syndrome", "Linear IgA bullous dermatosis"]
    },
    "body_system": {
      "dermatologic": ["Red man syndrome", "Rash", "Pruritus", "Flushing"],
      "renal": ["Nephrotoxicity", "Increased creatinine", "AKI"],
      "otic": ["Ototoxicity", "Tinnitus", "Hearing loss"],
      "hematologic": ["Neutropenia", "Thrombocytopenia"],
      "local": ["Phlebitis", "Pain at infusion site"]
    }
  }'::jsonb,
  drug_interactions_info = '{
    "major": [
      {
        "drug": "Aminoglycosides (gentamicin, tobramycin)",
        "effect": "Increased nephrotoxicity and ototoxicity",
        "mechanism": "Additive toxic effects",
        "management": "Monitor renal function and drug levels closely"
      },
      {
        "drug": "Piperacillin/tazobactam",
        "effect": "Increased AKI risk (controversial)",
        "mechanism": "Unclear; synergistic nephrotoxicity suggested",
        "management": "Monitor renal function; some institutions avoid combination"
      }
    ],
    "moderate": [
      {
        "drug": "NSAIDs",
        "effect": "Increased nephrotoxicity risk",
        "mechanism": "Additive renal effects",
        "management": "Avoid if possible; monitor creatinine"
      },
      {
        "drug": "Loop diuretics",
        "effect": "Increased ototoxicity risk",
        "mechanism": "Additive ototoxic effects",
        "management": "Monitor hearing; use lowest effective diuretic doses"
      }
    ]
  }'::jsonb
WHERE LOWER(generic_name) = 'vancomycin';
