"use client";
import React, { useState, useEffect, useCallback, memo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FiSearch, FiFilter } from "react-icons/fi";
import { PiMapTrifoldBold } from "react-icons/pi";
import toast, { Toaster } from 'react-hot-toast';
import Image from "next/image";
// import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SeparatorVertical } from "lucide-react";

interface OpeningHour {
  id: string;
  dayOfWeek: number;
  openTime: string;
  closeTime: string;
  isClosed: boolean;
}



interface Library {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  country: string;
  description: string;
  images: string[];
  rating: number;
  reviewCount: number;
  amenities: string[];
  totalSeats: number;
  availableSeats: number;
  openingHours: OpeningHour[];
  hasFreeMembership: boolean;
  hasPaidMembership: boolean;
}

interface Pagination {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

interface ApiResponse {
  success: boolean;
  data: {
    libraries: Library[];
    pagination: Pagination;
  };
  error?: string;
  message?: string;
}

const LibraryCard = memo(({ lib }: { lib: Library }) => {
  const router = useRouter();

  const handleCardClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest("button")) return;
    router.push(`/libraries/${lib.id}`);
  };

  // Helper function to format time (24h to 12h format)
  const formatTime = (time: string) => {
    if (time === "00:00") return "Closed";
    const [hour, minute] = time.split(':').map(Number);
    const period = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minute.toString().padStart(2, '0')} ${period}`;
  };
  // Helper function to get current day's opening hours and status
  const getCurrentDayInfo = () => {
    // Handle case where openingHours is empty or undefined
    if (!lib.openingHours || lib.openingHours.length === 0) {
      return {
        isOpen: false,
        displayHours: "Hours Not Available",
        status: "Closed"
      };
    }

    const now = new Date();
    const currentDay = now.getDay(); // 0 = Sunday, 1 = Monday, etc.
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentTimeInMinutes = currentHour * 60 + currentMinute;

    // Find today's opening hours
    const todaysHours = lib.openingHours.find(hour => hour.dayOfWeek === currentDay);
    
    if (!todaysHours || todaysHours.isClosed || todaysHours.openTime === "00:00" || todaysHours.closeTime === "00:00") {
      return {
        isOpen: false,
        displayHours: "Closed Today",
        status: "Closed"
      };
    }

    // Parse opening and closing times
    const [openHour, openMinute] = todaysHours.openTime.split(':').map(Number);
    const [closeHour, closeMinute] = todaysHours.closeTime.split(':').map(Number);
    const openTimeInMinutes = openHour * 60 + openMinute;
    const closeTimeInMinutes = closeHour * 60 + closeMinute;

    // Check if currently open
    const isCurrentlyOpen = currentTimeInMinutes >= openTimeInMinutes && currentTimeInMinutes < closeTimeInMinutes;

    return {
      isOpen: isCurrentlyOpen,
      displayHours: `${formatTime(todaysHours.openTime)} - ${formatTime(todaysHours.closeTime)}`,
      status: isCurrentlyOpen ? "Open Now" : "Closed"
    };
  };

  const dayInfo = getCurrentDayInfo();

  return (
    <div
      className="flex flex-col sm:flex-row bg-white rounded-2xl shadow-sm p-4 gap-4 sm:gap-6 items-center cursor-pointer hover:shadow-md transition"
      onClick={handleCardClick}

    >      <div className="relative w-full sm:w-64 h-40 sm:h-40 flex-shrink-0">        <Image
          src={lib.images && lib.images.length > 0 
            ? (lib.images[0].startsWith('http') 
                ? lib.images[0] 
                : `/libraries/${lib.images[0]}`)
            : "/placeholder.svg"
          }

          alt={lib.name}
          fill
          className="w-full h-full object-cover rounded-xl"
        />        {(!dayInfo.isOpen) && (
          <span className="absolute bottom-2 left-2 text-xs bg-red-100 text-red-600 px-2 py-1 rounded">
            {dayInfo.status}
          </span>
        )}
        {dayInfo.isOpen && (
          <span className="absolute bottom-2 left-2 text-xs bg-green-100 text-green-600 px-2 py-1 rounded">
            {dayInfo.status}
          </span>
        )}
      </div>
      <div className="flex-1 flex flex-col gap-2 w-full">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">{lib.name}</h3>
            <div className="flex items-center gap-1 text-gray-500 text-sm">
              <span className="inline-block align-middle">
                <svg width="16" height="16" fill="none" className="inline-block mr-1" viewBox="0 0 24 24"><path d="M12 2C7.03 2 3 6.03 3 11c0 5.25 7.11 10.74 8.09 11.47a1 1 0 0 0 1.18 0C13.89 21.74 21 16.25 21 11c0-4.97-4.03-9-9-9zm0 17.88C10.13 18.13 5 14.06 5 11c0-3.87 3.13-7 7-7s7 3.13 7 7c0 3.06-5.13 7.13-7 8.88z" fill="#888"/><circle cx="12" cy="11" r="2.5" fill="#888"/></svg>
              </span>
              {lib.address}, {lib.city}
            </div>
          </div>          <div className="flex flex-col items-end gap-1">
            <span className="text-xs text-gray-600">
              {dayInfo.displayHours}
            </span>
            <span className={`text-xs px-3 py-1 rounded-full font-medium ${dayInfo.isOpen ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}>
              {dayInfo.status}
            </span>
            {/* <span className={`text-xs px-3 py-1 rounded-full font-medium ${lib.availableSeats > 0 ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}>
              {lib.availableSeats > 0 ? `${lib.availableSeats} Seats Available` : "Currently Full"}
            </span>  */}
            
