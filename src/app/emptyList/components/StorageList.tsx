"use client";

import { Badge } from "@/components/ui/badge";
import type { StorageData } from "@/utils/interface";

interface StorageListProps {
  slots: StorageData[];
  selectedSlot: StorageData | null;
  onSlotSelect: (slot: StorageData | null) => void;
}

export const StorageList = ({
  slots,
  selectedSlot,
  onSlotSelect,
}: StorageListProps) => {
  const getStatusColor = (slot: StorageData) => {
    const isOccupied =
      slot.car_id !== null ||
      slot.client_id !== null ||
      slot.tire_state_id !== null;
    return isOccupied ? "bg-red-500" : "bg-green-500";
  };

  const getStatusText = (slot: StorageData) => {
    const isOccupied =
      slot.car_id !== null ||
      slot.client_id !== null ||
      slot.tire_state_id !== null;
    return isOccupied ? "使用中" : "空き";
  };

  return (
    <div className="max-h-96 overflow-y-auto">
      <div className="space-y-2">
        {slots.map((slot) => (
          <div
            key={slot.id}
            className={`p-3 border rounded-lg cursor-pointer transition-colors ${
              selectedSlot?.id === slot.id
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200 hover:bg-gray-50"
            }`}
            onClick={() =>
              onSlotSelect(selectedSlot?.id === slot.id ? null : slot)
            }
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div
                  className={`w-3 h-3 rounded ${getStatusColor(slot)}`}
                ></div>
                <span className="font-medium">{slot.id}</span>
                <Badge variant="outline">{getStatusText(slot)}</Badge>
              </div>
              {(slot.car_id !== null ||
                slot.client_id !== null ||
                slot.tire_state_id !== null) && (
                <div className="text-sm text-gray-600">使用中</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
