"use client"

import { Button } from "@/components/ui/button"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html>
      <body>
        <div className="flex min-h-screen flex-col items-center justify-center p-4 text-center">
          <h2 className="mb-2 text-2xl font-bold">Something went wrong!</h2>
          <p className="mb-6 text-gray-600">We're sorry, but there was a critical error loading the application.</p>
          <Button onClick={() => reset()}>Try again</Button>
          {error.digest && <p className="mt-4 text-sm text-gray-500">Error ID: {error.digest}</p>}
        </div>
      </body>
    </html>
  )
}
