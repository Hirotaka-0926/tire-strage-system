"use client";

import CustomerList from "@/features/customer/CustomerList";
import { useState } from "react";
import { Client } from "@/interface/interface";

const Customer = () => {
  const [clients, setClients] = useState<Client[]>([]);
  return (
    <div>
      <CustomerList clients={clients} setClients={setClients} />
    </div>
  );
};

export default Customer;
