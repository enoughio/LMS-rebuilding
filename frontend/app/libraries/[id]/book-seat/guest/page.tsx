// "use client"

// import { useState, useEffect } from "react"
// import { useParams, useRouter, useSearchParams } from "next/navigation"
// import Link from "next/link"
// import { ArrowLeft, Armchair, CreditCard, Loader2, Download, CheckCircle, User } from "lucide-react"
// import toast from 'react-hot-toast'

// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
// import { Separator } from "@/components/ui/separator"
// import { Badge } from "@/components/ui/badge"
// import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

// // Interface for seat data from API
// interface SeatData {
//   id: string
//   name: string
//   position: unknown
//   isAvailable: boolean
//   isActive: boolean
//   seatTypeId: string
//   libraryId: string
//   seatType: {
//     id: string
//     name: string
//     pricePerHour: number
//     description: string
//     color: string
//     amenities: string[]
//     isActive: boolean
//     libraryId: string
//   }
//   bookings: unknown[]
// }

// // Interface for availability API response
// interface AvailabilitySeat {
//   seatId: string
//   name: string
//   seatType: {
//     id: string
//     name: string
//     pricePerHour: number
//     description: string
//     color: string
//     amenities: string[]
//   }
//   isAvailable: boolean
//   isActive: boolean
//   bookedSlots: {
//     bookingId: string
//     startTime: string
//     endTime: string
//     status: string
//   }[]
//   totalBookings: number
// }

// interface LibraryData {
//   id: string
//   name: string
//   address: string
//   description: string
//   email: string
//   phone: string
// }

// export default function GuestBookingSeatPage() {
//   const { id } = useParams()
//   const searchParams = useSearchParams()
//   const seatTypeId = searchParams.get("seatType")


//   const [library, setLibrary] = useState<LibraryData | null>(null)
//   const [allSeats, setAllSeats] = useState<SeatData[]>([])
//   const [filteredSeats, setFilteredSeats] = useState<SeatData[]>([])
//   const [selectedSeat, setSelectedSeat] = useState<string | null>(null)
//   const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0])
//   const [selectedTime, setSelectedTime] = useState<string>('09:00')
//   const [duration, setDuration] = useState<number>(1)
//   const [loading, setLoading] = useState(true)
//   const [loadingAvailability, setLoadingAvailability] = useState(false)
//   const [bookingInProgress, setBookingInProgress] = useState(false)
//   const [error, setError] = useState<string | null>(null)

//   // Guest information
//   const [guestName, setGuestName] = useState<string>('')
//   const [guestEmail, setGuestEmail] = useState<string>('')
//   const [guestPhone, setGuestPhone] = useState<string>('')

//   // Fetch initial library and seats data
//   useEffect(() => {
//     const fetchLibraryAndSeats = async () => {
//       if (!id) return

//       setLoading(true)
//       setError(null)
      
//       try {
//         // Fetch library details
//         const libraryResponse = await fetch(`/api/libraries`)
//         const libraryResult = await libraryResponse.json()
        
//         if (!libraryResult.success) {
//           throw new Error(libraryResult.message || 'Failed to fetch library data')
//         }

//         const libraryData = libraryResult.data.find((lib: any) => lib.id === id)
//         if (!libraryData) {
//           throw new Error('Library not found')
//         }
//         setLibrary(libraryData)

//         // Fetch seats data
//         const seatsResponse = await fetch(`/api/seats/library/${id}`)
//         const seatsResult = await seatsResponse.json()
        
//         if (!seatsResult.success) {
//           throw new Error(seatsResult.message || 'Failed to fetch seats data')
//         }

//         setAllSeats(seatsResult.data)

//         // Filter seats by seat type if specified
//         const filtered = seatTypeId 
//           ? seatsResult.data.filter((seat: SeatData) => seat.seatTypeId === seatTypeId)
//           : seatsResult.data

//         setFilteredSeats(filtered)

//       } catch (error) {
//         console.error("Error fetching data:", error)
//         const errorMessage = error instanceof Error ? error.message : 'Failed to load seat selection data'
//         setError(errorMessage)
//         toast.error(errorMessage, { duration: 3000 })
//       } finally {
//         setLoading(false)
//       }
//     }

