-- Enable trigram extension for fast fuzzy/ILIKE searches
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Server-side medication search function (supports brand_names array)
CREATE OR REPLACE FUNCTION public.search_medications(search_query text, max_results integer DEFAULT 50)
RETURNS SETOF public.medications
LANGUAGE sql
STABLE
SET search_path TO 'public'
AS $$
  SELECT m.*
  FROM public.medications m
  WHERE (
    m.generic_name ILIKE ('%' || search_query || '%')
    OR COALESCE(m.drug_class, '') ILIKE ('%' || search_query || '%')
    OR COALESCE(array_to_string(m.brand_names, ' '), '') ILIKE ('%' || search_query || '%')
  )
  ORDER BY m.generic_name
  LIMIT LEAST(GREATEST(max_results, 1), 200);
$$;

-- Simple trigram index on generic_name only (most common search)
CREATE INDEX IF NOT EXISTS medications_generic_name_trgm_idx
  ON public.medications
  USING gin (generic_name gin_trgm_ops);