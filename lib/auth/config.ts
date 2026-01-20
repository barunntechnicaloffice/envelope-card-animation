export const authConfig = {
  googleClientId: process.env.GOOGLE_CLIENT_ID || '',
  jwtSecret: process.env.JWT_SECRET || 'development-secret-key-change-in-production',
  allowedEmailDomain: process.env.ALLOWED_EMAIL_DOMAIN || '',
  cookieOptions: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7일
    path: '/',
  },
}