//     fetchLibraryAndSeats()
//   }, [id, seatTypeId])

//   // Effect to check availability when date changes
//   useEffect(() => {
//     const checkSeatAvailability = async (date: string) => {
//       if (!id) return

//       setLoadingAvailability(true)
      
//       try {
//         const params = new URLSearchParams({ date })
//         if (seatTypeId) params.append('seatType', seatTypeId)

//         const response = await fetch(`/api/seats/library/${id}/availability?${params.toString()}`)
//         const result = await response.json()

//         if (!result.success) {
//           throw new Error(result.message || 'Failed to check seat availability')
//         }

//         // Update filtered seats with availability info
//         const availabilityData = result.data.availability as AvailabilitySeat[]
//         const updatedSeats = filteredSeats.map(seat => {
//           const availInfo = availabilityData.find(avail => avail.seatId === seat.id)
//           return {
//             ...seat,
//             isAvailable: availInfo?.isAvailable ?? seat.isAvailable
//           }
//         })

//         setFilteredSeats(updatedSeats)

//         // Clear selection if currently selected seat is no longer available
//         if (selectedSeat) {
//           const selectedSeatInfo = updatedSeats.find(s => s.id === selectedSeat)
//           if (!selectedSeatInfo?.isAvailable) {
//             setSelectedSeat(null)
//           }
//         }

//       } catch (error) {
//         console.error("Error checking seat availability:", error)
//         toast.error('Failed to check seat availability', { duration: 2000 })
//       } finally {
//         setLoadingAvailability(false)
//       }
//     }

//     if (selectedDate && allSeats.length > 0) {
//       checkSeatAvailability(selectedDate)
//     }
//   }, [selectedDate, allSeats, seatTypeId, id, selectedSeat])

//   const handleDateChange = (date: string) => {
//     setSelectedDate(date)
//     setSelectedSeat(null) // Clear selection when date changes
//   }

//   const [bookingResult, setBookingResult] = useState<any>(null)
//   const [showBillDownload, setShowBillDownload] = useState(false)

//   const handleBookSeat = async () => {
//     if (!selectedSeat) {
//       toast.error('Please select a seat to continue', { duration: 2000 })
//       return
//     }

//     if (!guestName || !guestEmail || !guestPhone) {
//       toast.error('Please fill in all guest information fields', { duration: 2000 })
//       return
//     }

//     setBookingInProgress(true)

//     try {
//       const selectedSeatData = filteredSeats.find(s => s.id === selectedSeat)
//       if (!selectedSeatData) {
//         throw new Error('Selected seat not found')
//       }

//       // Calculate end time based on start time and duration
//       const startHour = parseInt(selectedTime.split(':')[0])
//       const startMinute = parseInt(selectedTime.split(':')[1])
//       const endHour = startHour + duration
//       const endMinute = startMinute
//       const endTime = `${endHour.toString().padStart(2, '0')}:${endMinute.toString().padStart(2, '0')}`

//       const bookingData = {
//         seatId: selectedSeat,
//         date: selectedDate,
//         startTime: selectedTime,
//         endTime: endTime,
//         duration: duration,
//         paymentMethod: 'OFFLINE',
//         guestBooking: {
//           name: guestName,
//           email: guestEmail,
//           phone: guestPhone
//         }
//       }

//       const response = await fetch(`/api/seats/library/${id}/book-guest`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify(bookingData)
//       })

//       const result = await response.json()

//       if (!response.ok) {
//         throw new Error(result.error || 'Failed to book seat')
//       }

//       if (!result.success) {
//         throw new Error(result.error || 'Booking failed')
//       }

//       setBookingResult(result.data)
//       setShowBillDownload(true)
//       toast.success(`Your ${selectedSeatData.seatType.name} seat has been booked successfully!`, { duration: 3000 })

//       // Update seat availability immediately
//       const updatedSeats = filteredSeats.map(seat => 
//         seat.id === selectedSeat ? { ...seat, isAvailable: false } : seat
//       )
//       setFilteredSeats(updatedSeats)
//       setSelectedSeat(null)

