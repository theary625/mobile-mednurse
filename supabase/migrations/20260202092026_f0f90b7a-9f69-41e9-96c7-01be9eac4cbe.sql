-- Add scheduled_at column for scheduling blog post launches
ALTER TABLE public.blog_posts 
ADD COLUMN scheduled_at timestamp with time zone DEFAULT NULL;

-- Update the RLS policy to also check scheduled_at for public visibility
DROP POLICY IF EXISTS "Anyone can view published posts" ON public.blog_posts;

CREATE POLICY "Anyone can view published posts" 
ON public.blog_posts 
FOR SELECT 
USING (
  (is_published = true) 
  AND (is_archived = false) 
  AND (scheduled_at IS NULL OR scheduled_at <= now())
);