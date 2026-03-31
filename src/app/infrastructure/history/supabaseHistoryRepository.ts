import { HistoryRepository } from "@/app/application/history/historyRepository";
import { HistoryLogInput } from "@/app/domain/type/history";
import { mapHistoryLogInputFromSupabase } from "@/app/infrastructure/mapper/historyMapper";
import { createClient } from "@/utils/server";

export const createSupabaseHistoryRepository = (): HistoryRepository => {
  const getAllHistoryLogs = async (): Promise<HistoryLogInput[]> => {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("storage_logs")
      .select(
        "id, year, season, storage:storage_master(id), state:tire_state(id, assigner), car:car_table(id, car_model, car_number), client:client_data(id, client_name)",
      )
      .order("year", { ascending: false })
      .order("id", { ascending: false });

    if (error) {
      throw error;
    }

    return (data ?? []).map(mapHistoryLogInputFromSupabase);
  };

  return {
    getAllHistoryLogs,
  };
};

