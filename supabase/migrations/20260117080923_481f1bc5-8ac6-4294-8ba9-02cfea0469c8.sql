
-- Update nursing_guide for anticoagulants with correct structure matching NursingGuideRouteContent interface

-- 1. Dalteparin - SubQ route
UPDATE public.medications SET
  nursing_guide = '{
    "SubQ": {
      "appropriateness": {
        "hold_if": [
          "Platelets < 100,000/mcL",
          "Active major bleeding",
          "Scheduled invasive procedure within 12-24 hours",
          "Signs of HIT (platelet drop >50% + thrombosis)"
        ],
        "required_labs": ["Platelet count", "Creatinine/CrCl", "Anti-Xa level (if indicated)"],
        "allergy_alerts": ["Pork allergy (derived from porcine intestinal mucosa)", "Prior HIT"]
      },
      "special_prep": {
        "has_special_requirements": true,
        "notes": "Do NOT expel air bubble from prefilled syringe - ensures complete dose delivery",
        "specific_syringe": "Use prefilled syringe; do not transfer to another syringe"
      },
      "administration": {
        "rate": "Inject slowly over 5-10 seconds",
        "line_type": "SubQ injection only - NEVER IM or IV",
        "timing": "Same time(s) daily; once or twice daily per order",
        "special_notes": "Pinch skin fold throughout injection; insert at 45-90°; do not aspirate; do not rub after"
      },
      "post_admin": {
        "reassess_timing": "Monitor injection site immediately; bleeding assessment q shift",
        "expected_response": "No injection site hematoma; therapeutic anticoagulation without bleeding",
        "watch_for": ["Injection site bruising/hematoma", "Signs of bleeding (gums, urine, stool)", "Platelet drop suggesting HIT"],
        "document": ["Injection site", "Platelet trend", "Bleeding assessment", "Patient tolerance"]
      },
      "patient_teaching": {
        "tell_patient": "This injection prevents blood clots. You may have some bruising at the injection site which is normal.",
        "what_to_expect": "Small bruise at injection site is common; should not be painful",
        "report_immediately": ["Unusual bleeding or bruising", "Blood in urine or stool", "Nosebleeds that won''t stop", "Leg pain or swelling (possible clot)"]
      }
    }
  }'::jsonb
WHERE LOWER(generic_name) = 'dalteparin';

-- 2. Edoxaban - PO route
UPDATE public.medications SET
  nursing_guide = '{
    "PO": {
      "appropriateness": {
        "hold_if": [
          "Active bleeding",
          "CrCl < 15 mL/min",
          "CrCl > 95 mL/min (for AFib indication - reduced efficacy)",
          "Scheduled surgery or invasive procedure"
        ],
        "required_labs": ["CrCl (Cockcroft-Gault)", "CBC", "LFTs"],
        "allergy_alerts": ["Prior hypersensitivity to edoxaban"]
      },
      "special_prep": {
        "has_special_requirements": false,
        "notes": "Can crush and mix with applesauce for patients with swallowing difficulty"
      },
      "administration": {
        "timing": "Once daily at same time each day",
        "with_food": "Can take with or without food",
        "special_notes": "For VTE treatment: must have completed 5-10 days of parenteral anticoagulation first"
      },
      "post_admin": {
        "reassess_timing": "Daily bleeding assessment; periodic renal function checks",
        "expected_response": "Stroke/VTE prevention without bleeding complications",
        "watch_for": ["Signs of bleeding", "Dark stools or blood in urine", "Unusual bruising", "Neurological changes if post-neuraxial procedure"],
        "document": ["Time administered", "Bleeding assessment", "Renal function trend"]
      },
      "patient_teaching": {
        "tell_patient": "This medication prevents blood clots and strokes. Take it at the same time every day and don''t stop without talking to your doctor.",
        "what_to_expect": "No noticeable effects; works by thinning your blood",
        "report_immediately": ["Unusual bleeding or bruising", "Blood in urine, stool, or vomit", "Severe headache", "Dizziness or weakness"]
      }
    }
  }'::jsonb
WHERE LOWER(generic_name) = 'edoxaban';

