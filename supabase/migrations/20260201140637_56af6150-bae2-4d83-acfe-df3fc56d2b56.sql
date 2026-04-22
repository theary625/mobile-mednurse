-- Add validation-related columns to medications table
ALTER TABLE public.medications ADD COLUMN IF NOT EXISTS validation_results jsonb;
ALTER TABLE public.medications ADD COLUMN IF NOT EXISTS review_tier text DEFAULT 'full_review';
ALTER TABLE public.medications ADD COLUMN IF NOT EXISTS ai_confidence_score numeric;

-- Create clinical validation rules table
CREATE TABLE IF NOT EXISTS public.clinical_validation_rules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  rule_type text NOT NULL,
  medication_pattern text,
  drug_class text,
  rule_config jsonb NOT NULL,
  severity text DEFAULT 'warning',
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS on clinical_validation_rules
ALTER TABLE public.clinical_validation_rules ENABLE ROW LEVEL SECURITY;

-- Admins can manage validation rules
CREATE POLICY "Admins can manage validation rules"
ON public.clinical_validation_rules
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Anyone can view active rules (needed for edge functions)
CREATE POLICY "Anyone can view active validation rules"
ON public.clinical_validation_rules
FOR SELECT
USING (is_active = true);

-- Add trigger for updated_at
CREATE TRIGGER update_clinical_validation_rules_updated_at
BEFORE UPDATE ON public.clinical_validation_rules
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert some default clinical validation rules
INSERT INTO public.clinical_validation_rules (rule_type, drug_class, rule_config, severity) VALUES
('rate_limit', 'Antiarrhythmics', '{"max_rate_mg_min": 50, "description": "Maximum IV infusion rate for antiarrhythmics"}', 'critical'),
('rate_limit', 'Antibiotics', '{"max_rate_mg_min": 10, "description": "Vancomycin and similar - max 10mg/min to prevent red man syndrome"}', 'critical'),
('required_monitoring', 'Anticoagulants', '{"labs": ["INR", "PT", "aPTT"], "frequency": "per protocol", "description": "Coagulation monitoring required"}', 'warning'),
('dose_range', 'Beta Blockers', '{"iv_max_single_dose_mg": 5, "po_max_single_dose_mg": 200, "description": "Standard beta blocker dose limits"}', 'warning'),
('required_monitoring', 'Nephrotoxic Agents', '{"labs": ["BUN", "Creatinine", "GFR"], "frequency": "baseline and ongoing", "description": "Renal function monitoring"}', 'warning')
ON CONFLICT DO NOTHING;