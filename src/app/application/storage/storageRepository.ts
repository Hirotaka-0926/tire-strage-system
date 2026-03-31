import { StorageAreaConfig, StorageSlot } from "@/app/domain/type/storage";

export interface StorageRepository {
  getAreaConfigs: () => Promise<StorageAreaConfig[]>;
  getStorageSlots: () => Promise<StorageSlot[]>;
}
