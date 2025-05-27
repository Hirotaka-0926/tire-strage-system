import CustomerList from "@/features/customer/CustomerList";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import SearchCustomer from "@/features/customer/SearchCustomer";
import { getAllClients, getAllStorages } from "@/utils/supabaseFunction";
import TireManagementSystem from "./Test";
import { getYearAndSeason } from "@/utils/globalFunctions";
import { get } from "http";
import { inspect } from "util";
import next from "next";

const Customer = async () => {
  const customerList = await getAllClients();
  const yearAndSeason = getYearAndSeason();
  const storageLogs = await getAllStorages();
  const initialStorageLogs = storageLogs.map((log) => ({
    id: log.id,
    client_id: log.client.id!,
    year: log.year,
    season: log.season,

    next_theme: log.state?.next_theme || "未設定",
  }));
  return (
    <React.Fragment>
      <TireManagementSystem
        initialCustomers={customerList}
        initialStorageLogs={initialStorageLogs}
      />
    </React.Fragment>
  );
};

export default Customer;
