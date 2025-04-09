"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Application error:", error)
  }, [error])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 text-center">
      <h2 className="mb-2 text-2xl font-bold">Something went wrong!</h2>
      <p className="mb-6 text-gray-600">We're sorry, but there was an error loading this page.</p>
      <div className="flex gap-4">
        <Button onClick={() => reset()}>Try again</Button>
        <Button variant="outline" onClick={() => (window.location.href = "/")}>
          Go to homepage
        </Button>
      </div>
      {error.digest && <p className="mt-4 text-sm text-gray-500">Error ID: {error.digest}</p>}
    </div>
  )
}
