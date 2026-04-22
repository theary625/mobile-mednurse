-- Add is_free column to ce_courses (default false = paid)
ALTER TABLE public.ce_courses
ADD COLUMN is_free boolean NOT NULL DEFAULT false;

-- Create storage bucket for CE assets (thumbnails, videos)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'ce-assets',
  'ce-assets', 
  true,
  52428800, -- 50MB limit for videos
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'video/mp4', 'video/webm', 'video/quicktime']
) ON CONFLICT (id) DO NOTHING;

-- Storage policies for CE assets
CREATE POLICY "Anyone can view CE assets"
ON storage.objects FOR SELECT
USING (bucket_id = 'ce-assets');

CREATE POLICY "Admins can upload CE assets"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'ce-assets' 
  AND public.has_role(auth.uid(), 'admin'::public.app_role)
);

CREATE POLICY "Admins can update CE assets"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'ce-assets' 
  AND public.has_role(auth.uid(), 'admin'::public.app_role)
);

CREATE POLICY "Admins can delete CE assets"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'ce-assets' 
  AND public.has_role(auth.uid(), 'admin'::public.app_role)
);

-- Update existing seeded courses to be free (sample content)
UPDATE public.ce_courses SET is_free = true WHERE title = 'High-Alert Medication Safety';