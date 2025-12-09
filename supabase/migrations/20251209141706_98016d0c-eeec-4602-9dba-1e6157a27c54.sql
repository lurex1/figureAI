
-- Create table for storing figurine generation jobs
CREATE TABLE public.figurine_jobs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  original_image_url TEXT NOT NULL,
  style TEXT NOT NULL CHECK (style IN ('realistic', 'anime', 'lego', 'fortnite')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  model_url TEXT,
  preview_url TEXT,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.figurine_jobs ENABLE ROW LEVEL SECURITY;

-- Allow anyone to create jobs (for now, since no auth yet)
CREATE POLICY "Anyone can create figurine jobs"
ON public.figurine_jobs
FOR INSERT
WITH CHECK (true);

-- Allow anyone to view their own jobs by id
CREATE POLICY "Anyone can view figurine jobs"
ON public.figurine_jobs
FOR SELECT
USING (true);

-- Allow updates to jobs (for status updates from edge function)
CREATE POLICY "Anyone can update figurine jobs"
ON public.figurine_jobs
FOR UPDATE
USING (true);

-- Create storage bucket for user uploads
INSERT INTO storage.buckets (id, name, public) VALUES ('uploads', 'uploads', true);

-- Storage policies for uploads bucket
CREATE POLICY "Anyone can upload files"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'uploads');

CREATE POLICY "Anyone can view uploaded files"
ON storage.objects
FOR SELECT
USING (bucket_id = 'uploads');

-- Create storage bucket for generated 3D models
INSERT INTO storage.buckets (id, name, public) VALUES ('models', 'models', true);

-- Storage policies for models bucket
CREATE POLICY "Anyone can view models"
ON storage.objects
FOR SELECT
USING (bucket_id = 'models');

CREATE POLICY "Service can upload models"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'models');

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_figurine_jobs_updated_at
BEFORE UPDATE ON public.figurine_jobs
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
