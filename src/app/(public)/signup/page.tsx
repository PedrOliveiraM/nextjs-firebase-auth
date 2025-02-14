'use client'
import { signUpFormData, signUpFormSchema } from '@/@types/signUpFormSchema'
import { signupWithPassword } from '@/app/actions/auth-signup-password'
import { LoginWithGithubButton } from '@/components/loginWithGithubButton'
import { LoginWithGoogleButton } from '@/components/LoginWithGoogleButton'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useToast } from '@/hooks/use-toast'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRive, useStateMachineInput } from '@rive-app/react-canvas'
import { LogIn } from 'lucide-react'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { useForm } from 'react-hook-form'
const STATE_MACHINE_NAME = 'State Machine 1'

export default function SignUpForm() {
  const toast = useToast()
  const { rive, RiveComponent } = useRive({
    src: '/river/login_screen_character.riv',
    autoplay: true,
    stateMachines: STATE_MACHINE_NAME,
  })

  const stateSuccess = useStateMachineInput(rive, STATE_MACHINE_NAME, 'success')
  const stateFail = useStateMachineInput(rive, STATE_MACHINE_NAME, 'fail')
  const stateHandUp = useStateMachineInput(rive, STATE_MACHINE_NAME, 'hands_up')
  const stateCheck = useStateMachineInput(rive, STATE_MACHINE_NAME, 'Check')

  const handleSubmitSuccess = () => {
    if (stateSuccess) stateSuccess.fire()
  }

  const handleSubmitFail = () => {
    if (stateFail) stateFail.fire()
  }

  const setHangUp = (hangUp: boolean) => {
    if (stateHandUp) stateHandUp.value = hangUp
  }

  const handleFocusEmail = () => {
    if (stateCheck) stateCheck.value = 1000
  }

  const handleBlurEmail = () => {
    if (stateCheck) stateCheck.value = 0
  }

  const handleFocusPassword = () => {
    setHangUp(true)
  }

  const handleBlurPassword = () => {
    setHangUp(false)
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<signUpFormData>({
    resolver: zodResolver(signUpFormSchema),
  })

  async function createUser(data: signUpFormData) {
    try {
      console.log('Data register: ', data)

      const { username, email, password } = data

      const status = await signupWithPassword(username, email, password)
      console.log('Status: ', status)

      if (!status) {
        throw new Error('Error creating user')
      }

      handleSubmitSuccess()

      toast.toast({
        title: 'Account created',
        description: 'Your account has been created',
        variant: 'success',
      })

      redirect('signin')
    } catch (error) {
      if (error instanceof Error) {
        handleSubmitFail()
        console.log(error)
        toast.toast({
          title: 'Error',
          description: error.message,
          variant: 'destructive',
        })
      }
    }
  }

  return (
    <main className="mb-5 flex h-screen w-full flex-col items-center justify-center">
      <div className="">
        <RiveComponent style={{ width: '300px', height: '300px' }} />
      </div>
      <div className="mb-10 flex w-full flex-col items-center">
        <Card className="w-full max-w-sm">
          <CardHeader className="py-3">
            <CardTitle className="flex justify-center text-xl">
              REGISTER
            </CardTitle>
            <CardDescription className="flex justify-center">
              Sign up to continue
            </CardDescription>
          </CardHeader>
          <CardContent className="py-0">
            <form className="space-y-2" onSubmit={handleSubmit(createUser)}>
              <Input
                onFocus={handleFocusEmail}
                type="text"
                placeholder="Your name"
                {...register('username', {
                  onBlur: handleBlurEmail,
                })}
              />
              {errors.email && (
                <span className="text-red-500">{errors.email.message}</span>
              )}

              <Input
                onFocus={handleFocusEmail}
                type="email"
                placeholder="email@example.com"
                {...register('email', {
                  onBlur: handleBlurEmail,
                })}
              />
              {errors.email && (
                <span className="text-red-500">{errors.email.message}</span>
              )}

              <Input
                onFocus={handleFocusPassword}
                type="password"
                placeholder="your password"
                {...register('password', {
                  onBlur: handleBlurPassword,
                })}
              />
              {errors.password && (
                <span className="text-red-500">{errors.password.message}</span>
              )}

              <div className="flex w-full justify-end">
                <Link href={'/forgot-password'} className="text-zinc-500">
                  Forgot password?
                </Link>
              </div>

              <Button
                className="w-full bg-red-500 hover:bg-red-600"
                type="submit"
              >
                Register
              </Button>
            </form>
          </CardContent>
          <div className="relative p-5">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>
          <CardFooter className="flex w-full flex-col gap-2">
            <Button className="w-full bg-blue-500 hover:bg-blue-600" asChild>
              <Link href={'/signin'}>
                <LogIn />
                Sign In
              </Link>
            </Button>
            <LoginWithGoogleButton />
            <LoginWithGithubButton />
          </CardFooter>
        </Card>
      </div>
    </main>
  )
}
