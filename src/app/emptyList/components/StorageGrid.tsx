"use client";

import type { StorageSlot } from "@/utils/storage";

interface StorageGridProps {
  slots: StorageSlot[];
  selectedSlot: StorageSlot | null;
  onSlotSelect: (slot: StorageSlot | null) => void;
}

export const StorageGrid = ({
  slots,
  selectedSlot,
  onSlotSelect,
}: StorageGridProps) => {
  const getSlotStyle = (status: string, isSelected: boolean) => {
    const baseStyle =
      "relative w-8 h-8 rounded border cursor-pointer transition-all duration-150 hover:scale-110 hover:z-10 flex items-center justify-center text-[10px] font-medium";

    if (isSelected) {
      return `${baseStyle} border-2 border-blue-500 bg-blue-100 text-blue-800 shadow-lg scale-110 z-10`;
    }

    switch (status) {
      case "available":
        return `${baseStyle} border-green-300 bg-green-50 text-green-700 hover:bg-green-100`;
      case "occupied":
        return `${baseStyle} border-red-300 bg-red-100 text-red-700 hover:bg-red-200`;
      default:
        return `${baseStyle} border-gray-300 bg-gray-50 text-gray-600`;
    }
  };

  const getStatusText = (status: string) => {
    return status === "available" ? "空き" : "使用中";
  };

  // グリッド表示用のスロットを20列で区切る
  const renderGridSlots = (slots: StorageSlot[]) => {
    const rows = [];
    const slotsPerRow = 20;

    for (let i = 0; i < slots.length; i += slotsPerRow) {
      const rowSlots = slots.slice(i, i + slotsPerRow);
      rows.push(
        <div key={i} className="flex gap-1 mb-1">
          {rowSlots.map((slot) => (
            <div
              key={slot.id}
              className={getSlotStyle(
                slot.status,
                selectedSlot?.id === slot.id
              )}
              onClick={() =>
                onSlotSelect(selectedSlot?.id === slot.id ? null : slot)
              }
              title={`${slot.id} - ${getStatusText(slot.status)}${
                slot.customerInfo ? ` - ${slot.customerInfo.customerName}` : ""
              }`}
            >
              {slot.number}
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
