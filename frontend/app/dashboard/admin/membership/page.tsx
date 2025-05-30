"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Check, Edit, Loader2, Plus, Search, Trash, Users } from "lucide-react"

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
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/lib/auth-provider"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { User, MembershipPlan } from "@/types/user"

// Mock data for members
const mockMembers: User[] = [
  {
    id: "user-5",
    name: "Emma Wilson",
    email: "emma@example.com",
    role: "member",
    avatar: "/placeholder.svg?height=40&width=40",
    createdAt: "2023-03-15T00:00:00Z",
    membership: {
      planId: "plan-1",
      planName: "Premium",
      status: "active",
      expiresAt: "2024-12-31T00:00:00Z",
    },
  },
  {
    id: "user-6",
    name: "Michael Brown",
    email: "michael@example.com",
    role: "member",
    avatar: "/placeholder.svg?height=40&width=40",
    createdAt: "2023-04-20T00:00:00Z",
    membership: {
      planId: "plan-2",
      planName: "Basic",
      status: "active",
      expiresAt: "2024-10-31T00:00:00Z",
    },
  },
  {
    id: "user-7",
    name: "Sophia Garcia",
    email: "sophia@example.com",
    role: "member",
    avatar: "/placeholder.svg?height=40&width=40",
    createdAt: "2023-02-10T00:00:00Z",
    membership: {
      planId: "plan-1",
      planName: "Premium",
      status: "expired",
      expiresAt: "2023-08-31T00:00:00Z",
    },
  },
  {
    id: "user-8",
    name: "James Johnson",
    email: "james@example.com",
    role: "member",
    avatar: "/placeholder.svg?height=40&width=40",
    createdAt: "2023-05-05T00:00:00Z",
    membership: {
      planId: "plan-2",
      planName: "Basic",
      status: "active",
      expiresAt: "2024-11-30T00:00:00Z",
    },
  },
  {
    id: "user-9",
    name: "Olivia Martinez",
    email: "olivia@example.com",
    role: "member",
    avatar: "/placeholder.svg?height=40&width=40",
    createdAt: "2023-01-25T00:00:00Z",
    membership: {
      planId: "plan-1",
      planName: "Premium",
      status: "active",
      expiresAt: "2024-09-30T00:00:00Z",
    },
  },
]

// Mock membership plans
const mockMembershipPlans: MembershipPlan[] = [
  {
    id: "plan-1",
    name: "Premium",
    price: 1999,
    duration: 30,
    features: ["Access to library", "10 seat bookings per month", "Full e-library access", "Access to meeting rooms"],
    allowedBookingsPerMonth: 10,
    eLibraryAccess: true,
  },
  {
    id: "plan-2",
    name: "Basic",
    price: 999,
    duration: 30,
    features: ["Access to library", "2 seat bookings per month", "Basic e-library access"],
    allowedBookingsPerMonth: 2,
    eLibraryAccess: true,
  },
  {
    id: "plan-3",
    name: "Student",
    price: 499,
    duration: 30,
    features: ["Access to library", "5 seat bookings per month", "Basic e-library access"],
    allowedBookingsPerMonth: 5,
    eLibraryAccess: true,
  },
]

