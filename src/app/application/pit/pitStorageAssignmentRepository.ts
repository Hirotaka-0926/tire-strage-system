import {
  PitStorage,
  PitStorageLog,
} from "@/app/domain/type/pit";

export interface PitStorageAssignmentRepository {
  getAllStorages: () => Promise<PitStorage[]>;
  getLogsByClientId: (clientId: number) => Promise<PitStorageLog[]>;
  assignStorageToTask: (taskId: number, storageId: string) => Promise<void>;
}

