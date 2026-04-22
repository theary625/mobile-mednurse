-- Add nurse-first administration columns to medications table
ALTER TABLE public.medications
ADD COLUMN IF NOT EXISTS route text[],
ADD COLUMN IF NOT EXISTS safe_method jsonb,
ADD COLUMN IF NOT EXISTS rate_dilution jsonb,
ADD COLUMN IF NOT EXISTS line_compatibility jsonb,
ADD COLUMN IF NOT EXISTS monitoring jsonb,
ADD COLUMN IF NOT EXISTS hold_parameters jsonb,
ADD COLUMN IF NOT EXISTS required_resources jsonb,
ADD COLUMN IF NOT EXISTS crushing_info jsonb,
ADD COLUMN IF NOT EXISTS timing_rules jsonb,
ADD COLUMN IF NOT EXISTS patient_education jsonb,
ADD COLUMN IF NOT EXISTS red_flags jsonb,
ADD COLUMN IF NOT EXISTS expected_effect jsonb,
ADD COLUMN IF NOT EXISTS documentation_reminders jsonb,
ADD COLUMN IF NOT EXISTS safety_badges jsonb,
ADD COLUMN IF NOT EXISTS pause_triggers jsonb,
ADD COLUMN IF NOT EXISTS double_check_required boolean DEFAULT false;