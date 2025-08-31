// インタラクティブマップビュー
"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  getAllMasterStorages,
  getStoragesType,
  getStoragesUseId,
} from "@/utils/supabaseFunction";
import { StorageData } from "@/utils/interface";

export default function StorageMap() {
  const [storageList, setStorageList] = useState<Record<string, StorageData[]>>(
    {}
  );
  const [storagesTypes, setStoragesTypes] = useState<string[]>([]);
  const [displayLocation, setDisplayLocation] = useState<string>("A");
  const router = useRouter();
  const [usedNumbers, setUsedNumbers] = useState<string[]>([]);

  useEffect(() => {
    const fetchStorages = async () => {
      try {
        const data = await getAllMasterStorages();
        return data;
      } catch (error) {
        console.error("データ取得エラー:", error);
        return []; // Return empty array instead of undefined
      }
    };

    const divideStoragesByLocation = (storages: StorageData[]) => {
      const dividedStorages = storages.reduce(
        (acc: Record<string, StorageData[]>, item: StorageData) => {
          const type = item.id!.split("_")[0]; // Assuming the type is determined by the first part of the ID
          if (!acc[type]) {
            acc[type] = [];
          }
          acc[type].push(item);
          return acc;
        },
        {}
      );
      return dividedStorages;
    };

    const loadStorages = async () => {
      const storages = await fetchStorages();
      if (storages && storages.length > 0) {
        const dividedStorages = divideStoragesByLocation(storages);
        setStorageList(dividedStorages);
        console.log("分割された保管庫データ:", dividedStorages);
      }
    };

    const fetchStoragesTypes = async () => {
      try {
        const data = await getStoragesType();
        setStoragesTypes(data);
        console.log("取得した保管庫タイプ:", data);
      } catch (error) {
        console.error("データ取得エラー:", error);
      }
    };

    const fetchStoragesUseNumber = async () => {
      try {
        const data = await getStoragesUseId();
        setUsedNumbers(data);
        console.log("取得した使用番号:", data);
      } catch (error) {
        console.error("データ取得エラー:", error);
      }
    };
    fetchStoragesUseNumber();
    fetchStoragesTypes();
    loadStorages();
  }, []);

  const handleLinkStorageDetail = (storageId: string) => {
    const isStoraged = checkStorageUsage(storageId);

    if (isStoraged) {
      router.push("/emptyList/storage/" + storageId);
    }
  };

  // Check if storage is in use
  const checkStorageUsage = (storageId: string | undefined) => {
    if (!storageId) return false;
    return usedNumbers.find((item) => item === storageId);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">保管庫マップ</h1>

      {/* 検索・操作パネル */}
      <div className="flex justify-between flex-wrap gap-3 mb-6">
        <div className="flex gap-2">
          <Select value={displayLocation} onValueChange={setDisplayLocation}>
            <SelectTrigger className="w-[80px]">
              <SelectValue placeholder="階層" />
            </SelectTrigger>
            <SelectContent>
              {storagesTypes.sort((a, b) => a.localeCompare(b)).map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* マップビュー */}
      <div className="border rounded-xl p-4 mb-6 overflow-x-auto">
        <div className="min-w-[800px] bg-slate-50 p-4">
          <div className="flex flex-wrap gap-4 justify-start">
            {storageList[displayLocation] &&
            storageList[displayLocation].length > 0 ? (
              storageList[displayLocation].map((storage, idx) => (
                <Card
                  key={storage.id || idx}
                  onClick={() => handleLinkStorageDetail(storage.id!)}
                  className={`border-2 ${
                    checkStorageUsage(storage.id)
                      ? "border-red-500 bg-red-50"
                      : "border-green-500 bg-green-50"
                  } flex flex-col items-center justify-center cursor-pointer hover:opacity-80 transition-opacity p-2`}
                  style={{
                    width: "120px",
                    height: "120px",
                    flexShrink: 0,
                  }}
                >
                  <span className="font-semibold text-center">
                    {storage.id}
                  </span>
                  <Badge
                    variant={
                      checkStorageUsage(storage.id)
                        ? "destructive"
                        : "secondary"
                    }
                    className="mt-2"
                  >
                    {checkStorageUsage(storage.id) ? "使用中" : "空き有り"}
                  </Badge>
                </Card>
              ))
            ) : (
              <div className="w-full text-center py-10 text-gray-500">
                この保管場所には表示できるデータがありません
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 凡例 */}
      <div className="flex gap-4 mb-4 justify-center">
        <div className="flex items-center">
          <div className="w-4 h-4 bg-green-500 rounded-sm mr-2"></div>
          <span className="text-sm">空き有り</span>
        </div>

        <div className="flex items-center">
          <div className="w-4 h-4 bg-red-500 rounded-sm mr-2"></div>
          <span className="text-sm">使用中</span>
        </div>
      </div>
    </div>
  );
}
