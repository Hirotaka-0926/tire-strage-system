export interface Client {
  id: number;
  client_name: string;
  client_name_kana: string;
  car_model: string;
  car_number: string;
  address: string;
  post_number: string;
  created_at: Date;
}

export interface Tire {
  id: number;
  client_id: number; //これはClientの外部キーである
  tire_maker: string;
  tire_pattern: string;
  tire_size: string;
  manufacture_year: number;
  air_pressure: number;
  tire_state: string;
}

export interface Inspection_Item {
  id: number;
  tire_id: number; //これはTireの外部キーである
  tire: Inspection;
  oil: Inspection;
  battery: Inspection;
  wiper: Inspection;
  other: string;
  state: string;
  memo: Memo;
}

interface Inspection {
  state: string;
  exchange: boolean;
  note: string;
}

interface Memo {
  inspection_date: Date;
  distance: number;
  next_theme: string;
}

export interface Task {
  id: number;
  client_id: number; //これはClientの外部キーである
  state: number;
}
