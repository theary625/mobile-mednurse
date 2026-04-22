-- Add image_url column to testimonials table
ALTER TABLE public.testimonials 
ADD COLUMN image_url TEXT;

-- Create storage bucket for testimonial images
INSERT INTO storage.buckets (id, name, public)
VALUES ('testimonial-images', 'testimonial-images', true)
ON CONFLICT (id) DO NOTHING;

-- Allow anyone to view testimonial images (public bucket)
CREATE POLICY "Anyone can view testimonial images"
ON storage.objects
FOR SELECT
USING (bucket_id = 'testimonial-images');

-- Only admins can upload testimonial images
CREATE POLICY "Admins can upload testimonial images"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'testimonial-images' 
  AND has_role(auth.uid(), 'admin'::app_role)
);

-- Only admins can update testimonial images
CREATE POLICY "Admins can update testimonial images"
ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'testimonial-images' 
  AND has_role(auth.uid(), 'admin'::app_role)
);

-- Only admins can delete testimonial images
CREATE POLICY "Admins can delete testimonial images"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'testimonial-images' 
  AND has_role(auth.uid(), 'admin'::app_role)
);