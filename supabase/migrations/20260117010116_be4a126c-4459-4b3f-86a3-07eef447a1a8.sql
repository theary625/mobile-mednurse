
-- Update remaining high-alert medications with comprehensive data

-- Epinephrine
UPDATE public.medications SET
  high_alert = true, double_check_required = true,
  pharmacokinetics = '{"half_life": {"normal": "2-3 minutes"}, "onset_iv": "Immediate", "metabolism": "MAO, COMT"}'::jsonb,
  adverse_reactions = '{"frequency_based": {"common": ["Tachycardia", "Hypertension", "Anxiety", "Tremor"], "rare": ["Ventricular arrhythmias", "Stroke"]}}'::jsonb,
  drug_interactions_info = '{"major": [{"drug": "MAO inhibitors", "effect": "Severe hypertension", "management": "Avoid or reduce dose"}], "moderate": [{"drug": "Beta-blockers", "effect": "Unopposed alpha effects", "management": "Use with caution"}]}'::jsonb,
  clinical_pearls = ARRAY['1:1000 (1mg/mL) for IM anaphylaxis; 1:10000 (0.1mg/mL) for IV/cardiac arrest', 'First-line for anaphylaxis: 0.3-0.5mg IM (adult)', 'ACLS: 1mg IV q3-5min for cardiac arrest']
WHERE LOWER(generic_name) = 'epinephrine';

-- Amiodarone
UPDATE public.medications SET
  high_alert = true, double_check_required = true,
  pharmacokinetics = '{"half_life": {"normal": "40-55 days (extremely long)"}, "metabolism": "Hepatic via CYP3A4", "distribution": {"vd": "66 L/kg - highly lipophilic"}}'::jsonb,
  adverse_reactions = '{"frequency_based": {"common": ["Bradycardia", "Hypotension", "Nausea", "Photosensitivity"], "serious": ["Pulmonary toxicity", "Hepatotoxicity", "Thyroid dysfunction", "QT prolongation"]}}'::jsonb,
  drug_interactions_info = '{"major": [{"drug": "Digoxin", "effect": "Increases digoxin 70-100%", "management": "Reduce digoxin by 50%"}, {"drug": "Warfarin", "effect": "Increases INR", "management": "Reduce warfarin 30-50%"}]}'::jsonb,
  clinical_pearls = ARRAY['Extremely long half-life (40-55 days) - effects persist weeks after stopping', 'Monitor TFTs, LFTs, PFTs, eye exams', 'IV: 150mg over 10min for VT, then 1mg/min x 6h, then 0.5mg/min']
WHERE LOWER(generic_name) = 'amiodarone';

-- Diltiazem
UPDATE public.medications SET
  high_alert = true, double_check_required = false,
  pharmacokinetics = '{"half_life": {"normal": "3-4.5 hours (IR); 6-9 hours (ER)"}, "metabolism": "Hepatic via CYP3A4", "bioavailability": "40%"}'::jsonb,
  adverse_reactions = '{"frequency_based": {"common": ["Bradycardia", "Hypotension", "Peripheral edema", "Dizziness", "Headache"], "serious": ["Heart block", "Heart failure exacerbation"]}}'::jsonb,
  drug_interactions_info = '{"major": [{"drug": "Beta-blockers", "effect": "Severe bradycardia/heart block", "management": "Avoid IV combination"}, {"drug": "Simvastatin", "effect": "Increased statin levels/myopathy", "management": "Limit simvastatin to 10mg"}]}'::jsonb,
  clinical_pearls = ARRAY['IV bolus: 0.25mg/kg over 2min; may repeat 0.35mg/kg', 'Drip: 5-15mg/hr after bolus for rate control', 'Hold if HR <60 or SBP <90']
WHERE LOWER(generic_name) = 'diltiazem';

-- Magnesium Sulfate
UPDATE public.medications SET
  high_alert = true, double_check_required = true,
  pharmacokinetics = '{"half_life": {"normal": "4-5 hours"}, "excretion": "Renal (100%)", "onset_iv": "Immediate"}'::jsonb,
  adverse_reactions = '{"frequency_based": {"common": ["Flushing", "Hypotension", "Nausea"], "serious": ["Respiratory depression", "Cardiac arrest (overdose)", "Loss of DTRs"]}}'::jsonb,
  drug_interactions_info = '{"major": [{"drug": "Neuromuscular blockers", "effect": "Prolonged paralysis", "management": "Reduce NMB dose; monitor closely"}, {"drug": "CNS depressants", "effect": "Additive depression", "management": "Monitor respiratory status"}]}'::jsonb,
  clinical_pearls = ARRAY['Eclampsia: 4-6g IV load over 15-20min, then 1-2g/hr', 'Torsades: 1-2g IV over 5-20min', 'Check DTRs, respiratory rate before repeat doses; hold if DTRs absent']
WHERE LOWER(generic_name) = 'magnesium sulfate';

-- Nitroglycerin
UPDATE public.medications SET
  high_alert = true, double_check_required = false,
  pharmacokinetics = '{"half_life": {"normal": "1-4 minutes"}, "metabolism": "Hepatic (rapid)", "onset_iv": "1-2 minutes", "onset_sl": "1-3 minutes"}'::jsonb,
  adverse_reactions = '{"frequency_based": {"common": ["Headache", "Hypotension", "Dizziness", "Flushing"], "serious": ["Severe hypotension", "Reflex tachycardia", "Syncope"]}}'::jsonb,
  drug_interactions_info = '{"major": [{"drug": "PDE5 inhibitors (sildenafil)", "effect": "Severe life-threatening hypotension", "management": "CONTRAINDICATED within 24-48 hours"}]}'::jsonb,
  clinical_pearls = ARRAY['Contraindicated with PDE5 inhibitors (Viagra) within 24-48 hours', 'SL: 0.4mg q5min x3 for chest pain', 'IV: Start 5-10 mcg/min; titrate by 5-10 mcg/min q3-5min', 'Use non-PVC tubing (drug adsorbs to PVC)']
WHERE LOWER(generic_name) = 'nitroglycerin';

-- Fentanyl
UPDATE public.medications SET
  high_alert = true, double_check_required = true, controlled_substance = true,
  pharmacokinetics = '{"half_life": {"normal": "2-4 hours (IV); 17 hours (patch)"}, "metabolism": "Hepatic via CYP3A4", "potency": "100x morphine"}'::jsonb,
  adverse_reactions = '{"frequency_based": {"common": ["Respiratory depression", "Sedation", "Nausea", "Constipation", "Pruritus"], "serious": ["Apnea", "Chest wall rigidity (rapid IV)"]}}'::jsonb,
  drug_interactions_info = '{"major": [{"drug": "Benzodiazepines/CNS depressants", "effect": "Profound respiratory depression", "management": "Avoid or use lowest doses"}, {"drug": "CYP3A4 inhibitors", "effect": "Increased fentanyl levels", "management": "Monitor closely; reduce dose"}], "reversal": [{"agent": "Naloxone", "dose": "0.4-2mg IV; may need repeat doses"}]}'::jsonb,
  clinical_pearls = ARRAY['100x more potent than morphine (100mcg fentanyl ≈ 10mg morphine IV)', 'Rapid IV bolus can cause chest wall rigidity', 'Patches: for opioid-tolerant ONLY; takes 12-24h for effect', 'Renal-friendly - no active metabolites (unlike morphine)']
WHERE LOWER(generic_name) = 'fentanyl';
