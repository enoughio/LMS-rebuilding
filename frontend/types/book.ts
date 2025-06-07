// Enums matching backend schema
export type BookStatus = "AVAILABLE" | "BORROWED" | "RESERVED" | "MAINTENANCE" | "LOST"

export type BookCondition = "NEW" | "EXCELLENT" | "GOOD" | "FAIR" | "POOR"

export type EBookStatus = "AVAILABLE" | "CHECKED_OUT"

export type BorrowingStatus = "BORROWED" | "RETURNED" | "OVERDUE" | "LOST"

// Main types
export type BookCategory = {
  id: string
  name: string
  description?: string
  createdAt?: string
  updatedAt?: string
}

export type PhysicalBook = {
  id: string
  title: string
  author: string
  isbn?: string
  coverImage?: string
  description?: string
  publishedYear?: number
  publisher?: string
  pageCount?: number
  language?: string
  genre?: string[]
  tags?: string[]
  location?: string // Shelf/section in the library
  status?: BookStatus
  condition?: BookCondition
  price: number
  currency?: string
  acquisitionDate?: string
  createdAt?: string
  updatedAt?: string
  libraryId: string
  categoryId: string
  // Relations (optional)
  category?: BookCategory
  library?: { id: string; name: string }
}

export type EBook = {
  id: string
  title: string
  author: string
  isbn?: string
  coverImage?: string
  description?: string
  publishedYear?: number
  publisher?: string
  pageCount?: number
  language?: string
  genre?: string[]
  tags?: string[]
  fileUrl: string
  fileFormat: string
  fileSize: number // in KB
  price: number
  currency?: string
  isPremium?: boolean
  isActive?: boolean
  status?: EBookStatus
  createdAt?: string
  updatedAt?: string
  categoryId: string
  libraryId: string
  // Relations (optional)
  category?: BookCategory
  library?: { id: string; name: string }
}

export type BookBorrowing = {
  id: string
  borrowDate: string
  dueDate: string
  returnDate?: string
  status: BorrowingStatus
  penalty?: number
  penaltyPaid?: boolean
  createdAt?: string
  updatedAt?: string
  userId: string
  bookId: string
  libraryId: string
  // Relations (optional)
  user?: { id: string; name: string }
  book?: PhysicalBook
  library?: { id: string; name: string }
}

export type EBookAccess = {
  id: string
  startDate: string
  endDate: string
  isActive?: boolean
  createdAt?: string
  updatedAt?: string
  userId: string
  eBookId: string
  // Relations (optional)
  user?: { id: string; name: string }
  eBook?: EBook
}

export type ReadingHistory = {
  id: string
  startDate: string
  lastReadDate: string
  lastReadPage: number
  totalPages: number
  isCompleted?: boolean
  completedDate?: string
  createdAt?: string
  updatedAt?: string
  userId: string
  eBookId: string
  // Relations (optional)
  user?: { id: string; name: string }
  eBook?: EBook
}

export type Bookmark = {
  id: string
  page: number
  position?: string // Position on page if applicable
  title?: string
  createdAt?: string
  updatedAt?: string
  userId: string
  eBookId: string
  // Relations (optional)
  eBook?: EBook
}

export type Note = {
  id: string
  page: number
  content: string
  color?: string // For highlighting color
  createdAt?: string
  updatedAt?: string
  userId: string
  eBookId: string
  // Relations (optional)
  eBook?: EBook
}

// Legacy types for backwards compatibility
export type Book = {
  id: string
  title: string
  author: string
  coverImage: string
  description: string
  categoryId: string
  publishedYear: number
  pageCount: number
  rating: number
  reviewCount: number
  isAvailable: boolean
  isPremium: boolean
  libraryId: string
}

export type UserBookHistory = {
  userId: string
  bookId: string
  startDate: string
  lastReadPage: number
  totalPages: number
  isCompleted: boolean
  book?: Book
}
