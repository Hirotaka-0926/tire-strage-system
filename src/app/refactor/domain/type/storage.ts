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
