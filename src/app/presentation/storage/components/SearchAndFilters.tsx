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
import type { StorageAreaConfig } from "@/app/domain/type/storage";
import StorageToCSVButton from "./StorageToCSVButton";

interface SearchAndFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedArea: string;
  setSelectedArea: (area: string) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  areas: StorageAreaConfig[];
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
    <div className="mb-6 flex flex-wrap items-center gap-4">
      <div className="relative min-w-64 flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
        <Input
          placeholder="保管庫番号またはエリア名で検索"
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
          {areas
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((area) => (
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

      <StorageToCSVButton />

      <Button onClick={onAddStorage} className="bg-blue-600 hover:bg-blue-700">
        <Plus className="mr-2 h-4 w-4" />
        保管庫追加
      </Button>

      <Button onClick={onDeleteSlots} className="bg-red-600 hover:bg-red-700">
        <Trash className="mr-2 h-4 w-4" />
        保管庫削除
      </Button>

      <div className="text-sm text-gray-600">{filteredCount}件表示</div>
    </div>
  );
};
