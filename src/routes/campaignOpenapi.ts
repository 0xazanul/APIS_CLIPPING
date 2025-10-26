import { createRoute, z } from '@hono/zod-openapi'
import { CreateCampaignSchema, UpdateCampaignSchema, CampaignResponseSchema } from '../models/campaign'

const ErrorSchema = z.object({
  error: z.string(),
})

const MessageSchema = z.object({
  message: z.string(),
})

// Brand - Create Campaign
export const createCampaignRoute = createRoute({
  method: 'post',
  path: '/brand/campaigns',
  tags: ['Brand - Campaigns'],
  security: [{ Bearer: [] }],
  request: {
    body: {
      content: {
        'application/json': {
          schema: CreateCampaignSchema,
        },
      },
    },
  },
  responses: {
    201: {
      content: {
        'application/json': {
          schema: z.object({
            campaign: CampaignResponseSchema,
          }),
        },
      },
      description: 'Campaign created successfully',
    },
    400: {
      content: {
        'application/json': {
          schema: ErrorSchema,
        },
      },
      description: 'Bad request',
    },
    403: {
      content: {
        'application/json': {
          schema: ErrorSchema,
        },
      },
      description: 'Forbidden - Brand role required',
    },
  },
})

// Brand - Get Own Campaigns
export const getBrandCampaignsRoute = createRoute({
  method: 'get',
  path: '/brand/campaigns',
  tags: ['Brand - Campaigns'],
  security: [{ Bearer: [] }],
  responses: {
    200: {
      content: {
        'application/json': {
          schema: z.object({
            campaigns: z.array(CampaignResponseSchema),
          }),
        },
      },
      description: 'List of brand campaigns',
    },
    403: {
      content: {
        'application/json': {
          schema: ErrorSchema,
        },
      },
      description: 'Forbidden - Brand role required',
    },
  },
})

// Brand - Update Campaign
export const updateCampaignRoute = createRoute({
  method: 'patch',
  path: '/brand/campaigns/{id}',
  tags: ['Brand - Campaigns'],
  security: [{ Bearer: [] }],
  request: {
    params: z.object({
      id: z.string().uuid(),
    }),
    body: {
      content: {
        'application/json': {
          schema: UpdateCampaignSchema,
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: z.object({
            campaign: CampaignResponseSchema,
          }),
        },
      },
      description: 'Campaign updated successfully',
    },
    400: {
      content: {
        'application/json': {
          schema: ErrorSchema,
        },
      },
      description: 'Bad request',
    },
    403: {
      content: {
        'application/json': {
          schema: ErrorSchema,
        },
      },
      description: 'Forbidden',
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

// Brand - Toggle Campaign Status (Pause/Resume)
export const toggleCampaignStatusRoute = createRoute({
  method: 'patch',
  path: '/brand/campaigns/{id}/toggle',
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
            campaign: CampaignResponseSchema,
            message: z.string(),
          }),
        },
      },
      description: 'Campaign status toggled',
    },
    403: {
      content: {
        'application/json': {
          schema: ErrorSchema,
        },
      },
      description: 'Forbidden',
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

// Brand - Delete Campaign
export const deleteCampaignRoute = createRoute({
  method: 'delete',
  path: '/brand/campaigns/{id}',
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
          schema: MessageSchema,
        },
      },
      description: 'Campaign deleted successfully',
    },
    403: {
      content: {
        'application/json': {
          schema: ErrorSchema,
        },
      },
      description: 'Forbidden',
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

// Clipper - Get All Active Campaigns
export const getAllActiveCampaignsRoute = createRoute({
  method: 'get',
  path: '/clipper/campaigns',
  tags: ['Clipper - Campaigns'],
  security: [{ Bearer: [] }],
  responses: {
    200: {
      content: {
        'application/json': {
          schema: z.object({
            campaigns: z.array(CampaignResponseSchema),
          }),
        },
      },
      description: 'List of all active campaigns from all brands',
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
