import type { Season } from "@/app/refactor/domain/type/reception";

export const getYearAndSeason = (
  date: Date = new Date(),
): { year: number; season: Season } => {
  const year = date.getFullYear();
  const month = date.getMonth();
  const season: Season = month >= 3 && month <= 8 ? "summer" : "winter";
  return { year, season };
};

export const getSeasonInJapanese = (season: Season): string => {
  return season === "summer" ? "夏" : "冬";
};
