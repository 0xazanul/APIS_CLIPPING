-- ================================================================
-- CAMPAIGN PARTICIPANTS TABLE SETUP
-- Run this script in Supabase SQL Editor AFTER campaigns table
-- ================================================================

-- 1. Create campaign_participants table
CREATE TABLE IF NOT EXISTS public.campaign_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID NOT NULL REFERENCES public.campaigns(id) ON DELETE CASCADE,
  clipper_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  participated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(campaign_id, clipper_id)
);

-- 2. Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_campaign_participants_campaign_id ON public.campaign_participants(campaign_id);
CREATE INDEX IF NOT EXISTS idx_campaign_participants_clipper_id ON public.campaign_participants(clipper_id);
CREATE INDEX IF NOT EXISTS idx_campaign_participants_status ON public.campaign_participants(status);

-- 3. Enable Row Level Security
ALTER TABLE public.campaign_participants ENABLE ROW LEVEL SECURITY;

-- 4. Drop existing policies
DROP POLICY IF EXISTS "Allow all to read" ON public.campaign_participants;
DROP POLICY IF EXISTS "Allow insert" ON public.campaign_participants;
DROP POLICY IF EXISTS "Allow update" ON public.campaign_participants;
DROP POLICY IF EXISTS "Allow delete" ON public.campaign_participants;

-- 5. Create RLS policies
CREATE POLICY "Allow all to read" ON public.campaign_participants 
  FOR SELECT USING (true);

CREATE POLICY "Allow insert" ON public.campaign_participants 
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow update" ON public.campaign_participants 
  FOR UPDATE USING (true);

CREATE POLICY "Allow delete" ON public.campaign_participants 
  FOR DELETE USING (true);

-- 6. Verify the table structure
SELECT 
  column_name, 
  data_type, 
  column_default, 
  is_nullable
FROM information_schema.columns
WHERE table_name = 'campaign_participants' AND table_schema = 'public'
ORDER BY ordinal_position;

-- ================================================================
-- Campaign participants table setup complete!
-- ================================================================