                       <span className={`text-xs px-3 py-1 rounded-full font-medium ${
              lib.hasFreeMembership && lib.hasPaidMembership
                ? "bg-purple-100 text-purple-600"
                : lib.hasFreeMembership
                ? "bg-gray-200 text-gray-500"
                : "bg-emerald-200 text-emerald-700"
            }`}>
              {lib.hasFreeMembership && lib.hasPaidMembership
                ? "Free & Paid"
                : lib.hasFreeMembership
                ? "Free"
                : "Paid"}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-yellow-500 text-base">★ {lib.rating.toFixed(1)}</span>
          <span className="text-xs text-gray-500">({lib.reviewCount} reviews)</span>
        </div>
        <div className="flex flex-row flex-wrap gap-4 mt-2">
          <div className="flex-1 flex flex-col gap-2">
            {Array.from({ length: Math.ceil(lib.amenities.length / 2) }).map((_, i) => (
              <div key={i} className="flex gap-4">
                {lib.amenities.slice(i * 2, i * 2 + 2).map((tag) => (
                 < div className="flex items-center gap-1" key={tag}>
                  <div key={tag} className="flex items-center gap-1 text-sm text-black p-1 ">
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
                  <SeparatorVertical className={` h-4 w-px bg-gray-300`} />
                 </ div> 
                ))}
              </div>
            ))}
          </div>
          <div className="flex items-end">
      
            <Button
              className="px-8 py-2 rounded-full bg-black text-white font-semibold cursor-pointer hover:bg-gray-800 hover:scale-3d transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                router.push(`libraries/${lib.id}`);
              }}
            >
              {"View Details"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
});
LibraryCard.displayName = 'LibraryCard';

interface SearchBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  onSearch: () => void;
  onClear: () => void;
  onToggleFilter: () => void;
}

const SearchBar = memo(({ search, onSearchChange, onSearch, onClear, onToggleFilter }: SearchBarProps) => {
  return (
    <>
      {/* Desktop/Tablet Search Bar */}
      <div className="hidden md:flex items-center bg-white rounded-full px-2 py-2 shadow-sm w-full max-w-7xl mx-auto mb-8">
        <FiSearch className="text-2xl text-gray-500 m-2" />
        <input
          type="text"
          placeholder="Search by library name or location"
          className="flex-1 bg-transparent outline-none text-base px-2"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && onSearch()}
        />
        <span className="mx-4 h-6 w-px bg-gray-300" />
        <button className="flex items-center gap-2 text-gray-700 font-medium hover:text-black" onClick={onToggleFilter}>
          <FiFilter className="text-lg" />
          Filter
        </button>
        <span className="mx-4 h-6 w-px bg-gray-300" />
        <button className="flex items-center gap-2 text-gray-700 font-medium hover:text-black">
          <PiMapTrifoldBold className="text-lg" />
          <span className="italic">Map view</span>
        </button>
        <span className="mx-4 h-6 w-px bg-gray-300" />
        <button className="text-gray-500 hover:text-black font-medium" onClick={onClear}>
          Clear
        </button>
        <button className="ml-4 md:px-6 py-2 rounded-full bg-black text-white font-semibold" onClick={onSearch}>
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
            onChange={(e) => onSearchChange(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && onSearch()}
          />
          <button className="ml-2 px-2 text-sm  sm:px-6 sm:py-2 rounded-full bg-black text-white  sm:font-semibold" onClick={onSearch}>
            Search
          </button>
        </div>
        <div className="flex justify-between px-2">
          <button
            className="flex items-center gap-2 text-black font-medium"
            onClick={onToggleFilter}
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
    </>
  );
});
SearchBar.displayName = 'SearchBar';

