
-- Create demo_email_templates table
CREATE TABLE public.demo_email_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  template_key text UNIQUE NOT NULL,
  subject text NOT NULL DEFAULT '',
  greeting text NOT NULL DEFAULT '',
  body_text text NOT NULL DEFAULT '',
  closing_text text NOT NULL DEFAULT '',
  updated_at timestamptz NOT NULL DEFAULT now(),
  updated_by uuid NULL
);

-- Enable RLS
ALTER TABLE public.demo_email_templates ENABLE ROW LEVEL SECURITY;

-- Anyone can read templates (needed by edge function via service role, safe for anon)
CREATE POLICY "Anyone can view email templates"
ON public.demo_email_templates FOR SELECT
USING (true);

-- Admins/super_admins can insert
CREATE POLICY "Admins can insert email templates"
ON public.demo_email_templates FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'super_admin'::app_role));

-- Admins/super_admins can update
CREATE POLICY "Admins can update email templates"
ON public.demo_email_templates FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'super_admin'::app_role));

-- Admins/super_admins can delete
CREATE POLICY "Admins can delete email templates"
ON public.demo_email_templates FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'super_admin'::app_role));

-- Auto-update updated_at
CREATE TRIGGER update_demo_email_templates_updated_at
BEFORE UPDATE ON public.demo_email_templates
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Seed default template
INSERT INTO public.demo_email_templates (template_key, subject, greeting, body_text, closing_text)
VALUES (
  'customer_confirmation',
  'Your MedNurse Demo is Confirmed!',
  'Hi {name},',
  'Thank you for scheduling a demo with MedNurse. Here are your booking details:

📅 Date: {date}
🕐 Time: {time} ({timezone})

A member of our team will reach out with meeting details shortly. We look forward to showing you how MedNurse can transform medication safety at your organization.',
  'Best regards,
The MedNurse Team'
);
