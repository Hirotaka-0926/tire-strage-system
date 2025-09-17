import { supabase } from "./supabase";
import {
  TaskOutput,
  Client,
  State,
  Car,
  Inspection,
  StorageLogInput,
  TaskInput,
  deleteStorageSchema,
  StorageInput,
  StorageData,
  StorageLogOutput,
} from "@/utils/interface";
import type { AreaConfig } from "@/utils/storage";
import { PostgrestError } from "@supabase/supabase-js";

export const getAllClients = async (): Promise<Client[]> => {
  try {
    const { data, error } = await supabase
      .from("client_data")
      .select("*")
      .order("id", { ascending: true });
    if (error) {
      throw error;
    }
    const clients = data.map((client) => ({
      ...client,
      created_at: new Date(client.created_at),
    }));
    return clients;
  } catch (e) {
    console.error("Unexpected error:", e);
    return [];
  }
};

export const getAllTasks = async (): Promise<TaskInput[]> => {
  try {
    const { data, error } = await supabase
      .from("task_list")
      .select(
        `*, tire_state:tire_state(*), car:car_table(*), client:client_data(*)`
      );

    if (error) {
      throw error;
    }

    return data;
  } catch (e) {
    console.error("Unexpected error:", e);
    return [];
  }
};

export const getCarCandidate = async (clientId: number): Promise<Car[]> => {
  const { data, error } = await supabase
    .from("car_table")
    .select("*")
    .eq("client_id", clientId);
  if (error) {
    throw error;
  }
  if (!data.length || !data[0]) return [];

  return data;
};

export const upsertCar = async (car: Car): Promise<Car> => {
  const { data, error } = await supabase.from("car_table").upsert(car).select();
  if (error) {
    throw error;
  }

  return data[0];
};

export const insertTireState = async (tireData: State): Promise<void> => {
  const { data, error } = await supabase.from("tire_state").upsert([tireData]);
  if (error) {
    throw error;
  }

  console.log(data);
};

export const upsertClient = async (client: Client) => {
  try {
    console.log("Upserting client:", client);
    const { data, error } = await supabase
      .from("client_data")
      .upsert(client)
      .select()
      .single(); //要素は１つだけなので確約してあげる
    if (error) {
      throw error;
    }
    return data;
  } catch (e) {
    console.error("Unexpected error:", e);
    return null;
  }
};

export const upsertTask = async (task: TaskOutput) => {
  try {
    console.log("Upserting task:", task);

    const { data, error } = await supabase
      .from("task_list")
      .upsert(task)
      .select();
    if (error) {
      throw error;
    }
    return data;
  } catch (e) {
    console.error("Unexpected error:", e);
    return [];
  }
};

export const getSpecificClient = async (
  key: string,
  value: string
): Promise<Client[]> => {
  const { data, error } = await supabase
    .from("client_data")
    .select("*")
    .eq(key, value);
  if (error) {
    throw error;
  }
  return data;
};

export const upsertTireWithTask = async (data: State, taskId: number) => {
  const tireData = await upsertTire(data);
  console.log(tireData);
  const tireStateId = tireData[0].id;

  if (tireData && tireData.length > 0) {
    const tireId = tireData[0].id;
    const { error: taskError } = await supabase
      .from("task_list")
      .update({ tire_state_id: tireId })
      .eq("id", taskId);
    if (taskError) {
      throw taskError;
    }
  }
};

export const upsertTire = async (data: State) => {
  const {
    tire_inspection,
    oil_inspection,
    battery_inspection,
    wiper_inspection,
  } = data;
  delete data.tire_inspection;
  delete data.oil_inspection;
  delete data.battery_inspection;
  delete data.wiper_inspection;

  const inspectionArray = [
    tire_inspection,
    oil_inspection,
    battery_inspection,
    wiper_inspection,
  ];
  console.log(data);
  const { data: tireData, error: tireError } = await supabase
    .from("tire_state")
    .upsert(data)
    .select();
  if (tireError) {
    throw tireError;
  }

  const tireStateId = tireData[0].id;
  if (tire_inspection) tire_inspection.tire_state_id = tireStateId;
  if (oil_inspection) oil_inspection.tire_state_id = tireStateId;
  if (battery_inspection) battery_inspection.tire_state_id = tireStateId;
  if (wiper_inspection) wiper_inspection.tire_state_id = tireStateId;

  const { error: inspectionError } = await supabase
    .from("inspection")
    .upsert(inspectionArray);
  if (inspectionError) {
    throw inspectionError;
  }
  return tireData;
};

