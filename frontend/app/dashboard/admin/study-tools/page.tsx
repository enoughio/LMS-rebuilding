"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Book, Calendar, CheckCircle, Edit, Loader2, Plus, Search, Trash } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/lib/auth-provider"
import { mockStudyToolsService } from "@/lib/mock-api/study-tools-service"
import type { Habit, StudySession, Task } from "@/types/study-tools"

export default function StudyToolsPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [sessions, setSessions] = useState<StudySession[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [habits, setHabits] = useState<Habit[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isAddSessionDialogOpen, setIsAddSessionDialogOpen] = useState(false)
  const [isAddTaskDialogOpen, setIsAddTaskDialogOpen] = useState(false)
  const [isAddHabitDialogOpen, setIsAddHabitDialogOpen] = useState(false)

  const [newSession, setNewSession] = useState<Partial<StudySession>>({
    userId: "",
    date: new Date().toISOString().split("T")[0],
    duration: 60,
    subject: "",
    notes: "",
    startTime: "09:00",
    endTime: "10:00",
  })

  const [newTask, setNewTask] = useState<Partial<Task>>({
    userId: "",
    title: "",
    description: "",
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    priority: "medium",
    status: "pending",
  })

  const [newHabit, setNewHabit] = useState<Partial<Omit<Habit, "id" | "createdAt" | "streak" | "completionHistory">>>({
    userId: "",
    title: "",
    description: "",
    frequency: "daily",
    timeOfDay: "morning",
  })

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        // In a real app, this would fetch data for all users in the library
        // For now, we'll just use the mock data for user-1
        const [sessionsData, tasksData, habitsData] = await Promise.all([
          mockStudyToolsService.getStudySessions("user-1"),
          mockStudyToolsService.getTasks("user-1"),
          mockStudyToolsService.getHabits("user-1"),
        ])

        setSessions(sessionsData)
        setTasks(tasksData)
        setHabits(habitsData)
      } catch (error) {
        console.error("Error fetching study tools data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleSessionInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target
    setNewSession((prev) => ({ ...prev, [name]: value }))
  }

  const handleTaskInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setNewTask((prev) => ({ ...prev, [name]: value }))
  }

  const handleHabitInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setNewHabit((prev) => ({ ...prev, [name]: value }))
  }

  const handleAddSession = async () => {
    if (!newSession.userId || !newSession.subject || !newSession.date) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    try {
      const sessionData = await mockStudyToolsService.addStudySession(newSession as Omit<StudySession, "id">)
      setSessions([...sessions, sessionData])

      toast({
        title: "Study Session Added",
        description: "The study session has been added successfully.",
      })

      setIsAddSessionDialogOpen(false)
      setNewSession({
        userId: "",
        date: new Date().toISOString().split("T")[0],
        duration: 60,
        subject: "",
        notes: "",
        startTime: "09:00",
        endTime: "10:00",
      })
    } catch (error) {
      console.error("Error adding study session:", error)
      toast({
        title: "Error",
        description: "Failed to add study session",
        variant: "destructive",
      })
    }
  }

  const handleAddTask = async () => {
    if (!newTask.userId || !newTask.title) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    try {
      const taskData = await mockStudyToolsService.addTask(newTask as Omit<Task, "id" | "createdAt">)
      setTasks([...tasks, taskData])

      toast({
        title: "Task Added",
        description: "The task has been added successfully.",
      })

      setIsAddTaskDialogOpen(false)
      setNewTask({
        userId: "",
        title: "",
        description: "",
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        priority: "medium",
        status: "pending",
      })
    } catch (error) {
      console.error("Error adding task:", error)
      toast({
        title: "Error",
        description: "Failed to add task",
        variant: "destructive",
      })
    }
  }

  const handleAddHabit = async () => {
    if (!newHabit.userId || !newHabit.title) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    try {
      const habitData = await mockStudyToolsService.addHabit(
        newHabit as Omit<Habit, "id" | "createdAt" | "streak" | "completionHistory">,
      )
      setHabits([...habits, habitData])

      toast({
        title: "Habit Added",
        description: "The habit has been added successfully.",
      })

      setIsAddHabitDialogOpen(false)
      setNewHabit({
        userId: "",
        title: "",
        description: "",
        frequency: "daily",
        timeOfDay: "morning",
      })
    } catch (error) {
      console.error("Error adding habit:", error)
      toast({
        title: "Error",
        description: "Failed to add habit",
        variant: "destructive",
      })
    }
  }

  const handleUpdateTaskStatus = async (taskId: string, status: "pending" | "in-progress" | "completed") => {
    try {
      const updatedTask = await mockStudyToolsService.updateTask(taskId, { status })
      setTasks(tasks.map((task) => (task.id === taskId ? updatedTask : task)))

      toast({
        title: "Task Updated",
        description: `Task status updated to ${status}.`,
      })
    } catch (error) {
      console.error("Error updating task:", error)
      toast({
        title: "Error",
        description: "Failed to update task",
        variant: "destructive",
      })
    }
  }

  const handleDeleteTask = (taskId: string) => {
    // In a real app, this would call an API to delete the task
    setTasks(tasks.filter((task) => task.id !== taskId))

    toast({
      title: "Task Deleted",
      description: "The task has been deleted successfully.",
    })
  }

  const handleDeleteHabit = (habitId: string) => {
    // In a real app, this would call an API to delete the habit
    setHabits(habits.filter((habit) => habit.id !== habitId))

    toast({
      title: "Habit Deleted",
      description: "The habit has been deleted successfully.",
    })
  }

  const handleDeleteSession = (sessionId: string) => {
    // In a real app, this would call an API to delete the session
    setSessions(sessions.filter((session) => session.id !== sessionId))

    toast({
      title: "Session Deleted",
      description: "The study session has been deleted successfully.",
    })
  }

  // Mock users for dropdown
  const mockUsers = [
    { id: "user-1", name: "John Member" },
    { id: "user-2", name: "Jane Member" },
    { id: "user-5", name: "Emma Wilson" },
    { id: "user-6", name: "Michael Brown" },
    { id: "user-7", name: "Sophia Garcia" },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Study Tools</h1>
        <p className="text-muted-foreground">Manage study sessions, tasks, and habits for members</p>
      </div>

      <Tabs defaultValue="sessions">
        <TabsList>
          <TabsTrigger value="sessions">Study Sessions</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="habits">Habits</TabsTrigger>
        </TabsList>

        {/* Study Sessions Tab */}
        <TabsContent value="sessions" className="mt-4 space-y-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="relative w-full md:w-1/3">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search sessions..."
                className="w-full pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <Dialog open={isAddSessionDialogOpen} onOpenChange={setIsAddSessionDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Session
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Add Study Session</DialogTitle>
                  <DialogDescription>Add a new study session for a member.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="userId">Member *</Label>
                    <Select
                      value={newSession.userId}
                      onValueChange={(value) => setNewSession((prev) => ({ ...prev, userId: value }))}
                    >
                      <SelectTrigger id="userId">
                        <SelectValue placeholder="Select member" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockUsers.map((user) => (
                          <SelectItem key={user.id} value={user.id}>
                            {user.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject *</Label>
                    <Input
                      id="subject"
                      name="subject"
                      value={newSession.subject}
                      onChange={handleSessionInputChange}
                      placeholder="e.g. Mathematics"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="date">Date *</Label>
                      <Input
                        id="date"
                        name="date"
                        type="date"
                        value={newSession.date}
                        onChange={handleSessionInputChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="duration">Duration (minutes) *</Label>
                      <Input
                        id="duration"
                        name="duration"
                        type="number"
                        value={newSession.duration}
                        onChange={handleSessionInputChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="startTime">Start Time</Label>
                      <Input
                        id="startTime"
                        name="startTime"
                        type="time"
                        value={newSession.startTime}
                        onChange={handleSessionInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="endTime">End Time</Label>
                      <Input
                        id="endTime"
                        name="endTime"
                        type="time"
                        value={newSession.endTime}
                        onChange={handleSessionInputChange}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea
                      id="notes"
                      name="notes"
                      value={newSession.notes}
                      onChange={handleSessionInputChange}
                      placeholder="Additional notes about the session"
                      rows={3}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddSessionDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddSession}>Add Session</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : sessions.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-lg border py-8 text-center">
              <Book className="h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">No study sessions found</h3>
              <p className="text-muted-foreground">Add a new study session to get started</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {sessions.map((session) => (
                <Card key={session.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>{session.subject}</CardTitle>
                      <Button variant="ghost" size="icon" onClick={() => handleDeleteSession(session.id)}>
                        <Trash className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                    <CardDescription>
                      {new Date(session.date).toLocaleDateString()} • {session.startTime} - {session.endTime}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Duration:</span>
                        <span className="text-sm font-medium">{session.duration} minutes</span>
                      </div>
                      {session.notes && (
                        <div>
                          <span className="text-sm text-muted-foreground">Notes:</span>
                          <p className="text-sm">{session.notes}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" size="sm" className="w-full">
                      <Edit className="mr-2 h-4 w-4" />
                      Edit Session
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Tasks Tab */}
        <TabsContent value="tasks" className="mt-4 space-y-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="relative w-full md:w-1/3">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search tasks..."
                className="w-full pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <Dialog open={isAddTaskDialogOpen} onOpenChange={setIsAddTaskDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Task
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Add Task</DialogTitle>
                  <DialogDescription>Add a new task for a member.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="userId">Member *</Label>
                    <Select
                      value={newTask.userId}
                      onValueChange={(value) => setNewTask((prev) => ({ ...prev, userId: value }))}
                    >
                      <SelectTrigger id="userId">
                        <SelectValue placeholder="Select member" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockUsers.map((user) => (
                          <SelectItem key={user.id} value={user.id}>
                            {user.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="title">Task Title *</Label>
                    <Input
                      id="title"
                      name="title"
                      value={newTask.title}
                      onChange={handleTaskInputChange}
                      placeholder="e.g. Complete calculus assignment"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={newTask.description}
                      onChange={handleTaskInputChange}
                      placeholder="Task description"
                      rows={3}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="dueDate">Due Date</Label>
                      <Input
                        id="dueDate"
                        name="dueDate"
                        type="date"
                        value={newTask.dueDate}
                        onChange={handleTaskInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="priority">Priority</Label>
                      <Select
                        value={newTask.priority}
                        onValueChange={(value) =>
                          setNewTask((prev) => ({ ...prev, priority: value as "low" | "medium" | "high" }))
                        }
                      >
                        <SelectTrigger id="priority">
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddTaskDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddTask}>Add Task</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : tasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-lg border py-8 text-center">
              <CheckCircle className="h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">No tasks found</h3>
              <p className="text-muted-foreground">Add a new task to get started</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {tasks.map((task) => (
                <Card key={task.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="line-clamp-1">{task.title}</CardTitle>
                      <Button variant="ghost" size="icon" onClick={() => handleDeleteTask(task.id)}>
                        <Trash className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                    <CardDescription>
                      {task.dueDate ? `Due: ${new Date(task.dueDate).toLocaleDateString()}` : "No due date"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Badge
                          variant={
                            task.priority === "high"
                              ? "destructive"
                              : task.priority === "medium"
                                ? "default"
                                : "outline"
                          }
                        >
                          {task.priority} priority
                        </Badge>
                        <Badge
                          variant={
                            task.status === "completed"
                              ? "default"
                              : task.status === "in-progress"
                                ? "secondary"
                                : "outline"
                          }
                        >
                          {task.status.replace("-", " ")}
                        </Badge>
                      </div>
                      {task.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2">{task.description}</p>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="flex gap-2">
                    {task.status !== "completed" && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => handleUpdateTaskStatus(task.id, "completed")}
                      >
                        Mark Complete
                      </Button>
                    )}
                    {task.status === "pending" && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => handleUpdateTaskStatus(task.id, "in-progress")}
                      >
                        Start
                      </Button>
                    )}
                    {task.status === "in-progress" && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => handleUpdateTaskStatus(task.id, "pending")}
                      >
                        Pause
                      </Button>
                    )}
                    <Button variant="outline" size="sm" className="flex-1">
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Habits Tab */}
        <TabsContent value="habits" className="mt-4 space-y-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="relative w-full md:w-1/3">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search habits..."
                className="w-full pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <Dialog open={isAddHabitDialogOpen} onOpenChange={setIsAddHabitDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Habit
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Add Habit</DialogTitle>
                  <DialogDescription>Add a new habit for a member to track.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="userId">Member *</Label>
                    <Select
                      value={newHabit.userId}
                      onValueChange={(value) => setNewHabit((prev) => ({ ...prev, userId: value }))}
                    >
                      <SelectTrigger id="userId">
                        <SelectValue placeholder="Select member" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockUsers.map((user) => (
                          <SelectItem key={user.id} value={user.id}>
                            {user.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="title">Habit Title *</Label>
                    <Input
                      id="title"
                      name="title"
                      value={newHabit.title}
                      onChange={handleHabitInputChange}
                      placeholder="e.g. Read for 30 minutes"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={newHabit.description}
                      onChange={handleHabitInputChange}
                      placeholder="Habit description"
                      rows={3}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="frequency">Frequency</Label>
                      <Select
                        value={newHabit.frequency}
                        onValueChange={(value) =>
                          setNewHabit((prev) => ({ ...prev, frequency: value as "daily" | "weekdays" | "weekly" }))
                        }
                      >
                        <SelectTrigger id="frequency">
                          <SelectValue placeholder="Select frequency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="daily">Daily</SelectItem>
                          <SelectItem value="weekdays">Weekdays</SelectItem>
                          <SelectItem value="weekly">Weekly</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="timeOfDay">Time of Day</Label>
                      <Select
                        value={newHabit.timeOfDay}
                        onValueChange={(value) =>
                          setNewHabit((prev) => ({ ...prev, timeOfDay: value as "morning" | "afternoon" | "evening" }))
                        }
                      >
                        <SelectTrigger id="timeOfDay">
                          <SelectValue placeholder="Select time of day" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="morning">Morning</SelectItem>
                          <SelectItem value="afternoon">Afternoon</SelectItem>
                          <SelectItem value="evening">Evening</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddHabitDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddHabit}>Add Habit</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : habits.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-lg border py-8 text-center">
              <Calendar className="h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">No habits found</h3>
              <p className="text-muted-foreground">Add a new habit to get started</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {habits.map((habit) => (
                <Card key={habit.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>{habit.title}</CardTitle>
                      <Button variant="ghost" size="icon" onClick={() => handleDeleteHabit(habit.id)}>
                        <Trash className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                    <CardDescription>
                      {habit.frequency === "daily"
                        ? "Every day"
                        : habit.frequency === "weekdays"
                          ? "Monday to Friday"
                          : "Once a week"}{" "}
                      • {habit.timeOfDay}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Current streak:</span>
                        <span className="text-sm font-medium">{habit.streak} days</span>
                      </div>
                      {habit.description && <p className="text-sm text-muted-foreground">{habit.description}</p>}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" size="sm" className="w-full">
                      <Edit className="mr-2 h-4 w-4" />
                      Edit Habit
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
