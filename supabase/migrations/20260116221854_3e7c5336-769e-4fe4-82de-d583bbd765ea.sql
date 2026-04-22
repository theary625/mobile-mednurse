-- Add pharmacokinetics column to medications table
ALTER TABLE public.medications 
ADD COLUMN pharmacokinetics jsonb;