-- Create table for user's favorite clinical tools
CREATE TABLE public.user_tool_favorites (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  tool_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, tool_id)
);

-- Enable RLS
ALTER TABLE public.user_tool_favorites ENABLE ROW LEVEL SECURITY;

-- Users can view their own favorites
CREATE POLICY "Users can view own favorites"
ON public.user_tool_favorites
FOR SELECT
USING (auth.uid() = user_id);

-- Users can add their own favorites (max 5 enforced in app)
CREATE POLICY "Users can add own favorites"
ON public.user_tool_favorites
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can remove their own favorites
CREATE POLICY "Users can delete own favorites"
ON public.user_tool_favorites
FOR DELETE
USING (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX idx_user_tool_favorites_user_id ON public.user_tool_favorites(user_id);