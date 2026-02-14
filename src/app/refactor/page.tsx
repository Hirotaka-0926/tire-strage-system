import React from "react";
import CustomerReception from "@/app/refactor/presentation/reception/CustomerReception";
import { getAllClients, getAllStorages } from "@/utils/supabaseServerFunction";
import {
  Client,
  StorageLogSummary,
} from "@/app/refactor/domain/type/reseption";

const RefactorPage = async () => {
  const customers = await getAllClients();
  const storageLogs = await getAllStorages();

  const initialCustomers: Client[] = customers.map((customer) => ({
    id: customer.id,
    client_name: customer.client_name,
    client_name_kana: customer.client_name_kana,
    post_number: customer.post_number,
    address: customer.address,
    phone: customer.phone,
    notes: customer.notes,
  }));

  const initialStorageLogs: StorageLogSummary[] = storageLogs.map((log) => ({
    id: log.id,
    client_id: log.client?.id ?? null,
    year: log.year,
    season: log.season,
    car: log.car
      ? {
          id: log.car.id,
          car_model: log.car.car_model,
          car_number: log.car.car_number,
        }
      : null,
    next_theme: log.state?.next_theme ?? "未設定",
  }));

  return (
    <CustomerReception
      initialCustomers={initialCustomers}
      initialStorageLogs={initialStorageLogs}
    />
  );
};

export default RefactorPage;
