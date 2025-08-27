"use client";

import {
  Info,
  MapPin,
  ExternalLink,
  History,
  FileText,
  Settings,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { getStorageByMasterStorageId } from "@/utils/supabaseFunction";
import { HistoryModal } from "./HistoryModal";
import { PDFPreviewModal } from "./PDFPreviewModal";
import { StorageAssignmentModal } from "./StorageAssignmentModal";
import type { StorageData } from "@/utils/interface";
import type {
  StorageLogInput,
  StorageInput,
  Car,
  Client,
  State,
} from "@/utils/interface";
import { getYearAndSeason } from "@/utils/globalFunctions";

interface DetailPanelProps {
  selectedSlot: StorageData | null;
  onUpdateSlot: (slotId: string, updates: Partial<StorageData>) => void;
}

export const DetailPanel = ({
  selectedSlot,
  onUpdateSlot,
}: DetailPanelProps) => {
  const router = useRouter();
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showPDFPreview, setShowPDFPreview] = useState(false);
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);
  const [currentStorageData, setCurrentStorageData] =
    useState<StorageInput | null>(null);
  const { year, season } = getYearAndSeason();
  const getStatusText = (storage: StorageData) => {
    const isOccupied =
      storage.car_id !== null ||
      storage.client_id !== null ||
      storage.tire_state_id !== null;
    return isOccupied ? "使用中" : "空き";
  };

  const getStatusColor = (storage: StorageData) => {
    const isOccupied =
      storage.car_id !== null ||
      storage.client_id !== null ||
      storage.tire_state_id !== null;
    return isOccupied ? "bg-red-500" : "bg-green-500";
  };

  const handleAssignmentClick = () => {
    setShowAssignmentModal(true);
  };

  const handleStorageAssignment = (
    slotId: string,
    updates: Partial<StorageData>
  ) => {
    onUpdateSlot(slotId, updates);
  };

  const handleDetailNavigation = () => {
    if (selectedSlot) {
      router.push(`/emptyList/storage/${selectedSlot.id}`);
    }
  };

  const handleHistoryClick = () => {
    setShowHistoryModal(true);
  };

  const handlePDFPreview = () => {
    setShowPDFPreview(true);
  };

  const convertToPDF = (data: StorageInput | null) => {
    if (!data) return {} as StorageLogInput;
    const pdfData: StorageLogInput = {
      // Provide a fallback or handle undefined
      car: data.car ?? ({} as Car),
      client: data.client ?? ({} as Client),
      state: data.state ?? ({} as State),
      // You may need to provide other required fields for StorageLogInput here
      id: 0,
      year: year,
      season: season,
      storage: {
        id: selectedSlot?.id || "",
        car_id: selectedSlot?.car_id || null,
        client_id: selectedSlot?.client_id || null,
        tire_state_id: selectedSlot?.tire_state_id || null,
      } as StorageData,
    };

    return pdfData;
    // PDF変換ロジックをここに実装
  };

  // 現在のスロットが使用中の場合、詳細なストレージデータを取得
  useEffect(() => {
    const fetchStorageData = async () => {
      if (selectedSlot && selectedSlot.tire_state_id) {
        try {
          const storageData = await getStorageByMasterStorageId(
            selectedSlot.id
          );
          if (!storageData) {
            setCurrentStorageData(null);
          } else {
            setCurrentStorageData(storageData);
          }
        } catch (error) {
          console.error("ストレージデータの取得に失敗:", error);
          setCurrentStorageData(null);
        }
      } else {
        setCurrentStorageData(null);
      }
    };

    fetchStorageData();
  }, [selectedSlot]);

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Info className="w-4 h-4 mr-2" />
            詳細情報
          </CardTitle>
        </CardHeader>
        <CardContent>
          {selectedSlot ? (
            <div className="space-y-4">
              {/* iPad Mini最適化: ヘッダー情報を縮小 */}
              <div className="pb-1">
                <h3 className="font-bold text-xl sm:text-2xl mb-1">
                  {selectedSlot.id}
                </h3>
                <Badge
                  className={`${getStatusColor(
                    selectedSlot
                  )} text-sm px-3 py-1 rounded-md`}
                >
                  {getStatusText(selectedSlot)}
                </Badge>
              </div>

              {(selectedSlot.car_id !== null ||
                selectedSlot.client_id !== null ||
                selectedSlot.tire_state_id !== null) && (
                <div className="border-t pt-3">
                  <div className="grid grid-cols-2 gap-2 sm:gap-3">
                    <div className="bg-gray-50 p-2 rounded">
                      <label className="text-xs font-semibold text-gray-600 block">
                        保管庫ID
                      </label>
                      <p className="text-sm font-medium">{selectedSlot.id}</p>
                    </div>
                    <div className="bg-gray-50 p-2 rounded">
                      <label className="text-xs font-semibold text-gray-600 block">
                        車両ID
                      </label>
                      <p className="text-sm font-medium">
                        {selectedSlot.car_id || "未設定"}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-2 rounded">
                      <label className="text-xs font-semibold text-gray-600 block">
                        顧客ID
                      </label>
                      <p className="text-sm font-medium">
                        {selectedSlot.client_id || "未設定"}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-2 rounded">
                      <label className="text-xs font-semibold text-gray-600 block">
                        タイヤ状態ID
                      </label>
                      <p className="text-sm font-medium">
                        {selectedSlot.tire_state_id || "未設定"}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* iPad Mini最適化: ステータス表示をコンパクトに */}
              <div className="border-t pt-3">
                <div className="bg-blue-50 p-2 rounded">
                  <label className="text-xs font-semibold text-gray-600 block mb-1">
                    保管庫の状態
                  </label>
                  <p className="text-lg font-bold text-blue-800">
                    {getStatusText(selectedSlot)}
                  </p>
                </div>
              </div>

              {/* iPad Mini最適化: コンパクトなボタンレイアウト */}
              <div className="space-y-2 pt-3">
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    size="sm"
                    className="h-10 text-sm font-medium touch-manipulation"
                    onClick={handleAssignmentClick}
                    variant="outline"
                  >
                    <Settings className="w-4 h-4 mr-1" />
                    設定
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-10 text-sm font-medium touch-manipulation"
                    onClick={handleDetailNavigation}
                  >
                    <ExternalLink className="w-4 h-4 mr-1" />
                    詳細
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-10 text-sm font-medium touch-manipulation"
                    onClick={handleHistoryClick}
                  >
                    <History className="w-4 h-4 mr-1" />
                    履歴
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-10 text-sm font-medium touch-manipulation disabled:opacity-50"
                    onClick={handlePDFPreview}
                    disabled={!currentStorageData}
                  >
                    <FileText className="w-4 h-4 mr-1" />
                    PDF
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-500 py-6">
              <MapPin className="w-16 h-16 mx-auto mb-3 text-gray-300" />
              <p className="text-lg font-medium">区画を選択して詳細を表示</p>
              <p className="text-sm mt-1 text-gray-400">
                タップして保管庫情報を確認
              </p>
            </div>
          )}
        </CardContent>

        <HistoryModal
          selectedSlot={selectedSlot}
          open={showHistoryModal}
          onOpenChange={setShowHistoryModal}
        />

        <StorageAssignmentModal
          selectedSlot={selectedSlot}
          open={showAssignmentModal}
          onOpenChange={setShowAssignmentModal}
          onAssign={handleStorageAssignment}
        />

        {currentStorageData && (
          <PDFPreviewModal
            storageData={convertToPDF(currentStorageData)}
            fileName={`${selectedSlot?.id}_現在の保管状況.pdf`}
            open={showPDFPreview}
            onOpenChange={setShowPDFPreview}
          />
        )}
      </Card>
    </div>
  );
};
