import {
  HistoryListItem,
  HistoryLogInput,
} from "@/app/refactor/domain/type/history";

export const mapHistoryLogInputFromSupabase = (row: any): HistoryLogInput => ({
  id: row?.id ?? 0,
  year: row?.year ?? 0,
  season: row?.season === "summer" ? "summer" : "winter",
  storage: {
    id: row?.storage?.id ?? "",
  },
  client: row?.client
    ? {
        id: row.client.id,
        client_name: row.client.client_name ?? "",
      }
    : undefined,
  car: row?.car
    ? {
        id: row.car.id,
        car_model: row.car.car_model ?? "",
        car_number: row.car.car_number ?? "",
      }
    : undefined,
  state: row?.state
    ? {
        id: row.state.id,
        assigner: row.state.assigner ?? "",
      }
    : undefined,
});

export const toHistoryListItem = (log: HistoryLogInput): HistoryListItem => ({
  id: log.id,
  year: log.year,
  season: log.season,
  seasonLabel: log.season === "summer" ? "夏" : "冬",
  storageId: log.storage?.id ?? "-",
  clientName: log.client?.client_name ?? "未登録",
  carModel: log.car?.car_model ?? "未登録",
  carNumber: log.car?.car_number ?? "未登録",
  assigner: log.state?.assigner?.trim() ? log.state.assigner : "担当者未登録",
});

