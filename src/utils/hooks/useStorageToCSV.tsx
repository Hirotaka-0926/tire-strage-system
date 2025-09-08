"use client";

import { useState } from "react";
import type { StorageData, StorageInput } from "@/utils/interface";
import { getStoragesType } from "@/utils/supabaseFunction";
import { supabase } from "@/utils/supabase";

interface UseStorageToCSVReturn {
  isLoading: boolean;
  error: Error | null;
  convertToCSV: (data: StorageInput[] | StorageData[]) => string;
  downloadCSV: (
    data: StorageInput[] | StorageData[],
    fileName?: string
  ) => void;
  downloadAllStoragesCSV: (fileName?: string) => Promise<void>;
}

/**
 * StorageMasterの内容をCSVファイルに変換するためのカスタムフック
 */
export const useStorageToCSV = (): UseStorageToCSVReturn => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  /**
   * 現在の年とシーズンを取得するヘルパー関数
   */
  const getCurrentYearAndSeason = (): { year: number; season: string } => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1; // getMonth() は 0-11 を返すので +1

    // 日本でのタイヤシーズンの目安
    // 冬タイヤ：10月～4月、夏タイヤ：5月～9月
    const season = month >= 5 && month <= 9 ? "summer" : "winter";

    return { year, season };
  };

  /**
   * 年とシーズンを含むファイル名を生成
   */
  const generateFileName = (baseName: string): string => {
    const { year, season } = getCurrentYearAndSeason();
    return `${baseName}_${year}_${season}.csv`;
  };

  /**
   * ストレージデータをCSV形式の文字列に変換
   */
  const convertToCSV = (data: StorageInput[] | StorageData[]): string => {
    if (!data || data.length === 0) {
      return "";
    }

    // CSVヘッダーの作成
    const headers = [
      "ストレージID",
      "顧客名",
      "顧客住所",
      "郵便番号",
      "電話番号",
      "車種",
      "ナンバープレート",
      "モデル年",
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

    // CSVデータの作成
    const csvRows = data.map((item) => {
      if ("client" in item || "car" in item || "state" in item) {
        return [
          item.id || "",
          item.client?.client_name || "",
          item.client?.address || "",
          item.client?.post_number || "",
          item.client?.phone || "",
          item.car?.car_model || "",
          item.car?.car_number || "",
          item.car?.model_year?.toString() || "",
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
        ];
      }
      // StorageDataの場合
      else if (
        "car_id" in item &&
        "client_id" in item &&
        "tire_state_id" in item
      ) {
        return [
          item.id || "",
          "", // 顧客名（StorageDataにはない）
          "", // 顧客住所（StorageDataにはない）
          "", // 郵便番号（StorageDataにはない）
          "", // 電話番号（StorageDataにはない）
          "", // 車種（StorageDataにはない）
          "", // ナンバープレート（StorageDataにはない）
          "", // モデル年（StorageDataにはない）
          "", // タイヤメーカー（StorageDataにはない）
          "", // タイヤパターン（StorageDataにはない）
          "", // タイヤサイズ（StorageDataにはない）
          "", // 製造年（StorageDataにはない）
          "", // 空気圧（StorageDataにはない）
          "", // 走行距離（StorageDataにはない）
          "", // 担当者（StorageDataにはない）
          "", // 点検日（StorageDataにはない）
          "", // 次回テーマ（StorageDataにはない）
        ];
      }
      // StorageInputの場合

      // 予期しない形式の場合
      else {
        return Array(headers.length).fill("");
      }
    });

    // CSV文字列の作成
    const csvContent = [
      headers.join(","),
      ...csvRows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");

    return csvContent;
  };

  /**
   * CSVファイルをダウンロード
   */
  const downloadCSV = (
    data: StorageInput[] | StorageData[],
    fileName?: string
  ) => {
    try {
      setIsLoading(true);
      setError(null);

      const csvContent = convertToCSV(data);

      if (!csvContent) {
        throw new Error("CSVデータが空です");
      }

      // ファイル名が指定されていない場合は年とシーズンを含む名前を生成
      const finalFileName = fileName || generateFileName("storage_master");

      // BOMを追加してExcelで正しく表示されるようにする
      const BOM = "\uFEFF";
      const csvWithBOM = BOM + csvContent;

      // Blobを作成
      const blob = new Blob([csvWithBOM], { type: "text/csv;charset=utf-8;" });

      // ダウンロードリンクを作成
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", finalFileName);
      link.style.visibility = "hidden";

      // リンクをクリックしてダウンロード
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // URLを解放
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("CSVダウンロードエラー:", err);
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * 全ストレージデータをエリアごとにフェッチしてCSVファイルをダウンロード
   * Supabaseの取得制限を回避するため、エリアごとに個別にフェッチ
   */
  const downloadAllStoragesCSV = async (fileName?: string) => {
    try {
      setIsLoading(true);
      setError(null);

      // ステップ1: データベースからSlotのエリア名をSetにして取得

      const areaNames = await getStoragesType();
      console.log("取得したエリア名:", areaNames);

      if (areaNames.length === 0) {
        throw new Error("エリア名が見つかりません");
      }

      // 全データを格納する配列
      const allStorageData: StorageInput[] = [];

      // ステップ2~3: それぞれのエリア名ごとにデータフェッチを繰り返し
      for (const areaName of areaNames) {
        try {
          // エリアごとのデータを個別にフェッチ
          // Supabaseの制限を回避するため、likeクエリを使用
          const { data: areaStorages, error: fetchError } = await supabase
            .from("storage_master")
            .select(
              "*, car:car_table(*), client:client_data(*), state:tire_state(*)"
            )
            .like("id", `${areaName}_%`)
            .order("id", { ascending: true });

          if (fetchError) {
            console.error(`エリア ${areaName} のフェッチエラー:`, fetchError);
            continue; // エラーが発生しても次のエリアを処理
          }

          if (areaStorages && areaStorages.length > 0) {
            console.log(
              `エリア ${areaName}: ${areaStorages.length}件のデータを取得`
            );
            allStorageData.push(...areaStorages);
          } else {
            console.log(`エリア ${areaName}: データなし`);
          }

          // 少し待機してSupabaseのレート制限を回避
          await new Promise((resolve) => setTimeout(resolve, 100));
        } catch (areaError) {
          console.error(`エリア ${areaName} の処理中にエラー:`, areaError);
          continue; // エラーが発生しても次のエリアを処理
        }
      }

      if (allStorageData.length === 0) {
        throw new Error("CSVに変換するデータがありません");
      }

      // ステップ4: フェッチしたデータをCSVに挿入
      console.log("ステップ4: CSV変換を開始");
      const csvContent = convertToCSV(allStorageData);

      // ファイル名が指定されていない場合は年とシーズンを含む名前を生成
      const finalFileName = fileName || generateFileName("all_storages_master");

      // BOMを追加してExcelで正しく表示されるようにする
      const BOM = "\uFEFF";
      const csvWithBOM = BOM + csvContent;

      // Blobを作成してダウンロード
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

      console.log(
        `CSVファイル ${finalFileName} をダウンロードしました（${allStorageData.length}件のデータ）`
      );
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
