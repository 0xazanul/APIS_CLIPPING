import 'dotenv/config'
import { serve } from '@hono/node-server'
import { OpenAPIHono } from '@hono/zod-openapi'
import { swaggerUI } from '@hono/swagger-ui'
import { cors } from 'hono/cors'
import { logger } from './middlewares/logger'
import api from './routes/api'
import brandRoutes from './routes/brand'
import clipperRoutes from './routes/clipper'
import { config } from './config'

const app = new OpenAPIHono()

app.use('*', cors())
app.use('*', logger)

// Root endpoint - MUST be defined BEFORE mounting routes
app.get('/', (c) => {
  return c.json({
    message: 'Hello Clippers'
  })
})

// Mount routes
app.route('/', api)
app.route('/', brandRoutes)
app.route('/', clipperRoutes)

// Generate OpenAPI documentation with security schemes
app.get('/openapi.json', (c) => {
  const doc = app.getOpenAPIDocument({
    openapi: '3.0.0',
    info: {
      version: config.api.version,
      title: config.api.title,
      description: config.api.description,
    },
  })
  
  // Add security schemes for JWT Bearer authentication
  if (!doc.components) {
    doc.components = {}
  }
  
  doc.components.securitySchemes = {
    Bearer: {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      description: 'Enter JWT token (paste token only, no Bearer prefix needed)',
    },
  }
  
  // Add server info
  doc.servers = [
    {
      url: `http://localhost:${config.port}`,
      description: 'Local development server',
    },
  ]
  
  return c.json(doc)
})

// Swagger UI
app.get('/api-docs', swaggerUI({ url: '/openapi.json' }))

serve({
  fetch: app.fetch,
  port: config.port,
})

console.log(`🚀 Server is running on http://localhost:${config.port}`)
console.log(`📚 API Docs available at http://localhost:${config.port}/api-docs`)
console.log(`📄 OpenAPI JSON at http://localhost:${config.port}/openapi.json`)
