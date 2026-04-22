
ALTER TABLE public.profiles
ADD COLUMN street_address text,
ADD COLUMN city text,
ADD COLUMN state text,
ADD COLUMN zip_code text,
ADD COLUMN country text DEFAULT 'United States';
