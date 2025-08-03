import { createClient } from "@/utils/server";
import {
  StorageLogInput,
  TaskInput,
  StorageInput,
  Client,
  StorageData,
  Inspection,
} from "@/utils/interface";
import type { AreaConfig } from "@/utils/storage";

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
    console.log("Hello storagemaser");
    if (error) {
      console.error("Supabase query error:", error);
      throw error;
    }
    if (!data) {
      throw new Error("Storage not found");
    }

    if (data.state) {
      const storageData = data;
      const { data: inspectionData, error: inspectionError } = await supabase
        .from("inspection")
        .select("*")
        .eq("tire_state_id", data.state.id);

      console.log("Inspection data:", inspectionData);

      if (inspectionError) {
        console.error("Inspection data fetch error:", inspectionError);
        throw inspectionError;
      }

      inspectionData?.forEach((inspection: Inspection) => {
        if (inspection.type === "tire") {
          storageData.state.tire_inspection = inspection;
        } else if (inspection.type === "wiper") {
          storageData.state.wiper_inspection = inspection;
        } else if (inspection.type === "battery") {
          storageData.state.battery_inspection = inspection;
        } else if (inspection.type === "oil") {
          storageData.state.oil_inspection = inspection;
        }
      });
      console.log("Storage data with inspections:", storageData);
      return storageData;
    } else {
      return data;
    }
  } catch (error) {
    console.error("Error fetching storage by master storage ID:", error);
    throw error;
  }
};

export const getPendingTasks = async (): Promise<TaskInput[]> => {
  try {
    console.log("Environment check:");
    console.log(
      "SUPABASE_URL:",
      process.env.NEXT_PUBLIC_SUPABASE_URL ? "✓ Set" : "✗ Missing"
    );
    console.log(
      "SUPABASE_ANON_KEY:",
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "✓ Set" : "✗ Missing"
    );

    const supabase = await createClient();
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
    console.log("Fetching all clients...");
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("client_data")
      .select("*")
      .order("id", { ascending: true });

    console.log("Clients query result:", {
      dataLength: data?.length,
      error: error?.message,
    });

    if (error) {
      console.error("Clients error details:", error);
      throw error;
    }

    const clients =
      data?.map((client) => ({
        ...client,
        created_at: new Date(client.created_at),
      })) || [];

    console.log("Processed clients count:", clients.length);
    return clients;
  } catch (e) {
    console.error("Unexpected error in getAllClients:", e);
    return [];
  }
};

export const getAreaConfig = async (): Promise<AreaConfig[]> => {
  const supabase = await createClient();
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
};

export const getStorages = async (): Promise<StorageData[]> => {
  try {
    const supabase = await createClient();
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
