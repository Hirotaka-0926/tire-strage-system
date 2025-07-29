export interface StorageSlot {
  id: string;
  status: "available" | "occupied";
  area: string;
  number: number;
  customerInfo?: {
    customerName: string;
    phoneNumber: string;
    tireType: string;
    storageDate: string;
    notes?: string;
  };
  lastUpdated: string;
}

export interface AreaConfig {
  name: string;
  totalSlots: number;
  color: string;
}

export interface StorageStats {
  total: number;
  available: number;
  occupied: number;
}
