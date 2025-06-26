"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Check,
  ChevronsUpDown,
  MapPin,
  AlertTriangle,
  Save,
  History,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  TaskInput,
  Client,
  Car,
  StorageLogInput,
  StorageInput,
} from "@/utils/interface";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";

import useAssignStorage from "@/utils/hooks/useAssignStorage";

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
  selectedItem: TaskInput | null;

  onAssigned?: (storageId: string) => void;
}

const AssignStorageDialog = ({
  open,
  setOpen,
  selectedItem,

  onAssigned,
}: Props) => {
  const [selectedStorage, setSelectedStorage] = useState<StorageInput | null>(
    null
  );
  const [comboboxOpen, setComboboxOpen] = useState(false);
  const {
    embeddedOptions,
    emptyOptions,
    error,
    assignStorage,
    loading,
    customerHistory,
  } = useAssignStorage(open, selectedItem?.client?.id || null);
  const [showOverwriteWarning, setShowOverwriteWarning] = useState(false);

  const handleAssign = async () => {
    if (!selectedStorage || !selectedItem) return;
    await assignStorage(selectedItem, selectedStorage.storage.id);
    onAssigned?.(selectedStorage.storage.id);

    setSelectedStorage(null);
    setOpen(false);
  };

  const handleSelectStorage = (storage: string) => {
    const foundStorage =
      embeddedOptions.find((s) => s.id === storage) ||
      emptyOptions.find((s) => s.id === storage);
    console.log("Selected storage:", foundStorage);
    if (!foundStorage) return;
    setSelectedStorage(foundStorage);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen} modal={true}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            保管庫割当
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* 顧客情報 */}
          <div className="p-3 bg-gray-50 rounded-lg">
            <div className="font-medium">
              {selectedItem?.client?.client_name}
            </div>
            <div className="text-sm text-gray-600">
              {selectedItem?.car?.car_number || "未登録"}
            </div>
          </div>

          {/* 過去の使用履歴表示 */}
          {customerHistory && customerHistory.length > 0 && (
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <History className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-800">
                  過去の使用履歴
                </span>
              </div>
              <div className="space-y-1">
                {customerHistory.slice(0, 3).map((log: StorageInput, index) => (
                  <div key={index} className="text-sm text-blue-700">
                    {log.id}
                    {/* ({new Date(log.usedDate).toLocaleDateString("ja-JP")}) */}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 上書き警告 */}
          {showOverwriteWarning && selectedStorage && (
            <Alert className="border-orange-200 bg-orange-50">
              <AlertTriangle className="h-4 w-4 text-orange-600" />
              <AlertDescription className="text-orange-800">
                <div className="font-medium mb-1">
                  この保管庫は現在使用中です
                </div>
                <div className="text-sm">
                  <div>
                    使用者:{" "}
                    {selectedStorage.client?.client_name || "使用者はいません"}
                  </div>
                  <div>
                    車両:{" "}
                    {selectedStorage.car?.car_number || "車両はありません"}
                  </div>
                  <div>
                    保管日:{" "}
                    {/*new Date(selectedStorage.storageDate).toLocaleDateString(
                      "ja-JP"
                    )*/}
                  </div>
                </div>
                <div className="text-sm mt-2 font-medium">
                  割り当てを続行すると上書きされます。
                </div>
              </AlertDescription>
            </Alert>
          )}

          {/* 保管庫選択 - Combobox */}
          <div>
            <Label>保管庫ID</Label>
            <Input />
            <Select
              value={selectedStorage?.id || ""}
              onValueChange={handleSelectStorage}
            >
              <SelectTrigger asChild>
                <div>
                  <SelectValue placeholder="保管庫を選択..." />
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </div>
              </SelectTrigger>
              <SelectContent>
                {/* セクション区切り用の無効化されたアイテム */}
                {customerHistory && customerHistory.length > 0 && (
                  <>
                    <SelectItem value="history-header" disabled>
                      📝 過去の使用履歴
                    </SelectItem>
                    {customerHistory.map((storage, index) => {
                      if (!storage.id) return null;
                      return (
                        <SelectItem
                          key={`history-${storage.id}-${index}`}
                          value={storage.id}
                          className="pl-4"
                        >
                          {storage.id}
                        </SelectItem>
                      );
                    })}
                  </>
                )}

                <SelectItem value="available-header" disabled>
                  ✅ 利用可能な保管庫
                </SelectItem>
                {emptyOptions
                  .filter(
                    (storage) =>
                      !customerHistory!.map((s) => s.id).includes(storage.id)
                  )
                  .map((storage) => {
                    if (!storage.id) return null;
                    return (
                      <SelectItem
                        key={`empty-${storage.id}`}
                        value={storage.id}
                        className="pl-4"
                      >
                        {storage.id}
                      </SelectItem>
                    );
                  })}

                <SelectItem value="occupied-header" disabled>
                  ⚠️ 使用中の保管庫
                </SelectItem>
                {embeddedOptions
                  .filter(
                    (storage) =>
                      !customerHistory!
                        .map((log) => log.id)
                        .includes(storage.id)
                  )
                  .map((storage) => {
                    if (!storage.id) return null;
                    return (
                      <SelectItem
                        key={`embedded-${storage.id}`}
                        value={storage.id}
                        className="pl-4 text-orange-600"
                      >
                        {storage.id} (使用中)
                      </SelectItem>
                    );
                  })}
              </SelectContent>
            </Select>

            <p className="text-sm text-gray-500 mt-1">
              利用可能: {emptyOptions.length}箇所 / 使用中:{" "}
              {embeddedOptions.length}箇所
              {customerHistory!.length > 0 && (
                <span className="text-blue-600">
                  {" "}
                  (履歴: {customerHistory!.length}箇所)
                </span>
              )}
            </p>
          </div>

          {/* ボタン */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline">キャンセル</Button>
            <Button
              disabled={!selectedStorage}
              variant={showOverwriteWarning ? "destructive" : "default"}
            >
              <Save className="h-4 w-4 mr-2" />
              {showOverwriteWarning ? "上書き割当" : "割当"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AssignStorageDialog;
