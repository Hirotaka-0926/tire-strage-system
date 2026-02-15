export type PitTaskStatus = "pending" | "incomplete" | "complete";
export type PitFilterStatus = "all" | PitTaskStatus;

export interface PitClient {
  id?: number;
  client_name: string;
  client_name_kana: string;
  address: string;
  post_number: string;
  phone: string;
  notes: string;
}

export interface PitCar {
  id?: number;
  car_model: string;
  car_number: string;
}

export interface PitInspection {
  id?: number;
  type: string;
  state: string;
  is_exchange?: boolean;
  note: string;
  tire_state_id?: number;
}

export interface PitState {
  id?: number;
  tire_maker: string;
  tire_pattern: string;
  tire_size: string;
  manufacture_year: number;
  air_pressure: number;
  tire_inspection?: PitInspection;
  oil_inspection?: PitInspection;
  battery_inspection?: PitInspection;
  wiper_inspection?: PitInspection;
  other_inspection: string;
  inspection_date?: Date;
  drive_distance: number;
  next_theme?: string;
  assigner?: string;
}

export interface PitTaskInput {
  id?: number;
  car: PitCar;
  client?: PitClient;
  tire_state?: PitState;
  storage_id?: string;
  status: string;
}

export interface PitTask {
  id?: number;
  status: PitTaskStatus;
  clientName: string;
  carNumber: string;
  carModel: string;
  storageId: string;
  sourceTask: PitTaskInput;
}

export interface GroupedPitTasks {
  incomplete: PitTask[];
  complete: PitTask[];
  pending: PitTask[];
}

export interface PitStorage {
  id: string;
  car?: PitCar;
  client?: PitClient;
  state?: PitState;
}

export interface PitStorageLog {
  year: number;
  season: string;
  storage: PitStorage;
  car?: PitCar;
  client?: PitClient;
  state?: PitState;
}

export interface PitStorageAssignmentOptions {
  emptyOptions: PitStorage[];
  occupiedOptions: PitStorage[];
  customerHistory: PitStorageLog[];
}
