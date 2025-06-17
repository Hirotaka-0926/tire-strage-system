"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Save, Settings } from "lucide-react";
import { TaskInput } from "@/utils/interface";
import { getInspectionData } from "@/utils/supabaseFunction";

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
  const [maintenanceFormData, setMaintenanceFormData] =
    useState<TaskInput | null>(selectedItem);

  useEffect(() => {
    const fetchInspectionData = async () => {
      if (selectedItem?.tire_state) {
        const data = await getInspectionData(selectedItem.tire_state);

        setMaintenanceFormData({
          ...selectedItem,
          tire_state: data,
        });
      }
    };
  }, [selectedItem]);

  return (
    <Dialog
      open={isMaintenanceDialogOpen}
      onOpenChange={setIsMaintenanceDialogOpen}
    >
      <DialogContent className="max-w-2xl w-full overflow-y-scroll">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            整備データ入力
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* 顧客情報 */}
          <div className="p-3 bg-gray-50 rounded-lg">
            <div className="font-medium">
              {selectedItem?.client?.client_name}
            </div>
            <div className="text-sm text-gray-600">
              {selectedItem?.car?.car_model}
            </div>
            <div className="text-sm text-gray-600">
              {selectedItem?.car?.car_number}
            </div>
          </div>

          {/* フォーム */}
          <form className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>タイヤメーカー</Label>
                <Input
                  className=""
                  value={maintenanceFormData?.tire_state?.tire_maker}
                />
              </div>
              <div>
                <Label>タイヤサイズ</Label>
                <Input
                  className=""
                  value={maintenanceFormData?.tire_state?.tire_size}
                />
              </div>
            </div>
          </form>

          {/* ボタン */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => setIsMaintenanceDialogOpen(false)}
            >
              キャンセル
            </Button>
            <Button>
              <Save className="h-4 w-4 mr-2" />
              保存
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditForm;
