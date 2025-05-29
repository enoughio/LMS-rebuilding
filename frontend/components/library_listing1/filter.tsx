"use client";
import { useState } from "react";

interface FilterProps {
  onFilterChange: (filters: { city?: string; state?: string; country?: string; amenities?: string[] }) => void;
}

export default function Filter({ onFilterChange }: FilterProps) {
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("");
  const [amenities, setAmenities] = useState<string[]>([]);

  // Available amenities (can be fetched from backend if dynamic)
  const availableAmenities = ["WiFi", "Parking", "Study Rooms", "Quiet Area", "Cafe"];

  const handleAmenityChange = (amenity: string) => {
    setAmenities((prev) =>
      prev.includes(amenity) ? prev.filter((a) => a !== amenity) : [...prev, amenity]
    );
  };

  const handleApplyFilters = () => {
    const filters: { city?: string; state?: string; country?: string; amenities?: string[] } = {};
    if (city.trim()) filters.city = city.trim();
    if (state.trim()) filters.state = state.trim();
    if (country.trim()) filters.country = country.trim();
    if (amenities.length > 0) filters.amenities = amenities;
    onFilterChange(filters);
  };

  const handleClearFilters = () => {
    setCity("");
    setState("");
    setCountry("");
    setAmenities([]);
    onFilterChange({});
  };

  return (
    <div className="w-full lg:w-[20%] p-4 bg-white/20 rounded-md shadow-md">
      <h3 className="font-urbanist font-semibold text-lg mb-4">Filters</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">City</label>
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Enter city"
            className="w-full p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>
      
        <div>
          <label className="block text-sm font-medium text-gray-700">Amenities</label>
          <div className="flex flex-wrap gap-2">
            {availableAmenities.map((amenity) => (
              <label key={amenity} className="flex items-center gap-1">
                <input
                  type="checkbox"
                  checked={amenities.includes(amenity)}
                  onChange={() => handleAmenityChange(amenity)}
                  className="h-4 w-4 text-black focus:ring-black"
                />
                <span className="text-sm">{amenity}</span>
              </label>
            ))}
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleApplyFilters}
            className="w-full bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800"
          >
            Apply Filters
          </button>
          <button
            onClick={handleClearFilters}
            className="w-full bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300"
          >
            Clear Filters
          </button>
        </div>
      </div>
    </div>
  );
}