'use client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Form } from '@/components/ui/form'
import { FaGithub } from 'react-icons/fa'
import { cn } from '@/utilities/ui'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { SignUpSchema } from '@/components/Forms/FormSchema'
import { SignUpFormData } from '@/components/Forms/FormSchema'
import { signUp } from '@/lib/actions/users'
import { toast } from 'sonner'
import { CustomFormField } from '@/components/Forms/CustomFormField'
import { Loader2 } from 'lucide-react'
import Link from 'next/link'
import { authClient } from '@/lib/auth-client'

export function RegisterForm({ className, ...props }: React.ComponentPropsWithoutRef<'div'>) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isSocialLoading, setIsSocialLoading] = useState(false)
  const form = useForm<SignUpFormData>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  })

  const onSubmit = async (values: SignUpFormData) => {
    const toastId = toast.loading('Signing up...')
    setIsLoading(true)

    const { success, message } = await signUp(values.name, values.email, values.password)

    if (success) {
      toast.success(message as string, { id: toastId })
      router.push('/login')
    } else {
      toast.error(message as string, { id: toastId })
    }

    setIsLoading(false)
  }

  const signInWithGitHub = async () => {
      const toastId = toast.loading('Signing up...')
      setIsSocialLoading(true)
      await authClient.signIn.social(
        {
          provider: 'github',
          callbackURL: '/',
        },
        {
          onSuccess: () => {
            setIsSocialLoading(false)
            toast.success('Signed up successfully.', { id: toastId })
          },
          onError: () => {
            setIsSocialLoading(false)
            toast.error('Failed to sign up', { id: toastId })
          },
        },
      )
    }
  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Welcome back</CardTitle>
          <CardDescription>Sign up with your GitHub account</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="grid gap-6">
                <div className="flex flex-col gap-4">
                <Button
                    variant="outline"
                    className="w-full flex items-center gap-2"
                    onClick={signInWithGitHub}
                    type="button"
                    disabled={isSocialLoading}
                  >
                    {isSocialLoading ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="size-4 animate-spin" />
                        <span>Signing up...</span>
                      </div>
                    ) : (
                      <>
                        <FaGithub />
                        Sign up with GitHub
                      </>
                    )}
                  </Button>
                </div>
                <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                  <span className="relative z-10 bg-background px-2 text-muted-foreground">
                    Or continue with
                  </span>
                </div>
                <div className="grid gap-6">
                  <div className="grid gap-2">
                    <CustomFormField
                      name="name"
                      label="Name"
                      placeholder="John Doe"
                      type="text"
                      initialValue={''}
                    />
                  </div>
                  <div className="grid gap-2">
                    <CustomFormField
                      name="email"
                      label="Email"
                      placeholder="mqT0V@example.com"
                      type="email"
                      initialValue={''}
                    />
                  </div>
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
                        <span>Signing up...</span>
                      </div>
                    ) : (
                      'Sign up'
                    )}
                  </Button>
                </div>
                <div className="text-center text-sm">
                  Don&apos;t have an account?{' '}
                  <Link href="/login" className="underline underline-offset-4">
                    Sign in
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
