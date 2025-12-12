import { UseFormReturn, FieldValues, Path } from "react-hook-form";

/**
 * 共通の基本型
 */
export type ID = number;
export type StorageID = string;

export type Season = "summer" | "winter";
export type TaskStatus = "pending" | "incomplete" | "complete";

/**
 * Client
 */
export interface Client {
  id?: ID; // 作成前は undefined, DB から取得したら number
  client_name: string;
  client_name_kana: string;
  address: string;
  post_number: string;
  phone: string;
  notes: string;
}

/**
 * Car
 */
export interface Car {
  id?: ID;
  car_model: string;
  car_number: string;
}

/**
 * Inspection (点検/交換情報)
 */
export type InspectionType =
  | "tire"
  | "oil"
  | "battery"
  | "wiper"
  | "other";

export type InspectionState = "good" | "warning" | "bad" | "unknown";

export interface Inspection {
  id?: ID;
  type: InspectionType;   // "tire" / "oil" / ...
  state: InspectionState; // "good" / "warning" / ...
  is_exchange?: boolean;
  note: string;
  tire_state_id?: ID;
}

/**
 * TireState: 元の State を用途がわかる名前に
 * ※ 互換性のため alias もあとで定義
 */
export interface TireState {
  id?: ID;
  tire_maker: string;
  tire_pattern: string;
  tire_size: string;
  manufacture_year: number;
  air_pressure: number;
  tire_inspection?: Inspection;
  oil_inspection?: Inspection;
  battery_inspection?: Inspection;
  wiper_inspection?: Inspection;
  other_inspection: string;
  inspection_date?: Date;    // Supabase Row では string になる想定
  drive_distance: number;
  next_theme?: string;
  assigner?: string;
}

// 既存コード互換用 alias（必要なら徐々に TireState に移行）
export type State = TireState;

/**
 * Task: タスク本体（ID 参照版）
 * DB Row に近い形
 */
export interface TaskOutput {
  id?: ID;
  car_id: ID;
  client_id: ID;
  tire_state_id?: ID;
  status: TaskStatus;
}

/**
 * TaskInput: リレーションを展開した形（画面用）
 */
export interface TaskInput {
  id?: ID;
  car: Car;
  client?: Client;
  tire_state?: TireState;
  storage_id?: StorageID;
  status: TaskStatus;
}

/**
 * Storage 周り
 */
export interface StorageData {
  id: StorageID;
  car_id: ID | null;
  client_id: ID | null;
  tire_state_id: ID | null;
}

/**
 * 保管履歴（StorageLog）
 * ここでは「スロット単位」の履歴と想定
 */
export interface StorageLog {
  id?: ID;
  year: number;
  season: Season;
}

/**
 * 出力用: 保管スロット情報付き
 */
export interface StorageLogOutput {
  year: number;
  season: Season;
  storage: StorageData;
}

/**
 * 入力/詳細表示用: 関連情報を展開
 */
export interface StorageLogInput {
  id: ID;
  year: number;
  season: Season;
  car: Car;
  client: Client;
  state: TireState;
  storage: StorageData;
}

/**
 * StorageInput: スロットに紐づけたい情報（null/undefined を許容）
 */
export interface StorageInput {
  id?: StorageID;
  client?: Client;
  car?: Car;
  state?: TireState;
}

/**
 * 削除時のペイロード
 */
export interface DeleteStorageSchema {
  id: ID;
  tire_state_id?: ID; // 存在する場合は tire_state テーブルからも削除
  car_id?: ID;        // 存在する場合は car テーブルからも削除
  client_id?: ID;     // 存在する場合は client テーブルからも削除
}

/**
 * ValidationErrors
 */
export type ValidationErrors = Record<string, string>;

/**
 * react-hook-form 用 FormSchema
 * - fields の key を T の key に制約
 * - field type を literal union にして typo 防止
 */
export type FormFieldType =
  | "text"
  | "textarea"
  | "number"
  | "select"
  | "date"
  | "tel"
  | "checkbox";

export interface FormField<T extends FieldValues = FieldValues> {
  type: FormFieldType;
  key: Path<T>;       // react-hook-form の Path で型安全に
  label: string;
  required?: boolean; // フォーム側で optional に
}

export interface FormSchema<T extends FieldValues> {
  fields: FormField<T>[];
  submit: (data: T) => void | Promise<void>;
  title: string;
  form: UseFormReturn<T>;
  setDefault: () => void;
}

/**
 * 交換履歴付き Client
 */
export interface ExchangeHistoryItem {
  id: ID;
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

// 顧客管理（受付）用の簡易ログ型
export interface StorageLogSummary {
  id: ID;
  client_id: ID | null;
  year: number;
  season: Season;
  car: Car | null;
  next_theme: string;
}

// 顧客を ID で引くマップ
export type CustomerMap = Record<ID, ClientWithExchangeHistory>;
