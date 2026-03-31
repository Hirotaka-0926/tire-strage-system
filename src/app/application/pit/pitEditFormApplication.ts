import { PitEditFormRepository } from "@/app/application/pit/pitEditFormRepository";
import { PitState, PitTaskInput } from "@/app/domain/type/pit";
import { createEmptyPitState } from "@/app/infrastructure/mapper/pitMapper";
import { createSupabasePitEditFormRepository } from "@/app/infrastructure/pit/supabasePitEditFormRepository";

export const createPitEditFormApplication = (
  repository: PitEditFormRepository = createSupabasePitEditFormRepository(),
) => {
  const initializeState = async (selectedTask: PitTaskInput | null): Promise<PitState | null> => {
    if (!selectedTask) return null;
    if (!selectedTask.tire_state) {
      return createEmptyPitState();
    }
    return repository.loadStateWithInspections(selectedTask.tire_state);
  };

  const saveMaintenance = async (
    selectedTask: PitTaskInput,
    formData: PitState,
  ): Promise<void> => {
    await repository.saveTaskMaintenance(selectedTask.id!, formData);

    if (!selectedTask.tire_state) {
      await repository.updateTaskStatus(selectedTask.id!, "incomplete");
    }

    if (selectedTask.status === "incomplete") {
      await repository.updateTaskStatus(selectedTask.id!, "pending");
    }
  };

  return {
    initializeState,
    saveMaintenance,
  };
};
