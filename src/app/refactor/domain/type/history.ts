export type HistorySeason = "summer" | "winter";

export interface HistoryClient {
  id?: number;
  client_name: string;
}

export interface HistoryCar {
  id?: number;
  car_model: string;
  car_number: string;
}

export interface HistoryState {
  id?: number;
  assigner?: string;
}

export interface HistoryStorage {
  id: string;
}

export interface HistoryLogInput {
  id: number;
  year: number;
  season: HistorySeason;
  storage: HistoryStorage;
  client?: HistoryClient;
  car?: HistoryCar;
  state?: HistoryState;
}

export interface HistoryListItem {
  id: number;
  year: number;
  season: HistorySeason;
  seasonLabel: string;
  storageId: string;
  clientName: string;
  carModel: string;
  carNumber: string;
  assigner: string;
}

