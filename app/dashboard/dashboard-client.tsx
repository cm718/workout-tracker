"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarDays, Dumbbell, LogOut, Plus, User } from "lucide-react"
import { format } from "date-fns"
import { Badge } from "@/components/ui/badge"

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
}

interface Workout {
  _id: string
  name: string
  date: string
  exercises: Exercise[]
  completed: boolean
  duration?: number
}

interface DashboardClientProps {
  workouts: Workout[]
}

export default function DashboardClient({ workouts }: DashboardClientProps) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("workouts")

  const handleSignOut = async () => {
    await signOut({ redirect: false })
    router.push("/")
    router.refresh()
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Mobile header */}
      <header className="sticky top-0 z-10 bg-white border-b p-4 md:hidden">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">FitTrack</h1>
          <Button variant="ghost" size="icon" onClick={handleSignOut}>
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 container max-w-md mx-auto p-4">
        <div className="hidden md:flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">FitTrack</h1>
          <Button variant="outline" onClick={handleSignOut}>
            <LogOut className="h-4 w-4 mr-2" />
            Sign out
          </Button>
        </div>

        <Tabs defaultValue="workouts" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="workouts">
              <Dumbbell className="h-4 w-4 mr-2" />
              Workouts
            </TabsTrigger>
            <TabsTrigger value="profile">
              <User className="h-4 w-4 mr-2" />
              Profile
            </TabsTrigger>
          </TabsList>

          <TabsContent value="workouts" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Recent Workouts</h2>
              <Button onClick={() => router.push("/workouts/new")}>
                <Plus className="h-4 w-4 mr-2" />
                New Workout
              </Button>
            </div>

            {workouts.length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center">
                  <p className="text-muted-foreground">You haven't added any workouts yet.</p>
                  <Button className="mt-4" onClick={() => router.push("/workouts/new")}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Your First Workout
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {workouts.map((workout) => (
                  <Link key={workout._id} href={`/workouts/${workout._id}`}>
                    <Card className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium">{workout.name}</h3>
                            <div className="flex items-center text-sm text-gray-500 mt-1">
                              <CalendarDays className="h-3.5 w-3.5 mr-1" />
                              {format(new Date(workout.date), "MMM d, yyyy")}
                            </div>
                          </div>
                          <Badge variant={workout.completed ? "success" : "secondary"}>
                            {workout.completed ? "Completed" : "In Progress"}
                          </Badge>
                        </div>
                        <div className="mt-3">
                          <p className="text-sm text-gray-600">
                            {workout.exercises.length} exercise{workout.exercises.length !== 1 ? "s" : ""}
                            {workout.duration ? ` • ${workout.duration} min` : ""}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Profile</CardTitle>
                <CardDescription>Manage your account settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Account Settings</p>
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => router.push("/profile/settings")}
                  >
                    <User className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">App Settings</p>
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => router.push("/profile/preferences")}
                  >
                    <Dumbbell className="h-4 w-4 mr-2" />
                    Workout Preferences
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Mobile navigation */}
      <nav className="sticky bottom-0 bg-white border-t md:hidden">
        <div className="flex justify-around">
          <Button
            variant={activeTab === "workouts" ? "default" : "ghost"}
            className="flex-1 py-6 rounded-none"
            onClick={() => setActiveTab("workouts")}
          >
            <Dumbbell className="h-5 w-5" />
          </Button>
          <Button
            variant={activeTab === "profile" ? "default" : "ghost"}
            className="flex-1 py-6 rounded-none"
            onClick={() => setActiveTab("profile")}
          >
            <User className="h-5 w-5" />
          </Button>
        </div>
      </nav>
    </div>
  )
}
