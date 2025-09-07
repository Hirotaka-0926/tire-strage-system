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
import { set } from "react-hook-form";

const PLACEHOLDER_VALUES = {
  UNKNOWN: "不明",
} as const;

interface DetailPanelProps {
  selectedSlot: StorageData | null;
  onUpdateSlot: (slotId: string, updates: Partial<StorageData>) => void;
  setSelectedSlot: (slot: StorageData | null) => void;
}

export const DetailPanel = ({
  selectedSlot,
  onUpdateSlot,
  setSelectedSlot,
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
    setSelectedSlot({ ...selectedSlot, ...updates } as StorageData);
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
              {/* 担当者名を大きく上部に表示 */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                  <p className="text-sm font-semibold text-blue-800">担当者</p>
                </div>
                <p className="text-2xl font-bold text-blue-900">
                  {currentStorageData?.state?.assigner ||
                    PLACEHOLDER_VALUES.UNKNOWN}
                </p>
              </div>

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

              {/* 格納されている大まかな情報を表示 */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-lg mb-3 text-gray-800">
                  格納情報
                </h4>
                <div className="space-y-3">
                  {/* 顧客情報 */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">顧客名</span>
                    <span className="font-medium text-gray-900">
                      {currentStorageData?.client?.client_name ||
                        PLACEHOLDER_VALUES.UNKNOWN}
                    </span>
                  </div>
                  {/* 車両情報 */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">車種</span>
                    <span className="font-medium text-gray-900">
                      {currentStorageData?.car?.car_model ||
                        PLACEHOLDER_VALUES.UNKNOWN}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">車番</span>
                    <span className="font-medium text-gray-900">
                      {currentStorageData?.car?.car_number ||
                        PLACEHOLDER_VALUES.UNKNOWN}
                    </span>
                  </div>
                  {/* タイヤ情報 */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">
                      タイヤメーカー
                    </span>
                    <span className="font-medium text-gray-900">
                      {currentStorageData?.state?.tire_maker ||
                        PLACEHOLDER_VALUES.UNKNOWN}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">タイヤサイズ</span>
                    <span className="font-medium text-gray-900">
                      {currentStorageData?.state?.tire_size ||
                        PLACEHOLDER_VALUES.UNKNOWN}
                    </span>
                  </div>
                </div>
              </div>

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
