import { createFileRoute, Outlet, useRouter } from '@tanstack/react-router'
import { ArrowLeftIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'

export const Route = createFileRoute('/_authenticated/app/help')({
  component: RouteComponent,
})

function RouteComponent() {
  const router = useRouter()
  return (
    <main className="min-h-screen ">
      <div className="mx-auto max-w-screen-2xl p-4">
        <nav className="flex justify-between items-center">
          <Button
            variant="ghost"
            onClick={() => router.history.back()}
          >
            <ArrowLeftIcon className="w-4 h-4" />
            Back
          </Button>
        </nav>
        <div className="flex flex-col items-center justify-center py-4">
          <Outlet />
        </div>
      </div>
    </main>
  )
}
