import {
  StorageAreaConfig,
  StorageSlot,
} from "@/app/refactor/domain/type/storage";

export const mapStorageSlotFromSupabase = (row: any): StorageSlot => ({
  id: row?.id ?? "",
  car_id: row?.car_id ?? null,
  client_id: row?.client_id ?? null,
  tire_state_id: row?.tire_state_id ?? null,
});

export const mapAreaConfigsFromStorageIds = (rows: Array<{ id: string }>): StorageAreaConfig[] => {
  const areaMap = new Map<string, number>();

  rows.forEach((row) => {
    const areaName = row.id.split("_")[0];
    areaMap.set(areaName, (areaMap.get(areaName) || 0) + 1);
  });

  return Array.from(areaMap.entries())
    .map(([name, totalSlots]) => ({ name, totalSlots }))
    .sort((a, b) => a.name.localeCompare(b.name));
};
