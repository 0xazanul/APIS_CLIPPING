# Hono API with Supabase

A clean, production-ready API built with **Hono.js**, **Supabase**, **OpenAPI**, **Zod validation**, and **JWT authentication**.

## 🚀 Features

- ✅ **Layered Architecture** - Controllers, Services, Models, Middlewares, Utils
- ✅ **OpenAPI 3.0** - Auto-generated API documentation
- ✅ **Swagger UI** - Interactive API documentation at `/api-docs`
- ✅ **Zod Validation** - Type-safe request/response validation
- ✅ **JWT Authentication** - Secure token-based auth
- ✅ **Role-Based Access** - Brand & Clippers roles
- ✅ **Supabase Integration** - Database & authentication
- ✅ **TypeScript** - Full type safety
- ✅ **Hot Reload** - Fast development experience

## 📁 Project Structure

```
src/
├── config/          # Configuration (Supabase, app settings)
├── controllers/     # Request/response handlers
├── services/        # Business logic & database operations
├── models/          # Zod schemas & TypeScript types
├── middlewares/     # Auth, validation, logging
├── routes/          # API routes with OpenAPI specs
├── utils/           # Helper functions (JWT, password, errors)
└── index.ts         # Main application entry point
```

## 🛠️ Setup

1. **Install dependencies:**
```bash
npm install
```

2. **Configure environment variables:**

Update `.env` with your credentials:
```env
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
JWT_SECRET=your-secret-key-change-in-production
PORT=3000
```

3. **Create Supabase table:**

Run this SQL in your Supabase SQL editor:
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('Brand', 'Clippers')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

4. **Run development server:**
```bash
npm run dev
```

Server will start at: `http://localhost:3000`

## 📚 API Documentation

- **Swagger UI**: http://localhost:3000/api-docs
- **OpenAPI JSON**: http://localhost:3000/openapi.json
- **Root endpoint**: http://localhost:3000

## 🔗 API Endpoints

### Authentication

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/auth/register` | Register new user | No |
| POST | `/auth/login` | Login user | No |

### System

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/health` | Health check | No |

## 🧪 Example Requests

### Register User
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "role": "Brand"
  }'
```

### Login
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

## 🔐 Role-Based Access Control

Two roles are supported:
- **Brand** - For brand/business users
- **Clippers** - For clipper/creator users

Use the `roleMiddleware` to protect endpoints:
```typescript
app.use('/brand/*', roleMiddleware('Brand'))
```

## 📦 Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run type-check` - Check TypeScript types

## 🏗️ Tech Stack

- **[Hono](https://hono.dev/)** - Fast, lightweight web framework
- **[@hono/zod-openapi](https://github.com/honojs/middleware/tree/main/packages/zod-openapi)** - OpenAPI integration
- **[@hono/swagger-ui](https://github.com/honojs/middleware/tree/main/packages/swagger-ui)** - Swagger UI middleware
- **[Zod](https://zod.dev/)** - TypeScript-first schema validation
- **[Supabase](https://supabase.com/)** - Backend as a service
- **[JWT](https://jwt.io/)** - JSON Web Tokens for auth
- **[TypeScript](https://www.typescriptlang.org/)** - Type safety
