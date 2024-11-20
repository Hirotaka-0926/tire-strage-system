import { supabase } from "./supabase";
import { Task, Client } from "@/interface/interface";

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
