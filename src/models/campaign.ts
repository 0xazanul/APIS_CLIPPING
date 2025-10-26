import { z } from 'zod'

// Campaign status enum
export const CampaignStatus = z.enum(['active', 'paused'])

// Create campaign schema
export const CreateCampaignSchema = z.object({
  name: z.string().min(3, 'Campaign name must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  rules: z.string().min(5, 'Rules must be at least 5 characters'),
  budget: z.number().positive('Budget must be a positive number'),
})

// Update campaign schema (all fields optional)
export const UpdateCampaignSchema = z.object({
  name: z.string().min(3).optional(),
  description: z.string().min(10).optional(),
  rules: z.string().min(5).optional(),
  budget: z.number().positive().optional(),
})

// Campaign response schema
export const CampaignResponseSchema = z.object({
  id: z.string().uuid(),
  brand_id: z.string().uuid(),
  brand_email: z.string().email().optional(),
  name: z.string(),
  description: z.string(),
  rules: z.string(),
  budget: z.number(),
  status: CampaignStatus,
  created_at: z.string(),
  updated_at: z.string(),
})

export type CreateCampaign = z.infer<typeof CreateCampaignSchema>
export type UpdateCampaign = z.infer<typeof UpdateCampaignSchema>
export type CampaignResponse = z.infer<typeof CampaignResponseSchema>