//     } catch (error) {
//       console.error("Error booking seat:", error)
//       const errorMessage = error instanceof Error ? error.message : 'There was an error booking your seat. Please try again.'
//       toast.error(errorMessage, { duration: 3000 })
//     } finally {
//       setBookingInProgress(false)
//     }
//   }

//   const handleDownloadBill = async () => {
//     if (!bookingResult?.booking?.id) {
//       toast.error('Booking information not available', { duration: 2000 })
//       return
//     }

//     try {
//       const response = await fetch(`/api/seats/download-bill/${bookingResult.booking.id}`, {
//         method: 'GET'
//       })

//       if (!response.ok) {
//         throw new Error('Failed to download bill')
//       }

//       // Create blob and download
//       const blob = await response.blob()
//       const url = window.URL.createObjectURL(blob)
//       const a = document.createElement('a')
//       a.href = url
//       a.download = `booking_bill_${bookingResult.booking.id}.pdf`
//       document.body.appendChild(a)
//       a.click()
//       window.URL.revokeObjectURL(url)
//       document.body.removeChild(a)

//       toast.success('Bill downloaded successfully!', { duration: 2000 })
//     } catch (error) {
//       console.error("Error downloading bill:", error)
//       toast.error('Failed to download bill. Please try again.', { duration: 2000 })
//     }
//   }

//   if (loading) {
//     return (
//       <div className="flex min-h-screen flex-col">
//         <div className="container flex flex-1 items-center justify-center py-12">
//           <div className="flex flex-col items-center gap-2">
//             <Loader2 className="h-8 w-8 animate-spin text-primary" />
//             <p className="text-lg font-medium">Loading seat selection...</p>
//           </div>
//         </div>
//       </div>
//     )
//   }

//   if (error || !library) {
//     return (
//       <div className="flex min-h-screen flex-col">
//         <div className="container flex flex-1 items-center justify-center py-12">
//           <Card className="w-full max-w-md">
//             <CardHeader>
//               <CardTitle className="text-center text-red-600">Error</CardTitle>
//             </CardHeader>
//             <CardContent className="text-center">
//               <p className="text-muted-foreground mb-4">
//                 {error || 'Library not found'}
//               </p>
//               <Button asChild variant="outline">
//                 <Link href="/libraries">Back to Libraries</Link>
//               </Button>
//             </CardContent>
//           </Card>
//         </div>
//       </div>
//     )
//   }

//   // Get seat type info from the first filtered seat (they all have same seat type)
//   const selectedSeatType = filteredSeats.length > 0 ? filteredSeats[0].seatType : null
//   const totalPrice = selectedSeatType ? selectedSeatType.pricePerHour * duration : 0

//   return (
//     <div className="flex min-h-screen flex-col md:pb-30">
//       {/* Header */}
//       <div className="border-b bg-white sticky top-0 z-10">
//         <div className="container flex h-16 items-center gap-4">
//           <Button variant="ghost" size="sm" asChild>
//             <Link href={`/libraries/${id}`}>
//               <ArrowLeft className="h-4 w-4 mr-2" />
//               Back to Library
//             </Link>
//           </Button>
//           <Separator orientation="vertical" className="h-6" />
//           <div className="flex items-center gap-2">
//             <User className="h-5 w-5 text-primary" />
//             <div>
//               <h1 className="font-semibold">Guest Booking</h1>
//               <p className="text-sm text-muted-foreground">{library.name}</p>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="container flex-1 py-6">
//         <div className="grid gap-6 lg:grid-cols-3">
//           {/* Guest Information */}
//           <Card className="lg:col-span-1">
//             <CardHeader>
//               <CardTitle className="flex items-center gap-2">
//                 <User className="h-5 w-5" />
//                 Guest Information
//               </CardTitle>
//               <CardDescription>
//                 Please provide your contact information for the booking
//               </CardDescription>
//             </CardHeader>
//             <CardContent className="space-y-4">
//               <div className="space-y-2">
//                 <Label htmlFor="guest-name">Full Name *</Label>
//                 <Input
//                   id="guest-name"
//                   placeholder="Enter your full name"
//                   value={guestName}
//                   onChange={(e) => setGuestName(e.target.value)}
//                 />
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="guest-email">Email Address *</Label>
//                 <Input
//                   id="guest-email"
//                   type="email"
//                   placeholder="Enter your email address"
//                   value={guestEmail}
//                   onChange={(e) => setGuestEmail(e.target.value)}
//                 />
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="guest-phone">Phone Number *</Label>
//                 <Input
//                   id="guest-phone"
//                   type="tel"
//                   placeholder="Enter your phone number"
//                   value={guestPhone}
//                   onChange={(e) => setGuestPhone(e.target.value)}
//                 />
//               </div>
//             </CardContent>
//           </Card>

