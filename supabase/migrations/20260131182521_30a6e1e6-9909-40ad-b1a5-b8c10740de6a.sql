-- Add video support columns to marketing_assets table
ALTER TABLE marketing_assets 
ADD COLUMN IF NOT EXISTS media_type text DEFAULT 'image',
ADD COLUMN IF NOT EXISTS duration integer,
ADD COLUMN IF NOT EXISTS thumbnail_url text;

-- Create marketing-assets storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('marketing-assets', 'marketing-assets', true)
ON CONFLICT (id) DO NOTHING;

-- RLS policy for admins to upload marketing assets
CREATE POLICY "Admins can upload marketing assets"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'marketing-assets' AND
  EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_id = auth.uid() 
    AND role IN ('admin', 'moderator')
  )
);

-- RLS policy for public to view marketing assets
CREATE POLICY "Public can view marketing assets"
ON storage.objects FOR SELECT
USING (bucket_id = 'marketing-assets');

-- RLS policy for admins to update marketing assets
CREATE POLICY "Admins can update marketing assets"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'marketing-assets' AND
  EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_id = auth.uid() 
    AND role IN ('admin', 'moderator')
  )
);

-- RLS policy for admins to delete marketing assets
CREATE POLICY "Admins can delete marketing assets"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'marketing-assets' AND
  EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_id = auth.uid() 
    AND role IN ('admin', 'moderator')
  )
);