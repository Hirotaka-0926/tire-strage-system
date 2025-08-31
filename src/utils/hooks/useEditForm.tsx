"use client";

import { useState, useEffect, useCallback } from "react";
import { TaskInput, State } from "@/utils/interface";
import {
  getInspectionData,
  upsertTire,
  updateTaskStatus,
} from "@/utils/supabaseFunction";
import { toast } from "sonner";

interface UseEditFormProps {
  selectedItem: TaskInput | null;
  onSuccess?: () => void;
}

interface UseEditFormReturn {
  formData: State | null;
  isLoading: boolean;
  isSubmitting: boolean;
  error: string | null;
  updateFormData: (updates: Partial<TaskInput>) => void;
  updateTireState: (
    updates: Record<string, string | number | boolean | Date>
  ) => void;
  handleSubmit: () => Promise<void>;
  resetForm: () => void;
}

export const useEditForm = ({
  selectedItem,
  onSuccess,
}: UseEditFormProps): UseEditFormReturn => {
  const [formData, setFormData] = useState<State | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const sideEffect = selectedItem?.id || 0;

  // 初期データの取得とセットアップ
  const initializeForm = useCallback(async () => {
    if (!selectedItem) {
      setFormData(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // 基本データをセット
      let initialData: State = selectedItem.tire_state
        ? selectedItem.tire_state
        : {
            tire_maker: "",
            tire_size: "",
            tire_pattern: "",
            manufacture_year: 0,
            air_pressure: 0,
            other_inspection: "",

            inspection_date: new Date(),
            oil_inspection: {
              type: "oil",
              state: "",
              is_exchange: false,
              note: "",
            },
            battery_inspection: {
              type: "battery",
              state: "",
              is_exchange: false,
              note: "",
            },
            wiper_inspection: {
              type: "wiper",
              state: "",
              is_exchange: false,
              note: "",
            },

            tire_inspection: {
              type: "tire",
              state: "",
              is_exchange: false,
              note: "",
            },
            drive_distance: 0,
            next_theme: "",
          };

      // tire_stateがある場合、詳細データを取得
      if (selectedItem.tire_state) {
        const inspectionData = await getInspectionData(selectedItem.tire_state);
        initialData = {
          ...initialData,
          ...inspectionData,
        };
      } else {
        initialData = {
          tire_maker: "",
          tire_size: "",
          tire_pattern: "",
          manufacture_year: 0,
          air_pressure: 0,
          other_inspection: "",
          inspection_date: new Date(),
          oil_inspection: {
            type: "oil",
            state: "",
            is_exchange: false,
            note: "",
          },
          battery_inspection: {
            type: "battery",
            state: "",
            is_exchange: false,
            note: "",
          },
          wiper_inspection: {
            type: "wiper",
            state: "",
            is_exchange: false,
            note: "",
          },

          tire_inspection: {
            type: "tire",
            state: "",
            is_exchange: false,
            note: "",
          },
          drive_distance: 0,
          next_theme: "",
        };
      }

      setFormData(initialData);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "初期データの取得に失敗しました";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [selectedItem]);

  // selectedItemが変更されたときに初期化
  useEffect(() => {
    initializeForm();
  }, [sideEffect]);

  // フォームデータの更新
  const updateFormData = useCallback((updates: Partial<TaskInput>) => {
    setFormData((prev) => {
      if (!prev) return null;
      return { ...prev, ...updates };
    });
  }, []); // タイヤ状態データの更新（ネストしたパスに対応）
  const updateTireState = (
    updates: Record<string, string | number | boolean | Date>
  ) => {
    setFormData((prev) => {
      if (!prev) return null;

      const updated = { ...prev } as Record<string, any>;

      Object.entries(updates).forEach(([path, value]) => {
        const pathArray = path.split(".");

        if (pathArray.length === 1) {
          // 単純なパス (例: tire_maker)
          updated[pathArray[0]] = value;
        } else if (pathArray.length === 2) {
          // ネストしたパス (例: tire_inspection.state)
          const [parentKey, childKey] = pathArray;
          const parent = (updated[parentKey] ?? {}) as Record<string, any>;
          parent[childKey] = value;
          updated[parentKey] = parent;
        }
      });

      return updated as State;
    });
  };
  // フォーム送信処理
  const handleSubmit = useCallback(async () => {
    if (!formData) {
      setError("未入力の項目があります");
      return;
    }

    setIsSubmitting(true);
    setError(null);
    try {
      // タイヤデータを更新
      console.log("Submitting form data:", formData);
      if (formData) {
        await upsertTire(formData);
      }

      if (
        selectedItem &&
        selectedItem.id &&
        selectedItem.status === "incomplete"
      ) {
        // ステータスを更新
        const status = "pending";
        await updateTaskStatus(selectedItem.id, status);
      }
      if (selectedItem) {
        selectedItem.tire_state = formData;
      }

      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message + "保存に失敗しました"
          : "保存に失敗しました";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, onSuccess]);

  // フォームのリセット
  const resetForm = useCallback(() => {
    setFormData(selectedItem?.tire_state || null);
    setError(null);
  }, [selectedItem]);

  return {
    formData,
    isLoading,
    isSubmitting,
    error,
    updateFormData,
    updateTireState,
    handleSubmit,
    resetForm,
  };
};
