import Link from "next/link"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function Home() {
  try {
    const session = await getServerSession(authOptions)

    if (session) {
      redirect("/dashboard")
    }
  } catch (error) {
    console.error("Session error:", error)
    // Continue rendering the home page even if session check fails
  }

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md space-y-8 text-center">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">FitTrack</h1>
            <p className="mt-3 text-lg text-gray-600">
              Track your workouts, monitor your progress, achieve your fitness goals.
            </p>
          </div>

          <div className="mt-8 space-y-4">
            <Link
              href="/login"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Log in
            </Link>
            <Link
              href="/register"
              className="w-full flex justify-center py-3 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Sign up
            </Link>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2">
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-medium">Track Workouts</h3>
              <p className="mt-2 text-sm text-gray-500">
                Log your exercises, sets, reps, and weights to keep a detailed record of your fitness journey.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-medium">Monitor Progress</h3>
              <p className="mt-2 text-sm text-gray-500">
                View your workout history and track improvements in strength, endurance, and overall fitness.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
