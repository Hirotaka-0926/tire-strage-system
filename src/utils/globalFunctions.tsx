import { StorageDisplay } from "./interface";

/**
 * 日付から年とシーズン（夏/冬）を取得する
 * @param date - 日付オブジェクト。省略時は現在日時
 * @returns year: 年(数値)とseason: "summer"|"winter"を含むオブジェクト
 */
export const getYearAndSeason = (
  date: Date = new Date()
): Pick<StorageDisplay, "year" | "season"> => {
  // 年を取得
  const year = date.getFullYear();

  // 月に基づいて季節を判定（0-indexed: 0=1月, 11=12月）
  const month = date.getMonth();

  // 4月-9月を夏、10月-3月を冬として定義
  const season: "summer" | "winter" =
    month >= 3 && month <= 8 ? "summer" : "winter";

  return { year, season };
};

/**
 * シーズン名を日本語に変換
 * @param season - "summer" または "winter"
 * @returns 日本語のシーズン名
 */
export const getSeasonInJapanese = (season: "summer" | "winter"): string => {
  return season === "summer" ? "夏タイヤ" : "冬タイヤ";
};
