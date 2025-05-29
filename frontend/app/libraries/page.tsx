"use client";

import { ChevronDown } from "lucide-react";
import Filter from "@/components/library_listing1/filter";
import LibraryCard from "@/components/library_listing1/librarycard";
import { useState, useEffect, useCallback } from "react";
import { Library } from "@/types/library"; // Import shared interface

interface FilterState {
  city?: string;
  state?: string;
  country?: string;
  amenities?: string[];
}

interface ApiResponse {
  success: boolean;
  libraries: ApiLibraryData[];
  pagination: {
    totalPages: number;
    total: number;
  };
  message?: string;
}

interface SearchApiResponse {
  success: boolean;
  libraries: ApiLibraryData[];
  count: number;
  message?: string;
}

// Type for API response library data (before normalization)
interface ApiLibraryData {
  _id: string;
  id?: string;
  name: string;
  images: string[];
  city: string;
  state: string;
  country: string;
  amenities: string[];
  description: string;
  rating: number;
  createdAt: string;
  updatedAt: string;
  isActive?: boolean;
  openingHours?: Library['openingHours'];
  reviewCount?: number;
  seats?: Library['seats'];
  membershipPlans?: Library['membershipPlans'];
  [key: string]: unknown;
}

export default function AllLibraries() {
  const [libraries, setLibraries] = useState<Library[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [sort, setSort] = useState("createdAt:desc");
  const [filters, setFilters] = useState<FilterState>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [totalResults, setTotalResults] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const buildQueryString = (params: Record<string, string | string[] | number | undefined>) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          query.append(key, value.join(","));
        } else {
          query.append(key, String(value));
        }
      }
    });
    return query.toString();
  };

  // Helper function to ensure API response has all required properties
  const normalizeLibraryData = (library: ApiLibraryData): Library => {
    return {
      ...library,
      isActive: library.isActive ?? true,
      openingHours: library.openingHours ?? [],
      reviewCount: library.reviewCount ?? 0,
      seats: library.seats ?? [],
      membershipPlans: library.membershipPlans ?? [],
    };
  };

  const fetchFilteredLibraries = useCallback(
    async (filters: FilterState = {}, sort = "createdAt:desc", page = 1) => {
      setLoading(true);
      setError(null);
      try {
        const queryString = buildQueryString({
          ...filters,
          amenities: filters.amenities?.join(","),
          sort,
          page,
          limit: 10,
        });

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/library?${queryString}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

        const data: ApiResponse = await res.json();

        if (data.success) {
          // Normalize the data to ensure all required properties exist
          const normalizedLibraries = data.libraries.map(normalizeLibraryData);
          setLibraries(normalizedLibraries);
          setTotalPages(data.pagination.totalPages);
          setTotalResults(data.pagination.total);
        } else {
          setError(data.message || "Failed to fetch libraries");
        }
      } catch {
        setError("Error fetching libraries. Please try again.");
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const handleSearch = useCallback(
    async (query: string) => {
      setSearchQuery(query);
      setCurrentPage(1);
      setError(null);
      try {
        const queryString = buildQueryString({
          query,
          ...filters,
          amenities: filters.amenities?.join(","),
        });

        const res = await fetch(`http://localhost:5000/api/library/search?${queryString}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

        const data: SearchApiResponse = await res.json();

        if (data.success) {
          // Normalize the data to ensure all required properties exist
          const normalizedLibraries = data.libraries.map(normalizeLibraryData);
          setLibraries(normalizedLibraries);
          setTotalPages(Math.ceil(data.count / 10));
          setTotalResults(data.count);
        } else {
          setError(data.message || "Failed to search libraries");
        }
      } catch {
        setError("Error searching libraries. Please try again.");
      }
    },
    [filters]
  );

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSort =
      e.target.value === "Newest"
        ? "createdAt:desc"
        : e.target.value === "Oldest"
        ? "createdAt:asc"
        : "rating:desc";
    setSort(newSort);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    if (searchQuery) {
      handleSearch(searchQuery);
    } else {
      fetchFilteredLibraries(filters, sort, currentPage);
    }
  }, [filters, sort, currentPage, searchQuery, fetchFilteredLibraries, handleSearch]);

  return (
    <div className="main_section max-w-[1920px] lg:overflow-x-auto relative px-2 lg:px-16 md:px-[5%] bg-[#ECE3DA] min-h-screen w-full">
      <div className="p-2 pb-10 text-center text-[16px] sm:text-[24px] md:text-[45px] leading-[1.2] tracking-[0.36px] font-urbanist text-gray-900">
        <span className="font-semibold">Explore </span>Libraries Near You
      </div>

      {error && <div className="p-4 text-red-500">{error}</div>}

      <div className="flex flex-col sm:flex-row sm:gap-2 lg:gap-6">
        <Filter onFilterChange={handleFilterChange} />

        <div className="w-full lg:w-[70%] p-4">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <p className="font-urbanist hidden sm:block font-medium text-[18px]">
              {loading ? "Loading..." : `${totalResults} Results`}
            </p>

            <div className="hidden sm:flex items-center gap-2">
              <span className="text-sm text-gray-500 font-urbanist font-medium">Sort by</span>
              <div className="relative inline-flex items-center">
                <select
                  className="appearance-none bg-transparent pl-1 pr-7 py-2 text-sm font-urbanist font-medium text-gray-900 cursor-pointer focus:outline-none"
                  onChange={handleSortChange}
                  value={
                    sort === "createdAt:desc"
                      ? "Newest"
                      : sort === "createdAt:asc"
                      ? "Oldest"
                      : "Rating"
                  }
                >
                  <option value="Newest">Newest</option>
                  <option value="Oldest">Oldest</option>
                  <option value="Rating">Highest Rated</option>
                </select>
                <ChevronDown className="absolute right-0 h-4 w-4 pointer-events-none text-gray-900" />
              </div>
            </div>
          </div>

          {loading ? (
            <div className="p-4">Loading libraries...</div>
          ) : (
            <LibraryCard libraries={libraries} />
          )}

          <div className="flex flex-wrap space-x-2 mt-6">
            {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`w-10 h-10 rounded-full border flex items-center justify-center font-urbanist font-medium text-[16px] ${
                  page === currentPage
                    ? "bg-black text-white"
                    : "bg-transparent text-gray-500 hover:text-black hover:border-black"
                }`}
              >
                {page}
              </button>
            ))}
            {currentPage < totalPages && (
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 hover:text-black"
                aria-label="Next page"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}