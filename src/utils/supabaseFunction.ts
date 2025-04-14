import { supabase } from "./supabase";
import {
  Task,
  Client,
  State,
  Car,
  Inspection,
  StorageDisplay,
} from "@/utils/interface";

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
  (Task & { tire_state: State & { car: Car & { client: Client } } })[]
> => {
  try {
    const { data, error } = await supabase
      .from("TaskList")
      .select(
        `*, tire_state:Tire_State(*, car:CarTable(*, client:ClientData(*)))`
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
    .from("CarTable")
    .select("*")
    .eq("client_id", clientId);
  if (error) {
    throw error;
  }
  if (!data.length || !data[0]) return [];

  return data;
};

export const upsertCar = async (car: Car) => {
  const { data, error } = await supabase.from("CarTable").upsert(car).select();
  if (error) {
    throw error;
  }

  return data;
};

export const insertTireState = async (tireData: State): Promise<void> => {
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

export const upsertTire = async (data: State, taskId: number) => {
  const { tire_state, oil, battery, wiper } = data;
  delete data.tire_state;
  delete data.oil;
  delete data.battery;
  delete data.wiper;
  const inspectionArray = [tire_state, oil, battery, wiper];
  console.log(data);
  const { data: tireData, error: tireError } = await supabase
    .from("Tire_State")
    .upsert(data)
    .select();
  if (tireError) {
    throw tireError;
  }

  const { error: inspectionError } = await supabase
    .from("Inspection")
    .upsert(inspectionArray);
  if (inspectionError) {
    throw inspectionError;
  }

  if (tireData && tireData.length > 0) {
    const tireId = tireData[0].id;
    const { error: taskError } = await supabase
      .from("TaskList")
      .update({ tire_state_id: tireId })
      .eq("id", taskId);
    if (taskError) {
      throw taskError;
    }
  }
};

// export const getTaskById = async (id: number) => {
//   const { data, error } = await supabase
//     .from("TaskList")
//     .select("*, state:Tire_State(*, car:CarTable(*, client:ClientData(*)))")
//     .eq("id", id);
//   if (error) {
//     throw error;
//   }
//   const {data:inspectionData, error: inspectionError} = await supabase.from("Inspection").select("*").eq("tire_state_id", data[0].tire_state_id);

//   const result = {
//     ...data.tire_state,
//     tire_state: inspectionData.find(
//       (inspection: Inspection) => inspection.type === "tire_state"
//     ),
//     oil: inspectionData.find(
//       (inspection: Inspection) => inspection.type === "oil"
//     ),
//     battery: inspectionData.find(
//       (inspection: Inspection) => inspection.type === "battery"
//     ),
//     wiper: inspectionData.find(
//       (inspection: Inspection) => inspection.type === "wiper"
//     ),
//     other: inspectionData.find(
//       (inspection: Inspection) => inspection.type === "other"
//     ),
//   };

//   return data;
// };

export const pushNewState = async (car_id: number) => {
  const { data, error } = await supabase
    .from("Tire_State")
    .insert([{ car_id: car_id }])
    .select("*");
  if (error) {
    throw error;
  }
  return data;
};

export const getStateByTaskId = async (taskId: number): Promise<State> => {
  const { data, error } = await supabase
    .from("TaskList")
    .select("*, tire_state:Tire_State(*)")
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
    .from("Inspection")
    .select("*")
    .eq("tire_state_id", tireStateId);

  if (inspectionError) {
    throw inspectionError;
  }

  // Merge inspection data with the tire state
  const result = {
    ...data.tire_state,
    tire_state: inspectionData.find(
      (inspection: Inspection) => inspection.type === "tire_state"
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

export const getAllStorages = async (): Promise<StorageDisplay[]> => {
  const { data, error } = await supabase
    .from("StorageLogs")
    .select(
      "*, storage:StorageMaster(*), state:Tire_State(*, car:CarTable(*, client:ClientData(*)))"
    );

  if (error) {
    throw error;
  }

  return data;
};

export const getStorageById = async (
  storageId: number
): Promise<StorageDisplay> => {
  try {
    const { data: storageData, error: storageError } = await supabase
      .from("StorageLogs")
      .select(
        "*, storage:StorageMaster(*), state:Tire_State(*, car:CarTable(*, client:ClientData(*)))"
      )
      .eq("id", storageId)
      .single();

    if (storageError) {
      throw storageError;
    }

    const { data: inspectionData, error: inspectionError } = await supabase
      .from("Inspection")
      .select("*")
      .eq("tire_state_id", storageData.state.id);

    if (inspectionError) {
      throw inspectionError;
    }
    const result: StorageDisplay = {
      ...storageData,
      state: {
        ...storageData.state,
        tire_state: inspectionData.find(
          (inspection: Inspection) => inspection.type === "tire_state"
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
      },
    };
    return result;
  } catch (e) {
    console.error("Error fetching storage by ID:", e);
    throw e;
  }
};

export const getStoragedYear = async () => {
  const { data, error } = await supabase
    .from("StorageLogs")
    .select("year")
    .order("year");
  if (error) {
    throw error;
  }
  console.log(data);
  return data;
};
