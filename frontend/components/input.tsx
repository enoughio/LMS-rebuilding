"use client";
import { useState } from "react";

export default function InputLibrary({ onSearch} : { onSearch: (query: string) => void }) {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: any) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <form onSubmit={handleSubmit} className="p-4">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search libraries..."
        className="w-full p-2 rounded-md border border-gray-300 focus:outline-none"
      />
      <button type="submit" className="mt-2 bg-black text-white px-4 py-2 rounded-md">
        Search
      </button>
    </form>
  );
}