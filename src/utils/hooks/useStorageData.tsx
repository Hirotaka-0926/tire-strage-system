"use client";

import { useState } from "react";
import type { AreaConfig } from "@/utils/storage";
import type { StorageData } from "../interface";
import { toast } from "sonner";
import { addNewStorage } from "../supabaseFunction";

export const useStorageData = (
  initialAreas: AreaConfig[],
  initialSlots: StorageData[]
) => {
  const [areas, setAreas] = useState<AreaConfig[]>(initialAreas);
  const [slots, setSlots] = useState<StorageData[]>(initialSlots);

  const addArea = async (areaName: string, totalSlots: number) => {
    const newArea: AreaConfig = {
      name: areaName,
      totalSlots,
    };

    setAreas((prev) => [...prev, newArea]);

    // 新しいエリアのスロットを生成
    const newSlots: StorageData[] = [];
    for (let i = 1; i <= totalSlots; i++) {
      const id = `${areaName}_${i.toString().padStart(3, "0")}`;
      newSlots.push({
        id: id,
        client_id: null,
        car_id: null,
        tire_state_id: null,
      });
    }
    const error = await addNewStorage(newSlots);

    if (error) {
      toast("エリアの追加に失敗しました", {
        description: error.message,
      });
    }
  };

  const addSlotsToArea = async (areaName: string, additionalSlots: number) => {
    const area = areas.find((a) => a.name === areaName);
    if (!area) return;

    // エリア設定を更新
    setAreas((prev) =>
      prev.map((a) =>
        a.name === areaName
          ? { ...a, totalSlots: a.totalSlots + additionalSlots }
          : a
      )
    );

    // 新しいスロットを追加
    const existingSlotsLength = area.totalSlots;
    const nextNumber = existingSlotsLength + 1;
    const newSlots: StorageData[] = [];

    for (let i = 0; i < additionalSlots; i++) {
      const number = nextNumber + i;
      const id = `${areaName}_${number.toString().padStart(3, "0")}`;
      newSlots.push({
        id: id,
        client_id: null,
        car_id: null,
        tire_state_id: null,
      });
    }

    const error = await addNewStorage(newSlots);
    if (error) {
      toast("スロットの追加に失敗しました", {
        description: error.message,
      });
    }
  };

  const updateSlot = (slotId: string, updates: Partial<StorageData>) => {
    setSlots((prev) =>
      prev.map((slot) =>
        slot.id === slotId
          ? {
              ...slot,
              ...updates,
            }
          : slot
      )
    );
  };

  const updateSlots = (newSlots: StorageData[]) => {
    setSlots(newSlots);
  };

  return {
    areas,
    slots,
    addArea,
    addSlotsToArea,
    updateSlot,
    updateSlots,
  };
};
