export type PitTaskStatus = "pending" | "incomplete" | "complete";
export type PitFilterStatus = "all" | PitTaskStatus;

export interface PitTask {
  id?: number;
  status: PitTaskStatus;
  clientName: string;
  carNumber: string;
  carModel: string;
  storageId: string;
}

export interface GroupedPitTasks {
  incomplete: PitTask[];
  complete: PitTask[];
  pending: PitTask[];
}
