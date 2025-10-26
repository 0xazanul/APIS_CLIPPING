import { OpenAPIHono } from '@hono/zod-openapi'
import { authMiddleware, roleMiddleware, type Variables } from '../middlewares/auth'
import { createRoute, z } from '@hono/zod-openapi'
import { CampaignService } from '../services/campaignService'
import {
  createCampaignRoute,
  getBrandCampaignsRoute,
  updateCampaignRoute,
  toggleCampaignStatusRoute,
  deleteCampaignRoute,
} from './campaignOpenapi'

const brandApp = new OpenAPIHono<{ Variables: Variables }>()

// Apply auth middleware ONLY to /brand/* routes, not globally
brandApp.use('/brand/*', authMiddleware, roleMiddleware('Brand'))

const brandDashboardRoute = createRoute({
  method: 'get',
  path: '/brand/dashboard',
  tags: ['Brand'],
  security: [{ Bearer: [] }],
  responses: {
    200: {
      content: {
        'application/json': {
          schema: z.object({
            message: z.string(),
            data: z.object({
              totalCampaigns: z.number(),
              activeClippers: z.number(),
            }),
          }),
        },
      },
      description: 'Brand dashboard data',
    },
    403: {
      content: {
        'application/json': {
          schema: z.object({ error: z.string() }),
        },
      },
      description: 'Forbidden - Brand role required',
    },
  },
})

brandApp.openapi(brandDashboardRoute, (c) => {
  const user = c.get('user')
  return c.json({
    message: `Welcome to Brand dashboard, ${user.email}`,
    data: {
      totalCampaigns: 10,
      activeClippers: 25,
    },
  })
})

// ============= CAMPAIGN ROUTES =============

// Create Campaign
brandApp.openapi(createCampaignRoute, async (c) => {
  const user = c.get('user')
  const body = c.req.valid('json')
  try {
    const result = await CampaignService.createCampaign(user.userId, body)
    return c.json(result, 201)
  } catch (error) {
    return c.json({ error: (error as Error).message }, 400)
  }
})

// Get Own Campaigns
brandApp.openapi(getBrandCampaignsRoute, async (c) => {
  const user = c.get('user')
  try {
    const result = await CampaignService.getBrandCampaigns(user.userId)
    return c.json(result, 200)
  } catch (error) {
    return c.json({ error: (error as Error).message }, 400)
  }
})

// Update Campaign
brandApp.openapi(updateCampaignRoute, async (c) => {
  const user = c.get('user')
  const { id } = c.req.valid('param')
  const body = c.req.valid('json')
  try {
    const result = await CampaignService.updateCampaign(id, user.userId, body)
    return c.json(result, 200)
  } catch (error) {
    const status = (error as Error).message.includes('not found') ? 404 : 400
    return c.json({ error: (error as Error).message }, status)
  }
})

// Toggle Campaign Status (Pause/Resume)
brandApp.openapi(toggleCampaignStatusRoute, async (c) => {
  const user = c.get('user')
  const { id } = c.req.valid('param')
  try {
    const result = await CampaignService.toggleCampaignStatus(id, user.userId)
    return c.json(result, 200)
  } catch (error) {
    const status = (error as Error).message.includes('not found') ? 404 : 400
    return c.json({ error: (error as Error).message }, status)
  }
})

// Delete Campaign
brandApp.openapi(deleteCampaignRoute, async (c) => {
  const user = c.get('user')
  const { id } = c.req.valid('param')
  try {
    const result = await CampaignService.deleteCampaign(id, user.userId)
    return c.json(result, 200)
  } catch (error) {
    const status = (error as Error).message.includes('not found') ? 404 : 400
    return c.json({ error: (error as Error).message }, status)
  }
})

export default brandApp
