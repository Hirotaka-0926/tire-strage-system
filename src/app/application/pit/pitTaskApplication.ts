import { createPitTaskService } from "@/app/domain/service/pit/pitTaskService";
import {
  GroupedPitTasks,
  PitFilterStatus,
  PitTask,
} from "@/app/domain/type/pit";

export const createPitTaskApplication = () => {
  const service = createPitTaskService();

  const filterTasks = (tasks: PitTask[], status: PitFilterStatus): PitTask[] =>
    service.filterTasks(tasks, status);

  const groupTasksByStatus = (tasks: PitTask[]): GroupedPitTasks =>
    service.groupTasksByStatus(tasks);

  const formatTaskId = (id?: number): string => service.formatTaskId(id);

  return {
    filterTasks,
    groupTasksByStatus,
    formatTaskId,
  };
};
