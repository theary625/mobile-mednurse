-- Add tour_completed column to clinician_profiles table
ALTER TABLE public.clinician_profiles 
ADD COLUMN IF NOT EXISTS tour_completed boolean DEFAULT false;