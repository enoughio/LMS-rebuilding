"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Edit, Loader2, MoreHorizontal, Plus, Search, Shield, Trash, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
// import { useAuth } from "@/lib/context/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { UserTableSkeleton } from "@/components/ui/user-table-skeleton";

// Define User and UserRole types for TypeScript
export type UserRole = "MEMBER" | "ADMIN" | "SUPER_ADMIN";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  createdAt: string;
  membership?: {
    planId: string;
    planName: string;
    status: string;
    expiresAt: string;
  };
  libraryId?: string;
  libraryName?: string;
}

// Mock users data
const mockUsers: User[] = [
  {
    id: "user-1",
    name: "John Member",
    email: "member@example.com",
    role: "MEMBER",
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
    role: "MEMBER",
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
    role: "ADMIN",
    avatar: "/placeholder.svg?height=40&width=40",
    createdAt: "2022-11-05T00:00:00Z",
    libraryId: "lib-1",
    libraryName: "Central Library",
  },
  {
    id: "user-4",
    name: "Bob SuperAdmin",
    email: "superadmin@example.com",
    role: "SUPER_ADMIN",
    avatar: "/placeholder.svg?height=40&width=40",
    createdAt: "2022-10-01T00:00:00Z",
  },
  {
    id: "user-5",
    name: "Emma Wilson",
    email: "emma@example.com",
    role: "MEMBER",
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
    role: "MEMBER",
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
    role: "MEMBER",
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
    role: "ADMIN",
    avatar: "/placeholder.svg?height=40&width=40",
    createdAt: "2023-05-05T00:00:00Z",
    libraryId: "lib-2",
    libraryName: "Riverside Reading Hub",
  },
  {
    id: "user-9",
    name: "Olivia Martinez",
    email: "olivia@example.com",
    role: "ADMIN",
    avatar: "/placeholder.svg?height=40&width=40",
    createdAt: "2023-01-25T00:00:00Z",
    libraryId: "lib-3",
    libraryName: "Tech Knowledge Center",
  },
];

