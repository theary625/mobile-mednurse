
-- Batch 2: Electrolytes (Potassium Chloride, Magnesium Sulfate)
UPDATE public.medications SET nursing_guide = '{
  "iv_infusion": {
    "appropriateness": {
      "when_appropriate": "K+ <3.0 with symptoms, inability to take PO, cardiac arrhythmias from hypokalemia",
      "when_to_question": "Renal impairment (CrCl <30), K+ >5.0, no recent K+ level",
      "better_alternatives": "Oral replacement if patient can take PO and K+ >3.0"
    },
    "special_prep": {
      "required_equipment": ["Cardiac monitor REQUIRED", "IV pump REQUIRED - never gravity", "Recent K+ level (<4 hours old)", "Mg+ level"],
      "line_requirements": "Central line for >10 mEq/hr; peripheral max 10 mEq/hr",
      "special_handling": "Always verify concentration - HIGH ALERT MED. Never give IV push.",
      "stability_notes": "Premixed bags preferred to reduce errors"
    },
    "administration": {
      "method": "IV infusion via pump only - NEVER IV PUSH",
      "rate_guidance": "Peripheral: max 10 mEq/hr. Central: max 20 mEq/hr. Total max 200 mEq/day.",
      "flush_requirements": "NS compatible",
      "monitoring_during": "Continuous cardiac monitoring, pain at IV site (irritant)"
    },
    "post_admin": {
      "immediate_monitoring": "Repeat K+ 2-4 hours after infusion, telemetry for peaked T-waves",
      "expected_timeline": "K+ level rises approximately 0.1 mEq/L per 10 mEq given",
      "documentation_points": ["Pre-infusion K+ level", "Infusion rate", "Cardiac rhythm", "Site assessment", "Post-infusion K+"],
      "escalation_triggers": "Peaked T-waves, widened QRS, burning at IV site, K+ >5.5"
    },
    "patient_teaching": "Infusion may burn slightly. Report any chest pain, muscle weakness, or numbness/tingling immediately."
  },
  "oral": {
    "appropriateness": {
      "when_appropriate": "Mild hypokalemia (K+ 3.0-3.5), chronic replacement, prevention",
      "when_to_question": "GI upset history, severe hypokalemia <3.0",
      "better_alternatives": "IV if unable to tolerate PO or K+ <3.0"
    },
    "special_prep": {
      "special_handling": "Verify formulation - ER tabs should not be crushed"
    },
    "administration": {
      "method": "Give with full glass of water and food to reduce GI upset",
      "timing_considerations": "Divide large doses; give with meals"
    },
    "post_admin": {
      "immediate_monitoring": "GI tolerance, repeat K+ per protocol",
      "documentation_points": ["Formulation given", "GI tolerance", "K+ levels"],
      "escalation_triggers": "Severe GI upset, vomiting, inability to keep down"
    },
    "patient_teaching": "Take with food and full glass of water. Do not crush extended-release tablets. Report severe stomach upset."
  }
}'::jsonb WHERE LOWER(generic_name) = 'potassium chloride';

UPDATE public.medications SET nursing_guide = '{
  "iv_infusion": {
    "appropriateness": {
      "when_appropriate": "Mg+ <1.5, seizure prophylaxis in eclampsia, torsades de pointes, severe hypomagnesemia",
      "when_to_question": "Renal impairment, heart block, myasthenia gravis",
      "better_alternatives": "Oral replacement if Mg+ >1.2 and asymptomatic"
    },
    "special_prep": {
      "required_equipment": ["Cardiac monitor", "IV pump", "Recent Mg+ level", "Calcium gluconate at bedside (antidote)"],
      "line_requirements": "Central preferred for high concentrations; peripheral OK for dilute solutions",
      "special_handling": "Calcium gluconate must be immediately available for toxicity"
    },
    "administration": {
      "method": "IV infusion via pump - rate varies by indication",
      "rate_guidance": "Replacement: 1-2g over 1 hour. Eclampsia: 4-6g loading over 20 min. Torsades: 1-2g over 5-20 min.",
      "flush_requirements": "D5W or NS compatible",
      "monitoring_during": "Continuous cardiac monitoring, respiratory rate, DTRs, BP"
    },
    "post_admin": {
      "immediate_monitoring": "Respiratory rate q15min, DTRs q1hr, BP, repeat Mg+ in 4-6 hours",
      "expected_timeline": "Onset immediate IV, levels normalize over hours",
      "documentation_points": ["Pre-dose Mg+ level", "Respiratory rate", "Patellar reflexes", "Urine output", "BP"],
      "escalation_triggers": "Resp rate <12, absent reflexes, hypotension, flushing, bradycardia"
    },
    "patient_teaching": "May feel warm and flushed - this is normal. Report any difficulty breathing, excessive drowsiness, or muscle weakness."
  },
  "oral": {
    "appropriateness": {
      "when_appropriate": "Mild deficiency, chronic replacement, prevention",
      "when_to_question": "Renal impairment, severe deficiency requiring rapid replacement",
      "better_alternatives": "IV if Mg+ <1.5 or symptomatic"
    },
    "administration": {
      "method": "Give with food to reduce GI upset",
      "timing_considerations": "May cause diarrhea - start low dose"
    },
    "post_admin": {
      "immediate_monitoring": "GI tolerance, repeat Mg+ per protocol",
      "escalation_triggers": "Severe diarrhea, inability to keep down"
    },
    "patient_teaching": "May cause loose stools. Take with food. Spread doses throughout day if needed."
  }
}'::jsonb WHERE LOWER(generic_name) = 'magnesium sulfate';
