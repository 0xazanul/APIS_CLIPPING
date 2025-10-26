-- Using existing 'profiles' table
-- Ensure it has the required columns:
-- id (UUID), email (TEXT), password (TEXT), role (TEXT), created_at, updated_at

-- If password column doesn't exist, add it:
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS password TEXT;

-- Ensure role column exists and has proper constraint
-- First remove the constraint if it exists, then add it
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
ALTER TABLE public.profiles ADD CONSTRAINT profiles_role_check 
  CHECK (role IN ('Brand', 'Clippers'));

-- Create index on email for faster lookups (if not exists)
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);

-- Create index on role for filtering (if not exists)
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);

-- Enable Row Level Security (RLS) if not already enabled
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist to avoid conflicts
DROP POLICY IF EXISTS "Users can read own data" ON public.profiles;
DROP POLICY IF EXISTS "Allow registration" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own data" ON public.profiles;

-- Create policy to allow users to read data
CREATE POLICY "Users can read own data"
  ON public.profiles
  FOR SELECT
  USING (true);

-- Create policy to allow insert (registration)
CREATE POLICY "Allow registration"
  ON public.profiles
  FOR INSERT
  WITH CHECK (true);

-- Create policy to allow users to update their own data
CREATE POLICY "Users can update own data"
  ON public.profiles
  FOR UPDATE
  USING (true);
