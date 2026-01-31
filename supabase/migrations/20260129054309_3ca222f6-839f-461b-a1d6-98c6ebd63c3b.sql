-- Create contact_submissions table for the Connect With Us form
CREATE TABLE public.contact_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  designation TEXT,
  organization TEXT,
  inquiry_type TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

-- Allow public inserts (anyone can submit the contact form)
CREATE POLICY "Allow public contact form submissions"
ON public.contact_submissions
FOR INSERT
WITH CHECK (true);

-- No SELECT policy = admin only via dashboard (protects user data)