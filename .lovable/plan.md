

## Goal

Create a test user account (`test@gmail.com` / `test1234`) you can sign in with immediately, with email confirmation bypassed so you don't need to click a verification link.

## What I'll do

1. **Insert the auth user via SQL migration** — use Supabase's `auth.users` table with a pre-confirmed email (`email_confirmed_at = now()`) and a bcrypt-hashed password for `test1234`. The existing `handle_new_user` trigger will automatically create the matching row in `public.profiles` and assign the default `user` role in `public.user_roles`.
2. **Pass user metadata** so the profile has sensible defaults:
   - `first_name`: "Test"
   - `last_name`: "User"
   - `full_name`: "Test User"
   - `country`: "United States"
3. **Verify** by reading back from `auth.users`, `public.profiles`, and `public.user_roles` to confirm all three rows exist and are linked.

## Technical details

The migration will run roughly:

```sql
INSERT INTO auth.users (
  instance_id, id, aud, role, email,
  encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data,
  created_at, updated_at,
  confirmation_token, email_change, email_change_token_new, recovery_token
)
VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated', 'authenticated',
  'test@gmail.com',
  crypt('test1234', gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"first_name":"Test","last_name":"User","full_name":"Test User","country":"United States"}'::jsonb,
  now(), now(),
  '', '', '', ''
);
```

The `handle_new_user` trigger on `auth.users` already in this project will fire and populate `public.profiles` + `public.user_roles` automatically — no extra inserts needed.

## Important notes

- **`test1234` is 8 characters and weak.** It will work for sign-in here, but if Leaked Password Protection (HIBP) is ever enabled on this project, this password will be rejected on future password changes. Fine for a throwaway test account.
- **`test@gmail.com` is a real-looking address you don't own.** Don't use this account for anything that triggers outbound email (password reset, notifications) — those emails would go to whoever actually owns that Gmail address. For a safer test, consider `test@example.com` instead. Tell me if you'd prefer that and I'll swap it.
- This only inserts the auth user + auto-created profile/role. It does **not** create a `clinician_profiles` row or mark the welcome tour complete — first sign-in will route through the normal onboarding flow, which is probably what you want for testing.
- No frontend code changes. Only a database migration.

## After approval

Switch to default mode → run one migration → verify the three rows exist → you can sign in at `/auth` with `test@gmail.com` / `test1234`.

