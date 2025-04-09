import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <header className="sticky top-0 z-10 bg-white border-b p-4 md:hidden">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">FitTrack</h1>
          <Skeleton className="h-10 w-10 rounded-full" />
        </div>
      </header>

      <main className="flex-1 container max-w-md mx-auto p-4">
        <div className="hidden md:flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">FitTrack</h1>
          <Skeleton className="h-10 w-24" />
        </div>

        <div className="mb-4">
          <Skeleton className="h-10 w-full mb-4" />
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Skeleton className="h-8 w-40" />
            <Skeleton className="h-10 w-32" />
          </div>

          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-24 w-full rounded-lg" />
            ))}
          </div>
        </div>
      </main>

      <nav className="sticky bottom-0 bg-white border-t md:hidden">
        <div className="flex justify-around">
          <Skeleton className="h-16 w-1/2" />
          <Skeleton className="h-16 w-1/2" />
        </div>
      </nav>
    </div>
  )
}
