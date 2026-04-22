
-- Batch 3: Sedatives (Midazolam, Propofol, Lorazepam, Diazepam)
UPDATE public.medications SET nursing_guide = '{
  "iv_push": {
    "appropriateness": {
      "when_appropriate": "Procedural sedation, status epilepticus, acute agitation, pre-intubation",
      "when_to_question": "No resuscitation equipment, unmonitored setting, respiratory depression, elderly (reduce dose)",
      "better_alternatives": "PO/IM if procedure can wait and patient cooperative"
    },
    "special_prep": {
      "required_equipment": ["Continuous pulse ox", "Bag-valve mask ready", "Suction at bedside", "Flumazenil drawn up (reversal agent)", "Crash cart accessible"],
      "line_requirements": "Patent IV required",
      "special_handling": "Protect from light; controlled substance - verify count"
    },
    "administration": {
      "method": "Slow IV push, titrate to effect",
      "rate_guidance": "Give 0.5-1mg over 2 min, wait 2-3 min, repeat PRN. Elderly: reduce by 50%.",
      "flush_requirements": "NS flush compatible",
      "monitoring_during": "Continuous SpO2, respiratory rate, level of consciousness"
    },
    "post_admin": {
      "immediate_monitoring": "SpO2 continuously, RR q5min x 30min, then q15min, LOC",
      "expected_timeline": "Onset 1-5 min IV, peak 3-5 min, duration 15-80 min",
      "documentation_points": ["Indication", "Pre-dose vitals", "Total dose given", "Sedation level (Ramsay/RASS)", "Respiratory status"],
      "escalation_triggers": "SpO2 <90%, RR <10, unresponsive to stimuli, apnea"
    },
    "patient_teaching": "Will feel very sleepy and relaxed. May not remember the procedure. Do not drive for 24 hours."
  },
  "im": {
    "appropriateness": {
      "when_appropriate": "No IV access, acute agitation, pre-procedure when IV not needed",
      "when_to_question": "Same as IV - need monitoring capability",
      "better_alternatives": "IV if faster onset needed"
    },
    "administration": {
      "method": "Deep IM into large muscle mass",
      "rate_guidance": "2.5-5mg single dose",
      "monitoring_during": "Same monitoring as IV"
    },
    "post_admin": {
      "immediate_monitoring": "Same as IV - onset 15-30 min, peak 30-60 min",
      "escalation_triggers": "Same as IV"
    },
    "patient_teaching": "Injection may burn briefly. Effects take 15-30 minutes. Will feel very drowsy."
  }
}'::jsonb WHERE LOWER(generic_name) = 'midazolam';

UPDATE public.medications SET nursing_guide = '{
  "iv_infusion": {
    "appropriateness": {
      "when_appropriate": "ICU sedation, procedural sedation requiring amnesia, refractory status epilepticus",
      "when_to_question": "Egg/soy allergy, hemodynamic instability, no airway protection",
      "better_alternatives": "Dexmedetomidine if lighter sedation needed; ketamine if hypotensive"
    },
    "special_prep": {
      "required_equipment": ["Intubation/airway equipment", "Continuous monitoring (SpO2, BP, ECG)", "Vasopressors available", "Lipid emulsion (for toxicity)"],
      "line_requirements": "Dedicated line preferred; change tubing q12hr",
      "special_handling": "Strict aseptic technique - lipid emulsion supports bacterial growth. Discard after 12 hours."
    },
    "administration": {
      "method": "IV infusion via pump - never bolus in ICU sedation",
      "rate_guidance": "Induction: 1-2.5 mg/kg. Maintenance: 25-75 mcg/kg/min. Titrate by 5-10 mcg/kg/min.",
      "monitoring_during": "Continuous BP (often arterial line), SpO2, sedation score q1hr, triglycerides q48hr"
    },
    "post_admin": {
      "immediate_monitoring": "BP q5min during initiation, sedation score (RASS target), triglycerides if prolonged use",
      "expected_timeline": "Onset 30-60 sec, wears off 5-10 min after stopping",
      "documentation_points": ["Rate changes", "RASS/sedation scores", "BP response", "Caloric contribution", "Tubing change times"],
      "escalation_triggers": "SBP <90, hypertriglyceridemia >500, green urine (propofol infusion syndrome), unexplained acidosis"
    },
    "patient_teaching": "Patient typically intubated. Family: Explain sedation purpose, that patient will be unresponsive, and that we monitor closely."
  }
}'::jsonb WHERE LOWER(generic_name) = 'propofol';

