"use client";

import { useCallback, useEffect, useState } from "react";
import { TaskInput, StorageLogInput, StorageInput } from "@/utils/interface";
import {
  getAllMasterStorages,
  updateTaskStatus,
  getLogsByClientId,
  getStorageByMasterStorageId,
  clearStorageIdFromTask,
} from "@/utils/supabaseFunction";

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

    const filteredHistory = (() => {
      const seenIds = new Set<string>();
      return history.filter((log) => {
        const id = log.storage.id;
        if (seenIds.has(id)) {
          return false;
        }
        seenIds.add(id);
        return true;
      });
    })();

    setEmptyOptions(available);
    setEmbeddedOptions(embedded);
    setCustomerHistory(filteredHistory);
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
        // if task already has storage and it contains data, clear it
        if (
          task.storage_id &&
          task.storage_id !== "" &&
          task.storage_id !== storageId
        ) {
          const prev = await getStorageByMasterStorageId(task.storage_id);
          if (prev.car || prev.client || prev.state) {
            await clearStorageIdFromTask(task.storage_id);
          }
        }

        if (task.id) {
          await updateTaskStatus(task.id, "complete");
        }
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
