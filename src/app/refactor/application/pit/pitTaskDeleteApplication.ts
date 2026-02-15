import { PitTaskInput } from "@/app/refactor/domain/type/pit";
import { PitTaskDeleteRepository } from "@/app/refactor/application/pit/pitTaskDeleteRepository";
import { createSupabasePitTaskDeleteRepository } from "@/app/refactor/infrastructure/pit/supabasePitTaskDeleteRepository";

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

