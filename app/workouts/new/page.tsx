"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, ChevronLeft, Plus, Trash2 } from "lucide-react"
import { format } from "date-fns"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Mock exercise data (in a real app, this would come from the database)
const exerciseOptions = [
  { id: "1", name: "Bench Press", category: "strength" },
  { id: "2", name: "Squats", category: "strength" },
  { id: "3", name: "Deadlift", category: "strength" },
  { id: "4", name: "Pull-ups", category: "strength" },
  { id: "5", name: "Running", category: "cardio" },
  { id: "6", name: "Cycling", category: "cardio" },
  { id: "7", name: "Jumping Rope", category: "cardio" },
  { id: "8", name: "Yoga", category: "flexibility" },
]

export default function NewWorkout() {
  const router = useRouter()
  const [date, setDate] = useState<Date>(new Date())
  const [workoutName, setWorkoutName] = useState("")
  const [exercises, setExercises] = useState<
    Array<{
      exerciseId: string
      sets: number
      reps: number
      weight: number
    }>
  >([])
  const [isLoading, setIsLoading] = useState(false)

  const addExercise = () => {
    setExercises([...exercises, { exerciseId: "", sets: 3, reps: 10, weight: 0 }])
  }

  const removeExercise = (index: number) => {
    const newExercises = [...exercises]
    newExercises.splice(index, 1)
    setExercises(newExercises)
  }

  const updateExercise = (index: number, field: string, value: string | number) => {
    const newExercises = [...exercises]
    newExercises[index] = { ...newExercises[index], [field]: value }
    setExercises(newExercises)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const workoutData = {
        name: workoutName,
        date: date.toISOString(),
        exercises: exercises.map((ex) => ({
          exercise: ex.exerciseId,
          sets: ex.sets,
          reps: ex.reps,
          weight: ex.weight,
        })),
        completed: false,
      }

      const response = await fetch("/api/workouts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(workoutData),
      })

      if (!response.ok) {
        throw new Error("Failed to create workout")
      }

      router.push("/dashboard")
      router.refresh()
    } catch (error) {
      console.error("Error creating workout:", error)
      // Handle error (show error message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Mobile header */}
      <header className="sticky top-0 z-10 bg-white border-b p-4">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold ml-2">New Workout</h1>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 container max-w-md mx-auto p-4">
        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Workout Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Workout Name</Label>
                <Input
                  id="name"
                  value={workoutName}
                  onChange={(e) => setWorkoutName(e.target.value)}
                  placeholder="e.g., Morning Strength Training"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={date} onSelect={(date) => date && setDate(date)} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Exercises</CardTitle>
              <Button type="button" onClick={addExercise} size="sm">
                <Plus className="h-4 w-4 mr-1" />
                Add Exercise
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {exercises.length === 0 ? (
                <div className="text-center py-4 text-gray-500">
                  <p>No exercises added yet.</p>
                  <p className="text-sm">Click "Add Exercise" to get started.</p>
                </div>
              ) : (
                exercises.map((exercise, index) => (
                  <div key={index} className="border rounded-lg p-4 space-y-3">
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium">Exercise {index + 1}</h3>
                      <Button type="button" variant="ghost" size="sm" onClick={() => removeExercise(index)}>
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`exercise-${index}`}>Exercise</Label>
                      <Select
                        value={exercise.exerciseId}
                        onValueChange={(value) => updateExercise(index, "exerciseId", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select an exercise" />
                        </SelectTrigger>
                        <SelectContent>
                          {exerciseOptions.map((option) => (
                            <SelectItem key={option.id} value={option.id}>
                              {option.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <div className="space-y-2">
                        <Label htmlFor={`sets-${index}`}>Sets</Label>
                        <Input
                          id={`sets-${index}`}
                          type="number"
                          min="1"
                          value={exercise.sets}
                          onChange={(e) => updateExercise(index, "sets", Number.parseInt(e.target.value))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`reps-${index}`}>Reps</Label>
                        <Input
                          id={`reps-${index}`}
                          type="number"
                          min="0"
                          value={exercise.reps}
                          onChange={(e) => updateExercise(index, "reps", Number.parseInt(e.target.value))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`weight-${index}`}>Weight (kg)</Label>
                        <Input
                          id={`weight-${index}`}
                          type="number"
                          min="0"
                          step="0.5"
                          value={exercise.weight}
                          onChange={(e) => updateExercise(index, "weight", Number.parseFloat(e.target.value))}
                        />
                      </div>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full" disabled={isLoading || exercises.length === 0 || !workoutName}>
                {isLoading ? "Creating..." : "Create Workout"}
              </Button>
            </CardFooter>
          </Card>
        </form>
      </main>
    </div>
  )
}
