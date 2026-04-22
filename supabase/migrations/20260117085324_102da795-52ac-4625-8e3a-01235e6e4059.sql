
UPDATE public.medications SET nursing_guide = '{
  "iv": {
    "appropriateness": {
      "right_patient": "Confirm indication (community-acquired pneumonia, meningitis, gonorrhea). Check cephalosporin/penicillin allergy - cross-reactivity possible.",
      "right_dose": "1-2g daily for most infections. Meningitis: 2g q12h. Adjust for severe hepatic impairment.",
      "right_route": "IV for serious infections. IM acceptable for gonorrhea or outpatient treatment.",
      "when_to_hold": "Hold if severe allergic reaction. Use caution with calcium-containing IV solutions."
    },
    "special_prep": {
      "reconstitution": "Reconstitute 1g vial with 9.6mL diluent for 100 mg/mL concentration.",
      "final_concentration": "Further dilute in 50-100mL NS or D5W for IV infusion.",
      "stability": "Stable 24 hours at room temperature, 10 days refrigerated.",
      "compatibility_notes": "DO NOT mix with calcium-containing solutions. Precipitation can occur. Never mix in same line."
    },
    "administration": {
      "rate": "IV push over 2-4 minutes or infuse over 30 minutes. IM: deep gluteal injection.",
      "line_requirements": "Peripheral IV acceptable. Flush line before and after.",
      "monitoring_during": "Monitor for signs of allergic reaction. Check injection site.",
      "what_to_document": "Administration time, site, patient tolerance, any reactions."
    },
    "post_admin": {
      "follow_up_labs": "Renal and hepatic function if prolonged therapy. CBC for extended use.",
      "expected_response": "Clinical improvement in 48-72 hours. Fever should decrease.",
      "red_flags_to_report": "Rash, difficulty breathing, severe diarrhea (C. diff), jaundice.",
      "handoff_essentials": "Duration of therapy, next dose time, allergy status, clinical response."
    },
    "patient_teaching": "This antibiotic treats bacterial infections. Complete the full course even if feeling better. Report rash, hives, or difficulty breathing immediately. Report watery or bloody diarrhea."
  },
  "im": {
    "appropriateness": {
      "right_patient": "Confirm indication (gonorrhea, outpatient therapy). Check cephalosporin allergy.",
      "right_dose": "250-500mg single dose for gonorrhea. 1g daily for other infections.",
      "right_route": "IM appropriate for single-dose therapy or when IV not available.",
      "when_to_hold": "Hold for severe penicillin/cephalosporin allergy history."
    },
    "special_prep": {
      "reconstitution": "Reconstitute with 1% lidocaine (without epinephrine) to reduce injection pain.",
      "final_concentration": "250 mg/mL for IM injection.",
      "stability": "Use immediately after reconstitution with lidocaine.",
      "compatibility_notes": "Lidocaine helps reduce injection site pain significantly."
    },
    "administration": {
      "rate": "Slow, steady injection into large muscle mass (gluteal preferred).",
      "line_requirements": "Use 21-23 gauge needle, 1.5 inch for adults. Z-track technique.",
      "monitoring_during": "Monitor for vasovagal reaction. Have patient lie down.",
      "what_to_document": "Injection site, patient tolerance, lot number, any reactions."
    },
    "post_admin": {
      "follow_up_labs": "Test of cure for gonorrhea at appropriate interval.",
      "expected_response": "Symptom improvement within 24-48 hours.",
      "red_flags_to_report": "Severe injection site reaction, allergic symptoms, persistent symptoms.",
      "handoff_essentials": "Single dose vs multi-dose regimen, follow-up testing needed."
    },
    "patient_teaching": "Injection site may be sore for 1-2 days. Apply ice if needed. Report spreading redness or increasing pain at site. Complete any additional oral antibiotics as prescribed."
  }
}'::jsonb WHERE LOWER(generic_name) = 'ceftriaxone';