//           {/* Seat Selection */}
//           <Card className="lg:col-span-2">
//             <CardHeader>
//               <CardTitle className="flex items-center gap-2">
//                 <Armchair className="h-5 w-5" />
//                 Available Seats
//                 {selectedSeatType && (
//                   <Badge variant="secondary">
//                     {selectedSeatType.name} - ₹{selectedSeatType.pricePerHour}/hour
//                   </Badge>
//                 )}
//               </CardTitle>
//               <CardDescription>
//                 Select your preferred seat and time slot
//               </CardDescription>
//             </CardHeader>
//             <CardContent className="space-y-6">
//               {/* Date and Time Selection */}
//               <div className="grid gap-4 md:grid-cols-3">
//                 <div className="space-y-2">
//                   <Label htmlFor="date">Date</Label>
//                   <Input
//                     id="date"
//                     type="date"
//                     value={selectedDate}
//                     min={new Date().toISOString().split('T')[0]}
//                     onChange={(e) => handleDateChange(e.target.value)}
//                   />
//                 </div>
//                 <div className="space-y-2">
//                   <Label htmlFor="time">Start Time</Label>
//                   <Input
//                     id="time"
//                     type="time"
//                     value={selectedTime}
//                     onChange={(e) => setSelectedTime(e.target.value)}
//                   />
//                 </div>
//                 <div className="space-y-2">
//                   <Label htmlFor="duration">Duration (hours)</Label>
//                   <RadioGroup
//                     value={duration.toString()}
//                     onValueChange={(value) => setDuration(parseInt(value))}
//                   >
//                     <div className="flex items-center space-x-2">
//                       <RadioGroupItem value="1" id="1h" />
//                       <Label htmlFor="1h">1 hour</Label>
//                     </div>
//                     <div className="flex items-center space-x-2">
//                       <RadioGroupItem value="2" id="2h" />
//                       <Label htmlFor="2h">2 hours</Label>
//                     </div>
//                     <div className="flex items-center space-x-2">
//                       <RadioGroupItem value="4" id="4h" />
//                       <Label htmlFor="4h">4 hours</Label>
//                     </div>
//                     <div className="flex items-center space-x-2">
//                       <RadioGroupItem value="8" id="8h" />
//                       <Label htmlFor="8h">8 hours</Label>
//                     </div>
//                   </RadioGroup>
//                 </div>
//               </div>

//               <Separator />

//               {/* Seat Grid */}
//               {loadingAvailability ? (
//                 <div className="flex items-center justify-center py-8">
//                   <Loader2 className="h-6 w-6 animate-spin" />
//                   <span className="ml-2">Checking availability...</span>
//                 </div>
//               ) : (
//                 <div className="grid gap-3 md:grid-cols-4 lg:grid-cols-6">
//                   {filteredSeats.map((seat) => (
//                     <Button
//                       key={seat.id}
//                       variant={selectedSeat === seat.id ? "default" : "outline"}
//                       size="sm"
//                       disabled={!seat.isAvailable}
//                       onClick={() => setSelectedSeat(seat.id)}
//                       className={`h-12 ${
//                         !seat.isAvailable 
//                           ? 'opacity-50 cursor-not-allowed' 
//                           : selectedSeat === seat.id
//                           ? 'bg-primary text-primary-foreground'
//                           : 'hover:bg-accent'
//                       }`}
//                     >
//                       <div className="text-center">
//                         <div className="text-xs font-medium">{seat.name}</div>
//                         <div className="text-xs opacity-75">
//                           {seat.isAvailable ? 'Available' : 'Booked'}
//                         </div>
//                       </div>
//                     </Button>
//                   ))}
//                 </div>
//               )}