export const pushNewState = async (car_id: number) => {
  const { data, error } = await supabase
    .from("tire_state")
    .insert([{ car_id: car_id }])
    .select("*");
  if (error) {
    throw error;
  }
  return data;
};

export const getStateByTaskId = async (taskId: number): Promise<State> => {
  const { data, error } = await supabase
    .from("task_list")
    .select("*, tire_state:tire_state(*)")
    .eq("id", taskId)
    .single();

  if (error) {
    throw error;
  }

  if (!data || !data.tire_state) {
    throw new Error("Task or tire state not found");
  }

  // Get additional inspection data for the tire state
  const tireStateId = data.tire_state.id;
  const { data: inspectionData, error: inspectionError } = await supabase
    .from("inspection")
    .select("*")
    .eq("tire_state_id", tireStateId);

  if (inspectionError) {
    throw inspectionError;
  }

  // Merge inspection data with the tire state
  const result = {
    ...data.tire_state,
    tire_state: inspectionData.find(
      (inspection: Inspection) => inspection.type === "tire"
    ),
    oil: inspectionData.find(
      (inspection: Inspection) => inspection.type === "oil"
    ),
    battery: inspectionData.find(
      (inspection: Inspection) => inspection.type === "battery"
    ),
    wiper: inspectionData.find(
      (inspection: Inspection) => inspection.type === "wiper"
    ),
    other: inspectionData.find(
      (inspection: Inspection) => inspection.type === "other"
    ),
  };

  return result;
};

