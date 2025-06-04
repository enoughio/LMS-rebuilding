"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import {
  Building2,
  Check,
  Edit,
  Eye,
  Loader2,
  MoreHorizontal,
  Search,
  Trash,
  X,
  FileText,
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
import type { Library } from "@/types/library"
// import { AddLibraryForm } from "@/components/SUPER_ADMIN/add-library-form"
import toast from "react-hot-toast"


// Mock library requests (keeping this for now as requested)


export default function LibrariesPage() {
  const router = useRouter()
  const [libraries, setLibraries] = useState<Library[]>([])
  const [pendingLibraries, setPendingLibraries] = useState<Library[]>([])
  const [loading, setLoading] = useState(true)
  const [pendingLoading, setPendingLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [ratingFilter, setRatingFilter] = useState<string>("all")
  const [selectedLibrary, setSelectedLibrary] = useState<Library | null>(null)
  const [isLibraryDetailOpen, setIsLibraryDetailOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const fetchLibraries = async () => {
      setLoading(true)
      try {
        const response = await fetch('/api/libraries', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        })

        if (!response.ok) {
          throw new Error('Failed to fetch libraries')
        }

        const result = await response.json()
        setLibraries(result.data?.libraries || [])
      } catch (error) {
        console.error("Error fetching libraries:", error)
        toast.error("Failed to fetch libraries")
      } finally {
        setLoading(false)
      }
    }

    const fetchPendingApprovals = async () => {
      setPendingLoading(true)
      try {
        const response = await fetch('/api/libraries/approvals', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          cache: 'no-store',
        })

        if (!response.ok) {
          let errMsg = "Failed to fetch pending approvals"
          try {
            const err = await response.json()
            errMsg = err?.message ?? errMsg
          } catch (_) {
            console.error("Error parsing error response:", _)
          }
          toast.error(errMsg)
          setPendingLibraries([])
          return
        }

        const result = await response.json()
        setPendingLibraries(result.data?.data || [])
      } catch (error) {
        toast.error(
          `Network error: ${error instanceof Error ? error : "Something went wrong"}`
        )
        setPendingLibraries([])
      } finally {
        setPendingLoading(false)
      }
    }

    fetchLibraries()
    fetchPendingApprovals()
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

  const handleApproveLibrary = async (id: string) => {
    setSubmitting(true)
    try {
      const response = await fetch('/api/libraries/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      })

      if (!response.ok) {
        let errMsg = 'Failed to approve library'
        try {
          const err = await response.json()
          errMsg = err?.message ?? errMsg
        } catch (_) {
          console.error("Error parsing error response:", _)
        }
        throw new Error(errMsg)
      }

      toast.success('Library approved successfully!')
      setPendingLibraries(prev => prev.filter(library => library.id !== id))
      setIsLibraryDetailOpen(false)
      setSelectedLibrary(null)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to approve library')
      console.error('Error approving library:', error)
    } finally {
      setSubmitting(false)
    }
  }

  const handleRejectLibrary = async (id: string) => {
    setSubmitting(true)
    try {
      const response = await fetch('/api/libraries/reject', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      })

      if (!response.ok) {
        let errMsg = 'Failed to reject library'
        try {
          const err = await response.json()
          errMsg = err?.message ?? errMsg
        } catch (_) {
          console.error("Error parsing error response:", _)
        }
        throw new Error(errMsg)
      }

      toast.success('Library rejected successfully!')
      setPendingLibraries(prev => prev.filter(library => library.id !== id))
      setIsLibraryDetailOpen(false)
      setSelectedLibrary(null)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to reject library')
      console.error('Error rejecting library:', error)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteLibrary = (id: string) => {
    // In a real app, this would delete the library from the database
    setLibraries(libraries.filter((library) => library.id !== id))

    toast("The library has been deleted successfully.")
  }

  return (
    <div className="space-y-6 min-h-[120vh] min-w-[72vw] pb-16">
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

          {/* <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
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
          </Dialog> */}
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
          {/* <TabsTrigger value="requests">
            Library Requests
            {libraryRequests.length > 0 && (
              <Badge variant="secondary" className="ml-2">
                {libraryRequests.length}
              </Badge>
            )}
          </TabsTrigger> */}
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
              {filteredLibraries.map((library:Library) => (
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
                            onClick={() => router.push(`/dashboard/SUPER_ADMIN/libraries/${library.id}`)}
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
                        <p className="text-sm text-muted-foreground">{library?.membershipPlans?.length} plans</p>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => router.push(`/dashboard/SUPER_ADMIN/libraries/${library.id}`)}
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
          {pendingLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : pendingLibraries.length === 0 ? (
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
                      <div className="flex-1">
                        <h3 className="font-medium text-lg">{library.name}</h3>
                        {library.description && (
                          <p className="text-sm text-muted-foreground mt-1">{library.description}</p>
                        )}
                        <p className="text-sm text-muted-foreground mt-2">{library.address}</p>
                        <div className="flex gap-4 mt-3 text-sm">
                          <div className="flex items-center gap-1">
                            <span className="font-medium">Admin:</span>
                            <span>{library.admin?.name || 'N/A'}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="font-medium">Email:</span>
                            <span>{library.admin?.email || library.email}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="font-medium">Phone:</span>
                            <span>{library.AdminPhone || library.phone || 'N/A'}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="font-medium">Submitted:</span>
                            <span>{new Date(library.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-row gap-2 md:flex-col">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedLibrary(library)
                            setIsLibraryDetailOpen(true)
                          }}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          Details
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

       
      </Tabs>

      {/* Library Detail Modal for Approval */}
      <Dialog open={isLibraryDetailOpen} onOpenChange={setIsLibraryDetailOpen}>
        <DialogContent className="overflow-y-auto max-w-[1000px] md:min-w-[800px] max-h-[90vh] bg-white">
          <DialogHeader>
            <DialogTitle>Review Library Application</DialogTitle>
            <DialogDescription>
              Review the library details and approve or reject the application
            </DialogDescription>
          </DialogHeader>

          {selectedLibrary && (
            <div className="space-y-4 text-sm">
              {/* Basic Information */}
              <div>
                <h3 className="font-medium text-lg mb-2">Library Information</h3>
                <div className="grid grid-cols-[150px_1fr] gap-2 pt-2">
                  <span className="font-medium">Name:</span>
                  <span>{selectedLibrary.name}</span>
                  <span className="font-medium">Description:</span>
                  <span>{selectedLibrary.description}</span>
                  <span className="font-medium">Address:</span>
                  <span>{selectedLibrary.address}</span>
                  <span className="font-medium">City:</span>
                  <span>{selectedLibrary.city}</span>
                  <span className="font-medium">State:</span>
                  <span>{selectedLibrary.state}</span>
                  <span className="font-medium">Country:</span>
                  <span>{selectedLibrary.country}</span>
                  <span className="font-medium">Postal Code:</span>
                  <span>{selectedLibrary.postalCode}</span>
                  <span className="font-medium">Email:</span>
                  <span>{selectedLibrary.email}</span>
                  <span className="font-medium">Phone:</span>
                  <span>{selectedLibrary.phone}</span>
                  <span className="font-medium">Total Seats:</span>
                  <span>{selectedLibrary.totalSeats}</span>
                  {selectedLibrary.additinalInformation && (
                    <>
                      <span className="font-medium">Additional Info:</span>
                      <span>{selectedLibrary.additinalInformation}</span>
                    </>
                  )}
                </div>
              </div>

              {/* Amenities */}
              {Array.isArray(selectedLibrary.amenities) && selectedLibrary.amenities.length > 0 && (
                <div>
                  <h3 className="font-medium text-lg mb-2">Amenities</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedLibrary.amenities.map((amenity, index) => (
                      <Badge key={index} variant="secondary" className="capitalize">
                        {amenity.replace('_', ' ')}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Admin Details */}
              {selectedLibrary.admin && (
                <div>
                  <h3 className="font-medium text-lg mb-2">Admin Details</h3>
                  <div className="grid grid-cols-[150px_1fr] gap-2 pt-2">
                    <span className="font-medium">Name:</span>
                    <span>{selectedLibrary.admin.name}</span>
                    <span className="font-medium">Email:</span>
                    <span>{selectedLibrary.admin.email}</span>
                    <span className="font-medium">Joined On:</span>
                    <span>{new Date(selectedLibrary.admin.createdAt).toLocaleDateString()}</span>
                    {selectedLibrary.AdminBio && (
                      <>
                        <span className="font-medium">Bio:</span>
                        <span>{selectedLibrary.AdminBio}</span>
                      </>
                    )}
                    {selectedLibrary.AdminPhone && (
                      <>
                        <span className="font-medium">Phone:</span>
                        <span>{selectedLibrary.AdminPhone}</span>
                      </>
                    )}
                    {selectedLibrary.AdminCompleteAddress && (
                      <>
                        <span className="font-medium">Address:</span>
                        <span>{selectedLibrary.AdminCompleteAddress}</span>
                      </>
                    )}
                    {selectedLibrary.admin.role && (
                      <>
                        <span className="font-medium">Role:</span>
                        <span>{selectedLibrary.admin.role}</span>
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* Images */}
              {Array.isArray(selectedLibrary.images) && selectedLibrary.images.length > 0 && (
                <div>
                  <h3 className="font-medium text-lg mb-2">Images</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {selectedLibrary.images.map((image, index) => (
                      <div key={index} className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                        <Image 
                          src={image} 
                          alt={`Library image ${index + 1}`}
                          width={400}
                          height={225}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = '/placeholder.jpg'
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Submission Date */}
              <div>
                <h3 className="font-medium text-lg mb-2">Submission Details</h3>
                <div className="grid grid-cols-[150px_1fr] gap-2 pt-2">
                  <span className="font-medium">Submitted On:</span>
                  <span>{new Date(selectedLibrary.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="flex justify-end gap-2 pt-4">
            <Button
              size="sm"
              variant="outline"
              disabled={submitting}
              onClick={() => handleRejectLibrary(selectedLibrary?.id || '')}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <X className="mr-2 h-4 w-4" />}
              Reject
            </Button>
            <Button
              size="sm"
              disabled={submitting}
              onClick={() => handleApproveLibrary(selectedLibrary?.id || '')}
              className="bg-green-500 hover:bg-green-600 text-white"
            >
              {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Check className="mr-2 h-4 w-4" />}
              Approve
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
