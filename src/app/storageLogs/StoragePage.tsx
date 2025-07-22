"use client";

import React, { useState } from "react";
import { LogTable } from "./StorageList";
import SearchStorage from "./SearchStorage";
import StoragedSeason from "./StoragedSeason";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import StorageToCSV from "./StoragesToCSV";
import { StorageLogInput } from "@/utils/interface";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import StoragesToPDF from "./StoragesToPDF";
import DeleteStorages from "./DeleteStorages";

interface StoragePageProps {
  initialStorages?: StorageLogInput[];
}

const StoragePage: React.FC<StoragePageProps> = ({ initialStorages }) => {
  const [searchKey, setSearchKey] = useState<string>("storage.id");
  const [searchValue, setSearchValue] = useState<string>("");
  const [year, setYear] = useState<number>(2024);
  const [season, setSeason] = useState<"summer" | "winter">("summer");
  const [isSearchBySeason, setIsSearchBySeason] = useState<boolean>(false);
  const [storageList, setStorageList] = useState<StorageLogInput[]>(
    initialStorages || []
  );

  const [selectedStorages, setSelectedStorages] = useState<StorageLogInput[]>(
    []
  );
  const [isConvertPDF, setIsConvertPDF] = useState<boolean>(false);
  const [tabText, setTabText] = useState<string>("checkbox");

  const getNestedValue = (key: string, value: any) => {
    const splitKeys = key.split(".");
    const nestedValue = splitKeys.reduce((obj, c) => {
      if (typeof obj !== "string") {
        return obj[c];
      }
      return obj;
    }, value);
    return nestedValue;
  };

  const filteredList = storageList.filter((list: StorageLogInput) => {
    const matchesSearch = getNestedValue(searchKey, list)
      .toLowerCase()
      .includes(searchValue.toLowerCase());

    if (isSearchBySeason) {
      const seasonMatches = list.season === season && list.year === year;
      return matchesSearch && seasonMatches;
    }

    return matchesSearch;
  });

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">保管庫一覧</h1>

      <Card className="mb-6">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">検索とフィルター</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
            <div className="md:col-span-1">
              <h3 className="text-sm font-medium mb-2">検索</h3>
              <SearchStorage
                searchKey={searchKey}
                setSearchKey={setSearchKey}
                searchValue={searchValue}
                setSearchValue={setSearchValue}
              />
            </div>

            <div className="md:col-span-1">
              <h3 className="text-sm font-medium mb-2">シーズンフィルター</h3>
              <div className="flex items-center space-x-2 mb-2">
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

            <div className="md:col-span-1 flex justify-end items-center">
              <StorageToCSV storages={storageList} />
              <StoragesToPDF
                selectedStorages={selectedStorages}
                setIsConvertPDF={setIsConvertPDF}
                isConvertPDF={isConvertPDF}
                tabText={tabText}
              />
              <DeleteStorages selectedStorages={selectedStorages} />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0 sm:p-2">
          <LogTable
            storageList={filteredList}
            selectedStorages={selectedStorages}
            isConvertPDF={isConvertPDF}
            tabText={tabText}
            setTabText={setTabText}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default StoragePage;
