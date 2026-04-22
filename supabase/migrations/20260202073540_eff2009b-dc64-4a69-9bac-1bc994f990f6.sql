-- Create table for tracking 404 errors
CREATE TABLE public.not_found_errors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_path text NOT NULL,
  referrer text,
  user_agent text,
  session_id text,
  user_id uuid,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create index for efficient querying by page_path
CREATE INDEX idx_not_found_errors_page_path ON public.not_found_errors(page_path);

-- Create index for date filtering
CREATE INDEX idx_not_found_errors_created_at ON public.not_found_errors(created_at DESC);

-- Enable Row Level Security
ALTER TABLE public.not_found_errors ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can insert (track 404 errors)
CREATE POLICY "Anyone can log 404 errors"
ON public.not_found_errors
FOR INSERT
WITH CHECK (true);

-- Policy: Only admins can view 404 errors
CREATE POLICY "Admins can view 404 errors"
ON public.not_found_errors
FOR SELECT
USING (is_admin_or_support(auth.uid()));