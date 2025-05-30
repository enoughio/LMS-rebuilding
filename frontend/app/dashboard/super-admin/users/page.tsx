"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Edit, Loader2, MoreHorizontal, Plus, Search, Shield, Trash, Users } from "lucide-react"

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
import type { User, UserRole } from "@/types/user"

// Mock users data
const mockUsers: User[] = [
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
    id: "user-3",
    name: "Alice Admin",
    email: "admin@example.com",
    role: "admin",
    avatar: "/placeholder.svg?height=40&width=40",
    createdAt: "2022-11-05T00:00:00Z",
    libraryId: "lib-1",
    libraryName: "Central Library",
  },
  {
    id: "user-4",
    name: "Bob SuperAdmin",
    email: "superadmin@example.com",
    role: "super-admin",
    avatar: "/placeholder.svg?height=40&width=40",
    createdAt: "2022-10-01T00:00:00Z",
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
  {
    id: "user-8",
    name: "James Johnson",
    email: "james@example.com",
    role: "admin",
    avatar: "/placeholder.svg?height=40&width=40",
    createdAt: "2023-05-05T00:00:00Z",
    libraryId: "lib-2",
    libraryName: "Riverside Reading Hub",
  },
  {
    id: "user-9",
    name: "Olivia Martinez",
    email: "olivia@example.com",
    role: "admin",
    avatar: "/placeholder.svg?height=40&width=40",
    createdAt: "2023-01-25T00:00:00Z",
    libraryId: "lib-3",
    libraryName: "Tech Knowledge Center",
  },
]

