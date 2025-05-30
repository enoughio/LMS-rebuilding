"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Edit, Loader2, MoreHorizontal, Search, Trash, UserPlus, Users } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/lib/auth-provider"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { User, MembershipStatus } from "@/types/user"

// Mock members data
const mockMembers: User[] = [
  {
    id: "user-1",
    name: "John Member",
    email: "member@example.com",
    role: "member",
    avatar: "/placeholder.svg?height=40&width=40",
    createdAt: "2023-01-15T00:00:00Z",
    membership: {
      planId: "plan-1",
      planName: "Premium",
      status: "active",
      expiresAt: "2024-12-31T00:00:00Z",
    },
  },
  {
    id: "user-2",
    name: "Jane Member",
    email: "expired@example.com",
    role: "member",
    avatar: "/placeholder.svg?height=40&width=40",
    createdAt: "2023-02-20T00:00:00Z",
    membership: {
      planId: "plan-2",
      planName: "Basic",
      status: "expired",
      expiresAt: "2023-10-31T00:00:00Z",
    },
  },
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
]

// Mock membership plans
const mockMembershipPlans = [
  { id: "plan-1", name: "Premium" },
  { id: "plan-2", name: "Basic" },
  { id: "plan-3", name: "Student" },
]

export default function MembersPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [members, setMembers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [planFilter, setPlanFilter] = useState<string>("all")
  const [isAddMemberDialogOpen, setIsAddMemberDialogOpen] = useState(false)
  const [isEditMemberDialogOpen, setIsEditMemberDialogOpen] = useState(false)
  const [selectedMember, setSelectedMember] = useState<User | null>(null)

  const [newMember, setNewMember] = useState({
    name: "",
    email: "",
    planId: "",
    status: "active" as MembershipStatus,
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
  })

  useEffect(() => {
    // Simulate API call to fetch members
    const fetchMembers = async () => {
      setLoading(true)
      try {
        // In a real app, this would fetch data from an API
        // For now, we'll just use the mock data
        setMembers(mockMembers)
      } catch (error) {
        console.error("Error fetching members:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchMembers()
  }, [])

  // Apply filters
  const filteredMembers = members.filter((member) => {
    const matchesSearch =
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === "all" || member.membership?.status === statusFilter
    const matchesPlan = planFilter === "all" || member.membership?.planId === planFilter

    return matchesSearch && matchesStatus && matchesPlan
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setNewMember((prev) => ({ ...prev, [name]: value }))
  }

  const handleAddMember = () => {
    if (!newMember.name || !newMember.email || !newMember.planId) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    // In a real app, this would add the member to the database
    const planName = mockMembershipPlans.find((plan) => plan.id === newMember.planId)?.name || ""

    const newMemberWithId: User = {
      id: `user-${Date.now()}`,
      name: newMember.name,
      email: newMember.email,
      role: "member",
      avatar: "/placeholder.svg?height=40&width=40",
      createdAt: new Date().toISOString(),
      membership: {
        planId: newMember.planId,
        planName,
        status: newMember.status,
        expiresAt: newMember.expiresAt,
      },
    }

    setMembers([...members, newMemberWithId])
    setIsAddMemberDialogOpen(false)

    toast({
      title: "Member Added",
      description: `${newMember.name} has been added as a member.`,
    })

    // Reset form
    setNewMember({
      name: "",
      email: "",
      planId: "",
      status: "active",
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    })
  }

  const handleEditMember = () => {
    if (!selectedMember) return

    // In a real app, this would update the member in the database
    setMembers(members.map((member) => (member.id === selectedMember.id ? selectedMember : member)))

    setIsEditMemberDialogOpen(false)

    toast({
      title: "Member Updated",
      description: `${selectedMember.name}'s information has been updated.`,
    })

    setSelectedMember(null)
  }

  const handleDeleteMember = (memberId: string) => {
    // In a real app, this would delete the member from the database
    setMembers(members.filter((member) => member.id !== memberId))

    toast({
      title: "Member Deleted",
      description: "The member has been deleted successfully.",
    })
  }

  const handleRenewMembership = (memberId: string) => {
    // In a real app, this would call an API to renew the membership
    const memberToUpdate = members.find((member) => member.id === memberId)

    if (!memberToUpdate) return

    const updatedMember = {
      ...memberToUpdate,
      membership: {
        ...memberToUpdate.membership!,
        status: "active" as MembershipStatus,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      },
    }

    setMembers(members.map((member) => (member.id === memberId ? updatedMember : member)))

    toast({
      title: "Membership Renewed",
      description: `${memberToUpdate.name}'s membership has been renewed.`,
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Members</h1>
        <p className="text-muted-foreground">Manage library members and their memberships</p>
      </div>

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
              {mockMembershipPlans.map((plan) => (
                <SelectItem key={plan.id} value={plan.id}>
                  {plan.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Dialog open={isAddMemberDialogOpen} onOpenChange={setIsAddMemberDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <UserPlus className="mr-2 h-4 w-4" />
                Add Member
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Add New Member</DialogTitle>
                <DialogDescription>Add a new member to your library.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      name="name"
                      value={newMember.name}
                      onChange={handleInputChange}
                      placeholder="Full name"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={newMember.email}
                      onChange={handleInputChange}
                      placeholder="Email address"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="planId">Membership Plan *</Label>
                  <Select
                    value={newMember.planId}
                    onValueChange={(value) => setNewMember((prev) => ({ ...prev, planId: value }))}
                  >
                    <SelectTrigger id="planId">
                      <SelectValue placeholder="Select plan" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockMembershipPlans.map((plan) => (
                        <SelectItem key={plan.id} value={plan.id}>
                          {plan.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={newMember.status}
                      onValueChange={(value) =>
                        setNewMember((prev) => ({ ...prev, status: value as MembershipStatus }))
                      }
                    >
                      <SelectTrigger id="status">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="expired">Expired</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="expiresAt">Expiry Date</Label>
                    <Input
                      id="expiresAt"
                      name="expiresAt"
                      type="date"
                      value={newMember.expiresAt}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddMemberDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddMember}>Add Member</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All Members</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="expired">Expired</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-4">
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
                <div className="col-span-2">Actions</div>
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
                  <div className="col-span-2 flex items-center justify-end">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedMember(member)
                            setIsEditMemberDialogOpen(true)
                          }}
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Edit Member
                        </DropdownMenuItem>
                        {member.membership?.status === "expired" && (
                          <DropdownMenuItem onClick={() => handleRenewMembership(member.id)}>
                            <UserPlus className="mr-2 h-4 w-4" />
                            Renew Membership
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={() => handleDeleteMember(member.id)}
                        >
                          <Trash className="mr-2 h-4 w-4" />
                          Delete Member
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="active" className="mt-4">
          <div className="rounded-md border">
            <div className="grid grid-cols-12 gap-4 border-b bg-muted/50 p-4 font-medium">
              <div className="col-span-4">Member</div>
              <div className="col-span-2">Joined</div>
              <div className="col-span-2">Plan</div>
              <div className="col-span-2">Expires</div>
              <div className="col-span-2">Actions</div>
            </div>
            {filteredMembers
              .filter((member) => member.membership?.status === "active")
              .map((member) => (
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
                    <span className="text-sm font-medium">{member.membership?.planName}</span>
                  </div>
                  <div className="col-span-2 flex items-center">
                    <span className="text-sm">{new Date(member.membership!.expiresAt).toLocaleDateString()}</span>
                  </div>
                  <div className="col-span-2 flex items-center justify-end">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedMember(member)
                            setIsEditMemberDialogOpen(true)
                          }}
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Edit Member
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={() => handleDeleteMember(member.id)}
                        >
                          <Trash className="mr-2 h-4 w-4" />
                          Delete Member
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
          </div>
        </TabsContent>

        <TabsContent value="expired" className="mt-4">
          <div className="rounded-md border">
            <div className="grid grid-cols-12 gap-4 border-b bg-muted/50 p-4 font-medium">
              <div className="col-span-4">Member</div>
              <div className="col-span-2">Joined</div>
              <div className="col-span-2">Plan</div>
              <div className="col-span-2">Expired On</div>
              <div className="col-span-2">Actions</div>
            </div>
            {filteredMembers
              .filter((member) => member.membership?.status === "expired")
              .map((member) => (
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
                    <span className="text-sm font-medium">{member.membership?.planName}</span>
                  </div>
                  <div className="col-span-2 flex items-center">
                    <span className="text-sm">{new Date(member.membership!.expiresAt).toLocaleDateString()}</span>
                  </div>
                  <div className="col-span-2 flex items-center justify-end">
                    <Button
                      variant="outline"
                      size="sm"
                      className="mr-2"
                      onClick={() => handleRenewMembership(member.id)}
                    >
                      Renew
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedMember(member)
                            setIsEditMemberDialogOpen(true)
                          }}
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Edit Member
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleRenewMembership(member.id)}>
                          <UserPlus className="mr-2 h-4 w-4" />
                          Renew Membership
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={() => handleDeleteMember(member.id)}
                        >
                          <Trash className="mr-2 h-4 w-4" />
                          Delete Member
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Edit Member Dialog */}
      <Dialog open={isEditMemberDialogOpen} onOpenChange={setIsEditMemberDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Member</DialogTitle>
            <DialogDescription>Update member information and membership details.</DialogDescription>
          </DialogHeader>
          {selectedMember && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-name">Full Name</Label>
                  <Input
                    id="edit-name"
                    value={selectedMember.name}
                    onChange={(e) => setSelectedMember({ ...selectedMember, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-email">Email Address</Label>
                  <Input
                    id="edit-email"
                    type="email"
                    value={selectedMember.email}
                    onChange={(e) => setSelectedMember({ ...selectedMember, email: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-planId">Membership Plan</Label>
                <Select
                  value={selectedMember.membership?.planId}
                  onValueChange={(value) =>
                    setSelectedMember({
                      ...selectedMember,
                      membership: {
                        ...selectedMember.membership!,
                        planId: value,
                        planName: mockMembershipPlans.find((plan) => plan.id === value)?.name || "",
                      },
                    })
                  }
                >
                  <SelectTrigger id="edit-planId">
                    <SelectValue placeholder="Select plan" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockMembershipPlans.map((plan) => (
                      <SelectItem key={plan.id} value={plan.id}>
                        {plan.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-status">Status</Label>
                  <Select
                    value={selectedMember.membership?.status}
                    onValueChange={(value) =>
                      setSelectedMember({
                        ...selectedMember,
                        membership: {
                          ...selectedMember.membership!,
                          status: value as MembershipStatus,
                        },
                      })
                    }
                  >
                    <SelectTrigger id="edit-status">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="expired">Expired</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-expiresAt">Expiry Date</Label>
                  <Input
                    id="edit-expiresAt"
                    type="date"
                    value={new Date(selectedMember.membership?.expiresAt || "").toISOString().split("T")[0]}
                    onChange={(e) =>
                      setSelectedMember({
                        ...selectedMember,
                        membership: {
                          ...selectedMember.membership!,
                          expiresAt: new Date(e.target.value).toISOString(),
                        },
                      })
                    }
                  />
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditMemberDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditMember}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
