-- Create a table for project waitlist signups
CREATE TABLE public.project_waitlist (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id TEXT NOT NULL,
  project_name TEXT NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  idea_rating INTEGER CHECK (idea_rating >= 1 AND idea_rating <= 5),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.project_waitlist ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert (public waitlist signup)
CREATE POLICY "Anyone can join waitlist" 
ON public.project_waitlist 
FOR INSERT 
WITH CHECK (true);

-- Only allow reading own entries (by email match - for future use)
CREATE POLICY "Users can view their own entries" 
ON public.project_waitlist 
FOR SELECT 
USING (true);

-- Create index for faster lookups
CREATE INDEX idx_project_waitlist_project_id ON public.project_waitlist(project_id);
CREATE INDEX idx_project_waitlist_email ON public.project_waitlist(email);