export interface StorageAreaConfig {
  name: string;
  totalSlots: number;
}

export interface StorageSlot {
  id: string;
  car_id: number | null;
  client_id: number | null;
  tire_state_id: number | null;
}

export interface StorageMapData {
  areas: StorageAreaConfig[];
  slots: StorageSlot[];
}

export interface StorageSlotOperationResult {
  success: boolean;
  message: string;
  error?: string;
  deletedStorages?: string[];
}

export interface StorageCsvClient {
  client_name?: string | null;
  address?: string | null;
  post_number?: string | null;
  phone?: string | null;
}

export interface StorageCsvCar {
  car_model?: string | null;
  car_number?: string | null;
}

export interface StorageCsvState {
  tire_maker?: string | null;
  tire_pattern?: string | null;
  tire_size?: string | null;
  manufacture_year?: number | null;
  air_pressure?: number | null;
  drive_distance?: number | null;
  assigner?: string | null;
  inspection_date?: string | Date | null;
  next_theme?: string | null;
}

export interface StorageCsvRecord {
  id?: string | null;
  client?: StorageCsvClient | null;
  car?: StorageCsvCar | null;
  state?: StorageCsvState | null;
}
