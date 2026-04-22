-- ============================================
-- FIX 1: Add database constraints for public form validation
-- Adjusted minimums to accommodate existing data
-- ============================================

-- Newsletter subscribers - email format and length validation
ALTER TABLE public.newsletter_subscribers
  DROP CONSTRAINT IF EXISTS valid_email_format,
  ADD CONSTRAINT valid_email_format
  CHECK (email ~* '^[^\s@]+@[^\s@]+\.[^\s@]+$' AND length(email) <= 254);

-- Contact submissions - add length constraints (min 1 to accommodate existing data)
ALTER TABLE public.contact_submissions
  DROP CONSTRAINT IF EXISTS name_length_check,
  DROP CONSTRAINT IF EXISTS email_format_check,
  DROP CONSTRAINT IF EXISTS subject_length_check,
  DROP CONSTRAINT IF EXISTS message_length_check,
  ADD CONSTRAINT name_length_check CHECK (length(name) >= 1 AND length(name) <= 100),
  ADD CONSTRAINT email_format_check CHECK (email ~* '^[^\s@]+@[^\s@]+\.[^\s@]+$' AND length(email) <= 254),
  ADD CONSTRAINT subject_length_check CHECK (length(subject) >= 1 AND length(subject) <= 200),
  ADD CONSTRAINT message_length_check CHECK (length(message) >= 1 AND length(message) <= 5000);

-- Demo bookings - add length constraints
ALTER TABLE public.demo_bookings
  DROP CONSTRAINT IF EXISTS demo_name_length_check,
  DROP CONSTRAINT IF EXISTS demo_email_format_check,
  ADD CONSTRAINT demo_name_length_check CHECK (length(name) >= 1 AND length(name) <= 100),
  ADD CONSTRAINT demo_email_format_check CHECK (email ~* '^[^\s@]+@[^\s@]+\.[^\s@]+$' AND length(email) <= 254);

-- Support tickets - add length constraints
ALTER TABLE public.support_tickets
  DROP CONSTRAINT IF EXISTS ticket_email_format_check,
  DROP CONSTRAINT IF EXISTS ticket_subject_length_check,
  DROP CONSTRAINT IF EXISTS ticket_message_length_check,
  ADD CONSTRAINT ticket_email_format_check CHECK (user_email ~* '^[^\s@]+@[^\s@]+\.[^\s@]+$' AND length(user_email) <= 254),
  ADD CONSTRAINT ticket_subject_length_check CHECK (length(subject) >= 1 AND length(subject) <= 200),
  ADD CONSTRAINT ticket_message_length_check CHECK (length(message) >= 1 AND length(message) <= 5000);

-- ============================================
-- FIX 2: Update functions to have explicit search_path
-- ============================================

-- Update ensure_single_active_account function
CREATE OR REPLACE FUNCTION public.ensure_single_active_account()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  IF NEW.is_active = true THEN
    UPDATE public.account_profiles
    SET is_active = false
    WHERE user_id = NEW.user_id AND id != NEW.id;
  END IF;
  RETURN NEW;
END;
$$;

-- Update create_default_account_profile function
CREATE OR REPLACE FUNCTION public.create_default_account_profile()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  INSERT INTO public.account_profiles (user_id, account_type, profile_name, is_active)
  VALUES (NEW.id, 'personal', 'Personal Account', true);
  RETURN NEW;
END;
$$;

-- Update handle_new_user function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, first_name, last_name, full_name, email)
  VALUES (
    new.id, 
    new.raw_user_meta_data ->> 'first_name',
    new.raw_user_meta_data ->> 'last_name',
    COALESCE(
      NULLIF(TRIM(COALESCE(new.raw_user_meta_data ->> 'first_name', '') || ' ' || COALESCE(new.raw_user_meta_data ->> 'last_name', '')), ''),
      new.raw_user_meta_data ->> 'full_name'
    ),
    new.email
  );
  
  INSERT INTO public.user_roles (user_id, role)
  VALUES (new.id, 'user');
  
  RETURN new;
END;
$$;

-- ============================================
-- FIX 3: Move pg_trgm extension from public to extensions schema
-- ============================================

-- Create extensions schema if it doesn't exist
CREATE SCHEMA IF NOT EXISTS extensions;

-- Grant usage on extensions schema
GRANT USAGE ON SCHEMA extensions TO postgres, anon, authenticated, service_role;

-- Drop existing pg_trgm in public and recreate in extensions
DROP EXTENSION IF EXISTS pg_trgm CASCADE;
CREATE EXTENSION IF NOT EXISTS pg_trgm WITH SCHEMA extensions;

-- Recreate the search_medications function to use extensions schema
CREATE OR REPLACE FUNCTION public.search_medications(search_query text, max_results integer DEFAULT 100)
RETURNS SETOF medications
LANGUAGE sql
STABLE
SET search_path = 'public, extensions'
AS $$
  SELECT m.*
  FROM public.medications m
  WHERE (
    m.generic_name ILIKE ('%' || search_query || '%')
    OR COALESCE(m.drug_class, '') ILIKE ('%' || search_query || '%')
    OR COALESCE(array_to_string(m.brand_names, ' '), '') ILIKE ('%' || search_query || '%')
    OR extensions.similarity(m.generic_name, search_query) > 0.25
    OR extensions.similarity(COALESCE(array_to_string(m.brand_names, ' '), ''), search_query) > 0.25
  )
  ORDER BY 
    CASE WHEN LOWER(m.generic_name) = LOWER(search_query) THEN 0 ELSE 1 END,
    CASE WHEN LOWER(m.generic_name) LIKE LOWER(search_query) || '%' THEN 0 ELSE 1 END,
    CASE WHEN EXISTS (
      SELECT 1 FROM unnest(m.brand_names) AS bn 
      WHERE LOWER(bn) LIKE LOWER(search_query) || '%'
    ) THEN 0 ELSE 1 END,
    CASE WHEN m.generic_name ILIKE ('%' || search_query || '%') THEN 0 ELSE 1 END,
    GREATEST(
      extensions.similarity(m.generic_name, search_query),
      extensions.similarity(COALESCE(array_to_string(m.brand_names, ' '), ''), search_query)
    ) DESC,
    m.generic_name
  LIMIT LEAST(GREATEST(max_results, 1), 200);
$$;