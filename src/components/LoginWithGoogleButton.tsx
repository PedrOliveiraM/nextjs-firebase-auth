'use client'

import { signIn } from 'next-auth/react'
import { FcGoogle } from 'react-icons/fc'
import { Button } from './ui/button'

export function LoginWithGoogleButton() {
  return (
    <Button className="w-full bg-slate-900" onClick={() => signIn('google')}>
      <FcGoogle />
      Signin with Google
    </Button>
  )
}
