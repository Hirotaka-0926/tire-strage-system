"use client";

import { useEffect, useMemo, useState } from "react";
import { History, Package, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { createStorageDetailApplication } from "@/app/refactor/application/storage/storageDetailApplication";
import type { StorageSlot } from "@/app/refactor/domain/type/storage";
import type { State, TaskInput } from "@/utils/interface";
import { HistoryModal } from "./HistoryModal";

interface StorageAssignmentModalProps {
  selectedSlot: StorageSlot | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAssign: (slotId: string, updates: Partial<StorageSlot>) => void;
  setSelectedSlot: (slot: StorageSlot | null) => void;
  onUpdateFromHistory: (slotId: string, historyData: StorageSlot) => void;
  assignFromManual: (slotId: string, manualData: State) => void;
}

export const StorageAssignmentModal = ({
  selectedSlot,
  open,
  onOpenChange,
  onAssign,
  setSelectedSlot,
  onUpdateFromHistory,
  assignFromManual,
}: StorageAssignmentModalProps) => {
  const storageDetailApplication = useMemo(() => createStorageDetailApplication(), []);
  const [pendingTasks, setPendingTasks] = useState<TaskInput[]>([]);
  const [manualData, setManualData] = useState<State | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  useEffect(() => {
    const loadInitialData = async () => {
      if (!open) return;

      await loadPendingTasks();

      if (selectedSlot?.tire_state_id) {
        try {
          const formData = await storageDetailApplication.getStateWithInspectionById(
            selectedSlot.tire_state_id,
          );
          setManualData((prev) => ({ ...prev, ...formData }));
        } catch (error) {
          console.error("フォーム初期値の取得に失敗しました", error);
        }
      }
    };

    void loadInitialData();
  }, [open, selectedSlot, storageDetailApplication]);

  const loadPendingTasks = async () => {
    try {
      setIsLoading(true);
      const tasks = await storageDetailApplication.getPendingTasks();
      setPendingTasks(tasks || []);
    } catch (error) {
      console.error("保留タスクの取得に失敗しました", error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateManualField = (path: string, value: unknown) => {
    const pathArray = path.split(".");

    if (pathArray.length === 1) {
      setManualData((prev) => {
        if (!prev) return prev;
        return { ...prev, [path]: value };
      });
      return;
    }

    if (pathArray.length === 2) {
      const [objKey, propKey] = pathArray;
      setManualData((prev) => {
        if (!prev) return prev;
        const existing = (prev as any)[objKey];
        const base =
          typeof existing === "object" && existing !== null
            ? (existing as Record<string, unknown>)
            : {};
        return {
          ...prev,
          [objKey]: { ...base, [propKey]: value },
        };
      });
    }
  };

  const handleTaskAssign = (task: TaskInput) => {
    if (!selectedSlot) return;

    const updates: Partial<StorageSlot> = {
      car_id: task.car?.id ?? null,
      client_id: task.client?.id ?? null,
      tire_state_id: task.tire_state?.id ?? null,
    };

    if (!updates.car_id || !updates.client_id || !updates.tire_state_id) {
      setAlertMessage({
        type: "error",
        message: "このタスクは情報不足のため割り当てできません",
      });
      setTimeout(() => setAlertMessage(null), 3000);
      return;
    }

    onAssign(selectedSlot.id, updates);
    setAlertMessage({ type: "success", message: "タスクを割り当てました" });

    setTimeout(() => {
      onOpenChange(false);
      setAlertMessage(null);
    }, 1500);
  };

  const handleManualAssign = () => {
    if (!selectedSlot || !manualData) return;

    if (!manualData.id) {
      setAlertMessage({ type: "error", message: "点検データを入力してください" });
      return;
    }

    if (!manualData.assigner || manualData.assigner.trim() === "") {
      setAlertMessage({ type: "error", message: "担当者名を入力してください" });
      return;
    }

    if (!manualData.next_theme || manualData.next_theme.trim() === "") {
      setAlertMessage({ type: "error", message: "次回テーマを入力してください" });
      return;
    }

    assignFromManual(selectedSlot.id, manualData);
    setAlertMessage({ type: "success", message: "手動データを設定しました" });

    setTimeout(() => {
      onOpenChange(false);
      setAlertMessage(null);
    }, 1500);
  };

  const handleClearSlot = async () => {
    if (!selectedSlot) return;

    try {
      await storageDetailApplication.clearStorage(selectedSlot.id);
    } catch (error) {
      setAlertMessage({
        type: "error",
        message: "保管庫のクリアに失敗しました",
      });
      setTimeout(() => setAlertMessage(null), 3000);
      return;
    }

    onAssign(selectedSlot.id, {
      car_id: null,
      client_id: null,
      tire_state_id: null,
    });
    setAlertMessage({ type: "success", message: "保管庫を空にしました" });

    setTimeout(() => {
      onOpenChange(false);
      setAlertMessage(null);
    }, 1500);
  };

  const handleHistoryAssign = async (slotId: string, historyData: StorageSlot) => {
    if (!selectedSlot) return;

    try {
      await onUpdateFromHistory(slotId, historyData);
      setSelectedSlot({ ...selectedSlot, ...historyData });
      setAlertMessage({ type: "success", message: "履歴から割り当てました" });

      setTimeout(() => {
        onOpenChange(false);
        setAlertMessage(null);
      }, 1500);
    } catch (error) {
      setAlertMessage({ type: "error", message: "履歴割り当てに失敗しました" });
      setTimeout(() => setAlertMessage(null), 3000);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] w-full max-w-5xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Package className="mr-2 h-5 w-5" />
            保管庫データ設定 - {selectedSlot?.id}
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="tasks" className="w-full">
          <TabsList className="grid w-full grid-cols-4 text-xs sm:text-sm">
            <TabsTrigger value="tasks" className="px-2 py-2">
              タスク
            </TabsTrigger>
            <TabsTrigger value="manual" className="px-2 py-2">
              手動
            </TabsTrigger>
            <TabsTrigger value="history" className="px-2 py-2">
              履歴
            </TabsTrigger>
            <TabsTrigger value="clear" className="px-2 py-2">
              クリア
            </TabsTrigger>
          </TabsList>

          <TabsContent value="tasks" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">保留中のタスク</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="py-4 text-center">タスクを読み込み中...</div>
                ) : pendingTasks.length === 0 ? (
                  <div className="py-4 text-center text-gray-500">保留タスクはありません</div>
                ) : (
                  <div className="max-h-96 space-y-3 overflow-y-auto">
                    {pendingTasks.map((task) => (
                      <div key={task.id} className="rounded-lg border p-4 hover:bg-gray-50">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 space-y-3">
                            <div className="flex items-center gap-2">
                              <h3 className="text-lg font-medium">タスク #{task.id}</h3>
                              <span className="rounded bg-blue-100 px-2 py-1 text-xs text-blue-800">
                                保留中
                              </span>
                            </div>
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                              <div className="space-y-1 text-sm text-gray-600">
                                <div className="flex items-center gap-2 font-medium text-gray-800">
                                  <User className="h-4 w-4" /> 顧客情報
                                </div>
                                <p>氏名: {task.client?.client_name ?? "-"}</p>
                                <p>住所: {task.client?.address ?? "-"}</p>
                                <p>電話: {task.client?.phone ?? "-"}</p>
                              </div>
                              <div className="space-y-1 text-sm text-gray-600">
                                <div className="flex items-center gap-2 font-medium text-gray-800">
                                  <Package className="h-4 w-4" /> 車両情報
                                </div>
                                <p>車種: {task.car?.car_model ?? "-"}</p>
                                <p>車番: {task.car?.car_number ?? "-"}</p>
                              </div>
                            </div>
                          </div>
                          <Button size="sm" onClick={() => handleTaskAssign(task)}>
                            割り当て
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="manual" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">手動データ入力</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="tire_maker">タイヤメーカー</Label>
                    <Input
                      id="tire_maker"
                      value={manualData?.tire_maker || ""}
                      onChange={(e) => updateManualField("tire_maker", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tire_pattern">タイヤパターン</Label>
                    <Input
                      id="tire_pattern"
                      value={manualData?.tire_pattern || ""}
                      onChange={(e) => updateManualField("tire_pattern", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tire_size">タイヤサイズ</Label>
                    <Input
                      id="tire_size"
                      value={manualData?.tire_size || ""}
                      onChange={(e) => updateManualField("tire_size", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="manufacture_year">製造年</Label>
                    <Input
                      id="manufacture_year"
                      type="number"
                      value={manualData?.manufacture_year ?? 0}
                      onChange={(e) =>
                        updateManualField("manufacture_year", Number(e.target.value) || 0)
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="air_pressure">空気圧</Label>
                    <Input
                      id="air_pressure"
                      type="number"
                      value={manualData?.air_pressure ?? 0}
                      onChange={(e) =>
                        updateManualField("air_pressure", Number(e.target.value) || 0)
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="drive_distance">走行距離</Label>
                    <Input
                      id="drive_distance"
                      type="number"
                      value={manualData?.drive_distance ?? 0}
                      onChange={(e) =>
                        updateManualField("drive_distance", Number(e.target.value) || 0)
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="inspection_date">点検日</Label>
                    <Input
                      id="inspection_date"
                      type="date"
                      value={
                        manualData?.inspection_date
                          ? manualData.inspection_date instanceof Date
                            ? manualData.inspection_date.toISOString().slice(0, 10)
                            : manualData.inspection_date
                          : ""
                      }
                      onChange={(e) => updateManualField("inspection_date", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="next_theme">次回テーマ</Label>
                    <Input
                      id="next_theme"
                      value={manualData?.next_theme || ""}
                      onChange={(e) => updateManualField("next_theme", e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="assigner">担当者</Label>
                  <Input
                    id="assigner"
                    value={manualData?.assigner || ""}
                    onChange={(e) => updateManualField("assigner", e.target.value)}
                  />
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold">点検項目</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-10">
                      <div className="md:col-span-2">タイヤ</div>
                      <div className="md:col-span-2">
                        <Select
                          value={manualData?.tire_inspection?.state || ""}
                          onValueChange={(value) => updateManualField("tire_inspection.state", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="状態" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="5mm">5mm(良好)</SelectItem>
                            <SelectItem value="4mm">4mm</SelectItem>
                            <SelectItem value="3mm">3mm(要交換目安)</SelectItem>
                            <SelectItem value="2mm">2mm(要交換)</SelectItem>
                            <SelectItem value="1mm">1mm(危険)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="md:col-span-1">
                        <input
                          type="checkbox"
                          checked={manualData?.tire_inspection?.is_exchange || false}
                          onChange={(e) =>
                            updateManualField("tire_inspection.is_exchange", e.target.checked)
                          }
                          className="h-4 w-4"
                        />
                      </div>
                      <div className="md:col-span-5">
                        <Input
                          value={manualData?.tire_inspection?.note || ""}
                          onChange={(e) => updateManualField("tire_inspection.note", e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-3 md:grid-cols-10">
                      <div className="md:col-span-2">オイル</div>
                      <div className="md:col-span-2">
                        <Input
                          value={manualData?.oil_inspection?.state || ""}
                          onChange={(e) => updateManualField("oil_inspection.state", e.target.value)}
                        />
                      </div>
                      <div className="md:col-span-1">
                        <input
                          type="checkbox"
                          checked={manualData?.oil_inspection?.is_exchange || false}
                          onChange={(e) =>
                            updateManualField("oil_inspection.is_exchange", e.target.checked)
                          }
                          className="h-4 w-4"
                        />
                      </div>
                      <div className="md:col-span-5">
                        <Input
                          value={manualData?.oil_inspection?.note || ""}
                          onChange={(e) => updateManualField("oil_inspection.note", e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-3 md:grid-cols-10">
                      <div className="md:col-span-2">バッテリー</div>
                      <div className="md:col-span-2">
                        <Input
                          value={manualData?.battery_inspection?.state || ""}
                          onChange={(e) =>
                            updateManualField("battery_inspection.state", e.target.value)
                          }
                        />
                      </div>
                      <div className="md:col-span-1">
                        <input
                          type="checkbox"
                          checked={manualData?.battery_inspection?.is_exchange || false}
                          onChange={(e) =>
                            updateManualField(
                              "battery_inspection.is_exchange",
                              e.target.checked,
                            )
                          }
                          className="h-4 w-4"
                        />
                      </div>
                      <div className="md:col-span-5">
                        <Input
                          value={manualData?.battery_inspection?.note || ""}
                          onChange={(e) =>
                            updateManualField("battery_inspection.note", e.target.value)
                          }
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-3 md:grid-cols-10">
                      <div className="md:col-span-2">ワイパー</div>
                      <div className="md:col-span-2">
                        <Input
                          value={manualData?.wiper_inspection?.state || ""}
                          onChange={(e) => updateManualField("wiper_inspection.state", e.target.value)}
                        />
                      </div>
                      <div className="md:col-span-1">
                        <input
                          type="checkbox"
                          checked={manualData?.wiper_inspection?.is_exchange || false}
                          onChange={(e) =>
                            updateManualField("wiper_inspection.is_exchange", e.target.checked)
                          }
                          className="h-4 w-4"
                        />
                      </div>
                      <div className="md:col-span-5">
                        <Input
                          value={manualData?.wiper_inspection?.note || ""}
                          onChange={(e) => updateManualField("wiper_inspection.note", e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-3 md:grid-cols-10">
                      <div className="md:col-span-2">その他</div>
                      <div className="md:col-span-8">
                        <Input
                          value={manualData?.other_inspection || ""}
                          onChange={(e) => updateManualField("other_inspection", e.target.value)}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Button onClick={handleManualAssign} className="w-full">
                  手動データを設定
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <History className="mr-2 h-5 w-5" />
                  保管履歴
                </CardTitle>
              </CardHeader>
              <CardContent className="max-h-[50vh] overflow-y-auto">
                <HistoryModal
                  selectedSlot={selectedSlot}
                  onAssign={handleHistoryAssign}
                  open={open}
                  onOpenChange={onOpenChange}
                  setAlertMessage={setAlertMessage}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="clear" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">保管庫を空にする</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
                  <p className="text-sm text-yellow-800">
                    <strong>注意:</strong> この操作により、保管庫 {selectedSlot?.id} を空にします。
                  </p>
                </div>
                <Button variant="destructive" onClick={handleClearSlot} className="w-full">
                  保管庫を空にする
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {alertMessage && (
          <div className="mt-4">
            <Alert variant={alertMessage.type === "error" ? "destructive" : "default"}>
              <AlertDescription>{alertMessage.message}</AlertDescription>
            </Alert>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
