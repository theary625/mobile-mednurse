-- Create membership plan enum
CREATE TYPE public.membership_plan AS ENUM ('free', 'pro', 'premium', 'enterprise');

-- Create billing status enum
CREATE TYPE public.billing_status AS ENUM ('active', 'past_due', 'cancelled', 'trialing', 'paused');

-- Create user memberships table
CREATE TABLE public.user_memberships (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  plan membership_plan NOT NULL DEFAULT 'free',
  billing_status billing_status NOT NULL DEFAULT 'active',
  started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE,
  trial_ends_at TIMESTAMP WITH TIME ZONE,
  cancelled_at TIMESTAMP WITH TIME ZONE,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  features JSONB DEFAULT '[]'::jsonb,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.user_memberships ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own membership"
ON public.user_memberships
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all memberships"
ON public.user_memberships
FOR SELECT
USING (is_admin_or_support(auth.uid()));

CREATE POLICY "Admins can manage all memberships"
ON public.user_memberships
FOR ALL
USING (has_role(auth.uid(), 'admin'));

-- Create trigger for updated_at
CREATE TRIGGER update_user_memberships_updated_at
BEFORE UPDATE ON public.user_memberships
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add index for faster lookups
CREATE INDEX idx_user_memberships_plan ON public.user_memberships(plan);
CREATE INDEX idx_user_memberships_billing_status ON public.user_memberships(billing_status);
CREATE INDEX idx_user_memberships_expires_at ON public.user_memberships(expires_at);