import { StorageRepository } from "@/app/refactor/application/storage/storageRepository";
import {
  StorageAreaConfig,
  StorageSlot,
} from "@/app/refactor/domain/type/storage";
import {
  mapAreaConfigsFromStorageIds,
  mapStorageSlotFromSupabase,
} from "@/app/refactor/infrastructure/mapper/storageMapper";
import { createClient } from "@/utils/server";

export const createSupabaseStorageRepository = (): StorageRepository => {
  const getAreaConfigs = async (): Promise<StorageAreaConfig[]> => {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("storage_master")
      .select("id")
      .order("id", { ascending: false });

    if (error) {
      throw error;
    }

    return mapAreaConfigsFromStorageIds((data ?? []) as Array<{ id: string }>);
  };

  const getStorageSlots = async (): Promise<StorageSlot[]> => {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("storage_master")
      .select("id, car_id, client_id, tire_state_id")
      .order("id", { ascending: true });

    if (error) {
      throw error;
    }

    return (data ?? []).map(mapStorageSlotFromSupabase);
  };

  return {
    getAreaConfigs,
    getStorageSlots,
  };
};
