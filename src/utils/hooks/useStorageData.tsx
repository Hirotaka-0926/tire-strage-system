"use client";

import { useState } from "react";
import type { StorageSlot, AreaConfig } from "@/utils/storage";

// 初期エリア設定
const initialAreas: AreaConfig[] = [
  { name: "A", totalSlots: 300, color: "blue" },
  { name: "B", totalSlots: 300, color: "green" },
];

// サンプルデータ生成
const generateStorageData = (areas: AreaConfig[]): StorageSlot[] => {
  const data: StorageSlot[] = [];

  for (const area of areas) {
    for (let i = 1; i <= area.totalSlots; i++) {
      const number = i;
      const id = `${area.name}_${number.toString().padStart(3, "0")}`;

      // ランダムにステータスを設定（70%空き、30%使用中）
      const status = Math.random() > 0.3 ? "available" : "occupied";

      // 使用中の場合は顧客情報を追加
      const customerInfo =
        status === "occupied"
          ? {
              customerName: `顧客${Math.floor(Math.random() * 1000) + 1}`,
              phoneNumber: `090-${Math.floor(Math.random() * 9000) + 1000}-${
                Math.floor(Math.random() * 9000) + 1000
              }`,
              tireType: ["夏タイヤ", "冬タイヤ", "オールシーズン"][
                Math.floor(Math.random() * 3)
              ],
              storageDate: new Date(
                2024,
                Math.floor(Math.random() * 12),
                Math.floor(Math.random() * 28) + 1
              ).toLocaleDateString("ja-JP"),
              notes: Math.random() > 0.8 ? "要注意" : "",
            }
          : undefined;

      data.push({
        id,
        status,
        area: area.name,
        number,
        customerInfo,
        lastUpdated: new Date(
          2024,
          Math.floor(Math.random() * 12),
          Math.floor(Math.random() * 28) + 1
        ).toLocaleDateString("ja-JP"),
      });
    }
  }

  return data;
};

export const useStorageData = () => {
  const [areas, setAreas] = useState<AreaConfig[]>(initialAreas);
  const [slots, setSlots] = useState<StorageSlot[]>(() =>
    generateStorageData(initialAreas)
  );

  const addArea = (areaName: string, totalSlots: number) => {
    const newArea: AreaConfig = {
      name: areaName,
      totalSlots,
      color: ["purple", "orange", "pink", "indigo"][
        Math.floor(Math.random() * 4)
      ],
    };

    setAreas((prev) => [...prev, newArea]);

    // 新しいエリアのスロットを生成
    const newSlots: StorageSlot[] = [];
    for (let i = 1; i <= totalSlots; i++) {
      const id = `${areaName}_${i.toString().padStart(3, "0")}`;
      newSlots.push({
        id,
        status: "available",
        area: areaName,
        number: i,
        lastUpdated: new Date().toLocaleDateString("ja-JP"),
      });
    }

    setSlots((prev) => [...prev, ...newSlots]);
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
    const existingSlots = slots.filter((s) => s.area === areaName);
    const nextNumber = existingSlots.length + 1;
    const newSlots: StorageSlot[] = [];

    for (let i = 0; i < additionalSlots; i++) {
      const number = nextNumber + i;
      const id = `${areaName}_${number.toString().padStart(3, "0")}`;
      newSlots.push({
        id,
        status: "available",
        area: areaName,
        number,
        lastUpdated: new Date().toLocaleDateString("ja-JP"),
      });
    }

    setSlots((prev) => [...prev, ...newSlots]);
  };

  const updateSlot = (slotId: string, updates: Partial<StorageSlot>) => {
    setSlots((prev) =>
      prev.map((slot) =>
        slot.id === slotId
          ? {
              ...slot,
              ...updates,
              lastUpdated: new Date().toLocaleDateString("ja-JP"),
            }
          : slot
      )
    );
  };

  return {
    areas,
    slots,
    addArea,
    addSlotsToArea,
    updateSlot,
  };
};
