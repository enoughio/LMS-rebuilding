"use client"

import type React from "react"

import { useState, useEffect } from "react"
import {
  AlertTriangle,
  Calendar,
  ClipboardCheck,
  Clock,
  Loader2,
  Plus,
  Search,
  PenToolIcon as Tool,
  CheckCircle,
  Edit,
  Trash,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/lib/auth-provider"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// Define types for maintenance tasks
interface MaintenanceTask {
  id: string
  title: string
  description: string
  status: "pending" | "in_progress" | "completed" | "cancelled"
  priority: "low" | "medium" | "high" | "urgent"
  category: "cleaning" | "repairs" | "it" | "furniture" | "electrical" | "plumbing" | "other"
  assignedTo?: {
    id: string
    name: string
    avatar?: string
  }
  dueDate: string
  createdAt: string
  completedAt?: string
  notes?: string
  recurring?: boolean
  recurringFrequency?: "daily" | "weekly" | "monthly" | "quarterly" | "yearly"
}

// Sample staff members
const mockStaffMembers = [
  { id: "staff-1", name: "Rajesh Kumar", avatar: "/placeholder.svg?height=40&width=40" },
  { id: "staff-2", name: "Ananya Sharma", avatar: "/placeholder.svg?height=40&width=40" },
  { id: "staff-3", name: "Vikram Singh", avatar: "/placeholder.svg?height=40&width=40" },
  { id: "staff-4", name: "Priya Patel", avatar: "/placeholder.svg?height=40&width=40" },
]

// Sample maintenance tasks
const mockMaintenanceTasks: MaintenanceTask[] = [
  {
    id: "task-1",
    title: "Repair broken chair in Reading Room 2",
    description: "Chair near window has a broken leg and needs repair or replacement.",
    status: "pending",
    priority: "medium",
    category: "furniture",
    dueDate: "2023-10-25",
    createdAt: "2023-10-15T09:30:00Z",
    assignedTo: mockStaffMembers[2],
  },
  {
    id: "task-2",
    title: "Clean carpets in main hall",
    description: "Deep clean all carpets in the main hall area.",
    status: "in_progress",
    priority: "medium",
    category: "cleaning",
    dueDate: "2023-10-28",
    createdAt: "2023-10-18T14:15:00Z",
    assignedTo: mockStaffMembers[1],
  },
  {
    id: "task-3",
    title: "Fix Wi-Fi router in Study Zone",
    description: "Wi-Fi connectivity issues reported in the quiet study zone. Router may need reset or replacement.",
    status: "completed",
    priority: "high",
    category: "it",
    dueDate: "2023-10-20",
    createdAt: "2023-10-19T11:00:00Z",
    completedAt: "2023-10-20T14:30:00Z",
    assignedTo: mockStaffMembers[0],
    notes: "Router was reset and firmware updated. Connectivity is now stable.",
  },
  {
    id: "task-4",
    title: "Replace light bulbs in conference room",
    description: "3 light bulbs need replacement in the conference room.",
    status: "pending",
    priority: "low",
    category: "electrical",
    dueDate: "2023-10-30",
    createdAt: "2023-10-20T09:45:00Z",
  },
  {
    id: "task-5",
    title: "Fix leaking tap in restroom",
    description: "The tap in the men's restroom is leaking and needs repair.",
    status: "pending",
    priority: "urgent",
    category: "plumbing",
    dueDate: "2023-10-24",
    createdAt: "2023-10-23T08:30:00Z",
    assignedTo: mockStaffMembers[3],
  },
  {
    id: "task-6",
    title: "Weekly sanitization of public areas",
    description: "Sanitize all public areas including reading tables, computer stations, and door handles.",
    status: "pending",
    priority: "high",
    category: "cleaning",
    dueDate: "2023-10-27",
    createdAt: "2023-10-20T16:00:00Z",
    recurring: true,
    recurringFrequency: "weekly",
  },
]

export default function MaintenancePage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [tasks, setTasks] = useState<MaintenanceTask[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [priorityFilter, setPriorityFilter] = useState<string>("all")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [isAddTaskDialogOpen, setIsAddTaskDialogOpen] = useState(false)
  const [isEditTaskDialogOpen, setIsEditTaskDialogOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState<MaintenanceTask | null>(null)
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    priority: "medium",
    category: "other",
    assignedToId: "",
    dueDate: new Date().toISOString().split("T")[0],
    recurring: false,
    recurringFrequency: "weekly",
  })

  useEffect(() => {
    // Simulate API call to fetch tasks
    const fetchTasks = async () => {
      setLoading(true)
      try {
        // In a real app, this would fetch data from an API
        setTimeout(() => {
          setTasks(mockMaintenanceTasks)
          setLoading(false)
        }, 1000)
      } catch (error) {
        console.error("Error fetching maintenance tasks:", error)
        setLoading(false)
      }
    }

    fetchTasks()
  }, [])

  // Apply filters
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === "all" || task.status === statusFilter
    const matchesPriority = priorityFilter === "all" || task.priority === priorityFilter
    const matchesCategory = categoryFilter === "all" || task.category === categoryFilter

    return matchesSearch && matchesStatus && matchesPriority && matchesCategory
  })

  // Calculate task statistics
  const taskStats = {
    total: tasks.length,
    pending: tasks.filter((task) => task.status === "pending").length,
    inProgress: tasks.filter((task) => task.status === "in_progress").length,
    completed: tasks.filter((task) => task.status === "completed").length,
    urgent: tasks.filter((task) => task.priority === "urgent").length,
    overdue: tasks.filter((task) => {
      const dueDate = new Date(task.dueDate)
      const today = new Date()
      return dueDate < today && task.status !== "completed"
    }).length,
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setNewTask((prev) => ({ ...prev, [name]: value }))
  }

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setNewTask((prev) => ({ ...prev, [name]: checked }))
  }

  const handleAddTask = () => {
    if (!newTask.title || !newTask.description || !newTask.dueDate) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    const assignedStaffMember = newTask.assignedToId
      ? mockStaffMembers.find((staff) => staff.id === newTask.assignedToId)
      : undefined

    const task: MaintenanceTask = {
      id: `task-${Date.now()}`,
      title: newTask.title,
      description: newTask.description,
      status: "pending",
      priority: newTask.priority as MaintenanceTask["priority"],
      category: newTask.category as MaintenanceTask["category"],
      assignedTo: assignedStaffMember,
      dueDate: newTask.dueDate,
      createdAt: new Date().toISOString(),
      recurring: newTask.recurring,
      recurringFrequency: newTask.recurring
        ? (newTask.recurringFrequency as MaintenanceTask["recurringFrequency"])
        : undefined,
    }

    setTasks([...tasks, task])
    setIsAddTaskDialogOpen(false)

    // Reset form
    setNewTask({
      title: "",
      description: "",
      priority: "medium",
      category: "other",
      assignedToId: "",
      dueDate: new Date().toISOString().split("T")[0],
      recurring: false,
      recurringFrequency: "weekly",
    })

    toast({
      title: "Task Added",
      description: "Maintenance task has been added successfully.",
    })
  }

  const handleEditTask = () => {
    if (!selectedTask) return

    setTasks(tasks.map((task) => (task.id === selectedTask.id ? selectedTask : task)))

    setIsEditTaskDialogOpen(false)
    setSelectedTask(null)

    toast({
      title: "Task Updated",
      description: "Maintenance task has been updated successfully.",
    })
  }

  const handleDeleteTask = (taskId: string) => {
    setTasks(tasks.filter((task) => task.id !== taskId))

    toast({
      title: "Task Deleted",
      description: "Maintenance task has been deleted successfully.",
    })
  }

  const handleStatusChange = (taskId: string, status: MaintenanceTask["status"]) => {
    setTasks(
      tasks.map((task) => {
        if (task.id === taskId) {
          const updatedTask = {
            ...task,
            status,
            completedAt: status === "completed" ? new Date().toISOString() : undefined,
          }
          return updatedTask
        }
        return task
      }),
    )

    toast({
      title: "Status Updated",
      description: `Task marked as ${status.replace("_", " ")}.`,
    })
  }

  // Helper function to get color based on priority
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "low":
        return "bg-green-500 text-white"
      case "medium":
        return "bg-blue-500 text-white"
      case "high":
        return "bg-amber-500 text-white"
      case "urgent":
        return "bg-red-500 text-white"
      default:
        return "bg-gray-500 text-white"
    }
  }

  // Helper function to get color based on status
  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-amber-100 text-amber-800"
      case "in_progress":
        return "bg-blue-100 text-blue-800"
      case "completed":
        return "bg-green-100 text-green-800"
      case "cancelled":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  // Helper function to render category icon
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "cleaning":
        return <ClipboardCheck className="h-4 w-4" />
      case "repairs":
        return <Tool className="h-4 w-4" />
      case "it":
        return <Tool className="h-4 w-4" />
      case "furniture":
        return <Tool className="h-4 w-4" />
      case "electrical":
        return <Tool className="h-4 w-4" />
      case "plumbing":
        return <Tool className="h-4 w-4" />
      default:
        return <Tool className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Maintenance</h1>
        <p className="text-muted-foreground">Manage maintenance tasks and repairs for your library</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
            <ClipboardCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{taskStats.total}</div>
            <p className="text-xs text-muted-foreground">All maintenance tasks</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pending Tasks</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{taskStats.pending}</div>
            <p className="text-xs text-muted-foreground">Tasks awaiting action</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Tool className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{taskStats.inProgress}</div>
            <p className="text-xs text-muted-foreground">Tasks currently in progress</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Urgent Tasks</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{taskStats.urgent}</div>
            <p className="text-xs text-muted-foreground">{taskStats.overdue > 0 && `${taskStats.overdue} overdue`}</p>
          </CardContent>
        </Card>
      </div>

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

        <div className="flex flex-col gap-2 sm:flex-row sm:gap-4">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>

          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priorities</SelectItem>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="urgent">Urgent</SelectItem>
            </SelectContent>
          </Select>

          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="cleaning">Cleaning</SelectItem>
              <SelectItem value="repairs">Repairs</SelectItem>
              <SelectItem value="it">IT</SelectItem>
              <SelectItem value="furniture">Furniture</SelectItem>
              <SelectItem value="electrical">Electrical</SelectItem>
              <SelectItem value="plumbing">Plumbing</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>

          <Dialog open={isAddTaskDialogOpen} onOpenChange={setIsAddTaskDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Task
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px]">
              <DialogHeader>
                <DialogTitle>Add Maintenance Task</DialogTitle>
                <DialogDescription>Create a new maintenance task for your library.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Task Title *</Label>
                  <Input
                    id="title"
                    name="title"
                    value={newTask.title}
                    onChange={handleInputChange}
                    placeholder="Enter task title"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={newTask.description}
                    onChange={handleInputChange}
                    placeholder="Enter task description"
                    required
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="priority">Priority *</Label>
                    <Select
                      name="priority"
                      value={newTask.priority}
                      onValueChange={(value) => setNewTask((prev) => ({ ...prev, priority: value }))}
                    >
                      <SelectTrigger id="priority">
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="urgent">Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <Select
                      name="category"
                      value={newTask.category}
                      onValueChange={(value) => setNewTask((prev) => ({ ...prev, category: value }))}
                    >
                      <SelectTrigger id="category">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cleaning">Cleaning</SelectItem>
                        <SelectItem value="repairs">Repairs</SelectItem>
                        <SelectItem value="it">IT</SelectItem>
                        <SelectItem value="furniture">Furniture</SelectItem>
                        <SelectItem value="electrical">Electrical</SelectItem>
                        <SelectItem value="plumbing">Plumbing</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="assignedToId">Assign To</Label>
                    <Select
                      name="assignedToId"
                      value={newTask.assignedToId}
                      onValueChange={(value) => setNewTask((prev) => ({ ...prev, assignedToId: value }))}
                    >
                      <SelectTrigger id="assignedToId">
                        <SelectValue placeholder="Select staff member" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="unassigned">Unassigned</SelectItem>
                        {mockStaffMembers.map((staff) => (
                          <SelectItem key={staff.id} value={staff.id}>
                            {staff.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dueDate">Due Date *</Label>
                    <Input
                      id="dueDate"
                      name="dueDate"
                      type="date"
                      value={newTask.dueDate}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="recurring"
                      checked={newTask.recurring}
                      onCheckedChange={(checked) => handleCheckboxChange("recurring", checked as boolean)}
                    />
                    <Label htmlFor="recurring">Recurring Task</Label>
                  </div>

                  {newTask.recurring && (
                    <div className="space-y-2">
                      <Label htmlFor="recurringFrequency">Frequency</Label>
                      <Select
                        name="recurringFrequency"
                        value={newTask.recurringFrequency}
                        onValueChange={(value) => setNewTask((prev) => ({ ...prev, recurringFrequency: value }))}
                      >
                        <SelectTrigger id="recurringFrequency">
                          <SelectValue placeholder="Select frequency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="daily">Daily</SelectItem>
                          <SelectItem value="weekly">Weekly</SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
                          <SelectItem value="quarterly">Quarterly</SelectItem>
                          <SelectItem value="yearly">Yearly</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
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
      </div>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All Tasks</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="in_progress">In Progress</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-4">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filteredTasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-lg border py-8 text-center">
              <ClipboardCheck className="h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">No tasks found</h3>
              <p className="text-muted-foreground">Try adjusting your filters</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredTasks.map((task) => (
                <Card key={task.id} className={task.status === "completed" ? "opacity-70" : ""}>
                  <CardContent className="p-6">
                    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-semibold">{task.title}</h3>
                          <Badge variant="outline" className={getStatusColor(task.status)}>
                            {task.status.replace("_", " ")}
                          </Badge>
                          <Badge variant="outline" className={getPriorityColor(task.priority)}>
                            {task.priority}
                          </Badge>
                        </div>

                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>Created: {new Date(task.createdAt).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            {getCategoryIcon(task.category)}
                            <span className="capitalize">{task.category}</span>
                          </div>
                          {task.recurring && (
                            <Badge variant="outline" className="bg-purple-100 text-purple-800">
                              Recurring ({task.recurringFrequency})
                            </Badge>
                          )}
                        </div>

                        <p className="text-sm">{task.description}</p>

                        {task.notes && (
                          <div className="rounded-md bg-muted p-2 text-sm">
                            <span className="font-medium">Notes: </span>
                            {task.notes}
                          </div>
                        )}

                        {task.assignedTo && (
                          <div className="flex items-center gap-2 text-sm">
                            <span className="font-medium">Assigned to:</span>
                            <div className="flex items-center gap-2">
                              <Avatar className="h-6 w-6">
                                <AvatarImage
                                  src={task.assignedTo.avatar || "/placeholder.svg"}
                                  alt={task.assignedTo.name}
                                />
                                <AvatarFallback>{task.assignedTo.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <span>{task.assignedTo.name}</span>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-row gap-2 md:flex-col">
                        {task.status !== "completed" && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="bg-green-100 text-green-800 hover:bg-green-200 hover:text-green-900"
                            onClick={() => handleStatusChange(task.id, "completed")}
                          >
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Mark Complete
                          </Button>
                        )}

                        {task.status === "pending" && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="bg-blue-100 text-blue-800 hover:bg-blue-200 hover:text-blue-900"
                            onClick={() => handleStatusChange(task.id, "in_progress")}
                          >
                            <Clock className="mr-2 h-4 w-4" />
                            Start Task
                          </Button>
                        )}

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedTask(task)
                            setIsEditTaskDialogOpen(true)
                          }}
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </Button>

                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-500 hover:text-red-600"
                          onClick={() => handleDeleteTask(task.id)}
                        >
                          <Trash className="mr-2 h-4 w-4" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="pending" className="mt-4">
          <div className="space-y-4">
            {filteredTasks
              .filter((task) => task.status === "pending")
              .map((task) => (
                <Card key={task.id}>
                  <CardContent className="p-6">
                    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-semibold">{task.title}</h3>
                          <Badge variant="outline" className={getPriorityColor(task.priority)}>
                            {task.priority}
                          </Badge>
                        </div>

                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            {getCategoryIcon(task.category)}
                            <span className="capitalize">{task.category}</span>
                          </div>
                        </div>

                        <p className="text-sm">{task.description}</p>

                        {task.assignedTo && (
                          <div className="flex items-center gap-2 text-sm">
                            <span className="font-medium">Assigned to:</span>
                            <div className="flex items-center gap-2">
                              <Avatar className="h-6 w-6">
                                <AvatarImage
                                  src={task.assignedTo.avatar || "/placeholder.svg"}
                                  alt={task.assignedTo.name}
                                />
                                <AvatarFallback>{task.assignedTo.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <span>{task.assignedTo.name}</span>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-row gap-2 md:flex-col">
                        <Button
                          variant="outline"
                          size="sm"
                          className="bg-blue-100 text-blue-800 hover:bg-blue-200 hover:text-blue-900"
                          onClick={() => handleStatusChange(task.id, "in_progress")}
                        >
                          <Clock className="mr-2 h-4 w-4" />
                          Start Task
                        </Button>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedTask(task)
                            setIsEditTaskDialogOpen(true)
                          }}
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>

        <TabsContent value="in_progress" className="mt-4">
          <div className="space-y-4">
            {filteredTasks
              .filter((task) => task.status === "in_progress")
              .map((task) => (
                <Card key={task.id}>
                  <CardContent className="p-6">
                    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-semibold">{task.title}</h3>
                          <Badge variant="outline" className={getPriorityColor(task.priority)}>
                            {task.priority}
                          </Badge>
                        </div>

                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            {getCategoryIcon(task.category)}
                            <span className="capitalize">{task.category}</span>
                          </div>
                        </div>

                        <p className="text-sm">{task.description}</p>

                        {task.assignedTo && (
                          <div className="flex items-center gap-2 text-sm">
                            <span className="font-medium">Assigned to:</span>
                            <div className="flex items-center gap-2">
                              <Avatar className="h-6 w-6">
                                <AvatarImage
                                  src={task.assignedTo.avatar || "/placeholder.svg"}
                                  alt={task.assignedTo.name}
                                />
                                <AvatarFallback>{task.assignedTo.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <span>{task.assignedTo.name}</span>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-row gap-2 md:flex-col">
                        <Button
                          variant="outline"
                          size="sm"
                          className="bg-green-100 text-green-800 hover:bg-green-200 hover:text-green-900"
                          onClick={() => handleStatusChange(task.id, "completed")}
                        >
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Mark Complete
                        </Button>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedTask(task)
                            setIsEditTaskDialogOpen(true)
                          }}
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>

        <TabsContent value="completed" className="mt-4">
          <div className="space-y-4">
            {filteredTasks
              .filter((task) => task.status === "completed")
              .map((task) => (
                <Card key={task.id} className="opacity-70">
                  <CardContent className="p-6">
                    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-semibold">{task.title}</h3>
                          <Badge variant="outline" className="bg-green-100 text-green-800">
                            Completed
                          </Badge>
                        </div>

                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>
                              Completed:{" "}
                              {task.completedAt ? new Date(task.completedAt).toLocaleDateString() : "Unknown"}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            {getCategoryIcon(task.category)}
                            <span className="capitalize">{task.category}</span>
                          </div>
                        </div>

                        <p className="text-sm">{task.description}</p>

                        {task.notes && (
                          <div className="rounded-md bg-muted p-2 text-sm">
                            <span className="font-medium">Notes: </span>
                            {task.notes}
                          </div>
                        )}
                      </div>

                      <div className="flex flex-row gap-2 md:flex-col">
                        <Button variant="outline" size="sm" onClick={() => handleDeleteTask(task.id)}>
                          <Trash className="mr-2 h-4 w-4" />
                          Remove
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Edit Task Dialog */}
      <Dialog open={isEditTaskDialogOpen} onOpenChange={setIsEditTaskDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Edit Maintenance Task</DialogTitle>
            <DialogDescription>Update the maintenance task details.</DialogDescription>
          </DialogHeader>
          {selectedTask && (
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-title">Task Title *</Label>
                <Input
                  id="edit-title"
                  value={selectedTask.title}
                  onChange={(e) => setSelectedTask({ ...selectedTask, title: e.target.value })}
                  placeholder="Enter task title"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-description">Description *</Label>
                <Textarea
                  id="edit-description"
                  value={selectedTask.description}
                  onChange={(e) => setSelectedTask({ ...selectedTask, description: e.target.value })}
                  placeholder="Enter task description"
                  required
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-priority">Priority *</Label>
                  <Select
                    value={selectedTask.priority}
                    onValueChange={(value) =>
                      setSelectedTask({ ...selectedTask, priority: value as MaintenanceTask["priority"] })
                    }
                  >
                    <SelectTrigger id="edit-priority">
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-status">Status *</Label>
                  <Select
                    value={selectedTask.status}
                    onValueChange={(value) =>
                      setSelectedTask({
                        ...selectedTask,
                        status: value as MaintenanceTask["status"],
                        completedAt: value === "completed" ? new Date().toISOString() : undefined,
                      })
                    }
                  >
                    <SelectTrigger id="edit-status">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-notes">Notes</Label>
                <Textarea
                  id="edit-notes"
                  value={selectedTask.notes || ""}
                  onChange={(e) => setSelectedTask({ ...selectedTask, notes: e.target.value })}
                  placeholder="Add notes about the task"
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-dueDate">Due Date *</Label>
                <Input
                  id="edit-dueDate"
                  type="date"
                  value={selectedTask.dueDate}
                  onChange={(e) => setSelectedTask({ ...selectedTask, dueDate: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-assignedTo">Assign To</Label>
                <Select
                  value={selectedTask.assignedTo?.id || ""}
                  onValueChange={(value) => {
                    const staff = value ? mockStaffMembers.find((s) => s.id === value) : undefined
                    setSelectedTask({ ...selectedTask, assignedTo: staff })
                  }}
                >
                  <SelectTrigger id="edit-assignedTo">
                    <SelectValue placeholder="Select staff member" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Unassigned</SelectItem>
                    {mockStaffMembers.map((staff) => (
                      <SelectItem key={staff.id} value={staff.id}>
                        {staff.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditTaskDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditTask}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
