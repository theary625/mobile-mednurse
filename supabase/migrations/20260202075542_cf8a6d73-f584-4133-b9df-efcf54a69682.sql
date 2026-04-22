-- Drop existing policies
DROP POLICY IF EXISTS "Admins can manage marketing pages" ON public.marketing_pages;
DROP POLICY IF EXISTS "Admins can manage marketing sections" ON public.marketing_sections;

-- Recreate with super_admin support
CREATE POLICY "Admins can manage marketing pages"
  ON public.marketing_pages
  FOR ALL
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'super_admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'super_admin'::app_role));

CREATE POLICY "Admins can manage marketing sections"
  ON public.marketing_sections
  FOR ALL
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'super_admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'super_admin'::app_role));