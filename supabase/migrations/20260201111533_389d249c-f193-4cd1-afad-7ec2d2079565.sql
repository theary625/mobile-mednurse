-- Add video_url column to medications table for educational/demonstration videos
ALTER TABLE public.medications ADD COLUMN IF NOT EXISTS video_url text;