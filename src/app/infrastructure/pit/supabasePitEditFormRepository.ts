import { PitEditFormRepository } from "@/app/application/pit/pitEditFormRepository";
import { PitState } from "@/app/domain/type/pit";
import {
  mapPitStateToInspectionRows,
  mapPitStateToTireStateRow,
  mergePitStateWithInspections,
} from "@/app/infrastructure/mapper/pitMapper";
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
    ].filter((v): v is string => Boolean(v && v.trim()));
    if (parts.length > 0) return parts.join(" | ");
  }
  return fallback;
};

export const createSupabasePitEditFormRepository = (): PitEditFormRepository => {
  const loadStateWithInspections = async (state: PitState): Promise<PitState> => {
    if (!state.id) {
      return state;
    }

    const { data, error } = await supabase
      .from("inspection")
      .select("*")
      .eq("tire_state_id", state.id);

    if (error) {
      throw new Error(
        `点検データの取得に失敗しました: ${toErrorMessage(
          error,
          "unknown select error",
        )}`,
      );
    }

    return mergePitStateWithInspections(state, (data ?? []) as any[]);
  };

  const saveTaskMaintenance = async (
    taskId: number,
    state: PitState,
  ): Promise<void> => {
    const tireStatePayload = mapPitStateToTireStateRow(state);
    const { data: tireStateData, error: tireStateError } = await supabase
      .from("tire_state")
      .upsert(tireStatePayload)
      .select()
      .single();

    if (tireStateError || !tireStateData?.id) {
      throw new Error(
        `整備データの保存に失敗しました: ${toErrorMessage(
          tireStateError,
          "unknown upsert error",
        )}`,
      );
    }

    const inspectionRows = mapPitStateToInspectionRows(state, tireStateData.id);
    for (const inspection of inspectionRows) {
      const { error } = await supabase.from("inspection").upsert(inspection);
      if (error) {
        throw new Error(
          `点検項目の保存に失敗しました: ${toErrorMessage(
            error,
            "unknown upsert error",
          )}`,
        );
      }
    }

    const { error: taskError } = await supabase
      .from("task_list")
      .update({ tire_state_id: tireStateData.id })
      .eq("id", taskId);

    if (taskError) {
      throw new Error(
        `タスク更新に失敗しました: ${toErrorMessage(
          taskError,
          "unknown update error",
        )}`,
      );
    }
  };

  const updateTaskStatus = async (taskId: number, status: string): Promise<void> => {
    const { error } = await supabase
      .from("task_list")
      .update({ status })
      .eq("id", taskId);

    if (error) {
      throw new Error(
        `タスクステータス更新に失敗しました: ${toErrorMessage(
          error,
          "unknown update error",
        )}`,
      );
    }
  };

  return {
    loadStateWithInspections,
    saveTaskMaintenance,
    updateTaskStatus,
  };
};
