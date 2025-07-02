"use client";

import {
  getStorageByMasterStorageId,
  clearStorageData,
  upsertStorage,
  pushNewStorageLog,
} from "@/utils/supabaseFunction";
import { useCallback, useState, useEffect } from "react";
import { TaskInput, StorageInput, StorageData } from "@/utils/interface";
import { getYearAndSeason } from "@/utils/globalFunctions";

interface UseSaveTaskReturn {
  prevStorage: StorageInput | null;
  saveTaskData: () => Promise<{
    type: "error" | "success" | "info";
    message: string;
  }>;
}

const useSaveTask = (selectedItem: TaskInput | null): UseSaveTaskReturn => {
  const [prevStorage, setPrevStorage] = useState<StorageInput | null>(null);
  const fetchOverWriteStorage = useCallback(async () => {
    if (!selectedItem) return;

    if (selectedItem.storage_id) {
      const storage = await getStorageByMasterStorageId(
        selectedItem!.storage_id!
      );
      if (storage && (storage.car || storage.client || storage.state)) {
        setPrevStorage(storage);
      }
    }
    return;
  }, [selectedItem]);

  useEffect(() => {
    fetchOverWriteStorage();
  });

  const saveTaskData = useCallback(async () => {
    try {
      if (
        prevStorage &&
        (prevStorage.car || prevStorage.client || prevStorage.state)
      ) {
        await clearStorageData(prevStorage.id!);
      }
      if (!selectedItem) {
        return { type: "info", message: "選択されたタスクがありません" };
      }
      const storageData: StorageData = {
        id: selectedItem.storage_id!,
        car_id: selectedItem.car?.id ?? null,
        client_id: selectedItem.client?.id ?? null,
        tire_state_id: selectedItem.tire_state?.id ?? null,
      };
      await upsertStorage(storageData);

      const { year, season } = getYearAndSeason();
      await pushNewStorageLog({ year, season, storage: storageData });

      return { type: "success", message: "タスクデータが保存されました" };
    } catch (error) {
      console.error("Error saving task data:", error);
      return { type: "error", message: "タスクデータの保存に失敗しました" };
    }
  }, [selectedItem]);

  return { prevStorage, saveTaskData };
};

export default useSaveTask;
