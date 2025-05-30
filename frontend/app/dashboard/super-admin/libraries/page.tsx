"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  Building2,
  Check,
  Edit,
  Eye,
  Loader2,
  MoreHorizontal,
  Plus,
  Search,
  Trash,
  X,
  FileText,
  Inbox,
  CalendarDays,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/lib/auth-provider"
import { mockLibraryService } from "@/lib/mock-api/library-service"
import type { Library } from "@/types/library"
import { AddLibraryForm } from "@/components/super-admin/add-library-form"

// Mock data for pending libraries
const mockPendingLibraries = [
  {
    id: "pending-1",
    name: "Westside Community Library",
    address: "456 West Ave, New York, NY 10001",
    ownerName: "David Wilson",
    ownerEmail: "david@example.com",
    phone: "+91 98765 43210",
    submittedAt: "2023-10-10T14:30:00Z",
    status: "pending",
    description:
      "A community library with a focus on local literature and community events. The space includes a small café and regular reading groups for all ages.",
  },
  {
    id: "pending-2",
    name: "Eastside Reading Center",
    address: "789 East St, New York, NY 10001",
    ownerName: "Sarah Johnson",
    ownerEmail: "sarah@example.com",
    phone: "+91 98765 43211",
    submittedAt: "2023-10-12T09:15:00Z",
    status: "pending",
    description:
      "A modern reading center with quiet study spaces and a digital media lab. Targeting students and professionals who need a peaceful workspace.",
  },
  {
    id: "pending-3",
    name: "North Hills Book Club",
    address: "123 North Rd, New York, NY 10001",
    ownerName: "Michael Brown",
    ownerEmail: "michael@example.com",
    phone: "+91 98765 43212",
    submittedAt: "2023-10-14T16:45:00Z",
    status: "pending",
    description:
      "A cozy reading space specializing in book clubs and literary discussions. Features a collection of rare books and first editions available for reference.",
  },
]

// Mock library requests
const mockLibraryRequests = [
  {
    id: "request-1",
    name: "Innovation Hub Library",
    address: "101 Tech Street, Bangalore, India",
    requestedBy: "John Doe",
    email: "john.doe@example.com",
    phone: "+91 98765 43213",
    description: "A library focused on technology and innovation with coding workshops and tech talks.",
    requestedAt: "2023-10-16T10:30:00Z",
  },
  {
    id: "request-2",
    name: "Heritage Reading Room",
    address: "45 Cultural Avenue, Mumbai, India",
    requestedBy: "Priya Sharma",
    email: "priya.sharma@example.com",
    phone: "+91 98765 43214",
    description:
      "A traditional library preserving historical texts and cultural artifacts, with special focus on Indian literature.",
    requestedAt: "2023-10-15T14:15:00Z",
  },
]

