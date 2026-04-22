-- Add NDC code and manufacturer fields to medications table
ALTER TABLE public.medications 
ADD COLUMN IF NOT EXISTS ndc_code text,
ADD COLUMN IF NOT EXISTS manufacturer text,
ADD COLUMN IF NOT EXISTS dosage_form text,
ADD COLUMN IF NOT EXISTS strengths text[];