import type {
  StorageAreaConfig,
  StorageSlotOperationResult,
} from "@/app/domain/type/storage";

export interface StorageSlotManagementRepository {
  getAreaConfigs: () => Promise<StorageAreaConfig[]>;
  adjustStorageSlots: (
    areaName: string,
    targetCount: number,
  ) => Promise<StorageSlotOperationResult>;
  deleteSpecificStorage: (
    storageId: string,
  ) => Promise<StorageSlotOperationResult>;
}