export default function UsersPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [roleFilter, setRoleFilter] = useState<string>("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "member" as UserRole,
    libraryId: "",
  })

  // Mock libraries for dropdown
  const mockLibraries = [
    { id: "lib-1", name: "Central Library" },
    { id: "lib-2", name: "Riverside Reading Hub" },
    { id: "lib-3", name: "Tech Knowledge Center" },
  ]

  useEffect(() => {
    // Simulate API call to fetch users
    const fetchUsers = async () => {
      setLoading(true)
      try {
        // In a real app, this would fetch data from an API
        setUsers(mockUsers)
      } catch (error) {
        console.error("Error fetching users:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [])

  // Apply filters
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesRole = roleFilter === "all" || user.role === roleFilter

    return matchesSearch && matchesRole
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setNewUser((prev) => ({ ...prev, [name]: value }))
  }

  const handleRoleChange = (value: string) => {
    setNewUser((prev) => ({ ...prev, role: value as UserRole }))
  }

  const handleLibraryChange = (value: string) => {
    setNewUser((prev) => ({ ...prev, libraryId: value }))
  }

  const handleAddUser = () => {
    if (!newUser.name || !newUser.email || !newUser.role) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    if (newUser.role === "admin" && !newUser.libraryId) {
      toast({
        title: "Missing Library",
        description: "Please select a library for the admin user",
        variant: "destructive",
      })
      return
    }

    // In a real app, this would add the user to the database
    const libraryName = newUser.libraryId ? mockLibraries.find((lib) => lib.id === newUser.libraryId)?.name || "" : ""

    const newUserWithId: User = {
      id: `user-${Date.now()}`,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      avatar: "/placeholder.svg?height=40&width=40",
      createdAt: new Date().toISOString(),
      ...(newUser.role === "admin" && {
        libraryId: newUser.libraryId,
        libraryName,
      }),
      ...(newUser.role === "member" && {
        membership: {
          planId: "plan-free",
          planName: "Free",
          status: "active",
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        },
      }),
    }

    setUsers([...users, newUserWithId])
    setIsAddDialogOpen(false)

    toast({
      title: "User Added",
      description: `${newUser.name} has been added as a ${newUser.role}.`,
    })

    // Reset form
    setNewUser({
      name: "",
      email: "",
      role: "member",
      libraryId: "",
    })
  }

  const handleDeleteUser = (userId: string) => {
    // In a real app, this would delete the user from the database
    setUsers(users.filter((user) => user.id !== userId))

    toast({
      title: "User Deleted",
      description: "The user has been deleted successfully.",
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Users</h1>
        <p className="text-muted-foreground">Manage all users on the platform</p>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative w-full md:w-1/3">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search users..."
            className="w-full pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:gap-4">
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="member">Members</SelectItem>
              <SelectItem value="admin">Admins</SelectItem>
              <SelectItem value="super-admin">Super Admins</SelectItem>
            </SelectContent>
          </Select>

          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add User
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Add New User</DialogTitle>
                <DialogDescription>Add a new user to the platform.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    name="name"
                    value={newUser.name}
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
                    value={newUser.email}
                    onChange={handleInputChange}
                    placeholder="Email address"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Role *</Label>
                  <Select value={newUser.role} onValueChange={handleRoleChange}>
                    <SelectTrigger id="role">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="member">Member</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="super-admin">Super Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {newUser.role === "admin" && (
                  <div className="space-y-2">
                    <Label htmlFor="libraryId">Library *</Label>
                    <Select value={newUser.libraryId} onValueChange={handleLibraryChange}>
                      <SelectTrigger id="libraryId">
                        <SelectValue placeholder="Select library" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockLibraries.map((library) => (
                          <SelectItem key={library.id} value={library.id}>
                            {library.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddUser}>Add User</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All Users</TabsTrigger>
          <TabsTrigger value="members">Members</TabsTrigger>
          <TabsTrigger value="admins">Admins</TabsTrigger>
          <TabsTrigger value="super-admins">Super Admins</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-4">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-lg border py-8 text-center">
              <Users className="h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">No users found</h3>
              <p className="text-muted-foreground">Try adjusting your filters</p>
            </div>
          ) : (
            <div className="rounded-md border">
              <div className="grid grid-cols-12 gap-4 border-b bg-muted/50 p-4 font-medium">
                <div className="col-span-4">User</div>
                <div className="col-span-2">Role</div>
                <div className="col-span-2">Status</div>
                <div className="col-span-2">Joined</div>
                <div className="col-span-2">Actions</div>
              </div>
              {filteredUsers.map((user) => (
                <div key={user.id} className="grid grid-cols-12 gap-4 border-b p-4 last:border-0">
                  <div className="col-span-4 flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                  <div className="col-span-2 flex items-center">
                    <Badge
                      variant={
                        user.role === "super-admin" ? "destructive" : user.role === "admin" ? "default" : "outline"
                      }
                    >
                      {user.role === "super-admin" ? "Super Admin" : user.role === "admin" ? "Admin" : "Member"}
                    </Badge>
                  </div>
                  <div className="col-span-2 flex items-center">
                    {user.role === "member" ? (
                      <Badge
                        variant={
                          user.membership?.status === "active"
                            ? "default"
                            : user.membership?.status === "expired"
                              ? "destructive"
                              : "outline"
                        }
                      >
                        {user.membership?.status || "None"}
                      </Badge>
                    ) : user.role === "admin" ? (
                      <span className="text-sm">{user.libraryName}</span>
                    ) : (
                      <span className="text-sm">Active</span>
                    )}
                  </div>
                  <div className="col-span-2 flex items-center">
                    <span className="text-sm">{new Date(user.createdAt).toLocaleDateString()}</span>
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
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit User
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Shield className="mr-2 h-4 w-4" />
                          Change Role
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={() => handleDeleteUser(user.id)}
                        >
                          <Trash className="mr-2 h-4 w-4" />
                          Delete User
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="members" className="mt-4">
          <div className="rounded-md border">
            <div className="grid grid-cols-12 gap-4 border-b bg-muted/50 p-4 font-medium">
              <div className="col-span-4">User</div>
              <div className="col-span-2">Plan</div>
              <div className="col-span-2">Status</div>
              <div className="col-span-2">Expires</div>
              <div className="col-span-2">Actions</div>
            </div>
            {filteredUsers
              .filter((user) => user.role === "member")
              .map((user) => (
                <div key={user.id} className="grid grid-cols-12 gap-4 border-b p-4 last:border-0">
                  <div className="col-span-4 flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                  <div className="col-span-2 flex items-center">
                    <span className="text-sm">{user.membership?.planName || "None"}</span>
                  </div>
                  <div className="col-span-2 flex items-center">
                    <Badge
                      variant={
                        user.membership?.status === "active"
                          ? "default"
                          : user.membership?.status === "expired"
                            ? "destructive"
                            : "outline"
                      }
                    >
                      {user.membership?.status || "None"}
                    </Badge>
                  </div>
                  <div className="col-span-2 flex items-center">
                    <span className="text-sm">
                      {user.membership?.expiresAt ? new Date(user.membership.expiresAt).toLocaleDateString() : "N/A"}
                    </span>
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
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit User
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Shield className="mr-2 h-4 w-4" />
                          Change Role
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={() => handleDeleteUser(user.id)}
                        >
                          <Trash className="mr-2 h-4 w-4" />
                          Delete User
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
          </div>
        </TabsContent>

        <TabsContent value="admins" className="mt-4">
          <div className="rounded-md border">
            <div className="grid grid-cols-12 gap-4 border-b bg-muted/50 p-4 font-medium">
              <div className="col-span-4">User</div>
              <div className="col-span-4">Library</div>
              <div className="col-span-2">Joined</div>
              <div className="col-span-2">Actions</div>
            </div>
            {filteredUsers
              .filter((user) => user.role === "admin")
              .map((user) => (
                <div key={user.id} className="grid grid-cols-12 gap-4 border-b p-4 last:border-0">
                  <div className="col-span-4 flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                  <div className="col-span-4 flex items-center">
                    <span className="text-sm">{user.libraryName}</span>
                  </div>
                  <div className="col-span-2 flex items-center">
                    <span className="text-sm">{new Date(user.createdAt).toLocaleDateString()}</span>
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
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit User
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Shield className="mr-2 h-4 w-4" />
                          Change Role
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={() => handleDeleteUser(user.id)}
                        >
                          <Trash className="mr-2 h-4 w-4" />
                          Delete User
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
          </div>
        </TabsContent>

        <TabsContent value="super-admins" className="mt-4">
          <div className="rounded-md border">
            <div className="grid grid-cols-12 gap-4 border-b bg-muted/50 p-4 font-medium">
              <div className="col-span-5">User</div>
              <div className="col-span-3">Joined</div>
              <div className="col-span-4">Actions</div>
            </div>
            {filteredUsers
              .filter((user) => user.role === "super-admin")
              .map((user) => (
                <div key={user.id} className="grid grid-cols-12 gap-4 border-b p-4 last:border-0">
                  <div className="col-span-5 flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                  <div className="col-span-3 flex items-center">
                    <span className="text-sm">{new Date(user.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="col-span-4 flex items-center justify-end">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit User
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Shield className="mr-2 h-4 w-4" />
                          Change Role
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={() => handleDeleteUser(user.id)}
                        >
                          <Trash className="mr-2 h-4 w-4" />
                          Delete User
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
