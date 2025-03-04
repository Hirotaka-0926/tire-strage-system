import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Props {
  searchKey: string;
  setSearchKey: React.Dispatch<React.SetStateAction<string>>;
  searchValue: string | null;
  setSearchValue: React.Dispatch<React.SetStateAction<string | null>>;
}

const SearchStorage: React.FC<Props> = ({
  searchKey,
  setSearchKey,
  searchValue,
  setSearchValue,
}) => {
  return (
    <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4 w-full p-4">
      <Input
        className="w-full md:w-1/3 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="検索"
        value={searchValue!}
        onChange={(e) => {
          setSearchValue(e.target.value);
        }}
      />
      <Select value={searchKey} onValueChange={setSearchKey}>
        <SelectTrigger className="w-full md:w-[180px] p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
          <SelectValue placeholder="検索項目" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>保管庫情報</SelectLabel>
            <SelectItem value="id">ID</SelectItem>
            <SelectItem value="created_at">更新日</SelectItem>
            <SelectItem value="client_name">顧客名</SelectItem>
            <SelectItem value="post_number">郵便番号</SelectItem>
            <SelectItem value="address">住所</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export default SearchStorage;
