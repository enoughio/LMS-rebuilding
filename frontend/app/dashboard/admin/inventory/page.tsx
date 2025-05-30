"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { BookOpen, Edit, Loader2, Plus, Search, Trash } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
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
import { mockELibraryService } from "@/lib/mock-api/e-library-service"
import type { Book, BookCategory } from "@/types/book"

export default function InventoryPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [books, setBooks] = useState<Book[]>([])
  const [categories, setCategories] = useState<BookCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [premiumFilter, setPremiumFilter] = useState<string>("all")
  const [newBook, setNewBook] = useState<Partial<Book>>({
    title: "",
    author: "",
    description: "",
    categoryId: "",
    publishedYear: new Date().getFullYear(),
    pageCount: 0,
    isPremium: false,
    isAvailable: true,
    coverImage: "/placeholder.svg?height=300&width=200",
    rating: 0,
    reviewCount: 0,
    libraryId: user?.libraryId || "",
  })
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const [booksData, categoriesData] = await Promise.all([
          mockELibraryService.getAllBooks(),
          mockELibraryService.getCategories(),
        ])

        // Filter books by library ID if user is an admin
        const filteredBooks = user?.libraryId
          ? booksData.books.filter((book) => book.libraryId === user.libraryId)
          : booksData.books

        setBooks(filteredBooks)
        setCategories(categoriesData)
      } catch (error) {
        console.error("Error fetching inventory data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [user])

  // Apply filters
  const filteredBooks = books.filter((book) => {
    const matchesSearch =
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = categoryFilter === "all" || book.categoryId === categoryFilter
    const matchesPremium =
      premiumFilter === "all" ||
      (premiumFilter === "premium" && book.isPremium) ||
      (premiumFilter === "standard" && !book.isPremium)

    return matchesSearch && matchesCategory && matchesPremium
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setNewBook((prev) => ({ ...prev, [name]: value }))
  }

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setNewBook((prev) => ({ ...prev, [name]: checked }))
  }

  const handleAddBook = async () => {
    if (!newBook.title || !newBook.author || !newBook.categoryId) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    try {
      // Convert string values to appropriate types
      const bookToAdd = {
        ...newBook,
        publishedYear: Number(newBook.publishedYear),
        pageCount: Number(newBook.pageCount),
        rating: 0,
        reviewCount: 0,
        libraryId: user?.libraryId || "",
      }

      // In a real app, this would add the book to the database
      const addedBook = await mockELibraryService.addBook(bookToAdd as Omit<Book, "id">)

      toast({
        title: "Book Added",
        description: `"${addedBook.title}" has been added to the inventory.`,
      })

      // Reset form and close dialog
      setNewBook({
        title: "",
        author: "",
        description: "",
        categoryId: "",
        publishedYear: new Date().getFullYear(),
        pageCount: 0,
        isPremium: false,
        isAvailable: true,
        coverImage: "/placeholder.svg?height=300&width=200",
        rating: 0,
        reviewCount: 0,
        libraryId: user?.libraryId || "",
      })
      setIsAddDialogOpen(false)

      // Add the new book to the books state
      setBooks([...books, addedBook])

      // Refetch categories to update book counts
      const updatedCategories = await mockELibraryService.getCategories()
      setCategories(updatedCategories)
    } catch (error) {
      console.error("Error adding book:", error)
      toast({
        title: "Error",
        description: "Failed to add book to inventory",
        variant: "destructive",
      })
    }
  }

  const handleDeleteBook = (bookId: string) => {
    // In a real app, this would delete the book from the database
    toast({
      title: "Book Removed",
      description: "The book has been removed from the inventory.",
    })

    // Remove the book from the list
    setBooks(books.filter((book) => book.id !== bookId))
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Inventory Management</h1>
        <p className="text-muted-foreground">Manage your library's book inventory</p>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative w-full md:w-1/3">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search by title or author..."
            className="w-full pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:gap-4">
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={premiumFilter} onValueChange={setPremiumFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Books</SelectItem>
              <SelectItem value="standard">Standard</SelectItem>
              <SelectItem value="premium">Premium</SelectItem>
            </SelectContent>
          </Select>

          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Book
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Add New Book</DialogTitle>
                <DialogDescription>Add a new book to your library's inventory.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title *</Label>
                    <Input
                      id="title"
                      name="title"
                      value={newBook.title}
                      onChange={handleInputChange}
                      placeholder="Book title"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="author">Author *</Label>
                    <Input
                      id="author"
                      name="author"
                      value={newBook.author}
                      onChange={handleInputChange}
                      placeholder="Author name"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={newBook.description}
                    onChange={handleInputChange}
                    placeholder="Book description"
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="categoryId">Category *</Label>
                    <Select
                      name="categoryId"
                      value={newBook.categoryId}
                      onValueChange={(value) => setNewBook((prev) => ({ ...prev, categoryId: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="publishedYear">Published Year</Label>
                    <Input
                      id="publishedYear"
                      name="publishedYear"
                      type="number"
                      value={newBook.publishedYear}
                      onChange={handleInputChange}
                      placeholder="Year"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="pageCount">Page Count</Label>
                    <Input
                      id="pageCount"
                      name="pageCount"
                      type="number"
                      value={newBook.pageCount}
                      onChange={handleInputChange}
                      placeholder="Number of pages"
                    />
                  </div>
                  <div className="flex items-center space-x-2 pt-6">
                    <input
                      type="checkbox"
                      id="isPremium"
                      checked={newBook.isPremium}
                      onChange={(e) => handleCheckboxChange("isPremium", e.target.checked)}
                      className="h-4 w-4 rounded border-gray-300"
                    />
                    <Label htmlFor="isPremium">Premium Content</Label>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddBook}>Add Book</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All Books</TabsTrigger>
          <TabsTrigger value="available">Available</TabsTrigger>
          <TabsTrigger value="premium">Premium</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-4">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filteredBooks.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-lg border py-8 text-center">
              <BookOpen className="h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">No books found</h3>
              <p className="text-muted-foreground">Try adjusting your filters</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredBooks.map((book) => (
                <Card key={book.id}>
                  <div className="flex h-full">
                    <div className="relative h-auto w-1/3 overflow-hidden">
                      <div className="aspect-[2/3] bg-muted">
                        <img
                          src={book.coverImage || "/placeholder.svg"}
                          alt={book.title}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    </div>
                    <div className="flex w-2/3 flex-col p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold line-clamp-1">{book.title}</h3>
                          <p className="text-sm text-muted-foreground">{book.author}</p>
                        </div>
                        {book.isPremium && <Badge variant="secondary">Premium</Badge>}
                      </div>
                      <div className="mt-2 flex items-center gap-1">
                        <span className="text-sm font-medium">{book.rating.toFixed(1)}</span>
                        <span className="text-yellow-500">★</span>
                        <span className="text-xs text-muted-foreground">({book.reviewCount})</span>
                      </div>
                      <p className="mt-2 text-xs text-muted-foreground line-clamp-2">{book.description}</p>
                      <div className="mt-auto flex justify-between pt-2">
                        <Badge variant={book.isAvailable ? "outline" : "destructive"}>
                          {book.isAvailable ? "Available" : "Checked Out"}
                        </Badge>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive"
                            onClick={() => handleDeleteBook(book.id)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="available" className="mt-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredBooks
              .filter((book) => book.isAvailable)
              .map((book) => (
                <Card key={book.id}>
                  <div className="flex h-full">
                    <div className="relative h-auto w-1/3 overflow-hidden">
                      <div className="aspect-[2/3] bg-muted">
                        <img
                          src={book.coverImage || "/placeholder.svg"}
                          alt={book.title}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    </div>
                    <div className="flex w-2/3 flex-col p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold line-clamp-1">{book.title}</h3>
                          <p className="text-sm text-muted-foreground">{book.author}</p>
                        </div>
                        {book.isPremium && <Badge variant="secondary">Premium</Badge>}
                      </div>
                      <div className="mt-2 flex items-center gap-1">
                        <span className="text-sm font-medium">{book.rating.toFixed(1)}</span>
                        <span className="text-yellow-500">★</span>
                        <span className="text-xs text-muted-foreground">({book.reviewCount})</span>
                      </div>
                      <p className="mt-2 text-xs text-muted-foreground line-clamp-2">{book.description}</p>
                      <div className="mt-auto flex justify-between pt-2">
                        <Badge variant="outline">Available</Badge>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive"
                            onClick={() => handleDeleteBook(book.id)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
          </div>
        </TabsContent>

        <TabsContent value="premium" className="mt-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredBooks
              .filter((book) => book.isPremium)
              .map((book) => (
                <Card key={book.id}>
                  <div className="flex h-full">
                    <div className="relative h-auto w-1/3 overflow-hidden">
                      <div className="aspect-[2/3] bg-muted">
                        <img
                          src={book.coverImage || "/placeholder.svg"}
                          alt={book.title}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    </div>
                    <div className="flex w-2/3 flex-col p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold line-clamp-1">{book.title}</h3>
                          <p className="text-sm text-muted-foreground">{book.author}</p>
                        </div>
                        <Badge variant="secondary">Premium</Badge>
                      </div>
                      <div className="mt-2 flex items-center gap-1">
                        <span className="text-sm font-medium">{book.rating.toFixed(1)}</span>
                        <span className="text-yellow-500">★</span>
                        <span className="text-xs text-muted-foreground">({book.reviewCount})</span>
                      </div>
                      <p className="mt-2 text-xs text-muted-foreground line-clamp-2">{book.description}</p>
                      <div className="mt-auto flex justify-between pt-2">
                        <Badge variant={book.isAvailable ? "outline" : "destructive"}>
                          {book.isAvailable ? "Available" : "Checked Out"}
                        </Badge>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive"
                            onClick={() => handleDeleteBook(book.id)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
