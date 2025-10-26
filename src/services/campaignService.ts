import { getSupabase } from '../config/supabase'
import type { CreateCampaign, UpdateCampaign } from '../models/campaign'
import { ParticipationService } from './participationService'

export class CampaignService {
  /**
   * Create a new campaign (Brand only)
   */
  static async createCampaign(brandId: string, data: CreateCampaign) {
    const supabase = getSupabase()

    const { data: campaign, error } = await supabase
      .from('campaigns')
      .insert({
        brand_id: brandId,
        name: data.name,
        description: data.description,
        rules: data.rules,
        budget: data.budget,
        assets_link: data.assets_link,
        status: 'active',
      })
      .select()
      .single()

    if (error) {
      throw new Error(error.message)
    }

    return { campaign }
  }

  /**
   * Get all campaigns for a brand (Brand only - own campaigns)
   */
  static async getBrandCampaigns(brandId: string) {
    const supabase = getSupabase()

    const { data: campaigns, error } = await supabase
      .from('campaigns')
      .select('*')
      .eq('brand_id', brandId)
      .order('created_at', { ascending: false })

    if (error) {
      throw new Error(error.message)
    }

    // Get participant counts for all campaigns
    const campaignIds = campaigns?.map(c => c.id) || []
    const counts = await ParticipationService.getCampaignParticipantCounts(campaignIds)

    // Add participant count to each campaign
    const campaignsWithCounts = campaigns?.map(c => ({
      ...c,
      participants_count: counts[c.id] || 0,
    }))

    return { campaigns: campaignsWithCounts }
  }

  /**
   * Get all active campaigns (Clipper - view all brands' campaigns)
   */
  static async getAllActiveCampaigns() {
    const supabase = getSupabase()

    const { data: campaigns, error } = await supabase
      .from('campaigns')
      .select(`
        *,
        profiles!campaigns_brand_id_fkey (
          email
        )
      `)
      .eq('status', 'active')
      .order('created_at', { ascending: false })

    if (error) {
      throw new Error(error.message)
    }

    // Transform data to include brand_email
    const transformedCampaigns = campaigns?.map((campaign: any) => ({
      ...campaign,
      brand_email: campaign.profiles?.email,
      profiles: undefined, // Remove nested object
    }))

    return { campaigns: transformedCampaigns }
  }

  /**
   * Get a single campaign by ID
   */
  static async getCampaignById(campaignId: string, brandId?: string) {
    const supabase = getSupabase()

    let query = supabase
      .from('campaigns')
      .select(`
        *,
        profiles!campaigns_brand_id_fkey (
          email
        )
      `)
      .eq('id', campaignId)

    // If brandId provided, ensure it's their campaign
    if (brandId) {
      query = query.eq('brand_id', brandId)
    }

    const { data: campaign, error } = await supabase
      .from('campaigns')
      .select('*')
      .eq('id', campaignId)
      .maybeSingle()

    if (error) {
      throw new Error(error.message)
    }

    if (!campaign) {
      throw new Error('Campaign not found')
    }

    // If brandId provided, verify ownership
    if (brandId && campaign.brand_id !== brandId) {
      throw new Error('Unauthorized - not your campaign')
    }

    return { campaign }
  }

  /**
   * Update campaign (Brand only - own campaigns)
   */
  static async updateCampaign(campaignId: string, brandId: string, data: UpdateCampaign) {
    const supabase = getSupabase()

    // First verify ownership
    await this.getCampaignById(campaignId, brandId)

    const { data: campaign, error } = await supabase
      .from('campaigns')
      .update(data)
      .eq('id', campaignId)
      .eq('brand_id', brandId)
      .select()
      .single()

    if (error) {
      throw new Error(error.message)
    }

    return { campaign }
  }

  /**
   * Pause or resume campaign (Brand only - own campaigns)
   */
  static async toggleCampaignStatus(campaignId: string, brandId: string) {
    const supabase = getSupabase()

    // Get current campaign
    const { campaign: current } = await this.getCampaignById(campaignId, brandId)

    // Toggle status
    const newStatus = current.status === 'active' ? 'paused' : 'active'

    const { data: campaign, error } = await supabase
      .from('campaigns')
      .update({ status: newStatus })
      .eq('id', campaignId)
      .eq('brand_id', brandId)
      .select()
      .single()

    if (error) {
      throw new Error(error.message)
    }

    return { campaign, message: `Campaign ${newStatus}` }
  }

  /**
   * Delete campaign (Brand only - own campaigns)
   */
  static async deleteCampaign(campaignId: string, brandId: string) {
    const supabase = getSupabase()

    // First verify ownership
    await this.getCampaignById(campaignId, brandId)

    const { error } = await supabase
      .from('campaigns')
      .delete()
      .eq('id', campaignId)
      .eq('brand_id', brandId)

    if (error) {
      throw new Error(error.message)
    }

    return { message: 'Campaign deleted successfully' }
  }
}
