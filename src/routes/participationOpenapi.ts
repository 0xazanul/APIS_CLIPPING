import { createRoute, z } from '@hono/zod-openapi'
import { ParticipationResponseSchema, MyParticipationSchema } from '../models/participation'

const ErrorSchema = z.object({
  error: z.string(),
})

const MessageSchema = z.object({
  message: z.string(),
})

// Clipper - Participate in Campaign
export const participateInCampaignRoute = createRoute({
  method: 'post',
  path: '/clipper/campaigns/{id}/participate',
  tags: ['Clipper - Campaigns'],
  security: [{ Bearer: [] }],
  request: {
    params: z.object({
      id: z.string().uuid(),
    }),
  },
  responses: {
    201: {
      content: {
        'application/json': {
          schema: z.object({
            participation: ParticipationResponseSchema,
            message: z.string(),
          }),
        },
      },
      description: 'Successfully participated in campaign',
    },
    400: {
      content: {
        'application/json': {
          schema: ErrorSchema,
        },
      },
      description: 'Campaign not active or already participated',
    },
    403: {
      content: {
        'application/json': {
          schema: ErrorSchema,
        },
      },
      description: 'Forbidden - Clipper role required',
    },
    404: {
      content: {
        'application/json': {
          schema: ErrorSchema,
        },
      },
      description: 'Campaign not found',
    },
  },
})

// Clipper - Get My Participations
export const getMyParticipationsRoute = createRoute({
  method: 'get',
  path: '/clipper/participations',
  tags: ['Clipper - Campaigns'],
  security: [{ Bearer: [] }],
  responses: {
    200: {
      content: {
        'application/json': {
          schema: z.object({
            participations: z.array(MyParticipationSchema),
          }),
        },
      },
      description: 'List of your campaign participations',
    },
    403: {
      content: {
        'application/json': {
          schema: ErrorSchema,
        },
      },
      description: 'Forbidden - Clipper role required',
    },
  },
})

// Brand - Get Campaign Participants
export const getCampaignParticipantsRoute = createRoute({
  method: 'get',
  path: '/brand/campaigns/{id}/participants',
  tags: ['Brand - Campaigns'],
  security: [{ Bearer: [] }],
  request: {
    params: z.object({
      id: z.string().uuid(),
    }),
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: z.object({
            participants: z.array(ParticipationResponseSchema),
          }),
        },
      },
      description: 'List of campaign participants',
    },
    403: {
      content: {
        'application/json': {
          schema: ErrorSchema,
        },
      },
      description: 'Forbidden - not your campaign',
    },
    404: {
      content: {
        'application/json': {
          schema: ErrorSchema,
        },
      },
      description: 'Campaign not found',
    },
  },
})
