
CREATE TABLE public.user_medication_favorites (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  medication_name TEXT NOT NULL,
  drug_class TEXT,
  high_alert BOOLEAN DEFAULT false,
  note TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, medication_name)
);

ALTER TABLE public.user_medication_favorites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own medication favorites"
  ON public.user_medication_favorites
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own medication favorites"
  ON public.user_medication_favorites
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own medication favorites"
  ON public.user_medication_favorites
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own medication favorites"
  ON public.user_medication_favorites
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE TRIGGER update_user_medication_favorites_updated_at
  BEFORE UPDATE ON public.user_medication_favorites
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
