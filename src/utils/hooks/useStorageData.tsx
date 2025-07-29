"use client";

import { useState } from "react";
import type { AreaConfig } from "@/utils/storage";
import type { StorageData } from "../interface";

export const useStorageData = (
  initialAreas: AreaConfig[],
  initialSlots: StorageData[]
) => {
  const [areas, setAreas] = useState<AreaConfig[]>(initialAreas);
  const [slots, setSlots] = useState<StorageData[]>(() =>
    initialSlots.map((slot) => ({
      ...slot,
    }))
  );

  const addArea = (areaName: string, totalSlots: number) => {
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

    //addNewStorageArea
  };

  const addSlotsToArea = (areaName: string, additionalSlots: number) => {
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
    //const existingSlots =  getExsitingSlots(areaName);
    const nextNumber = existingSlots.length + 1;
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

    //addSlotsToArea
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
