-- Add pronunciation_text column for phonetic spelling
ALTER TABLE public.medications 
ADD COLUMN IF NOT EXISTS pronunciation_text TEXT;