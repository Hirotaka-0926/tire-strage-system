import type { StorageCsvExportRepository } from "@/app/application/storage/storageCsvExportRepository";
import type { StorageCsvRecord } from "@/app/domain/type/storage";
import { supabase } from "@/app/infrastructure/shared/supabaseClient";

export const createSupabaseStorageCsvExportRepository =
  (): StorageCsvExportRepository => {
    const getAreaNames: StorageCsvExportRepository["getAreaNames"] = async () => {
      const { data, error } = await supabase
        .from("storage_master")
        .select("id")
        .order("id", { ascending: true });

      if (error) {
        throw error;
      }

      const ids = (data ?? []).map((item) => String((item as { id: string }).id));
      return [...new Set(ids.map((id) => id.split("_")[0]))];
    };

    const getStoragesByArea: StorageCsvExportRepository["getStoragesByArea"] =
      async (areaName) => {
        const { data, error } = await supabase
          .from("storage_master")
          .select("*, car:car_table(*), client:client_data(*), state:tire_state(*)")
          .like("id", `${areaName}_%`)
          .order("id", { ascending: true });

        if (error) {
          throw error;
        }

        return (data ?? []) as StorageCsvRecord[];
      };

    return {
      getAreaNames,
      getStoragesByArea,
    };
  };
