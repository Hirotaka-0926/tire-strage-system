import { StorageAreaConfig, StorageSlot } from "@/app/refactor/domain/type/storage";

export interface StorageRepository {
  getAreaConfigs: () => Promise<StorageAreaConfig[]>;
  getStorageSlots: () => Promise<StorageSlot[]>;
}
