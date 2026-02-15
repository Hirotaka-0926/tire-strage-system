import { PitStorage, PitTaskInput } from "@/app/refactor/domain/type/pit";
import { PitStorageSaveRepository } from "@/app/refactor/application/pit/pitStorageSaveRepository";
import { createSupabasePitStorageSaveRepository } from "@/app/refactor/infrastructure/pit/supabasePitStorageSaveRepository";

const isStorageOccupied = (storage: PitStorage | null): boolean => {
  return Boolean(storage && (storage.car || storage.client || storage.state));
};

export const createPitStorageSaveApplication = (
  repository: PitStorageSaveRepository = createSupabasePitStorageSaveRepository(),
) => {
  const getOverwriteStorage = async (
    task: PitTaskInput | null,
  ): Promise<PitStorage | null> => {
    if (!task?.storage_id) {
      return null;
    }
    const storage = await repository.getStorageById(task.storage_id);
    if (!isStorageOccupied(storage)) {
      return null;
    }
    return storage;
  };

  const saveTask = async (task: PitTaskInput): Promise<void> => {
    if (!task.id) {
      throw new Error("タスクIDがありません");
    }
    if (!task.storage_id) {
      throw new Error("保管庫IDが未設定です");
    }

    const overwriteTarget = await repository.getStorageById(task.storage_id);
    if (isStorageOccupied(overwriteTarget)) {
      await repository.clearStorageData(task.storage_id);
    }

    await repository.saveTaskToStorage(task);
    await repository.deleteTask(task.id);
  };

  return {
    getOverwriteStorage,
    saveTask,
  };
};

