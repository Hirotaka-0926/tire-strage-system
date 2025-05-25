import React from "react";
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
  searchValue: string;
  setSearchValue: React.Dispatch<React.SetStateAction<string>>;
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
            <SelectItem value="storage.id">保管庫ID</SelectItem>
            <SelectItem value="client.client_name">顧客名</SelectItem>
            <SelectItem value="car.car_model">車種</SelectItem>
            <SelectItem value="car.car_number">ナンバー</SelectItem>
            <SelectItem value="state.tire_maker">タイヤメーカー</SelectItem>
            <SelectItem value="state.tire_size">タイヤサイズ</SelectItem>
            <SelectItem value="state.tire_pattern">タイヤパターン</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export default SearchStorage;
