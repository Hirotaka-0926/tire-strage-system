"use client";

import { CustomerFilterStatus } from "@/app/refactor/domain/type/reception";
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
  filterStatus: CustomerFilterStatus;
  onSearchChange: (value: string) => void;
  onFilterChange: (value: CustomerFilterStatus) => void;
}

const SearchAndFilter = ({
  searchTerm,
  filterStatus,
  onSearchChange,
  onFilterChange,
}: SearchAndFilterProps) => {
  return (
    <div className="mb-6 flex flex-col gap-4 md:flex-row">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <Input
          placeholder="顧客名、カナ、郵便番号、住所で検索..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>
      <Select
        value={filterStatus}
        onValueChange={(value) => onFilterChange(value as CustomerFilterStatus)}
      >
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
