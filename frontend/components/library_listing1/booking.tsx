'use client'

import { useState } from 'react'
import { Check } from 'lucide-react'

interface BookingProps {
  selectedStep: number;
}

export default function Booking({ selectedStep }: BookingProps) {
  const [selectedSeat, setSelectedSeat] = useState("A5");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedFloor, setSelectedFloor] = useState("Main Floor");
  const [selectedIdType, setSelectedIdType] = useState("");

  return (
    <div className="w-full lg:w-1/3 bg-white p-6 rounded-lg shadow-md h-fit sticky top-6">
      <h3 className="text-xl font-bold text-gray-800 mb-6 pb-4 border-b border-gray-200">Booking Summary</h3>

      <div className="space-y-6">
        <div>
          <h4 className="font-semibold text-gray-700">Central Library</h4>
          <p>9:00 AM - 10:00 AM</p>
          <p className="text-gray-600">Monday, April 28, 2025</p>
          <p className="text-gray-600">Afternoon (1:00 PM - 4:00 PM)</p>
          <div className="mt-2 inline-flex items-center rounded-full bg-amber-100 px-2.5 py-0.5 text-sm font-medium text-amber-800">
            Seat #{selectedSeat}
          </div>
        </div>

        <div className="py-4 border-t border-b border-gray-200">
          <div className="space-y-2">
            <div className="flex justify-between">
              <p className="text-gray-600">Seat Reservation Fee</p>
              <p className="font-medium">Rs 200.00</p>
            </div>
            <div className="flex justify-between">
              <p className="text-gray-600">Facility Usage</p>
              <p className="font-medium">Rs 100.00</p>
            </div>
            <div className="flex justify-between">
              <p className="text-gray-600">Service Fee</p>
              <p className="font-medium">Rs 18.00</p>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center font-bold text-lg">
          <p>Total</p>
          <p>Rs 318.00</p>
        </div>

        {selectedStep === 3 && (
          <button className="w-full py-3 bg-amber-700 text-white rounded-md hover:bg-amber-800 font-medium">
            Pay Rs 318.00
          </button>
        )}

        <div className="mt-6 space-y-4 text-sm text-gray-500">
          <div className="flex items-center justify-center">
            {/* <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" /> */}
            <p>Secure Booking Guaranteed</p>
          </div>
          <div className="flex items-center justify-center">
            {/* <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" /> */}
            <p>By proceeding, you agree to our <span className='text-blue-800'>Terms of Service and Cancellation Policy</span></p>
          </div>
        </div>
      </div>
    </div>
  )
}
