import { supabase } from "./supabase";
import { Task, Client, Tire, Car } from "@/interface/interface";

export const getAllClients = async (): Promise<Client[]> => {
  try {
    const { data, error } = await supabase
      .from("ClientData")
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

export const getAllTasks = async (): Promise<
  (Task & { client: Client } & { car: Car })[]
> => {
  try {
    const { data, error } = await supabase
      .from("TaskList")
      .select(`*,client:ClientData(*),car:CarTable(*)`);
    if (error) {
      throw error;
    }

    return data;
  } catch (e) {
    console.error("Unexpected error:", e);
    return [];
  }
};

export const getClientFromTask = async (taskId: number): Promise<Client> => {
  try {
    const { data, error } = await supabase
      .from("TaskList")
      .select(
        `
        client_id,
        ClientData (*)
      `
      )
      .eq("id", taskId)
      .single();

    if (error) {
      throw error;
    }

    const clientData: Client = {
      ...data.ClientData,
      created_at: new Date(data.created_at),
    };
    return clientData;
  } catch (e) {
    console.error("Unexpected error:", e);
    throw e;
  }
};

export const getCarFromStorage = async (clientId: number): Promise<Car[]> => {
  const { data, error } = await supabase
    .from("StorageDB")
    .select("car:CarTable(*)")
    .eq("client_id", clientId);
  if (error) {
    throw error;
  }
  if (!data.length || !data[0].car) return [];

  const result = data.flatMap((d) => d.car);
  return result;
};

export const getCarFromExchangeLogs = async (
  clientId: number
): Promise<Car[]> => {
  const { data, error } = await supabase
    .from("ExchangeLogs")
    .select("car:CarTable(*)")
    .eq("client_id", clientId);
  if (error) {
    throw error;
  }
  if (!data.length) return [];
  if (!data[0].car) return [];

  return data.flatMap((log) => log.car);
};

export const upsertCar = async (car: Car) => {
  const { data, error } = await supabase.from("CarTable").upsert(car).select();
  if (error) {
    throw error;
  }

  return data;
};

export const getTire_StateFromClient = async (
  clientId: number
): Promise<Tire> => {
  const { data, error } = await supabase
    .from("ClientData")
    .select("Tire_State(*)")
    .eq("client_id", clientId)
    .single();
  if (error) {
    throw error;
  }

  const tireData: Tire = {
    ...data.Tire_State,
    tire_state: JSON.stringify(data.Tire_State.tire_state),
  };

  return tireData;
};

export const getInspectionFromClient = async (
  clientId: number
): Promise<Inspection_Item> => {
  const { data, error } = await supabase
    .from("ClientData")
    .select("InspectionDatas(*)")
    .eq("id", clientId)
    .single();
  if (error) {
    throw error;
  }
  const inspectionData: Inspection_Item = {
    id: data.InspectionDatas[0].id,
    tire: data.InspectionDatas[0].tire
      ? JSON.parse(data.InspectionDatas[0].tire)
      : { state: "", note: "" },
    oil: data.InspectionDatas[0].oil
      ? JSON.parse(data.InspectionDatas[0].oil)
      : { state: "", exchange: false, note: "" },
    battery: data.InspectionDatas[0].battery
      ? JSON.parse(data.InspectionDatas[0].battery)
      : { state: "", exchange: false, note: "" },
    wiper: data.InspectionDatas[0].wiper
      ? JSON.parse(data.InspectionDatas[0].wiper)
      : { state: "", exchange: false, note: "" },
    other: data.InspectionDatas[0].other || "",
    state: data.InspectionDatas[0].state || "",
    memo: data.InspectionDatas[0].memo
      ? JSON.parse(data.InspectionDatas[0].memo)
      : { inspection_date: new Date(), distance: 0, next_theme: "" },
  };
  return inspectionData;
};

export const insertTireState = async (tireData: Tire): Promise<void> => {
  const { data, error } = await supabase.from("Tire_State").upsert([tireData]);
  if (error) {
    throw error;
  }

  console.log(data);
};

export const upsertClient = async (client: Client) => {
  try {
    console.log("Upserting client:", client);
    const { data, error } = await supabase
      .from("ClientData")
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
      .from("TaskList")
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
    .from("ClientData")
    .select("*")
    .eq(key, value);
  if (error) {
    throw error;
  }
  return data;
};

export const upsertTire = async (data: Tire) => {};
