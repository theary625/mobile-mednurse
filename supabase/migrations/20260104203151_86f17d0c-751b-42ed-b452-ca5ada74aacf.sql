-- Create share_events table to track shares
CREATE TABLE public.share_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  share_method TEXT NOT NULL, -- 'copy_link', 'native_share', 'email'
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.share_events ENABLE ROW LEVEL SECURITY;

-- Users can insert their own share events
CREATE POLICY "Users can insert own share events"
  ON public.share_events
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can view their own share events
CREATE POLICY "Users can view own share events"
  ON public.share_events
  FOR SELECT
  USING (auth.uid() = user_id);

-- Admins can view all share events for analytics
CREATE POLICY "Admins can view all share events"
  ON public.share_events
  FOR SELECT
  USING (is_admin_or_support(auth.uid()));

-- Create index for faster queries
CREATE INDEX idx_share_events_user_id ON public.share_events(user_id);
CREATE INDEX idx_share_events_created_at ON public.share_events(created_at DESC);