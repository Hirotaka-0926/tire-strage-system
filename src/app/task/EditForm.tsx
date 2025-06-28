"use client";

import { useEffect, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Settings, Loader2, AlertCircle } from "lucide-react";
import { TaskInput } from "@/utils/interface";
import { useEditForm } from "@/utils/hooks/useEditForm";
import { useRouter } from "next/navigation";
import CustomerInfoCard from "./components/CustomerInfoCard";
import TireBasicInfoForm from "./components/TireBasicInfoForm";
import InspectionForm from "./components/InspectionForm";
import MemoForm from "./components/MemoForm";
import FormActions from "./components/FormActions";

interface Props {
  isMaintenanceDialogOpen: boolean;
  setIsMaintenanceDialogOpen: (open: boolean) => void;
  selectedItem: TaskInput | null;
  setSelectedItem: (item: TaskInput | null) => void;
}

const EditForm = ({
  isMaintenanceDialogOpen,
  setIsMaintenanceDialogOpen,
  selectedItem,
  setSelectedItem,
}: Props) => {
  const {
    formData,
    isLoading,
    isSubmitting,
    error,
    updateFormData,
    updateTireState,
    handleSubmit,
    resetForm,
  } = useEditForm({
    selectedItem,
    onSuccess: () => {
      setIsMaintenanceDialogOpen(false);
      setSelectedItem(null);
      router.refresh(); // 変更後にページをリフレッシュ
    },
  });

  const router = useRouter();

  // ダイアログが開かれた時にデータを初期化
  useEffect(() => {
    if (isMaintenanceDialogOpen && selectedItem) {
      // フックが自動的に初期化するので、特別な処理は不要
    }
  }, [isMaintenanceDialogOpen, selectedItem]);

  // 保存処理
  const handleSave = async () => {
    await handleSubmit();
  };

  // キャンセル処理
  const handleCancel = () => {
    setIsMaintenanceDialogOpen(false);
    setSelectedItem(null);
    resetForm();
  }; // フィールド更新のヘルパー関数
  const updateField = useCallback(
    (path: string, value: string | boolean | number | Date) => {
      const pathArray = path.split(".");

      if (pathArray.length > 1) {
        console.log("tireStatePath:", pathArray.join("."));
        console.log("value:", value);
        updateTireState({ [pathArray.join(".")]: value });
      } else {
        updateFormData({ [path]: value });
      }
    },
    [updateFormData, updateTireState]
  );

  const loading = isLoading || isSubmitting;

  return (
    <Dialog
      open={isMaintenanceDialogOpen}
      onOpenChange={setIsMaintenanceDialogOpen}
    >
      <DialogContent className="max-w-5xl w-full bg-gray-50">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            整備データ入力
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          </DialogTitle>
        </DialogHeader>

        {/* エラー表示 */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-3">
            <div className="flex items-center gap-2 text-red-700">
              <AlertCircle className="h-4 w-4" />
              <span className="font-medium">エラー</span>
            </div>
            <p className="text-red-600 text-sm mt-1">{error}</p>
          </div>
        )}

        <div className="space-y-4 py-4 overflow-y-scroll h-[calc(100vh-200px)]">
          {/* 顧客情報 */}
          <CustomerInfoCard selectedItem={selectedItem} />

          {/* フォーム */}
          <form className="space-y-4">
            {/* タイヤ基礎情報 */}
            <TireBasicInfoForm
              formData={formData}
              updateField={updateField}
              loading={loading}
            />

            {/* 点検・整備項目 */}
            <InspectionForm
              formData={formData}
              updateField={updateField}
              loading={loading}
            />

            {/* メモ */}
            <MemoForm
              formData={formData}
              updateField={updateField}
              loading={loading}
            />
          </form>

          {/* ボタン */}
          <FormActions
            loading={loading}
            onSave={handleSave}
            onCancel={handleCancel}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditForm;
