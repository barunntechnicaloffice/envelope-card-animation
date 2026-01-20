import jwt from 'jsonwebtoken'

export interface JwtPayload {
  userId: string
  email: string
  name: string
  picture?: string
}

const JWT_SECRET = process.env.JWT_SECRET || 'development-secret-key-change-in-production'

export function generateToken(payload: JwtPayload): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: '7d',
  })
}

export function verifyToken(token: string): JwtPayload {
  return jwt.verify(token, JWT_SECRET) as JwtPayload
}