-- 3. Argatroban - IV route
UPDATE public.medications SET
  nursing_guide = '{
    "IV_Infusion": {
      "appropriateness": {
        "hold_if": [
          "Active major bleeding",
          "aPTT > 100 seconds",
          "Severe thrombocytopenia unrelated to HIT"
        ],
        "required_labs": ["aPTT (baseline)", "CBC with platelets", "LFTs", "INR (for warfarin transition)"],
        "allergy_alerts": ["Prior hypersensitivity to argatroban"]
      },
      "special_prep": {
        "has_special_requirements": true,
        "notes": "Dilute in NS, D5W, or LR to 1 mg/mL concentration",
        "dilution": "Mix 250 mg in 250 mL diluent = 1 mg/mL"
      },
      "administration": {
        "rate": "Initial: 2 mcg/kg/min (0.5 mcg/kg/min if hepatic impairment)",
        "max_rate": "10 mcg/kg/min",
        "why_rate_matters": "Titrate to aPTT 1.5-3x baseline (max 100 sec); overdose causes bleeding",
        "line_type": "Dedicated IV line via infusion pump - no gravity drip",
        "special_notes": "No bolus for HIT treatment (bolus only for PCI indication)"
      },
      "post_admin": {
        "reassess_timing": "aPTT 2 hours after initiation or any rate change; then q4h until stable",
        "expected_response": "aPTT 1.5-3x baseline; platelet recovery begins within 1-3 days if HIT",
        "watch_for": ["aPTT above/below target", "Bleeding at any site", "Platelet count not recovering", "New thrombosis"],
        "document": ["Infusion rate", "aPTT values with time", "Platelet trend", "Bleeding assessment", "Rate adjustments"]
      },
      "patient_teaching": {
        "tell_patient": "This IV medication treats your blood clotting condition. We will monitor your blood closely with frequent lab draws.",
        "what_to_expect": "Frequent blood draws to check medication levels; IV will run continuously",
        "report_immediately": ["Any bleeding or bruising", "Headache or dizziness", "Chest pain", "Numbness or weakness"]
      }
    }
  }'::jsonb
WHERE LOWER(generic_name) = 'argatroban';

-- 4. Bivalirudin - IV route
UPDATE public.medications SET
  nursing_guide = '{
    "IV_Infusion": {
      "appropriateness": {
        "hold_if": [
          "Active major bleeding",
          "ACT persistently > 500 seconds",
          "Severe hypotension suggesting hemorrhage"
        ],
        "required_labs": ["ACT (during PCI)", "Weight for dosing", "Creatinine/CrCl"],
        "allergy_alerts": ["Prior hypersensitivity to bivalirudin"]
      },
      "special_prep": {
        "has_special_requirements": true,
        "notes": "Reconstitute 250 mg vial with 5 mL sterile water, then dilute to 5 mg/mL with D5W or NS",
        "reconstitution": "250 mg + 5 mL sterile water → further dilute to 50 mL total"
      },
      "administration": {
        "rate": "Bolus: 0.75 mg/kg IV push; Infusion: 1.75 mg/kg/hr",
        "max_rate": "Adjust based on ACT; additional 0.3 mg/kg bolus if ACT < 300 sec",
        "why_rate_matters": "Target ACT 300-450 seconds during PCI",
        "line_type": "Dedicated IV line via infusion pump",
        "flush": "Flush line before and after bolus",
        "special_notes": "Prepare bolus and infusion simultaneously; start infusion immediately after bolus"
      },
      "post_admin": {
        "reassess_timing": "ACT 5 min after bolus; q30 min during procedure; access site q15 min post-sheath removal",
        "expected_response": "ACT 300-450 sec during PCI; hemostasis at access site post-procedure",
        "watch_for": ["ACT out of range", "Access site bleeding/hematoma", "Chest pain (stent thrombosis)", "Retroperitoneal bleeding signs"],
        "document": ["ACT values", "Bolus time and dose", "Infusion rate", "Sheath removal time", "Access site hemostasis"]
      },
      "patient_teaching": {
        "tell_patient": "This medication prevents blood clots during your heart procedure. Keep your leg straight and still after the procedure.",
        "what_to_expect": "Must lie flat after procedure; pressure will be held at access site",
        "report_immediately": ["Pain or warmth at groin/wrist", "Feeling wetness (bleeding)", "Chest pain", "Dizziness"]
      }
    }
  }'::jsonb
WHERE LOWER(generic_name) = 'bivalirudin';

