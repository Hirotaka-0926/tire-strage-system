import { PitTaskRepository } from "@/app/refactor/application/pit/pitTaskRepository";
import { PitTaskInput } from "@/app/refactor/domain/type/pit";
import { mapPitTaskInputFromSupabase } from "@/app/refactor/infrastructure/mapper/pitMapper";
import { createClient } from "@/utils/server";

export const createSupabasePitTaskRepository = (): PitTaskRepository => {
  const getAllTasks = async (): Promise<PitTaskInput[]> => {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("task_list")
      .select(
        "*, tire_state:tire_state(*), car:car_table(*), client:client_data(*)",
      );

    if (error) {
      throw error;
    }

    return (data ?? []).map(mapPitTaskInputFromSupabase);
  };

  return {
    getAllTasks,
  };
};
