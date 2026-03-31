"use client";

import { useEffect, useMemo, useState } from "react";
import { History, Calendar, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { createStorageDetailApplication } from "@/app/refactor/application/storage/storageDetailApplication";
import { useStorageToPdf } from "@/utils/hooks/useStorageToPdf";
import type { StorageSlot } from "@/app/refactor/domain/type/storage";
import type { StorageLogInput } from "@/utils/interface";

interface HistoryModalProps {
  selectedSlot: StorageSlot | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAssign: (slotId: string, log: StorageSlot) => void;
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
  const storageDetailApplication = useMemo(() => createStorageDetailApplication(), []);
  const [logs, setLogs] = useState<StorageLogInput[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { renderPDFDownloadLink } = useStorageToPdf();

  useEffect(() => {
    if (open && selectedSlot) {
      loadLogs();
    }
  }, [open, selectedSlot, storageDetailApplication]);

  const loadLogs = async () => {
    if (!selectedSlot) return;

    setIsLoading(true);
    try {
      const storageId = selectedSlot.id;
      const logsData = await storageDetailApplication.getLogsByStorageId(storageId);
      setLogs(logsData || []);
    } catch (error) {
      console.error("螻･豁ｴ縺ｮ蜿門ｾ励↓螟ｱ謨励＠縺ｾ縺励◆:", error);
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
        message: "既にデータが入っているため、履歴は適用できません。",
      });
      setTimeout(() => setAlertMessage(null), 3000);

      return;
    }
    const newSlot: StorageSlot = {
      id: selectedSlot.id,
      client_id: log.client && log.client.id ? log.client.id : null,
      car_id: log.car && log.car.id ? log.car.id : null,
      tire_state_id: log.state && log.state.id ? log.state.id : null,
    };
    onAssign(selectedSlot.id, newSlot);
    setAlertMessage({
      type: "success",
      message: "螻･豁ｴ縺九ｉ縺ｮ蜑ｲ繧雁ｽ薙※縺悟ｮ御ｺ・＠縺ｾ縺励◆",
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
          <p>螻･豁ｴ繧定ｪｭ縺ｿ霎ｼ縺ｿ荳ｭ...</p>
        </div>
      ) : logs.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <History className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p>菫晉ｮ｡螻･豁ｴ縺後≠繧翫∪縺帙ｓ</p>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600">
              {logs.length}莉ｶ縺ｮ螻･豁ｴ縺瑚ｦ九▽縺九ｊ縺ｾ縺励◆
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
                      <span>{log.year}蟷ｴ蠎ｦ</span>
                      {getSeasonBadge(log.season)}
                    </div>
                    <div className="text-base text-gray-500">
                      {/* {log.created_at && formatDate(log.created_at)} */}
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {/* 鬘ｧ螳｢諠・ｱ */}
                  {log.client && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 p-3 bg-gray-50 rounded-lg">
                      <div>
                        <label className="text-sm font-semibold text-gray-700 block mb-1">
                          縺雁ｮ｢讒伜錐
                        </label>
                        <p className="text-sm">{log.client.client_name}</p>
                      </div>
                      <div>
                        <label className="text-sm font-semibold text-gray-700 block mb-1">
                          菴乗園
                        </label>
                        <p className="text-sm">{log.client.address}</p>
                      </div>
                    </div>
                  )}

                  {/* 霆贋ｸ｡諠・ｱ */}
                  {log.car && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 p-3 bg-blue-50 rounded-lg">
                      <div>
                        <label className="text-sm font-semibold text-gray-700 block mb-1">
                          霆顔ｨｮ
                        </label>
                        <p className="text-sm">{log.car.car_model}</p>
                      </div>
                      <div>
                        <label className="text-sm font-semibold text-gray-700 block mb-1">
                          霆贋ｸ｡逡ｪ蜿ｷ
                        </label>
                        <p className="text-sm">{log.car.car_number}</p>
                      </div>
                    </div>
                  )}

                  {/* 繧ｿ繧､繝､諠・ｱ */}
                  {log.state && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 p-3 bg-green-50 rounded-lg">
                      <div>
                        <label className="text-sm font-semibold text-gray-700 block mb-1">
                          繝｡繝ｼ繧ｫ繝ｼ
                        </label>
                        <p className="text-sm">{log.state.tire_maker}</p>
                      </div>
                      <div>
                        <label className="text-sm font-semibold text-gray-700 block mb-1">
                          繝代ち繝ｼ繝ｳ
                        </label>
                        <p className="text-sm">{log.state.tire_pattern}</p>
                      </div>
                      <div>
                        <label className="text-sm font-semibold text-gray-700 block mb-1">
                          繧ｵ繧､繧ｺ
                        </label>
                        <p className="text-sm">{log.state.tire_size}</p>
                      </div>
                    </div>
                  )}

                  <div className="flex justify-end gap-2 pt-2">
                    <Button onClick={() => assignHistory(log)}>
                      螻･豁ｴ繧呈諺蜈･
                    </Button>
                    {renderPDFDownloadLink(
                      log,
                      `${selectedSlot?.id}_${log.year}蟷ｴ_${log.season}.pdf`
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


