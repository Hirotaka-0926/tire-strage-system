import { StorageDisplay } from "@/utils/interface";
import { CSVLink } from "react-csv";
import React from "react";

interface Props {
  storages: StorageDisplay[];
}

const StorageToCSV: React.FC<Props> = ({ storages }) => {
  const headers = [
    { label: "ID", key: "id" },
    { label: "作成日", key: "created_at" },
    { label: "タイヤメーカー", key: "state.tire_maker" },
    { label: "タイヤパターン", key: "state.tire_pattern" },
    { label: "タイヤサイズ", key: "state.tire_size" },
    { label: "製造年", key: "state.manufacture_year" },
    { label: "空気圧", key: "state.air_pressure" },
    { label: "車種", key: "state.car.car_model" },
    { label: "車番号", key: "state.car.car_number" },
    { label: "顧客名", key: "state.car.client.client_name" },
    { label: "顧客名（カナ）", key: "state.car.client.client_name_kana" },
    { label: "住所", key: "state.car.client.address" },
    { label: "郵便番号", key: "state.car.client.post_number" },
    { label: "検査日", key: "state.inspection_date" },
    { label: "走行距離", key: "state.drive_distance" },
    { label: "次のテーマ", key: "state.next_theme" },
  ];

  const data = storages.map((storage) => ({
    id: storage.id,
    created_at: storage.state.car.client.created_at,
    "state.tire_maker": storage.state.tire_maker,
    "state.tire_pattern": storage.state.tire_pattern,
    "state.tire_size": storage.state.tire_size,
    "state.manufacture_year": storage.state.manufacture_year,
    "state.air_pressure": storage.state.air_pressure,
    "state.car.car_model": storage.state.car.car_model,
    "state.car.car_number": storage.state.car.car_number,
    "state.car.client.client_name": storage.state.car.client.client_name,
    "state.car.client.client_name_kana":
      storage.state.car.client.client_name_kana,
    "state.car.client.address": storage.state.car.client.address,
    "state.car.client.post_number": storage.state.car.client.post_number,
    "state.inspection_date": storage.state.inspection_date,
    "state.drive_distance": storage.state.drive_distance,
    "state.next_theme": storage.state.next_theme,
  }));

  return (
    <div>
      <CSVLink data={data} headers={headers}>
        CSVダウンロード
      </CSVLink>
    </div>
  );
};

export default StorageToCSV;
