import { PitStorageSaveRepository } from "@/app/application/pit/pitStorageSaveRepository";
import { PitTaskInput } from "@/app/domain/type/pit";
import { mapPitStorageFromSupabase } from "@/app/infrastructure/mapper/pitMapper";
import { getYearAndSeason } from "@/utils/globalFunctions";
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

export const createSupabasePitStorageSaveRepository =
  (): PitStorageSaveRepository => {
    const getStorageById = async (storageId: string) => {
      const { data, error } = await supabase
        .from("storage_master")
        .select("id, car:car_table(*), client:client_data(*), state:tire_state(*)")
        .eq("id", storageId)
        .maybeSingle();

      if (error) {
        throw new Error(
          `保管庫情報の取得に失敗しました: ${toErrorMessage(
            error,
            "unknown select error",
          )}`,
        );
      }
      if (!data) return null;
      return mapPitStorageFromSupabase(data);
    };

    const clearStorageData = async (storageId: string): Promise<void> => {
      const { error } = await supabase
        .from("storage_master")
        .update({ car_id: null, client_id: null, tire_state_id: null })
        .eq("id", storageId);

      if (error) {
        throw new Error(
          `既存保管庫データのクリアに失敗しました: ${toErrorMessage(
            error,
            "unknown update error",
          )}`,
        );
      }
    };

    const saveTaskToStorage = async (task: PitTaskInput): Promise<void> => {
      if (!task.storage_id) {
        throw new Error("保管庫IDが未設定です");
      }

      const payload = {
        car_id: task.car?.id ?? null,
        client_id: task.client?.id ?? null,
        tire_state_id: task.tire_state?.id ?? null,
      };

      const { error: storageError } = await supabase
        .from("storage_master")
        .update(payload)
        .eq("id", task.storage_id);

      if (storageError) {
        throw new Error(
          `保管庫保存に失敗しました: ${toErrorMessage(
            storageError,
            "unknown update error",
          )}`,
        );
      }

      const { year, season } = getYearAndSeason();
      const { error: logError } = await supabase.from("storage_logs").insert([
        {
          year,
          season,
          storage_id: task.storage_id,
          tire_state_id: task.tire_state?.id ?? null,
          car_id: task.car?.id ?? null,
          client_id: task.client?.id ?? null,
        },
      ]);

      if (logError) {
        throw new Error(
          `保管履歴の作成に失敗しました: ${toErrorMessage(
            logError,
            "unknown insert error",
          )}`,
        );
      }
    };

    const deleteTask = async (taskId: number): Promise<void> => {
      const { error } = await supabase.from("task_list").delete().eq("id", taskId);

      if (error) {
        throw new Error(
          `タスク削除に失敗しました: ${toErrorMessage(
            error,
            "unknown delete error",
          )}`,
        );
      }
    };

    return {
      getStorageById,
      clearStorageData,
      saveTaskToStorage,
      deleteTask,
    };
  };

