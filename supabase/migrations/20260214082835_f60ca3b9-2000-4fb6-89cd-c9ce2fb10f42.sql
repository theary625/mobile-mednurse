
-- Create demo_time_slot_overrides table
CREATE TABLE public.demo_time_slot_overrides (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  scope_type text NOT NULL CHECK (scope_type IN ('date', 'month', 'year')),
  scope_value text NOT NULL UNIQUE,
  time_slots text[] NOT NULL DEFAULT '{}',
  reason text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.demo_time_slot_overrides ENABLE ROW LEVEL SECURITY;

-- Anyone can view overrides (needed for public scheduling page)
CREATE POLICY "Anyone can view time slot overrides"
ON public.demo_time_slot_overrides
FOR SELECT
USING (true);

-- Admins can insert overrides
CREATE POLICY "Admins can insert time slot overrides"
ON public.demo_time_slot_overrides
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'super_admin'::app_role));

-- Admins can update overrides
CREATE POLICY "Admins can update time slot overrides"
ON public.demo_time_slot_overrides
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'super_admin'::app_role));

-- Admins can delete overrides
CREATE POLICY "Admins can delete time slot overrides"
ON public.demo_time_slot_overrides
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'super_admin'::app_role));
