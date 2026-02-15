"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, Loader2, Save } from "lucide-react";
import { createPitStorageSaveApplication } from "@/app/refactor/application/pit/pitStorageSaveApplication";
import { PitStorage, PitTaskInput } from "@/app/refactor/domain/type/pit";
import { toast } from "sonner";

interface PitSaveTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedTask: PitTaskInput | null;
  onSaved: () => void;
}

const PitSaveTaskDialog = ({
  open,
  onOpenChange,
  selectedTask,
  onSaved,
}: PitSaveTaskDialogProps) => {
  const app = useMemo(() => createPitStorageSaveApplication(), []);
  const [overwriteStorage, setOverwriteStorage] = useState<PitStorage | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!open || !selectedTask) {
      setOverwriteStorage(null);
      return;
    }

    const load = async () => {
      setIsLoading(true);
      try {
        const result = await app.getOverwriteStorage(selectedTask);
        setOverwriteStorage(result);
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : `unknown error: ${JSON.stringify(error)}`;
        console.error("Error loading save preview:", {
          taskId: selectedTask.id,
          storageId: selectedTask.storage_id,
          errorMessage,
          error,
        });
        toast.error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    void load();
  }, [app, open, selectedTask]);

  const handleSave = async () => {
    if (!selectedTask) return;

    setIsSaving(true);
    try {
      await app.saveTask(selectedTask);
      toast.success("ピットデータを保管庫へ保存しました");
      onSaved();
      onOpenChange(false);
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : `unknown error: ${JSON.stringify(error)}`;
      console.error("Error saving pit task:", {
        taskId: selectedTask.id,
        storageId: selectedTask.storage_id,
        errorMessage,
        error,
      });
      toast.error(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  const loading = isLoading || isSaving;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Save className="h-5 w-5" />
            保管庫データへ保存
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="rounded-lg bg-gray-50 p-3">
            <div className="text-sm text-gray-600">保管庫ID</div>
            <div className="font-semibold">{selectedTask?.storage_id || "-"}</div>
          </div>

          {overwriteStorage && (
            <Alert className="border-orange-200 bg-orange-50">
              <AlertTriangle className="h-4 w-4 text-orange-600" />
              <AlertDescription className="text-orange-800">
                <div className="font-medium">既存データが上書きされます</div>
                <div className="mt-1 text-sm">
                  使用者: {overwriteStorage.client?.client_name || "不明"}
                </div>
                <div className="text-sm">
                  車番: {overwriteStorage.car?.car_number || "不明"}
                </div>
              </AlertDescription>
            </Alert>
          )}

          <div className="rounded-lg border p-3 text-sm">
            保存時に次の処理を実行します: `storage_master` 更新、`storage_logs`
            追加、`task_list` から当該タスク削除。
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            キャンセル
          </Button>
          <Button onClick={handleSave} disabled={loading}>
            保存する
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PitSaveTaskDialog;

