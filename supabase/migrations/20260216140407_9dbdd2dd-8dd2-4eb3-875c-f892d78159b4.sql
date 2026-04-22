ALTER TABLE public.demo_email_templates
  ADD COLUMN IF NOT EXISTS logo_url text DEFAULT '',
  ADD COLUMN IF NOT EXISTS header_color text DEFAULT '#0D4F4F';