export default function UsersPage() {
  // const { user, isLoading } = useAuth();
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "MEMBER" as UserRole,
    libraryId: "",
  });

  // Mock libraries for dropdown - in a real app this would come from an API
  const mockLibraries = [
    { id: "lib-1", name: "Central Library" },
    { id: "lib-2", name: "Riverside Reading Hub" },
    { id: "lib-3", name: "Tech Knowledge Center" },
  ];  
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500); 

    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    // Fetch users from API with filters
    const fetchUsers = async () => {
      setLoading(true);
      try {
        // Build query parameters
        const params = new URLSearchParams();
        if (roleFilter !== 'all') {
          params.append('role', roleFilter);
        }
        if (debouncedSearchQuery) {
          params.append('search', debouncedSearchQuery);
        }
        params.append('page', '1');
        params.append('limit', '50');

        // Make API call to backend
        const response = await fetch(`/api/users/all?${params.toString()}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          const errorText = await response.text();
          let errorMessage = "Failed to fetch users";
          try {
            const errorData = JSON.parse(errorText);
            errorMessage = errorData.error || errorData.message || errorMessage;
          } catch (e) {
            // If parsing fails, use the default error message
          }
          throw new Error(errorMessage);
        }

        const data = await response.json();
        
        if (data.success) {
          setUsers(data.data || []);
        } else {
          throw new Error(data.error || 'Failed to fetch users');
        }
      } catch (error) {
        console.error("Error fetching users:", error);
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : "Failed to fetch users",
          variant: "destructive",
        });
        
        // Only use mockUsers for development or demo purposes
        if (process.env.NODE_ENV === 'development') {
          setUsers(mockUsers);
          toast({
            title: "Using mock data",
            description: "Using sample data for development purposes",
            variant: "default",
          });
        } else {
          setUsers([]);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [roleFilter, debouncedSearchQuery, toast]);

  // The rest of the filteredUsers logic and handlers
  const filteredUsers = users;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleRoleChange = (value: string) => {
    setNewUser((prev) => ({ ...prev, role: value as UserRole }));
  };

  const handleLibraryChange = (value: string) => {
    setNewUser((prev) => ({ ...prev, libraryId: value }));
  };

  const handleAddUser = async () => {
    if (!newUser.name || !newUser.email || !newUser.role) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    if (newUser.role === "ADMIN" && !newUser.libraryId) {
      toast({
        title: "Missing Library",
        description: "Please select a library for the admin user",
        variant: "destructive",
      });
      return;
    }

    try {
      // In a real app, send data to the API
      const response = await fetch('/api/users/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          libraryId: newUser.role === "ADMIN" ? newUser.libraryId : undefined,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to add user');
      }

      const result = await response.json();
      
      if (result.success) {
        // Add new user to the list
        setUsers([...users, result.data]);
        setIsAddDialogOpen(false);

        toast({
          title: "User Added",
          description: `${newUser.name} has been added as a ${newUser.role}.`,
        });

        // Reset form
        setNewUser({
          name: "",
          email: "",
          role: "MEMBER",
          libraryId: "",
        });
      } else {
        throw new Error(result.error || 'Failed to add user');
      }
    } catch (error) {
      console.error("Error adding user:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add user",
        variant: "destructive",
      });
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      const response = await fetch(`/api/users/delete?id=${userId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to delete user');
      }

      const result = await response.json();
      
      if (result.success) {
        // Remove user from the list
        setUsers(users.filter((user) => user.id !== userId));

        toast({
          title: "User Deleted",
          description: "The user has been deleted successfully.",
        });
      } else {
        throw new Error(result.error || 'Failed to delete user');
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete user",
        variant: "destructive",
      });
    }
  };

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
              <SelectItem value="MEMBER">Members</SelectItem>
              <SelectItem value="ADMIN">Admins</SelectItem>
              <SelectItem value="SUPER_ADMIN">Super Admins</SelectItem>
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
                      <SelectItem value="MEMBER">Member</SelectItem>
                      <SelectItem value="ADMIN">Admin</SelectItem>
                      <SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {newUser.role === "ADMIN" && (
                  <div className="space-y-2">
                    <Label htmlFor="library">Library *</Label>
                    <Select value={newUser.libraryId} onValueChange={handleLibraryChange}>
                      <SelectTrigger id="library">
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
          <TabsTrigger value="super_admins">Super Admins</TabsTrigger>
        </TabsList>        <TabsContent value="all" className="mt-4">
          {loading ? (
            <div className="rounded-md border">
              <div className="grid grid-cols-12 gap-4 border-b bg-muted/50 p-4 font-medium">
                <div className="col-span-4">User</div>
                <div className="col-span-2">Role</div>
                <div className="col-span-2">Status</div>
                <div className="col-span-2">Joined</div>
                <div className="col-span-2">Actions</div>
              </div>
              <UserTableSkeleton />
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
                        user.role === "SUPER_ADMIN" ? "destructive" : user.role === "ADMIN" ? "default" : "outline"
                      }
                    >
                      {user.role === "SUPER_ADMIN" ? "Super Admin" : user.role === "ADMIN" ? "Admin" : "Member"}
                    </Badge>
                  </div>
                  <div className="col-span-2 flex items-center">
                    {user.role === "MEMBER" ? (
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
                    ) : user.role === "ADMIN" ? (
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
              .filter((user) => user.role === "MEMBER")
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
              .filter((user) => user.role === "ADMIN")
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

        <TabsContent value="super_admins" className="mt-4">
          <div className="rounded-md border">
            <div className="grid grid-cols-12 gap-4 border-b bg-muted/50 p-4 font-medium">
              <div className="col-span-5">User</div>
              <div className="col-span-3">Joined</div>
              <div className="col-span-4">Actions</div>
            </div>
            {filteredUsers
              .filter((user) => user.role === "SUPER_ADMIN")
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
  );
}