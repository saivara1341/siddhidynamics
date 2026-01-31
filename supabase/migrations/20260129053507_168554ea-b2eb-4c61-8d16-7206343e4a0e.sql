-- Drop the overly permissive SELECT policy that exposes user data
DROP POLICY IF EXISTS "Users can view their own entries" ON public.project_waitlist;

-- No SELECT policy = no public read access
-- Admins can view data through Cloud dashboard or edge functions with service role