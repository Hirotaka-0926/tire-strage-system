import React from "react";
import CustomerReception from "@/app/refactor/presentation/reception/CustomerReception";
import {
  getAllClients,
  getAllStorages,
  getStorages,
} from "@/utils/supabaseServerFunction";
import {
  Client,
  StorageAssignmentSummary,
  StorageLogSummary,
} from "@/app/refactor/domain/type/reception";

const RefactorPage = async () => {
  const customers = await getAllClients();
  const storageLogs = await getAllStorages();
  const storageAssignments = await getStorages();

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
    storage_id: log.storage?.id ?? "",
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

  const initialStorageAssignments: StorageAssignmentSummary[] =
    storageAssignments.map((assignment) => ({
      id: assignment.id,
      client_id: assignment.client_id,
      car_id: assignment.car_id,
      tire_state_id: assignment.tire_state_id,
    }));

  return (
    <CustomerReception
      initialCustomers={initialCustomers}
      initialStorageLogs={initialStorageLogs}
      initialStorageAssignments={initialStorageAssignments}
    />
  );
};

export default RefactorPage;
