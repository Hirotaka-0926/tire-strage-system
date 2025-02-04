import { UseFormReturn } from "react-hook-form";

export interface Client {
  id?: number;
  client_name: string;
  client_name_kana: string;
  address: string;
  post_number: string;
  created_at: Date;
}

export interface Tire {
  id: number;
  tire_maker: string;
  tire_pattern: string;
  tire_size: string;
  manufacture_year: number;
  air_pressure: number;
  tire_state: Tire_state;
  oil: Inspection;
  battery: Inspection;
  wiper: Inspection;
  other: string;
  state: string;
  memo: Memo;
}

export interface Inspection {
  state: string;
  exchange: boolean;
  note: string;
}

export interface Memo {
  inspection_date: Date;
  distance: number;
  next_theme: string;
}

export interface Task {
  id?: number;
  client_id: number; //これはClientの外部キーである
  tire_state_id?: number;
  car_id?: number;
  state: number;
}

export interface Storage {
  id?: number;
  client_id: number;
  tire_state_id: number;
  car_id: number;
  storage_id: number;
  type: "A" | "B";
}

export interface Car {
  id?: number;
  car_model: string;
  car_number: string;
}

interface Tire_state {
  state: string;
  note: string;
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
