import type { StorageCsvRecord } from "@/app/domain/type/storage";

export interface StorageCsvExportRepository {
  getAreaNames: () => Promise<string[]>;
  getStoragesByArea: (areaName: string) => Promise<StorageCsvRecord[]>;
}
