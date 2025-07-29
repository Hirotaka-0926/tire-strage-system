"use client";

import { Info, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { StorageSlot } from "@/utils/storage";

interface DetailPanelProps {
  selectedSlot: StorageSlot | null;
  onUpdateSlot: (slotId: string, updates: Partial<StorageSlot>) => void;
}

export const DetailPanel = ({
  selectedSlot,
  onUpdateSlot,
}: DetailPanelProps) => {
  const getStatusText = (status: string) => {
    return status === "available" ? "空き" : "使用中";
  };

  const handleStatusToggle = () => {
    if (!selectedSlot) return;
    const newStatus =
      selectedSlot.status === "available" ? "occupied" : "available";
    onUpdateSlot(selectedSlot.id, { status: newStatus });
  };

  return (
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
            <div>
              <h3 className="font-semibold text-lg">{selectedSlot.id}</h3>
              <Badge
                className={`mt-1 ${
                  selectedSlot.status === "available"
                    ? "bg-green-500"
                    : "bg-red-500"
                }`}
              >
                {getStatusText(selectedSlot.status)}
              </Badge>
            </div>

            {selectedSlot.customerInfo && (
              <div className="space-y-3 border-t pt-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    顧客名
                  </label>
                  <p className="text-sm">
                    {selectedSlot.customerInfo.customerName}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    電話番号
                  </label>
                  <p className="text-sm">
                    {selectedSlot.customerInfo.phoneNumber}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    タイヤ種類
                  </label>
                  <p className="text-sm">
                    {selectedSlot.customerInfo.tireType}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    保管開始日
                  </label>
                  <p className="text-sm">
                    {selectedSlot.customerInfo.storageDate}
                  </p>
                </div>
                {selectedSlot.customerInfo.notes && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      備考
                    </label>
                    <p className="text-sm text-red-600">
                      {selectedSlot.customerInfo.notes}
                    </p>
                  </div>
                )}
              </div>
            )}

            <div className="border-t pt-4">
              <label className="text-sm font-medium text-gray-600">
                最終更新
              </label>
              <p className="text-sm">{selectedSlot.lastUpdated}</p>
            </div>

            <div className="flex space-x-2 pt-4">
              <Button size="sm" className="flex-1" onClick={handleStatusToggle}>
                {selectedSlot.status === "available"
                  ? "使用中にする"
                  : "空きにする"}
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="flex-1 bg-transparent"
              >
                履歴
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center text-gray-500 py-8">
            <MapPin className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>区画を選択して詳細を表示</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
