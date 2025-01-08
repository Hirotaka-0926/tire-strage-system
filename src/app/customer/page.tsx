"use client";

import CustomerList from "@/features/customer/CustomerList";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import SearchCustomer from "@/features/customer/SearchCustomer";

const Customer = () => {
  const [key, setKey] = useState<string>("storage_number");
  const [value, setValue] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    console.log(key, value);
  }, [key, value]);

  return (
    <React.Fragment>
      <div className="flex items-center">
        <SearchCustomer
          searchKey={key}
          setKey={setKey}
          value={value}
          setValue={setValue}
        />
        <Button className="m-4" onClick={() => router.push("/customer/new")}>
          新しい顧客を作成
        </Button>
      </div>

      <CustomerList searchKey={key} searchValue={value} />
    </React.Fragment>
  );
};

export default Customer;
