export type CustomerId = number;
export type CarId = number;

export type Season = "summer" | "winter";
export type TaskStatus = "pending" | "incomplete" | "complete";
export type CustomerFilterStatus =
  | "all"
  | "this-season"
  | "needs-contact"
  | "not-used";

export interface Client {
  id?: CustomerId;
  client_name: string;
  client_name_kana: string;
  address: string;
  post_number: string;
  phone: string;
  notes: string;
}

export interface Car {
  id?: CarId;
  car_model: string;
  car_number: string;
}

export interface ExchangeHistoryItem {
  id: number;
  season: Season;
  year: number;
  next_theme: string;
}

export interface ClientWithExchangeHistory extends Client {
  thisSeasonExchange?: boolean;
  lastSeasonExchange?: boolean;
  cars?: Car[];
  exchangeHistory?: ExchangeHistoryItem[];
}

export interface StorageLogSummary {
  id: number;
  client_id: CustomerId | null;
  year: number;
  season: Season;
  car: Car | null;
  next_theme: string;
}

export type CustomerMap = Record<CustomerId, ClientWithExchangeHistory>;
