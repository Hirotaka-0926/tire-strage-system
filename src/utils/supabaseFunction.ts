import { supabase } from "./supabase";
import { Task, Client, Tire, Inspection_Item } from "@/interface/interface";

export const getAllClients = async (): Promise<Client[]> => {
  try {
    const { data, error } = await supabase.from("ClientData").select("*");
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

export const getAllTasks = async (): Promise<(Task & { client: Client })[]> => {
  try {
    const { data, error } = await supabase
      .from("TaskList")
      .select(`*,client:ClientData(*)`);
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

export const getTire_StateFromClient = async (
  clientId: number
): Promise<Tire> => {
  const { data, error } = await supabase
    .from("ClientData")
    .select("Tire_State(*)")
    .eq("id", clientId)
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
