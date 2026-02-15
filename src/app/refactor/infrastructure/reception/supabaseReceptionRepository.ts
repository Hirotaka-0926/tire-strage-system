import { supabase } from "@/utils/supabase";
import { Car, Client, TaskOutput } from "@/app/refactor/domain/type/reception";
import { CustomerReceptionRepository } from "@/app/refactor/application/reception/customerReceptionRepository";
import {
  mapCarFromSupabase,
  mapCarToSupabase,
  mapClientFromSupabase,
  mapClientToSupabase,
  mapTaskToSupabase,
} from "../mapper/reseptionMapper";

export const createSupabaseReceptionRepository =
  (): CustomerReceptionRepository => {
    const saveCustomer = async (client: Client): Promise<Client> => {
      const payload = mapClientToSupabase(client);
      const { data, error } = await supabase
        .from("client_data")
        .upsert(payload)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return mapClientFromSupabase(data);
    };

    const deleteCustomer = async (customerId: number) => {
      const { error } = await supabase
        .from("client_data")
        .delete()
        .eq("id", customerId);

      if (error) {
        throw error;
      }
    };

    const saveCar = async (car: Car): Promise<Car> => {
      const payload = mapCarToSupabase(car);
      const { data, error } = await supabase
        .from("car_table")
        .upsert(payload)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return mapCarFromSupabase(data);
    };

    const saveTask = async (task: TaskOutput) => {
      const payload = mapTaskToSupabase(task);
      const { error } = await supabase.from("task_list").upsert(payload);

      if (error) {
        throw error;
      }
    };

    return {
      saveCustomer,
      deleteCustomer,
      saveCar,
      saveTask,
    };
  };

