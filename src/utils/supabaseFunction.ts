import { supabase } from "./supabase";
import {
  Task,
  Client,
  State,
  Car,
  Inspection,
  StorageLogInput,
  TaskInput,
  deleteStorageSchema,
  StorageInput,
} from "@/utils/interface";

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

export const getAllTasks = async (): Promise<TaskWithDetails[]> => {
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

export const upsertCar = async (car: Car) => {
  const { data, error } = await supabase.from("car_table").upsert(car).select();
  if (error) {
    throw error;
  }

  return data;
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

export const upsertTask = async (task: Task) => {
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

export const upsertTire = async (data: State, taskId: number) => {
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

  const { error: inspectionError } = await supabase
    .from("inspection")
    .upsert(inspectionArray);
  if (inspectionError) {
    throw inspectionError;
  }

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

export const getAllStorages = async (): Promise<StorageLogInput[]> => {
  const { data, error } = await supabase
    .from("storage_logs")
    .select(
      "*, storage:storage_master(*), state:tire_state(*), car:car_table(*), client:client_data(*)"
    );

  if (error) {
    throw error;
  }

  return data;
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
    .select("*")
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

export const getStoragesUseId = async (
  year: number,
  season: "summer" | "winter"
): Promise<{ id: string; storage_id: string }[]> => {
  try {
    // 指定されたStorage_idとyear, seasonに一致するデータを取得
    const { data, error } = await supabase
      .from("storage_logs")
      .select("id, storage_id")
      .eq("year", year)
      .eq("season", season);
    if (error) {
      throw error;
    }

    // Return array with id and storage_id
    return data || [];
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

export const getPendingTasks = async (): Promise<TaskInput[] | null> => {
  const { data, error } = await supabase
    .from("task_list")
    .select(
      "*, tire_state:tire_state(*), car:car_table(*), client:client_data(*)"
    )
    .eq("state", "pending");

  if (error) {
    throw error;
  }

  if (!data) {
    return null;
  }
  return data;
};