//               {filteredSeats.length === 0 && !loadingAvailability && (
//                 <div className="text-center py-8 text-muted-foreground">
//                   No seats available for the selected criteria
//                 </div>
//               )}
//             </CardContent>
//           </Card>
//         </div>

//         {/* Booking Summary */}
//         {selectedSeat && selectedSeatType && (
//           <Card className="mt-6">
//             <CardHeader>
//               <CardTitle className="flex items-center gap-2">
//                 <CreditCard className="h-5 w-5" />
//                 Booking Summary
//               </CardTitle>
//             </CardHeader>
//             <CardContent>
//               <div className="grid gap-4 md:grid-cols-2">
//                 <div className="space-y-2">
//                   <div className="flex justify-between">
//                     <span className="text-muted-foreground">Seat:</span>
//                     <span className="font-medium">
//                       {filteredSeats.find(s => s.id === selectedSeat)?.name}
//                     </span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span className="text-muted-foreground">Type:</span>
//                     <span className="font-medium">{selectedSeatType.name}</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span className="text-muted-foreground">Date:</span>
//                     <span className="font-medium">{selectedDate}</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span className="text-muted-foreground">Time:</span>
//                     <span className="font-medium">
//                       {selectedTime} - {`${(parseInt(selectedTime.split(':')[0]) + duration).toString().padStart(2, '0')}:${selectedTime.split(':')[1]}`}
//                     </span>
//                   </div>
//                 </div>
//                 <div className="space-y-2">
//                   <div className="flex justify-between">
//                     <span className="text-muted-foreground">Duration:</span>
//                     <span className="font-medium">{duration} hour{duration > 1 ? 's' : ''}</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span className="text-muted-foreground">Rate:</span>
//                     <span className="font-medium">₹{selectedSeatType.pricePerHour}/hour</span>
//                   </div>
//                   <Separator />
//                   <div className="flex justify-between text-lg font-semibold">
//                     <span>Total:</span>
//                     <span>₹{totalPrice}</span>
//                   </div>
//                 </div>
//               </div>
//             </CardContent>
//             <CardFooter>
//               <Button 
//                 onClick={handleBookSeat} 
//                 disabled={bookingInProgress || !guestName || !guestEmail || !guestPhone}
//                 className="w-full"
//                 size="lg"
//               >
//                 {bookingInProgress ? (
//                   <>
//                     <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                     Processing Booking...
//                   </>
//                 ) : (
//                   `Pay ₹${totalPrice} & Book Seat`
//                 )}
//               </Button>
//             </CardFooter>
//           </Card>
//         )}
//       </div>

//       {/* Success Dialog */}
//       <Dialog open={showBillDownload} onOpenChange={setShowBillDownload}>
//         <DialogContent className="sm:max-w-md">
//           <DialogHeader>
//             <DialogTitle className="flex items-center gap-2">
//               <CheckCircle className="h-5 w-5 text-green-600" />
//               Booking Confirmed!
//             </DialogTitle>
//             <DialogDescription>
//               Your seat has been successfully booked. You can download your booking bill below.
//             </DialogDescription>
//           </DialogHeader>
          
//           {bookingResult && (
//             <div className="space-y-2 py-4">
//               <div className="flex justify-between">
//                 <span className="text-muted-foreground">Booking ID:</span>
//                 <span className="font-medium">{bookingResult.booking.id}</span>
//               </div>
//               <div className="flex justify-between">
//                 <span className="text-muted-foreground">Amount Paid:</span>
//                 <span className="font-medium">₹{bookingResult.payment.amount}</span>
//               </div>
//             </div>
//           )}

//           <DialogFooter className="flex-col gap-2 sm:flex-row">
//             <Button variant="outline" onClick={() => setShowBillDownload(false)}>
//               Close
//             </Button>
//             <Button onClick={handleDownloadBill} className="gap-2">
//               <Download className="h-4 w-4" />
//               Download Bill
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//     </div>
//   )
// }


import React from 'react'

const page = () => {
  return (
    <div>you are guest</div>
  )
}

export default page