-- Add education/credentials field to clinician_profiles table
ALTER TABLE public.clinician_profiles 
ADD COLUMN education text;