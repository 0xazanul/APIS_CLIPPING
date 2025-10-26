import { getSupabase } from '../config/supabase'

export class ParticipationService {
  /**
   * Clipper participates in a campaign
   */
  static async participateInCampaign(campaignId: string, clipperId: string) {
    const supabase = getSupabase()

    // Check if campaign exists and is active
    const { data: campaign, error: campaignError } = await supabase
      .from('campaigns')
      .select('id, name, status')
      .eq('id', campaignId)
      .single()

    if (campaignError || !campaign) {
      throw new Error('Campaign not found')
    }

    if (campaign.status !== 'active') {
      throw new Error('Campaign is not active')
    }

    // Check if already participated
    const { data: existing } = await supabase
      .from('campaign_participants')
      .select('id')
      .eq('campaign_id', campaignId)
      .eq('clipper_id', clipperId)
      .maybeSingle()

    if (existing) {
      throw new Error('You have already participated in this campaign')
    }

    // Create participation
    const { data: participation, error } = await supabase
      .from('campaign_participants')
      .insert({
        campaign_id: campaignId,
        clipper_id: clipperId,
        status: 'pending',
      })
      .select()
      .single()

    if (error) {
      throw new Error(error.message)
    }

    return { 
      participation,
      message: 'Successfully participated in campaign' 
    }
  }

  /**
   * Get clipper's own participations
   */
  static async getMyParticipations(clipperId: string) {
    const supabase = getSupabase()

    const { data: participations, error } = await supabase
      .from('campaign_participants')
      .select(`
        id,
        campaign_id,
        status,
        participated_at,
        campaigns!campaign_participants_campaign_id_fkey (
          name,
          description,
          brand_id,
          profiles!campaigns_brand_id_fkey (
            email
          )
        )
      `)
      .eq('clipper_id', clipperId)
      .order('participated_at', { ascending: false })

    if (error) {
      throw new Error(error.message)
    }

    // Transform data
    const transformedParticipations = participations?.map((p: any) => ({
      id: p.id,
      campaign_id: p.campaign_id,
      campaign_name: p.campaigns?.name,
      campaign_description: p.campaigns?.description,
      brand_email: p.campaigns?.profiles?.email,
      status: p.status,
      participated_at: p.participated_at,
    }))

    return { participations: transformedParticipations }
  }

  /**
   * Get participants for a specific campaign (Brand only - their campaigns)
   */
  static async getCampaignParticipants(campaignId: string, brandId: string) {
    const supabase = getSupabase()

    // Verify campaign ownership
    const { data: campaign, error: campaignError } = await supabase
      .from('campaigns')
      .select('id, brand_id')
      .eq('id', campaignId)
      .eq('brand_id', brandId)
      .single()

    if (campaignError || !campaign) {
      throw new Error('Campaign not found or unauthorized')
    }

    // Get participants
    const { data: participants, error } = await supabase
      .from('campaign_participants')
      .select(`
        id,
        campaign_id,
        clipper_id,
        status,
        participated_at,
        profiles!campaign_participants_clipper_id_fkey (
          email
        )
      `)
      .eq('campaign_id', campaignId)
      .order('participated_at', { ascending: false })

    if (error) {
      throw new Error(error.message)
    }

    // Transform data
    const transformedParticipants = participants?.map((p: any) => ({
      id: p.id,
      campaign_id: p.campaign_id,
      clipper_id: p.clipper_id,
      clipper_email: p.profiles?.email,
      status: p.status,
      participated_at: p.participated_at,
    }))

    return { participants: transformedParticipants }
  }

  /**
   * Get participant count for campaigns (Brand)
   */
  static async getCampaignParticipantCounts(campaignIds: string[]) {
    const supabase = getSupabase()

    const { data, error } = await supabase
      .from('campaign_participants')
      .select('campaign_id')
      .in('campaign_id', campaignIds)

    if (error) {
      throw new Error(error.message)
    }

    // Count participants per campaign
    const counts: Record<string, number> = {}
    data?.forEach((p: any) => {
      counts[p.campaign_id] = (counts[p.campaign_id] || 0) + 1
    })

    return counts
  }
}
