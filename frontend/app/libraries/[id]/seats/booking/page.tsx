import React, { Suspense } from 'react'
import SeatBookingPage from './client'

const page = () => {
  return (
    <Suspense>
      <SeatBookingPage />
    </Suspense>
  )
}

export default page