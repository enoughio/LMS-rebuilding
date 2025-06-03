import type { Book, BookCategory } from "@/types/book"

// Mock book categories
const categories: BookCategory[] = [
  {
    id: "cat-1",
    name: "Fiction",
    description: "Novels, short stories, and other fictional works",
    bookCount: 45,
  },
  {
    id: "cat-2",
    name: "Non-Fiction",
    description: "Biographies, history, science, and other factual works",
    bookCount: 62,
  },
  {
    id: "cat-3",
    name: "Academic",
    description: "Textbooks and academic resources",
    bookCount: 38,
  },
  {
    id: "cat-4",
    name: "Self-Help",
    description: "Personal development and self-improvement books",
    bookCount: 24,
  },
  {
    id: "cat-5",
    name: "Technology",
    description: "Books on programming, IT, and other tech topics",
    bookCount: 31,
  },
]

// Mock books
const books: Book[] = [
  {
    id: "book-1",
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    coverImage: "/placeholder.svg?height=300&width=200",
    description:
      "A novel about the mysterious millionaire Jay Gatsby and his obsession with the beautiful Daisy Buchanan.",
    categoryId: "cat-1",
    publishedYear: 1925,
    pageCount: 180,
    rating: 4.5,
    reviewCount: 120,
    isAvailable: true,
    isPremium: false,
    libraryId: "lib-1",
  },
  {
    id: "book-2",
    title: "Sapiens: A Brief History of Humankind",
    author: "Yuval Noah Harari",
    coverImage: "/placeholder.svg?height=300&width=200",
    description:
      "A book that explores the history of the human species from the emergence of Homo sapiens to the present day.",
    categoryId: "cat-2",
    publishedYear: 2011,
    pageCount: 443,
    rating: 4.7,
    reviewCount: 210,
    isAvailable: true,
    isPremium: true,
    libraryId: "lib-1",
  },
  {
    id: "book-3",
    title: "Clean Code",
    author: "Robert C. Martin",
    coverImage: "/placeholder.svg?height=300&width=200",
    description: "A handbook of agile software craftsmanship that helps programmers write better code.",
    categoryId: "cat-5",
    publishedYear: 2008,
    pageCount: 464,
    rating: 4.8,
    reviewCount: 180,
    isAvailable: true,
    isPremium: true,
    libraryId: "lib-3",
  },
  {
    id: "book-4",
    title: "Atomic Habits",
    author: "James Clear",
    coverImage: "/placeholder.svg?height=300&width=200",
    description: "A guide to building good habits and breaking bad ones using proven scientific methods.",
    categoryId: "cat-4",
    publishedYear: 2018,
    pageCount: 320,
    rating: 4.6,
    reviewCount: 150,
    isAvailable: true,
    isPremium: false,
    libraryId: "lib-2",
  },
  {
    id: "book-5",
    title: "Introduction to Algorithms",
    author: "Thomas H. Cormen",
    coverImage: "/placeholder.svg?height=300&width=200",
    description: "A comprehensive introduction to the modern study of computer algorithms.",
    categoryId: "cat-3",
    publishedYear: 2009,
    pageCount: 1312,
    rating: 4.9,
    reviewCount: 90,
    isAvailable: true,
    isPremium: true,
    libraryId: "lib-3",
  },
  {
    id: "book-6",
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    coverImage: "/placeholder.svg?height=300&width=200",
    description: "A novel about racial inequality and moral growth in the American South during the 1930s.",
    categoryId: "cat-1",
    publishedYear: 1960,
    pageCount: 281,
    rating: 4.8,
    reviewCount: 200,
    isAvailable: true,
    isPremium: false,
    libraryId: "lib-1",
  },
  {
    id: "book-7",
    title: "The Pragmatic Programmer",
    author: "Andrew Hunt, David Thomas",
    coverImage: "/placeholder.svg?height=300&width=200",
    description: "A guide for software developers on how to approach software development pragmatically.",
    categoryId: "cat-5",
    publishedYear: 1999,
    pageCount: 352,
    rating: 4.7,
    reviewCount: 110,
    isAvailable: true,
    isPremium: true,
    libraryId: "lib-3",
  },
  {
    id: "book-8",
    title: "Thinking, Fast and Slow",
    author: "Daniel Kahneman",
    coverImage: "/placeholder.svg?height=300&width=200",
    description: "A book that explores the two systems that drive the way we think and make choices.",
    categoryId: "cat-2",
    publishedYear: 2011,
    pageCount: 499,
    rating: 4.6,
    reviewCount: 170,
    isAvailable: true,
    isPremium: true,
    libraryId: "lib-2",
  },
]

