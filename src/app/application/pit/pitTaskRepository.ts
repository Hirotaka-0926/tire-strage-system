import { PitTaskInput } from "@/app/domain/type/pit";

export interface PitTaskRepository {
  getAllTasks: () => Promise<PitTaskInput[]>;
}
