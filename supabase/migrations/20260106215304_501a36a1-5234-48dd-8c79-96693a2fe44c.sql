-- Create table for Nurse Edith chat conversations
CREATE TABLE public.edith_conversations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL DEFAULT 'New Conversation',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for chat messages
CREATE TABLE public.edith_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id UUID NOT NULL REFERENCES public.edith_conversations(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.edith_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.edith_messages ENABLE ROW LEVEL SECURITY;

-- RLS policies for conversations
CREATE POLICY "Users can view their own conversations" 
ON public.edith_conversations FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own conversations" 
ON public.edith_conversations FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own conversations" 
ON public.edith_conversations FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own conversations" 
ON public.edith_conversations FOR DELETE USING (auth.uid() = user_id);

-- RLS policies for messages (via conversation ownership)
CREATE POLICY "Users can view messages in their conversations" 
ON public.edith_messages FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.edith_conversations 
  WHERE id = conversation_id AND user_id = auth.uid()
));

CREATE POLICY "Users can create messages in their conversations" 
ON public.edith_messages FOR INSERT 
WITH CHECK (EXISTS (
  SELECT 1 FROM public.edith_conversations 
  WHERE id = conversation_id AND user_id = auth.uid()
));

-- Create indexes for performance
CREATE INDEX idx_edith_conversations_user_id ON public.edith_conversations(user_id);
CREATE INDEX idx_edith_messages_conversation_id ON public.edith_messages(conversation_id);

-- Add trigger for updated_at
CREATE TRIGGER update_edith_conversations_updated_at
BEFORE UPDATE ON public.edith_conversations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();