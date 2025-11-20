-- Create mixtapes table to store all created mixtapes
CREATE TABLE IF NOT EXISTS public.mixtapes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  to_name TEXT NOT NULL,
  from_name TEXT NOT NULL,
  message TEXT NOT NULL,
  youtube_link TEXT NOT NULL,
  cassette_body_color TEXT NOT NULL DEFAULT '#D4A574',
  cassette_label_color TEXT NOT NULL DEFAULT '#F5E6D3',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.mixtapes ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to view mixtapes (for sharing)
CREATE POLICY "Anyone can view mixtapes"
  ON public.mixtapes
  FOR SELECT
  USING (true);

-- Create policy to allow anyone to create mixtapes
CREATE POLICY "Anyone can create mixtapes"
  ON public.mixtapes
  FOR INSERT
  WITH CHECK (true);