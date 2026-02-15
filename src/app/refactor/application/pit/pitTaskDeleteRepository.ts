export interface PitTaskDeleteRepository {
  deleteTask: (taskId: number) => Promise<void>;
}

