"use client";

import { StorageLogsToDisplay } from "@/utils/interface";
import { CSVLink } from "react-csv";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

interface Props {
  storages: StorageLogsToDisplay[];
}

const StorageToCSV: React.FC<Props> = ({ storages }) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const headers = [
    { label: "ID", key: "id" },
    { label: "作成日", key: "created_at" },
    { label: "タイヤメーカー", key: "state.tire_maker" },
    { label: "タイヤパターン", key: "state.tire_pattern" },
    { label: "タイヤサイズ", key: "state.tire_size" },
    { label: "製造年", key: "state.manufacture_year" },
    { label: "空気圧", key: "state.air_pressure" },
    { label: "車種", key: "car.car_model" },
    { label: "車番号", key: "car.car_number" },
    { label: "顧客名", key: "client.client_name" },
    { label: "顧客名（カナ）", key: "client.client_name_kana" },
    { label: "住所", key: "client.address" },
    { label: "郵便番号", key: "client.post_number" },
    { label: "検査日", key: "state.inspection_date" },
    { label: "走行距離", key: "state.drive_distance" },
    { label: "次のテーマ", key: "state.next_theme" },
  ];

  const data = storages.map((storage) => ({
    id: storage.id,
    created_at: storage.client?.created_at,
    "state.tire_maker": storage.state?.tire_maker,
    "state.tire_pattern": storage.state?.tire_pattern,
    "state.tire_size": storage.state?.tire_size,
    "state.manufacture_year": storage.state?.manufacture_year,
    "state.air_pressure": storage.state?.air_pressure,
    "car.car_model": storage.car?.car_model,
    "car.car_number": storage.car?.car_number,
    "client.client_name": storage.client?.client_name,
    "client.client_name_kana": storage.client?.client_name_kana,
    "client.address": storage.client?.address,
    "client.post_number": storage.client?.post_number,
    "state.inspection_date": storage.state?.inspection_date,
    "state.drive_distance": storage.state?.drive_distance,
    "state.next_theme": storage.state?.next_theme,
  }));

  // クライアントサイドでマウントされた後にのみCSVLinkをレンダリング
  if (!isMounted) {
    return (
      <div>
        <Button className="m-4">CSVダウンロード</Button>
      </div>
    );
  }

  return (
    <div>
      <CSVLink data={data} headers={headers} filename={"storages.csv"}>
        <Button className="m-4">CSVダウンロード</Button>
      </CSVLink>
    </div>
  );
};

export default StorageToCSV;
