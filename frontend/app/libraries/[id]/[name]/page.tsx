'use client';

import { useState } from 'react';
import Image from 'next/image';

import Booking from '@/components/library_listing1/booking';
import Tracking from '@/components/library_listing1/tracking';

export default function Page() {
  const [selectedStep, setSelectedStep] = useState(1);

  return (


    <div className="min-h-screen max-w-[1920px] lg:overflow-x-auto  bg-[#ECE3DA] max-w-full lg:overflow-x-auto ">
     
      <div className="max-w-6xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <h2 className="text-center font-urbanist font-semibold text-black mb-6 text-[24px] sm:text-[36px] md:text-[40px] lg:text-[45px] leading-[36px] sm:leading-[44px] md:leading-[48px] lg:leading-[53.18px] tracking-[0.2px]">
          Book Your Seats Now
        </h2>

        <Tracking />

        <div className="flex flex-col sm:flex-row lg:flex-row  gap-4 sm:gap-6 md:gap-8 sm:mt-5 md:mt-7 lg:mt-9">
          {/* Left Section */}
          <div className="w-full  lg:w-[70%] bg-white p-4 rounded-lg shadow-md">
            <div className="mb-4">
              <h1 className="text-xl lg:text-2xl font-bold text-gray-800">Central Library - Main Floor</h1>
              <p className="text-gray-600">Select your preferred seat from the map below</p>
            </div>

            <div className="mb-6">
              <Image
                src="/listings2/library.png"
                width={1200}
                height={400}
                alt="Library Map"
                className="w-full rounded-md object-cover"
              />
            </div>

            <h2 className="text-lg font-semibold mb-4">Booking Details</h2>
            <div className="flex flex-col gap-4">
              {/* Date */}
              <div className="flex flex-col">
                <label className="mb-1 font-medium text-gray-700">Select a Date</label>
                <input
                  type="date"
                  className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              {/* Time Slot */}
              <div className="flex flex-col">
                <label className="mb-1 font-medium text-gray-700">Select a Time Slot</label>
                <select className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500">
                  <option>9:00 AM - 10:00 AM</option>
                  <option>10:00 AM - 11:00 AM</option>
                  <option>11:00 AM - 12:00 PM</option>
                  <option>1:00 PM - 2:00 PM</option>
                  <option>2:00 PM - 3:00 PM</option>
                  <option>3:00 PM - 4:00 PM</option>
                </select>
              </div>

              {/* Floor */}
              <div className="flex flex-col">
                <label className="mb-1 font-medium text-gray-700">Select Floor</label>
                <select className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500">
                  <option>Main Floor - Reading Area</option>
                  <option>Second Floor - Group Discussion Rooms</option>
                  <option>Third Floor - Research Zone</option>
                </select>
              </div>

              {/* Seat */}
              <div className="flex flex-col">
                <label className="mb-1 font-medium text-gray-700">Select Seat</label>
                <select className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500">
                  <option>A1</option>
                  <option>A2</option>
                  <option>A3</option>
                  <option>B1</option>
                  <option>B2</option>
                  <option>B3</option>
                </select>
              </div>

              {/* ID Type
              <div className="flex flex-col sm:col-span-2">
                <label className="mb-1 font-medium text-gray-700">Government ID Proof</label>
                <select className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500">
                  <option>Select ID type</option>
                  <option>Aadhaar Card</option>
                  <option>Voter ID</option>
                  <option>Passport</option>
                  <option>Driving License</option>
                </select>
              </div> */}

              {/* Upload Section */}
              {/* <div className="bg-[#F5F5F5] p-6 rounded-lg flex flex-col items-center justify-center border-2 border-dashed border-gray-300 text-center sm:col-span-2">
                <Image src="/listings2/browse.png" alt="Upload Icon" width={48} height={48} className="mb-4" />
                <h2 className="text-gray-800 font-semibold mb-2">
                  Drag & drop files or <button type="button" className="text-amber-600 underline">Browse</button>
                </h2>
                <p className="text-sm text-gray-600">
                  Supported formats: JPEG, PNG, GIF, MP4, PDF, PSD, AI, Word, PPT
                </p>
              </div> */}
            </div>
          </div>

          {/* Right Section */}
          <Booking selectedStep={selectedStep} />
        </div>
      </div>

    
    </div>
  );
}