// Mock user book history
const userBookHistory = [
  {
    userId: "user-1",
    bookId: "book-1",
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    lastReadPage: 120,
    totalPages: 180,
    isCompleted: false,
  },
  {
    userId: "user-1",
    bookId: "book-4",
    startDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    lastReadPage: 320,
    totalPages: 320,
    isCompleted: true,
  },
  {
    userId: "user-2",
    bookId: "book-2",
    startDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    lastReadPage: 200,
    totalPages: 443,
    isCompleted: false,
  },
]

// Simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export const mockELibraryService = {
  // Get all categories
  getCategories: async (): Promise<BookCategory[]> => {
    await delay(500) // Simulate network delay
    return categories
  },

  // Get books by category
  getBooksByCategory: async (categoryId: string): Promise<Book[]> => {
    await delay(700) // Simulate network delay
    return books.filter((book) => book.categoryId === categoryId)
  },

  // Get all books
  getAllBooks: async (
    page = 1,
    limit = 10,
    filters?: {
      search?: string
      categoryId?: string
      isPremium?: boolean
    },
  ): Promise<{
    books: Book[]
    total: number
    page: number
    totalPages: number
  }> => {
    await delay(700) // Simulate network delay

    let filteredBooks = [...books]

    if (filters) {
      if (filters.search) {
        const searchLower = filters.search.toLowerCase()
        filteredBooks = filteredBooks.filter(
          (book) => book.title.toLowerCase().includes(searchLower) || book.author.toLowerCase().includes(searchLower),
        )
      }

      if (filters.categoryId) {
        filteredBooks = filteredBooks.filter((book) => book.categoryId === filters.categoryId)
      }

      if (filters.isPremium !== undefined) {
        filteredBooks = filteredBooks.filter((book) => book.isPremium === filters.isPremium)
      }
    }

    const start = (page - 1) * limit
    const end = start + limit
    const paginatedBooks = filteredBooks.slice(start, end)

    return {
      books: paginatedBooks,
      total: filteredBooks.length,
      page,
      totalPages: Math.ceil(filteredBooks.length / limit),
    }
  },

  // Get book by ID
  getBook: async (bookId: string): Promise<Book | null> => {
    await delay(500) // Simulate network delay

    const book = books.find((b) => b.id === bookId)
    return book || null
  },

  // Get user reading history
  getUserReadingHistory: async (userId: string): Promise<any[]> => {
    await delay(600) // Simulate network delay

    const history = userBookHistory.filter((h) => h.userId === userId)

    // Enrich with book details
    return history.map((h) => {
      const book = books.find((b) => b.id === h.bookId)
      return {
        ...h,
        book,
      }
    })
  },

  // Update reading progress
  updateReadingProgress: async (userId: string, bookId: string, page: number): Promise<any> => {
    await delay(400) // Simulate network delay

    let history = userBookHistory.find((h) => h.userId === userId && h.bookId === bookId)
    const book = books.find((b) => b.id === bookId)

    if (!book) {
      throw new Error("Book not found")
    }

    if (!history) {
      // Create new history entry
      history = {
        userId,
        bookId,
        startDate: new Date().toISOString(),
        lastReadPage: page,
        totalPages: book.pageCount,
        isCompleted: page >= book.pageCount,
      }
      userBookHistory.push(history)
    } else {
      // Update existing history
      history.lastReadPage = page
      history.isCompleted = page >= book.pageCount
    }

    return {
      ...history,
      book,
    }
  },

  // Add a new book (for admin)
  addBook: async (bookData: Omit<Book, "id">): Promise<Book> => {
    await delay(1000) // Simulate network delay

    const newBook: Book = {
      id: `book-${books.length + 1}`,
      ...bookData,
      rating: bookData.rating || 0,
      reviewCount: bookData.reviewCount || 0,
    }

    // Add book to books array
    books.push(newBook)

    // Update category book count
    const category = categories.find((c) => c.id === bookData.categoryId)
    if (category) {
      category.bookCount += 1
    }

    return newBook
  },

  // Update book details (for admin)
  updateBook: async (bookId: string, bookData: Partial<Book>): Promise<Book> => {
    await delay(800) // Simulate network delay

    const bookIndex = books.findIndex((b) => b.id === bookId)
    if (bookIndex === -1) {
      throw new Error("Book not found")
    }

    // Update book
    books[bookIndex] = {
      ...books[bookIndex],
      ...bookData,
    }

    return books[bookIndex]
  },
}
