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
  setKey: React.Dispatch<React.SetStateAction<string>>;
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
}

const SearchCustomer: React.FC<Props> = ({
  searchKey,
  setKey,
  value,
  setValue,
}) => {
  return (
    <React.Fragment>
      <Input
        className="m-4 w-1/3 focus: border-gray-700"
        placeholder="検索"
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
        }}
      />
      <Select value={searchKey} onValueChange={setKey}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="検索項目" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>選択したい項目</SelectLabel>
            <SelectItem value="id">ID</SelectItem>
            <SelectItem value="created_at">更新日</SelectItem>
            <SelectItem value="client_name">顧客名</SelectItem>
            <SelectItem value="post_number">郵便番号</SelectItem>
            <SelectItem value="address">住所</SelectItem>
            <SelectItem value="car_number">車ナンバー</SelectItem>
            <SelectItem value="storage_number">保管庫ID</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </React.Fragment>
  );
};

export default SearchCustomer;
