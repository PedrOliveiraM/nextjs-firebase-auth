import { manageAuth } from '@/app/actions/manage-auth'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { auth } from '@/lib/auth'

export default async function Dashboard() {
  const session = await auth()
  console.log('#session = ', session)

  return (
    <>
      <header className="bg-white shadow">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Avatar>
                <AvatarImage src={undefined} alt={'User'} />
                <AvatarFallback>{'U'}</AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium text-gray-700">'null'</span>
            </div>
            <form action={manageAuth}>
              <Button>{session ? 'Leave' : 'Login'}</Button>
            </form>
          </div>
        </div>
      </header>
      <h2 className="mb-4 text-2xl font-bold">Welcome to your Dashboard</h2>
      <p className="text-gray-600">
        This is where you can add your dashboard content. You can include
        charts, statistics, or any other relevant information for your study
        project.
      </p>
    </>
  )
}
