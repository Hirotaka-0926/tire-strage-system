import { supabase } from "@/utils/supabase";
import { Car, Client, TaskOutput } from "@/app/refactor/domain/type/reception";
import { CustomerReceptionRepository } from "@/app/refactor/application/reception/customerReceptionRepository";
import {
  mapCarFromSupabase,
  mapCarToSupabase,
  mapClientFromSupabase,
  mapClientToSupabase,
  mapTaskToSupabase,
} from "../mapper/reseptionMapper";

export const createSupabaseReceptionRepository =
  (): CustomerReceptionRepository => {
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

        if (parts.length > 0) {
          return parts.join(" | ");
        }
      }

      return fallback;
    };

    const uniqueNumericIds = (
      rows: Array<Record<string, unknown>>,
      key: string,
    ): number[] => {
      return Array.from(
        new Set(
          rows
            .map((row) => row[key])
            .filter((id): id is number => typeof id === "number"),
        ),
      );
    };

    const saveCustomer = async (client: Client): Promise<Client> => {
      const payload = mapClientToSupabase(client);
      const { data, error } = await supabase
        .from("client_data")
        .upsert(payload)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return mapClientFromSupabase(data);
    };

    const deleteCustomer = async (customerId: number) => {
      const { data: storageMasterRows, error: storageMasterFetchError } =
        await supabase
          .from("storage_master")
          .select("car_id, tire_state_id")
          .eq("client_id", customerId);

      if (storageMasterFetchError) {
        console.error("Error loading storage_master rows:", {
          customerId,
          error: storageMasterFetchError,
        });
        throw new Error(
          `顧客削除の事前取得に失敗しました(storage_master): ${toErrorMessage(
            storageMasterFetchError,
            "unknown select error",
          )}`,
        );
      }

      const { data: storageLogRows, error: storageLogsFetchError } =
        await supabase
          .from("storage_logs")
          .select("car_id, tire_state_id")
          .eq("client_id", customerId);

      if (storageLogsFetchError) {
        console.error("Error loading storage_logs rows:", {
          customerId,
          error: storageLogsFetchError,
        });
        throw new Error(
          `顧客削除の事前取得に失敗しました(storage_logs): ${toErrorMessage(
            storageLogsFetchError,
            "unknown select error",
          )}`,
        );
      }

      const { data: taskRows, error: taskFetchError } = await supabase
        .from("task_list")
        .select("car_id, tire_state_id")
        .eq("client_id", customerId);

      if (taskFetchError) {
        console.error("Error loading task_list rows:", {
          customerId,
          error: taskFetchError,
        });
        throw new Error(
          `顧客削除の事前取得に失敗しました(task_list): ${toErrorMessage(
            taskFetchError,
            "unknown select error",
          )}`,
        );
      }

      const allRows = [
        ...(storageMasterRows ?? []),
        ...(storageLogRows ?? []),
        ...(taskRows ?? []),
      ] as Array<Record<string, unknown>>;

      const carIds = uniqueNumericIds(allRows, "car_id");
      const tireStateIds = uniqueNumericIds(allRows, "tire_state_id");

      const { error: storageMasterError } = await supabase
        .from("storage_master")
        .update({ car_id: null, client_id: null, tire_state_id: null })
        .eq("client_id", customerId);

      if (storageMasterError) {
        console.error("Error clearing storage_master refs:", {
          customerId,
          error: storageMasterError,
        });
        throw new Error(
          `顧客削除の事前処理に失敗しました(storage_master): ${toErrorMessage(
            storageMasterError,
            "unknown update error",
          )}`,
        );
      }

      const { error: storageLogsDeleteError } = await supabase
        .from("storage_logs")
        .delete()
        .eq("client_id", customerId);

      if (storageLogsDeleteError) {
        console.error("Error deleting storage_logs rows:", {
          customerId,
          error: storageLogsDeleteError,
        });
        throw new Error(
          `顧客削除の事前処理に失敗しました(storage_logs削除): ${toErrorMessage(
            storageLogsDeleteError,
            "unknown delete error",
          )}`,
        );
      }

      const { error: taskListDeleteError } = await supabase
        .from("task_list")
        .delete()
        .eq("client_id", customerId);

      if (taskListDeleteError) {
        console.error("Error deleting task_list rows:", {
          customerId,
          error: taskListDeleteError,
        });
        throw new Error(
          `顧客削除の事前処理に失敗しました(task_list削除): ${toErrorMessage(
            taskListDeleteError,
            "unknown delete error",
          )}`,
        );
      }

      if (tireStateIds.length > 0) {
        const { error: inspectionDeleteError } = await supabase
          .from("inspection")
          .delete()
          .in("tire_state_id", tireStateIds);

        if (inspectionDeleteError) {
          console.error("Error deleting inspection rows:", {
            customerId,
            tireStateIds,
            error: inspectionDeleteError,
          });
          throw new Error(
            `顧客削除の事前処理に失敗しました(inspection削除): ${toErrorMessage(
              inspectionDeleteError,
              "unknown delete error",
            )}`,
          );
        }

        const { error: tireStateDeleteError } = await supabase
          .from("tire_state")
          .delete()
          .in("id", tireStateIds);

        if (tireStateDeleteError) {
          console.error("Error deleting tire_state rows:", {
            customerId,
            tireStateIds,
            error: tireStateDeleteError,
          });
          throw new Error(
            `顧客削除の事前処理に失敗しました(tire_state削除): ${toErrorMessage(
              tireStateDeleteError,
              "unknown delete error",
            )}`,
          );
        }
      }

      if (carIds.length > 0) {
        const { error: carDeleteError } = await supabase
          .from("car_table")
          .delete()
          .in("id", carIds);

        if (carDeleteError) {
          console.error("Error deleting car_table rows:", {
            customerId,
            carIds,
            error: carDeleteError,
          });
          throw new Error(
            `顧客削除の事前処理に失敗しました(car_table削除): ${toErrorMessage(
              carDeleteError,
              "unknown delete error",
            )}`,
          );
        }
      }

      const { data, error } = await supabase
        .from("client_data")
        .delete()
        .eq("id", customerId)
        .select("id");

      if (error) {
        console.error("Error deleting client_data row:", {
          customerId,
          error,
        });
        throw new Error(
          `顧客削除に失敗しました: ${toErrorMessage(error, "unknown delete error")}`,
        );
      }

      if (!data || data.length === 0) {
        throw new Error(
          "顧客削除に失敗しました: 対象が存在しないか、削除権限がありません",
        );
      }
    };

    const saveCar = async (car: Car): Promise<Car> => {
      const payload = mapCarToSupabase(car);
      const { data, error } = await supabase
        .from("car_table")
        .upsert(payload)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return mapCarFromSupabase(data);
    };

    const saveTask = async (task: TaskOutput) => {
      const payload = mapTaskToSupabase(task);
      const { error } = await supabase.from("task_list").upsert(payload);

      if (error) {
        throw error;
      }
    };

    return {
      saveCustomer,
      deleteCustomer,
      saveCar,
      saveTask,
    };
  };