-- 5. Betrixaban - PO route
UPDATE public.medications SET
  nursing_guide = '{
    "PO": {
      "appropriateness": {
        "hold_if": [
          "Active bleeding",
          "Scheduled invasive procedure (hold 72+ hours due to long half-life)",
          "CrCl < 15 mL/min"
        ],
        "required_labs": ["CrCl", "CBC", "LFTs"],
        "allergy_alerts": ["Prior severe hypersensitivity to betrixaban"]
      },
      "special_prep": {
        "has_special_requirements": true,
        "notes": "MUST take with food - required for adequate absorption"
      },
      "administration": {
        "timing": "Once daily at same time",
        "with_food": "REQUIRED - take with food for proper absorption",
        "special_notes": "Day 1: Loading dose 160 mg (or 80 mg if dose reduced); Day 2+: 80 mg daily (or 40 mg if reduced)"
      },
      "post_admin": {
        "reassess_timing": "Daily bleeding assessment; mobility evaluation for VTE prophylaxis effectiveness",
        "expected_response": "VTE prevention without bleeding; patient progressing with mobility",
        "watch_for": ["Signs of bleeding", "Neurological symptoms if recent neuraxial procedure", "DVT/PE symptoms despite prophylaxis"],
        "document": ["Dose and day of therapy", "Taken with food confirmed", "Bleeding assessment", "Mobility status"]
      },
      "patient_teaching": {
        "tell_patient": "This medication prevents blood clots during your hospital stay and after. You MUST take it with food and complete the full 35-42 day course.",
        "what_to_expect": "Will continue taking after discharge; no noticeable effects",
        "report_immediately": ["Unusual bleeding or bruising", "Blood in urine or stool", "Leg pain or swelling", "Shortness of breath"]
      }
    }
  }'::jsonb
WHERE LOWER(generic_name) = 'betrixaban';

-- 6. 4-Factor PCC (Kcentra) - IV route
UPDATE public.medications SET
  nursing_guide = '{
    "IV_Infusion": {
      "appropriateness": {
        "hold_if": [
          "Active DIC (disseminated intravascular coagulation)",
          "History of HIT (product contains heparin)",
          "Known anaphylaxis to product or plasma products"
        ],
        "required_labs": ["INR (STAT - required for dosing)", "CBC", "Fibrinogen (if DIC suspected)"],
        "allergy_alerts": ["Heparin allergy - product contains heparin", "Prior anaphylaxis to plasma products"]
      },
      "special_prep": {
        "has_special_requirements": true,
        "notes": "Reconstitute with provided diluent; gently swirl - do not shake; use within 4 hours",
        "filter_needle": true,
        "reconstitution": "Use provided diluent; final concentration 25 units/mL"
      },
      "administration": {
        "rate": "Initial: 0.12 mL/kg/min (approximately 3 units/kg/min)",
        "max_rate": "8.4 mL/min",
        "why_rate_matters": "Rapid infusion may cause infusion reactions; slow if hypotension or tachycardia occurs",
        "line_type": "Dedicated IV line",
        "flush": "Flush line before and after with NS",
        "special_notes": "Give Vitamin K 10 mg IV concurrently for sustained reversal; typical infusion completes in 10-15 minutes"
      },
      "post_admin": {
        "reassess_timing": "INR 30 minutes post-infusion; vitals q5 min during and 20 min after",
        "expected_response": "INR correction (target < 1.5); bleeding controlled",
        "watch_for": ["INR not corrected", "Continued bleeding despite INR correction", "Thrombotic events (DVT, PE, stroke, MI)", "Infusion reactions"],
        "document": ["Pre-treatment INR", "Dose given", "Infusion rate and duration", "Post-infusion INR", "Vitamin K given", "Bleeding status", "Thrombotic event monitoring"]
      },
      "patient_teaching": {
        "tell_patient": "This medication is reversing your blood thinner to stop bleeding. We will monitor you closely for both bleeding and clotting.",
        "what_to_expect": "Quick infusion (10-15 minutes); blood draws after to check effectiveness",
        "report_immediately": ["Continued bleeding", "Chest pain", "Shortness of breath", "Leg pain or swelling", "Difficulty speaking or weakness"]
      }
    }
  }'::jsonb
WHERE LOWER(generic_name) = '4-factor pcc' OR LOWER(generic_name) LIKE '%prothrombin complex%' OR LOWER(generic_name) LIKE '%kcentra%';
