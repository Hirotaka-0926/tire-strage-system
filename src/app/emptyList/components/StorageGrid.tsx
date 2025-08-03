"use client";

import type { StorageData } from "@/utils/interface";

interface StorageGridProps {
  slots: StorageData[];
  selectedSlot: StorageData | null;
  onSlotSelect: (slot: StorageData | null) => void;
}

export const StorageGrid = ({
  slots,
  selectedSlot,
  onSlotSelect,
}: StorageGridProps) => {
  const getSlotStyle = (slot: StorageData, isSelected: boolean) => {
    const baseStyle =
      "relative w-8 h-8 rounded border cursor-pointer transition-all duration-150 hover:scale-110 hover:z-10 flex items-center justify-center text-[10px] font-medium";

    if (isSelected) {
      return `${baseStyle} border-2 border-blue-500 bg-blue-100 text-blue-800 shadow-lg scale-110 z-10`;
    }

    const isOccupied =
      slot.car_id !== null ||
      slot.client_id !== null ||
      slot.tire_state_id !== null;

    if (isOccupied) {
      return `${baseStyle} border-red-300 bg-red-100 text-red-700 hover:bg-red-200`;
    } else {
      return `${baseStyle} border-green-300 bg-green-50 text-green-700 hover:bg-green-100`;
    }
  };

  const getStatusText = (slot: StorageData) => {
    const isOccupied =
      slot.car_id !== null ||
      slot.client_id !== null ||
      slot.tire_state_id !== null;
    return isOccupied ? "使用中" : "空き";
  };

  // グリッド表示用のスロットを20列で区切る
  const renderGridSlots = (slots: StorageData[]) => {
    const rows = [];
    const slotsPerRow = 20;

    for (let i = 0; i < slots.length; i += slotsPerRow) {
      const rowSlots = slots.slice(i, i + slotsPerRow);
      rows.push(
        <div key={i} className="flex gap-1 mb-1">
          {rowSlots.map((slot) => (
            <div
              key={slot.id}
              className={getSlotStyle(slot, selectedSlot?.id === slot.id)}
              onClick={() =>
                onSlotSelect(selectedSlot?.id === slot.id ? null : slot)
              }
              title={`${slot.id} - ${getStatusText(slot)}`}
            >
              {slot.id.split("_")[1]}
            </div>
          ))}
        </div>
      );
    }
    return rows;
  };

  return (
    <div className="max-h-96 overflow-y-auto">{renderGridSlots(slots)}</div>
  );
};
