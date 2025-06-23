import { UseFormReturn } from "react-hook-form";

export interface Client {
  id?: number;
  client_name: string;
  client_name_kana: string;
  address: string;
  post_number: string;
  phone: string;
  notes: string;
}

export interface State {
  id?: number;
  tire_maker: string;
  tire_pattern: string;
  tire_size: string;
  manufacture_year: number;
  air_pressure: number;
  tire_inspection?: Inspection;
  oil_inspection?: Inspection;
  battery_inspection?: Inspection;
  wiper_inspection?: Inspection;
  other_inspection: string;
  inspection_date?: Date;
  drive_distance: number;
  next_theme?: string;
}

export interface Inspection {
  id?: number;
  type: string;
  state: string;
  is_exchange?: boolean;
  note: string;
  tire_state_id?: number;
}

export interface TaskInput {
  id?: number;
  car: Car;
  client?: Client;
  tire_state?: State;
  storage_id?: string;
  status: string;
}

export interface TaskOutput {
  id?: number;
  car_id: number;
  client_id: number;
  tire_state_id?: number;
  status: string;
}

export interface StorageLog {
  id?: number;
  year: number;
  season: "summer" | "winter";
}

export interface StorageLogOutput {
  year: number;
  season: "summer" | "winter";
  storage: StorageData;
}

export interface StorageLogInput {
  id: number;
  year: number;
  season: "summer" | "winter";
  car: Car;
  client: Client;
  state: State;
  storage: StorageData;
}

export interface Car {
  id?: number;
  car_model: string;
  car_number: string;
  model_year: number;
}

import { FieldValues } from "react-hook-form";

export interface FormSchema<T extends FieldValues> {
  fields: FormField[];
  submit: (data: T) => void;
  title: string;
  form: UseFormReturn<T>;
  setDefault: () => void;
}

interface FormField {
  type: string;
  key: string;
  label: string;
  required: boolean;
}

// タスク詳細の完全な情報を表す型

export type deleteStorageSchema = {
  id: number;
  tire_state_id?: number; //tire_state_idが存在する場合はtire_stateテーブルからも削除する
  car_id?: number; //car_idが存在する場合はcarテーブルからも削除する
  client_id?: number; //client_idが存在する場合はclientテーブルからも削除する
};

export type StorageInput = {
  id?: string;
  client?: Client;
  car?: Car;
  state?: State;
};

export type StorageData = {
  id: string;
  car_id: number | null;
  client_id: number | null;
  tire_state_id: number | null;
};
export interface ValidationErrors {
  [key: string]: string;
}
