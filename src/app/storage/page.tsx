"use client";

import React, { useState, useEffect } from "react";
import StorageList from "./StorageList";
import SearchStorage from "./SearchStorage";
import StoragedSeason from "./StoragedSeason";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import StorageToCSV from "./StoragesToCSV";
import { StorageLogsToDisplay } from "@/utils/interface";
import { getAllStorages } from "@/utils/supabaseFunction";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import StoragesToPDF from "./StoragesToPDF";

const StoragePage: React.FC = () => {
  const [searchKey, setSearchKey] = useState<string>("location");
  const [searchValue, setSearchValue] = useState<string>("");
  const [year, setYear] = useState<number>(2024);
  const [season, setSeason] = useState<"summer" | "winter">("summer");
  const [isSearchBySeason, setIsSearchBySeason] = useState<boolean>(false);
  const [storageList, setStorageList] = useState<StorageLogsToDisplay[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedStorages, setSelectedStorages] = useState<
    StorageLogsToDisplay[]
  >([]);
  const [isConvertPDF, setIsConvertPDF] = useState<boolean>(false);

  useEffect(() => {
    const fetchStorages = async () => {
      try {
        setIsLoading(true);
        const data = await getAllStorages();
        console.log("取得したデータ：", data);
        setStorageList(data);
      } catch (error) {
        console.error("データ取得エラー:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStorages();
  }, []);

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
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-lg">データを読み込み中...</span>
        </div>
      ) : (
        <Card>
          <CardContent className="p-0 sm:p-2">
            <StorageList
              searchKey={searchKey}
              searchValue={searchValue}
              year={year}
              season={season}
              isSearchBySeason={isSearchBySeason}
              storageList={storageList}
              setStorageList={setStorageList}
              setSelectedStorages={setSelectedStorages}
              selectedStorages={selectedStorages}
              isConvertPDF={isConvertPDF}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default StoragePage;
