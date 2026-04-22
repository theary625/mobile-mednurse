-- Create table for clinical tool settings
CREATE TABLE public.clinical_tool_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tool_id TEXT NOT NULL UNIQUE,
  tool_name TEXT NOT NULL,
  system_category TEXT NOT NULL,
  is_visible BOOLEAN NOT NULL DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.clinical_tool_settings ENABLE ROW LEVEL SECURITY;

-- Everyone can read tool settings (to know which tools are visible)
CREATE POLICY "Anyone can view tool settings"
ON public.clinical_tool_settings
FOR SELECT
USING (true);

-- Only admins can modify tool settings
CREATE POLICY "Admins can manage tool settings"
ON public.clinical_tool_settings
FOR ALL
USING (public.is_admin_or_support(auth.uid()));

-- Create trigger for updated_at
CREATE TRIGGER update_clinical_tool_settings_updated_at
BEFORE UPDATE ON public.clinical_tool_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default tool settings
INSERT INTO public.clinical_tool_settings (tool_id, tool_name, system_category, is_visible) VALUES
-- Neurological
('gcs', 'Glasgow Coma Scale', 'neurological', true),
('nihss', 'NIH Stroke Scale', 'neurological', true),
('lams', 'Los Angeles Motor Scale', 'neurological', true),
('slams', 'Stroke Severity Scale', 'neurological', true),
('ich', 'Intracerebral Hemorrhage Score', 'neurological', true),
('hunthess', 'Subarachnoid Hemorrhage Grade', 'neurological', true),
('race', 'Rapid Arterial oCclusion Evaluation', 'neurological', true),
('mrs', 'Modified Rankin Scale', 'neurological', true),
('abcd2', 'TIA Stroke Risk Score', 'neurological', true),
('fisher', 'Fisher Scale for SAH', 'neurological', true),
('menza', 'Mini-Mental State Examination', 'neurological', true),
-- Psychiatric
('phq9', 'Depression Screening', 'psychiatric', true),
('gad7', 'Anxiety Screening', 'psychiatric', true),
('cam', 'Confusion Assessment Method', 'psychiatric', true),
('ciwa', 'Alcohol Withdrawal Scale', 'psychiatric', true),
('cssrs', 'Suicide Severity Rating Scale', 'psychiatric', true),
('moca', 'Montreal Cognitive Assessment', 'psychiatric', true),
-- Cardiovascular
('heart', 'Chest Pain Risk Score', 'cardiovascular', true),
('timi', 'ACS Risk Score', 'cardiovascular', true),
('chads', 'AF Stroke Risk Score', 'cardiovascular', true),
('hasbled', 'Bleeding Risk Score', 'cardiovascular', true),
('wells', 'DVT/PE Probability Score', 'cardiovascular', true),
('killip', 'Heart Failure Post-MI', 'cardiovascular', true),
('nyha', 'Heart Failure Classification', 'cardiovascular', true),
('rcri', 'Perioperative Cardiac Risk', 'cardiovascular', true),
('framingham', '10-Year CVD Risk', 'cardiovascular', true),
('duke', 'Infective Endocarditis', 'cardiovascular', true),
('grace', 'ACS Mortality Risk', 'cardiovascular', true),
-- Respiratory
('curb65', 'Pneumonia Severity Score', 'respiratory', true),
('aagradient', 'Alveolar-arterial O₂ Gradient', 'respiratory', true),
('bode', 'COPD Mortality Prediction', 'respiratory', true),
('mmrc', 'Dyspnea Scale', 'respiratory', true),
-- Sepsis
('qsofa', 'Quick SOFA Score', 'sepsis', true),
('sirs', 'Systemic Inflammatory Response', 'sepsis', true),
('sofa', 'Sequential Organ Failure Assessment', 'sepsis', true),
-- Critical Care
('apache', 'Acute Physiology Score', 'critical', true),
-- Trauma
('trauma', 'RTS, ISS, TRISS Calculator', 'trauma', true),
-- Hematology
('blood', 'Blood Compatibility Checker', 'hematology', true),
-- Pediatric
('apgar', 'Newborn Assessment', 'pediatric', true),
('pedsgcs', 'Pediatric Glasgow Coma Scale', 'pediatric', true),
('pews', 'Pediatric Early Warning Score', 'pediatric', true),
('pedsdose', 'Weight-Based Dosage Calculator', 'pediatric', true),
-- Renal
('ckdepi', 'eGFR Calculator (2021)', 'renal', true),
('akikdigo', 'AKI Staging Criteria', 'renal', true),
('cockcroftgault', 'Creatinine Clearance', 'renal', true),
-- Oncology
('ecog', 'ECOG Performance Status', 'oncology', true),
('karnofsky', 'Karnofsky Performance Status', 'oncology', true),
('g8', 'G8 Geriatric Screening', 'oncology', true),
('esas', 'Edmonton Symptom Assessment', 'oncology', true),
('pap', 'Palliative Prognostic Score', 'oncology', true),
('pps', 'Palliative Performance Scale', 'oncology', true);