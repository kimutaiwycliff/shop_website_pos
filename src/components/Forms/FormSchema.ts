import { z } from 'zod'

// Password requirements
export const requirements = [
  { regex: /.{8,}/, text: 'At least 8 characters' },
  { regex: /[0-9]/, text: 'At least 1 number' },
  { regex: /[a-z]/, text: 'At least 1 lowercase letter' },
  { regex: /[A-Z]/, text: 'At least 1 uppercase letter' },
]

// Password validation function
const validatePassword = (password: string) => {
  const failedRequirements = requirements.filter((req) => !req.regex.test(password))
  if (failedRequirements.length > 0) {
    return failedRequirements.map((req) => req.text).join(', ')
  }
  return true
}

export const SignInSchema = z.object({
  email: z.string().min(1, { message: 'Email is required' }).email(),
  password: z.string().min(1, { message: 'Password is required' }),
})

export type SignInFormData = z.infer<typeof SignInSchema>

export const SignUpSchema = z
  .object({
    name: z.string().min(1, { message: 'Name is required' }),
    email: z
      .string()
      .regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/i, {
        message: 'Invalid email address',
      })
      .min(1, { message: 'Email is required' }),
    password: z.string().refine(validatePassword, {
      message: 'Password must meet the following requirements',
    }),
    confirmPassword: z.string().min(1, { message: 'Password confirmation is required' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

export type SignUpFormData = z.infer<typeof SignUpSchema>

export const ForgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'Email is required' })
    .regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/i, {
      message: 'Invalid email address',
    }),
})

export type ForgotPasswordFormData = z.infer<typeof ForgotPasswordSchema>

export const ResetPasswordSchema = z.object({
  password: z
    .string()
    .refine(validatePassword, {
      message: 'Password must meet the following requirements',
    })
    .min(1, { message: 'Password is required' }),
  confirmPassword: z.string().min(1, { message: 'Password confirmation is required' }),
})

export type ResetPasswordFormData = z.infer<typeof ResetPasswordSchema>
