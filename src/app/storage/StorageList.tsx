"use client";

import React, { useState, useEffect, useCallback } from "react";
import { StorageDisplay } from "@/utils/interface";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useRouter } from "next/navigation";
import { getAllStorages } from "@/utils/supabaseFunction";

interface Props {
  searchKey: string;
  searchValue: string;
  year: number;
  season: "summer" | "winter";
  isSearchBySeason: boolean;
  storageList: StorageDisplay[];
  setStorageList: React.Dispatch<React.SetStateAction<StorageDisplay[]>>;
  setSelectedStorages: React.Dispatch<React.SetStateAction<StorageDisplay[]>>;
  selectedStorages: StorageDisplay[];
  isConvertPDF: boolean;
}

const StorageList: React.FC<Props> = ({
  searchKey,
  searchValue,
  year,
  season,
  isSearchBySeason,
  storageList,
  setStorageList,
  setSelectedStorages,
  selectedStorages,
  isConvertPDF,
}) => {
  const router = useRouter();
  const [allStorages, setAllStorages] = useState<StorageDisplay[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchAllStorages = async () => {
      try {
        setIsLoading(true);
        const storages = await getAllStorages();
        setAllStorages(storages);
        setStorageList(storages);
      } catch (err) {
        console.error("データ取得エラー:", err);
        setError("データの取得に失敗しました");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllStorages();
  }, [setStorageList]);

  const filterStorageList = useCallback(() => {
    if (!allStorages.length) return;

    if (!searchValue) {
      if (isSearchBySeason) {
        const filteredBySeason = allStorages.filter(
          (storage: StorageDisplay) =>
            storage.season === season && storage.year === year
        );
        setStorageList(
          filteredBySeason.length ? filteredBySeason : allStorages
        );
      } else {
        setStorageList(allStorages);
      }
      return;
    }

    const filteredByKey = allStorages.filter((storage: StorageDisplay) => {
      try {
        const fieldValue = getNestedProperty(storage, searchKey);

        if (fieldValue === undefined || fieldValue === null) return false;

        if (typeof fieldValue === "string") {
          return fieldValue.toLowerCase().includes(searchValue.toLowerCase());
        } else if (typeof fieldValue === "number") {
          return fieldValue.toString().includes(searchValue);
        } else if (fieldValue instanceof Date) {
          return fieldValue.toISOString().includes(searchValue);
        }
      } catch (err) {
        console.error("フィルタリングエラー:", err);
      }
      return false;
    });

    if (isSearchBySeason) {
      const filteredBySeason = filteredByKey.filter(
        (storage: StorageDisplay) =>
          storage.season === season && storage.year === year
      );
      setStorageList(
        filteredBySeason.length ? filteredBySeason : filteredByKey
      );
    } else {
      setStorageList(filteredByKey);
    }
  }, [
    allStorages,
    searchKey,
    searchValue,
    isSearchBySeason,
    season,
    year,
    setStorageList,
  ]);

  const getNestedProperty = useCallback(
    (obj: StorageDisplay, path: string): unknown => {
      try {
        return path.split(".").reduce((prev: unknown, curr: string) => {
          if (prev && typeof prev === "object") {
            return (prev as Record<string, unknown>)[curr];
          }
          return undefined;
        }, obj);
      } catch (error) {
        console.error("プロパティアクセスエラー:", error);
        return undefined;
      }
    },
    []
  );

  useEffect(() => {
    filterStorageList();
  }, [filterStorageList]);

  if (error) {
    return <div className="text-red-500 p-4 text-center">{error}</div>;
  }

  if (isLoading) {
    return <div className="text-center p-4">データを読み込み中...</div>;
  }

  const TABLE_HEADERS = [
    "A or B",
    "保管庫ID",
    "顧客名",
    "車種",
    "ナンバー",
    "タイヤメーカー",
    "タイヤパターン",
    "タイヤサイズ",
  ];

  if (storageList.length === 0) {
    return <div className="text-center p-4">該当するデータがありません</div>;
  }

  const handleClickRow = (storage: StorageDisplay, checked: boolean = true) => {
    if (isConvertPDF) {
      selectItem(checked, storage);
    } else {
      router.push(`/storage/${storage.id}`);
    }
  };

  const selectItem = (checked: boolean, storage: StorageDisplay) => {
    if (checked) {
      setSelectedStorages((prev) => [...prev, storage]);
    } else {
      setSelectedStorages((prev) =>
        prev.filter((item) => item.id !== storage.id)
      );
    }
  };

  return (
    <div className="overflow-x-auto rounded-md shadow-sm">
      <Table className="min-w-full bg-white">
        <TableCaption className="mt-2 mb-4 text-gray-500">
          保管庫リスト一覧
        </TableCaption>
        <TableHeader className="bg-gray-50">
          <TableRow>
            {TABLE_HEADERS.map((header) => (
              <TableHead
                key={header}
                className="py-3 text-sm font-medium text-gray-700"
              >
                {header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {storageList.map((storage) => (
            <TableRow
              key={storage.id}
              onClick={() => {
                if (isConvertPDF) {
                  // 現在の選択状態を確認して逆にする
                  const isCurrentlySelected = selectedStorages.some(
                    (selected) => selected.id === storage.id
                  );
                  handleClickRow(storage, !isCurrentlySelected);
                } else {
                  router.push(`/storage/${storage.id}`);
                }
              }}
              className="cursor-pointer transition-colors hover:bg-gray-100 border-b"
            >
              {isConvertPDF && (
                <TableCell
                  className="py-3"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Checkbox
                    checked={selectedStorages.some(
                      (selected) => selected.id === storage.id
                    )}
                    onCheckedChange={(checked) => {
                      selectItem(checked === true, storage);
                    }}
                  />
                </TableCell>
              )}
              <TableCell className="py-3">
                {storage.storage?.storage_type || "-"}
              </TableCell>
              <TableCell className="py-3">
                {storage.storage?.storage_number || "-"}
              </TableCell>
              <TableCell className="py-3">
                {storage.state?.car?.client?.client_name || "-"}
              </TableCell>
              <TableCell className="py-3">
                {storage.state?.car?.car_model || "-"}
              </TableCell>
              <TableCell className="py-3">
                {storage.state?.car?.car_number || "-"}
              </TableCell>
              <TableCell className="py-3">
                {storage.state?.tire_maker || "-"}
              </TableCell>
              <TableCell className="py-3">
                {storage.state?.tire_pattern || "-"}
              </TableCell>
              <TableCell className="py-3">
                {storage.state?.tire_size || "-"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default StorageList;
