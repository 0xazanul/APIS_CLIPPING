import { OpenAPIHono } from '@hono/zod-openapi'
import { authMiddleware, roleMiddleware, type Variables } from '../middlewares/auth'
import { createRoute, z } from '@hono/zod-openapi'

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

export default brandApp
