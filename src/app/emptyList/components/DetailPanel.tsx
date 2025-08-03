"use client";

import { Info, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { StorageData } from "@/utils/interface";

interface DetailPanelProps {
  selectedSlot: StorageData | null;
  onUpdateSlot: (slotId: string, updates: Partial<StorageData>) => void;
}

export const DetailPanel = ({
  selectedSlot,
  onUpdateSlot,
}: DetailPanelProps) => {
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

  const handleStatusToggle = () => {
    if (!selectedSlot) return;
    const isCurrentlyOccupied =
      selectedSlot.car_id !== null ||
      selectedSlot.client_id !== null ||
      selectedSlot.tire_state_id !== null;
    if (isCurrentlyOccupied) {
      // 空きにする
      onUpdateSlot(selectedSlot.id, {
        car_id: null,
        client_id: null,
        tire_state_id: null,
      });
    }
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
              <Badge className={`mt-1 ${getStatusColor(selectedSlot)}`}>
                {getStatusText(selectedSlot)}
              </Badge>
            </div>

            {(selectedSlot.car_id !== null ||
              selectedSlot.client_id !== null ||
              selectedSlot.tire_state_id !== null) && (
              <div className="space-y-3 border-t pt-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    保管庫ID
                  </label>
                  <p className="text-sm">{selectedSlot.id}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    車両ID
                  </label>
                  <p className="text-sm">{selectedSlot.car_id}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    顧客ID
                  </label>
                  <p className="text-sm">{selectedSlot.client_id}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    タイヤ状態ID
                  </label>
                  <p className="text-sm">{selectedSlot.tire_state_id}</p>
                </div>
              </div>
            )}

            <div className="border-t pt-4">
              <label className="text-sm font-medium text-gray-600">
                保管庫の状態
              </label>
              <p className="text-sm">{getStatusText(selectedSlot)}</p>
            </div>

            <div className="flex space-x-2 pt-4">
              <Button size="sm" className="flex-1" onClick={handleStatusToggle}>
                {selectedSlot.car_id !== null ||
                selectedSlot.client_id !== null ||
                selectedSlot.tire_state_id !== null
                  ? "空きにする"
                  : "使用中"}
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
