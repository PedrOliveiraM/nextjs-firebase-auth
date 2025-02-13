'use client'
import { Button } from '@/components/ui/button'
import { useRive } from '@rive-app/react-canvas'

export function NotFoundComponent() {
  const STATE_MACHINE_NAME = 'SM_ComingSoon'

  const { RiveComponent } = useRive({
    src: '/river/404_purple.riv',
    stateMachines: STATE_MACHINE_NAME,
    autoplay: true,
  })

  return (
    <div className="flex flex-col items-center justify-center">
      <RiveComponent style={{ width: '500px', height: '500px' }} />
      <h1 className="text-center text-4xl font-bold">404 - Page Not Found</h1>
      <p className="text-center text-lg">
        The page you are looking for might have been removed, had its name
        changed or is temporarily unavailable.
      </p>
      <Button>
        <a href="/" className="text-white">
          Go to Home
        </a>
      </Button>
    </div>
  )
}
