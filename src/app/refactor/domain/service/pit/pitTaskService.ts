import {
  GroupedPitTasks,
  PitFilterStatus,
  PitTask,
} from "@/app/refactor/domain/type/pit";

const createEmptyGroups = (): GroupedPitTasks => ({
  incomplete: [],
  complete: [],
  pending: [],
});

const groupTasksByStatus = (tasks: PitTask[]): GroupedPitTasks => {
  return tasks.reduce<GroupedPitTasks>((groups, task) => {
    if (task.status === "incomplete") {
      groups.incomplete.push(task);
      return groups;
    }
    if (task.status === "complete") {
      groups.complete.push(task);
      return groups;
    }
    groups.pending.push(task);
    return groups;
  }, createEmptyGroups());
};

const filterTasks = (tasks: PitTask[], status: PitFilterStatus): PitTask[] => {
  if (status === "all") {
    return tasks;
  }
  return tasks.filter((task) => task.status === status);
};

const formatTaskId = (id?: number): string => {
  return id ? `#${id.toString().padStart(3, "0")}` : "#未割当";
};

export const createPitTaskService = () => ({
  groupTasksByStatus,
  filterTasks,
  formatTaskId,
});
