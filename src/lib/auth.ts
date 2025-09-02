import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { db } from './drizzle'
import { nextCookies } from 'better-auth/next-js'
import * as schema from '@/lib/schema'
import { Resend } from 'resend'
import VerifyEmail from './emails/verify-email'
import ForgotPasswordEmail from './emails/reset-password'

const resend = new Resend(process.env.RESEND_API as string)

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema: {
      ...schema,
    },
  }),
  user: {
    additionalFields: {
      role: {
        type: 'string',
        required: false,
        defaultValue: 'user',
        input: false,
        options: [
          { label: 'Admin', value: 'admin' },
          { label: 'User', value: 'user' },
          { label: 'Editor', value: 'editor' },
        ],
      },
    },
  },
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    requireEmailVerification: true,
    sendResetPassword: async ({ user, url }) => {
      resend.emails.send({
        from: process.env.EMAIL_SENDER_ADDRESS || 'Your App <noreply@yourdomain.com>',
        to: user.email,
        subject: 'Reset your password',
        react: ForgotPasswordEmail({ username: user.name, resetUrl: url, userEmail: user.email }),
      })
    },
  },
  emailVerification: {
    sendVerificationEmail: async ({ user, url }) => {
      resend.emails.send({
        from: process.env.EMAIL_SENDER_ADDRESS || 'Your App <noreply@yourdomain.com>',
        to: user.email,
        subject: 'Verify your email',
        react: VerifyEmail({ username: user.name, verifyUrl: url }),
      })
    },
    sendOnSignUp: true,
  },
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    },
  },
  plugins: [nextCookies()],
})
