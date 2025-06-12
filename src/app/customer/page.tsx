import React from "react";
import { getAllClients, getAllStorages } from "@/utils/supabaseFunction";
import CustomerManage from "./CustomerManage";

const Customer = async () => {
  const customerList = await getAllClients();

  const storageLogs = await getAllStorages();
  const initialStorageLogs = storageLogs.map((log) => ({
    id: log.id,
    client_id: log.client?.id || null,
    year: log.year,
    season: log.season,
    car: log.car || null,
    next_theme: log.state?.next_theme || "未設定",
  }));
  return (
    <React.Fragment>
      <CustomerManage
        initialCustomers={customerList}
        initialStorageLogs={initialStorageLogs}
      />
    </React.Fragment>
  );
};

export default Customer;
