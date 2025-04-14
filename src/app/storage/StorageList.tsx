"use client";

import React, { useState, useEffect, useCallback } from "react";
import { StorageDisplay } from "@/utils/interface";
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
}

const StorageList: React.FC<Props> = ({
  searchKey,
  searchValue,
  year,
  season,
  isSearchBySeason,
  storageList,
  setStorageList,
}) => {
  const router = useRouter();
  const [allStorages, setAllStorages] = useState<StorageDisplay[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAllStorages = async () => {
      try {
        console.log("データ取得開始");

        const storages = await getAllStorages();
        console.log("取得したデータ:", storages);
        setAllStorages(storages);
        setStorageList(storages);
      } catch (err) {
        console.error("データ取得エラーの詳細:", err);
        setError("データの取得に失敗しました");
      }
    };

    fetchAllStorages();
  }, []);

  const filterStorageList = useCallback(() => {
    if (!allStorages.length) return;

    console.log("フィルタリング開始:", allStorages.length, "件のデータ");

    // 検索語が空の場合は全データを表示
    if (!searchValue) {
      if (isSearchBySeason) {
        // シーズンフィルターが有効な場合
        const filteredBySeason = allStorages.filter(
          (storage: StorageDisplay) =>
            (storage.season === season || storage.season === season) &&
            (storage.year === year || storage.year === year)
        );
        console.log("シーズンでフィルター後:", filteredBySeason.length, "件");
        setStorageList(
          filteredBySeason.length ? filteredBySeason : allStorages
        );
      } else {
        // 検索もシーズンフィルターも指定なしの場合は全データ
        setStorageList(allStorages);
      }
      return;
    }

    // 検索値がある場合のフィルタリング
    const filteredByKey = allStorages.filter((storage: StorageDisplay) => {
      try {
        const fieldValue = getNestedProperty(storage, searchKey);
        console.log("フィールド値:", fieldValue, "for key:", searchKey);

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

    console.log("キーワードでフィルター後:", filteredByKey.length, "件");

    if (isSearchBySeason) {
      const filteredBySeason = filteredByKey.filter(
        (storage: StorageDisplay) =>
          (storage.season === season || storage.season === season) &&
          (storage.year === year || storage.year === year)
      );
      console.log("シーズンでフィルター後:", filteredBySeason.length, "件");
      setStorageList(
        filteredBySeason.length ? filteredBySeason : filteredByKey
      );
    } else {
      setStorageList(filteredByKey);
    }
  }, [allStorages, searchKey, searchValue, isSearchBySeason, season, year]);

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
    console.log("フィルター後のストレージ", storageList);
  }, [filterStorageList]);

  if (error) {
    return <div className="text-red-500">{error}</div>;
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

  return (
    <div className="overflow-x-auto">
      <Table className="min-w-full bg-white">
        <TableCaption>これは保管庫リスト一覧です</TableCaption>
        <TableHeader>
          <TableRow>
            {TABLE_HEADERS.map((header) => (
              <TableHead key={header}>{header}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {storageList.map((storage) => {
            console.log("レンダリングするストレージ:", storage);
            return (
              <TableRow
                key={storage.id}
                onClick={() => router.push(`/storage/${storage.id}`)}
                className="cursor-pointer hover:bg-gray-100"
              >
                <TableCell>{storage.storage?.storage_type || "-"}</TableCell>
                <TableCell>{storage.storage?.storage_number || "-"}</TableCell>
                <TableCell>
                  {storage.state?.car?.client?.client_name || "-"}
                </TableCell>
                <TableCell>{storage.state?.car?.car_model || "-"}</TableCell>
                <TableCell>{storage.state?.car?.car_number || "-"}</TableCell>
                <TableCell>{storage.state?.tire_maker || "-"}</TableCell>
                <TableCell>{storage.state?.tire_pattern || "-"}</TableCell>
                <TableCell>{storage.state?.tire_size || "-"}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default StorageList;
