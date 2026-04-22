
-- Clinical role enum (separate from admin app_role)
CREATE TYPE public.clinical_role AS ENUM (
  'nursing_student', 
  'nurse', 
  'advanced_nurse', 
  'medical_student', 
  'resident', 
  'attending', 
  'app'
);

-- Clinical specialty enum
CREATE TYPE public.clinical_specialty AS ENUM (
  'neuro', 
  'cardiac', 
  'ob', 
  'gi', 
  'id', 
  'oncology', 
  'em', 
  'trauma', 
  'respiratory', 
  'icu', 
  'pediatrics', 
  'general'
);

-- Practice setting enum
CREATE TYPE public.practice_setting AS ENUM (
  'hospital', 
  'clinic', 
  'ed', 
  'icu', 
  'operating_room', 
  'home_health', 
  'long_term_care', 
  'academic'
);

-- Shift type enum
CREATE TYPE public.shift_type AS ENUM ('day', 'night', 'rotating', 'prn');

-- Clinician profiles table (extends user profile with clinical data)
CREATE TABLE public.clinician_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  clinical_role public.clinical_role NOT NULL,
  specialty public.clinical_specialty,
  practice_setting public.practice_setting,
  patient_population text,
  shift_type public.shift_type,
  preferred_units text DEFAULT 'metric',
  years_experience integer,
  onboarding_completed boolean DEFAULT false,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Medications table
CREATE TABLE public.medications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  generic_name text NOT NULL,
  brand_names text[],
  drug_class text,
  high_alert boolean DEFAULT false,
  controlled_substance boolean DEFAULT false,
  dosing_info jsonb,
  adjustments jsonb,
  safety_info jsonb,
  administration_info jsonb,
  clinical_pearls text[],
  created_at timestamptz DEFAULT now() NOT NULL
);

-- Drug interactions table
CREATE TABLE public.drug_interactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  drug_a_id uuid REFERENCES public.medications(id) ON DELETE CASCADE NOT NULL,
  drug_b_id uuid REFERENCES public.medications(id) ON DELETE CASCADE NOT NULL,
  severity text NOT NULL CHECK (severity IN ('major', 'moderate', 'minor')),
  description text,
  clinical_significance text,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- Clinical tools table
CREATE TABLE public.clinical_tools (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text NOT NULL,
  description text,
  formula jsonb,
  inputs jsonb,
  interpretation jsonb,
  roles_applicable public.clinical_role[],
  created_at timestamptz DEFAULT now() NOT NULL
);

-- Calculation logs table
CREATE TABLE public.calculation_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  tool_id uuid REFERENCES public.clinical_tools(id) ON DELETE SET NULL,
  medication_id uuid REFERENCES public.medications(id) ON DELETE SET NULL,
  inputs jsonb,
  result jsonb,
  safety_check_passed boolean,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- Safety alerts table
CREATE TABLE public.safety_alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  alert_type text NOT NULL CHECK (alert_type IN ('dose_range', 'interaction', 'renal', 'hepatic', 'high_alert', 'timing')),
  severity text NOT NULL CHECK (severity IN ('info', 'warning', 'critical')),
  medication_id uuid REFERENCES public.medications(id) ON DELETE SET NULL,
  message text NOT NULL,
  acknowledged boolean DEFAULT false,
  acknowledged_at timestamptz,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- Errors prevented feedback table
