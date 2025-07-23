"use client";

import React, { useState } from "react";
import LogTable from "./StorageList";
import SearchStorage from "./SearchStorage";
import StoragedSeason from "./StoragedSeason";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import StorageToCSV from "./StoragesToCSV";
import { StorageLogInput } from "@/utils/interface";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import StoragesToPDF from "./StoragesToPDF";
import DeleteStorages from "./DeleteStorages";
import { deleteStorages } from "@/utils/supabaseFunction";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface StoragePageProps {
  initialStorages?: StorageLogInput[];
}

const StoragePage: React.FC<StoragePageProps> = ({ initialStorages }) => {
  const [searchKey, setSearchKey] = useState<string>("storage.id");
  const [searchValue, setSearchValue] = useState<string>("");
  const [year, setYear] = useState<number>(2024);
  const [season, setSeason] = useState<"summer" | "winter">("summer");
  const [isSearchBySeason, setIsSearchBySeason] = useState<boolean>(false);
  const storageList = initialStorages || [];
  const router = useRouter();

  const [selectedStorages, setSelectedStorages] = useState<
    Set<StorageLogInput>
  >(new Set());
  const [isConvertPDF, setIsConvertPDF] = useState<boolean>(false);

  // 個別削除ハンドラー
  const handleDeleteStorage = async (storageId: number) => {
    try {
      const storageToDelete = storageList.find(
        (storage) => storage.id === storageId
      );
      if (!storageToDelete) {
        toast.error("削除対象の保管データが見つかりません");
        return;
      }

      // deleteStoragesは配列を受け取るので、単一アイテムを配列に包む
      const deleteData = [
        {
          id: storageToDelete.id,
          storage_id: storageToDelete.storage.id,
          client_id: storageToDelete.client?.id,
          car_id: storageToDelete.car?.id,
          tire_state_id: storageToDelete.state?.id,
        },
      ];

      await deleteStorages(deleteData);
      toast.success("保管データを削除しました");
      router.refresh(); // ページをリフレッシュしてデータを更新
    } catch (error) {
      console.error("Error deleting storage:", error);
      toast.error("削除に失敗しました");
    }
  };

  const getNestedValue = (key: string, value: any) => {
    if (!key || !value) {
      return "/";
    }

    const splitKeys = key.split(".");
    const nestedValue = splitKeys.reduce((obj, c) => {
      // nullやundefinedの場合は空文字を返す
      if (obj == null) {
        return "/";
      }

      // オブジェクトでない場合（プリミティブ値）は空文字を返す
      if (typeof obj !== "object") {
        return "/";
      }

      return obj[c];
    }, value);

    // 最終的にnullやundefinedの場合は空文字を返す
    return nestedValue ?? "/";
  };

  const filteredList = (storageList || []).filter((list: StorageLogInput) => {
    // listがnullやundefinedの場合はフィルタリング対象外
    if (!list) return false;

    const matchesSearch = getNestedValue(searchKey, list)
      .toLowerCase()
      .includes(searchValue.toLowerCase());

    if (isSearchBySeason) {
      const seasonMatches = list.season === season && list.year === year;
      return matchesSearch && seasonMatches;
    }
    if (!searchValue) return true;
    return matchesSearch;
  });

  return (
    <div className="container mx-auto px-4 py-6 ">
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
                selectedStorages={Array.from(selectedStorages)}
                setIsConvertPDF={setIsConvertPDF}
                isConvertPDF={isConvertPDF}
              />
              <DeleteStorages selectedStorages={Array.from(selectedStorages)} />
            </div>
          </div>
        </CardContent>
      </Card>

      <LogTable
        storageList={filteredList}
        selectedStorages={selectedStorages}
        setSelectedStorages={setSelectedStorages}
        onDeleteStorage={handleDeleteStorage}
      />
    </div>
  );
};

export default StoragePage;
