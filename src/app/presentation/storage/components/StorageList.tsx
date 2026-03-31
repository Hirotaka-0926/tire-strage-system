"use client";

import { Badge } from "@/components/ui/badge";
import type { StorageSlot } from "@/app/domain/type/storage";

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
  const isOccupied = (slot: StorageSlot) =>
    slot.car_id !== null ||
    slot.client_id !== null ||
    slot.tire_state_id !== null;

  return (
    <div className="max-h-96 overflow-y-auto">
      <div className="space-y-2">
        {slots.map((slot) => (
          <div
            key={slot.id}
            className={`cursor-pointer rounded-lg border p-3 transition-colors ${
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
                  className={`h-3 w-3 rounded ${isOccupied(slot) ? "bg-red-500" : "bg-green-500"}`}
                />
                <span className="font-medium">{slot.id}</span>
                <Badge variant="outline">
                  {isOccupied(slot) ? "使用中" : "空き"}
                </Badge>
              </div>
              {isOccupied(slot) && (
                <div className="text-sm text-gray-600">使用中</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
