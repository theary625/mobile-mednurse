
CREATE TABLE public.demo_timezones (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tz_value text NOT NULL UNIQUE,
  tz_label text NOT NULL,
  is_active boolean NOT NULL DEFAULT true,
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.demo_timezones ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view timezones" ON public.demo_timezones FOR SELECT USING (true);
CREATE POLICY "Admins can insert timezones" ON public.demo_timezones FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'super_admin'::app_role));
CREATE POLICY "Admins can update timezones" ON public.demo_timezones FOR UPDATE USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'super_admin'::app_role));
CREATE POLICY "Admins can delete timezones" ON public.demo_timezones FOR DELETE USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'super_admin'::app_role));

INSERT INTO public.demo_timezones (tz_value, tz_label, display_order) VALUES
  ('America/New_York', 'Eastern Time (ET)', 1),
  ('America/Chicago', 'Central Time (CT)', 2),
  ('America/Denver', 'Mountain Time (MT)', 3),
  ('America/Los_Angeles', 'Pacific Time (PT)', 4),
  ('America/Anchorage', 'Alaska Time (AKT)', 5),
  ('Pacific/Honolulu', 'Hawaii Time (HT)', 6);
