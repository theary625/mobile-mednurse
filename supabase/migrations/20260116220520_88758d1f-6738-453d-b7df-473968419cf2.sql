-- Add FDA link column to medications table
ALTER TABLE public.medications 
ADD COLUMN fda_link text;