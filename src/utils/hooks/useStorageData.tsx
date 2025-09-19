"use client";

import { useState, useEffect } from "react";
import type { AreaConfig } from "@/utils/storage";
import type { StorageData } from "../interface";
import { toast } from "sonner";
import { addNewStorage, upsertStorage, upsertTire } from "../supabaseFunction";
import { useRouter } from "next/navigation";
import { StorageInput, State } from "../interface";

export const useStorageData = (
  initialAreas: AreaConfig[],
  initialSlots: StorageData[]
) => {
  const [areas, setAreas] = useState<AreaConfig[]>(initialAreas);
  const [slots, setSlots] = useState<StorageData[]>(initialSlots);
  const router = useRouter();

  useEffect(() => {
    setAreas(initialAreas);
    setSlots(initialSlots);
  }, [initialAreas, initialSlots]);

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
    } else {
      // UIにスロットを即座に反映
      setSlots((prev) => [...prev, ...newSlots]);
      toast("エリアの追加が完了しました", {
        description: `エリア${areaName}に${totalSlots}個のスロットを作成しました`,
      });
    }
  };

  const findMissingSlotNumbers = (areaName: string): number[] => {
    const existingSlots = slots.filter((slot) =>
      slot.id.startsWith(`${areaName}_`)
    );
    const existingNumbers = existingSlots
      .map((slot) => {
        const match = slot.id.match(/_(\d+)$/);
        return match ? parseInt(match[1]) : 0;
      })
      .filter((num) => num > 0);

    if (existingNumbers.length === 0) return [];

    // 実際の最大スロット番号を取得
    const maxExistingNumber = Math.max(...existingNumbers);

    const missingNumbers: number[] = [];
    for (let i = 1; i <= maxExistingNumber; i++) {
      if (!existingNumbers.includes(i)) {
        missingNumbers.push(i);
      }
    }

    return missingNumbers.sort((a, b) => a - b);
  };

  const addSlotsToArea = async (areaName: string, additionalSlots: number) => {
    const area = areas.find((a) => a.name === areaName);
    if (!area) return;

    // 既存のエリア内で穴（欠番）を検出
    const missingNumbers = findMissingSlotNumbers(areaName);

    const newSlots: StorageData[] = [];
    let slotsToAdd = additionalSlots;

    // 1. 穴があれば優先的に埋める
    const holesCanFill = Math.min(missingNumbers.length, slotsToAdd);
    for (let i = 0; i < holesCanFill; i++) {
      const number = missingNumbers[i];
      const id = `${areaName}_${number.toString().padStart(3, "0")}`;
      newSlots.push({
        id: id,
        client_id: null,
        car_id: null,
        tire_state_id: null,
      });
    }
    slotsToAdd -= holesCanFill;

    // 2. 残りのスロットは連続したIDで追加
    let nextNumber = area.totalSlots + 1;
    if (slotsToAdd > 0) {
      // 既存スロットの実際の最大番号を確認
      const existingSlots = slots.filter((slot) =>
        slot.id.startsWith(`${areaName}_`)
      );
      if (existingSlots.length > 0) {
        const existingNumbers = existingSlots
          .map((slot) => {
            const match = slot.id.match(/_(\d+)$/);
            return match ? parseInt(match[1]) : 0;
          })
          .filter((num) => num > 0);
        const maxExistingNumber = Math.max(...existingNumbers);
        nextNumber = Math.max(nextNumber, maxExistingNumber + 1);
      }

      for (let i = 0; i < slotsToAdd; i++) {
        const number = nextNumber + i;
        const id = `${areaName}_${number.toString().padStart(3, "0")}`;
        newSlots.push({
          id: id,
          client_id: null,
          car_id: null,
          tire_state_id: null,
        });
      }

      // エリア設定を更新（連続追加分のみ増加）
      setAreas((prev) =>
        prev.map((a) =>
          a.name === areaName
            ? { ...a, totalSlots: nextNumber + slotsToAdd - 1 }
            : a
        )
      );
    }

    const error = await addNewStorage(newSlots);
    if (error) {
      toast("スロットの追加に失敗しました", {
        description: error.message,
      });
    } else {
      // UIにスロットを即座に反映
      setSlots((prev) => [...prev, ...newSlots]);

      const filledHoles =
        holesCanFill > 0 ? `${holesCanFill}個の穴を埋め、` : "";
      const addedNew =
        slotsToAdd > 0 ? `${slotsToAdd}個の新規スロットを追加` : "";
      const message =
        filledHoles || addedNew
          ? `${filledHoles}${addedNew}しました`
          : "スロットを追加しました";
      toast(`スロットの追加が完了しました`, {
        description: `エリア${areaName}: ${message}`,
      });
    }
  };

  const updateSlot = async (slotId: string, updates: Partial<StorageData>) => {
    const newSlot = { ...updates };
    newSlot.id = slotId;

    // StorageData を保存
    await upsertStorage(newSlot);

    // stateData があれば、State を保存

    router.refresh();
  };

  const updateSlots = (newSlots: StorageData[]) => {
    setSlots(newSlots);
  };

  const assignFromHistory = async (
    slotId: string,
    historyData: Partial<StorageData>
  ) => {
    try {
      const updates: Partial<StorageData> = {
        id: slotId,
        client_id: historyData.client_id,
        car_id: historyData.car_id,
        tire_state_id: historyData.tire_state_id,
      };

      await upsertStorage(updates);

      toast("履歴からの割り当てが完了しました");
    } catch (error) {
      toast("履歴からの割り当てに失敗しました", {
        description: error instanceof Error ? error.message : "不明なエラー",
      });
    } finally {
      setTimeout(() => {
        router.refresh();
      }, 1000);
    }
  };

  const assignFromManual = async (slotId: string, manualData: State) => {
    try {
      if (!manualData.id) {
        toast.error("整備データがありません");
        return;
      }

      if (!manualData.assigner || manualData.assigner.trim() === "") {
        toast.error("整備士が指定されていません");
        return;
      }

      if (!manualData.next_theme || manualData.next_theme.trim() === "") {
        toast.error("次のテーマが指定されていません");
        return;
      }

      const updates: State = manualData;

      await upsertTire(updates);

      toast("手動割り当てが完了しました");
    } catch (error) {
      toast("手動割り当てに失敗しました", {
        description: error instanceof Error ? error.message : "不明なエラー",
      });
    } finally {
      setTimeout(() => {
        router.refresh();
      }, 1000);
    }
  };

  return {
    areas,
    slots,
    addArea,
    addSlotsToArea,
    updateSlot,
    updateSlots,
    assignFromHistory,
    assignFromManual,
  };
};
