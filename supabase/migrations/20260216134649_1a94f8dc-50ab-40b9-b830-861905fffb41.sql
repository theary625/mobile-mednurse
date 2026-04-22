
CREATE TABLE public.demo_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);

INSERT INTO public.demo_settings (key, value)
VALUES ('base_timezone', 'America/New_York');

ALTER TABLE public.demo_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read" ON public.demo_settings
  FOR SELECT USING (true);

CREATE POLICY "Allow admin update" ON public.demo_settings
  FOR ALL USING (is_admin_or_support(auth.uid()));
