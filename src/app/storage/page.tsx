"use client";

import React, { useState } from "react";
import StorageList from "./StorageList";
import SearchStorage from "./SearchStorage";
import StoragedSeason from "./StoragedSeason";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

const StoragePage: React.FC = () => {
  const [searchKey, setSearchKey] = useState<string>("location");
  const [searchValue, setSearchValue] = useState<string>("");
  const [year, setYear] = useState<number>(2024);
  const [season, setSeason] = useState<"summer" | "winter">("summer");
  const [isSearchBySeason, setIsSearchBySeason] = useState<boolean>(true);

  return (
    <div>
      <div className="flex">
        <SearchStorage
          searchKey={searchKey}
          setSearchKey={setSearchKey}
          searchValue={searchValue}
          setSearchValue={setSearchValue}
        />
        <div className="flex-col items-center space-x-2 w-full p-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="terms"
              checked={isSearchBySeason}
              onCheckedChange={(checked) =>
                setIsSearchBySeason(Boolean(checked))
              }
            />
            <Label htmlFor="terms">交換時期を絞る</Label>
          </div>
          {isSearchBySeason && (
            <StoragedSeason
              year={year}
              season={season}
              setYear={setYear}
              setSeason={setSeason}
            />
          )}
        </div>
      </div>
      <StorageList
        searchKey={searchKey}
        searchValue={searchValue}
        year={year}
        season={season}
        isSearchBySeason={isSearchBySeason}
      />
    </div>
  );
};

export default StoragePage;
