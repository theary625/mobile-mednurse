-- Drop and recreate the INSERT policy for medication-images to use has_role function
DROP POLICY IF EXISTS "Admins can upload medication images" ON storage.objects;

CREATE POLICY "Admins can upload medication images"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'medication-images' 
  AND has_role(auth.uid(), 'admin'::app_role)
);

-- Also update the UPDATE and DELETE policies to use has_role consistently
DROP POLICY IF EXISTS "Admins can update medication images" ON storage.objects;

CREATE POLICY "Admins can update medication images"
ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'medication-images' 
  AND has_role(auth.uid(), 'admin'::app_role)
);

DROP POLICY IF EXISTS "Admins can delete medication images" ON storage.objects;

CREATE POLICY "Admins can delete medication images"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'medication-images' 
  AND has_role(auth.uid(), 'admin'::app_role)
);