"use client";
import InputLibrary from "@/components/input";
import { ChevronDown } from "lucide-react";
import LibraryCard from "@/components/library_listing1/librarycard";
import Filter from "@/components/library_listing1/filter";
import { useState, useEffect } from "react";

// Define the type for filters
interface FilterState {
  city?: string;
  state?: string;
  country?: string;
  amenities?: string[];
}

export default function AllLibraries() {
  // State for libraries, filters, sort, pagination, and search
  const [libraries, setLibraries] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [sort, setSort] = useState("createdAt:desc");
  const [filters, setFilters] = useState<FilterState>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [totalResults, setTotalResults] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // Helper function to build query string
  const buildQueryString = (params: Record<string, any>) => {
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

  // Fetch libraries based on filters, sort, and page
  const fetchFilteredLibraries = async (filters: FilterState = {}, sort = "createdAt:desc", page = 1) => {
    setLoading(true);
    setError(null);
    try {
      const queryString = buildQueryString({
        ...filters,
        amenities: filters.amenities ? filters.amenities.join(",") : undefined,
        sort,
        page,
        limit: 10,
      });
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost5000'}/api/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data.success) {
        setLibraries(data.libraries);
        setTotalPages(data.pagination.totalPages);
        setTotalResults(data.pagination.total);
      } else {
        setError(data.message || "Failed to fetch libraries");
        console.error("Failed to fetch libraries:", data.message);
      }
    } catch (error) {
      setError("Error fetching libraries. Please try again.");
      console.error("Error fetching libraries:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle search
  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1); // Reset to first page on search
    setError(null);
    try {
      const queryString = buildQueryString({
        query,
        ...filters,
        amenities: filters.amenities ? filters.amenities.join(",") : undefined,
      });
      const response = await fetch(`http://localhost:5000/api/library/search?${queryString}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data.success) {
        setLibraries(data.libraries);
        setTotalPages(Math.ceil(data.count / 10)); // Assuming limit of 10
        setTotalResults(data.count);
      } else {
        setError(data.message || "Failed to search libraries");
        console.error("Failed to search libraries:", data.message);
      }
    } catch (error) {
      setError("Error searching libraries. Please try again.");
      console.error("Error searching libraries:", error);
    }
  };

  // Handle filter changes from Filter component
  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page on filter change
  };

  // Handle sort change
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSort =
      e.target.value === "Newest"
        ? "createdAt:desc"
        : e.target.value === "Oldest"
        ? "createdAt:asc"
        : "rating:desc";
    setSort(newSort);
    setCurrentPage(1); // Reset to first page on sort change
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Fetch libraries when filters, sort, or page changes
  useEffect(() => {
    if (searchQuery) {
      handleSearch(searchQuery);
    } else {
      fetchFilteredLibraries(filters, sort, currentPage);
    }
  }, [filters, sort, currentPage, searchQuery]);

  return (
    <div className="main_section max-w-[1920px] lg:overflow-x-auto relative px-2 lg:px-16 md:px-[5%] bg-[#ECE3DA] min-h-screen w-full">
      {/* Header */}
      <div className="p-2 pb-10 text-center text-[16px] sm:text-[24px] md:text-[45px] leading-[1.2] tracking-[0.36px] font-urbanist text-gray-900">
        <span className="font-semibold">Explore </span>Libraries Near You
      </div>

      {/* Search Input */}
      <InputLibrary onSearch={handleSearch} />

      {/* Error Message */}
      {error && <div className="p-4 text-red-500">{error}</div>}

      {/* Filter and Content Section */}
      <div className="flex flex-col sm:flex-row sm:gap-2 lg:gap-6">
        {/* Left Filter */}
        <Filter onFilterChange={handleFilterChange} />

        {/* Right Content */}
        <div className="w-full lg:w-[70%] p-4">
          {/* Top Header */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <p className="font-urbanist hidden sm:block font-medium text-[18px]">
              {loading ? "Loading..." : `${totalResults} Results`}
            </p>

            {/* Sort By Dropdown */}
            <div className="hidden sm:flex items-center gap-2">
              <span className="text-sm text-gray-500 font-urbanist font-medium">
                Sort by{" "}
              </span>
              <div className="relative inline-flex items-center">
                <select
                  className="appearance-none bg-transparent pl-1 pr-7 py-2 text-sm font-urbanist font-medium text-gray-900 cursor-pointer focus:outline-none"
                  onChange={handleSortChange}
                >
                  <option value="Newest">Newest</option>
                  <option value="Oldest">Oldest</option>
                  <option value="Rating">Highest Rated</option>
                </select>
                <ChevronDown className="absolute right-0 h-4 w-4 pointer-events-none text-gray-900" />
              </div>
            </div>
          </div>

          {/* Cards */}
          {loading ? (
            <div className="p-4">Loading libraries...</div>
          ) : (
            <LibraryCard libraries={libraries} />
          )}

          {/* Pagination */}
          <div className="flex flex-wrap space-x-2 mt-6">
            {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`w-10 h-10 rounded-full border flex items-center justify-center font-urbanist font-medium text-[16px]
                  ${
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
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}