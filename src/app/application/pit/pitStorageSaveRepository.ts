import { PitStorage, PitTaskInput } from "@/app/domain/type/pit";

export interface PitStorageSaveRepository {
  getStorageById: (storageId: string) => Promise<PitStorage | null>;
  clearStorageData: (storageId: string) => Promise<void>;
  saveTaskToStorage: (task: PitTaskInput) => Promise<void>;
  deleteTask: (taskId: number) => Promise<void>;
}

