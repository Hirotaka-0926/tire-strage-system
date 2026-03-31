"use client";

import { useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { PitTaskInput } from "@/app/domain/type/pit";
import { createPitTaskDeleteApplication } from "@/app/application/pit/pitTaskDeleteApplication";
import { toast } from "sonner";

interface PitDeleteTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedTask: PitTaskInput | null;
  onDeleted: () => void;
}

const PitDeleteTaskDialog = ({
  open,
  onOpenChange,
  selectedTask,
  onDeleted,
}: PitDeleteTaskDialogProps) => {
  const app = useMemo(() => createPitTaskDeleteApplication(), []);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!selectedTask) return;

    setIsDeleting(true);
    try {
      await app.deleteTask(selectedTask);
      toast.success("整備タスクを削除しました");
      onDeleted();
      onOpenChange(false);
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : `unknown error: ${JSON.stringify(error)}`;
      console.error("Error deleting pit task:", {
        taskId: selectedTask.id,
        errorMessage,
        error,
      });
      toast.error(errorMessage);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>整備タスクを削除しますか？</DialogTitle>
          <DialogDescription>
            選択中の整備タスクをリストから削除します。
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2 py-2">
          <div className="text-sm text-gray-600">受付No.</div>
          <div className="text-lg font-semibold">
            {selectedTask?.id
              ? `#${selectedTask.id.toString().padStart(3, "0")}`
              : "#未割当"}
          </div>
          <div className="mt-2 grid grid-cols-1 gap-2 text-sm">
            <div>
              <span className="text-gray-600">顧客名: </span>
              <span className="font-medium">
                {selectedTask?.client?.client_name || "-"}
              </span>
            </div>
            <div>
              <span className="text-gray-600">車種: </span>
              <span className="font-medium">
                {selectedTask?.car?.car_model || "-"}
              </span>
            </div>
            <div>
              <span className="text-gray-600">ナンバー: </span>
              <span className="font-medium">
                {selectedTask?.car?.car_number || "-"}
              </span>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isDeleting}
          >
            キャンセル
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            削除
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PitDeleteTaskDialog;
