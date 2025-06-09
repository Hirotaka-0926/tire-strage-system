import React from "react";
import { getAllClients, getAllStorages } from "@/utils/supabaseFunction";
import CustomerManage from "./CustomerManage";
import { getYearAndSeason } from "@/utils/globalFunctions";

const Customer = async () => {
  const customerList = await getAllClients();
  const yearAndSeason = getYearAndSeason();
  const storageLogs = await getAllStorages();
  const initialStorageLogs = storageLogs.map((log) => ({
    id: log.id,
    client_id: log.client.id!,
    year: log.year,
    season: log.season,
    car: log.car!,
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