export const getAllStorages = async (
  year?: number,
  season?: "summer" | "winter"
): Promise<StorageLogInput[]> => {
  try {
    // クエリビルダーを初期化
    let query = supabase
      .from("storage_logs")
      .select(
        "*, storage:storage_master(*), state:tire_state(*), car:car_table(*), client:client_data(*)"
      );

    // 条件付きフィルタリングを追加
    if (year !== undefined) {
      query = query.eq("year", year);
    }

    if (season !== undefined) {
      query = query.eq("season", season);
    }

    // ソート順を追加
    query = query.order("year", { ascending: true });

    // クエリを実行
    const { data, error } = await query;

    if (error) {
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error("Error fetching all storages:", error);
    throw error;
  }
};

export const getStorageById = async (
  storageId: number
): Promise<StorageLogInput> => {
  try {
    const { data: storageData, error: storageError } = await supabase
      .from("storage_logs")
      .select(
        "*, storage:storage_master(*), state:tire_state(*), car:car_table(*), client:client_data(*)"
      )
      .eq("id", storageId)
      .single();

    if (storageError) {
      throw storageError;
    }

    return storageData;
  } catch (e) {
    console.error("Error fetching storage by ID:", e);
    throw e;
  }
};

export const getStoragedYear = async () => {
  const { data, error } = await supabase
    .from("storage_logs")
    .select("year")
    .order("year");
  if (error) {
    throw error;
  }
  console.log(data);
  return data;
};

export const getAllMasterStorages = async () => {
  const { data, error } = await supabase
    .from("storage_master")
    .select("*, car:car_table(*), client:client_data(*), state:tire_state(*)")
    .order("id", { ascending: true });

  if (error) {
    throw error;
  }
  return data;
};

export const getStoragesType = async (): Promise<string[]> => {
  const { data, error } = await supabase
    .from("storage_master")
    .select("id")
    .order("id", { ascending: true });
  if (error) {
    throw error;
  }
  // Create a Set to get unique values, then convert back to array
  const uniqueTypes = [...new Set(data.map((item) => item.id.split("_")[0]))];
  return uniqueTypes;
};

export const getStoragesUseId = async (): Promise<string[]> => {
  try {
    // 指定されたStorage_idとyear, seasonに一致するデータを取得
    const { data, error } = await supabase
      .from("storage_master")
      .select("id")
      .not("car_id", "is", null)
      .not("client_id", "is", null)
      .not("inspection_id", "is", null);

    if (error) {
      throw error;
    }
    // Return array with id values as strings
    return data ? data.map((item) => item.id) : [];
  } catch (error) {
    console.error("Error fetching storage use numbers:", error);
    throw error;
  }
};

export const getStorageByMasterStorageId = async (
  id: string
): Promise<StorageInput> => {
  try {
    const { data, error } = await supabase
      .from("storage_master")
      .select("*, state:tire_state(*), car:car_table(*), client:client_data(*)")
      .eq("id", id)
      .maybeSingle();

    if (error) {
      throw error;
    }
    if (!data) {
      throw new Error("Storage not found");
    }
    return data;
  } catch (error) {
    console.error("Error fetching storage by master storage ID:", error);
    throw error;
  }
};

export const getInspectionCount = async (
  year: number,
  season: "summer" | "winter"
) => {
  try {
    const { count, error } = await supabase
      .from("storage_logs")
      .select("id", { count: "exact" })
      .eq("year", year)
      .eq("season", season);

    if (error) {
      throw error;
    }

    return count || 0;
  } catch (error) {
    console.error("Error fetching inspection count:", error);
    return 0;
  }
};

export const deleteStorages = async (deleteStorages: deleteStorageSchema[]) => {
  try {
    const storage_logs_Ids = deleteStorages.map((storage) => storage.id);
    const tire_state_Ids = deleteStorages.map(
      (storage) => storage.tire_state_id!
    );
    const car_Ids = deleteStorages.map((storage) => storage.car_id!);
    const client_Ids = deleteStorages.map((storage) => storage.client_id!);
    const { error: storages_error } = await supabase
      .from("storage_logs")
      .delete()
      .in("id", storage_logs_Ids)
      .select("*");
    const { error: tire_state_error } = await supabase
      .from("tire_state")
      .delete()
      .in("id", tire_state_Ids)
      .select("*");
    const { error: car_error } = await supabase
      .from("car_table")
      .delete()
      .in("id", car_Ids)
      .select("*");
    const { error: client_error } = await supabase
      .from("client_data")
      .delete()
      .in("id", client_Ids)
      .select("*");
    if (storages_error || tire_state_error || car_error || client_error) {
      throw storages_error || tire_state_error || car_error || client_error;
    }
    return true;
  } catch (error) {
    console.error("Error deleting storages:", error);
    throw error;
  }
};

export const getLogsByStorageId = async (
  storage_id: string
): Promise<StorageLogInput[]> => {
  const { data, error } = await supabase
    .from("storage_logs")
    .select(
      "*, storage:storage_master(*), state:tire_state(*), car:car_table(*), client:client_data(*)"
    )
    .eq("storage_id", storage_id)
    .order("year", { ascending: true });
  if (error) {
    throw error;
  }
  return data || [];
};

export const pushNewStorageLog = async (newLog: StorageLogOutput) => {
  const newLogData = {
    year: newLog.year,
    season: newLog.season,
    storage_id: newLog.storage.id,
    tire_state_id: newLog.storage.tire_state_id,
    car_id: newLog.storage.car_id,
    client_id: newLog.storage.client_id,
  };
  const { data, error } = await supabase
    .from("storage_logs")
    .insert([newLogData]);

  if (error) {
    throw error;
  }

  return data;
};

export const upsertStorage = async (upsertData: Partial<StorageData>) => {
  const { data, error } = await supabase
    .from("storage_master")
    .update(upsertData)
    .eq("id", upsertData.id)
    .select();
  if (error) {
    throw error;
  }
  console.log("Upserted storage data:", data);
  return data;
};

export const clearStorageData = async (storageId: string) => {
  const { data, error } = await supabase
    .from("storage_master")
    .update({ car_id: null, client_id: null, tire_state_id: null })
    .eq("id", storageId)
    .select();
  if (error) {
    throw error;
  }
  return data;
};

export const updateTaskStorageId = async (
  taskId: number,
  storageId: string
) => {
  const { data, error } = await supabase
    .from("task_list")
    .update({ storage_id: storageId })
    .eq("id", taskId)
    .select("*");
  if (error) {
    throw error;
  }
  return data;
};

export const deletePendingTasks = async (id: number) => {
  const { data, error } = await supabase
    .from("task_list")
    .delete()
    .eq("id", id)
    .select("*");
  if (error) {
    throw error;
  }
  console.log("Deleted pending task:", data);
  return data;
};

export const deleteClient = async (id: number) => {
  const { data, error } = await supabase
    .from("client_data")
    .delete()
    .eq("id", id)
    .select("*");
  if (error) {
    throw error;
  }
  console.log("Deleted client:", data);
  return data;
};

export const getInspectionData = async (tire_state: State) => {
  const { data: tireData, error: tireError } = await supabase
    .from("inspection")
    .select("*")
    .eq("tire_state_id", tire_state.id);

  if (tireError) {
    throw tireError;
  }
  let tire_flag: boolean = false;
  let wiper_flag: boolean = false;
  let oil_flag: boolean = false;
  let battery_flag: boolean = false;
  tireData?.forEach((inspection) => {
    switch (inspection.type) {
      case "tire":
        tire_state.tire_inspection = inspection;
        tire_flag = true;
        break;

      case "wiper":
        tire_state.wiper_inspection = inspection;
        wiper_flag = true;
        break;

      case "oil":
        tire_state.oil_inspection = inspection;
        oil_flag = true;
        break;
      case "battery":
        tire_state.battery_inspection = inspection;
        battery_flag = true;
        break;
      default:
        console.warn(`Unknown inspection type: ${inspection.type}`);
        break;
    }
  });

  if (!tire_flag) {
    tire_state.tire_inspection = {
      type: "tire",
      state: "",
      is_exchange: false,
      note: "",
    };
  }
  if (!wiper_flag) {
    tire_state.wiper_inspection = {
      type: "wiper",
      state: "",
      is_exchange: false,
      note: "",
    };
  }
  if (!oil_flag) {
    tire_state.oil_inspection = {
      type: "oil",
      state: "",
      is_exchange: false,
      note: "",
    };
  }
  if (!battery_flag) {
    tire_state.battery_inspection = {
      type: "battery",
      state: "",
      is_exchange: false,
      note: "",
    };
  }

  return tire_state;
};

export const updateTaskStatus = async (taskId: number, status: string) => {
  const { data, error } = await supabase
    .from("task_list")
    .update({ status: status })
    .eq("id", taskId)
    .select();

  if (error) {
    throw error;
  }
  return data;
};

export const getLogsByClientId = async (
  clientId: number
): Promise<StorageLogInput[]> => {
  const { data, error } = await supabase
    .from("storage_logs")
    .select(
      "*, storage:storage_master(*), state:tire_state(*), car:car_table(*), client:client_data(*)"
    )
    .eq("client_id", clientId)
    .order("year", { ascending: true });
  if (error) {
    throw error;
  }
  return data || [];
};

export const clearStorageIdFromTask = async (
  storageId: string,
  taskId: string
) => {
  const { data, error } = await supabase
    .from("task_list")
    .update({ storage_id: null })
    .eq("storage_id", storageId)
    .eq("id", taskId)
    .select();

  if (error) {
    throw error;
  }
  return data;
};

// export const getStorageByKeyValue = async(key:string, value : string|number) : Promise<StorageInput> => {

// }

export const getAreaConfig = async (): Promise<AreaConfig[]> => {
  try {
    const { data, error } = await supabase.from("storage_master").select("id");

    if (error) {
      throw error;
    }

    if (!data || data.length === 0) {
      return [];
    }

    // IDからエリア名（アンダースコアより前の部分）を抽出
    const areaMap = new Map<string, number>();

    data.forEach((item) => {
      const areaName = item.id.split("_")[0]; // "A_001" → "A"
      areaMap.set(areaName, (areaMap.get(areaName) || 0) + 1);
    });

    // AreaConfig[]形式で返却
    return Array.from(areaMap.entries()).map(([name, totalSlots]) => ({
      name,
      totalSlots,
    }));
  } catch (error) {
    console.error("Error fetching area config:", error);
    return [];
  }
};

export const getStorages = async (): Promise<StorageData[]> => {
  try {
    const { data, error } = await supabase
      .from("storage_master")
      .select("id, car_id, client_id, tire_state_id")
      .order("id", { ascending: true });

    if (error) {
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error("Error fetching storages:", error);
    throw error;
  }
};

export const addNewStorage = async (
  storageData: StorageData[]
): Promise<PostgrestError | null> => {
  const { error } = await supabase
    .from("storage_master")
    .upsert(storageData)
    .select();

  return error;
};

export const adjustStorageSlots = async (
  areaName: string,
  targetCount: number
): Promise<{
  success: boolean;
  message: string;
  deletedStorages?: string[];
  error?: string;
}> => {
  try {
    // 指定エリアの全保管庫を取得（番号順でソート）
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
      };
    }

    if (!storages) {
      return {
        success: false,
        message: `エリア${areaName}に保管庫が見つかりません`,
        error: "No storages found",
      };
    }

    const currentCount = storages.length;

    // 現在の数量が目標と同じまたは少ない場合は何もしない
    if (currentCount <= targetCount) {
      return {
        success: true,
        message: `エリア${areaName}の現在の保管庫数（${currentCount}個）は目標数（${targetCount}個）以下です。削除は不要です。`,
      };
    }

    const deleteCount = currentCount - targetCount;

    // 番号の大きい順（降順）で削除対象を選択
    const storagesSortedDesc = [...storages].sort((a, b) =>
      b.id.localeCompare(a.id)
    );
    const toDelete = storagesSortedDesc.slice(0, deleteCount);

    // 使用中の保管庫が削除対象に含まれていないかチェック
    const inUseStorages = toDelete.filter(
      (storage) => storage.car_id || storage.client_id || storage.tire_state_id
    );

    if (inUseStorages.length > 0) {
      return {
        success: false,
        message: `削除対象に使用中の保管庫が含まれています: ${inUseStorages
          .map((s) => s.id)
          .join(", ")}`,
        error: "Cannot delete storages in use",
      };
    }

    // 削除実行
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
      };
    }

    return {
      success: true,
      message: `エリア${areaName}の保管庫を${currentCount}個から${targetCount}個に調整しました`,
      deletedStorages: storageIdsToDelete,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      message: "予期しないエラーが発生しました",
    };
  }
};

