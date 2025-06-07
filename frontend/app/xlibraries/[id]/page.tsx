"use client";
import React, { useState, useEffect, ReactNode } from "react";
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
import { useParams } from "next/navigation"; 
import Image from "next/image";

// Define the shape of the API response based on the Node.js controller
interface SeatType {
  type: string;
  price: number;
  currency: string;
  isHourly: boolean;
  availableSeats: number;
  totalSeats: number;
}

interface OpeningHour {
  id: string;
  dayOfWeek: number; // Changed from string to number
  openTime: string;
  closeTime: string;
  isClosed: boolean;
}

// interface MembershipPlan {
//   id: string;
//   name: string;
//   description: string;
//   price: number;
//   duration: string;
//   features: string[];
//   isActive: boolean;
// }

interface Library {
  id: string;
  name: string;
  description: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  email: string;
  phone: string;
  images: string[];
  rating: number;
  reviewCount: number;
  amenities: string[];
  totalSeats: number;
  status: string;
  isActive: boolean;
  openingHours: OpeningHour[];
  seatTypes: SeatType[];
  hasFreeMembership: boolean;
  hasPaidMembership: boolean;
  isOpen: boolean;
}

// Header component
function LibraryHeader({ library }: { library: Library }) {
  const getOpeningHoursText = () => {
    // Get current day as number (0=Sunday, 1=Monday, ..., 6=Saturday)
    const today = new Date().getDay();
    
    // Find today's opening hours
    const todayHours = library.openingHours?.find(
      (hour) => hour.dayOfWeek === today
    );
    
    if (!todayHours || todayHours.isClosed) {
      return "Closed Today";
    }
    
    return `${todayHours.openTime} to ${todayHours.closeTime}`;
  };

  // Helper function to check if library is currently open
  const isCurrentlyOpen = () => {
    const now = new Date();
    const currentDay = now.getDay();
    const currentTime = now.toTimeString().slice(0, 5); // HH:MM format
    
    // Find today's opening hours
    const todayHours = library.openingHours?.find(
      (hour) => hour.dayOfWeek === currentDay
    );
    
    if (!todayHours || todayHours.isClosed) {
      return false;
    }
    
    // Compare current time with opening hours
    return currentTime >= todayHours.openTime && currentTime <= todayHours.closeTime;
  };

  const getDistance = () => {
    // Placeholder: Implement logic to calculate distance if needed
    return "2 km away";
  };

  // Helper function to validate image URL
  const isValidImageUrl = (url: string) => {
    return url && (url.startsWith('/') || url.startsWith('http://') || url.startsWith('https://'));
  };

  // Get the first valid image
  const getValidImage = () => {
    if (!library.images || library.images.length === 0) return null;
    return library.images.find(img => isValidImageUrl(img)) || null;
  };

  const validImage = getValidImage();
  const libraryCurrentlyOpen = isCurrentlyOpen();

  return (
    <div className="relative rounded-2xl shadow bg-white mb-6">
      {/* Banner Image or Placeholder */}
      {validImage ? (
        <>
          <Image
            fill
            src={validImage}
            alt={library.name}
            className="w-full h-44 sm:h-64 object-cover rounded-t-2xl"
          />
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent rounded-t-2xl" />
        </>
      ) : (
        <div className="w-full h-44 sm:h-64 bg-gradient-to-br from-gray-200 to-gray-300 rounded-t-2xl flex items-center justify-center">
          <div className="text-center">
            <FaBook className="mx-auto text-4xl sm:text-6xl text-gray-400 mb-2" />
            <p className="text-gray-500 text-sm sm:text-base">No Image Available</p>
          </div>
        </div>
      )}
      
      {/* Content */}
      <div className={`${validImage ? 'absolute' : 'relative'} left-0 top-0 w-full h-full flex flex-col justify-end p-4 sm:p-6`}>
        {/* Top badges */}
        <div className="flex gap-2 mb-2">
          <span className={`${validImage ? 'bg-white/80 text-gray-800' : 'bg-gray-100 text-gray-800'} text-xs px-3 py-1 rounded-full font-medium`}>
            {libraryCurrentlyOpen ? "Open Now" : "Closed"}
          </span>
          <span className="bg-blue-100 text-blue-700 text-xs px-3 py-1 rounded-full font-medium">
            Public Library
          </span>
        </div>
        {/* Title and Info */}
        <div>
          <h1 className={`text-xl sm:text-3xl font-bold ${validImage ? 'text-white' : 'text-gray-900'} mb-1`}>
            {library.name}
          </h1>
          <div className={`flex items-center justify-between ${validImage ? 'text-white' : 'text-gray-700'} flex-wrap`}>
            <div className={`flex items-center gap-2 ${validImage ? 'text-white' : 'text-gray-700'} text-sm mb-1`}>
              <FaStar className="text-yellow-400" />
              <span>{library.rating?.toFixed(1) || '0.0'}</span>
              <span className={validImage ? 'text-gray-200' : 'text-gray-500'}>({library.reviewCount || 0} reviews)</span>
              <span className="mx-2 hidden sm:inline">•</span>
              <span className="hidden sm:inline">{library.totalSeats || 0}+ Seats</span>
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
          {library.city}, {library.state}
        </span>
        <span className="bg-white/80 text-gray-800 text-xs px-3 py-1 rounded-full font-medium flex items-center gap-1">
          <MdAccessTime className="inline-block" /> {getOpeningHoursText()}
        </span>
        <span className="bg-white/80 text-gray-800 text-xs px-3 py-1 rounded-full font-medium">
          {library.hasFreeMembership ? "Free entry" : "Membership required"}
        </span>
        <span className="bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full font-medium">
          {library.seatTypes?.some((seat) => seat.availableSeats > 0)
            ? "Seats Available"
            : "No Seats Available"}
        </span>
        <Link
          href={`/libraries/${library.id}/seatBooking`}
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
              {library.city}, {library.state}
            </div>
            <div className="text-sm sm:text-base text-gray-400">{getDistance()}</div>
          </div>
        </div>
        {/* Time */}
        <div className="flex items-start gap-3">
          <MdAccessTime className="text-2xl sm:text-3xl mt-1 text-gray-800" />
          <div>
            <div className="text-lg sm:text-2xl font-medium text-gray-900">
              {getOpeningHoursText()}
            </div>
            <div className="text-sm sm:text-base text-gray-400">
              {libraryCurrentlyOpen ? "Open now" : "Closed"}
            </div>
          </div>
        </div>
        {/* Entry */}
        <div className="flex items-start gap-3">
          <MdOutlineLocalOffer className="text-2xl sm:text-3xl mt-1 text-gray-800" />
          <div>
            <div className="text-lg sm:text-2xl font-medium text-gray-900">
              {library.hasFreeMembership ? "Free entry" : "Membership required"}
            </div>
            <div className="text-sm sm:text-base text-gray-400">
              {library.hasPaidMembership ? "Membership available" : "No membership plans"}
            </div>
          </div>
        </div>
        {/* Status and Book button */}
        <div className="flex items-center justify-between mt-2 gap-2 flex-wrap">
          <span className="flex items-center gap-2 text-green-600 font-bold text-base sm:text-lg">
            <span className="inline-block w-3 h-3 rounded-full bg-green-500"></span>
            {library.seatTypes?.some((seat) => seat.availableSeats > 0)
              ? "Seats Available"
              : "No Seats Available"}
          </span>
          <Link
            href={`/libraries/${library.id}/seatBooking`}
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
  // const router = useRouter();
  // const { id } = router.query; // Get library ID from URL
  const { id } = useParams()
  const [library, setLibrary] = useState<Library | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchLibrary = async () => {
      try {
        const response = await fetch(`/api/libraries/${id}`);
        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(result.message || "Failed to fetch library");
        }

        setLibrary(result.data);
        setLoading(false);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "An unexpected error occurred");
        setLoading(false);
      }
    };

    fetchLibrary();
  }, [id]);
  // Map amenities to feature icons 
  const mapAmenitiesToFeatures = (amenities: string[]) => {
    const featureMap: { [key: string]: { icon: ReactNode; label: string } } = {
      // Original mappings (keeping existing ones)
      wifi: { icon: <FaWifi />, label: "Wi-Fi" },
      cafe: { icon: <FaCoffee />, label: "Cafeteria" },
      parking: { icon: <FaParking />, label: "Parking" },
      books: { icon: <FaBook />, label: "Books" },
      internet: { icon: <FaLaptop />, label: "Internet-ready" },
      lockers: { icon: <FaLock />, label: "Lockers" },
      
      // Additional mappings from admin dashboard
      "WiFi": { icon: <FaWifi />, label: "Wi-Fi" },
      "Parking": { icon: <FaParking />, label: "Parking" },
      "Study Rooms": { icon: <BsPersonBadge />, label: "Study Rooms" },
      "Cafeteria": { icon: <FaCoffee />, label: "Cafeteria" },
      "Lockers": { icon: <FaLock />, label: "Lockers" },
      "Air Conditioning": { icon: <MdAccessTime />, label: "Air Conditioning" },
      "Quiet Zone": { icon: <MdVolumeOff />, label: "Quiet Zone" },
      "Computer Lab": { icon: <FaLaptop />, label: "Computer Lab" },
      "Security": { icon: <BsPersonBadge />, label: "Security" },
      "Group Study Area": { icon: <BsPersonBadge />, label: "Group Study Area" },
      "Power Outlets": { icon: <MdAccessTime />, label: "Power Outlets" },
      "Printing Services": { icon: <FaBook />, label: "Printing Services" },
      
      // Handle lowercase versions as well
      "study rooms": { icon: <BsPersonBadge />, label: "Study Rooms" },
      "cafeteria": { icon: <FaCoffee />, label: "Cafeteria" },
      "air conditioning": { icon: <MdAccessTime />, label: "Air Conditioning" },
      "quiet zone": { icon: <MdVolumeOff />, label: "Quiet Zone" },
      "computer lab": { icon: <FaLaptop />, label: "Computer Lab" },
      "security": { icon: <BsPersonBadge />, label: "Security" },
      "group study area": { icon: <BsPersonBadge />, label: "Group Study Area" },
      "power outlets": { icon: <MdAccessTime />, label: "Power Outlets" },
      "printing services": { icon: <FaBook />, label: "Printing Services" },
    };

    return (amenities || [])
      .map((amenity) => {
        // Getting the amenities from api and mapping them here !!
        return featureMap[amenity] || featureMap[amenity.toLowerCase()];
      })
      .filter((feature) => feature); // Filter out undefined mappings
  };

  // Static rules (customize based on API data if available)
  const rules = [
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
  ];

  if (loading) {
    return <div className="flex w-full h-screen justify-center items-center">Loading...</div>;
  }

  if (error || !library) {
    return <div>Error: {error || "Library not found"}</div>;
  }

  return (
    <div className="bg-[#ECE3DA] min-h-screen py-2 px-1 sm:py-6 sm:px-2 flex justify-center w-full">
      <div className="bg-white p-2 sm:p-5 my-2 sm:my-6 rounded-2xl w-full max-w-5xl">
        {/* Header */}
        <LibraryHeader library={library} />

        {/* Main Content */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {/* Features & Gallery */}
          <div className="md:col-span-2 flex flex-col gap-4 sm:gap-6">
            {/* Features */}
            <div className="bg-white rounded-2xl p-4 sm:p-6 shadow">
              <h2 className="text-lg font-semibold mb-4">Library Features</h2>
              {mapAmenitiesToFeatures(library.amenities).length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {mapAmenitiesToFeatures(library.amenities).map((f, index) => (
                    <div
                      key={`${f.label}-${index}`}
                      className="flex flex-col items-center gap-1 bg-gray-100 py-4 sm:py-5 rounded-lg"
                    >
                      <span className="text-2xl">{f.icon}</span>
                      <span className="text-sm text-gray-700">{f.label}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center bg-gray-100 rounded-lg h-20 text-gray-500">
                  No amenities available
                </div>
              )}
            </div>
            {/* Gallery with placeholder */}
            <div className="bg-white rounded-2xl p-4 sm:p-6 shadow">
              <h2 className="text-lg font-semibold mb-4">Gallery</h2>
              {(() => {
                // Helper function to validate image URL for gallery
                const isValidImageUrl = (url: string) => {
                  return url && (url.startsWith('/') || url.startsWith('http://') || url.startsWith('https://'));
                };
                
                const validImages = library.images?.filter(img => isValidImageUrl(img)) || [];
                
                return validImages.length > 0 ? (
                  <div className="grid grid-cols-3 gap-2 sm:gap-3">
                    {validImages.slice(0, 3).map((img, i) => (
                      <Image
                        key={i}
                        src={img}
                        alt={`Gallery ${i + 1}`}
                        width={100}
                        height={80}
                        className="rounded-lg object-cover h-20 sm:h-28 w-full"
                      />
                    ))}
                    {validImages.length > 3 && (
                      <div className="flex items-center justify-center bg-gray-100 rounded-lg h-20 sm:h-28 text-gray-500 font-semibold cursor-pointer">
                        View all
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-2 sm:gap-3">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex flex-col items-center justify-center bg-gray-100 rounded-lg h-20 sm:h-28 text-gray-400">
                        <FaBook className="text-2xl mb-1" />
                        <span className="text-xs">No Image</span>
                      </div>
                    ))}
                  </div>
                );
              })()}
            </div>
            {/* Rules */}
            <div className="bg-white rounded-2xl p-4 sm:p-6 shadow">
              <h2 className="text-lg font-semibold mb-4">Library rules</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-4">
                {rules.map((rule) => (
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
                <div className="w-full h-full flex items-center justify-center text-gray-500">
                  <div className="text-center">
                    <MdLocationOn className="mx-auto text-2xl mb-1" />
                    <span className="text-sm">Map unavailable</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 text-gray-700 text-sm">
                <MdLocationOn className="text-lg" />
                {library.address}, {library.city}, {library.state}, {library.country}
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
