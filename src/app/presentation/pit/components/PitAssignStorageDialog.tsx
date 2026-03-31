"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertTriangle,
  History,
  Loader2,
  MapPin,
  Save,
  User,
} from "lucide-react";
import {
  PitStorage,
  PitStorageAssignmentOptions,
  PitTaskInput,
} from "@/app/domain/type/pit";
import { createPitStorageAssignmentApplication } from "@/app/application/pit/pitStorageAssignmentApplication";
import { toast } from "sonner";

interface PitAssignStorageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedTask: PitTaskInput | null;
  onAssigned: (storageId: string) => void;
}

const emptyOptionsState: PitStorageAssignmentOptions = {
  emptyOptions: [],
  occupiedOptions: [],
  customerHistory: [],
};

const PitAssignStorageDialog = ({
  open,
  onOpenChange,
  selectedTask,
  onAssigned,
}: PitAssignStorageDialogProps) => {
  const app = useMemo(() => createPitStorageAssignmentApplication(), []);
  const [options, setOptions] =
    useState<PitStorageAssignmentOptions>(emptyOptionsState);
  const [selectedStorage, setSelectedStorage] = useState<PitStorage | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isAssigning, setIsAssigning] = useState(false);

  const isOccupied = Boolean(
    selectedStorage &&
    options.occupiedOptions.find(
      (storage) => storage.id === selectedStorage.id,
    ),
  );

  useEffect(() => {
    if (!open || !selectedTask?.client?.id) {
      setOptions(emptyOptionsState);
      setSelectedStorage(null);
      return;
    }

    const load = async () => {
      setIsLoading(true);
      try {
        const nextOptions = await app.getAssignmentOptions(
          selectedTask.client!.id!,
        );
        setOptions(nextOptions);
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : `unknown error: ${JSON.stringify(error)}`;
        console.error("Error loading storage assignment options:", {
          customerId: selectedTask.client?.id,
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

  const allOptions = useMemo(
    () => [...options.emptyOptions, ...options.occupiedOptions],
    [options.emptyOptions, options.occupiedOptions],
  );

  const handleSelectStorage = (storageId: string) => {
    const found =
      allOptions.find((storage) => storage.id === storageId) ?? null;
    setSelectedStorage(found);
  };

  const handleAssign = async () => {
    if (!selectedTask || !selectedStorage) return;

    setIsAssigning(true);
    try {
      await app.assignStorage(selectedTask, selectedStorage.id);
      onAssigned(selectedStorage.id);
      toast.success("保管庫を割り当てました");
      onOpenChange(false);
      setSelectedStorage(null);
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : `unknown error: ${JSON.stringify(error)}`;
      console.error("Error assigning storage:", {
        taskId: selectedTask.id,
        storageId: selectedStorage.id,
        errorMessage,
        error,
      });
      toast.error(errorMessage);
    } finally {
      setIsAssigning(false);
    }
  };

  const loading = isLoading || isAssigning;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            保管庫割り当て
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="rounded-lg bg-gray-50 p-3">
            <div className="font-medium">
              {selectedTask?.client?.client_name || "顧客名不明"}
            </div>
            <div className="text-sm text-gray-600">
              {selectedTask?.car?.car_number || "車番未登録"}
            </div>
          </div>

          {options.customerHistory.length > 0 && (
            <div className="rounded-lg border border-blue-200 bg-blue-50 p-3">
              <div className="mb-2 flex items-center gap-2 text-sm font-medium text-blue-800">
                <History className="h-4 w-4" />
                過去の利用保管庫
              </div>
              <div className="space-y-1">
                {options.customerHistory.slice(0, 3).map((log, index) => (
                  <div
                    key={`${log.storage.id}-${index}`}
                    className="text-sm text-blue-700"
                  >
                    {log.storage.id} [{log.year}年 {log.season}]
                  </div>
                ))}
              </div>
            </div>
          )}

          {isOccupied && selectedStorage && (
            <Alert className="border-orange-200 bg-orange-50">
              <AlertTriangle className="h-4 w-4 text-orange-600" />
              <AlertDescription className="text-orange-800">
                <div className="font-medium">この保管庫は現在使用中です</div>
                <div className="mt-1 text-sm">
                  <div>
                    使用者: {selectedStorage.client?.client_name || "不明"}
                  </div>
                  <div>車番: {selectedStorage.car?.car_number || "不明"}</div>
                </div>
                <div className="mt-2 text-sm font-medium">
                  割り当てると上書きされます。
                </div>
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label>保管庫ID</Label>
            <Select
              value={selectedStorage?.id}
              onValueChange={handleSelectStorage}
              disabled={loading}
            >
              <SelectTrigger>
                <SelectValue placeholder="保管庫を選択してください" />
              </SelectTrigger>
              <SelectContent>
                {options.emptyOptions.map((storage) => (
                  <SelectItem key={`empty-${storage.id}`} value={storage.id}>
                    {storage.id}
                  </SelectItem>
                ))}
                {options.occupiedOptions.map((storage) => (
                  <SelectItem key={`occupied-${storage.id}`} value={storage.id}>
                    <span className="inline-flex items-center gap-2">
                      <User className="h-3 w-3 text-orange-500" />
                      {storage.id} (使用中)
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-sm text-gray-500">
              空き: {options.emptyOptions.length} / 使用中:{" "}
              {options.occupiedOptions.length}
            </p>
          </div>

          <div className="flex justify-end gap-2 border-t pt-4">
            <Button
              variant="outline"
              onClick={() => {
                onOpenChange(false);
                setSelectedStorage(null);
              }}
              disabled={loading}
            >
              キャンセル
            </Button>
            <Button
              onClick={handleAssign}
              disabled={!selectedStorage || loading}
              variant={isOccupied ? "destructive" : "default"}
            >
              <Save className="mr-2 h-4 w-4" />
              {isOccupied ? "上書き割り当て" : "割り当て"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PitAssignStorageDialog;
