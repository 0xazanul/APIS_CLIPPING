-- ================================================================
-- CAMPAIGNS TABLE SETUP
-- Run this script in Supabase SQL Editor
-- ================================================================

-- 1. Create campaigns table
CREATE TABLE IF NOT EXISTS public.campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  rules TEXT NOT NULL,
  budget NUMERIC(10, 2) NOT NULL CHECK (budget > 0),
  assets_link TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'paused')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_campaigns_brand_id ON public.campaigns(brand_id);
CREATE INDEX IF NOT EXISTS idx_campaigns_status ON public.campaigns(status);
CREATE INDEX IF NOT EXISTS idx_campaigns_created_at ON public.campaigns(created_at DESC);

-- 3. Enable Row Level Security
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;

-- 4. Drop existing policies
DROP POLICY IF EXISTS "Brands can create campaigns" ON public.campaigns;
DROP POLICY IF EXISTS "Brands can view own campaigns" ON public.campaigns;
DROP POLICY IF EXISTS "Brands can update own campaigns" ON public.campaigns;
DROP POLICY IF EXISTS "Brands can delete own campaigns" ON public.campaigns;
DROP POLICY IF EXISTS "Clippers can view all active campaigns" ON public.campaigns;
DROP POLICY IF EXISTS "Allow all to read" ON public.campaigns;
DROP POLICY IF EXISTS "Allow insert" ON public.campaigns;
DROP POLICY IF EXISTS "Allow update" ON public.campaigns;
DROP POLICY IF EXISTS "Allow delete" ON public.campaigns;

-- 5. Create RLS policies
-- Allow all operations for now (can be restricted later)
CREATE POLICY "Allow all to read" ON public.campaigns 
  FOR SELECT USING (true);

CREATE POLICY "Allow insert" ON public.campaigns 
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow update" ON public.campaigns 
  FOR UPDATE USING (true);

CREATE POLICY "Allow delete" ON public.campaigns 
  FOR DELETE USING (true);

-- 6. Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_campaigns_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 7. Create trigger for updated_at
DROP TRIGGER IF EXISTS campaigns_updated_at ON public.campaigns;
CREATE TRIGGER campaigns_updated_at
  BEFORE UPDATE ON public.campaigns
  FOR EACH ROW
  EXECUTE FUNCTION update_campaigns_updated_at();

-- 8. Verify the table structure
SELECT 
  column_name, 
  data_type, 
  column_default, 
  is_nullable
FROM information_schema.columns
WHERE table_name = 'campaigns' AND table_schema = 'public'
ORDER BY ordinal_position;

-- ================================================================
-- Campaigns table setup complete!
-- ================================================================