export default function LibrariesPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const router = useRouter()
  const [libraries, setLibraries] = useState<Library[]>([])
  const [pendingLibraries, setPendingLibraries] = useState(mockPendingLibraries)
  const [libraryRequests, setLibraryRequests] = useState(mockLibraryRequests)
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [ratingFilter, setRatingFilter] = useState<string>("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState<any | null>(null)
  const [isRequestDetailOpen, setIsRequestDetailOpen] = useState(false)

  useEffect(() => {
    const fetchLibraries = async () => {
      setLoading(true)
      try {
        const librariesData = await mockLibraryService.getLibraries()
        setLibraries(librariesData)
      } catch (error) {
        console.error("Error fetching libraries:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchLibraries()
  }, [])

  // Apply filters
  const filteredLibraries = libraries.filter((library) => {
    const matchesSearch =
      library.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      library.address.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesRating =
      ratingFilter === "all" ||
      (ratingFilter === "5" && library.rating >= 4.5) ||
      (ratingFilter === "4" && library.rating >= 4.0 && library.rating < 4.5) ||
      (ratingFilter === "3" && library.rating >= 3.0 && library.rating < 4.0) ||
      (ratingFilter === "below3" && library.rating < 3.0)

    return matchesSearch && matchesRating
  })

  const handleAddLibrary = (libraryData: any) => {
    // In a real app, this would add the library to the database
    toast({
      title: "Library Added",
      description: `"${libraryData.name}" has been added successfully.`,
    })

    // Close dialog
    setIsAddDialogOpen(false)
  }

  const handleApproveLibrary = (id: string) => {
    // In a real app, this would approve the library in the database
    setPendingLibraries(pendingLibraries.filter((library) => library.id !== id))

    toast({
      title: "Library Approved",
      description: "The library has been approved and is now active.",
    })
  }

  const handleRejectLibrary = (id: string) => {
    // In a real app, this would reject the library in the database
    setPendingLibraries(pendingLibraries.filter((library) => library.id !== id))

    toast({
      title: "Library Rejected",
      description: "The library application has been rejected.",
    })
  }

  const handleDeleteLibrary = (id: string) => {
    // In a real app, this would delete the library from the database
    setLibraries(libraries.filter((library) => library.id !== id))

    toast({
      title: "Library Deleted",
      description: "The library has been deleted successfully.",
    })
  }

  const handleConvertRequestToLibrary = (request: any) => {
    // In a real app, this would convert the request to a pending library
    setLibraryRequests(libraryRequests.filter((r) => r.id !== request.id))

    setPendingLibraries([
      ...pendingLibraries,
      {
        id: `pending-${Date.now()}`,
        name: request.name,
        address: request.address,
        ownerName: request.requestedBy,
        ownerEmail: request.email,
        phone: request.phone,
        submittedAt: new Date().toISOString(),
        status: "pending",
        description: request.description,
      },
    ])

    setIsRequestDetailOpen(false)
    setSelectedRequest(null)

    toast({
      title: "Request Converted",
      description: "The request has been converted to a pending library.",
    })
  }

  const handleDeleteRequest = (id: string) => {
    setLibraryRequests(libraryRequests.filter((request) => request.id !== id))

    if (selectedRequest?.id === id) {
      setIsRequestDetailOpen(false)
      setSelectedRequest(null)
    }

    toast({
      title: "Request Deleted",
      description: "The library request has been deleted.",
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Libraries</h1>
        <p className="text-muted-foreground">Manage all libraries on the platform</p>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative w-full md:w-1/3">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search libraries..."
            className="w-full pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:gap-4">
          <Select value={ratingFilter} onValueChange={setRatingFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by rating" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Ratings</SelectItem>
              <SelectItem value="5">4.5+ Stars</SelectItem>
              <SelectItem value="4">4.0+ Stars</SelectItem>
              <SelectItem value="3">3.0+ Stars</SelectItem>
              <SelectItem value="below3">Below 3.0 Stars</SelectItem>
            </SelectContent>
          </Select>

          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Library
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>Add New Library</DialogTitle>
                <DialogDescription>Add a new library to the platform.</DialogDescription>
              </DialogHeader>
              <AddLibraryForm onSubmit={handleAddLibrary} onCancel={() => setIsAddDialogOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs defaultValue="libraries">
        <TabsList>
          <TabsTrigger value="libraries">Active Libraries</TabsTrigger>
          <TabsTrigger value="pending">
            Pending Approval
            {pendingLibraries.length > 0 && (
              <Badge variant="secondary" className="ml-2">
                {pendingLibraries.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="requests">
            Library Requests
            {libraryRequests.length > 0 && (
              <Badge variant="secondary" className="ml-2">
                {libraryRequests.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="libraries" className="mt-6">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filteredLibraries.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-lg border py-8 text-center">
              <Building2 className="h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">No libraries found</h3>
              <p className="text-muted-foreground">Try adjusting your filters</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredLibraries.map((library) => (
                <Card key={library.id}>
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <CardTitle>{library.name}</CardTitle>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem
                            onClick={() => router.push(`/dashboard/super-admin/libraries/${library.id}`)}
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Library
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={() => handleDeleteLibrary(library.id)}
                          >
                            <Trash className="mr-2 h-4 w-4" />
                            Delete Library
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <CardDescription>{library.address}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center">
                        <span className="text-lg font-medium">{library.rating.toFixed(1)}</span>
                        <span className="ml-1 text-yellow-500">★</span>
                      </div>
                      <span className="text-sm text-muted-foreground">({library.reviewCount} reviews)</span>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {library.amenities.slice(0, 4).map((amenity) => (
                        <Badge key={amenity} variant="outline" className="capitalize">
                          {amenity.replace("_", " ")}
                        </Badge>
                      ))}
                      {library.amenities.length > 4 && (
                        <Badge variant="outline">+{library.amenities.length - 4} more</Badge>
                      )}
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">Seats</p>
                        <p className="text-sm text-muted-foreground">
                          {library.availableSeats} available / {library.totalSeats} total
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Plans</p>
                        <p className="text-sm text-muted-foreground">{library.membershipPlans.length} plans</p>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => router.push(`/dashboard/super-admin/libraries/${library.id}`)}
                    >
                      View Details
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="pending" className="mt-6">
          {pendingLibraries.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-lg border py-8 text-center">
              <FileText className="h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">No pending approvals</h3>
              <p className="text-muted-foreground">All libraries have been reviewed</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingLibraries.map((library) => (
                <Card key={library.id}>
                  <CardContent className="p-6">
                    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                      <div className="space-y-2">
                        <h3 className="text-xl font-semibold">{library.name}</h3>
                        <p className="text-muted-foreground">{library.address}</p>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <span className="font-medium">Submitted by:</span>
                            <span>{library.ownerName}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="font-medium">Email:</span>
                            <span>{library.ownerEmail}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="font-medium">Phone:</span>
                            <span>{library.phone}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="font-medium">Date:</span>
                            <span>{new Date(library.submittedAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <p className="text-sm">{library.description}</p>
                      </div>
                      <div className="flex flex-row gap-2 md:flex-col">
                        <Button
                          variant="default"
                          className="bg-green-500 hover:bg-green-600"
                          onClick={() => handleApproveLibrary(library.id)}
                        >
                          <Check className="mr-2 h-4 w-4" />
                          Approve
                        </Button>
                        <Button
                          variant="outline"
                          className="text-red-500 hover:text-red-600"
                          onClick={() => handleRejectLibrary(library.id)}
                        >
                          <X className="mr-2 h-4 w-4" />
                          Reject
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="requests" className="mt-6">
          {libraryRequests.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-lg border py-8 text-center">
              <Inbox className="h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">No library requests</h3>
              <p className="text-muted-foreground">There are no pending requests from users</p>
            </div>
          ) : (
            <div className="space-y-4">
              {libraryRequests.map((request) => (
                <Card key={request.id}>
                  <CardContent className="p-6">
                    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                      <div className="space-y-2">
                        <h3 className="text-xl font-semibold">{request.name}</h3>
                        <p className="text-muted-foreground">{request.address}</p>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <span className="font-medium">Requested by:</span>
                            <span>{request.requestedBy}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="font-medium">Date:</span>
                            <span>{new Date(request.requestedAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <div className="line-clamp-2 text-sm">{request.description}</div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          onClick={() => {
                            setSelectedRequest(request)
                            setIsRequestDetailOpen(true)
                          }}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </Button>
                        <Button variant="destructive" size="icon" onClick={() => handleDeleteRequest(request.id)}>
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Request Detail Dialog */}
          <Dialog open={isRequestDetailOpen} onOpenChange={setIsRequestDetailOpen}>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Library Request Details</DialogTitle>
                <DialogDescription>Review the request details</DialogDescription>
              </DialogHeader>
              {selectedRequest && (
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold">{selectedRequest.name}</h3>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <CalendarDays className="h-4 w-4" />
                      <span>Requested on {new Date(selectedRequest.requestedAt).toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="rounded-md border p-4">
                    <div className="mb-2 font-medium">Contact Information</div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center gap-1">
                        <span className="font-medium">Name:</span>
                        <span>{selectedRequest.requestedBy}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="font-medium">Email:</span>
                        <span>{selectedRequest.email}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="font-medium">Phone:</span>
                        <span>{selectedRequest.phone}</span>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-md border p-4">
                    <div className="mb-2 font-medium">Library Information</div>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-start gap-1">
                        <span className="font-medium">Address:</span>
                        <span>{selectedRequest.address}</span>
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="font-medium">Description:</span>
                        <p>{selectedRequest.description}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsRequestDetailOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => handleConvertRequestToLibrary(selectedRequest)}>Convert to Library</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </TabsContent>
      </Tabs>
    </div>
  )
}
