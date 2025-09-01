"use client";

import { useEffect, useState } from "react";
import { History, Calendar, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { getLogsByStorageId } from "@/utils/supabaseFunction";
import { useStorageToPdf } from "@/utils/hooks/useStorageToPdf";
import type { StorageData } from "@/utils/interface";
import type { StorageLogInput } from "@/utils/interface";

interface HistoryModalProps {
  selectedSlot: StorageData | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const HistoryModal = ({
  selectedSlot,
  open,
  onOpenChange,
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ja-JP", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getSeasonBadge = (season: string) => {
    if (season === "summer") {
      return <Badge className="bg-orange-500">夏</Badge>;
    } else if (season === "winter") {
      return <Badge className="bg-blue-500">冬</Badge>;
    }
    return <Badge variant="outline">不明</Badge>;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto w-[95vw] sm:w-[90vw]">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <History className="w-5 h-5 mr-2" />
            保管履歴 - {selectedSlot?.id}
          </DialogTitle>
        </DialogHeader>

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
                {logs.length > 0 && (
                  <div className="flex items-center space-x-2">
                    {renderPDFDownloadLink(
                      logs,
                      `${selectedSlot?.id}_履歴.pdf`,
                      "履歴をPDFで印刷"
                    )}
                  </div>
                )}
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

                      {/* PDF印刷ボタン */}
                      <div className="flex justify-end pt-2">
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
      </DialogContent>
    </Dialog>
  );
};
