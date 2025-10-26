export const config = {
  port: parseInt(process.env.PORT || '3000'),
  supabase: {
    url: process.env.SUPABASE_URL || '',
    anonKey: process.env.SUPABASE_ANON_KEY || '',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
    expiresIn: '7d',
  },
  api: {
    version: '1.0.0',
    title: 'Hono API',
    description: 'Clean Hono.js API with Supabase, OpenAPI, and JWT',
  },
}
