-- Add credits_balance column to subscriptions table
ALTER TABLE public.subscriptions 
ADD COLUMN credits_balance integer NOT NULL DEFAULT 0;

-- Add credits_cost column to figurine_jobs to track how many credits were used
ALTER TABLE public.figurine_jobs 
ADD COLUMN credits_cost integer DEFAULT 5;

-- Create function to deduct credits
CREATE OR REPLACE FUNCTION public.deduct_credits(p_user_id uuid, p_amount integer)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  current_balance integer;
BEGIN
  -- Get current balance
  SELECT credits_balance INTO current_balance
  FROM subscriptions
  WHERE user_id = p_user_id;
  
  -- Check if enough credits
  IF current_balance IS NULL OR current_balance < p_amount THEN
    RETURN false;
  END IF;
  
  -- Deduct credits
  UPDATE subscriptions
  SET credits_balance = credits_balance - p_amount,
      updated_at = now()
  WHERE user_id = p_user_id;
  
  RETURN true;
END;
$$;

-- Create function to add credits (for purchases)
CREATE OR REPLACE FUNCTION public.add_credits(p_user_id uuid, p_amount integer)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE subscriptions
  SET credits_balance = credits_balance + p_amount,
      updated_at = now()
  WHERE user_id = p_user_id;
END;
$$;