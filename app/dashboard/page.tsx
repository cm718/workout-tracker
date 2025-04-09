import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import DashboardClient from "./dashboard-client"
import connectToDatabase from "@/lib/mongodb"
import Workout from "@/models/Workout"

export default async function Dashboard() {
  let session

  try {
    session = await getServerSession(authOptions)
  } catch (error) {
    console.error("Session error:", error)
    redirect("/login?error=session")
  }

  if (!session) {
    redirect("/login")
  }

  let recentWorkouts = []

  try {
    await connectToDatabase()

    // Fetch recent workouts
    const workoutsData = await Workout.find({ user: session.user.id })
      .sort({ date: -1 })
      .limit(5)
      .populate("exercises.exercise")
      .lean()

    if (workoutsData) {
      recentWorkouts = workoutsData
    }
  } catch (error) {
    console.error("Error fetching workouts:", error)
    // Continue with empty workouts array
  }

  // Convert MongoDB documents to plain objects and handle date serialization
  const serializedWorkouts = recentWorkouts.map((workout) => ({
    ...workout,
    _id: workout._id.toString(),
    user: workout.user.toString(),
    date: workout.date.toISOString(),
    createdAt: workout.createdAt.toISOString(),
    updatedAt: workout.updatedAt.toISOString(),
    exercises: workout.exercises.map((exercise) => ({
      ...exercise,
      _id: exercise._id.toString(),
      exercise: {
        ...exercise.exercise,
        _id: exercise.exercise._id.toString(),
        createdAt: exercise.exercise.createdAt.toISOString(),
        updatedAt: exercise.exercise.updatedAt.toISOString(),
      },
    })),
  }))

  return <DashboardClient workouts={serializedWorkouts} />
}
