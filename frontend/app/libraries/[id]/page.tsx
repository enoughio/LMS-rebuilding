"use client";
import React from "react";
import { FaStar, FaRegHeart } from "react-icons/fa";
import { BsPersonBadge } from "react-icons/bs";
import {
  MdAccessTime,
  MdCancel,
  MdLocationOn,
  MdNoFood,
  MdPhoneDisabled,
  MdVolumeOff,
  MdOutlineLocalOffer,
} from "react-icons/md";
import {
  FaWifi,
  FaCoffee,
  FaParking,
  FaBook,
  FaLaptop,
  FaLock,
} from "react-icons/fa";
import Link from "next/link";

// Header with responsive overlay and info bar
function LibraryHeader() {
  return (
    <div className="relative rounded-2xl shadow bg-white mb-6">
      {/* Banner Image */}
      <img
        src="/libraries/libraries2.jpg"
        alt="Library"
        className="w-full h-44 sm:h-64 object-cover"
      />
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
      {/* Content */}
      <div className="absolute left-0 top-0 w-full h-full flex flex-col justify-end p-4 sm:p-6">
        {/* Top badges */}
        <div className="flex gap-2 mb-2">
          <span className="bg-white/80 text-gray-800 text-xs px-3 py-1 rounded-full font-medium">
            Open Now
          </span>
          <span className="bg-blue-100 text-blue-700 text-xs px-3 py-1 rounded-full font-medium">
            Public Library
          </span>
        </div>
        {/* Title and Info */}
        <div>
          <h1 className="text-xl sm:text-3xl font-bold text-white mb-1">
            Study Hub
          </h1>
          <div className="flex items-center justify-between text-white flex-wrap">
            <div className="flex items-center gap-2 text-white text-sm mb-1">
              <FaStar className="text-yellow-400" />
              <span>4.7</span>
              <span className="text-gray-200">(128 reviews)</span>
              <span className="mx-2 hidden sm:inline">•</span>
              <span className="hidden sm:inline">100+ Daily Visitors</span>
            </div>
            <button className="ml-2 bg-white/80 rounded-full p-2 shadow border border-gray-200">
              <FaRegHeart className="text-gray-700" />
            </button>
          </div>
        </div>
      </div>
      {/* Info pills and Book button */}
      <div className="hidden md:flex flex-wrap items-center gap-2 mt-3 w-[98%] sm:w-[90%] absolute -bottom-[30px] left-1/2 py-2 px-2 sm:px-4 bg-white rounded-full shadow transform -translate-x-1/2">
        <span className="bg-white/80 text-gray-800 text-xs px-3 py-1 rounded-full font-medium">
          University, district
        </span>
        <span className="bg-white/80 text-gray-800 text-xs px-3 py-1 rounded-full font-medium flex items-center gap-1">
          <MdAccessTime className="inline-block" /> 8:00 am to 10:00 pm
        </span>
        <span className="bg-white/80 text-gray-800 text-xs px-3 py-1 rounded-full font-medium">
          Free entry
        </span>
        <span className="bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full font-medium">
          Seats Available
        </span>
        <Link
  href={`/seatBooking/2`}
  className="ml-auto px-4 sm:px-6 py-2 rounded-full bg-black text-white font-semibold shadow hover:bg-gray-900 text-xs sm:text-base"
>
  Book now
</Link>
      </div>
      {/* Info section - Location, Time, Entry, Status */}
      <div className="absolute flex md:hidden left-1/2 top-[100%] w-full bg-[#F8F8F8] rounded-3xl shadow-2xl px-5 py-6 sm:px-8 sm:py-8 flex-col gap-5 transform -translate-x-1/2 z-20">
        {/* Location */}
        <div className="flex items-start gap-3">
          <MdLocationOn className="text-2xl sm:text-3xl mt-1 text-gray-800" />
          <div>
            <div className="text-lg sm:text-2xl font-medium text-gray-900">
              University , district
            </div>
            <div className="text-sm sm:text-base text-gray-400">2 km away</div>
          </div>
        </div>
        {/* Time */}
        <div className="flex items-start gap-3">
          <MdAccessTime className="text-2xl sm:text-3xl mt-1 text-gray-800" />
          <div>
            <div className="text-lg sm:text-2xl font-medium text-gray-900">
              8:00 am to 9:00 pm
            </div>
            <div className="text-sm sm:text-base text-gray-400">
              Closes in 5 hours
            </div>
          </div>
        </div>
        {/* Entry */}
        <div className="flex items-start gap-3">
          <MdOutlineLocalOffer className="text-2xl sm:text-3xl mt-1 text-gray-800" />
          <div>
            <div className="text-lg sm:text-2xl font-medium text-gray-900">
              Free entry
            </div>
            <div className="text-sm sm:text-base text-gray-400">
              Membership available
            </div>
          </div>
        </div>
        {/* Status and Book button */}
        <div className="flex items-center justify-between mt-2 gap-2 flex-wrap">
          <span className="flex items-center gap-2 text-green-600 font-bold text-base sm:text-lg">
            <span className="inline-block w-3 h-3 rounded-full bg-green-500"></span>
            Seats Available
          </span>
         <Link
  href={`/seatBooking/2`}
  className="ml-auto px-4 sm:px-6 py-2 rounded-full bg-black text-white font-semibold shadow hover:bg-gray-900 text-xs sm:text-base"
>
  Book now
</Link>
        </div>
      </div>
    </div>
  );
}

