import type { StorageDetailRepository } from "@/app/refactor/application/storage/storageDetailRepository";
import { createSupabaseStorageDetailRepository } from "@/app/refactor/infrastructure/storage/supabaseStorageDetailRepository";

export const createStorageDetailApplication = (
  repository: StorageDetailRepository = createSupabaseStorageDetailRepository(),
) => {
  return {
    getStorageDetailBySlotId: repository.getStorageDetailBySlotId,
    getPendingTasks: repository.getPendingTasks,
    getStateWithInspectionById: repository.getStateWithInspectionById,
    clearStorage: repository.clearStorage,
    getLogsByStorageId: repository.getLogsByStorageId,
  };
};
