import { PitState } from "@/app/refactor/domain/type/pit";

export interface PitEditFormRepository {
  loadStateWithInspections: (state: PitState) => Promise<PitState>;
  saveTaskMaintenance: (taskId: number, state: PitState) => Promise<void>;
  updateTaskStatus: (taskId: number, status: string) => Promise<void>;
}
