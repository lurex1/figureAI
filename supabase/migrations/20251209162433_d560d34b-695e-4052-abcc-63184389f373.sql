-- Add new columns to figurine_jobs for the workflow
ALTER TABLE public.figurine_jobs 
ADD COLUMN IF NOT EXISTS model_type text DEFAULT NULL,
ADD COLUMN IF NOT EXISTS validation_status text DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS detected_object text DEFAULT NULL,
ADD COLUMN IF NOT EXISTS credits_consumed boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS quality_report jsonb DEFAULT NULL,
ADD COLUMN IF NOT EXISTS additional_images text[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS user_confirmed boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS rejection_reason text DEFAULT NULL;

-- Add check constraint for model_type
ALTER TABLE public.figurine_jobs 
ADD CONSTRAINT valid_model_type CHECK (
  model_type IS NULL OR model_type IN ('HEAD_MODEL', 'BUILDING_MODEL', 'ANIMAL_MODEL', 'FALLBACK_MODEL')
);

-- Add check constraint for validation_status
ALTER TABLE public.figurine_jobs 
ADD CONSTRAINT valid_validation_status CHECK (
  validation_status IN ('pending', 'analyzing', 'needs_more_images', 'awaiting_confirmation', 'approved', 'rejected', 'processing', 'completed', 'failed')
);