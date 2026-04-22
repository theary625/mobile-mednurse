
-- Batch 1: Cardiac medications (Amiodarone, Digoxin, Adenosine)
UPDATE public.medications SET nursing_guide = '{
  "iv_push": {
    "appropriateness": {
      "when_appropriate": "Loading dose or breakthrough arrhythmias when oral not feasible",
      "when_to_question": "No cardiac monitoring, uncontrolled hypotension, bradycardia <50",
      "better_alternatives": "Oral amiodarone if stable and able to take PO"
    },
    "special_prep": {
      "required_equipment": ["Cardiac monitor with recording", "Defibrillator at bedside", "BP cuff for continuous monitoring"],
      "line_requirements": "Central line preferred for infusion; peripheral OK for bolus if diluted",
      "special_handling": "Photosensitive - protect from light during infusion",
      "stability_notes": "Stable 24 hours at room temperature in D5W"
    },
    "administration": {
      "method": "Slow IV push over 10 minutes minimum for bolus",
      "rate_guidance": "150mg over 10 min, then 1mg/min x 6hr, then 0.5mg/min",
      "flush_requirements": "D5W only - incompatible with NS",
      "monitoring_during": "Continuous ECG, BP q5min during loading"
    },
    "post_admin": {
      "immediate_monitoring": "HR, BP, rhythm strip q15min x 1hr",
      "expected_timeline": "Onset 2-3 min IV, peak effect may take hours",
      "documentation_points": ["Pre/post rhythm strip", "BP response", "QTc if available", "Any ectopy noted"],
      "escalation_triggers": "HR <50, SBP <90, QTc >500ms, new bradyarrhythmia"
    },
    "patient_teaching": "Will feel warm, may have nausea. Report chest pain, shortness of breath, or vision changes immediately."
  },
  "oral": {
    "appropriateness": {
      "when_appropriate": "Maintenance therapy after loading, stable patients",
      "when_to_question": "Severe liver impairment, interacting medications (warfarin!)",
      "better_alternatives": "Consider dronedarone if lower toxicity profile needed"
    },
    "special_prep": {
      "required_equipment": ["None specific"],
      "special_handling": "May take with or without food consistently"
    },
    "administration": {
      "method": "Give with full glass of water",
      "rate_guidance": "N/A - oral",
      "timing_considerations": "Same time daily for consistent levels"
    },
    "post_admin": {
      "immediate_monitoring": "Weekly LFTs, TFTs q3 months, chest X-ray annually",
      "documentation_points": ["Lung sounds", "Thyroid symptoms", "Visual changes", "Skin photosensitivity"],
      "escalation_triggers": "New dyspnea, jaundice, bradycardia, tremor"
    },
    "patient_teaching": "Use strong sunscreen - extreme sun sensitivity. Report any breathing changes, tremor, or skin discoloration."
  }
}'::jsonb WHERE LOWER(generic_name) = 'amiodarone';

UPDATE public.medications SET nursing_guide = '{
  "iv_push": {
    "appropriateness": {
      "when_appropriate": "Rapid digitalization needed, NPO status, GI absorption concerns",
      "when_to_question": "K+ <3.5, HR <60, recent dose within 6 hours, AV block",
      "better_alternatives": "PO digoxin if GI function intact"
    },
    "special_prep": {
      "required_equipment": ["Cardiac monitor", "Recent K+/Mg+ levels (within 4 hours)", "Digoxin level if on maintenance"],
      "line_requirements": "Any patent IV line",
      "special_handling": "Clear, colorless solution - do not use if discolored"
    },
    "administration": {
      "method": "Give IV push over at least 5 minutes",
      "rate_guidance": "No faster than 5 minutes to prevent arrhythmias",
      "flush_requirements": "NS or D5W flush",
      "monitoring_during": "Continuous cardiac monitoring, watch for ectopy"
    },
    "post_admin": {
      "immediate_monitoring": "HR q15min x 1 hour, rhythm strip before and after",
      "expected_timeline": "Onset 5-30 min, peak 1-5 hours",
      "documentation_points": ["Pre-dose HR and rhythm", "K+ level", "Dig level if available", "Time of last dose"],
      "escalation_triggers": "HR <50, new ectopy, N/V (toxicity signs), visual changes"
    },
    "patient_teaching": "Count pulse before each dose. Report nausea, vomiting, yellow-green vision changes, or irregular heartbeat."
  },
  "oral": {
    "appropriateness": {
      "when_appropriate": "Rate control in AFib, heart failure with reduced EF",
      "when_to_question": "Renal impairment (adjust dose), electrolyte abnormalities",
      "better_alternatives": "Beta-blockers or CCBs may be first-line for rate control"
    },
    "special_prep": {
      "required_equipment": ["Manual pulse palpation skills"],
      "special_handling": "Verify correct dose - comes in 0.125mg and 0.25mg"
    },
    "administration": {
      "method": "Give with or without food consistently",
      "timing_considerations": "Same time daily; hold if HR <60 unless ordered otherwise"
    },
    "post_admin": {
      "immediate_monitoring": "Daily weight, HR before each dose",
      "documentation_points": ["Apical pulse x 1 full minute", "Signs of toxicity"],
      "escalation_triggers": "HR <60, N/V, anorexia, visual disturbances, confusion"
    },
    "patient_teaching": "Take pulse daily before taking. Skip dose and call provider if pulse <60 or >100. Same time each day."
  }
}'::jsonb WHERE LOWER(generic_name) = 'digoxin';

UPDATE public.medications SET nursing_guide = '{
  "iv_push": {
    "appropriateness": {
      "when_appropriate": "PSVT conversion, diagnostic stress testing",
      "when_to_question": "Asthma/COPD, WPW syndrome, heart transplant (increased sensitivity)",
      "better_alternatives": "Vagal maneuvers first; cardioversion if unstable"
    },
    "special_prep": {
      "required_equipment": ["Crash cart at bedside", "Defibrillator ready", "Continuous ECG with printout capability", "Atropine drawn up"],
      "line_requirements": "Large-bore IV closest to heart (antecubital preferred)",
      "special_handling": "Extremely short half-life - prepare immediately before use"
    },
    "administration": {
      "method": "Rapid IV push over 1-2 seconds at IV port closest to patient",
      "rate_guidance": "6mg rapid push, if no response 12mg in 1-2 min, may repeat 12mg once",
      "flush_requirements": "Immediately follow with 20mL rapid NS flush with arm elevated",
      "monitoring_during": "Continuous ECG - record rhythm strip throughout"
    },
    "post_admin": {
      "immediate_monitoring": "Rhythm q15sec during and 2 min after, BP",
      "expected_timeline": "Onset immediate, duration 10-20 seconds",
      "documentation_points": ["Pre-conversion rhythm strip", "Post-conversion rhythm strip", "Response to each dose", "Any adverse effects"],
      "escalation_triggers": "Prolonged asystole >10sec, bronchospasm, chest pain, no conversion after 2nd 12mg"
    },
    "patient_teaching": "Will feel very strange - flushing, chest pressure, brief sense of doom. This is normal and lasts only seconds. Keep still."
  }
}'::jsonb WHERE LOWER(generic_name) = 'adenosine';
