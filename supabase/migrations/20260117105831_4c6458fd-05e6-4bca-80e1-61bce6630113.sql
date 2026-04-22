
-- Create medication-images storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('medication-images', 'medication-images', true)
ON CONFLICT (id) DO NOTHING;

-- Allow anyone to view medication images (public bucket)
CREATE POLICY "Anyone can view medication images"
ON storage.objects FOR SELECT
USING (bucket_id = 'medication-images');

-- Allow admins to upload medication images
CREATE POLICY "Admins can upload medication images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'medication-images' 
  AND EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role = 'admin'
  )
);

-- Allow admins to update medication images
CREATE POLICY "Admins can update medication images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'medication-images' 
  AND EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role = 'admin'
  )
);

-- Allow admins to delete medication images
CREATE POLICY "Admins can delete medication images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'medication-images' 
  AND EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role = 'admin'
  )
);
