import { createRoute, z } from '@hono/zod-openapi'
import { 
  LoginSchema, 
  RegisterSchema, 
  VerifyEmailSchema,
  ChangePasswordSchema,
  UpdateProfileSchema 
} from '../models/user'

const ErrorSchema = z.object({
  error: z.string(),
})

const MessageSchema = z.object({
  message: z.string(),
})

const UserResponseSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  role: z.enum(['Brand', 'Clippers']),
  emailVerified: z.boolean().optional(),
})

const AuthResponseSchema = z.object({
  user: UserResponseSchema,
  token: z.string(),
  verificationToken: z.string().optional(),
})

const ProfileResponseSchema = z.object({
  user: z.object({
    id: z.string(),
    email: z.string(),
    role: z.enum(['Brand', 'Clippers']),
    email_verified: z.boolean(),
    created_at: z.string(),
    updated_at: z.string(),
  }),
})

export const registerRoute = createRoute({
  method: 'post',
  path: '/auth/register',
  tags: ['Authentication'],
  request: {
    body: {
      content: {
        'application/json': {
          schema: RegisterSchema,
        },
      },
    },
  },
  responses: {
    201: {
      content: {
        'application/json': {
          schema: AuthResponseSchema,
        },
      },
      description: 'User registered successfully',
    },
    400: {
      content: {
        'application/json': {
          schema: ErrorSchema,
        },
      },
      description: 'Bad request',
    },
  },
})

export const loginRoute = createRoute({
  method: 'post',
  path: '/auth/login',
  tags: ['Authentication'],
  request: {
    body: {
      content: {
        'application/json': {
          schema: LoginSchema,
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: AuthResponseSchema,
        },
      },
      description: 'Login successful',
    },
    401: {
      content: {
        'application/json': {
          schema: ErrorSchema,
        },
      },
      description: 'Invalid credentials',
    },
  },
})

export const verifyEmailRoute = createRoute({
  method: 'post',
  path: '/auth/verify-email',
  tags: ['Authentication'],
  request: {
    body: {
      content: {
        'application/json': {
          schema: VerifyEmailSchema,
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: MessageSchema,
        },
      },
      description: 'Email verified successfully',
    },
    400: {
      content: {
        'application/json': {
          schema: ErrorSchema,
        },
      },
      description: 'Invalid or expired token',
    },
  },
})

export const changePasswordRoute = createRoute({
  method: 'post',
  path: '/auth/change-password',
  tags: ['Authentication'],
  security: [{ Bearer: [] }],
  request: {
    body: {
      content: {
        'application/json': {
          schema: ChangePasswordSchema,
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: MessageSchema,
        },
      },
      description: 'Password changed successfully',
    },
    400: {
      content: {
        'application/json': {
          schema: ErrorSchema,
        },
      },
      description: 'Bad request',
    },
    401: {
      content: {
        'application/json': {
          schema: ErrorSchema,
        },
      },
      description: 'Unauthorized',
    },
  },
})

export const updateProfileRoute = createRoute({
  method: 'patch',
  path: '/auth/profile',
  tags: ['Authentication'],
  security: [{ Bearer: [] }],
  request: {
    body: {
      content: {
        'application/json': {
          schema: UpdateProfileSchema,
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: z.object({ user: UserResponseSchema }),
        },
      },
      description: 'Profile updated successfully',
    },
    400: {
      content: {
        'application/json': {
          schema: ErrorSchema,
        },
      },
      description: 'Bad request',
    },
    401: {
      content: {
        'application/json': {
          schema: ErrorSchema,
        },
      },
      description: 'Unauthorized',
    },
  },
})

export const getProfileRoute = createRoute({
  method: 'get',
  path: '/auth/profile',
  tags: ['Authentication'],
  security: [{ Bearer: [] }],
  responses: {
    200: {
      content: {
        'application/json': {
          schema: ProfileResponseSchema,
        },
      },
      description: 'User profile retrieved',
    },
    401: {
      content: {
        'application/json': {
          schema: ErrorSchema,
        },
      },
      description: 'Unauthorized',
    },
    404: {
      content: {
        'application/json': {
          schema: ErrorSchema,
        },
      },
      description: 'User not found',
    },
  },
})

export const healthRoute = createRoute({
  method: 'get',
  path: '/health',
  tags: ['System'],
  responses: {
    200: {
      content: {
        'application/json': {
          schema: z.object({
            status: z.string(),
            timestamp: z.string(),
          }),
        },
      },
      description: 'Health check endpoint',
    },
  },
})
