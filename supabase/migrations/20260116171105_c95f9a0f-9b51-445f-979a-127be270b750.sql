-- Add nursing_guide JSONB column to medications table
-- This stores route-specific nursing guidance following the four-part clinical flow
ALTER TABLE public.medications 
ADD COLUMN IF NOT EXISTS nursing_guide jsonb DEFAULT NULL;

-- Add comment for documentation
COMMENT ON COLUMN public.medications.nursing_guide IS 'Route-specific nursing guidance with four-part structure: appropriateness, special_prep, administration, post_admin, plus patient_teaching';