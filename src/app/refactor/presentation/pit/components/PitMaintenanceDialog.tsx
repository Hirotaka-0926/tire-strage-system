"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AlertCircle, Loader2, Settings } from "lucide-react";
import { PitState, PitTaskInput } from "@/app/refactor/domain/type/pit";
import { createPitEditFormApplication } from "@/app/refactor/application/pit/pitEditFormApplication";
import FormActions from "@/app/task/components/FormActions";
import InspectionForm from "@/app/task/components/InspectionForm";
import MemoForm from "@/app/task/components/MemoForm";
import TireBasicInfoForm from "@/app/task/components/TireBasicInfoForm";
import PitCustomerInfoCard from "@/app/refactor/presentation/pit/components/PitCustomerInfoCard";
import { toast } from "sonner";

interface PitMaintenanceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedTask: PitTaskInput | null;
  onSaved: () => void;
}

const PitMaintenanceDialog = ({
  open,
  onOpenChange,
  selectedTask,
  onSaved,
}: PitMaintenanceDialogProps) => {
  const app = useMemo(() => createPitEditFormApplication(), []);
  const [formData, setFormData] = useState<PitState | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loading = isLoading || isSubmitting;

  useEffect(() => {
    if (!open || !selectedTask) {
      setFormData(null);
      setError(null);
      return;
    }

    const initialize = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const state = await app.initializeState(selectedTask);
        setFormData(state);
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "初期データの取得に失敗しました";
        setError(message);
        toast.error(message);
      } finally {
        setIsLoading(false);
      }
    };

    void initialize();
  }, [app, open, selectedTask]);

  const updateField = useCallback(
    (path: string, value: string | boolean | number | Date) => {
      if (!formData) return;

      const pathArray = path.split(".");
      if (pathArray.length > 1) {
        setFormData((prev) => {
          if (!prev) return null;
          const updated = { ...prev } as Record<string, any>;
          const [parentKey, childKey] = pathArray;
          const parent = (updated[parentKey] ?? {}) as Record<string, any>;
          parent[childKey] = value;
          updated[parentKey] = parent;
          return updated as PitState;
        });
        return;
      }
      setFormData((prev) => {
        if (!prev) return null;
        return { ...prev, [path]: value };
      });
    },
    [formData],
  );

  const handleSave = async () => {
    if (!selectedTask?.id) {
      setError("IDが必須です");
      return;
    }
    if (!formData) {
      setError("整備データがありません");
      return;
    }
    if (!formData.assigner?.trim()) {
      setError("整備士名は必須です");
      return;
    }
    if (!formData.next_theme?.trim()) {
      setError("次回テーマは必須です");
      return;
    }

    setIsSubmitting(true);
    setError(null);
    try {
      await app.saveMaintenance(selectedTask, formData);
      onSaved();
    } catch (err) {
      const message =
        err instanceof Error
          ? `${err.message} 保存に失敗しました`
          : "保存に失敗しました";
      setError(message);
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
    setError(null);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="h-[calc(100vh-120px)] w-full max-w-5xl overflow-y-scroll bg-gray-50">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            整備データ入力
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          </DialogTitle>
        </DialogHeader>

        {error && (
          <div className="rounded-md border border-red-200 bg-red-50 p-3">
            <div className="flex items-center gap-2 text-red-700">
              <AlertCircle className="h-4 w-4" />
              <span className="font-medium">エラー</span>
            </div>
            <p className="mt-1 text-sm text-red-600">{error}</p>
          </div>
        )}

        <div className="space-y-4 py-4">
          <PitCustomerInfoCard selectedTask={selectedTask} />

          <form className="space-y-4">
            <TireBasicInfoForm
              formData={formData}
              updateField={updateField}
              loading={loading}
            />
            <InspectionForm
              formData={formData}
              updateField={updateField}
              loading={loading}
            />
            <MemoForm formData={formData} updateField={updateField} loading={loading} />
          </form>

          <FormActions loading={loading} onSave={handleSave} onCancel={handleCancel} />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PitMaintenanceDialog;
