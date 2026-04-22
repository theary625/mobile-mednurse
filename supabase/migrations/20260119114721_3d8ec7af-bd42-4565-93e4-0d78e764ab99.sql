-- Add FDA label data columns to medications table
ALTER TABLE public.medications ADD COLUMN IF NOT EXISTS fda_label_data jsonb;
ALTER TABLE public.medications ADD COLUMN IF NOT EXISTS fda_label_url text;
ALTER TABLE public.medications ADD COLUMN IF NOT EXISTS fda_label_revision_date text;
ALTER TABLE public.medications ADD COLUMN IF NOT EXISTS fda_set_id text;

-- Add index for fda_set_id lookups
CREATE INDEX IF NOT EXISTS idx_medications_fda_set_id ON public.medications(fda_set_id) WHERE fda_set_id IS NOT NULL;

-- Add comment for documentation
COMMENT ON COLUMN public.medications.fda_label_data IS 'Full structured data extracted from FDA prescribing label via DailyMed';
COMMENT ON COLUMN public.medications.fda_label_url IS 'Source URL of the FDA label on DailyMed';
COMMENT ON COLUMN public.medications.fda_label_revision_date IS 'Revision date of the FDA label';
COMMENT ON COLUMN public.medications.fda_set_id IS 'DailyMed Set ID for the FDA label';