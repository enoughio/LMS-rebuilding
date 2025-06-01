"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { FiSearch, FiFilter } from "react-icons/fi";
import { PiMapTrifoldBold } from "react-icons/pi";

const libraries = [
  {
    id: 1,
    name: "Central Library",
    location: "Downtown, Newyork",
    image: "./library1.jpg",
    status: "Open Now",
    seats: 23,
    available: true,
    rating: 4.5,
    tags: ["Wifi", "AC", "Comfort", "Cafe"],
    isBooked: false,
  },
  {
    id: 2,
    name: "Study Hub",
    location: "University, district",
    image: "./library1.jpg",
    status: "Open Now",
    seats: 12,
    available: true,
    rating: 4.2,
    tags: ["Wifi", "AC", "Central", "Cafe"],
    isBooked: false,
  },
  {
    id: 3,
    name: "Knowledge corner",
    location: "Suburban Area",
    image: "./library1.jpg",
    status: "Closed",
    seats: 0,
    available: false,
    rating: 4.8,
    tags: ["Wifi", "AC", "Comfort", "Cafe"],
    isBooked: true,
  },
];

function LibraryCard({ lib }: { lib: typeof libraries[0] }) {
  const router = useRouter();

  // Card click handler (except Book Now)
  const handleCardClick = (e: React.MouseEvent) => {
    // Prevent click if Book Now button is clicked
    if ((e.target as HTMLElement).closest("button")) return;
    router.push(`/libraries/${lib.id}`);
  };

  return (
    <div
      className="flex flex-col sm:flex-row bg-white rounded-2xl shadow-sm p-4 gap-4 sm:gap-6 items-center cursor-pointer hover:shadow-md transition"
      onClick={handleCardClick}
    >
      {/* Image with Closed badge */}
      <div className="relative w-full sm:w-64 h-40 sm:h-40 flex-shrink-0">
        <img
          src={`/libraries/libraries2.jpg`}
          alt={lib.name}
          className="w-full h-full object-cover rounded-xl"
        />
        {lib.status === "Closed" && (
          <span className="absolute bottom-2 left-2 text-xs bg-red-100 text-red-600 px-2 py-1 rounded">
            Closed
          </span>
        )}
      </div>
      {/* Card Content */}
      <div className="flex-1 flex flex-col gap-2 w-full">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">{lib.name}</h3>
            <div className="flex items-center gap-1 text-gray-500 text-sm">
              <span className="inline-block align-middle">
                <svg width="16" height="16" fill="none" className="inline-block mr-1" viewBox="0 0 24 24"><path d="M12 2C7.03 2 3 6.03 3 11c0 5.25 7.11 10.74 8.09 11.47a1 1 0 0 0 1.18 0C13.89 21.74 21 16.25 21 11c0-4.97-4.03-9-9-9zm0 17.88C10.13 18.13 5 14.06 5 11c0-3.87 3.13-7 7-7s7 3.13 7 7c0 3.06-5.13 7.13-7 8.88z" fill="#888"/><circle cx="12" cy="11" r="2.5" fill="#888"/></svg>
              </span>
              {lib.location}
            </div>
          </div>
          <div className="flex flex-col items-end gap-1">
            <span className="text-xs text-gray-600">8:00 am to 9:00 pm</span>
            <span className={`text-xs px-3 py-1 rounded-full font-medium ${lib.available ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}>
              {lib.available ? "Available" : "Currently Full"}
            </span>
            <span className={`text-xs px-3 py-1 rounded-full font-medium ${lib.isBooked ? "bg-gray-200 text-gray-500" : "bg-emerald-200 text-emerald-700"}`}>
              {lib.isBooked ? "Free" : "Paid"}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-yellow-500 text-base">★ {lib.rating}</span>
          <span className="text-xs text-gray-500">(128 reviews)</span>
        </div>
        <div className="flex flex-row flex-wrap gap-4 mt-2">
          {/* Tags in pairs of two, left side */}
          <div className="flex-1 flex flex-col gap-2">
            {Array.from({ length: Math.ceil(lib.tags.length / 2) }).map((_, i) => (
              <div key={i} className="flex gap-4">
                {lib.tags.slice(i * 2, i * 2 + 2).map((tag) => (
                  <div key={tag} className="flex items-center gap-1 text-sm text-gray-700">
                    {tag === "Wifi" && (
                      <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path d="M12 18a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm-4.24-2.83a6 6 0 0 1 8.48 0l1.42-1.42a8 8 0 0 0-11.32 0l1.42 1.42zm-2.83-2.83a10 10 0 0 1 14.14 0l1.42-1.42a12 12 0 0 0-17 0l1.42 1.42z" fill="#222"/></svg>
                    )}
                    {tag === "AC" && (
                      <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><rect x="4" y="7" width="16" height="10" rx="2" fill="#222"/><path d="M8 17v2m8-2v2" stroke="#222" strokeWidth="1.5" strokeLinecap="round"/></svg>
                    )}
                    {tag === "Comfort" && (
                      <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><rect x="5" y="8" width="14" height="8" rx="2" fill="#222"/><rect x="7" y="6" width="10" height="2" rx="1" fill="#222"/></svg>
                    )}
                    {tag === "Cafe" && (
                      <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><rect x="6" y="8" width="12" height="8" rx="2" fill="#222"/><path d="M18 10h1a2 2 0 0 1 0 4h-1" stroke="#222" strokeWidth="1.5"/></svg>
                    )}
                    {tag}
                  </div>
                ))}
              </div>
            ))}
          </div>
          {/* Book Button, right side */}
          <div className="flex items-end">
            <button
              className={`px-8 py-2 rounded-full font-semibold ${
                lib.isBooked || !lib.available
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "bg-black text-white"
              }`}
              disabled={lib.isBooked || !lib.available}
              onClick={(e) => {
                e.stopPropagation();
                router.push("/seatBooking");
              }}
            >
              {lib.isBooked || !lib.available ? "Fully Booked" : "Book now"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Page() {
  const [search, setSearch] = useState("");
  const [showFilter, setShowFilter] = useState(false);

  return (
    <div className="bg-[#ECE3DA] min-h-screen font-sans w-full">
      <div className="max-w-full mx-auto px-2 sm:px-4 md:px-8 lg:px-26 py-4 sm:py-8 md:py-12">
        {/* Header */}
        <h1 className="text-2xl sm:text-3xl font-thin mb-2 text-center mb-4">
          <span className="font-semibold">Explore</span> Libraries Near you
        </h1>

        {/* Desktop/Tablet Search Bar */}
        <div className="hidden md:flex items-center bg-white rounded-full px-2 py-2 shadow-sm w-full max-w-7xl mx-auto mb-8">
          <FiSearch className="text-2xl text-gray-500 m-2" />
          <input
            type="text"
            placeholder="Search by library name or location"
            className="flex-1 bg-transparent outline-none text-base px-2"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <span className="mx-4 h-6 w-px bg-gray-300" />
          <button className="flex items-center gap-2 text-gray-700 font-medium hover:text-black">
            <FiFilter className="text-lg" />
            Filter
          </button>
          <span className="mx-4 h-6 w-px bg-gray-300" />
          <button className="flex items-center gap-2 text-gray-700 font-medium hover:text-black">
            <PiMapTrifoldBold className="text-lg" />
            <span className="italic">Map view</span>
          </button>
          <span className="mx-4 h-6 w-px bg-gray-300" />
          <button className="text-gray-500 hover:text-black font-medium">
            Clear
          </button>
          <button className="ml-4 px-6 py-2 rounded-full bg-black text-white font-semibold">
            Search
          </button>
        </div>

        {/* Mobile Search Bar */}
        <div className="flex md:hidden flex-col gap-4 mb-8">
          <div className="flex items-center bg-white rounded-full px-4 py-3 shadow-sm w-full">
            <FiSearch className="text-2xl text-gray-700 mr-2" />
            <input
              type="text"
              placeholder="Search by library name or location"
              className="flex-1 bg-transparent outline-none text-base"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button className="ml-2 px-6 py-2 rounded-full bg-black text-white font-semibold">
              Search
            </button>
          </div>
          <div className="flex justify-between px-2">
            <button
              className="flex items-center gap-2 text-black font-medium"
              onClick={() => setShowFilter(true)}
            >
              <FiFilter className="text-xl" />
              Filter
            </button>
            <button className="flex items-center gap-2 text-black font-medium">
              <PiMapTrifoldBold className="text-xl" />
              <span>Map view</span>
            </button>
          </div>
        </div>

        {/* Mobile Filter Drawer */}
        {showFilter && (
          <div className="fixed inset-0 z-50 bg-transparent bg-opacity-30 flex justify-end md:hidden">
            <div className="bg-[#ECE3DA] w-80 max-w-full h-full p-6 shadow-lg overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-semibold text-lg">Filter</h2>
                <button
                  className="text-2xl"
                  onClick={() => setShowFilter(false)}
                  aria-label="Close"
                >
                  ×
                </button>
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">
                  Location
                </label>
                <select className="w-full border rounded px-2 py-1">
                  <option>All location</option>
                </select>
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">
                  Available Seats
                </label>
                <div className="flex flex-col gap-2">
                  <label>
                    <input
                      type="checkbox"
                      className="appearance-none w-4 h-4 border border-black rounded bg-transparent checked:bg-black checked:border-black focus:outline-none mr-2"
                    />
                    0-10 seats
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      className="appearance-none w-4 h-4 border border-black rounded bg-transparent checked:bg-black checked:border-black focus:outline-none mr-2"
                    />
                    10-20 seats
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      className="appearance-none w-4 h-4 border border-black rounded bg-transparent checked:bg-black checked:border-black focus:outline-none mr-2"
                    />
                    20+ seats
                  </label>
                </div>
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">
                  Membership
                </label>
                <div className="flex flex-col gap-2">
                  <label>
                    <input
                      type="checkbox"
                      className="appearance-none w-4 h-4 border border-black rounded bg-transparent checked:bg-black checked:border-black focus:outline-none mr-2"
                    />
                    Free
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      className="appearance-none w-4 h-4 border border-black rounded bg-transparent checked:bg-black checked:border-black focus:outline-none mr-2"
                    />
                    Paid
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Rating</label>
                <div className="flex flex-col gap-2">
                  <label>
                    <input
                      type="checkbox"
                      className="appearance-none w-4 h-4 border border-black rounded bg-transparent checked:bg-black checked:border-black focus:outline-none mr-2"
                    />
                    4+
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      className="appearance-none w-4 h-4 border border-black rounded bg-transparent checked:bg-black checked:border-black focus:outline-none mr-2"
                    />
                    3+
                  </label>
                </div>
              </div>
            </div>
            <div
              className="flex-1"
              onClick={() => setShowFilter(false)}
            />
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-4 lg:gap-8">
          {/* Sidebar Filter (desktop only) */}
          <aside className="hidden lg:block w-64 bg-transparent p-2 mb-4 lg:mb-0">
            <div className="rounded-2xl p-4 lg:p-6">
              <h2 className="font-semibold mb-4">Filter</h2>
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">
                  Location
                </label>
                <select className="w-full border rounded px-2 py-1">
                  <option>All location</option>
                </select>
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">
                  Available Seats
                </label>
                <div className="flex flex-col gap-2">
                  <label>
                    <input
                      type="checkbox"
                      className="appearance-none w-4 h-4 border border-black rounded bg-transparent checked:bg-black checked:border-black focus:outline-none mr-2"
                    />
                    0-10 seats
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      className="appearance-none w-4 h-4 border border-black rounded bg-transparent checked:bg-black checked:border-black focus:outline-none mr-2"
                    />
                    10-20 seats
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      className="appearance-none w-4 h-4 border border-black rounded bg-transparent checked:bg-black checked:border-black focus:outline-none mr-2"
                    />
                    20+ seats
                  </label>
                </div>
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">
                  Membership
                </label>
                <div className="flex flex-col gap-2">
                  <label>
                    <input
                      type="checkbox"
                      className="appearance-none w-4 h-4 border border-black rounded bg-transparent checked:bg-black checked:border-black focus:outline-none mr-2"
                    />
                    Free
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      className="appearance-none w-4 h-4 border border-black rounded bg-transparent checked:bg-black checked:border-black focus:outline-none mr-2"
                    />
                    Paid
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Rating</label>
                <div className="flex flex-col gap-2">
                  <label>
                    <input
                      type="checkbox"
                      className="appearance-none w-4 h-4 border border-black rounded bg-transparent checked:bg-black checked:border-black focus:outline-none mr-2"
                    />
                    4+
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      className="appearance-none w-4 h-4 border border-black rounded bg-transparent checked:bg-black checked:border-black focus:outline-none mr-2"
                    />
                    3+
                  </label>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            <div className="flex flex-col gap-4">
              {libraries.map((lib) => (
                <LibraryCard key={lib.id} lib={lib} />
              ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center mt-8 gap-2">
              {[1, 2, 3, 4].map((n) => (
                <button
                  key={n}
                  className={`w-8 h-8 rounded-full ${
                    n === 1
                      ? "bg-black text-white"
                      : "bg-white border border-gray-300 text-black"
                  }`}
                >
                  {n}
                </button>
              ))}
              <span className="mx-2 text-gray-400">...</span>
              <button className="w-8 h-8 rounded-full bg-white border border-gray-300 text-black">
                9
              </button>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}