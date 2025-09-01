'use client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Form } from '@/components/ui/form'
import { cn } from '@/utilities/ui'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ForgotPasswordFormData, ForgotPasswordSchema } from '@/components/Forms/FormSchema'
import { toast } from 'sonner'
import { CustomFormField } from '@/components/Forms/CustomFormField'
import { Loader2 } from 'lucide-react'
import Link from 'next/link'
import { authClient } from '@/lib/auth-client'

export function ForgotPasswordForm({ className, ...props }: React.ComponentPropsWithoutRef<'div'>) {
  const [isLoading, setIsLoading] = useState(false)
  const form = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(ForgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  })

  const onSubmit = async (values: ForgotPasswordFormData) => {
    const toastId = toast.loading(' Sending reset password email...')
    setIsLoading(true)

    const { error } = await authClient.forgetPassword({
      email: values.email,
      redirectTo: '/reset-password',
    })

    if (error) {
      toast.error(error.message as string, { id: toastId })
    } else {
      toast.success('Reset password email sent successfully', { id: toastId })
    }

    setIsLoading(false)
  }
  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Forgot Password</CardTitle>
          <CardDescription>Enter your email address to reset your password</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="grid gap-6">
                <div className="grid gap-3">
                  <div className="grid gap-2">
                    <CustomFormField
                      name="email"
                      label="Email"
                      placeholder="mqT0V@example.com"
                      type="email"
                      initialValue={''}
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="size-4 animate-spin" />
                        <span>Resetting Password...</span>
                      </div>
                    ) : (
                      'Reset Password'
                    )}
                  </Button>
                </div>
                <div className="text-center text-sm">
                  Don&apos;t have an account?{' '}
                  <Link href="/register" className="underline underline-offset-4">
                    Sign up
                  </Link>
                </div>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary  ">
        By clicking continue, you agree to our <a href="#">Terms of Service</a> and{' '}
        <a href="#">Privacy Policy</a>.
      </div>
    </div>
  )
}
