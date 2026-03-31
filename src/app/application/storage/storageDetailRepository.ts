import type {
  State,
  StorageInput,
  StorageLogInput,
  TaskInput,
} from "@/utils/interface";

export interface StorageDetailRepository {
  getStorageDetailBySlotId: (slotId: string) => Promise<StorageInput | null>;
  getPendingTasks: () => Promise<TaskInput[]>;
  getStateWithInspectionById: (stateId: number) => Promise<State>;
  clearStorage: (slotId: string) => Promise<void>;
  getLogsByStorageId: (slotId: string) => Promise<StorageLogInput[]>;
}
