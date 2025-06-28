"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";

interface SearchAndFilterProps {
  searchTerm: string;
  filterStatus: string;
  onSearchChange: (value: string) => void;
  onFilterChange: (value: string) => void;
}

const SearchAndFilter = ({
  searchTerm,
  filterStatus,
  onSearchChange,
  onFilterChange,
}: SearchAndFilterProps) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          placeholder="顧客名、カナ、郵便番号、住所で検索..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>
      <Select value={filterStatus} onValueChange={onFilterChange}>
        <SelectTrigger className="w-48">
          <SelectValue placeholder="ステータスで絞り込み" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">すべて</SelectItem>
          <SelectItem value="this-season">今シーズン交換済み</SelectItem>
          <SelectItem value="needs-contact">
            要連絡（前シーズンのみ）
          </SelectItem>
          <SelectItem value="not-used">長期未利用</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default SearchAndFilter;
