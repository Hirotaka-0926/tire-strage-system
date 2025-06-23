"use client";

import { useCallback, useEffect, useState } from "react";
import { TaskInput, StorageData } from "@/utils/interface";
import {
  getAllMasterStorages,
  pushNewStorageLog,
  upsertStorage,
  updateTaskStatus,
} from "@/utils/supabaseFunction";
import { getYearAndSeason } from "@/utils/globalFunctions";
import { useNotification } from "./useNotification";

interface UseAssignStorageReturn {
  options: string[];
  loading: boolean;
  assignStorage: (task: TaskInput, storageId: string) => Promise<void>;
}

const useAssignStorage = (): UseAssignStorageReturn => {
  const [options, setOptions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const { showNotification } = useNotification();

  const fetchOptions = useCallback(async () => {
    try {
      setLoading(true);
      const storages = await getAllMasterStorages();
      const available = storages
        .filter(
          (s) => !s.car_id && !s.client_id && !s.tire_state_id
        )
        .map((s) => s.id as string);
      setOptions(available);
    } catch (err) {
      const msg =
        err instanceof Error
          ? err.message
          : "保管庫情報の取得に失敗しました";
      showNotification("error", msg);
    } finally {
      setLoading(false);
    }
  }, [showNotification]);

  useEffect(() => {
    fetchOptions();
  }, [fetchOptions]);

  const assignStorage = useCallback(
    async (task: TaskInput, storageId: string) => {
      try {
        setLoading(true);
        const storageData: StorageData = {
          id: storageId,
          car_id: task.car?.id ?? null,
          client_id: task.client?.id ?? null,
          tire_state_id: task.tire_state?.id ?? null,
        };
        await upsertStorage(storageData);

        const { year, season } = getYearAndSeason();
        await pushNewStorageLog({ year, season, storage: storageData });
        if (task.id) {
          await updateTaskStatus(task.id, "complete");
        }
        showNotification("success", "保管庫を割り当てました");
        fetchOptions();
      } catch (err) {
        const msg =
          err instanceof Error ? err.message : "保管庫割り当てに失敗しました";
        showNotification("error", msg);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [fetchOptions, showNotification]
  );

  return {
    options,
    loading,
    assignStorage,
  };
};

export default useAssignStorage;
