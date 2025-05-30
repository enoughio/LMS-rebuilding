export type BookCategory = {
  id: string
  name: string
  description: string
  bookCount: number
}

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
