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
  console.log(taskId);
  const { data, error } = await supabase
    .from("TaskList")
    .select("ClientData(*)")
    .eq("id", taskId)
    .single();
  if (error) {
    throw error;
  }
  const clientData: Client = data.ClientData[0];
  console.log(clientData);
  return clientData;
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
  const tireData: Tire = data.Tire_State[0];
  return tireData;
};

export const getInspectionFromClient = async (
  clientId: number
): Promise<Inspection_Item> => {
  const { data, error } = await supabase
    .from("ClientData")
    .select("Inspection(*)")
    .eq("id", clientId)
    .single();
  if (error) {
    throw error;
  }
  const inspectionData: Inspection_Item = data.Inspection[0];
  return inspectionData;
};
