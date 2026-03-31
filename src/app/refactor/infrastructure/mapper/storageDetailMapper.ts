import type {
  Car,
  Client,
  Inspection,
  State,
  StorageData,
  StorageInput,
  StorageLogInput,
  TaskInput,
} from "@/utils/interface";

const toInspection = (row: any): Inspection => ({
  id: row?.id,
  type: row?.type ?? "",
  state: row?.state ?? "",
  is_exchange: Boolean(row?.is_exchange),
  note: row?.note ?? "",
  tire_state_id: row?.tire_state_id,
});

export const mapCarFromSupabase = (row: any): Car => ({
  id: row?.id,
  car_model: row?.car_model ?? "",
  car_number: row?.car_number ?? "",
});

export const mapClientFromSupabase = (row: any): Client => ({
  id: row?.id,
  client_name: row?.client_name ?? "",
  client_name_kana: row?.client_name_kana ?? "",
  address: row?.address ?? "",
  post_number: row?.post_number ?? "",
  phone: row?.phone ?? "",
  notes: row?.notes ?? "",
});

export const mapStateFromSupabase = (row: any): State => ({
  id: row?.id,
  tire_maker: row?.tire_maker ?? "",
  tire_pattern: row?.tire_pattern ?? "",
  tire_size: row?.tire_size ?? "",
  manufacture_year: row?.manufacture_year ?? 0,
  air_pressure: row?.air_pressure ?? 0,
  drive_distance: row?.drive_distance ?? 0,
  other_inspection: row?.other_inspection ?? "",
  inspection_date: row?.inspection_date ? new Date(row.inspection_date) : undefined,
  next_theme: row?.next_theme ?? "",
  assigner: row?.assigner ?? "",
});

export const applyInspectionsToState = (baseState: State, inspections: any[]): State => {
  const state: State = { ...baseState };

  for (const row of inspections ?? []) {
    const inspection = toInspection(row);
    switch (inspection.type) {
      case "tire":
        state.tire_inspection = inspection;
        break;
      case "oil":
        state.oil_inspection = inspection;
        break;
      case "battery":
        state.battery_inspection = inspection;
        break;
      case "wiper":
        state.wiper_inspection = inspection;
        break;
      default:
        break;
    }
  }

  if (!state.tire_inspection) {
    state.tire_inspection = { type: "tire", state: "", is_exchange: false, note: "" };
  }
  if (!state.oil_inspection) {
    state.oil_inspection = { type: "oil", state: "", is_exchange: false, note: "" };
  }
  if (!state.battery_inspection) {
    state.battery_inspection = { type: "battery", state: "", is_exchange: false, note: "" };
  }
  if (!state.wiper_inspection) {
    state.wiper_inspection = { type: "wiper", state: "", is_exchange: false, note: "" };
  }

  return state;
};

export const mapStorageInputFromSupabase = (row: any): StorageInput => ({
  id: row?.id,
  client: row?.client ? mapClientFromSupabase(row.client) : undefined,
  car: row?.car ? mapCarFromSupabase(row.car) : undefined,
  state: row?.state ? mapStateFromSupabase(row.state) : undefined,
});

const toStorageData = (row: any): StorageData => ({
  id: row?.id ?? "",
  car_id: row?.car_id ?? null,
  client_id: row?.client_id ?? null,
  tire_state_id: row?.tire_state_id ?? null,
});

export const mapTaskInputFromSupabase = (row: any): TaskInput => ({
  id: row?.id,
  status: row?.status ?? "",
  storage_id: row?.storage_id ?? undefined,
  car: mapCarFromSupabase(row?.car),
  client: row?.client ? mapClientFromSupabase(row.client) : undefined,
  tire_state: row?.tire_state ? mapStateFromSupabase(row.tire_state) : undefined,
});

export const mapStorageLogInputFromSupabase = (row: any): StorageLogInput => ({
  id: row?.id ?? 0,
  year: row?.year ?? 0,
  season: row?.season === "summer" ? "summer" : "winter",
  storage: toStorageData(row?.storage),
  car: mapCarFromSupabase(row?.car),
  client: mapClientFromSupabase(row?.client),
  state: mapStateFromSupabase(row?.state),
});
