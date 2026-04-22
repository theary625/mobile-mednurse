-- Drop the existing policy that only allows 'admin'
DROP POLICY IF EXISTS "Admins can manage medications" ON public.medications;

-- Create a new policy that allows both 'admin' and 'super_admin' roles
CREATE POLICY "Admins can manage medications" 
ON public.medications 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'super_admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'super_admin'::app_role));