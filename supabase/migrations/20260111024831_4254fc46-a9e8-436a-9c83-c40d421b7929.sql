-- Create testimonials table
CREATE TABLE public.testimonials (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  quote TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  experience TEXT,
  rating INTEGER NOT NULL DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  feature_page TEXT NOT NULL DEFAULT 'ask-edith',
  is_published BOOLEAN NOT NULL DEFAULT true,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

-- Anyone can view published testimonials
CREATE POLICY "Anyone can view published testimonials"
ON public.testimonials
FOR SELECT
USING (is_published = true);

-- Admins can manage all testimonials
CREATE POLICY "Admins can manage testimonials"
ON public.testimonials
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create trigger for updated_at
CREATE TRIGGER update_testimonials_updated_at
BEFORE UPDATE ON public.testimonials
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert initial testimonials for Ask Edith
INSERT INTO public.testimonials (quote, name, role, experience, rating, feature_page, display_order) VALUES
('Edith has become my go-to during night shifts. When I''m unsure about a medication interaction at 3 AM, she''s always there with accurate, clear answers. It''s like having a pharmacist in my pocket.', 'Sarah M.', 'ICU Nurse', '8 years experience', 5, 'ask-edith', 1),
('As a new grad, I was constantly second-guessing myself. Edith helped me build confidence by explaining not just what to do, but why. The dosage calculations are a lifesaver!', 'Marcus J.', 'Med-Surg RN', '1 year experience', 5, 'ask-edith', 2),
('I''ve been nursing for 20 years and still learn something new from Edith. The opioid equivalency calculator alone has prevented so many errors. Every nurse needs this.', 'Patricia R.', 'Oncology Nurse', '20 years experience', 5, 'ask-edith', 3),
('The best part is how quickly I get answers. In the ER, every second counts. Edith gives me the info I need without having to dig through multiple resources.', 'David L.', 'Emergency Department RN', '5 years experience', 5, 'ask-edith', 4),
('I recommended Edith to my entire floor. The conversation history feature is amazing - I can refer back to previous questions during report or when a similar situation comes up.', 'Jennifer K.', 'Charge Nurse, Cardiac Unit', '12 years experience', 5, 'ask-edith', 5),
('Finally, an AI that understands nursing! The clinical pearls and nursing considerations are spot-on. It''s clear this was designed by people who know what we actually need.', 'Amanda T.', 'NICU Nurse', '6 years experience', 5, 'ask-edith', 6);