export default function LibraryDetails() {
  const library = {
    name: "Study Hub",
    location: "University, district",
    openTime: "8:00 am to 10:00 pm",
    entry: "Free entry",
    status: "Seats available",
    rating: 4.7,
    reviews: 128,
    features: [
      { icon: <FaWifi />, label: "Wifi" },
      { icon: <FaCoffee />, label: "Cafe" },
      { icon: <MdAccessTime />, label: "24x7 open" },
      { icon: <FaParking />, label: "Parking" },
      { icon: <FaBook />, label: "Books" },
      { icon: <FaLaptop />, label: "Internet-ready" },
      { icon: <FaLock />, label: "Locker rooms" },
    ],
    gallery: [
      "/libraries/gallery1.jpg",
      "/libraries/gallery2.jpg",
      "/libraries/gallery3.jpg",
    ],
    rules: [
      {
        icon: <BsPersonBadge />,
        label: "ID Required",
        desc: "Bring valid student ID for entry.",
      },
      {
        icon: <MdNoFood />,
        label: "No Food",
        desc: "Food not allowed in library.",
      },
      {
        icon: <MdAccessTime />,
        label: "Time limit",
        desc: "3 hours max per session.",
      },
      {
        icon: <MdVolumeOff />,
        label: "Quiet",
        desc: "Maintain silence at all times.",
      },
      {
        icon: <MdPhoneDisabled />,
        label: "No phones",
        desc: "Phones on silent.",
      },
      {
        icon: <MdCancel />,
        label: "Cancellation",
        desc: "Cancel at least 1 hour before.",
      },
    ],
  };

  return (
    <div className="bg-[#ECE3DA] min-h-screen py-2 px-1 sm:py-6 sm:px-2 flex justify-center w-full">
      <div className="bg-white p-2 sm:p-5 my-2 sm:my-6 rounded-2xl w-full max-w-5xl">
        {/* Header */}
        <LibraryHeader />

        {/* Main Content */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 ">
          {/* Features & Gallery */}
          <div className="md:col-span-2 flex flex-col gap-4 sm:gap-6">
            {/* Features */}
            <div className="bg-white rounded-2xl p-4 sm:p-6 shadow">
              <h2 className="text-lg font-semibold mb-4">Library Features</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {library.features.map((f) => (
                  <div
                    key={f.label}
                    className="flex flex-col items-center gap-1 bg-gray-100 py-4 sm:py-5 rounded-lg"
                  >
                    <span className="text-2xl">{f.icon}</span>
                    <span className="text-sm text-gray-700">{f.label}</span>
                  </div>
                ))}
              </div>
            </div>
            {/* Gallery */}
            <div className="bg-white rounded-2xl p-4 sm:p-6 shadow">
              <h2 className="text-lg font-semibold mb-4">Gallery</h2>
              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                {library.gallery.map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    alt={`Gallery ${i + 1}`}
                    className="rounded-lg object-cover h-20 sm:h-28 w-full"
                  />
                ))}
                <div className="flex items-center justify-center bg-gray-100 rounded-lg h-20 sm:h-28 text-gray-500 font-semibold cursor-pointer">
                  View all
                </div>
              </div>
            </div>
            {/* Rules */}
            <div className="bg-white rounded-2xl p-4 sm:p-6 shadow">
              <h2 className="text-lg font-semibold mb-4">Library rules</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-4">
                {library.rules.map((rule) => (
                  <div key={rule.label} className="flex items-start gap-2">
                    <span className="text-xl">{rule.icon}</span>
                    <div>
                      <div className="font-medium text-sm">{rule.label}</div>
                      <div className="text-xs text-gray-500">{rule.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* Location & Ads */}
          <div className="flex flex-col gap-4 sm:gap-6">
            {/* Location */}
            <div className="bg-white rounded-2xl p-4 sm:p-6 shadow flex flex-col gap-2 sm:gap-4">
              <h2 className="text-lg font-semibold">Location</h2>
              <div className="rounded-lg overflow-hidden h-20 sm:h-24 w-full bg-gray-200">
                <img
                  src="/libraries/map.jpg"
                  alt="Map"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex items-center gap-2 text-gray-700 text-sm">
                <MdLocationOn className="text-lg" />
                {library.location}
              </div>
              <button className="w-full px-4 py-2 rounded-full bg-black text-white font-semibold mt-2">
                Get Direction
              </button>
            </div>
            {/* Ads */}
            <div className="bg-white rounded-2xl p-4 sm:p-6 shadow flex items-center justify-center min-h-[120px] sm:min-h-[180px]">
              <span className="text-gray-400">Ads</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

