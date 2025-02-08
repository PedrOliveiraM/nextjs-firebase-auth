/* eslint-disable prettier/prettier */
import { manageAuth } from '@/app/actions/manage-auth'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function Dashboard() {
  const session = await auth()

  if (!session) {
    redirect('/signIn')
  }

  return (
    <>
      <header className="bg-white shadow">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Avatar>
                <AvatarImage src={session!.user!.image || ''} alt={session!.user!.name || ''} />
                <AvatarFallback>
                  {session?.user?.name
                    ? session.user.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                    : 'U'}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium text-gray-700">
                {session?.user?.name || 'User'}
              </span>
            </div>
            <form action={manageAuth}>
              <Button>{session ? 'LogOut' : 'Login'}</Button>
            </form>
          </div>
        </div>
      </header>
      <main className='container mx-auto px-4 py-8'>
        <h2 className="mb-4 text-2xl font-bold">Welcome to your Dashboard</h2>
        <p className="text-gray-600">
          This is where you can add your dashboard content. You can include
          charts, statistics, or any other relevant information for your study
          project.
        </p>
      </main>
    </>
  )
}
