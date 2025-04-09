import { NextResponse } from "next/server"
import connectToDatabase from "@/lib/mongodb"
import Workout from "@/models/Workout"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

// Get a specific workout
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = session.user.id
    const workoutId = params.id

    try {
      await connectToDatabase()
    } catch (error) {
      console.error("Database connection error:", error)
      return NextResponse.json({ error: "Database connection failed" }, { status: 500 })
    }

    const workout = await Workout.findOne({
      _id: workoutId,
      user: userId,
    }).populate("exercises.exercise")

    if (!workout) {
      return NextResponse.json({ error: "Workout not found" }, { status: 404 })
    }

    return NextResponse.json({ workout })
  } catch (error) {
    console.error("Error fetching workout:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// Update a workout
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = session.user.id
    const workoutId = params.id
    const updateData = await request.json()

    try {
      await connectToDatabase()
    } catch (error) {
      console.error("Database connection error:", error)
      return NextResponse.json({ error: "Database connection failed" }, { status: 500 })
    }

    const workout = await Workout.findOneAndUpdate({ _id: workoutId, user: userId }, updateData, {
      new: true,
    }).populate("exercises.exercise")

    if (!workout) {
      return NextResponse.json({ error: "Workout not found" }, { status: 404 })
    }

    return NextResponse.json({ workout })
  } catch (error) {
    console.error("Error updating workout:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// Delete a workout
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = session.user.id
    const workoutId = params.id

    try {
      await connectToDatabase()
    } catch (error) {
      console.error("Database connection error:", error)
      return NextResponse.json({ error: "Database connection failed" }, { status: 500 })
    }

    const workout = await Workout.findOneAndDelete({
      _id: workoutId,
      user: userId,
    })

    if (!workout) {
      return NextResponse.json({ error: "Workout not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting workout:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
