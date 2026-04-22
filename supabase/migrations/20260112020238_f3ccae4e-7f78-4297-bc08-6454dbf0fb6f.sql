-- Create enum for account types
CREATE TYPE public.account_type AS ENUM ('personal', 'work');

-- Create account_profiles table for multi-account support
CREATE TABLE public.account_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  account_type public.account_type NOT NULL,
  profile_name TEXT NOT NULL,
  organization_name TEXT,
  is_active BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, account_type)
);

-- Enable RLS
ALTER TABLE public.account_profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies - users can only access their own account profiles
CREATE POLICY "Users can view their own account profiles"
ON public.account_profiles
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own account profiles"
ON public.account_profiles
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own account profiles"
ON public.account_profiles
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own account profiles"
ON public.account_profiles
FOR DELETE
USING (auth.uid() = user_id);

-- Trigger for updated_at
CREATE TRIGGER update_account_profiles_updated_at
BEFORE UPDATE ON public.account_profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Function to ensure only one active account per user
CREATE OR REPLACE FUNCTION public.ensure_single_active_account()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.is_active = true THEN
    UPDATE public.account_profiles
    SET is_active = false
    WHERE user_id = NEW.user_id AND id != NEW.id;
  END IF;
  RETURN NEW;
END;
$$;

-- Trigger to enforce single active account
CREATE TRIGGER enforce_single_active_account
BEFORE INSERT OR UPDATE ON public.account_profiles
FOR EACH ROW
EXECUTE FUNCTION public.ensure_single_active_account();

-- Function to create default personal account for new users
CREATE OR REPLACE FUNCTION public.create_default_account_profile()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.account_profiles (user_id, account_type, profile_name, is_active)
  VALUES (NEW.id, 'personal', 'Personal Account', true);
  RETURN NEW;
END;
$$;

-- Trigger to auto-create personal account on user signup
CREATE TRIGGER on_auth_user_created_account_profile
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.create_default_account_profile();