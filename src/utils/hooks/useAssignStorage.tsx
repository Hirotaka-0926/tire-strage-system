"use client";

import { useCallback, useEffect, useState } from "react";
import {
  TaskInput,
  StorageLogInput,
  StorageData,
  StorageInput,
} from "@/utils/interface";
import {
  getAllMasterStorages,
  pushNewStorageLog,
  upsertStorage,
  updateTaskStatus,
  getLogsByClientId,
} from "@/utils/supabaseFunction";
import { getYearAndSeason } from "@/utils/globalFunctions";

interface UseAssignStorageReturn {
  emptyOptions: StorageInput[];
  embeddedOptions: StorageInput[];
  loading: boolean;
  assignStorage: (task: TaskInput, storageId: string) => Promise<void>;
  error: string | null;
  customerHistory?: StorageLogInput[];
}

const useAssignStorage = (
  open: boolean,
  customerId: number | null
): UseAssignStorageReturn => {
  const [emptyOptions, setEmptyOptions] = useState<StorageInput[]>([]);
  const [embeddedOptions, setEmbeddedOptions] = useState<StorageInput[]>([]);
  const [customerHistory, setCustomerHistory] = useState<StorageLogInput[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOptions = useCallback(async () => {
    if (!open || !customerId) {
      setEmptyOptions([]);
      setEmbeddedOptions([]);
      setCustomerHistory([]);
      return;
    }
    setLoading(true);

    const storages = await getAllMasterStorages();
    const history = await getLogsByClientId(customerId);
    console.log("Fetched storages:", storages);
    const available = storages.filter(
      (s: StorageInput) => !s.car && !s.client && !s.state
    );

    const embedded = storages.filter(
      (s: StorageInput) => s.car || s.client || s.state
    );

    setEmptyOptions(available);
    setEmbeddedOptions(embedded);
    setCustomerHistory(history);
    console.log("embeddedOptions:", embedded);
    console.log("emptyOptions:", available);

    setLoading(false);
  }, [customerId]);

  useEffect(() => {
    if (!open) return;
    fetchOptions();
  }, [open]);

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
        fetchOptions();
      } catch (err) {
        const msg =
          err instanceof Error ? err.message : "保管庫割り当てに失敗しました";
        setError(msg);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [fetchOptions]
  );

  return {
    emptyOptions,
    embeddedOptions,
    error,
    loading,
    assignStorage,
    customerHistory,
  };
};

export default useAssignStorage;
