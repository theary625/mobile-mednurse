
UPDATE public.medications SET nursing_guide = '{
  "iv": {
    "appropriateness": {
      "right_patient": "Confirm indication (serious gram-positive infections, MRSA). Check allergy history and previous vancomycin reactions.",
      "right_dose": "Weight-based dosing (15-20 mg/kg). Adjust for renal function. Check trough timing.",
      "right_route": "IV only for systemic infections. Oral only for C. diff colitis (not absorbed systemically).",
      "when_to_hold": "Hold if trough >20 mcg/mL. Hold for signs of Red Man Syndrome. Notify if creatinine rising."
    },
    "special_prep": {
      "reconstitution": "Reconstitute 500mg vial with 10mL sterile water. Further dilute in NS or D5W.",
      "final_concentration": "Final concentration should not exceed 5 mg/mL.",
      "stability": "Stable 14 days refrigerated, 7 days at room temperature after reconstitution.",
      "compatibility_notes": "Incompatible with many drugs - dedicated line preferred. Check compatibility before Y-site."
    },
    "administration": {
      "rate": "Infuse over at least 60 minutes (10 mg/min max). Extend to 90-120 min for doses >1g.",
      "line_requirements": "Central or large peripheral vein. Highly irritating - avoid small veins.",
      "monitoring_during": "Monitor for flushing, hypotension, rash (Red Man Syndrome). Slow rate if occurs.",
      "what_to_document": "Infusion start/stop times, site condition, any reactions, trough timing."
    },
    "post_admin": {
      "follow_up_labs": "Trough level before 4th or 5th dose. Renal function at baseline and q2-3 days.",
      "expected_response": "Clinical improvement in 48-72 hours. Cultures should clear.",
      "red_flags_to_report": "Hearing changes, tinnitus, decreasing urine output, severe rash.",
      "handoff_essentials": "Next trough due, current level, renal function trend, infusion tolerance."
    },
    "patient_teaching": "This antibiotic treats serious infections. Infusion takes at least 1 hour. Report flushing, itching, or rash immediately. Report ringing in ears or hearing changes."
  }
}'::jsonb WHERE LOWER(generic_name) = 'vancomycin';
