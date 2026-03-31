import type { StorageCsvExportRepository } from "@/app/refactor/application/storage/storageCsvExportRepository";
import type { StorageCsvRecord } from "@/app/refactor/domain/type/storage";
import { createSupabaseStorageCsvExportRepository } from "@/app/refactor/infrastructure/storage/supabaseStorageCsvExportRepository";

export const createStorageCsvExportApplication = (
  repository: StorageCsvExportRepository = createSupabaseStorageCsvExportRepository(),
) => {
  const getAllStoragesForCsv = async (): Promise<StorageCsvRecord[]> => {
    const areaNames = await repository.getAreaNames();
    if (areaNames.length === 0) {
      throw new Error("エリア名が見つかりません");
    }

    const allStorageData: StorageCsvRecord[] = [];

    for (const areaName of areaNames) {
      try {
        const areaStorages = await repository.getStoragesByArea(areaName);
        if (areaStorages.length > 0) {
          allStorageData.push(...areaStorages);
        }
        await new Promise((resolve) => setTimeout(resolve, 100));
      } catch (error) {
        console.error(`エリア ${areaName} の取得中にエラー:`, error);
      }
    }

    if (allStorageData.length === 0) {
      throw new Error("CSVに出力するデータがありません");
    }

    return allStorageData;
  };

  return {
    getAllStoragesForCsv,
  };
};
