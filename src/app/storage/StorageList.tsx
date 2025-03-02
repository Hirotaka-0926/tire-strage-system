"use client";

import React, { useState, useEffect } from "react";
import { StorageDisplay } from "@/utils/interface";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useRouter } from "next/navigation";
import { getAllStorages } from "@/utils/supabaseFunction";

const StorageList: React.FC = () => {
  const router = useRouter();
  const [storageList, setStorageList] = useState<StorageDisplay[]>([]);
  const [allStorages, setAllStorages] = useState<StorageDisplay[]>([]);
  useEffect(() => {
    const fetchAllStorages = async () => {
      const storages = await getAllStorages();
      console.log(storages);
      setAllStorages(storages);
    };
    fetchAllStorages();
  }, []);

  return (
    <div className="overflow-x-auto">
      <Table className="min-w-full bg-white">
        <TableCaption>これは保管庫リスト一覧です</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>A or B</TableHead>
            <TableHead>保管庫ID</TableHead>
            <TableHead>顧客名</TableHead>
            <TableHead>車種</TableHead>
            <TableHead>ナンバー</TableHead>
            <TableHead>タイヤメーカー</TableHead>
            <TableHead>タイヤパターン</TableHead>
            <TableHead>タイヤサイズ</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {allStorages.map((storage) => (
            <TableRow
              key={storage.id}
              onClick={() => router.push(`/storage/${storage.id}`)} // 修正
              className="cursor-pointer hover:bg-gray-100"
            >
              <TableCell>{storage.AorB}</TableCell>
              <TableCell>{storage.storage_id}</TableCell>

              <TableCell>{storage.state.car.client.client_name}</TableCell>
              <TableCell>{storage.state.car.car_model}</TableCell>
              <TableCell>{storage.state.car.car_number}</TableCell>
              <TableCell>{storage.state.tire_maker}</TableCell>
              <TableCell>{storage.state.tire_pattern}</TableCell>
              <TableCell>{storage.state.tire_size}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default StorageList;
