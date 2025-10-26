import { Context } from 'hono'
import { AuthService } from '../services/authService'
import type { LoginInput, RegisterInput } from '../models/user'

export class AuthController {
  static async register(c: Context) {
    try {
      const body = await c.req.json<RegisterInput>()
      const result = await AuthService.register(body)
      return c.json(result, 201)
    } catch (error) {
      return c.json({ error: (error as Error).message }, 400)
    }
  }

  static async login(c: Context) {
    try {
      const body = await c.req.json<LoginInput>()
      const result = await AuthService.login(body)
      return c.json(result, 200)
    } catch (error) {
      return c.json({ error: (error as Error).message }, 401)
    }
  }

  static async me(c: Context) {
    const user = c.get('user')
    return c.json({ user })
  }
}