UPDATE public.medications SET nursing_guide = '{
  "iv": {
    "appropriateness": {
      "right_patient": "Confirm indication (serious gram-negative, polymicrobial infections). Check penicillin allergy - cross-reactivity possible.",
      "right_dose": "3.375g q6h or 4.5g q6h based on severity. Adjust for renal function.",
      "right_route": "IV only. Extended infusion (over 4 hours) improves outcomes for serious infections.",
      "when_to_hold": "Hold if severe penicillin allergy with anaphylaxis history. Notify for rising creatinine."
    },
    "special_prep": {
      "reconstitution": "Reconstitute vial with appropriate diluent per package insert.",
      "final_concentration": "Further dilute in 50-150mL NS or D5W. Extended infusion uses 100mL.",
      "stability": "Stable 24 hours at room temperature, 48 hours refrigerated.",
      "compatibility_notes": "Incompatible with aminoglycosides - do not mix. Separate infusion times."
    },
    "administration": {
      "rate": "Standard: infuse over 30 minutes. Extended infusion: over 4 hours.",
      "line_requirements": "Peripheral IV acceptable. Dedicated line preferred if on aminoglycosides.",
      "monitoring_during": "Monitor for allergic reactions. Check IV site for irritation.",
      "what_to_document": "Start/stop times, infusion duration, site condition, tolerance."
    },
    "post_admin": {
      "follow_up_labs": "Renal function, CBC, LFTs for prolonged therapy. Culture results.",
      "expected_response": "Clinical improvement in 48-72 hours. Fever trending down.",
      "red_flags_to_report": "Rash, fever, severe diarrhea, bleeding/bruising, seizures.",
      "handoff_essentials": "Extended vs standard infusion, renal function, next dose timing."
    },
    "patient_teaching": "This treats serious bacterial infections. Each dose takes 30 minutes to 4 hours depending on protocol. Report rash, itching, or diarrhea. Report any unusual bleeding."
  }
}'::jsonb WHERE LOWER(generic_name) = 'piperacillin-tazobactam';

UPDATE public.medications SET nursing_guide = '{
  "iv": {
    "appropriateness": {
      "right_patient": "Confirm indication (serious infections, MDR organisms, meningitis). Reserve for resistant organisms.",
      "right_dose": "1g q8h for most infections. 2g q8h for meningitis/CNS infections. Adjust for renal function.",
      "right_route": "IV only. Extended infusion (over 3 hours) may improve outcomes.",
      "when_to_hold": "Hold if severe carbapenem allergy. Caution with seizure history."
    },
    "special_prep": {
      "reconstitution": "Reconstitute 1g vial with 20mL sterile water or NS.",
      "final_concentration": "Further dilute in 50-250mL NS or D5W for infusion.",
      "stability": "Stable 4 hours at room temperature, 24 hours refrigerated.",
      "compatibility_notes": "Check compatibility before Y-site administration. Protect from light not required."
    },
    "administration": {
      "rate": "Standard: infuse over 15-30 minutes. Extended infusion: over 3 hours.",
      "line_requirements": "Peripheral IV acceptable. Central line for extended infusion convenience.",
      "monitoring_during": "Monitor for CNS effects (confusion, seizures) especially in renal impairment.",
      "what_to_document": "Infusion time, neuro status, any reactions, site condition."
    },
    "post_admin": {
      "follow_up_labs": "Renal function (dose adjust if declining). CBC, LFTs for prolonged therapy.",
      "expected_response": "Clinical improvement in 48-72 hours. Culture clearance.",
      "red_flags_to_report": "Seizures, confusion, severe diarrhea, rash, new fever.",
      "handoff_essentials": "Seizure precautions if indicated, renal function, culture results, duration planned."
    },
    "patient_teaching": "This is a strong antibiotic for serious infections. Report any confusion, jerking movements, or seizures immediately. Report severe diarrhea or rash."
  }
}'::jsonb WHERE LOWER(generic_name) = 'meropenem';
