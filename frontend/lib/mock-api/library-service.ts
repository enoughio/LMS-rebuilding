import type { Library, LibraryAmenity, Seat, SeatBooking, Book } from "@/types/library"

// Mock libraries data
const libraries: Library[] = [
  {
    id: "lib-1",
    name: "Central Library",
    description: "A spacious library with modern amenities and a vast collection of books.",
    address: "123 Main St, New York, NY 10001",
    images: [
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
    ],
    rating: 4.7,
    reviewCount: 120,
    amenities: ["wifi", "ac", "cafe", "power_outlets", "quiet_zones", "meeting_rooms"],
    openingHours: {
      monday: { open: "08:00", close: "20:00" },
      tuesday: { open: "08:00", close: "20:00" },
      wednesday: { open: "08:00", close: "20:00" },
      thursday: { open: "08:00", close: "20:00" },
      friday: { open: "08:00", close: "20:00" },
      saturday: { open: "10:00", close: "18:00" },
      sunday: { open: "10:00", close: "16:00" },
    },
    ownerId: "user-3",
    membershipPlans: [
      {
        id: "plan-1",
        name: "Basic",
        price: 999,
        duration: 30,
        features: ["Access to library", "2 seat bookings per month", "Basic e-library access"],
        allowedBookingsPerMonth: 2,
        eLibraryAccess: true,
      },
      {
        id: "plan-2",
        name: "Premium",
        price: 1999,
        duration: 30,
        features: [
          "Access to library",
          "10 seat bookings per month",
          "Full e-library access",
          "Access to meeting rooms",
        ],
        allowedBookingsPerMonth: 10,
        eLibraryAccess: true,
      },
    ],
    totalSeats: 50,
    availableSeats: 35,
  },
  {
    id: "lib-2",
    name: "Riverside Reading Hub",
    description: "A cozy library with a beautiful view of the river and a friendly atmosphere.",
    address: "456 River Rd, Boston, MA 02108",
    images: ["/placeholder.svg?height=400&width=600", "/placeholder.svg?height=400&width=600"],
    rating: 4.5,
    reviewCount: 85,
    amenities: ["wifi", "ac", "quiet_zones", "power_outlets"],
    openingHours: {
      monday: { open: "09:00", close: "19:00" },
      tuesday: { open: "09:00", close: "19:00" },
      wednesday: { open: "09:00", close: "19:00" },
      thursday: { open: "09:00", close: "19:00" },
      friday: { open: "09:00", close: "19:00" },
      saturday: { open: "10:00", close: "17:00" },
      sunday: { open: "closed", close: "closed" },
    },
    ownerId: "user-5",
    membershipPlans: [
      {
        id: "plan-3",
        name: "Standard",
        price: 799,
        duration: 30,
        features: ["Access to library", "5 seat bookings per month", "Basic e-library access"],
        allowedBookingsPerMonth: 5,
        eLibraryAccess: true,
      },
    ],
    totalSeats: 30,
    availableSeats: 22,
  },
  {
    id: "lib-3",
    name: "Tech Knowledge Center",
    description: "A modern library focused on technology and digital resources.",
    address: "789 Tech Blvd, San Francisco, CA 94105",
    images: [
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
    ],
    rating: 4.9,
    reviewCount: 210,
    amenities: ["wifi", "ac", "cafe", "power_outlets", "quiet_zones", "meeting_rooms", "computers"],
    openingHours: {
      monday: { open: "08:00", close: "22:00" },
      tuesday: { open: "08:00", close: "22:00" },
      wednesday: { open: "08:00", close: "22:00" },
      thursday: { open: "08:00", close: "22:00" },
      friday: { open: "08:00", close: "22:00" },
      saturday: { open: "09:00", close: "20:00" },
      sunday: { open: "09:00", close: "18:00" },
    },
    ownerId: "user-6",
    membershipPlans: [
      {
        id: "plan-4",
        name: "Tech Basic",
        price: 1299,
        duration: 30,
        features: [
          "Access to library",
          "5 seat bookings per month",
          "Basic e-library access",
          "2 hours computer access daily",
        ],
        allowedBookingsPerMonth: 5,
        eLibraryAccess: true,
      },
      {
        id: "plan-5",
        name: "Tech Pro",
        price: 2499,
        duration: 30,
        features: [
          "Access to library",
          "Unlimited seat bookings",
          "Full e-library access",
          "Unlimited computer access",
          "Meeting room access",
        ],
        allowedBookingsPerMonth: 999,
        eLibraryAccess: true,
      },
    ],
    totalSeats: 80,
    availableSeats: 45,
  },
]

