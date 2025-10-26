import { z } from 'zod'

export const UserRole = z.enum(['Brand', 'Clippers'])

export const RegisterSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: UserRole,
})

export const LoginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

export const VerifyEmailSchema = z.object({
  token: z.string().min(1, 'Token is required'),
})

export const ResendVerificationSchema = z.object({
  email: z.string().email('Invalid email address'),
})

export const ChangePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(6, 'New password must be at least 6 characters'),
})

export const UpdateProfileSchema = z.object({
  email: z.string().email().optional(),
})

export type LoginInput = z.infer<typeof LoginSchema>
export type RegisterInput = z.infer<typeof RegisterSchema>
export type VerifyEmailInput = z.infer<typeof VerifyEmailSchema>
export type ResendVerificationInput = z.infer<typeof ResendVerificationSchema>
export type ChangePasswordInput = z.infer<typeof ChangePasswordSchema>
export type UpdateProfileInput = z.infer<typeof UpdateProfileSchema>
