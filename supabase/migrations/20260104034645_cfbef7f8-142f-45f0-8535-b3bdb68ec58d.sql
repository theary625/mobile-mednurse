-- Add image and pronunciation audio columns to medications table
ALTER TABLE public.medications
ADD COLUMN image_url TEXT,
ADD COLUMN pronunciation_audio_url TEXT;

-- Create storage bucket for medication assets
INSERT INTO storage.buckets (id, name, public)
VALUES ('medication-assets', 'medication-assets', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies for medication assets
CREATE POLICY "Anyone can view medication assets"
ON storage.objects FOR SELECT
USING (bucket_id = 'medication-assets');

CREATE POLICY "Admins can upload medication assets"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'medication-assets' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update medication assets"
ON storage.objects FOR UPDATE
USING (bucket_id = 'medication-assets' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete medication assets"
ON storage.objects FOR DELETE
USING (bucket_id = 'medication-assets' AND has_role(auth.uid(), 'admin'::app_role));