export default function MembershipPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [members, setMembers] = useState<User[]>([])
  const [plans, setPlans] = useState<MembershipPlan[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [planFilter, setPlanFilter] = useState<string>("all")
  const [isAddPlanDialogOpen, setIsAddPlanDialogOpen] = useState(false)
  const [newPlan, setNewPlan] = useState<Partial<MembershipPlan>>({
    name: "",
    price: 0,
    duration: 30,
    features: [],
    allowedBookingsPerMonth: 0,
    eLibraryAccess: true,
  })
  const [newFeature, setNewFeature] = useState("")

  useEffect(() => {
    // Simulate API call to fetch members and plans
    const fetchData = async () => {
      setLoading(true)
      try {
        // In a real app, this would fetch data from an API
        setMembers(mockMembers)
        setPlans(mockMembershipPlans)
      } catch (error) {
        console.error("Error fetching membership data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Apply filters to members
  const filteredMembers = members.filter((member) => {
    const matchesSearch =
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || member.membership?.status === statusFilter
    const matchesPlan = planFilter === "all" || member.membership?.planId === planFilter

    return matchesSearch && matchesStatus && matchesPlan
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setNewPlan((prev) => ({
      ...prev,
      [name]: name === "price" || name === "allowedBookingsPerMonth" ? Number(value) : value,
    }))
  }

  const handleAddFeature = () => {
    if (newFeature.trim()) {
      setNewPlan((prev) => ({
        ...prev,
        features: [...(prev.features || []), newFeature.trim()],
      }))
      setNewFeature("")
    }
  }

  const handleRemoveFeature = (index: number) => {
    setNewPlan((prev) => ({
      ...prev,
      features: prev.features?.filter((_, i) => i !== index),
    }))
  }

  const handleAddPlan = () => {
    if (!newPlan.name || !newPlan.price) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    // In a real app, this would add the plan to the database
    const newPlanWithId: MembershipPlan = {
      id: `plan-${Date.now()}`,
      ...(newPlan as MembershipPlan),
    }

    setPlans([...plans, newPlanWithId])
    setIsAddPlanDialogOpen(false)

    toast({
      title: "Plan Added",
      description: `"${newPlan.name}" plan has been added successfully.`,
    })

    // Reset form
    setNewPlan({
      name: "",
      price: 0,
      duration: 30,
      features: [],
      allowedBookingsPerMonth: 0,
      eLibraryAccess: true,
    })
  }

  const handleDeletePlan = (planId: string) => {
    // Check if plan is in use
    const isInUse = members.some((member) => member.membership?.planId === planId)

    if (isInUse) {
      toast({
        title: "Cannot Delete Plan",
        description: "This plan is currently in use by members.",
        variant: "destructive",
      })
      return
    }

    // In a real app, this would delete the plan from the database
    setPlans(plans.filter((plan) => plan.id !== planId))

    toast({
      title: "Plan Deleted",
      description: "The membership plan has been deleted.",
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Membership Management</h1>
        <p className="text-muted-foreground">Manage members and membership plans</p>
      </div>

      <Tabs defaultValue="members">
        <TabsList>
          <TabsTrigger value="members">Members</TabsTrigger>
          <TabsTrigger value="plans">Membership Plans</TabsTrigger>
        </TabsList>

        <TabsContent value="members" className="mt-4 space-y-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="relative w-full md:w-1/3">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search members..."
                className="w-full pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-2 sm:flex-row sm:gap-4">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="expired">Expired</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>

              <Select value={planFilter} onValueChange={setPlanFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by plan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Plans</SelectItem>
                  {plans.map((plan) => (
                    <SelectItem key={plan.id} value={plan.id}>
                      {plan.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filteredMembers.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-lg border py-8 text-center">
              <Users className="h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">No members found</h3>
              <p className="text-muted-foreground">Try adjusting your filters</p>
            </div>
          ) : (
            <div className="rounded-md border">
              <div className="grid grid-cols-12 gap-4 border-b bg-muted/50 p-4 font-medium">
                <div className="col-span-4">Member</div>
                <div className="col-span-2">Joined</div>
                <div className="col-span-2">Plan</div>
                <div className="col-span-2">Status</div>
                <div className="col-span-2">Expires</div>
              </div>
              {filteredMembers.map((member) => (
                <div key={member.id} className="grid grid-cols-12 gap-4 border-b p-4 last:border-0">
                  <div className="col-span-4 flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                      <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{member.name}</p>
                      <p className="text-sm text-muted-foreground">{member.email}</p>
                    </div>
                  </div>
                  <div className="col-span-2 flex items-center">
                    <span className="text-sm">{new Date(member.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="col-span-2 flex items-center">
                    <span className="text-sm font-medium">{member.membership?.planName || "None"}</span>
                  </div>
                  <div className="col-span-2 flex items-center">
                    <Badge
                      variant={
                        member.membership?.status === "active"
                          ? "default"
                          : member.membership?.status === "expired"
                            ? "destructive"
                            : "outline"
                      }
                    >
                      {member.membership?.status || "None"}
                    </Badge>
                  </div>
                  <div className="col-span-2 flex items-center justify-between">
                    <span className="text-sm">
                      {member.membership?.expiresAt
                        ? new Date(member.membership.expiresAt).toLocaleDateString()
                        : "N/A"}
                    </span>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="plans" className="mt-4 space-y-4">
          <div className="flex justify-end">
            <Dialog open={isAddPlanDialogOpen} onOpenChange={setIsAddPlanDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Plan
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Add New Membership Plan</DialogTitle>
                  <DialogDescription>Create a new membership plan for your library.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Plan Name *</Label>
                      <Input
                        id="name"
                        name="name"
                        value={newPlan.name}
                        onChange={handleInputChange}
                        placeholder="e.g. Premium"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="price">Price (₹) *</Label>
                      <Input
                        id="price"
                        name="price"
                        type="number"
                        value={newPlan.price}
                        onChange={handleInputChange}
                        placeholder="e.g. 999"
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="duration">Duration (days)</Label>
                      <Input
                        id="duration"
                        name="duration"
                        type="number"
                        value={newPlan.duration}
                        onChange={handleInputChange}
                        placeholder="e.g. 30"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="allowedBookingsPerMonth">Allowed Bookings per Month</Label>
                      <Input
                        id="allowedBookingsPerMonth"
                        name="allowedBookingsPerMonth"
                        type="number"
                        value={newPlan.allowedBookingsPerMonth}
                        onChange={handleInputChange}
                        placeholder="e.g. 10"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="eLibraryAccess"
                        checked={newPlan.eLibraryAccess}
                        onChange={(e) => setNewPlan((prev) => ({ ...prev, eLibraryAccess: e.target.checked }))}
                        className="h-4 w-4 rounded border-gray-300"
                      />
                      <Label htmlFor="eLibraryAccess">E-Library Access</Label>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Features</Label>
                    <div className="flex gap-2">
                      <Input
                        value={newFeature}
                        onChange={(e) => setNewFeature(e.target.value)}
                        placeholder="Add a feature"
                      />
                      <Button type="button" onClick={handleAddFeature}>
                        Add
                      </Button>
                    </div>
                    <div className="mt-2 space-y-2">
                      {newPlan.features?.map((feature, index) => (
                        <div key={index} className="flex items-center justify-between rounded-md border p-2">
                          <span className="text-sm">{feature}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 text-destructive"
                            onClick={() => handleRemoveFeature(index)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddPlanDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddPlan}>Add Plan</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {plans.map((plan) => (
              <Card key={plan.id} className="flex flex-col">
                <CardHeader>
                  <CardTitle>{plan.name}</CardTitle>
                  <CardDescription>₹{plan.price} per month</CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <ul className="space-y-2">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Check className="mt-0.5 h-4 w-4 text-green-500" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter className="flex justify-between border-t pt-4">
                  <Button variant="outline">Edit</Button>
                  <Button variant="destructive" onClick={() => handleDeletePlan(plan.id)}>
                    Delete
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
