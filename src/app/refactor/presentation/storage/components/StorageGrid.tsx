"use client";

import type { StorageSlot } from "@/app/refactor/domain/type/storage";

interface StorageGridProps {
  slots: StorageSlot[];
  selectedSlot: StorageSlot | null;
  onSlotSelect: (slot: StorageSlot | null) => void;
}

export const StorageGrid = ({ slots, selectedSlot, onSlotSelect }: StorageGridProps) => {
  const getSlotStyle = (slot: StorageSlot, isSelected: boolean) => {
    const baseStyle =
      "relative h-8 w-8 cursor-pointer rounded border text-[10px] font-medium transition-all duration-150 hover:z-10 hover:scale-110 flex items-center justify-center";

    if (isSelected) {
      return `${baseStyle} z-10 scale-110 border-2 border-blue-500 bg-blue-100 text-blue-800 shadow-lg`;
    }

    const isOccupied = slot.car_id !== null || slot.client_id !== null || slot.tire_state_id !== null;
    return isOccupied
      ? `${baseStyle} border-red-300 bg-red-100 text-red-700 hover:bg-red-200`
      : `${baseStyle} border-green-300 bg-green-50 text-green-700 hover:bg-green-100`;
  };

  const getStatusText = (slot: StorageSlot) => {
    const isOccupied = slot.car_id !== null || slot.client_id !== null || slot.tire_state_id !== null;
    return isOccupied ? "使用中" : "空き";
  };

  const renderGridSlots = (gridSlots: StorageSlot[]) => {
    const rows = [];
    const slotsPerRow = 20;

    for (let i = 0; i < gridSlots.length; i += slotsPerRow) {
      const rowSlots = gridSlots.slice(i, i + slotsPerRow);
      rows.push(
        <div key={i} className="mb-1 flex gap-1">
          {rowSlots.map((slot) => (
            <div
              key={slot.id}
              className={getSlotStyle(slot, selectedSlot?.id === slot.id)}
              onClick={() => onSlotSelect(selectedSlot?.id === slot.id ? null : slot)}
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

  return <div className="max-h-96 overflow-y-auto">{renderGridSlots(slots)}</div>;
};