// Mock seats data
const seats: Seat[] = [
  // Library 1 seats
  ...Array(50)
    .fill(0)
    .map((_, i) => ({
      id: `seat-lib1-${i + 1}`,
      libraryId: "lib-1",
      name: `Seat ${i + 1}`,
      type: i < 10 ? "quiet_zone" : i < 30 ? "regular" : "computer",
      isAvailable: i % 3 !== 0, // Some seats are unavailable
    })),

  // Library 2 seats
  ...Array(30)
    .fill(0)
    .map((_, i) => ({
      id: `seat-lib2-${i + 1}`,
      libraryId: "lib-2",
      name: `Seat ${i + 1}`,
      type: i < 5 ? "quiet_zone" : "regular",
      isAvailable: i % 4 !== 0, // Some seats are unavailable
    })),

  // Library 3 seats
  ...Array(80)
    .fill(0)
    .map((_, i) => ({
      id: `seat-lib3-${i + 1}`,
      libraryId: "lib-3",
      name: `Seat ${i + 1}`,
      type: i < 20 ? "quiet_zone" : i < 50 ? "regular" : "computer",
      isAvailable: i % 5 !== 0, // Some seats are unavailable
    })),
]

// Mock bookings data
const bookings: SeatBooking[] = [
  {
    id: "booking-1",
    userId: "user-1",
    userName: "John Member",
    seatId: "seat-lib1-2",
    seatName: "Seat 2",
    libraryId: "lib-1",
    libraryName: "Central Library",
    date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], // 2 days from now
    startTime: "10:00",
    endTime: "14:00",
    status: "confirmed",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
  },
  {
    id: "booking-2",
    userId: "user-1",
    userName: "John Member",
    seatId: "seat-lib3-10",
    seatName: "Seat 10",
    libraryId: "lib-3",
    libraryName: "Tech Knowledge Center",
    date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], // 5 days from now
    startTime: "12:00",
    endTime: "18:00",
    status: "confirmed",
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
  },
  {
    id: "booking-3",
    userId: "user-1",
    userName: "John Member",
    seatId: "seat-lib1-15",
    seatName: "Seat 15",
    libraryId: "lib-1",
    libraryName: "Central Library",
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], // 3 days ago
    startTime: "09:00",
    endTime: "13:00",
    status: "completed",
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
  },
]

// Mock books data
const books: Book[] = [
  {
    id: "book-1",
    title: "The Lord of the Rings",
    author: "J.R.R. Tolkien",
    genre: "Fantasy",
    isAvailable: true,
  },
  {
    id: "book-2",
    title: "The Hobbit",
    author: "J.R.R. Tolkien",
    genre: "Fantasy",
    isAvailable: true,
  },
  {
    id: "book-3",
    title: "The Silmarillion",
    author: "J.R.R. Tolkien",
    genre: "Fantasy",
    isAvailable: false,
  },
]

// Simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export const mockLibraryService = {
  // Get all libraries with optional filtering
  getLibraries: async (filters?: {
    search?: string
    amenities?: LibraryAmenity[]
    rating?: number
  }): Promise<Library[]> => {
    await delay(800) // Simulate network delay

    let filteredLibraries = [...libraries]

    if (filters) {
      if (filters.search) {
        const searchLower = filters.search.toLowerCase()
        filteredLibraries = filteredLibraries.filter(
          (lib) => lib.name.toLowerCase().includes(searchLower) || lib.address.toLowerCase().includes(searchLower),
        )
      }

      if (filters.amenities && filters.amenities.length > 0) {
        filteredLibraries = filteredLibraries.filter((lib) =>
          filters.amenities!.every((amenity) => lib.amenities.includes(amenity)),
        )
      }

      if (filters.rating) {
        filteredLibraries = filteredLibraries.filter((lib) => lib.rating >= filters.rating)
      }
    }

    return filteredLibraries
  },

  // Get library by ID
  getLibrary: async (id: string): Promise<Library | null> => {
    await delay(500) // Simulate network delay

    const library = libraries.find((lib) => lib.id === id)
    return library || null
  },

  // Get available seats for a library on a specific date
  getAvailableSeats: async (libraryId: string, date: string): Promise<Seat[]> => {
    await delay(700) // Simulate network delay

    // Get all seats for this library
    const librarySeats = seats.filter((seat) => seat.libraryId === libraryId)

    // Get bookings for this date
    const dateBookings = bookings.filter((booking) => booking.libraryId === libraryId && booking.date === date)

    // Mark seats as unavailable if they have bookings
    return librarySeats.map((seat) => {
      const seatBookings = dateBookings.filter((booking) => booking.seatId === seat.id)
      return {
        ...seat,
        isAvailable: seat.isAvailable && seatBookings.length === 0,
        bookings: seatBookings,
      }
    })
  },

  // Book a seat
  bookSeat: async (bookingData: Omit<SeatBooking, "id" | "createdAt" | "status">): Promise<SeatBooking> => {
    await delay(1000) // Simulate network delay

    // Check if seat is available
    const seat = seats.find((s) => s.id === bookingData.seatId)
    if (!seat || !seat.isAvailable) {
      throw new Error("Seat is not available")
    }

    // Create new booking
    const newBooking: SeatBooking = {
      id: `booking-${bookings.length + 1}`,
      ...bookingData,
      status: "confirmed",
      createdAt: new Date().toISOString(),
    }

    // Add booking to bookings array
    bookings.push(newBooking)

    // Update seat availability
    seat.isAvailable = false

    // Update library available seats count
    const library = libraries.find((lib) => lib.id === bookingData.libraryId)
    if (library && library.availableSeats > 0) {
      library.availableSeats -= 1
    }

    return newBooking
  },

  // Get user bookings
  getUserBookings: async (userId: string): Promise<SeatBooking[]> => {
    await delay(600) // Simulate network delay

    return bookings.filter((booking) => booking.userId === userId)
  },

  // Get library bookings (for admin)
  getLibraryBookings: async (libraryId: string): Promise<SeatBooking[]> => {
    await delay(600) // Simulate network delay

    return bookings.filter((booking) => booking.libraryId === libraryId)
  },

  // Update library details (for admin)
  updateLibrary: async (libraryId: string, data: Partial<Library>): Promise<Library> => {
    await delay(800) // Simulate network delay

    const libraryIndex = libraries.findIndex((lib) => lib.id === libraryId)
    if (libraryIndex === -1) {
      throw new Error("Library not found")
    }

    // Update library
    libraries[libraryIndex] = {
      ...libraries[libraryIndex],
      ...data,
    }

    return libraries[libraryIndex]
  },

  // Borrow a book
  borrowBook: async (bookId: string, userId: string): Promise<Book> => {
    await delay(800) // Simulate network delay

    // Find the book
    const bookIndex = books.findIndex((b) => b.id === bookId)
    if (bookIndex === -1) {
      throw new Error("Book not found")
    }

    // Check if book is available
    if (!books[bookIndex].isAvailable) {
      throw new Error("Book is not available")
    }

    // Update book availability
    books[bookIndex] = {
      ...books[bookIndex],
      isAvailable: false,
    }

    // Create a borrowing record (in a real app, this would be stored in a database)
    const borrowing = {
      id: `borrow-${Date.now()}`,
      bookId,
      userId,
      borrowDate: new Date().toISOString(),
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days from now
      returnDate: null,
      status: "borrowed",
    }

    return books[bookIndex]
  },

  // Return a book
  returnBook: async (bookId: string): Promise<Book> => {
    await delay(800) // Simulate network delay

    // Find the book
    const bookIndex = books.findIndex((b) => b.id === bookId)
    if (bookIndex === -1) {
      throw new Error("Book not found")
    }

    // Update book availability
    books[bookIndex] = {
      ...books[bookIndex],
      isAvailable: true,
    }

    return books[bookIndex]
  },
}
