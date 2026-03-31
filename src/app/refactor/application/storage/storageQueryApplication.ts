import { StorageMapData } from "@/app/refactor/domain/type/storage";
import { StorageRepository } from "@/app/refactor/application/storage/storageRepository";
import { createSupabaseStorageRepository } from "@/app/refactor/infrastructure/storage/supabaseStorageRepository";

export const createStorageQueryApplication = (
  repository: StorageRepository = createSupabaseStorageRepository(),
) => {
  const getStorageMapData = async (): Promise<StorageMapData> => {
    const [areas, slots] = await Promise.all([
      repository.getAreaConfigs(),
      repository.getStorageSlots(),
    ]);

    return { areas, slots };
  };

  return {
    getStorageMapData,
  };
};
