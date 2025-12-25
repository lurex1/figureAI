-- Tighten access rules for figurine jobs and subscriptions

-- figurine_jobs: replace public policies with owner-only policies
ALTER TABLE public.figurine_jobs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can create figurine jobs" ON public.figurine_jobs;
DROP POLICY IF EXISTS "Anyone can update figurine jobs" ON public.figurine_jobs;
DROP POLICY IF EXISTS "Anyone can view figurine jobs" ON public.figurine_jobs;

CREATE POLICY "Users can create their own figurine jobs"
ON public.figurine_jobs
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own figurine jobs"
ON public.figurine_jobs
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own figurine jobs"
ON public.figurine_jobs
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own figurine jobs"
ON public.figurine_jobs
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- subscriptions: remove overly-permissive policy (service access doesn't need a public policy)
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Service role can manage all subscriptions" ON public.subscriptions;
