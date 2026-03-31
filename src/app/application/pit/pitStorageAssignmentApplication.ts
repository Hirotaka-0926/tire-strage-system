import {
  PitStorageAssignmentOptions,
  PitTaskInput,
} from "@/app/domain/type/pit";
import { PitStorageAssignmentRepository } from "@/app/application/pit/pitStorageAssignmentRepository";
import { createSupabasePitStorageAssignmentRepository } from "@/app/infrastructure/pit/supabasePitStorageAssignmentRepository";

export const createPitStorageAssignmentApplication = (
  repository: PitStorageAssignmentRepository = createSupabasePitStorageAssignmentRepository(),
) => {
  const getAssignmentOptions = async (
    customerId: number,
  ): Promise<PitStorageAssignmentOptions> => {
    const [storages, history] = await Promise.all([
      repository.getAllStorages(),
      repository.getLogsByClientId(customerId),
    ]);

    const emptyOptions = storages.filter(
      (storage) => !storage.car && !storage.client && !storage.state,
    );
    const occupiedOptions = storages.filter(
      (storage) => storage.car || storage.client || storage.state,
    );

    const seenStorageIds = new Set<string>();
    const customerHistory = history.filter((log) => {
      const storageId = log.storage?.id;
      if (!storageId || seenStorageIds.has(storageId)) {
        return false;
      }
      seenStorageIds.add(storageId);
      return true;
    });

    return {
      emptyOptions,
      occupiedOptions,
      customerHistory,
    };
  };

  const assignStorage = async (
    task: PitTaskInput,
    storageId: string,
  ): Promise<void> => {
    if (!task.id) {
      throw new Error("タスクIDがありません");
    }
    await repository.assignStorageToTask(task.id, storageId);
  };

  return {
    getAssignmentOptions,
    assignStorage,
  };
};

