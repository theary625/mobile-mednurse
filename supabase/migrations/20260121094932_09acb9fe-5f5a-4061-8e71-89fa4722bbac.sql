-- Create demo_bookings table to store scheduled demo requests
CREATE TABLE public.demo_bookings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT,
  phone TEXT,
  scheduled_date DATE NOT NULL,
  scheduled_time TEXT NOT NULL,
  timezone TEXT NOT NULL DEFAULT 'America/New_York',
  message TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.demo_bookings ENABLE ROW LEVEL SECURITY;

-- Anyone can create a demo booking (public form)
CREATE POLICY "Anyone can create demo bookings"
  ON public.demo_bookings
  FOR INSERT
  WITH CHECK (true);

-- Admins and support can view all bookings
CREATE POLICY "Admins can view all demo bookings"
  ON public.demo_bookings
  FOR SELECT
  USING (is_admin_or_support(auth.uid()));

-- Admins can update bookings
CREATE POLICY "Admins can update demo bookings"
  ON public.demo_bookings
  FOR UPDATE
  USING (is_admin_or_support(auth.uid()));

-- Admins can delete bookings
CREATE POLICY "Admins can delete demo bookings"
  ON public.demo_bookings
  FOR DELETE
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Create trigger for updated_at
CREATE TRIGGER update_demo_bookings_updated_at
  BEFORE UPDATE ON public.demo_bookings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();