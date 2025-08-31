"use client";

import { Search, Plus, Trash } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { AreaConfig } from "@/utils/storage";

interface SearchAndFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedArea: string;
  setSelectedArea: (area: string) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  areas: AreaConfig[];
  filteredCount: number;
  onAddStorage: () => void;
  onDeleteSlots: () => void;
}

export const SearchAndFilters = ({
  searchTerm,
  setSearchTerm,
  selectedArea,
  setSelectedArea,
  statusFilter,
  setStatusFilter,
  areas,
  filteredCount,
  onAddStorage,
  onDeleteSlots,
}: SearchAndFiltersProps) => {
  return (
    <div className="flex flex-wrap items-center gap-4 mb-6">
      <div className="relative flex-1 min-w-64 ">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          placeholder="区画番号または顧客名で検索"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>
      <Select value={selectedArea} onValueChange={setSelectedArea}>
        <SelectTrigger className="w-32">
          <SelectValue placeholder="エリア" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">全エリア</SelectItem>
          {areas.sort((a, b) => a.name.localeCompare(b.name)).map((area) => (
            <SelectItem key={area.name} value={area.name}>
              エリア{area.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={statusFilter} onValueChange={setStatusFilter}>
        <SelectTrigger className="w-32">
          <SelectValue placeholder="ステータス" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">全て</SelectItem>
          <SelectItem value="available">空き</SelectItem>
          <SelectItem value="occupied">使用中</SelectItem>
        </SelectContent>
      </Select>
      <Button onClick={onAddStorage} className="bg-blue-600 hover:bg-blue-700">
        <Plus className="w-4 h-4 mr-2" />
        保管庫追加
      </Button>

      <Button onClick={onDeleteSlots} className="bg-red-600 hover:bg-red-700">
        <Trash className="w-4 h-4 mr-2" />
        保管庫削除
      </Button>

      <div className="text-sm text-gray-600">{filteredCount}件表示</div>
    </div>
  );
};
