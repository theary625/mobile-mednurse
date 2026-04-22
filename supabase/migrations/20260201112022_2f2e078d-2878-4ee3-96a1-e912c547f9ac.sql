-- Add visibility_settings column to medications table for hiding specific features
ALTER TABLE public.medications ADD COLUMN IF NOT EXISTS visibility_settings jsonb DEFAULT '{}';

COMMENT ON COLUMN public.medications.visibility_settings IS 'Controls visibility of medication features: { "hide_dosing": bool, "hide_administration": bool, etc. }';