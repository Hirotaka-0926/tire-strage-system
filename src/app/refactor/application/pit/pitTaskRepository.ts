import { PitTaskInput } from "@/app/refactor/domain/type/pit";

export interface PitTaskRepository {
  getAllTasks: () => Promise<PitTaskInput[]>;
}