CREATE TABLE public.errors_prevented (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  interaction_type text,
  medication_id uuid REFERENCES public.medications(id) ON DELETE SET NULL,
  tool_id uuid REFERENCES public.clinical_tools(id) ON DELETE SET NULL,
  helped_prevent boolean,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- Enable RLS on all tables
ALTER TABLE public.clinician_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.drug_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clinical_tools ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.calculation_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.safety_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.errors_prevented ENABLE ROW LEVEL SECURITY;

-- Clinician profiles policies
CREATE POLICY "Users can view own clinician profile"
ON public.clinician_profiles FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own clinician profile"
ON public.clinician_profiles FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own clinician profile"
ON public.clinician_profiles FOR UPDATE
USING (auth.uid() = user_id);

-- Medications policies (public read for authenticated users)
CREATE POLICY "Authenticated users can view medications"
ON public.medications FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Admins can manage medications"
ON public.medications FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- Drug interactions policies
CREATE POLICY "Authenticated users can view drug interactions"
ON public.drug_interactions FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Admins can manage drug interactions"
ON public.drug_interactions FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- Clinical tools policies
CREATE POLICY "Authenticated users can view clinical tools"
ON public.clinical_tools FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Admins can manage clinical tools"
ON public.clinical_tools FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- Calculation logs policies
CREATE POLICY "Users can view own calculation logs"
ON public.calculation_logs FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own calculation logs"
ON public.calculation_logs FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Safety alerts policies
CREATE POLICY "Users can view own safety alerts"
ON public.safety_alerts FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own safety alerts"
ON public.safety_alerts FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own safety alerts"
ON public.safety_alerts FOR UPDATE
USING (auth.uid() = user_id);

-- Errors prevented policies
CREATE POLICY "Users can view own errors prevented"
ON public.errors_prevented FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own errors prevented"
ON public.errors_prevented FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Update timestamp trigger for clinician_profiles
CREATE TRIGGER update_clinician_profiles_updated_at
BEFORE UPDATE ON public.clinician_profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Seed sample medications
INSERT INTO public.medications (generic_name, brand_names, drug_class, high_alert, dosing_info, safety_info, clinical_pearls) VALUES
('Metoprolol', ARRAY['Lopressor', 'Toprol XL'], 'Beta Blocker', false, 
  '{"oral": {"adult": "25-100mg BID", "max": "400mg/day"}, "iv": {"adult": "5mg q5min x3", "max": "15mg"}}',
  '{"contraindications": ["Severe bradycardia", "Heart block", "Cardiogenic shock"], "monitoring": ["Heart rate", "Blood pressure"]}',
  ARRAY['Hold if HR <60 or SBP <90', 'Do not crush XL formulation']),
('Heparin', ARRAY['Heparin Sodium'], 'Anticoagulant', true,
  '{"iv_bolus": "80 units/kg", "iv_infusion": "18 units/kg/hr", "prophylaxis": "5000 units SC q8-12h"}',
  '{"contraindications": ["Active bleeding", "Severe thrombocytopenia"], "monitoring": ["aPTT q6h", "Platelets", "Signs of bleeding"]}',
  ARRAY['HIGH ALERT medication', 'Check aPTT before dose adjustments', 'Monitor for HIT']),
('Insulin Lispro', ARRAY['Humalog'], 'Rapid-Acting Insulin', true,
  '{"mealtime": "Individualized", "correction": "Per sliding scale", "onset": "15min", "peak": "1-2hr", "duration": "3-5hr"}',
  '{"contraindications": ["Hypoglycemia"], "monitoring": ["Blood glucose", "Signs of hypoglycemia"]}',
  ARRAY['HIGH ALERT medication', 'Give within 15 min of meal', 'Do not confuse with other insulins']),
('Warfarin', ARRAY['Coumadin', 'Jantoven'], 'Anticoagulant', true,
  '{"initial": "2-5mg daily", "maintenance": "Individualized per INR"}',
  '{"contraindications": ["Active bleeding", "Pregnancy"], "monitoring": ["INR", "Signs of bleeding"], "interactions": "Numerous"}',
  ARRAY['HIGH ALERT medication', 'Many drug-food interactions', 'Bridge with heparin if needed']),
('Lisinopril', ARRAY['Prinivil', 'Zestril'], 'ACE Inhibitor', false,
  '{"hypertension": "10-40mg daily", "heart_failure": "2.5-40mg daily", "max": "80mg/day"}',
  '{"contraindications": ["Angioedema history", "Pregnancy"], "monitoring": ["K+", "BUN/Cr", "Blood pressure"]}',
  ARRAY['Monitor potassium', 'Watch for dry cough', 'Hold if K+ >5.5']);

-- Seed clinical tools
INSERT INTO public.clinical_tools (name, category, description, inputs, formula, interpretation, roles_applicable) VALUES
('NIHSS', 'neuro', 'NIH Stroke Scale - Quantifies stroke severity',
  '[{"name": "consciousness", "label": "Level of Consciousness", "type": "select", "options": [0,1,2,3]}, {"name": "gaze", "label": "Best Gaze", "type": "select", "options": [0,1,2]}, {"name": "visual", "label": "Visual Fields", "type": "select", "options": [0,1,2,3]}]',
  '{"type": "sum", "fields": ["consciousness", "gaze", "visual", "facial", "motor_arm_l", "motor_arm_r", "motor_leg_l", "motor_leg_r", "ataxia", "sensory", "language", "dysarthria", "extinction"]}',
  '[{"range": [0,4], "label": "Minor Stroke"}, {"range": [5,15], "label": "Moderate Stroke"}, {"range": [16,20], "label": "Moderate-Severe"}, {"range": [21,42], "label": "Severe Stroke"}]',
  ARRAY['nurse', 'advanced_nurse', 'resident', 'attending', 'app']::public.clinical_role[]),
('GCS', 'neuro', 'Glasgow Coma Scale - Assesses consciousness',
  '[{"name": "eye", "label": "Eye Opening", "type": "select", "options": [1,2,3,4]}, {"name": "verbal", "label": "Verbal Response", "type": "select", "options": [1,2,3,4,5]}, {"name": "motor", "label": "Motor Response", "type": "select", "options": [1,2,3,4,5,6]}]',
  '{"type": "sum", "fields": ["eye", "verbal", "motor"]}',
  '[{"range": [3,8], "label": "Severe (Coma)"}, {"range": [9,12], "label": "Moderate"}, {"range": [13,15], "label": "Mild"}]',
  ARRAY['nursing_student', 'nurse', 'advanced_nurse', 'medical_student', 'resident', 'attending', 'app']::public.clinical_role[]),
('CrCl', 'general', 'Creatinine Clearance (Cockcroft-Gault)',
  '[{"name": "age", "label": "Age (years)", "type": "number"}, {"name": "weight", "label": "Weight (kg)", "type": "number"}, {"name": "creatinine", "label": "Serum Creatinine (mg/dL)", "type": "number"}, {"name": "sex", "label": "Sex", "type": "select", "options": ["male", "female"]}]',
  '{"type": "formula", "expression": "((140 - age) * weight) / (72 * creatinine) * (sex === \"female\" ? 0.85 : 1)"}',
  '[{"range": [0,15], "label": "Severe impairment"}, {"range": [15,30], "label": "Moderate-Severe"}, {"range": [30,60], "label": "Moderate"}, {"range": [60,90], "label": "Mild"}, {"range": [90,999], "label": "Normal"}]',
  ARRAY['nurse', 'advanced_nurse', 'medical_student', 'resident', 'attending', 'app']::public.clinical_role[]),
('CHADS2-VASc', 'cardiac', 'Stroke risk in atrial fibrillation',
  '[{"name": "chf", "label": "CHF History", "type": "checkbox"}, {"name": "hypertension", "label": "Hypertension", "type": "checkbox"}, {"name": "age75", "label": "Age ≥75", "type": "checkbox"}, {"name": "diabetes", "label": "Diabetes", "type": "checkbox"}, {"name": "stroke", "label": "Prior Stroke/TIA", "type": "checkbox"}, {"name": "vascular", "label": "Vascular Disease", "type": "checkbox"}, {"name": "age65", "label": "Age 65-74", "type": "checkbox"}, {"name": "female", "label": "Female Sex", "type": "checkbox"}]',
  '{"type": "weighted_sum", "weights": {"chf": 1, "hypertension": 1, "age75": 2, "diabetes": 1, "stroke": 2, "vascular": 1, "age65": 1, "female": 1}}',
  '[{"range": [0,0], "label": "Low risk - No anticoagulation"}, {"range": [1,1], "label": "Low-Moderate - Consider anticoagulation"}, {"range": [2,9], "label": "Moderate-High - Anticoagulation recommended"}]',
  ARRAY['advanced_nurse', 'resident', 'attending', 'app']::public.clinical_role[]);
