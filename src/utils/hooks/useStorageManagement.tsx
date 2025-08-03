"use client";
import { useState, useEffect, useCallback } from "react";

import {
  StorageInput,
  TaskInput,
  StorageLogInput,
  StorageData,
  StorageLogOutput,
} from "@/utils/interface";
import { getYearAndSeason } from "@/utils/globalFunctions";

import { useRouter } from "next/navigation";

import { useNotification } from "@/utils/hooks/useNotification";
import {
  pushNewStorageLog,
  upsertStorage,
  deletePendingTasks,
} from "@/utils/supabaseFunction";

const NOTIFICATION_MESSAGES = {
  STORAGE_OCCUPIED:
    "既に保管庫にはデータが格納されています。先に取り出してください",
  DATA_INSERTED: (clientName: string) =>
    `${clientName}のデータを保管庫に挿入しました。`,
  DATA_REMOVED: "保管庫のデータを取り出しました。",
  DATA_UPDATED: "保管庫データを更新しました。",
  DATA_SAVED: "保管庫データをサーバーに保存しました。",
  LOG_CREATED: "保管庫ログも作成されました",
  TASK_DELETED: "未割り当て整備データを削除しました。",
} as const;

export const useStorageManagement = (
  initialStorageDetail: StorageInput | null,
  storageId: string
) => {
  const [currentStorage, setCurrentStorage] = useState<StorageInput | null>(
    initialStorageDetail
  );

  const [savedStorage, setSavedStorage] = useState<StorageInput | null>(
    currentStorage
  );
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [pendingTaskId, setPendingTaskId] = useState<number>(0);
  const { showNotification } = useNotification();
  const { year, season } = getYearAndSeason();
  const router = useRouter();

  useEffect(() => {
    const hasChanges =
      JSON.stringify(currentStorage) !== JSON.stringify(savedStorage);
    setHasUnsavedChanges(hasChanges);
  }, [currentStorage, savedStorage]);

  const hasInsertData = (data: StorageInput) => {
    if (currentStorage != null) {
      showNotification("error", NOTIFICATION_MESSAGES.STORAGE_OCCUPIED);
      return;
    }
    setCurrentStorage(data);
    showNotification(
      "success",
      NOTIFICATION_MESSAGES.DATA_INSERTED(data.client!.client_name)
    );
    console.log("run hasInsertData:", data);
  };

  const handleRemoveData = useCallback(() => {
    setCurrentStorage(null);
    setPendingTaskId(0);
    showNotification("info", NOTIFICATION_MESSAGES.DATA_REMOVED);
  }, [showNotification]);

  const handleEditData = useCallback(
    (data: StorageInput) => {
      setCurrentStorage(data);
      showNotification("info", NOTIFICATION_MESSAGES.DATA_UPDATED);
      setIsEditDialogOpen(false);
    },
    [showNotification]
  );

  const handleSaveToServer = useCallback(async () => {
    const newStorage: StorageData = {
      id: storageId,
      car_id: currentStorage?.car?.id || null,
      client_id: currentStorage?.client?.id || null,
      tire_state_id: currentStorage?.state?.id || null,
    };

    const newLog: StorageLogOutput = {
      storage: {
        id: storageId,
        car_id: currentStorage?.car?.id || null,
        client_id: currentStorage?.client?.id || null,
        tire_state_id: currentStorage?.state?.id || null,
      },
      year: year,
      season: season,
    };

    setIsSaving(true);

    try {
      await upsertStorage(newStorage);
      showNotification("success", NOTIFICATION_MESSAGES.DATA_SAVED);

      if (
        currentStorage &&
        (!savedStorage ||
          JSON.stringify(currentStorage) === JSON.stringify(savedStorage))
      ) {
        await pushNewStorageLog(newLog);
        showNotification("info", NOTIFICATION_MESSAGES.LOG_CREATED);
      }
      setSavedStorage(currentStorage);

      if (pendingTaskId > 0) {
        await deletePendingTasks(pendingTaskId);
        showNotification("info", NOTIFICATION_MESSAGES.TASK_DELETED);
        setPendingTaskId(0);
      }

      router.refresh();
    } catch (error) {
      console.error("Save error:", error);
    } finally {
      setIsSaving(false);
    }
  }, [currentStorage, savedStorage, storageId, year, season, pendingTaskId]);

  const hasInsertLog = (log: StorageLogInput) => {
    const newStorage: StorageInput = {
      id: storageId,
      client: log.client,
      car: log.car,
      state: log.state,
    };
    hasInsertData(newStorage);
  };

  const hasInsertTask = (data: TaskInput) => {
    const newStorage: StorageInput = {
      id: storageId,
      client: data.client,
      car: data.car,
      state: data.tire_state,
    };
    console.log("hasInsertTask data:", data);
    setPendingTaskId(data.id!);
    hasInsertData(newStorage);
  };

  return {
    currentStorage,
    isEditDialogOpen,
    setIsEditDialogOpen,
    isSaving,
    hasUnsavedChanges,
    hasInsertData,
    handleRemoveData,
    handleEditData,
    handleSaveToServer,
    hasInsertLog,
    hasInsertTask,
  };
};
