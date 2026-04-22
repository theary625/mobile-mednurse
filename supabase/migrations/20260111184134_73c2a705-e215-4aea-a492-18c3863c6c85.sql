-- Drop and recreate the search_medications function with better ordering
-- Prioritizes: exact matches > prefix matches > contains matches
CREATE OR REPLACE FUNCTION public.search_medications(search_query text, max_results integer DEFAULT 100)
RETURNS SETOF public.medications
LANGUAGE sql
STABLE
AS $$
  SELECT m.*
  FROM public.medications m
  WHERE (
    m.generic_name ILIKE ('%' || search_query || '%')
    OR COALESCE(m.drug_class, '') ILIKE ('%' || search_query || '%')
    OR COALESCE(array_to_string(m.brand_names, ' '), '') ILIKE ('%' || search_query || '%')
  )
  ORDER BY 
    -- Exact match on generic name first
    CASE WHEN LOWER(m.generic_name) = LOWER(search_query) THEN 0 ELSE 1 END,
    -- Prefix match on generic name second
    CASE WHEN LOWER(m.generic_name) LIKE LOWER(search_query) || '%' THEN 0 ELSE 1 END,
    -- Prefix match on any brand name third
    CASE WHEN EXISTS (
      SELECT 1 FROM unnest(m.brand_names) AS bn 
      WHERE LOWER(bn) LIKE LOWER(search_query) || '%'
    ) THEN 0 ELSE 1 END,
    -- Then alphabetically
    m.generic_name
  LIMIT LEAST(GREATEST(max_results, 1), 200);
$$;