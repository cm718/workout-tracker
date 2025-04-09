"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronLeft, CheckCircle, Edit, Trash2 } from "lucide-react"
import { format } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface Exercise {
  _id: string
  exercise: {
    _id: string
    name: string
    category: string
  }
  sets: number
  reps?: number
  weight?: number
  duration?: number
  distance?: number
  notes?: string
}

interface Workout {
  _id: string
  name: string
  date: string
  exercises: Exercise[]
  completed: boolean
  duration?: number
  notes?: string
}

export default function WorkoutDetails({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [workout, setWorkout] = useState<Workout | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [isDeleting, setIsDeleting] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)

  useEffect(() => {
    const fetchWorkout = async () => {
      try {
        const response = await fetch(`/api/workouts/${params.id}`)

        if (!response.ok) {
          throw new Error("Failed to fetch workout")
        }

        const data = await response.json()
        setWorkout(data.workout)
      } catch (err) {
        setError("Error loading workout details")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchWorkout()
  }, [params.id])

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      const response = await fetch(`/api/workouts/${params.id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete workout")
      }

      router.push("/dashboard")
      router.refresh()
    } catch (err) {
      console.error(err)
      setIsDeleting(false)
    }
  }

  const toggleWorkoutCompletion = async () => {
    if (!workout) return

    setIsUpdating(true)
    try {
      const response = await fetch(`/api/workouts/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          completed: !workout.completed,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to update workout")
      }

      const data = await response.json()
      setWorkout(data.workout)
    } catch (err) {
      console.error(err)
    } finally {
      setIsUpdating(false)
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <header className="sticky top-0 z-10 bg-white border-b p-4">
          <div className="flex items-center">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Skeleton className="h-6 w-40 ml-2" />
          </div>
        </header>
        <main className="flex-1 container max-w-md mx-auto p-4 space-y-6">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-60 w-full" />
        </main>
      </div>
    )
  }

  if (error || !workout) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <header className="sticky top-0 z-10 bg-white border-b p-4">
          <div className="flex items-center">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-bold ml-2">Error</h1>
          </div>
        </header>
        <main className="flex-1 container max-w-md mx-auto p-4">
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-red-500">{error || "Workout not found"}</p>
              <Button className="w-full mt-4" onClick={() => router.push("/dashboard")}>
                Back to Dashboard
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <header className="sticky top-0 z-10 bg-white border-b p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-bold ml-2">Workout Details</h1>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" onClick={() => router.push(`/workouts/edit/${params.id}`)}>
              <Edit className="h-5 w-5" />
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Trash2 className="h-5 w-5 text-red-500" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Workout</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete this workout? This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="bg-red-500 hover:bg-red-600"
                  >
                    {isDeleting ? "Deleting..." : "Delete"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </header>

      <main className="flex-1 container max-w-md mx-auto p-4 space-y-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>{workout.name}</CardTitle>
              <p className="text-sm text-gray-500 mt-1">{format(new Date(workout.date), "MMMM d, yyyy")}</p>
            </div>
            <Badge variant={workout.completed ? "success" : "secondary"}>
              {workout.completed ? "Completed" : "In Progress"}
            </Badge>
          </CardHeader>
          <CardContent>
            {workout.notes && (
              <div className="mb-4">
                <h3 className="text-sm font-medium mb-1">Notes</h3>
                <p className="text-sm text-gray-600">{workout.notes}</p>
              </div>
            )}
            <Button
              variant={workout.completed ? "outline" : "default"}
              className="w-full mt-2"
              onClick={toggleWorkoutCompletion}
              disabled={isUpdating}
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              {workout.completed ? "Mark as Incomplete" : "Mark as Complete"}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Exercises</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {workout.exercises.length === 0 ? (
              <p className="text-center text-gray-500">No exercises in this workout.</p>
            ) : (
              workout.exercises.map((exercise, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <h3 className="font-medium">{exercise.exercise.name}</h3>
                  <div className="mt-2 grid grid-cols-3 gap-2 text-sm">
                    {exercise.sets && (
                      <div>
                        <span className="text-gray-500">Sets:</span> {exercise.sets}
                      </div>
                    )}
                    {exercise.reps && (
                      <div>
                        <span className="text-gray-500">Reps:</span> {exercise.reps}
                      </div>
                    )}
                    {exercise.weight && (
                      <div>
                        <span className="text-gray-500">Weight:</span> {exercise.weight} kg
                      </div>
                    )}
                    {exercise.duration && (
                      <div>
                        <span className="text-gray-500">Duration:</span> {exercise.duration} sec
                      </div>
                    )}
                    {exercise.distance && (
                      <div>
                        <span className="text-gray-500">Distance:</span> {exercise.distance} km
                      </div>
                    )}
                  </div>
                  {exercise.notes && (
                    <div className="mt-2 text-sm">
                      <span className="text-gray-500">Notes:</span> {exercise.notes}
                    </div>
                  )}
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
