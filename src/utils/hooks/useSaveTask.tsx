import {
  getStorageByMasterStorageId,
  clearStorageData,
  upsertStorage,
  pushNewStorageLog,
} from "@/utils/supabaseFunction";
import { useCallback } from "react";
import { TaskInput, StorageInput, StorageData } from "@/utils/interface";
import { getYearAndSeason } from "@/utils/globalFunctions";

interface UseSaveTaskReturn {
  fetchOverWriteStorage: () => Promise<StorageInput | null>;
  saveTaskData: (
    prevStorage: StorageInput
  ) => Promise<{ type: string; message: string }>;
}

const useSaveTask = (selectedItem: TaskInput | null): UseSaveTaskReturn => {
  const fetchOverWriteStorage = useCallback(async () => {
    if (!selectedItem) return null;

    if (selectedItem.storage_id) {
      const storage = await getStorageByMasterStorageId(
        selectedItem!.storage_id!
      );
      if (storage && (storage.car || storage.client || storage.state)) {
        return storage;
      }
    }
    return null;
  }, []);

  const saveTaskData = useCallback(async (prevStorage: StorageInput) => {
    try {
      if (prevStorage.car || prevStorage.client || prevStorage.state) {
        await clearStorageData(prevStorage.id!);
      }
      if (!selectedItem) {
        return { type: "error", message: "選択されたタスクがありません" };
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
  }, []);

  return { fetchOverWriteStorage, saveTaskData };
};

export default useSaveTask;
