
DO $$
DECLARE
  new_user_id uuid := gen_random_uuid();
BEGIN
  INSERT INTO auth.users (
    instance_id, id, aud, role, email,
    encrypted_password, email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data,
    created_at, updated_at,
    confirmation_token, email_change, email_change_token_new, recovery_token
  )
  VALUES (
    '00000000-0000-0000-0000-000000000000',
    new_user_id,
    'authenticated', 'authenticated',
    'cholna@gmail.com',
    crypt('cholna1234', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"first_name":"Cholna","last_name":"User","full_name":"Cholna User","country":"United States"}'::jsonb,
    now(), now(),
    '', '', '', ''
  );

  -- Insert profile manually in case trigger doesn't fire
  INSERT INTO public.profiles (user_id, first_name, last_name, full_name, email, country)
  VALUES (new_user_id, 'Cholna', 'User', 'Cholna User', 'cholna@gmail.com', 'United States')
  ON CONFLICT DO NOTHING;

  -- Insert default user role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (new_user_id, 'user')
  ON CONFLICT DO NOTHING;
END $$;
