-- Add medication content review workflow fields
ALTER TABLE public.medications
ADD COLUMN IF NOT EXISTS content_status TEXT DEFAULT 'draft' CHECK (content_status IN ('draft', 'pending_review', 'approved', 'rejected')),
ADD COLUMN IF NOT EXISTS last_synced_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS sync_source TEXT,
ADD COLUMN IF NOT EXISTS reviewed_by UUID,
ADD COLUMN IF NOT EXISTS reviewed_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS review_notes TEXT,
ADD COLUMN IF NOT EXISTS ai_generated_content JSONB,
ADD COLUMN IF NOT EXISTS openfda_data JSONB;

-- Create index for filtering by content status
CREATE INDEX IF NOT EXISTS idx_medications_content_status ON public.medications(content_status);

-- Create a table to track sync history
CREATE TABLE IF NOT EXISTS public.medication_sync_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  sync_type TEXT NOT NULL CHECK (sync_type IN ('openfda', 'ai_nursing_guide', 'manual')),
  medications_updated INTEGER DEFAULT 0,
  medications_created INTEGER DEFAULT 0,
  errors JSONB,
  started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE,
  initiated_by UUID,
  status TEXT DEFAULT 'running' CHECK (status IN ('running', 'completed', 'failed'))
);

-- Enable RLS
ALTER TABLE public.medication_sync_logs ENABLE ROW LEVEL SECURITY;

-- Only admins can view and manage sync logs
CREATE POLICY "Admins can manage sync logs" 
ON public.medication_sync_logs 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));