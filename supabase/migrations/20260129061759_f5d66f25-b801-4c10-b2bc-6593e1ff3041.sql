-- =============================================
-- FIX 1: Server-Side Input Validation via Database Constraints
-- =============================================

-- Add constraints to project_waitlist table
ALTER TABLE public.project_waitlist
  ADD CONSTRAINT check_waitlist_name_length 
    CHECK (char_length(name) > 0 AND char_length(name) <= 100),
  ADD CONSTRAINT check_waitlist_email_format 
    CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
  ADD CONSTRAINT check_waitlist_rating_range 
    CHECK (idea_rating IS NULL OR (idea_rating >= 1 AND idea_rating <= 5)),
  ADD CONSTRAINT check_waitlist_project_id_length 
    CHECK (char_length(project_id) > 0 AND char_length(project_id) <= 100),
  ADD CONSTRAINT check_waitlist_project_name_length 
    CHECK (char_length(project_name) > 0 AND char_length(project_name) <= 200);

-- Add constraints to contact_submissions table
ALTER TABLE public.contact_submissions
  ADD CONSTRAINT check_contact_name_length 
    CHECK (char_length(name) > 0 AND char_length(name) <= 100),
  ADD CONSTRAINT check_contact_email_format 
    CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
  ADD CONSTRAINT check_contact_message_length 
    CHECK (char_length(message) >= 10 AND char_length(message) <= 2000),
  ADD CONSTRAINT check_contact_inquiry_type 
    CHECK (inquiry_type IN ('problem', 'requirement', 'inquiry')),
  ADD CONSTRAINT check_contact_designation_length 
    CHECK (designation IS NULL OR char_length(designation) <= 100),
  ADD CONSTRAINT check_contact_organization_length 
    CHECK (organization IS NULL OR char_length(organization) <= 100);

-- =============================================
-- FIX 2: Rate Limiting via Database Triggers
-- =============================================

-- Rate limiting function for waitlist submissions (1 submission per email per minute)
CREATE OR REPLACE FUNCTION public.check_waitlist_rate_limit()
RETURNS TRIGGER AS $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM public.project_waitlist
    WHERE email = NEW.email
    AND created_at > NOW() - INTERVAL '1 minute'
  ) THEN
    RAISE EXCEPTION 'Please wait before submitting again';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Rate limiting function for contact submissions (1 submission per email per minute)
CREATE OR REPLACE FUNCTION public.check_contact_rate_limit()
RETURNS TRIGGER AS $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM public.contact_submissions
    WHERE email = NEW.email
    AND created_at > NOW() - INTERVAL '1 minute'
  ) THEN
    RAISE EXCEPTION 'Please wait before submitting again';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create triggers for rate limiting
CREATE TRIGGER prevent_rapid_waitlist_submission
  BEFORE INSERT ON public.project_waitlist
  FOR EACH ROW EXECUTE FUNCTION public.check_waitlist_rate_limit();

CREATE TRIGGER prevent_rapid_contact_submission
  BEFORE INSERT ON public.contact_submissions
  FOR EACH ROW EXECUTE FUNCTION public.check_contact_rate_limit();