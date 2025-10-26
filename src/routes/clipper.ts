import { OpenAPIHono } from '@hono/zod-openapi'
import { authMiddleware, roleMiddleware, type Variables } from '../middlewares/auth'
import { createRoute, z } from '@hono/zod-openapi'
import { CampaignService } from '../services/campaignService'
import { getAllActiveCampaignsRoute } from './campaignOpenapi'

const clipperApp = new OpenAPIHono<{ Variables: Variables }>()

// Apply auth middleware ONLY to /clipper/* routes, not globally
clipperApp.use('/clipper/*', authMiddleware, roleMiddleware('Clippers'))

const clipperDashboardRoute = createRoute({
  method: 'get',
  path: '/clipper/dashboard',
  tags: ['Clipper'],
  security: [{ Bearer: [] }],
  responses: {
    200: {
      content: {
        'application/json': {
          schema: z.object({
            message: z.string(),
            data: z.object({
              totalClips: z.number(),
              earnings: z.number(),
            }),
          }),
        },
      },
      description: 'Clipper dashboard data',
    },
    403: {
      content: {
        'application/json': {
          schema: z.object({ error: z.string() }),
        },
      },
      description: 'Forbidden - Clipper role required',
    },
  },
})

clipperApp.openapi(clipperDashboardRoute, (c) => {
  const user = c.get('user')
  return c.json({
    message: `Welcome to Clipper dashboard, ${user.email}`,
    data: {
      totalClips: 50,
      earnings: 1250.50,
    },
  })
})

// ============= CAMPAIGN ROUTES =============

// Get All Active Campaigns (from all brands)
clipperApp.openapi(getAllActiveCampaignsRoute, async (c) => {
  try {
    const result = await CampaignService.getAllActiveCampaigns()
    return c.json(result, 200)
  } catch (error) {
    return c.json({ error: (error as Error).message }, 400)
  }
})

export default clipperApp
