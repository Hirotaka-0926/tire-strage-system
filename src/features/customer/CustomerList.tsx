"use client";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Client } from "@/interface/interface";
import React, { useEffect, useState } from "react";
import { getAllClients } from "@/utils/supabaseFunction";
import { useRouter } from "next/navigation";

interface Props {
  searchKey: string;
  searchValue: string;
}

const CustomerList = ({ searchKey, searchValue }: Props) => {
  const router = useRouter();
  const [allClients, setAllClients] = useState<Client[]>([]);
  const [clientsList, setClientsList] = useState<Client[]>([]);

  useEffect(() => {
    const fetchAllClients = async () => {
      const data = await getAllClients();

      setAllClients(data);
      console.log(data);
    };

    fetchAllClients();
  }, []);
  useEffect(() => {
    const extractClients = (key: string, value: string) => {
      const data = allClients.filter((client: Client) => {
        const clientValue = client[key as keyof Client];
        if (typeof clientValue === "string") {
          return clientValue.includes(value);
        } else if (typeof clientValue === "number") {
          return clientValue.toString().includes(value);
        }
      });

      return data;
    };

    if (searchValue != "") {
      const extracted = extractClients(searchKey, searchValue);
      setClientsList(extracted);
    } else {
      setClientsList(allClients);
    }

    console.log(allClients);
  }, [searchKey, searchValue, allClients]);
  return (
    <div className="overflow-x-auto">
      <Table className="min-w-full bg-white">
        <TableCaption></TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">id</TableHead>
            <TableHead>更新日</TableHead>
            <TableHead>顧客名</TableHead>
            <TableHead>顧客名（カナ）</TableHead>
            <TableHead>郵便番号</TableHead>
            <TableHead>住所</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {clientsList.map((client) => (
            <TableRow
              key={client.id}
              onClick={() => router.push(`/customer/edit/${client.id}`)}
              className="cursor-pointer hover:bg-gray-100"
            >
              <TableCell className="font-medium">{client.id}</TableCell>
              <TableCell>{client.created_at.toLocaleDateString()}</TableCell>
              <TableCell>{client.client_name}</TableCell>
              <TableCell>{client.client_name_kana}</TableCell>
              <TableCell>{client.post_number}</TableCell>
              <TableCell>{client.address}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
export default CustomerList;
