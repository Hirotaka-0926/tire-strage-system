import { PitTask, PitTaskInput } from "@/app/domain/type/pit";
import { PitTaskRepository } from "@/app/application/pit/pitTaskRepository";
import { createSupabasePitTaskRepository } from "@/app/infrastructure/pit/supabasePitTaskRepository";

const toPitStatus = (status: string): PitTask["status"] => {
  if (status === "complete" || status === "pending") {
    return status;
  }
  return "incomplete";
};

const toPitTask = (task: PitTaskInput): PitTask => ({
  id: task.id,
  status: toPitStatus(task.status),
  clientName: task.client?.client_name ?? "",
  carNumber: task.car?.car_number ?? "",
  carModel: task.car?.car_model ?? "",
  storageId: task.storage_id ?? "",
  sourceTask: task,
});

export const createPitTaskQueryApplication = (
  repository: PitTaskRepository = createSupabasePitTaskRepository(),
) => {
  const getPitTasks = async (): Promise<PitTask[]> => {
    const tasks = await repository.getAllTasks();
    return tasks.map(toPitTask);
  };

  return {
    getPitTasks,
  };
};
