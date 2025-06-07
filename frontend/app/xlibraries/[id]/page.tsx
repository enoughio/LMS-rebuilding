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
  dayOfWeek: string;
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
    const today = new Date().toLocaleString("en-US", { weekday: "long" });
    const todayHours = library.openingHours.find(
      (hour) => hour.dayOfWeek.toLowerCase() === today.toLowerCase()
    );
    if (!todayHours || todayHours.isClosed) {
      return "Closed Today";
    }
    return `${todayHours.openTime} to ${todayHours.closeTime}`;
  };

  const getDistance = () => {
    // Placeholder: Implement logic to calculate distance if needed
    return "2 km away";
  };

  return (
    <div className="relative rounded-2xl shadow bg-white mb-6">
      {/* Banner Image */}
      <Image
      fill
        src={library.images[0] || "/libraries/libraries2.jpg"}
        alt={library.name}
        className="w-full h-44 sm:h-64 object-cover"
      />
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
      {/* Content */}
      <div className="absolute left-0 top-0 w-full h-full flex flex-col justify-end p-4 sm:p-6">
        {/* Top badges */}
        <div className="flex gap-2 mb-2">
          <span className="bg-white/80 text-gray-800 text-xs px-3 py-1 rounded-full font-medium">
            {library.isOpen ? "Open Now" : "Closed"}
          </span>
          <span className="bg-blue-100 text-blue-700 text-xs px-3 py-1 rounded-full font-medium">
            Public Library
          </span>
        </div>
        {/* Title and Info */}
        <div>
          <h1 className="text-xl sm:text-3xl font-bold text-white mb-1">
            {library.name}
          </h1>
          <div className="flex items-center justify-between text-white flex-wrap">
            <div className="flex items-center gap-2 text-white text-sm mb-1">
              <FaStar className="text-yellow-400" />
              <span>{library.rating.toFixed(1)}</span>
              <span className="text-gray-200">({library.reviewCount} reviews)</span>
              <span className="mx-2 hidden sm:inline">•</span>
              <span className="hidden sm:inline">{library.totalSeats}+ Seats</span>
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
          {library.seatTypes.some((seat) => seat.availableSeats > 0)
            ? "Seats Available"
            : "No Seats Available"}
        </span>
        <Link
          href={`/seatBooking/${library.id}`}
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
              {library.isOpen ? "Open now" : "Closed"}
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
            {library.seatTypes.some((seat) => seat.availableSeats > 0)
              ? "Seats Available"
              : "No Seats Available"}
          </span>
          <Link
            href={`/seatBooking/${library.id}`}
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
      wifi: { icon: <FaWifi />, label: "Wifi" },
      cafe: { icon: <FaCoffee />, label: "Cafe" },
      parking: { icon: <FaParking />, label: "Parking" },
      books: { icon: <FaBook />, label: "Books" },
      internet: { icon: <FaLaptop />, label: "Internet-ready" },
      lockers: { icon: <FaLock />, label: "Locker rooms" },
      // Add more mappings as needed
    };

    return amenities
      .map((amenity) => featureMap[amenity.toLowerCase()])
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
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {mapAmenitiesToFeatures(library.amenities).map((f) => (
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
                {library.images.slice(0, 3).map((img, i) => (
                  <Image
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
                <Image
                  src="/libraries/map.jpg" // Replace with dynamic map if available
                  alt="Map"
                  className="w-full h-full object-cover"
                />
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
