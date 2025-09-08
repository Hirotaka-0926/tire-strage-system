"use client";

import { useEffect, useState } from "react";
import { History, Calendar, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getLogsByStorageId } from "@/utils/supabaseFunction";
import { useStorageToPdf } from "@/utils/hooks/useStorageToPdf";
import type { StorageData } from "@/utils/interface";
import type { StorageLogInput } from "@/utils/interface";
import { on } from "events";

interface HistoryModalProps {
  selectedSlot: StorageData | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAssign: (slotId: string, log: StorageData) => void;
  setAlertMessage: (
    message: { type: "success" | "error"; message: string } | null
  ) => void;
}

export const HistoryModal = ({
  selectedSlot,
  open,
  onOpenChange,
  onAssign,
  setAlertMessage,
}: HistoryModalProps) => {
  const [logs, setLogs] = useState<StorageLogInput[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { renderPDFDownloadLink } = useStorageToPdf();

  useEffect(() => {
    if (open && selectedSlot) {
      loadLogs();
    }
  }, [open, selectedSlot]);

  const loadLogs = async () => {
    if (!selectedSlot) return;

    setIsLoading(true);
    try {
      const storageId = selectedSlot.id;
      const logsData = await getLogsByStorageId(storageId);
      setLogs(logsData || []);
    } catch (error) {
      console.error("履歴の取得に失敗しました:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getSeasonBadge = (season: string) => {
    if (season === "summer") {
      return <Badge className="bg-orange-500">夏</Badge>;
    } else if (season === "winter") {
      return <Badge className="bg-blue-500">冬</Badge>;
    }
    return <Badge variant="outline">不明</Badge>;
  };

  const assignHistory = (log: StorageLogInput) => {
    if (!selectedSlot) return;
    if (
      selectedSlot.client_id ||
      selectedSlot.car_id ||
      selectedSlot.tire_state_id
    ) {
      setAlertMessage({
        type: "error",
        message: "既にデータが存在するため、履歴を挿入できません。",
      });
      setTimeout(() => setAlertMessage(null), 3000);

      return;
    }
    const newSlot: StorageData = {
      id: selectedSlot.id,
      client_id: log.client && log.client.id ? log.client.id : null,
      car_id: log.car && log.car.id ? log.car.id : null,
      tire_state_id: log.state && log.state.id ? log.state.id : null,
    };
    onAssign(selectedSlot.id, newSlot);
    setAlertMessage({
      type: "success",
      message: "履歴からの割り当てが完了しました",
    });
    setTimeout(() => {
      onOpenChange(false);
      setAlertMessage(null);
    }, 1500);
  };

  return (
    <div className="space-y-4">
      {isLoading ? (
        <div className="text-center py-8">
          <p>履歴を読み込み中...</p>
        </div>
      ) : logs.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <History className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p>保管履歴がありません</p>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600">
              {logs.length}件の履歴が見つかりました
            </p>
          </div>

          <div className="grid gap-4">
            {logs.map((log, index) => (
              <Card
                key={`${log.id}-${index}`}
                className="border border-gray-200 touch-manipulation"
              >
                <CardHeader className="pb-2">
                  <CardTitle className="text-base sm:text-lg flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4" />
                      <span>{log.year}年度</span>
                      {getSeasonBadge(log.season)}
                    </div>
                    <div className="text-base text-gray-500">
                      {/* {log.created_at && formatDate(log.created_at)} */}
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {/* 顧客情報 */}
                  {log.client && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 p-3 bg-gray-50 rounded-lg">
                      <div>
                        <label className="text-sm font-semibold text-gray-700 block mb-1">
                          お客様名
                        </label>
                        <p className="text-sm">{log.client.client_name}</p>
                      </div>
                      <div>
                        <label className="text-sm font-semibold text-gray-700 block mb-1">
                          住所
                        </label>
                        <p className="text-sm">{log.client.address}</p>
                      </div>
                    </div>
                  )}

                  {/* 車両情報 */}
                  {log.car && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 p-3 bg-blue-50 rounded-lg">
                      <div>
                        <label className="text-sm font-semibold text-gray-700 block mb-1">
                          車種
                        </label>
                        <p className="text-sm">{log.car.car_model}</p>
                      </div>
                      <div>
                        <label className="text-sm font-semibold text-gray-700 block mb-1">
                          車両番号
                        </label>
                        <p className="text-sm">{log.car.car_number}</p>
                      </div>
                    </div>
                  )}

                  {/* タイヤ情報 */}
                  {log.state && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 p-3 bg-green-50 rounded-lg">
                      <div>
                        <label className="text-sm font-semibold text-gray-700 block mb-1">
                          メーカー
                        </label>
                        <p className="text-sm">{log.state.tire_maker}</p>
                      </div>
                      <div>
                        <label className="text-sm font-semibold text-gray-700 block mb-1">
                          パターン
                        </label>
                        <p className="text-sm">{log.state.tire_pattern}</p>
                      </div>
                      <div>
                        <label className="text-sm font-semibold text-gray-700 block mb-1">
                          サイズ
                        </label>
                        <p className="text-sm">{log.state.tire_size}</p>
                      </div>
                    </div>
                  )}

                  <div className="flex justify-end gap-2 pt-2">
                    <Button onClick={() => assignHistory(log)}>
                      履歴を挿入
                    </Button>
                    {renderPDFDownloadLink(
                      log,
                      `${selectedSlot?.id}_${log.year}年_${log.season}.pdf`
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
};
