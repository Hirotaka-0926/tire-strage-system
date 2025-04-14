import { UseFormReturn } from "react-hook-form";

export interface Client {
  id?: number;
  client_name: string;
  client_name_kana: string;
  address: string;
  post_number: string;
  created_at: Date;
}

export interface State {
  id?: number;
  car_id: number;
  tire_maker: string;
  tire_pattern: string;
  tire_size: string;
  manufacture_year: number;
  air_pressure: number;
  tire_state?: Inspection;
  oil?: Inspection;
  battery?: Inspection;
  wiper?: Inspection;
  other_inspection: string;
  state_inspection: string;
  inspection_date: Date;
  drive_distance: number;
  next_theme: string;
}

export interface Inspection {
  id?: number;
  type: string;
  state: string;
  isExchange?: boolean;
  note: string;
  tire_state_id?: number;
}

export interface Task {
  id?: number;
  tire_state_id?: number;
  state: number;
}

export interface StorageLog {
  id?: number;
  tire_state_id?: number;
  year: number;
  season: "summer" | "winter";
}
export interface Storage {
  id?: number;
  storage_number: number;
  storage_type: string;
}

export interface Car {
  id?: number;
  client_id: number;
  car_model: string;
  car_number: string;
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

export type StorageDisplay = StorageLog & { storage: Storage } & {
  state: State & { car: Car & { client: Client } };
};
