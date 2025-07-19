import { createClient } from "@/utils/server";
import {
  StorageLogInput,
  TaskInput,
  StorageInput,
  Client,
} from "@/utils/interface";

export const getStorageByMasterStorageId = async (
  id: string
): Promise<StorageInput> => {
  try {
    const supabase = await createClient();
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

export const getPendingTasks = async (): Promise<TaskInput[]> => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("task_list")
    .select(
      "*, tire_state:tire_state(*), car:car_table(*), client:client_data(*)"
    )
    .eq("status", "pending");

  if (error) {
    throw error;
  }
  return data;
};

export const getLogsByStorageId = async (
  storage_id: string
): Promise<StorageLogInput[]> => {
  const supabase = await createClient();
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

export const getAllStorages = async (
  year?: number,
  season?: "summer" | "winter"
): Promise<StorageLogInput[]> => {
  try {
    const supabase = await createClient();
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

export const getAllTasks = async (): Promise<TaskInput[]> => {
  try {
    const supabase = await createClient();
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

export const getAllClients = async (): Promise<Client[]> => {
  try {
    const supabase = await createClient();
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
