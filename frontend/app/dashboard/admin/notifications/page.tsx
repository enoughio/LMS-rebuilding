"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Bell, Check, Loader2, MailOpen, Plus, Search, Trash } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/lib/auth-provider"

// Mock notification data
type Notification = {
  id: string
  title: string
  message: string
  type: "system" | "alert" | "info"
  isRead: boolean
  createdAt: string
}

const mockNotifications: Notification[] = [
  {
    id: "notif-1",
    title: "Overdue Books Alert",
    message: "8 books are overdue today. Reminders have been sent to members.",
    type: "alert",
    isRead: false,
    createdAt: "2023-10-15T10:30:00Z",
  },
  {
    id: "notif-2",
    title: "New Member Registration",
    message: "5 new members registered today. Please review and approve their applications.",
    type: "info",
    isRead: false,
    createdAt: "2023-10-15T08:45:00Z",
  },
  {
    id: "notif-3",
    title: "System Upgrade",
    message: "Platform update scheduled for tonight at 2AM. No downtime expected.",
    type: "system",
    isRead: true,
    createdAt: "2023-10-14T16:20:00Z",
  },
  {
    id: "notif-4",
    title: "Maintenance Completed",
    message: "The scheduled maintenance has been completed successfully.",
    type: "system",
    isRead: true,
    createdAt: "2023-10-13T09:15:00Z",
  },
  {
    id: "notif-5",
    title: "Seat Booking Capacity Reached",
    message: "The library has reached 90% of its seating capacity for tomorrow.",
    type: "alert",
    isRead: true,
    createdAt: "2023-10-12T14:30:00Z",
  },
  {
    id: "notif-6",
    title: "New Books Added",
    message: "15 new books have been added to the inventory.",
    type: "info",
    isRead: true,
    createdAt: "2023-10-11T11:45:00Z",
  },
]

