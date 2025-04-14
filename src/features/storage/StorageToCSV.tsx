"use client";

import { StorageDisplay } from "@/utils/interface";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import dynamic from "next/dynamic";

const CSVLink = dynamic(
  () => import("react-csv").then((mod) => mod.CSVLink),
  { ssr: false }
);

interface Props {
  storages: StorageDisplay[];
}

const StorageToCSV: React.FC<Props> = ({ storages }) => {
  const headers = [
    { label: "保管庫タイプ", key: "storage.storage_type" },
    { label: "保管庫番号", key: "storage.storage_number" },
    { label: "顧客名", key: "state.car.client.client_name" },
    { label: "車種", key: "state.car.car_model" },
    { label: "ナンバー", key: "state.car.car_number" },
    { label: "タイヤメーカー", key: "state.tire_maker" },
    { label: "タイヤパターン", key: "state.tire_pattern" },
    { label: "タイヤサイズ", key: "state.tire_size" },
    { label: "シーズン", key: "season" },
    { label: "年", key: "year" },
  ];

  const data = storages.map((storage) => ({
    "storage.storage_type": storage.storage.storage_type,
    "storage.storage_number": storage.storage.storage_number,
    "state.car.client.client_name": storage.state.car.client.client_name,
    "state.car.car_model": storage.state.car.car_model,
    "state.car.car_number": storage.state.car.car_number,
    "state.tire_maker": storage.state.tire_maker,
    "state.tire_pattern": storage.state.tire_pattern,
    "state.tire_size": storage.state.tire_size,
    season: storage.season,
    year: storage.year,
  }));

  return (
    <div className="flex justify-end">
      <CSVLink
        data={data}
        headers={headers}
        filename="storages.csv"
        className="inline-flex items-center gap-2"
      >
        <Button variant="outline" size="sm">
          <Download className="h-4 w-4" />
          CSVダウンロード
        </Button>
      </CSVLink>
    </div>
  );
};

export default StorageToCSV; 