interface FilterSidebarProps {
  showFilter: boolean;
  onToggleFilter: (value: boolean) => void;
  city: string;
  minSeats: string[];
  membership: string[];
  minRating: string[];
  cities: string[];
  onFilterChange: (type: 'city' | 'minSeats' | 'membership' | 'minRating', value: string, checked: boolean) => void;
}

const FilterSidebar = memo(({ showFilter, onToggleFilter, city, minSeats, membership, minRating, cities, onFilterChange }: FilterSidebarProps) => {
  return (
    <>
      {/* Mobile Filter Drawer */}
      {showFilter && (
        <div className="fixed inset-0 z-50 bg-transparent bg-opacity-30 flex justify-end md:hidden">
          <div className="bg-[#ECE3DA] w-80 max-w-full h-full p-6 shadow-lg overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold text-lg">Filter</h2>
              <button
                className="text-2xl"
                onClick={() => onToggleFilter(false)}
                aria-label="Close"
              >
                ×
              </button>
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">City</label>
              <select
                className="w-full border rounded px-2 py-1"
                value={city}
                onChange={(e) => onFilterChange('city', e.target.value, e.target.value !== '')}
              >
                <option value="">All cities</option>
                {cities.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Available Seats</label>
              <div className="flex flex-col gap-2">
                {['0-10', '10-20', '20+'].map((range) => (
                  <label key={range}>
                    <input
                      type="checkbox"
                      className="appearance-none w-4 h-4 border border-black rounded bg-transparent checked:bg-black checked:border-black focus:outline-none mr-2"
                      checked={minSeats.includes(range)}
                      onChange={(e) => onFilterChange('minSeats', range, e.target.checked)}
                    />
                    {range} seats
                  </label>
                ))}
              </div>
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Membership</label>
              <div className="flex flex-col gap-2">
                {['Free', 'Paid'].map((type) => (
                  <label key={type}>
                    <input
                      type="checkbox"
                      className="appearance-none w-4 h-4 border border-black rounded bg-transparent checked:bg-black checked:border-black focus:outline-none mr-2"
                      checked={membership.includes(type)}
                      onChange={(e) => onFilterChange('membership', type, e.target.checked)}
                    />
                    {type}
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Rating</label>
              <div className="flex flex-col gap-2">
                {['4', '3'].map((rating) => (
                  <label key={rating}>
                    <input
                      type="checkbox"
                      className="appearance-none w-4 h-4 border border-black rounded bg-transparent checked:bg-black checked:border-black focus:outline-none mr-2"
                      checked={minRating.includes(rating)}
                      onChange={(e) => onFilterChange('minRating', rating, e.target.checked)}
                    />
                    {rating}+
                  </label>
                ))}
              </div>
            </div>
          </div>
          <div
            className="flex-1"
            onClick={() => onToggleFilter(false)}
          />
        </div>
      )}

      {/* Desktop Sidebar Filter */}
      <aside className="hidden lg:block w-64 bg-transparent p-2 mb-4 lg:mb-0">
        <div className="rounded-2xl p-4 lg:p-6">
          <h2 className="font-semibold mb-4">Filter</h2>
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">City</label>
            <select
              className="w-full border rounded px-2 py-1"
              value={city}
              onChange={(e) => onFilterChange('city', e.target.value, e.target.value !== '')}
            >
              <option value="">All cities</option>
              {cities.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Available Seats</label>
            <div className="flex flex-col gap-2">
              {['0-10', '10-20', '20+'].map((range) => (
                <label key={range}>
                  <input
                    type="checkbox"
                    className="appearance-none w-4 h-4 border border-black rounded bg-transparent checked:bg-black checked:border-black focus:outline-none mr-2"
                    checked={minSeats.includes(range)}
                    onChange={(e) => onFilterChange('minSeats', range, e.target.checked)}
                  />
                  {range} seats
                </label>
              ))}
            </div>
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Membership</label>
            <div className="flex flex-col gap-2">
              {['Free', 'Paid'].map((type) => (
                <label key={type}>
                  <input
                    type="checkbox"
                    className="appearance-none w-4 h-4 border border-black rounded bg-transparent checked:bg-black checked:border-black focus:outline-none mr-2"
                    checked={membership.includes(type)}
                    onChange={(e) => onFilterChange('membership', type, e.target.checked)}
                  />
                  {type}
                </label>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Rating</label>
            <div className="flex flex-col gap-2">
              {['4', '3'].map((rating) => (
                <label key={rating}>
                  <input
                    type="checkbox"
                    className="appearance-none w-4 h-4 border border-black rounded bg-transparent checked:bg-black checked:border-black focus:outline-none mr-2"
                    checked={minRating.includes(rating)}
                    onChange={(e) => onFilterChange('minRating', rating, e.target.checked)}
                  />
                  {rating}+
                </label>
              ))}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
});
FilterSidebar.displayName = 'FilterSidebar';

const LibraryList: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [libraries, setLibraries] = useState<Library[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  });
  const [search, setSearch] = useState<string>(searchParams.get('search') || '');
  const [city, setCity] = useState<string>(searchParams.get('city') || '');
  const [minSeats, setMinSeats] = useState<string[]>(searchParams.get('minSeats')?.split(',') || []);
  const [membership, setMembership] = useState<string[]>(searchParams.get('membership')?.split(',') || []);
  const [minRating, setMinRating] = useState<string[]>(searchParams.get('minRating')?.split(',') || []);
  const [showFilter, setShowFilter] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [cities, setCities] = useState<string[]>([]);

  const fetchCities = useCallback(async () => {
    try {
      const response = await fetch('/api/libraries');
      const data: ApiResponse = await response.json();
      if (data.success) {
        const uniqueCities = Array.from(
          new Set(data.data.libraries.map((lib) => lib.city))
        ).sort();
        setCities(uniqueCities);
      }
    } catch (error) {
      console.error('Error fetching cities:', error);
    }
  }, []);

  const fetchLibraries = useCallback(async () => {
    setIsLoading(true);
    try {
      const query = new URLSearchParams({
        page: pagination.currentPage.toString(),
        limit: '10',
        search,
        city,
        minSeats: minSeats.join(','),
        membership: membership.join(','),
        minRating: minRating.join(','),
      }).toString();

      const response = await fetch(`/api/libraries?${query}`);
      const data: ApiResponse = await response.json();

      if (!data.success) {
        throw new Error(data.message || 'Failed to fetch libraries');
      }

      setLibraries(data.data.libraries);
      setPagination(data.data.pagination);
    } catch (error) {
      console.error('Error fetching libraries:', error);
      toast.error('Failed to load libraries. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [pagination.currentPage, search, city, minSeats, membership, minRating]);

  useEffect(() => {
    fetchCities();
    fetchLibraries();
  }, [fetchCities, fetchLibraries]);

  const handleSearch = useCallback(() => {
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (city) params.set('city', city);
    if (minSeats.length) params.set('minSeats', minSeats.join(','));
    if (membership.length) params.set('membership', membership.join(','));
    if (minRating.length) params.set('minRating', minRating.join(','));
    router.push(`/libraries?${params.toString()}`);
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  }, [search, city, minSeats, membership, minRating, router]);

  const handleClear = useCallback(() => {
    setSearch('');
    setCity('');
    setMinSeats([]);
    setMembership([]);
    setMinRating([]);
    router.push('/libraries');
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  }, [router]);

  const handleFilterChange = useCallback(
    (type: 'city' | 'minSeats' | 'membership' | 'minRating', value: string, checked: boolean) => {
      const params = new URLSearchParams(searchParams);
      if (type === 'city') {
        setCity(checked ? value : '');
        if (checked) params.set('city', value);
        else params.delete('city');
      } else if (type === 'minSeats') {
        const newMinSeats = checked ? [...minSeats, value] : minSeats.filter((v) => v !== value);
        setMinSeats(newMinSeats);
        if (newMinSeats.length > 0) params.set('minSeats', newMinSeats.join(','));
        else params.delete('minSeats');
      } else if (type === 'membership') {
        const newMembership = checked ? [...membership, value] : membership.filter((v) => v !== value);
        setMembership(newMembership);
        if (newMembership.length > 0) params.set('membership', newMembership.join(','));
        else params.delete('membership');
      } else if (type === 'minRating') {
        const newMinRating = checked ? [...minRating, value] : minRating.filter((v) => v !== value);
        setMinRating(newMinRating);
        if (newMinRating.length > 0) params.set('minRating', newMinRating.join(','));
        else params.delete('minRating');
      }
      router.push(`/libraries?${params.toString()}`);
      setPagination((prev) => ({ ...prev, currentPage: 1 }));
    },
    [searchParams, minSeats, membership, minRating, router]
  );

  const handlePageChange = useCallback((page: number) => {
    setPagination((prev) => ({ ...prev, currentPage: page }));
    const params = new URLSearchParams(searchParams);
    params.set('page', page.toString());
    router.push(`/libraries?${params.toString()}`);
  }, [router, searchParams]);

  return (
    <div className="max-w-[80vw] " >
      <SearchBar
        search={search}
        onSearchChange={setSearch}
        onSearch={handleSearch}
        onClear={handleClear}
        onToggleFilter={() => setShowFilter(true)}
      />
      <div className="flex flex-col lg:flex-row gap-4 lg:gap-8">
        <FilterSidebar
          showFilter={showFilter}
          onToggleFilter={setShowFilter}
          city={city}
          minSeats={minSeats}
          membership={membership}
          minRating={minRating}
          cities={cities}
          onFilterChange={handleFilterChange}
        />
        <main className="flex-1 w-full min-sm:max-w-[75vw] bg-[#ECE3DA] rounded-2xl p-4 lg:p-6 shadow-sm min-w-[60vw]">
          {isLoading ? (
            <div className="text-center">Loading...</div>
          ) : libraries.length === 0 ? (
            <div className="text-center text-gray-500">No libraries found.</div>
          ) : (
            <div className="flex flex-col gap-4">
              {libraries.map((lib) => (
                <LibraryCard key={lib.id} lib={lib} />
              ))}
            </div>
          )}
          <div className="flex justify-center mt-8 gap-2">
            {pagination.hasPreviousPage && (
              <button
                className="w-8 h-8 rounded-full bg-white border border-gray-300 text-black"
                onClick={() => handlePageChange(pagination.currentPage - 1)}
              >
                &lt;
              </button>
            )}
            {Array.from({ length: Math.min(pagination.totalPages, 5) }).map((_, i) => {
              const page = i + 1;
              return (
                <button
                  key={page}
                  className={`w-8 h-8 rounded-full ${
                    page === pagination.currentPage
                      ? "bg-black text-white"
                      : "bg-white border border-gray-300 text-black"
                  }`}
                  onClick={() => handlePageChange(page)}
                >
                  {page}
                </button>
              );
            })}
            {pagination.totalPages > 5 && (
              <span className="mx-2 text-gray-400">...</span>
            )}
            {pagination.hasNextPage && (
              <button
                className="w-8 h-8 rounded-full bg-white border border-gray-300 text-black"
                onClick={() => handlePageChange(pagination.currentPage + 1)}
              >
                &gt;
              </button>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default function LibrariesPage() {
  return (
    <div className="bg-[#ECE3DA] text-black min-h-screen max-w-[100vw] min-w-[80vw] xl:max-w-[1920px] font-sans w-full md:px-10 ">
      <Toaster position="top-right" />
      <div className="max-w-full mx-auto px-4 sm:px-4 md:px-8 lg:px-12 py-8 ">
        <h1 className="text-2xl sm:text-3xl font-thin mb-2 text-center ">
          <span className="font-semibold">Explore</span> Libraries Near You
        </h1>
        <LibraryList />
      </div>
    </div>
  );
}