'use client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Form } from '@/components/ui/form'
import { cn } from '@/utilities/ui'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ResetPasswordSchema } from '@/components/Forms/FormSchema'
import { ResetPasswordFormData } from '@/components/Forms/FormSchema'
import { toast } from 'sonner'
import { CustomFormField } from '@/components/Forms/CustomFormField'
import { Loader2 } from 'lucide-react'
import Link from 'next/link'
import { authClient } from '@/lib/auth-client'

export function ResetPasswordForm({ className, ...props }: React.ComponentPropsWithoutRef<'div'>) {
  const searchParams = useSearchParams()
  const token = searchParams.get('token') as string
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const form = useForm<ResetPasswordFormData>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  })

  const onSubmit = async (values: ResetPasswordFormData) => {
    const toastId = toast.loading('Resetting password...')
    setIsLoading(true)

    if (values.password !== values.confirmPassword) {
      toast.error('Passwords do not match', { id: toastId })
      setIsLoading(false)
      return
    }

    const { error } = await authClient.resetPassword({
      newPassword: values.password,
      token,
    })

    if (error) {
      toast.error(error.message as string, { id: toastId })
    } else {
      toast.success('Password reset successfully', { id: toastId })
      router.push('/login')
    }

    setIsLoading(false)
  }

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Reset Password</CardTitle>
          <CardDescription>Enter your new password</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="grid gap-6">
                <div className="grid gap-6">
                  <div className="grid gap-2">
                    <CustomFormField
                      name="password"
                      label="Password"
                      placeholder="**************"
                      type="password"
                      forgotPasswordLink={false}
                      showPasswordStrength={true}
                      initialValue={''}
                    />
                  </div>
                  <div className="grid gap-3">
                    <CustomFormField
                      name="confirmPassword"
                      label="Confirm Password"
                      placeholder="**************"
                      type="password"
                      forgotPasswordLink={false}
                      showPasswordStrength={false}
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
                  <Link
                    href="/register"
                    className="underline underline-offset-4 hover:text-primary"
                  >
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
