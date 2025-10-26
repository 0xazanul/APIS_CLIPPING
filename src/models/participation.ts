import { z } from 'zod'

// Participation status enum
export const ParticipationStatus = z.enum(['pending', 'approved', 'rejected'])

// Participation response schema
export const ParticipationResponseSchema = z.object({
  id: z.string().uuid(),
  campaign_id: z.string().uuid(),
  clipper_id: z.string().uuid(),
  clipper_email: z.string().email().optional(),
  campaign_name: z.string().optional(),
  status: ParticipationStatus,
  participated_at: z.string(),
})

// Participant with campaign details (for Clipper's view)
export const MyParticipationSchema = z.object({
  id: z.string().uuid(),
  campaign_id: z.string().uuid(),
  campaign_name: z.string(),
  campaign_description: z.string(),
  brand_email: z.string().email(),
  status: ParticipationStatus,
  participated_at: z.string(),
})

export type ParticipationResponse = z.infer<typeof ParticipationResponseSchema>
export type MyParticipation = z.infer<typeof MyParticipationSchema>
