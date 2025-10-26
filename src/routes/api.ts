import { OpenAPIHono } from '@hono/zod-openapi'
import { AuthService } from '../services/authService'
import { authMiddleware, type Variables } from '../middlewares/auth'
import { 
  registerRoute, 
  loginRoute, 
  verifyEmailRoute,
  changePasswordRoute,
  updateProfileRoute,
  getProfileRoute,
  healthRoute 
} from './openapi'

const app = new OpenAPIHono<{ Variables: Variables }>()

app.openapi(healthRoute, (c) => {
  return c.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
  })
})

app.openapi(registerRoute, async (c) => {
  const body = c.req.valid('json')
  try {
    const result = await AuthService.register(body)
    return c.json(result, 201)
  } catch (error) {
    return c.json({ error: (error as Error).message }, 400)
  }
})

app.openapi(loginRoute, async (c) => {
  const body = c.req.valid('json')
  try {
    const result = await AuthService.login(body)
    return c.json(result, 200)
  } catch (error) {
    return c.json({ error: (error as Error).message }, 401)
  }
})

app.openapi(verifyEmailRoute, async (c) => {
  const body = c.req.valid('json')
  try {
    const result = await AuthService.verifyEmail(body)
    return c.json(result, 200)
  } catch (error) {
    return c.json({ error: (error as Error).message }, 400)
  }
})

// Apply auth middleware to protected routes
app.use('/auth/change-password', authMiddleware)
app.use('/auth/profile', authMiddleware)

app.openapi(changePasswordRoute, async (c) => {
  const user = c.get('user')
  const body = c.req.valid('json')
  try {
    const result = await AuthService.changePassword(user.userId, body)
    return c.json(result, 200)
  } catch (error) {
    return c.json({ error: (error as Error).message }, 400)
  }
})

app.openapi(getProfileRoute, async (c) => {
  const user = c.get('user')
  try {
    const result = await AuthService.getProfile(user.userId)
    return c.json(result, 200)
  } catch (error) {
    return c.json({ error: (error as Error).message }, 404)
  }
})

app.openapi(updateProfileRoute, async (c) => {
  const user = c.get('user')
  const body = c.req.valid('json')
  try {
    const result = await AuthService.updateProfile(user.userId, body)
    return c.json(result, 200)
  } catch (error) {
    return c.json({ error: (error as Error).message }, 400)
  }
})

export default app
