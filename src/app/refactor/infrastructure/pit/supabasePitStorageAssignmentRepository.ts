import { PitStorageAssignmentRepository } from "@/app/refactor/application/pit/pitStorageAssignmentRepository";
import {
  PitStorage,
  PitStorageLog,
} from "@/app/refactor/domain/type/pit";
import {
  mapPitStorageFromSupabase,
  mapPitStorageLogFromSupabase,
} from "@/app/refactor/infrastructure/mapper/pitMapper";
import { supabase } from "@/utils/supabase";

const toErrorMessage = (error: unknown, fallback: string): string => {
  if (error instanceof Error) {
    return error.message || fallback;
  }
  if (error && typeof error === "object") {
    const candidate = error as {
      message?: string;
      details?: string;
      hint?: string;
      code?: string;
    };
    const parts = [
      candidate.message,
      candidate.details,
      candidate.hint,
      candidate.code ? `code=${candidate.code}` : undefined,
    ].filter((value): value is string => Boolean(value && value.trim()));
    if (parts.length > 0) return parts.join(" | ");
  }
  return fallback;
};

export const createSupabasePitStorageAssignmentRepository =
  (): PitStorageAssignmentRepository => {
    const getAllStorages = async (): Promise<PitStorage[]> => {
      const { data, error } = await supabase
        .from("storage_master")
        .select("id, car:car_table(*), client:client_data(*), state:tire_state(*)")
        .order("id", { ascending: true });

      if (error) {
        throw new Error(
          `保管庫一覧の取得に失敗しました: ${toErrorMessage(
            error,
            "unknown select error",
          )}`,
        );
      }

      return (data ?? []).map(mapPitStorageFromSupabase);
    };

    const getLogsByClientId = async (
      clientId: number,
    ): Promise<PitStorageLog[]> => {
      const { data, error } = await supabase
        .from("storage_logs")
        .select(
          "year, season, storage:storage_master(id), state:tire_state(*), car:car_table(*), client:client_data(*)",
        )
        .eq("client_id", clientId)
        .order("year", { ascending: true });

      if (error) {
        throw new Error(
          `顧客の保管履歴取得に失敗しました: ${toErrorMessage(
            error,
            "unknown select error",
          )}`,
        );
      }

      return (data ?? []).map(mapPitStorageLogFromSupabase);
    };

    const assignStorageToTask = async (
      taskId: number,
      storageId: string,
    ): Promise<void> => {
      const { error } = await supabase
        .from("task_list")
        .update({ storage_id: storageId, status: "complete" })
        .eq("id", taskId);

      if (error) {
        throw new Error(
          `保管庫割り当てに失敗しました: ${toErrorMessage(
            error,
            "unknown update error",
          )}`,
        );
      }
    };

    return {
      getAllStorages,
      getLogsByClientId,
      assignStorageToTask,
    };
  };

