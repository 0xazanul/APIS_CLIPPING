import { getSupabase } from '../config/supabase'
import type { 
  RegisterInput, 
  LoginInput, 
  ChangePasswordInput,
  UpdateProfileInput,
  VerifyEmailInput 
} from '../models/user'
import { hashPassword, comparePassword } from '../utils/password'
import { generateToken } from '../utils/jwt'
import { generateVerificationToken, generateTokenExpiry } from '../utils/tokens'

export class AuthService {
  static async register(input: RegisterInput) {
    const supabase = getSupabase()
    
    const { data: existing } = await supabase
      .from('profiles')
      .select('email')
      .eq('email', input.email)
      .maybeSingle()

    if (existing) {
      throw new Error('Email already registered')
    }

    const hashedPassword = await hashPassword(input.password)
    const verificationToken = generateVerificationToken()
    const tokenExpiry = generateTokenExpiry(24)

    const { data, error } = await supabase
      .from('profiles')
      .insert({
        email: input.email,
        password: hashedPassword,
        role: input.role,
        email_verified: false,
        verification_token: verificationToken,
        verification_token_expires: tokenExpiry.toISOString(),
      })
      .select('id, email, role, email_verified')
      .single()

    if (error) throw new Error(error.message)

    // In production, send verification email here
    // For now, return the token in response (for testing only)
    console.log(`Verification token for ${input.email}: ${verificationToken}`)

    const token = generateToken({
      userId: data.id,
      email: data.email,
      role: data.role,
    })

    return { 
      user: { 
        id: data.id, 
        email: data.email, 
        role: data.role,
        emailVerified: data.email_verified 
      }, 
      token,
      verificationToken // Remove this in production
    }
  }

  static async verifyEmail(input: VerifyEmailInput) {
    const supabase = getSupabase()

    const { data, error } = await supabase
      .from('profiles')
      .select('id, email, role, verification_token_expires')
      .eq('verification_token', input.token)
      .single()

    if (error || !data) {
      throw new Error('Invalid verification token')
    }

    const now = new Date()
    const expires = new Date(data.verification_token_expires)

    if (now > expires) {
      throw new Error('Verification token has expired')
    }

    const { error: updateError } = await supabase
      .from('profiles')
      .update({ 
        email_verified: true, 
        verification_token: null,
        verification_token_expires: null 
      })
      .eq('id', data.id)

    if (updateError) throw new Error(updateError.message)

    return { message: 'Email verified successfully' }
  }

  static async login(input: LoginInput) {
    const supabase = getSupabase()

    const { data, error } = await supabase
      .from('profiles')
      .select('id, email, password, role, email_verified')
      .eq('email', input.email)
      .maybeSingle()

    if (error || !data) {
      throw new Error('Invalid email or password')
    }

    if (!data.password) {
      throw new Error('Please use password reset to set your password')
    }

    const isValid = await comparePassword(input.password, data.password)
    
    if (!isValid) {
      throw new Error('Invalid email or password')
    }

    const token = generateToken({
      userId: data.id,
      email: data.email,
      role: data.role,
    })

    return { 
      user: { 
        id: data.id, 
        email: data.email, 
        role: data.role,
        emailVerified: data.email_verified || false 
      }, 
      token 
    }
  }

  static async changePassword(userId: string, input: ChangePasswordInput) {
    const supabase = getSupabase()

    const { data: user, error } = await supabase
      .from('profiles')
      .select('password')
      .eq('id', userId)
      .single()

    if (error || !user) {
      throw new Error('User not found')
    }

    if (!user.password) {
      throw new Error('No password set for this account')
    }

    const isValid = await comparePassword(input.currentPassword, user.password)
    
    if (!isValid) {
      throw new Error('Current password is incorrect')
    }

    const hashedPassword = await hashPassword(input.newPassword)

    const { error: updateError } = await supabase
      .from('profiles')
      .update({ password: hashedPassword, updated_at: new Date().toISOString() })
      .eq('id', userId)

    if (updateError) throw new Error(updateError.message)

    return { message: 'Password changed successfully' }
  }

  static async updateProfile(userId: string, input: UpdateProfileInput) {
    const supabase = getSupabase()

    if (input.email) {
      const { data: existing } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', input.email)
        .neq('id', userId)
        .maybeSingle()

      if (existing) {
        throw new Error('Email already in use')
      }
    }

    const { data, error } = await supabase
      .from('profiles')
      .update({ ...input, updated_at: new Date().toISOString() })
      .eq('id', userId)
      .select('id, email, role')
      .single()

    if (error) throw new Error(error.message)

    return { 
      user: { 
        id: data.id, 
        email: data.email, 
        role: data.role 
      } 
    }
  }

  static async getProfile(userId: string) {
    const supabase = getSupabase()

    const { data, error } = await supabase
      .from('profiles')
      .select('id, email, role, email_verified, created_at, updated_at')
      .eq('id', userId)
      .single()

    if (error || !data) {
      throw new Error('User not found')
    }

    return { user: data }
  }
}
