import {
  PitInspection,
  PitState,
  PitTaskInput,
} from "@/app/refactor/domain/type/pit";

type InspectionRow = {
  type: string;
  state: string;
  is_exchange?: boolean;
  note: string;
  tire_state_id?: number;
};

const createInspection = (type: string): PitInspection => ({
  type,
  state: "",
  is_exchange: false,
  note: "",
});

export const createEmptyPitState = (): PitState => ({
  tire_maker: "",
  tire_size: "",
  tire_pattern: "",
  manufacture_year: 0,
  air_pressure: 0,
  other_inspection: "",
  inspection_date: new Date(),
  oil_inspection: createInspection("oil"),
  battery_inspection: createInspection("battery"),
  wiper_inspection: createInspection("wiper"),
  tire_inspection: createInspection("tire"),
  drive_distance: 0,
  next_theme: "",
});

export const mapPitStateToTireStateRow = (state: PitState) => {
  const {
    tire_inspection,
    oil_inspection,
    battery_inspection,
    wiper_inspection,
    ...tireState
  } = state;
  return tireState;
};

export const mapPitStateToInspectionRows = (
  state: PitState,
  tireStateId: number,
): InspectionRow[] => {
  const list = [
    state.tire_inspection,
    state.oil_inspection,
    state.battery_inspection,
    state.wiper_inspection,
  ].filter((inspection): inspection is PitInspection => Boolean(inspection));

  return list.map((inspection) => ({
    ...inspection,
    tire_state_id: tireStateId,
  }));
};

export const mergePitStateWithInspections = (
  base: PitState,
  inspections: InspectionRow[],
): PitState => {
  const next: PitState = { ...base };

  inspections.forEach((inspection) => {
    if (inspection.type === "tire") {
      next.tire_inspection = inspection;
      return;
    }
    if (inspection.type === "oil") {
      next.oil_inspection = inspection;
      return;
    }
    if (inspection.type === "battery") {
      next.battery_inspection = inspection;
      return;
    }
    if (inspection.type === "wiper") {
      next.wiper_inspection = inspection;
    }
  });

  if (!next.tire_inspection) next.tire_inspection = createInspection("tire");
  if (!next.oil_inspection) next.oil_inspection = createInspection("oil");
  if (!next.battery_inspection) next.battery_inspection = createInspection("battery");
  if (!next.wiper_inspection) next.wiper_inspection = createInspection("wiper");

  return next;
};

export const mapPitTaskInputFromSupabase = (task: any): PitTaskInput => ({
  id: task.id,
  status: task.status ?? "incomplete",
  storage_id: task.storage_id ?? undefined,
  car: {
    id: task.car?.id,
    car_model: task.car?.car_model ?? "",
    car_number: task.car?.car_number ?? "",
  },
  client: task.client
    ? {
        id: task.client.id,
        client_name: task.client.client_name ?? "",
        client_name_kana: task.client.client_name_kana ?? "",
        address: task.client.address ?? "",
        post_number: task.client.post_number ?? "",
        phone: task.client.phone ?? "",
        notes: task.client.notes ?? "",
      }
    : undefined,
  tire_state: task.tire_state
    ? {
        id: task.tire_state.id,
        tire_maker: task.tire_state.tire_maker ?? "",
        tire_pattern: task.tire_state.tire_pattern ?? "",
        tire_size: task.tire_state.tire_size ?? "",
        manufacture_year: task.tire_state.manufacture_year ?? 0,
        air_pressure: task.tire_state.air_pressure ?? 0,
        other_inspection: task.tire_state.other_inspection ?? "",
        inspection_date: task.tire_state.inspection_date
          ? new Date(task.tire_state.inspection_date)
          : undefined,
        drive_distance: task.tire_state.drive_distance ?? 0,
        next_theme: task.tire_state.next_theme ?? "",
        assigner: task.tire_state.assigner ?? "",
      }
    : undefined,
});
