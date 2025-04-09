import { NextResponse } from "next/server"
import connectToDatabase from "@/lib/mongodb"
import Workout from "@/models/Workout"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

// Get all workouts for the current user
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = session.user.id

    try {
      await connectToDatabase()
    } catch (error) {
      console.error("Database connection error:", error)
      return NextResponse.json({ error: "Database connection failed" }, { status: 500 })
    }

    const workouts = await Workout.find({ user: userId }).sort({ date: -1 }).populate("exercises.exercise")

    return NextResponse.json({ workouts })
  } catch (error) {
    console.error("Error fetching workouts:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// Create a new workout
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = session.user.id
    const workoutData = await request.json()

    try {
      await connectToDatabase()
    } catch (error) {
      console.error("Database connection error:", error)
      return NextResponse.json({ error: "Database connection failed" }, { status: 500 })
    }

    const newWorkout = await Workout.create({
      ...workoutData,
      user: userId,
    })

    return NextResponse.json({ workout: newWorkout }, { status: 201 })
  } catch (error) {
    console.error("Error creating workout:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
