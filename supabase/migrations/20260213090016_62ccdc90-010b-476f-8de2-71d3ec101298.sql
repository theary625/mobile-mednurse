
-- Create demo_time_slots table
CREATE TABLE public.demo_time_slots (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  time_label text NOT NULL,
  display_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.demo_time_slots ENABLE ROW LEVEL SECURITY;

-- Anyone can view slots (public booking page needs them)
CREATE POLICY "Anyone can view time slots"
ON public.demo_time_slots
FOR SELECT
USING (true);

-- Admins and super_admins can insert
CREATE POLICY "Admins can insert time slots"
ON public.demo_time_slots
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'super_admin'::app_role));

-- Admins and super_admins can update
CREATE POLICY "Admins can update time slots"
ON public.demo_time_slots
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'super_admin'::app_role));

-- Admins and super_admins can delete
CREATE POLICY "Admins can delete time slots"
ON public.demo_time_slots
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'super_admin'::app_role));

-- Seed data: 14 existing time slots
INSERT INTO public.demo_time_slots (time_label, display_order) VALUES
  ('9:00 AM', 1),
  ('9:30 AM', 2),
  ('10:00 AM', 3),
  ('10:30 AM', 4),
  ('11:00 AM', 5),
  ('11:30 AM', 6),
  ('1:00 PM', 7),
  ('1:30 PM', 8),
  ('2:00 PM', 9),
  ('2:30 PM', 10),
  ('3:00 PM', 11),
  ('3:30 PM', 12),
  ('4:00 PM', 13),
  ('4:30 PM', 14);
