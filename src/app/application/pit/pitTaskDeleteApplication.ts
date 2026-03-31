import { PitTaskInput } from "@/app/domain/type/pit";
import { PitTaskDeleteRepository } from "@/app/application/pit/pitTaskDeleteRepository";
import { createSupabasePitTaskDeleteRepository } from "@/app/infrastructure/pit/supabasePitTaskDeleteRepository";

export const createPitTaskDeleteApplication = (
  repository: PitTaskDeleteRepository = createSupabasePitTaskDeleteRepository(),
) => {
  const deleteTask = async (task: PitTaskInput): Promise<void> => {
    if (!task.id) {
      throw new Error("タスクIDがありません");
    }
    await repository.deleteTask(task.id);
  };

  return {
    deleteTask,
  };
};

