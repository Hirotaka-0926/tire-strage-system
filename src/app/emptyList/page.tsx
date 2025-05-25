/* eslint-disable @typescript-eslint/no-unused-vars */
// インタラクティブマップビュー
"use client";

import React, { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getYearAndSeason } from "@/utils/globalFunctions";
import {
  getAllMasterStorages,
  getStoragesType,
  getStoragesUseNumber,
} from "@/utils/supabaseFunction";
import { Storage } from "@/utils/interface";
import {
  TransformWrapper,
  TransformComponent,
  ReactZoomPanPinchRef,
} from "react-zoom-pan-pinch";
import { Search, ZoomIn, ZoomOut, Filter } from "lucide-react";

export default function StorageMapView() {
  const [storageList, setStorageList] = useState<Record<string, Storage[]>>({});
  const [storagesTypes, setStoragesTypes] = useState<string[]>([]);
  const [displayLocation, setDisplayLocation] = useState<string>("A");
  const router = useRouter();
  const [usedNumbers, setUsedNumbers] = useState<
    { id: number; storage_id: number }[]
  >([]);
  const { year, season } = getYearAndSeason();
  const transformRef = useRef<ReactZoomPanPinchRef>(null);

  const handleZoomIn = () => {
    if (transformRef.current) {
      transformRef.current.zoomIn();
    }
  };

  const handleZoomOut = () => {
    if (transformRef.current) {
      transformRef.current.zoomOut();
    }
  };

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

    const divideStoragesByLocation = (storages: Storage[]) => {
      const dividedStorages = storages.reduce(
        (acc: Record<string, Storage[]>, item: Storage) => {
          const type = item.storage_type;
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

    const fetchStoragesUseNumber = async (
      year: number,
      season: "summer" | "winter"
    ) => {
      try {
        const data = await getStoragesUseNumber(year, season);
        setUsedNumbers(data);
        console.log("取得した使用番号:", data);
      } catch (error) {
        console.error("データ取得エラー:", error);
      }
    };
    fetchStoragesUseNumber(year, season);
    fetchStoragesTypes();
    loadStorages();
  }, []);

  const handleLinkStorageDetail = (storageId: number) => {
    const isStoraged = checkStorageUsage(storageId!);

    if (isStoraged) {
      router.push("/storage/" + isStoraged.id);
    }

    router.push("/emptyList/storage/" + storageId);
  };

  // Check if storage is in use
  const checkStorageUsage = (storageId: number | undefined) => {
    if (!storageId) return false;
    return usedNumbers.find((item) => item.storage_id === storageId);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">保管庫マップ</h1>

      {/* 検索・操作パネル */}
      <div className="flex justify-between flex-wrap gap-3 mb-6">
        <div className="flex gap-2">
          <div className="relative">
            <Input
              type="text"
              placeholder="保管庫を検索"
              className="pl-9 pr-4 py-2"
            />
            <Search
              className="absolute left-3 top-2.5 text-gray-400"
              size={18}
            />
          </div>
          <Button variant="outline" size="icon">
            <Filter size={18} />
          </Button>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={handleZoomOut}>
            <ZoomOut size={18} />
          </Button>
          <Button variant="outline" size="icon" onClick={handleZoomIn}>
            <ZoomIn size={18} />
          </Button>
          <Select value={displayLocation} onValueChange={setDisplayLocation}>
            <SelectTrigger className="w-[80px]">
              <SelectValue placeholder="階層" />
            </SelectTrigger>
            <SelectContent>
              {storagesTypes.map((type) => (
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
        <TransformWrapper
          ref={transformRef}
          initialScale={1}
          initialPositionX={0}
          initialPositionY={0}
        >
          {({ zoomIn, zoomOut }) => (
            <>
              <TransformComponent>
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
                            {storage.storage_type}-{storage.storage_number}
                          </span>
                          <Badge
                            variant={
                              checkStorageUsage(storage.id)
                                ? "destructive"
                                : "secondary"
                            }
                            className="mt-2"
                          >
                            {checkStorageUsage(storage.id)
                              ? "使用中"
                              : "空き有り"}
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
              </TransformComponent>
            </>
          )}
        </TransformWrapper>
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
