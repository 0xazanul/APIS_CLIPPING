import { OpenAPIHono } from '@hono/zod-openapi'
import { authMiddleware, roleMiddleware, type Variables } from '../middlewares/auth'
import { createRoute, z } from '@hono/zod-openapi'

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

export default clipperApp
