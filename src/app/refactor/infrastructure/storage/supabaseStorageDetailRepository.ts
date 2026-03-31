import type { StorageDetailRepository } from "@/app/refactor/application/storage/storageDetailRepository";
import {
  applyInspectionsToState,
  mapStateFromSupabase,
  mapStorageInputFromSupabase,
  mapStorageLogInputFromSupabase,
  mapTaskInputFromSupabase,
} from "@/app/refactor/infrastructure/mapper/storageDetailMapper";
import { supabase } from "@/utils/supabase";
import type { State } from "@/utils/interface";

export const createSupabaseStorageDetailRepository = (): StorageDetailRepository => {
  const getStorageDetailBySlotId: StorageDetailRepository["getStorageDetailBySlotId"] = async (
    slotId,
  ) => {
    const { data, error } = await supabase
      .from("storage_master")
      .select("*, state:tire_state(*), car:car_table(*), client:client_data(*)")
      .eq("id", slotId)
      .maybeSingle();

    if (error) {
      throw error;
    }
    if (!data) {
      return null;
    }

    const mapped = mapStorageInputFromSupabase(data);
    if (!mapped.state?.id) {
      return mapped;
    }

    const { data: inspectionData, error: inspectionError } = await supabase
      .from("inspection")
      .select("*")
      .eq("tire_state_id", mapped.state.id);

    if (inspectionError) {
      throw inspectionError;
    }

    return {
      ...mapped,
      state: applyInspectionsToState(mapped.state, inspectionData ?? []),
    };
  };

  const getPendingTasks: StorageDetailRepository["getPendingTasks"] = async () => {
    const { data, error } = await supabase
      .from("task_list")
      .select("*, tire_state:tire_state(*), car:car_table(*), client:client_data(*)")
      .eq("status", "pending");

    if (error) {
      throw error;
    }

    return (data ?? []).map(mapTaskInputFromSupabase);
  };

  const getStateWithInspectionById: StorageDetailRepository["getStateWithInspectionById"] = async (
    stateId,
  ) => {
    const { data: stateData, error: stateError } = await supabase
      .from("tire_state")
      .select("*")
      .eq("id", stateId)
      .single();

    if (stateError) {
      throw stateError;
    }

    const baseState: State = mapStateFromSupabase(stateData);
    const { data: inspectionData, error: inspectionError } = await supabase
      .from("inspection")
      .select("*")
      .eq("tire_state_id", stateId);

    if (inspectionError) {
      throw inspectionError;
    }

    return applyInspectionsToState(baseState, inspectionData ?? []);
  };

  const clearStorage: StorageDetailRepository["clearStorage"] = async (slotId) => {
    const { error } = await supabase
      .from("storage_master")
      .update({ car_id: null, client_id: null, tire_state_id: null })
      .eq("id", slotId);

    if (error) {
      throw error;
    }
  };

  const getLogsByStorageId: StorageDetailRepository["getLogsByStorageId"] = async (slotId) => {
    const { data, error } = await supabase
      .from("storage_logs")
      .select(
        "*, storage:storage_master(*), state:tire_state(*), car:car_table(*), client:client_data(*)",
      )
      .eq("storage_id", slotId)
      .order("year", { ascending: true });

    if (error) {
      throw error;
    }

    return (data ?? []).map(mapStorageLogInputFromSupabase);
  };

  return {
    getStorageDetailBySlotId,
    getPendingTasks,
    getStateWithInspectionById,
    clearStorage,
    getLogsByStorageId,
  };
};
