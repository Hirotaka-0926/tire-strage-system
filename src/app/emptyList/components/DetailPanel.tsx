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

const PLACEHOLDER_VALUES = {
  UNKNOWN: "不明",
} as const;

interface DetailPanelProps {
  selectedSlot: StorageData | null;
  onUpdateSlot: (slotId: string, updates: Partial<StorageData>) => void;
  setSelectedSlot: (slot: StorageData | null) => void;
  onUpdateFromHistory: (slotId: string, updates: Partial<StorageData>) => void;
  assignFromManual: (slotId: string, manualData: State) => void;
}

export const DetailPanel = ({
  selectedSlot,
  onUpdateSlot,
  setSelectedSlot,
  onUpdateFromHistory,
  assignFromManual,
}: DetailPanelProps) => {
  const router = useRouter();
  const [showMore, setShowMore] = useState(false);
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
                <div className="mt-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 text-sm"
                    onClick={() => setShowMore((v) => !v)}
                  >
                    {showMore ? "表示を簡略化" : "もっと見る"}
                  </Button>
                </div>
              </div>

              {/* 追加の詳細表示 */}
              {showMore && currentStorageData && (
                <div className="mt-4 bg-white border border-gray-100 rounded-lg p-4">
                  <h4 className="font-semibold mb-2">詳細情報（拡張）</h4>
                  <div className="grid gap-3 text-sm text-gray-700">
                    {/* Client */}
                    <div className="border p-3 rounded">
                      <h5 className="font-medium mb-2">顧客情報</h5>
                      <div className="space-y-1">
                        <div className="flex justify-between">
                          <span>名前</span>
                          <span className="font-medium">
                            {currentStorageData.client?.client_name ||
                              PLACEHOLDER_VALUES.UNKNOWN}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>名前（カナ）</span>
                          <span className="font-medium">
                            {currentStorageData.client?.client_name_kana ||
                              PLACEHOLDER_VALUES.UNKNOWN}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>住所</span>
                          <span className="font-medium">
                            {currentStorageData.client?.address ||
                              PLACEHOLDER_VALUES.UNKNOWN}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>郵便番号</span>
                          <span className="font-medium">
                            {currentStorageData.client?.post_number ||
                              PLACEHOLDER_VALUES.UNKNOWN}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>電話</span>
                          <span className="font-medium">
                            {(currentStorageData.client as any)?.phone ||
                              (currentStorageData.client as any)?.tel ||
                              PLACEHOLDER_VALUES.UNKNOWN}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>備考</span>
                          <span className="font-medium">
                            {currentStorageData.client?.notes ||
                              PLACEHOLDER_VALUES.UNKNOWN}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Car */}
                    <div className="border p-3 rounded">
                      <h5 className="font-medium mb-2">車両情報</h5>
                      <div className="space-y-1">
                        <div className="flex justify-between">
                          <span>車種</span>
                          <span className="font-medium">
                            {currentStorageData.car?.car_model ||
                              PLACEHOLDER_VALUES.UNKNOWN}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>車番</span>
                          <span className="font-medium">
                            {currentStorageData.car?.car_number ||
                              PLACEHOLDER_VALUES.UNKNOWN}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>年式</span>
                          <span className="font-medium">
                            {currentStorageData.car?.model_year ??
                              PLACEHOLDER_VALUES.UNKNOWN}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* State */}
                    <div className="border p-3 rounded">
                      <h5 className="font-medium mb-2">状態情報</h5>
                      <div className="space-y-1">
                        <div className="flex justify-between">
                          <span>タイヤメーカー</span>
                          <span className="font-medium">
                            {currentStorageData.state?.tire_maker ||
                              PLACEHOLDER_VALUES.UNKNOWN}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>パターン</span>
                          <span className="font-medium">
                            {currentStorageData.state?.tire_pattern ||
                              PLACEHOLDER_VALUES.UNKNOWN}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>サイズ</span>
                          <span className="font-medium">
                            {currentStorageData.state?.tire_size ||
                              PLACEHOLDER_VALUES.UNKNOWN}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>製造年</span>
                          <span className="font-medium">
                            {currentStorageData.state?.manufacture_year ??
                              PLACEHOLDER_VALUES.UNKNOWN}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>空気圧</span>
                          <span className="font-medium">
                            {currentStorageData.state?.air_pressure ??
                              PLACEHOLDER_VALUES.UNKNOWN}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>走行距離</span>
                          <span className="font-medium">
                            {currentStorageData.state?.drive_distance ??
                              PLACEHOLDER_VALUES.UNKNOWN}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>次回予定</span>
                          <span className="font-medium">
                            {currentStorageData.state?.next_theme ||
                              PLACEHOLDER_VALUES.UNKNOWN}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>担当者</span>
                          <span className="font-medium">
                            {currentStorageData.state?.assigner ||
                              PLACEHOLDER_VALUES.UNKNOWN}
                          </span>
                        </div>

                        {/* Inspections */}
                        <div className="mt-2">
                          <h6 className="font-medium">点検・交換情報</h6>
                          <div className="space-y-1 text-sm mt-1">
                            <div className="flex justify-between">
                              <span>タイヤ検査</span>
                              <span className="font-medium">
                                {currentStorageData.state?.tire_inspection
                                  ?.state || PLACEHOLDER_VALUES.UNKNOWN}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span>オイル検査</span>
                              <span className="font-medium">
                                {currentStorageData.state?.oil_inspection
                                  ?.state || PLACEHOLDER_VALUES.UNKNOWN}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span>バッテリー検査</span>
                              <span className="font-medium">
                                {currentStorageData.state?.battery_inspection
                                  ?.state || PLACEHOLDER_VALUES.UNKNOWN}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span>ワイパー検査</span>
                              <span className="font-medium">
                                {currentStorageData.state?.wiper_inspection
                                  ?.state || PLACEHOLDER_VALUES.UNKNOWN}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span>その他</span>
                              <span className="font-medium">
                                {currentStorageData.state?.other_inspection ||
                                  PLACEHOLDER_VALUES.UNKNOWN}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex justify-between mt-2">
                          <span>最終点検日</span>
                          <span className="font-medium">
                            {currentStorageData.state?.inspection_date
                              ? new Date(
                                  currentStorageData.state.inspection_date
                                ).toLocaleDateString()
                              : PLACEHOLDER_VALUES.UNKNOWN}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
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

        <StorageAssignmentModal
          selectedSlot={selectedSlot}
          open={showAssignmentModal}
          onOpenChange={setShowAssignmentModal}
          onAssign={handleStorageAssignment}
          setSelectedSlot={setSelectedSlot}
          onUpdateFromHistory={onUpdateFromHistory}
          assignFromManual={assignFromManual}
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
