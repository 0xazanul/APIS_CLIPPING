import jwt from 'jsonwebtoken'
import { config } from '../config'

export interface JWTPayload {
  userId: string
  role: 'Brand' | 'Clippers'
  email: string
}

export const generateToken = (payload: JWTPayload): string => {
  return jwt.sign(payload, config.jwt.secret, { expiresIn: '7d' })
}

export const verifyToken = (token: string): JWTPayload => {
  return jwt.verify(token, config.jwt.secret) as JWTPayload
}