export const deleteSpecificStorage = async (
  storageId: string
): Promise<{
  success: boolean;
  message: string;
  error?: string;
}> => {
  try {
    // 保管庫の存在と使用状況を確認
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
      };
    }

    // 使用中チェック
    if (storage.car_id || storage.client_id || storage.tire_state_id) {
      return {
        success: false,
        message: `保管庫${storageId}は使用中のため削除できません`,
        error: "Storage is in use",
      };
    }

    // 削除実行
    const { error: deleteError } = await supabase
      .from("storage_master")
      .delete()
      .eq("id", storageId);

    if (deleteError) {
      return {
        success: false,
        error: deleteError.message,
        message: "保管庫の削除に失敗しました",
      };
    }

    return {
      success: true,
      message: `保管庫${storageId}を削除しました`,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      message: "予期しないエラーが発生しました",
    };
  }
};

export const getPendingTasks = async (): Promise<TaskInput[]> => {
  try {
    console.log("Supabase client created for pending tasks");

    const { data, error } = await supabase
      .from("task_list")
      .select(
        "*, tire_state:tire_state(*), car:car_table(*), client:client_data(*)"
      )
      .eq("status", "pending");

    console.log("Pending tasks query result:", {
      dataLength: data?.length,
      error: error?.message,
    });

    if (error) {
      console.error("Pending tasks error details:", error);
      throw error;
    }
    return data || [];
  } catch (error) {
    console.error("Error in getPendingTasks:", error);
    throw error;
  }
};

export const getStateByID = async (state_id: string): Promise<State> => {
  const { data, error } = await supabase
    .from("tire_state")
    .select("*")
    .eq("id", state_id)
    .single();
  if (error) {
    throw error;
  }
  return data;
};

export const clearStorage = async (storage_id: string) => {
  const { error } = await supabase
    .from("storage_master")
    .update({ car_id: null, client_id: null, tire_state_id: null })
    .eq("id", storage_id);

  if (error) {
    console.error("Error clearing storage:", error);
    throw error;
  }

  return error;
};