export default function NotificationsPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [newNotification, setNewNotification] = useState({
    title: "",
    message: "",
    type: "info",
  })

  useEffect(() => {
    // Simulate API call to fetch notifications
    const fetchData = async () => {
      setLoading(true)
      try {
        // In a real app, this would fetch data from an API
        setNotifications(mockNotifications)
      } catch (error) {
        console.error("Error fetching notifications:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Apply filters
  const filteredNotifications = notifications.filter((notification) => {
    const matchesSearch =
      notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesType = typeFilter === "all" || notification.type === typeFilter

    return matchesSearch && matchesType
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setNewNotification((prev) => ({ ...prev, [name]: value }))
  }

  const handleCreateNotification = () => {
    if (!newNotification.title || !newNotification.message) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    // In a real app, this would create a notification in the database
    const newNotif: Notification = {
      id: `notif-${Date.now()}`,
      title: newNotification.title,
      message: newNotification.message,
      type: newNotification.type as "system" | "alert" | "info",
      isRead: false,
      createdAt: new Date().toISOString(),
    }

    setNotifications([newNotif, ...notifications])
    setIsCreateDialogOpen(false)

    toast({
      title: "Notification Created",
      description: "Your notification has been created and sent.",
    })

    // Reset form
    setNewNotification({
      title: "",
      message: "",
      type: "info",
    })
  }

  const handleMarkAsRead = (id: string) => {
    setNotifications(
      notifications.map((notification) => (notification.id === id ? { ...notification, isRead: true } : notification)),
    )

    toast({
      title: "Marked as Read",
      description: "Notification has been marked as read.",
    })
  }

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map((notification) => ({ ...notification, isRead: true })))

    toast({
      title: "All Marked as Read",
      description: "All notifications have been marked as read.",
    })
  }

  const handleDeleteNotification = (id: string) => {
    setNotifications(notifications.filter((notification) => notification.id !== id))

    toast({
      title: "Notification Deleted",
      description: "The notification has been deleted.",
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
        <p className="text-muted-foreground">Manage system notifications and alerts</p>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative w-full md:w-1/3">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search notifications..."
            className="w-full pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:gap-4">
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="system">System</SelectItem>
              <SelectItem value="alert">Alert</SelectItem>
              <SelectItem value="info">Info</SelectItem>
            </SelectContent>
          </Select>

          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create Notification
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Create Notification</DialogTitle>
                <DialogDescription>Create a new notification to send to users.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    name="title"
                    value={newNotification.title}
                    onChange={handleInputChange}
                    placeholder="Notification title"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Message *</Label>
                  <Textarea
                    id="message"
                    name="message"
                    value={newNotification.message}
                    onChange={handleInputChange}
                    placeholder="Notification message"
                    rows={3}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Type</Label>
                  <Select
                    value={newNotification.type}
                    onValueChange={(value) => setNewNotification((prev) => ({ ...prev, type: value }))}
                  >
                    <SelectTrigger id="type">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="info">Info</SelectItem>
                      <SelectItem value="alert">Alert</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateNotification}>Create</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All Notifications</TabsTrigger>
          <TabsTrigger value="unread">Unread</TabsTrigger>
        </TabsList>

        <div className="mt-4 flex justify-end">
          <Button variant="outline" onClick={handleMarkAllAsRead}>
            <MailOpen className="mr-2 h-4 w-4" />
            Mark All as Read
          </Button>
        </div>

        <TabsContent value="all" className="mt-4">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-lg border py-8 text-center">
              <Bell className="h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">No notifications found</h3>
              <p className="text-muted-foreground">Try adjusting your filters</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredNotifications.map((notification) => (
                <Card key={notification.id} className={notification.isRead ? "bg-muted/30" : ""}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-base">{notification.title}</CardTitle>
                        {!notification.isRead && <Badge variant="default" className="h-2 w-2 rounded-full p-0" />}
                      </div>
                      <Badge
                        variant={
                          notification.type === "alert"
                            ? "destructive"
                            : notification.type === "system"
                              ? "secondary"
                              : "outline"
                        }
                      >
                        {notification.type}
                      </Badge>
                    </div>
                    <CardDescription>{new Date(notification.createdAt).toLocaleString()}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">{notification.message}</p>
                  </CardContent>
                  <CardFooter className="flex justify-end gap-2">
                    {!notification.isRead && (
                      <Button variant="outline" size="sm" onClick={() => handleMarkAsRead(notification.id)}>
                        <Check className="mr-2 h-4 w-4" />
                        Mark as Read
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive"
                      onClick={() => handleDeleteNotification(notification.id)}
                    >
                      <Trash className="mr-2 h-4 w-4" />
                      Delete
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="unread" className="mt-4">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filteredNotifications.filter((n) => !n.isRead).length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-lg border py-8 text-center">
              <Bell className="h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">No unread notifications</h3>
              <p className="text-muted-foreground">You're all caught up!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredNotifications
                .filter((notification) => !notification.isRead)
                .map((notification) => (
                  <Card key={notification.id}>
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <CardTitle className="text-base">{notification.title}</CardTitle>
                          <Badge variant="default" className="h-2 w-2 rounded-full p-0" />
                        </div>
                        <Badge
                          variant={
                            notification.type === "alert"
                              ? "destructive"
                              : notification.type === "system"
                                ? "secondary"
                                : "outline"
                          }
                        >
                          {notification.type}
                        </Badge>
                      </div>
                      <CardDescription>{new Date(notification.createdAt).toLocaleString()}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm">{notification.message}</p>
                    </CardContent>
                    <CardFooter className="flex justify-end gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleMarkAsRead(notification.id)}>
                        <Check className="mr-2 h-4 w-4" />
                        Mark as Read
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive"
                        onClick={() => handleDeleteNotification(notification.id)}
                      >
                        <Trash className="mr-2 h-4 w-4" />
                        Delete
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
