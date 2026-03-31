import { PitTaskRepository } from "@/app/application/pit/pitTaskRepository";
import { PitTaskInput } from "@/app/domain/type/pit";
import { mapPitTaskInputFromSupabase } from "@/app/infrastructure/mapper/pitMapper";
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
