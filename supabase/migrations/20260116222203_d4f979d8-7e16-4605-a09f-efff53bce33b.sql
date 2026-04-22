-- Add adverse reactions and drug interactions columns to medications table
ALTER TABLE public.medications 
ADD COLUMN adverse_reactions jsonb,
ADD COLUMN drug_interactions_info jsonb;