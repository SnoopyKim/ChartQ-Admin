"use client";

import { useRef } from "react";
import { Input } from "@/components/shadcn/input";

interface SearchBarProps {
  onSearch: (value: string) => void;
  placeholder?: string;
}

export function SearchBar({
  onSearch,
  placeholder = "검색어를 입력하세요...",
}: SearchBarProps) {
  const timer = useRef<NodeJS.Timeout | null>(null);

  const handleSearch = (value: string) => {
    if (timer.current) {
      clearTimeout(timer.current);
    }

    timer.current = setTimeout(() => {
      onSearch(value);
    }, 300);
  };

  return (
    <div className="relative w-full max-w-lg">
      <div className="relative">
        <Input
          type="search"
          placeholder={placeholder}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full pl-10"
        />
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <svg
            className="w-4 h-4 text-gray-500"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
