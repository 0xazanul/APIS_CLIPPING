import { createMiddleware } from 'hono/factory'
import { verifyToken, type JWTPayload } from '../utils/jwt'

export type Variables = {
  user: JWTPayload
}

export const authMiddleware = createMiddleware<{ Variables: Variables }>(async (c, next) => {
  const authHeader = c.req.header('Authorization')

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json({ error: 'Unauthorized - No token provided' }, 401)
  }

  const token = authHeader.substring(7)

  try {
    const payload = verifyToken(token)
    c.set('user', payload)
    await next()
  } catch (error) {
    return c.json({ error: 'Unauthorized - Invalid token' }, 401)
  }
})

export const roleMiddleware = (...allowedRoles: Array<'Brand' | 'Clippers'>) => {
  return createMiddleware<{ Variables: Variables }>(async (c, next) => {
    const user = c.get('user')

    if (!allowedRoles.includes(user.role)) {
      return c.json({ error: 'Forbidden - Insufficient permissions' }, 403)
    }

    await next()
  })
}
