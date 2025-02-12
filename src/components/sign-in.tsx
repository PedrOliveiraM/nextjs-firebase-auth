'use client'

import { signInFormData, signInFormSchema } from '@/@types/signInFormSchema'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRive, useStateMachineInput } from '@rive-app/react-canvas'
import { LogIn } from 'lucide-react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { LoginWithGithubButton } from './loginWithGithubButton'
import { LoginWithGoogleButton } from './LoginWithGoogleButton'
import { Button } from './ui/button'
import { Input } from './ui/input'

const STATE_MACHINE_NAME = 'State Machine 1'

export function SignInForm() {
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
  } = useForm<signInFormData>({
    resolver: zodResolver(signInFormSchema),
  })

  function createUser(data: signInFormData) {
    if (data.email === 'pedro@gmail.com' && data.password === '123456') {
      handleSubmitSuccess()
    }
    handleSubmitFail()
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
              WELCOME
            </CardTitle>
            <CardDescription className="flex justify-center">
              log in to continue
            </CardDescription>
          </CardHeader>
          <CardContent className="py-0">
            <form className="space-y-2" onSubmit={handleSubmit(createUser)}>
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
                className="w-full bg-blue-500 hover:bg-blue-600"
                type="submit"
              >
                <LogIn /> Log In
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
            <Button className="w-full bg-red-500 hover:bg-red-600" asChild>
              <Link href={'/signup'}>Sign up</Link>
            </Button>
            <LoginWithGoogleButton />
            <LoginWithGithubButton />
          </CardFooter>
        </Card>
      </div>
    </main>
  )
}
