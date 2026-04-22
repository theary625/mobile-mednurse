-- Create function to check if user is super admin
CREATE OR REPLACE FUNCTION public.is_super_admin(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = 'super_admin'
  )
$$;

-- Assign Theary Ros as super_admin
INSERT INTO public.user_roles (user_id, role)
VALUES ('00042792-9c05-4e69-aaef-dcc05a168afc', 'super_admin')
ON CONFLICT (user_id, role) DO NOTHING;