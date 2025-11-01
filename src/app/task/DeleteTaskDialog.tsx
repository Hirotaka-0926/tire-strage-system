"use client";

import { TaskInput } from "@/utils/interface";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import React from "react";
import { deleteTask } from "@/utils/supabaseFunction";
import { toast } from "sonner";

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
  selectedItem: TaskInput | null;
  onDeleted: () => void;
}

const DeleteTaskDialog = ({ open, setOpen, selectedItem, onDeleted }: Props) => {
  if (!selectedItem) return null;

  const close = () => setOpen(false);

  const handleConfirmDelete = async () => {
    try {
      if (!selectedItem?.id) return;
      await deleteTask(selectedItem.id);
      toast.success("予約を削除しました");
      onDeleted();
      setOpen(false);
    } catch (error) {
      console.error("Error deleting task:", error);
      toast.error("予約の削除に失敗しました");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>予約を削除しますか？</DialogTitle>
          <DialogDescription>
            この操作は取り消せません。選択中の予約をリストから削除します。
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2 py-2">
          <div className="text-sm text-gray-600">受付No.</div>
          <div className="font-semibold text-lg">
            {selectedItem.id ? `#${selectedItem.id.toString().padStart(3, "0")}` : "#未割当"}
          </div>
          <div className="grid grid-cols-1 gap-2 text-sm mt-2">
            <div>
              <span className="text-gray-600">顧客名: </span>
              <span className="font-medium">{selectedItem.client?.client_name ?? "-"}</span>
            </div>
            <div>
              <span className="text-gray-600">車種: </span>
              <span className="font-medium">{selectedItem.car?.car_model ?? "-"}</span>
            </div>
            <div>
              <span className="text-gray-600">ナンバー: </span>
              <span className="font-medium">{selectedItem.car?.car_number ?? "-"}</span>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={close}>キャンセル</Button>
          <Button variant="destructive" onClick={handleConfirmDelete}>
            削除
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteTaskDialog;

