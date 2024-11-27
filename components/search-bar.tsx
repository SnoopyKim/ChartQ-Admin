"use client";

import { useState } from "react";
import { Input } from "@/components/shadcn/input";
import { createClient } from "@/utils/supabase/client";

interface SearchBarProps {
  onSearch: (results: any[]) => void;
  placeholder?: string;
  table: string; // 검색할 테이블 이름
  searchColumn: string; // 검색할 컬럼 이름
}

export function SearchBar({
  onSearch,
  placeholder = "검색어를 입력하세요...",
  table,
  searchColumn,
}: SearchBarProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const supabase = createClient();

  const handleSearch = async (value: string) => {
    setSearchTerm(value);

    if (value.length < 2) {
      onSearch([]);
      return;
    }

    try {
      const { data, error } = await supabase
        .from(table)
        .select()
        .ilike(searchColumn, `%${value}%`)
        .limit(10);

      if (error) throw error;

      onSearch(data || []);
    } catch (error) {
      console.error("검색 중 오류 발생:", error);
      onSearch([]);
    }
  };

  return (
    <div className="relative w-full max-w-xl">
      <div className="relative">
        <Input
          type="search"
          placeholder={placeholder}
          value={searchTerm}
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
