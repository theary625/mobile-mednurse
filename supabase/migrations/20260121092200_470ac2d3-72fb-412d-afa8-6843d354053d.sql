-- Add citations column to blog_posts table for references/citations
ALTER TABLE public.blog_posts 
ADD COLUMN citations text[] DEFAULT NULL;