import React from 'react';

export default function SeatBooking() {
  return (
    <div className="min-h-screen bg-[#f5ebe1] py-10 px-4 sm:px-8 w-full">
      <h1 className="text-2xl sm:text-3xl font-semibold text-center mb-10">Book your seats now</h1>

      {/* Progress Indicator */}
      <div className="flex justify-center items-center gap-6 mb-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 flex items-center justify-center rounded-full bg-black text-white font-bold">1</div>
          <span className="font-semibold">Book a slot</span>
        </div>
        <div className="h-1 w-8 bg-gray-300" />
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 flex items-center justify-center rounded-full border border-black text-black font-bold">2</div>
          <span className="text-gray-600">Payment</span>
        </div>
        <div className="h-1 w-8 bg-gray-300" />
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 flex items-center justify-center rounded-full border border-black text-black font-bold">3</div>
          <span className="text-gray-600">Confirmation</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {/* Booking Form */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow">
          <h2 className="text-lg font-semibold mb-4">Central library - Main Floor</h2>
          <p className="text-sm mb-2 text-gray-600">Select your preferred seat from the map below</p>

          <div className="w-full h-48 mb-6 rounded-lg overflow-hidden border-[3px] border-blue-500">
            <img
              src="https://images.unsplash.com/photo-1535905748047-14b1f7d9f7e5"
              alt="Library seat map"
              className="object-cover w-full h-full"
            />
          </div>

          <h3 className="text-md font-semibold mb-3">Booking Details</h3>

          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Select a date</label>
              <input
                type="date"
                className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Select a time slot</label>
              <select className="w-full border px-3 py-2 rounded-md">
                <option>9:00 am - 1:00 am</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Select Floor</label>
              <select className="w-full border px-3 py-2 rounded-md">
                <option>Second Floor – Group Discussion Rooms</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Select Seat</label>
              <select className="w-full border px-3 py-2 rounded-md">
                <option>C5</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Government ID proof</label>
              <select className="w-full border px-3 py-2 rounded-md">
                <option>Select ID type</option>
              </select>
            </div>

            <div className="border border-dashed border-gray-400 rounded-lg p-6 text-center text-sm text-gray-500">
              <p className="mb-2">Drag & drop files or <span className="text-blue-600 cursor-pointer">Browse</span></p>
              <p className="text-xs">Supported formats: JPG, PNG, PDF, DOC, DOCX, XLS, XLSX, PPT</p>
            </div>
          </form>
        </div>

        {/* Booking Summary */}
        <div className="bg-white p-6 rounded-xl shadow h-fit">
          <h2 className="text-lg font-semibold mb-4">Booking Summary</h2>
          <div className="text-sm space-y-3 mb-4">
            <div>
              <strong>Central Library - Main Floor</strong>
              <div>9:00 AM – 10:00 AM</div>
            </div>
            <div>
              <strong>Monday April 8, 2025</strong>
              <div>9:00 AM – 10:00 AM</div>
            </div>
            <div>
              <strong>Seat #10</strong>
              <div>9:00 AM – 10:00 AM</div>
            </div>
          </div>

          <div className="border-t pt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Seat A5 (4 hrs)</span>
              <span>Rs 400.00</span>
            </div>
            <div className="flex justify-between">
              <span>Duration</span>
              <span>Rs 100.00</span>
            </div>
            <div className="flex justify-between">
              <span>Seat A5</span>
              <span>Rs 33.00</span>
            </div>
            <div className="flex justify-between">
              <span>GST(%)</span>
              <span>Rs 48.00</span>
            </div>

            <div className="flex justify-between font-semibold pt-2 border-t">
              <span>Total</span>
              <span>Rs 318.00</span>
            </div>
          </div>

          <button className="w-full mt-6 bg-black text-white py-2 rounded-full font-semibold hover:bg-gray-900">
            Confirm and Pay
          </button>

          <p className="text-[10px] text-center mt-3 text-gray-600">
            Secure Booking Guaranteed. Library Policies<br />
            By proceeding, you agree to our <span className="text-blue-600">Terms of Service</span> and <span className="text-blue-600">Cancellation Policy</span>
          </p>
        </div>
      </div>
    </div>
  );
}
