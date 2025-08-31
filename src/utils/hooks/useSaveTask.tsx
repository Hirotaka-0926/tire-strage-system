"use client";

import {
  getStorageByMasterStorageId,
  clearStorageData,
  upsertStorage,
  pushNewStorageLog,
  deletePendingTasks,
} from "@/utils/supabaseFunction";
import { useCallback, useState, useEffect } from "react";
import { TaskInput, StorageInput, StorageData } from "@/utils/interface";
import { getYearAndSeason } from "@/utils/globalFunctions";
import { toast } from "sonner";

interface UseSaveTaskReturn {
  prevStorage: StorageInput | null;
  saveTaskData: () => Promise<void>;
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
      if (!selectedItem || !selectedItem?.id) {
        toast("選択されたタスクがありません", {
          description: "タスクを選択してください",
        });
        return;
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

      await deletePendingTasks(selectedItem.id);

      toast.success("タスクデータが保存されました");
    } catch (error) {
      console.error("Error saving task data:", error);
      toast.error("タスクデータの保存に失敗しました", {
        description: error instanceof Error ? error.message : String(error),
      });
    }
  }, [selectedItem]);

  return { prevStorage, saveTaskData };
};

export default useSaveTask;
