'use client'
import { FaGithub } from 'react-icons/fa'
import { FcGoogle } from 'react-icons/fc'

import {
  createUserFormData,
  createUserFormSchema,
} from '@/@types/createUserFormSchema'
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
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { Button } from './ui/button'
import { Input } from './ui/input'

const STATE_MACHINE_NAME = 'State Machine 1'

export function SignIn() {
  const { rive, RiveComponent } = useRive({
    src: '/river/login_screen_character.riv',
    autoplay: true,
    stateMachines: STATE_MACHINE_NAME,
  })

  const stateSuccess = useStateMachineInput(rive, STATE_MACHINE_NAME, 'success')
  const stateFail = useStateMachineInput(rive, STATE_MACHINE_NAME, 'fail')
  const stateHandUp = useStateMachineInput(rive, STATE_MACHINE_NAME, 'hands_up')

  const stateCheck = useStateMachineInput(rive, STATE_MACHINE_NAME, 'Check')
  const stateLook = useStateMachineInput(rive, STATE_MACHINE_NAME, 'Look')

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
    stateLook!.value = 45
    if (stateCheck) stateCheck.fire()
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
  } = useForm<createUserFormData>({
    resolver: zodResolver(createUserFormSchema),
  })

  function createUser(data: createUserFormData) {
    console.log(data)

    if (data.email === 'pedro@gmail.com' && data.password === '123456') {
      handleSubmitSuccess()
    }
    handleSubmitFail()
  }

  return (
    <div className="flex items-center justify-center gap-4">
      <main className="flex flex-col">
        <RiveComponent style={{ width: '500px', height: '500px' }} />
        <Card>
          <CardHeader>
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
                {...register('email')}
                type="email"
                placeholder="email@example.com"
              />
              {errors.email && (
                <span className="text-red-500">{errors.email.message}</span>
              )}

              <Input
                onFocus={handleFocusPassword}
                {...register('password', {
                  onBlur: handleBlurPassword,
                })}
                type="password"
                placeholder="your password"
              />
              {errors.password && (
                <span className="text-red-500">{errors.password.message}</span>
              )}

              <div className="flex w-full justify-end">
                <Link href={'/'} className="text-zinc-500">
                  Forgot password?
                </Link>
              </div>

              <Button
                className="w-full bg-blue-500 hover:bg-blue-600"
                type="submit"
              >
                Submit
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
            <Button className="w-full bg-slate-900">
              <FcGoogle />
              Google
            </Button>
            <Button className="w-full">
              <FaGithub />
              Github
            </Button>
          </CardFooter>
        </Card>
      </main>
    </div>
  )
}
