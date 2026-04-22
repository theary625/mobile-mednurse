-- Add previous_value and new_value columns for enhanced audit trails
ALTER TABLE public.activity_logs 
ADD COLUMN previous_value jsonb DEFAULT NULL,
ADD COLUMN new_value jsonb DEFAULT NULL;

-- Add a comment explaining the columns
COMMENT ON COLUMN public.activity_logs.previous_value IS 'The state of the entity before the change';
COMMENT ON COLUMN public.activity_logs.new_value IS 'The state of the entity after the change';