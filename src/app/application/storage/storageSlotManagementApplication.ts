import type { StorageSlotOperationResult } from "@/app/domain/type/storage";
import type { StorageSlotManagementRepository } from "@/app/application/storage/storageSlotManagementRepository";
import { createSupabaseStorageSlotManagementRepository } from "@/app/infrastructure/storage/supabaseStorageSlotManagementRepository";

export const createStorageSlotManagementApplication = (
  repository: StorageSlotManagementRepository = createSupabaseStorageSlotManagementRepository(),
) => {
  const getAreaConfigs = () => repository.getAreaConfigs();

  const adjustStorageSlots = (
    areaName: string,
    targetCount: number,
  ): Promise<StorageSlotOperationResult> =>
    repository.adjustStorageSlots(areaName, targetCount);

  const deleteSpecificStorage = (
    storageId: string,
  ): Promise<StorageSlotOperationResult> =>
    repository.deleteSpecificStorage(storageId);

  return {
    getAreaConfigs,
    adjustStorageSlots,
    deleteSpecificStorage,
  };
};
