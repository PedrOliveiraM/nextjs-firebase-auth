'use client'

import { signIn } from 'next-auth/react'
import { FaGithub } from 'react-icons/fa'
import { Button } from './ui/button'

export function LoginWithGithubButton() {
  return (
    <Button
      className="w-full bg-slate-900"
      onClick={() => signIn('github', { redirectTo: '/dashboard' })}
    >
      <FaGithub />
      Signin with Github
    </Button>
  )
}
