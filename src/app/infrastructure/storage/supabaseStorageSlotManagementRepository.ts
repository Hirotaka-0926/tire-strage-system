import type { StorageSlotManagementRepository } from "@/app/application/storage/storageSlotManagementRepository";
import type { StorageSlotOperationResult } from "@/app/domain/type/storage";
import { mapAreaConfigsFromStorageIds } from "@/app/infrastructure/mapper/storageMapper";
import { supabase } from "@/app/infrastructure/shared/supabaseClient";

export const createSupabaseStorageSlotManagementRepository =
  (): StorageSlotManagementRepository => {
    const getAreaConfigs: StorageSlotManagementRepository["getAreaConfigs"] =
      async () => {
        const { data, error } = await supabase.from("storage_master").select("id");

        if (error) {
          console.error("Error fetching area config:", error);
          return [];
        }

        return mapAreaConfigsFromStorageIds((data ?? []) as Array<{ id: string }>);
      };

    const adjustStorageSlots: StorageSlotManagementRepository["adjustStorageSlots"] =
      async (areaName, targetCount) => {
        try {
          const { data: storages, error: fetchError } = await supabase
            .from("storage_master")
            .select("id, car_id, client_id, tire_state_id")
            .like("id", `${areaName}_%`)
            .order("id", { ascending: true });

          if (fetchError) {
            return {
              success: false,
              error: fetchError.message,
              message: "保管庫データの取得に失敗しました",
            } satisfies StorageSlotOperationResult;
          }

          if (!storages) {
            return {
              success: false,
              message: `エリア${areaName}に保管庫が見つかりません`,
              error: "No storages found",
            } satisfies StorageSlotOperationResult;
          }

          const currentCount = storages.length;
          if (currentCount <= targetCount) {
            return {
              success: true,
              message: `エリア${areaName}の現在の保管庫数(${currentCount})は目標数(${targetCount})以下です。削除は不要です。`,
            } satisfies StorageSlotOperationResult;
          }

          const deleteCount = currentCount - targetCount;
          const storagesSortedDesc = [...storages].sort((a, b) =>
            b.id.localeCompare(a.id),
          );
          const toDelete = storagesSortedDesc.slice(0, deleteCount);

          const inUseStorages = toDelete.filter(
            (storage) => storage.car_id || storage.client_id || storage.tire_state_id,
          );

          if (inUseStorages.length > 0) {
            return {
              success: false,
              message: `削除対象に使用中の保管庫が含まれています: ${inUseStorages
                .map((s) => s.id)
                .join(", ")}`,
              error: "Cannot delete storages in use",
            } satisfies StorageSlotOperationResult;
          }

          const storageIdsToDelete = toDelete.map((s) => s.id);
          const { error: deleteError } = await supabase
            .from("storage_master")
            .delete()
            .in("id", storageIdsToDelete);

          if (deleteError) {
            return {
              success: false,
              error: deleteError.message,
              message: "保管庫の削除に失敗しました",
            } satisfies StorageSlotOperationResult;
          }

          return {
            success: true,
            message: `エリア${areaName}の保管庫を${currentCount}個から${targetCount}個に調整しました`,
            deletedStorages: storageIdsToDelete,
          } satisfies StorageSlotOperationResult;
        } catch (error) {
          return {
            success: false,
            error: error instanceof Error ? error.message : "Unknown error",
            message: "予期しないエラーが発生しました",
          } satisfies StorageSlotOperationResult;
        }
      };

    const deleteSpecificStorage: StorageSlotManagementRepository["deleteSpecificStorage"] =
      async (storageId) => {
        try {
          const { data: storage, error: fetchError } = await supabase
            .from("storage_master")
            .select("id, car_id, client_id, tire_state_id")
            .eq("id", storageId)
            .single();

          if (fetchError) {
            return {
              success: false,
              error: fetchError.message,
              message: "保管庫が見つかりません",
            } satisfies StorageSlotOperationResult;
          }

          if (storage.car_id || storage.client_id || storage.tire_state_id) {
            return {
              success: false,
              message: `保管庫${storageId}は使用中のため削除できません`,
              error: "Storage is in use",
            } satisfies StorageSlotOperationResult;
          }

          const { error: deleteError } = await supabase
            .from("storage_master")
            .delete()
            .eq("id", storageId);

          if (deleteError) {
            return {
              success: false,
              error: deleteError.message,
              message: "保管庫の削除に失敗しました",
            } satisfies StorageSlotOperationResult;
          }

          return {
            success: true,
            message: `保管庫${storageId}を削除しました`,
          } satisfies StorageSlotOperationResult;
        } catch (error) {
          return {
            success: false,
            error: error instanceof Error ? error.message : "Unknown error",
            message: "予期しないエラーが発生しました",
          } satisfies StorageSlotOperationResult;
        }
      };

    return {
      getAreaConfigs,
      adjustStorageSlots,
      deleteSpecificStorage,
    };
  };
