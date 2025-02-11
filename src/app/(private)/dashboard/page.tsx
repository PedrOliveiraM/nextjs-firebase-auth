/* eslint-disable prettier/prettier */
'use client'
import { DownloadFormData, DownloadSchema } from '@/@types/downloadsDto'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
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
import { zodResolver } from '@hookform/resolvers/zod'
import { Download, Github } from 'lucide-react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

export default function Dashboard() {
  const { data: session } = useSession()
  const [filesDownloaded, setFilesDownloaded] = useState<number>(0)
  const [totalAccess, setTotalAccess] = useState<number>(0)
  const [totalUsers, setTotalUsers] = useState<number>(0)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const response = await fetch('/api/stats')

      if (!response.ok) {
        throw new Error('Failed to fetch posts')
      }

      const { totalDownloads, totalAccess, totalUsers } = await response.json()

      if (totalDownloads) setFilesDownloaded(totalDownloads)
      if (totalAccess) setTotalAccess(totalAccess)
      if (totalUsers) setTotalUsers(totalUsers)

    } catch (error) {
      alert('An unexpected error occurred. Please try again later.')
      console.error('Error fetching data:', error)
    }
  }

  const handleClickDownload = async (filename: string) => {
    try {
      const response = await fetch('/api/stats', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filename }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        alert(`Failed to update quantity: ${responseData.error}`);
        return;
      }

      alert('Doc updated successfully');
      fetchData()
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('An unexpected error occurred. Please try again later.');
    }
  };

  const { register, handleSubmit, formState: { errors } } = useForm<DownloadFormData>({
    resolver: zodResolver(DownloadSchema),
  });

  const onSubmit = async (data: DownloadFormData) => {
    try {
      const response = await fetch('/api/stats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();

      if (!response.ok) {
        alert(`Failed to register download: ${responseData.error}`);
        return;
      }

      alert('Download registered successfully');
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('An unexpected error occurred. Please try again later.');
    }
  };


  if (!session) return <span>Loading...</span>

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Avatar>
                <AvatarImage
                  src={session?.user?.image || ''}
                  alt={session?.user?.name || ''}
                />
                <AvatarFallback>
                  {session?.user?.name
                    ? session?.user.name
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
          </div>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">
        <div className="flex justigy-between p-5">
          <div className="flex flex-col gap-3">
            <h2 className="mb-4 text-3xl font-bold text-gray-800">
              Welcome to your Dashboard
            </h2>
            <p className="mb-8 text-lg text-gray-600">
              This is where you can view your project information, download
              resources, and access the source code.
            </p>
          </div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Card>
              <CardContent className='flex flex-col gap-4 p-5'>
                <Input type="text" placeholder='Filename' {...register('filename')} />
                {errors.filename && <span className="text-red-500">{errors.filename.message}</span>}
                <Input type="number" placeholder='Access quantity' {...register('quantity', {
                  valueAsNumber: true
                })} />
                {errors.quantity && <span className="text-red-500">{errors.quantity.message}</span>}
              </CardContent>
              <CardFooter>
                <Button type='submit'>Register</Button>
              </CardFooter>
            </Card>
          </form>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl">
              Congratulations on Logging In!
            </CardTitle>
            <CardDescription>
              You can now download the project source code and related files.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <Button asChild variant="outline" className="w-full" >
                <Link
                  href="https://github.com/PedrOliveiraM/nextjs-firebase-auth"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => handleClickDownload('https://github.com/PedrOliveiraM/nextjs-firebase-auth')}
                >
                  <Github className="mr-2 h-4 w-4" />
                  Source Code
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link href="/river/login_screen_character.riv" download onClick={() => handleClickDownload('/river/login_screen_character.riv')}>
                  <Download className="mr-2 h-4 w-4" />
                  Login Screen Animation
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link href="/river/404_purple.riv" download onClick={() => handleClickDownload('/river/404_purple.riv')}>
                  <Download className="mr-2 h-4 w-4" />
                  404 Screen Animation
                </Link>
              </Button>
            </div>
          </CardContent>
          <CardFooter>
            <p className="text-sm text-gray-500">
              Click on the buttons above to download or view the resources.
            </p>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Project Statistics</CardTitle>
            <CardDescription>
              An overview of your project's current status.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-lg bg-blue-100 p-4 text-center">
                <h3 className="text-xl font-semibold text-blue-800">
                  Total access
                </h3>
                <p className="text-3xl font-bold text-blue-600">{totalAccess}</p>
              </div>
              <div className="rounded-lg bg-green-100 p-4 text-center">
                <h3 className="text-xl font-semibold text-green-800">
                  Total Users
                </h3>
                <p className="text-3xl font-bold text-green-600">{totalUsers}</p>
              </div>
              <div className="rounded-lg bg-purple-100 p-4 text-center">
                <h3 className="text-xl font-semibold text-purple-800">
                  Files Downloaded
                </h3>
                <p className="text-3xl font-bold text-purple-600">{filesDownloaded}</p>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <p className="text-sm text-gray-500">
              Last updated: {new Date().toLocaleString()}
            </p>
          </CardFooter>
        </Card>
      </main>
    </div>
  )
}
