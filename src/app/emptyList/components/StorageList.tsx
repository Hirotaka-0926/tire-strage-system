"use client";

import { Badge } from "@/components/ui/badge";
import type { StorageSlot } from "@/utils/storage";

interface StorageListProps {
  slots: StorageSlot[];
  selectedSlot: StorageSlot | null;
  onSlotSelect: (slot: StorageSlot | null) => void;
}

export const StorageList = ({
  slots,
  selectedSlot,
  onSlotSelect,
}: StorageListProps) => {
  const getStatusColor = (status: string) => {
    return status === "available" ? "bg-green-500" : "bg-red-500";
  };

  const getStatusText = (status: string) => {
    return status === "available" ? "空き" : "使用中";
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
                  className={`w-3 h-3 rounded ${getStatusColor(slot.status)}`}
                ></div>
                <span className="font-medium">{slot.id}</span>
                <Badge variant="outline">{getStatusText(slot.status)}</Badge>
              </div>
              {slot.customerInfo && (
                <div className="text-sm text-gray-600">
                  {slot.customerInfo.customerName}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