UPDATE public.medications SET nursing_guide = '{
  "iv_push": {
    "appropriateness": {
      "when_appropriate": "Status epilepticus, acute severe anxiety, alcohol withdrawal, procedural sedation",
      "when_to_question": "Respiratory depression, no monitoring, CNS depressant use",
      "better_alternatives": "PO if not urgent; midazolam if faster onset needed"
    },
    "special_prep": {
      "required_equipment": ["Pulse oximeter", "Bag-valve mask", "Flumazenil available", "Cardiac monitor for high doses"],
      "line_requirements": "Patent IV - may dilute with equal volume NS",
      "special_handling": "Refrigerate; may precipitate if mixed with other drugs"
    },
    "administration": {
      "method": "Slow IV push, no faster than 2mg/min",
      "rate_guidance": "2-4mg over 2-5 min. Status epilepticus: up to 4mg, may repeat in 10-15 min.",
      "flush_requirements": "Flush before and after - incompatible with many drugs",
      "monitoring_during": "Respiratory rate, SpO2, level of consciousness"
    },
    "post_admin": {
      "immediate_monitoring": "RR q5min x 30min, SpO2 continuously, BP",
      "expected_timeline": "Onset 1-5 min, peak 15-30 min, duration 6-8 hours",
      "documentation_points": ["Indication", "Dose and time", "Respiratory status", "Seizure activity if applicable", "Level of sedation"],
      "escalation_triggers": "RR <10, SpO2 <92%, unresponsive, apnea"
    },
    "patient_teaching": "Will cause significant drowsiness lasting several hours. No driving for 24 hours. Avoid alcohol."
  },
  "oral": {
    "appropriateness": {
      "when_appropriate": "Anxiety, alcohol withdrawal protocol, pre-procedure anxiety",
      "when_to_question": "Severe respiratory disease, concurrent opioids, elderly (reduce dose)",
      "better_alternatives": "Non-benzo options for chronic anxiety if possible"
    },
    "administration": {
      "method": "Give with or without food",
      "timing_considerations": "Takes 30-60 min for onset"
    },
    "post_admin": {
      "immediate_monitoring": "Sedation level, fall risk, CIWA score if alcohol withdrawal",
      "documentation_points": ["CIWA score if applicable", "Sedation level", "Fall precautions"],
      "escalation_triggers": "Over-sedation, respiratory depression, paradoxical agitation"
    },
    "patient_teaching": "Causes drowsiness. Do not drive. Avoid alcohol. May impair memory."
  }
}'::jsonb WHERE LOWER(generic_name) = 'lorazepam';

UPDATE public.medications SET nursing_guide = '{
  "iv_push": {
    "appropriateness": {
      "when_appropriate": "Status epilepticus (second-line), severe alcohol withdrawal, muscle spasm",
      "when_to_question": "No monitoring, respiratory compromise, elderly",
      "better_alternatives": "Lorazepam preferred for status epilepticus; midazolam for procedural sedation"
    },
    "special_prep": {
      "required_equipment": ["Pulse oximeter", "Bag-valve mask", "Flumazenil available", "Crash cart accessible"],
      "line_requirements": "Large vein preferred - very irritating to veins",
      "special_handling": "Do not mix with other drugs - precipitates easily. Use within 6 hours of opening."
    },
    "administration": {
      "method": "Slow IV push directly into large vein, no faster than 5mg/min",
      "rate_guidance": "5-10mg over 2-3 min. May repeat q10-15min PRN. Max 30mg for status epilepticus.",
      "flush_requirements": "Flush with NS before and after",
      "monitoring_during": "Respiratory rate, SpO2, IV site (very irritating)"
    },
    "post_admin": {
      "immediate_monitoring": "RR q5min x 30min, SpO2, BP, IV site for phlebitis",
      "expected_timeline": "Onset 1-3 min, redistributes quickly (duration 15-30 min for single dose)",
      "documentation_points": ["Indication", "IV site condition", "Respiratory status", "Response to dose"],
      "escalation_triggers": "RR <10, apnea, severe phlebitis, paradoxical excitement"
    },
    "patient_teaching": "Will cause significant sedation. Injection may burn. Effects wear off faster than expected - may need redosing."
  },
  "oral": {
    "appropriateness": {
      "when_appropriate": "Muscle spasm, anxiety, alcohol withdrawal, seizure maintenance",
      "when_to_question": "Same precautions as other benzos",
      "better_alternatives": "Shorter-acting benzos may be preferred in elderly"
    },
    "administration": {
      "method": "Give with or without food",
      "timing_considerations": "Onset 30-60 min PO"
    },
    "post_admin": {
      "immediate_monitoring": "Sedation level, fall risk",
      "escalation_triggers": "Over-sedation, respiratory depression"
    },
    "patient_teaching": "Long-acting - effects last many hours. Do not drive. Avoid alcohol."
  }
}'::jsonb WHERE LOWER(generic_name) = 'diazepam';
