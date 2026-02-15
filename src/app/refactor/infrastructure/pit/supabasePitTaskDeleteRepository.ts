import { PitTaskDeleteRepository } from "@/app/refactor/application/pit/pitTaskDeleteRepository";
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

export const createSupabasePitTaskDeleteRepository =
  (): PitTaskDeleteRepository => {
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
      deleteTask,
    };
  };

