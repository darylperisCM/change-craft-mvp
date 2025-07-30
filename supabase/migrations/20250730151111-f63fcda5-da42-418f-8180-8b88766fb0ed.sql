-- First, let's check and fix the secrets table that likely has RLS enabled but no policies
-- Create policies for the secrets table if needed

-- Add RLS policies for secrets table (this should be admin-only access)
CREATE POLICY "Only service role can access secrets" ON public.secrets
FOR ALL
USING (false);

-- Create a proper profiles table with RLS policies if it doesn't exist properly
-- Check if we need to add any missing policies to existing tables

-- Ensure assessments table has proper RLS policies (it already seems to have them)
-- Ensure profiles table has proper RLS policies (it already seems to have them)

-- Let's also ensure we have proper database functions for authentication
CREATE OR REPLACE FUNCTION public.get_user_id()
RETURNS uuid
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT auth.uid();
$$;

-- Function to check if user exists in profiles
CREATE OR REPLACE FUNCTION public.user_has_profile()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid()
  );
$$;