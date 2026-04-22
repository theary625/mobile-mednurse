-- Update fuzzy matching threshold from 0.3 to 0.25 for more lenient typo tolerance
CREATE OR REPLACE FUNCTION public.search_medications(search_query text, max_results integer DEFAULT 100)
RETURNS SETOF public.medications
LANGUAGE sql
STABLE
AS $$
  SELECT m.*
  FROM public.medications m
  WHERE (
    -- Exact/contains matching
    m.generic_name ILIKE ('%' || search_query || '%')
    OR COALESCE(m.drug_class, '') ILIKE ('%' || search_query || '%')
    OR COALESCE(array_to_string(m.brand_names, ' '), '') ILIKE ('%' || search_query || '%')
    -- Fuzzy matching using pg_trgm similarity (threshold 0.25)
    OR similarity(m.generic_name, search_query) > 0.25
    OR similarity(COALESCE(array_to_string(m.brand_names, ' '), ''), search_query) > 0.25
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
    -- Contains match before fuzzy
    CASE WHEN m.generic_name ILIKE ('%' || search_query || '%') THEN 0 ELSE 1 END,
    -- Higher similarity score = better match
    GREATEST(
      similarity(m.generic_name, search_query),
      similarity(COALESCE(array_to_string(m.brand_names, ' '), ''), search_query)
    ) DESC,
    -- Then alphabetically
    m.generic_name
  LIMIT LEAST(GREATEST(max_results, 1), 200);
$$;