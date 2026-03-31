"use client";

import { useMemo, useState } from "react";
import { createStorageCsvExportApplication } from "@/app/refactor/application/storage/storageCsvExportApplication";
import type { StorageCsvRecord } from "@/app/refactor/domain/type/storage";

interface UseStorageToCsvReturn {
  isLoading: boolean;
  error: Error | null;
  convertToCSV: (data: StorageCsvRecord[]) => string;
  downloadCSV: (data: StorageCsvRecord[], fileName?: string) => void;
  downloadAllStoragesCSV: (fileName?: string) => Promise<void>;
}

export const useStorageToCsv = (): UseStorageToCsvReturn => {
  const app = useMemo(() => createStorageCsvExportApplication(), []);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const getCurrentYearAndSeason = (): { year: number; season: string } => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const season = month >= 5 && month <= 9 ? "summer" : "winter";
    return { year, season };
  };

  const generateFileName = (baseName: string): string => {
    const { year, season } = getCurrentYearAndSeason();
    return `${baseName}_${year}_${season}.csv`;
  };

  const convertToCSV = (data: StorageCsvRecord[]): string => {
    if (!data || data.length === 0) {
      return "";
    }

    const headers = [
      "ストレージID",
      "顧客名",
      "顧客住所",
      "郵便番号",
      "電話番号",
      "車種",
      "ナンバープレート",
      "タイヤメーカー",
      "タイヤパターン",
      "タイヤサイズ",
      "製造年",
      "空気圧",
      "走行距離",
      "担当者",
      "点検日",
      "次回テーマ",
    ];

    const csvRows = data.map((item) => [
      item.id || "",
      item.client?.client_name || "",
      item.client?.address || "",
      item.client?.post_number || "",
      item.client?.phone || "",
      item.car?.car_model || "",
      item.car?.car_number || "",
      item.state?.tire_maker || "",
      item.state?.tire_pattern || "",
      item.state?.tire_size || "",
      item.state?.manufacture_year?.toString() || "",
      item.state?.air_pressure?.toString() || "",
      item.state?.drive_distance?.toString() || "",
      item.state?.assigner || "",
      item.state?.inspection_date
        ? new Date(item.state.inspection_date).toLocaleDateString("ja-JP")
        : "",
      item.state?.next_theme || "",
    ]);

    return [
      headers.join(","),
      ...csvRows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");
  };

  const downloadCSV = (data: StorageCsvRecord[], fileName?: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const csvContent = convertToCSV(data);
      if (!csvContent) {
        throw new Error("CSVデータが空です");
      }

      const finalFileName = fileName || generateFileName("storage_master");
      const csvWithBOM = "\uFEFF" + csvContent;
      const blob = new Blob([csvWithBOM], { type: "text/csv;charset=utf-8;" });

      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", finalFileName);
      link.style.visibility = "hidden";

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("CSVダウンロードエラー:", err);
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setIsLoading(false);
    }
  };

  const downloadAllStoragesCSV = async (fileName?: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const allStorageData = await app.getAllStoragesForCsv();
      const csvContent = convertToCSV(allStorageData);
      const finalFileName = fileName || generateFileName("all_storages_master");
      const csvWithBOM = "\uFEFF" + csvContent;
      const blob = new Blob([csvWithBOM], { type: "text/csv;charset=utf-8;" });

      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", finalFileName);
      link.style.visibility = "hidden";

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("全ストレージCSVダウンロードエラー:", err);
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    convertToCSV,
    downloadCSV,
    downloadAllStoragesCSV,
  };
};
