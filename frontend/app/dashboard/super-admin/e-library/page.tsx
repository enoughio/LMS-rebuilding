"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { BookOpen, Loader2, Plus, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
import { useToast } from "@/components/ui/use-toast"
import { mockELibraryService } from "@/lib/mock-api/e-library-service"
import type { Book, BookCategory } from "@/types/book"

export default function ELibraryPage() {
  const { toast } = useToast()
  const [books, setBooks] = useState<Book[]>([])
  const [categories, setCategories] = useState<BookCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [libraryFilter, setLibraryFilter] = useState<string>("all")
  const [premiumFilter, setPremiumFilter] = useState<string>("all")
  const [isAddBookDialogOpen, setIsAddBookDialogOpen] = useState(false)
  const [isAddCategoryDialogOpen, setIsAddCategoryDialogOpen] = useState(false)
  const [selectedBook, setSelectedBook] = useState<Book | null>(null)
  const [isEditBookDialogOpen, setIsEditBookDialogOpen] = useState(false)

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
    libraryId: "",
  })

  const [newCategory, setNewCategory] = useState({
    name: "",
    description: "",
  })

  // Mock libraries for dropdown
  const mockLibraries = [
    { id: "all", name: "All Libraries" },
    { id: "lib-1", name: "Central Library" },
    { id: "lib-2", name: "Riverside Reading Hub" },
    { id: "lib-3", name: "Tech Knowledge Center" },
  ]

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const [booksData, categoriesData] = await Promise.all([
          mockELibraryService.getAllBooks(),
          mockELibraryService.getCategories(),
        ])

        setBooks(booksData.books)
        setCategories(categoriesData)
      } catch (error) {
        console.error("Error fetching e-library data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Apply filters
  const filteredBooks = books.filter((book) => {
    const matchesSearch =
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesCategory = categoryFilter === "all" || book.categoryId === categoryFilter
    const matchesLibrary = libraryFilter === "all" || book.libraryId === libraryFilter
    const matchesPremium =
      premiumFilter === "all" ||
      (premiumFilter === "premium" && book.isPremium) ||
      (premiumFilter === "standard" && !book.isPremium)

    return matchesSearch && matchesCategory && matchesLibrary && matchesPremium
  })

  const handleBookInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setNewBook((prev) => ({
      ...prev,
      [name]: name === "publishedYear" || name === "pageCount" ? Number(value) : value,
    }))
  }

  const handleBookCheckboxChange = (name: string, checked: boolean) => {
    setNewBook((prev) => ({ ...prev, [name]: checked }))
  }

  const handleCategoryInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setNewCategory((prev) => ({ ...prev, [name]: value }))
  }

  const handleAddBook = async () => {
    if (!newBook.title || !newBook.author || !newBook.categoryId || !newBook.libraryId) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    try {
      // In a real app, this would add the book to the database
      const addedBook = await mockELibraryService.addBook(newBook as Omit<Book, "id">)
      setBooks([...books, addedBook])

      toast({
        title: "Book Added",
        description: `"${newBook.title}" has been added to the e-library.`,
      })

      setIsAddBookDialogOpen(false)
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
        libraryId: "",
      })
    } catch (error) {
      console.error("Error adding book:", error)
      toast({
        title: "Error",
        description: "Failed to add book to e-library",
        variant: "destructive",
      })
    }
  }

  const handleEditBook = async () => {
    if (!selectedBook) return

    try {
      // In a real app, this would update the book in the database
      const updatedBook = await mockELibraryService.updateBook(selectedBook.id, selectedBook)
      setBooks(books.map((book) => (book.id === selectedBook.id ? updatedBook : book)))

      toast({
        title: "Book Updated",
        description: `"${selectedBook.title}" has been updated.`,
      })

      setIsEditBookDialogOpen(false)
      setSelectedBook(null)
    } catch (error) {
      console.error("Error updating book:", error)
      toast({
        title: "Error",
        description: "Failed to update book",
        variant: "destructive",
      })
    }
  }

  const handleAddCategory = () => {
    if (!newCategory.name) {
      toast({
        title: "Missing Information",
        description: "Please enter a category name",
        variant: "destructive",
      })
      return
    }

    // In a real app, this would add the category to the database
    const newCategoryWithId: BookCategory = {
      id: `cat-${Date.now()}`,
      name: newCategory.name,
      description: newCategory.description,
      bookCount: 0,
    }

    setCategories([...categories, newCategoryWithId])

    toast({
      title: "Category Added",
      description: `"${newCategory.name}" category has been added.`,
    })

    setIsAddCategoryDialogOpen(false)
    setNewCategory({
      name: "",
      description: "",
    })
  }

  const handleDeleteBook = (bookId: string) => {
    // In a real app, this would delete the book from the database
    setBooks(books.filter((book) => book.id !== bookId))

    toast({
      title: "Book Removed",
      description: "The book has been removed from the e-library.",
    })
  }

  const handleEditBookClick = (book: Book) => {
    setSelectedBook(book)
    setIsEditBookDialogOpen(true)
  }

  const handleSelectedBookChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    if (!selectedBook) return

    const { name, value } = e.target
    setSelectedBook({
      ...selectedBook,
      [name]: name === "publishedYear" || name === "pageCount" ? Number(value) : value,
    })
  }

  const handleSelectedBookCheckboxChange = (name: string, checked: boolean) => {
    if (!selectedBook) return
    setSelectedBook({
      ...selectedBook,
      [name]: checked,
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">E-Library Management</h1>
        <p className="text-muted-foreground">Manage books and categories across all libraries</p>
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

        <div className="flex flex-wrap gap-2">
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

          <Select value={libraryFilter} onValueChange={setLibraryFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by library" />
            </SelectTrigger>
            <SelectContent>
              {mockLibraries.map((library) => (
                <SelectItem key={library.id} value={library.id}>
                  {library.name}
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
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <Dialog open={isAddBookDialogOpen} onOpenChange={setIsAddBookDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Book
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Add New Book</DialogTitle>
              <DialogDescription>Add a new book to the e-library.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    name="title"
                    value={newBook.title}
                    onChange={handleBookInputChange}
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
                    onChange={handleBookInputChange}
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
                  onChange={handleBookInputChange}
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
                  <Label htmlFor="libraryId">Library *</Label>
                  <Select
                    name="libraryId"
                    value={newBook.libraryId}
                    onValueChange={(value) => setNewBook((prev) => ({ ...prev, libraryId: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select library" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockLibraries.slice(1).map((library) => (
                        <SelectItem key={library.id} value={library.id}>
                          {library.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="publishedYear">Published Year</Label>
                  <Input
                    id="publishedYear"
                    name="publishedYear"
                    type="number"
                    value={newBook.publishedYear}
                    onChange={handleBookInputChange}
                    placeholder="Year"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pageCount">Page Count</Label>
                  <Input
                    id="pageCount"
                    name="pageCount"
                    type="number"
                    value={newBook.pageCount}
                    onChange={handleBookInputChange}
                    placeholder="Number of pages"
                  />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isPremium"
                  checked={newBook.isPremium}
                  onChange={(e) => handleBookCheckboxChange("isPremium", e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300"
                />
                <Label htmlFor="isPremium">Premium Content</Label>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddBookDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddBook}>Add Book</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={isAddCategoryDialogOpen} onOpenChange={setIsAddCategoryDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline">
              <Plus className="mr-2 h-4 w-4" />
              Add Category
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add New Category</DialogTitle>
              <DialogDescription>Add a new book category to the e-library.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Category Name *</Label>
                <Input
                  id="name"
                  name="name"
                  value={newCategory.name}
                  onChange={handleCategoryInputChange}
                  placeholder="Category name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={newCategory.description}
                  onChange={handleCategoryInputChange}
                  placeholder="Category description"
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddCategoryDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddCategory}>Add Category</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="books">
        <TabsList>
          <TabsTrigger value="books">Books</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
        </TabsList>

        <TabsContent value="books" className="mt-4">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filteredBooks.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-lg border py-8 text-center">
              <BookOpen className="h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">No books found</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Try adjusting your search or filters to find what you're looking for.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredBooks.map((book) => (
                <div
                  key={book.id}
                  className="flex flex-col overflow-hidden rounded-lg border bg-card text-card-foreground shadow-sm"
                >
                  <div className="aspect-[2/3] w-full overflow-hidden bg-muted">
                    <img
                      src={book.coverImage || "/placeholder.svg"}
                      alt={book.title}
                      className="h-full w-full object-cover transition-all hover:scale-105"
                    />
                  </div>
                  <div className="flex flex-1 flex-col space-y-1.5 p-4">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold leading-tight">{book.title}</h3>
                        {book.isPremium && (
                          <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800">
                            Premium
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{book.author}</p>
                    </div>
                    <div className="flex-1">
                      <p className="line-clamp-2 text-xs text-muted-foreground">
                        {book.description || "No description available."}
                      </p>
                    </div>
                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleEditBookClick(book)}>
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-destructive hover:bg-destructive/10"
                          onClick={() => handleDeleteBook(book.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="categories" className="mt-4">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {categories.map((category) => (
                <div
                  key={category.id}
                  className="flex flex-col rounded-lg border bg-card p-4 text-card-foreground shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">{category.name}</h3>
                    <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                      {category.bookCount} books
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {category.description || "No description available."}
                  </p>
                </div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Edit Book Dialog */}
      <Dialog open={isEditBookDialogOpen} onOpenChange={setIsEditBookDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Book</DialogTitle>
            <DialogDescription>Update book information.</DialogDescription>
          </DialogHeader>
          {selectedBook && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-title">Title *</Label>
                  <Input
                    id="edit-title"
                    name="title"
                    value={selectedBook.title}
                    onChange={handleSelectedBookChange}
                    placeholder="Book title"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-author">Author *</Label>
                  <Input
                    id="edit-author"
                    name="author"
                    value={selectedBook.author}
                    onChange={handleSelectedBookChange}
                    placeholder="Author name"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  name="description"
                  value={selectedBook.description}
                  onChange={handleSelectedBookChange}
                  placeholder="Book description"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-categoryId">Category *</Label>
                  <Select
                    name="categoryId"
                    value={selectedBook.categoryId}
                    onValueChange={(value) => setSelectedBook({ ...selectedBook, categoryId: value })}
                  >
                    <SelectTrigger id="edit-categoryId">
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
                  <Label htmlFor="edit-publishedYear">Published Year</Label>
                  <Input
                    id="edit-publishedYear"
                    name="publishedYear"
                    type="number"
                    value={selectedBook.publishedYear}
                    onChange={handleSelectedBookChange}
                    placeholder="Year"
                  />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="edit-isPremium"
                  checked={selectedBook.isPremium}
                  onChange={(e) => handleSelectedBookCheckboxChange("isPremium", e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300"
                />
                <Label htmlFor="edit-isPremium">Premium Content</Label>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditBookDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditBook}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
