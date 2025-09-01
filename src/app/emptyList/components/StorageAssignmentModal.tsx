"use client";

import { useState, useEffect } from "react";
import { Package, User } from "lucide-react";
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
import {
  getPendingTasks,
  getAllClients,
  getInspectionData,
  getCarByID,
  getClientByID,
  getStateByID,
} from "@/utils/supabaseFunction";
import type {
  StorageData,
  TaskInput,
  Client,
  Car,
  State,
} from "@/utils/interface";

interface StorageAssignmentModalProps {
  selectedSlot: StorageData | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAssign: (slotId: string, updates: Partial<StorageData>) => void;
}

export const StorageAssignmentModal = ({
  selectedSlot,
  open,
  onOpenChange,
  onAssign,
}: StorageAssignmentModalProps) => {
  const [pendingTasks, setPendingTasks] = useState<TaskInput[]>([]);

  const [manualData, setManualData] = useState({
    car_id: "",
    client_id: "",
    tire_state_id: "",

    // State interface fields
    tire_maker: "",
    tire_pattern: "",
    tire_size: "",
    manufacture_year: "",
    air_pressure: "",
    inspection_date: "",
    drive_distance: "",
    next_theme: "",
    assigner: "",
    tire_inspection: {
      type: "tire",
      state: "",
      is_exchange: false,
      note: "",
    },
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
    other_inspection: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  useEffect(() => {
    if (open) {
      loadPendingTasks();

      // 現在の値でフォームを初期化
      if (selectedSlot) {
        setManualData((prev) => ({
          ...prev,
          car_id: selectedSlot.car_id?.toString() || "none",
          client_id: selectedSlot.client_id?.toString() || "none",
          tire_state_id: selectedSlot.tire_state_id?.toString() || "none",
        }));
      }
    }
  }, [open, selectedSlot]);

  const loadPendingTasks = async () => {
    try {
      setIsLoading(true);
      const tasks = await getPendingTasks();
      setPendingTasks(tasks || []);
    } catch (error) {
      console.error("保留タスクの取得に失敗:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // フィールド更新のヘルパー関数
  const updateManualField = (path: string, value: any) => {
    const pathArray = path.split(".");

    if (pathArray.length === 1) {
      setManualData((prev) => ({ ...prev, [path]: value }));
    } else if (pathArray.length === 2) {
      const [objKey, propKey] = pathArray;
      setManualData((prev) => {
        // prev[objKey] may be a string or an object; cast to any for safe merge
        const existing = (prev as any)[objKey] ?? {};
        const merged =
          typeof existing === "object" && existing !== null
            ? { ...existing, [propKey]: value }
            : { [propKey]: value };
        return { ...prev, [objKey]: merged };
      });
    }
  };

  const handleTaskAssign = (task: TaskInput) => {
    if (!selectedSlot) return;

    const updates = {
      car_id: task.car?.id ?? null,
      client_id: task.client?.id ?? null,
      tire_state_id: task.tire_state?.id ?? null,
    };

    onAssign(selectedSlot.id, updates);
    setAlertMessage({
      type: "success",
      message: "タスクが正常に割り当てられました",
    });

    setTimeout(() => {
      onOpenChange(false);
      setAlertMessage(null);
    }, 1500);
  };

  const handleManualAssign = () => {
    if (!selectedSlot) return;

    // Create State object with all the manual form data
    const stateData: Partial<State> = {
      tire_maker: manualData.tire_maker || "",
      tire_pattern: manualData.tire_pattern || "",
      tire_size: manualData.tire_size || "",
      manufacture_year: manualData.manufacture_year
        ? parseInt(manualData.manufacture_year)
        : 0,
      air_pressure: manualData.air_pressure
        ? parseFloat(manualData.air_pressure)
        : 0,
      inspection_date: manualData.inspection_date
        ? new Date(manualData.inspection_date)
        : undefined,
      drive_distance: manualData.drive_distance
        ? parseInt(manualData.drive_distance)
        : 0,
      next_theme: manualData.next_theme || "",
      assigner: manualData.assigner || "",
      tire_inspection: manualData.tire_inspection,
      oil_inspection: manualData.oil_inspection,
      battery_inspection: manualData.battery_inspection,
      wiper_inspection: manualData.wiper_inspection,
      other_inspection: manualData.other_inspection || "",
    };

    const updates = {
      car_id:
        manualData.car_id && manualData.car_id !== "none"
          ? parseInt(manualData.car_id)
          : null,
      client_id:
        manualData.client_id && manualData.client_id !== "none"
          ? parseInt(manualData.client_id)
          : null,
      tire_state_id:
        manualData.tire_state_id && manualData.tire_state_id !== "none"
          ? parseInt(manualData.tire_state_id)
          : null,
      // Note: The State data would need to be saved to the database separately
      // as it's not part of the StorageData interface
      stateData,
    };

    onAssign(selectedSlot.id, updates);
    setAlertMessage({
      type: "success",
      message: "データが正常に設定されました",
    });

    setTimeout(() => {
      onOpenChange(false);
      setAlertMessage(null);
    }, 1500);
  };

  const handleClearSlot = () => {
    if (!selectedSlot) return;

    const updates = {
      car_id: null,
      client_id: null,
      tire_state_id: null,
    };

    onAssign(selectedSlot.id, updates);
    setAlertMessage({ type: "success", message: "保管庫が空に設定されました" });

    setTimeout(() => {
      onOpenChange(false);
      setAlertMessage(null);
    }, 1500);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto w-[95vw] sm:w-[90vw]">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Package className="w-5 h-5 mr-2" />
            保管庫データ設定 - {selectedSlot?.id}
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="tasks" className="w-full">
          <TabsList className="grid w-full grid-cols-3 text-xs sm:text-sm">
            <TabsTrigger value="tasks" className="px-2 py-2">
              タスク
            </TabsTrigger>
            <TabsTrigger value="manual" className="px-2 py-2">
              手動
            </TabsTrigger>
            <TabsTrigger value="clear" className="px-2 py-2">
              空にする
            </TabsTrigger>
          </TabsList>

          <TabsContent value="tasks" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">保留中のタスク</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="text-center py-4">
                    <p>タスクを読み込み中...</p>
                  </div>
                ) : pendingTasks.length === 0 ? (
                  <div className="text-center py-4 text-gray-500">
                    <p>保留中のタスクはありません</p>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {pendingTasks.map((task) => (
                      <div
                        key={task.id}
                        className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                      >
                        <div className="space-y-1">
                          <p className="font-medium">タスク #{task.id}</p>
                          <div className="text-sm text-gray-600 space-y-1">
                            <p>車両ID: {task.car?.id ?? "-"}</p>
                            <p>顧客ID: {task.client?.id ?? "-"}</p>
                            <p>タイヤ状態ID: {task.tire_state?.id ?? "-"}</p>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => handleTaskAssign(task)}
                        >
                          割り当て
                        </Button>
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
                {/* 基本情報 */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="car-id">車両</Label>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="client-id">顧客</Label>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tire-state-id">タイヤ状態</Label>
                  </div>
                </div>

                {/* タイヤ基本情報 */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold">
                      タイヤ基本情報
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="tire_maker">タイヤメーカー</Label>
                        <Input
                          id="tire_maker"
                          type="text"
                          placeholder="メーカー名を入力"
                          value={manualData.tire_maker}
                          onChange={(e) =>
                            updateManualField("tire_maker", e.target.value)
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="tire_pattern">タイヤパターン</Label>
                        <Input
                          id="tire_pattern"
                          type="text"
                          placeholder="パターン名を入力"
                          value={manualData.tire_pattern}
                          onChange={(e) =>
                            updateManualField("tire_pattern", e.target.value)
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="tire_size">タイヤサイズ</Label>
                        <Input
                          id="tire_size"
                          type="text"
                          placeholder="サイズを入力"
                          value={manualData.tire_size}
                          onChange={(e) =>
                            updateManualField("tire_size", e.target.value)
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="manufacture_year">製造年</Label>
                        <Input
                          id="manufacture_year"
                          type="number"
                          placeholder="製造年を入力"
                          value={manualData.manufacture_year}
                          onChange={(e) =>
                            updateManualField(
                              "manufacture_year",
                              e.target.value
                            )
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="air_pressure">空気圧</Label>
                        <Input
                          id="air_pressure"
                          type="number"
                          step="0.1"
                          placeholder="空気圧を入力"
                          value={manualData.air_pressure}
                          onChange={(e) =>
                            updateManualField("air_pressure", e.target.value)
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="drive_distance">走行距離</Label>
                        <Input
                          id="drive_distance"
                          type="number"
                          placeholder="走行距離(km)を入力"
                          value={manualData.drive_distance}
                          onChange={(e) =>
                            updateManualField("drive_distance", e.target.value)
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="inspection_date">点検日</Label>
                        <Input
                          id="inspection_date"
                          type="date"
                          value={manualData.inspection_date}
                          onChange={(e) =>
                            updateManualField("inspection_date", e.target.value)
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="next_theme">次回テーマ</Label>
                        <Input
                          id="next_theme"
                          type="text"
                          placeholder="次回テーマを入力"
                          value={manualData.next_theme}
                          onChange={(e) =>
                            updateManualField("next_theme", e.target.value)
                          }
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* 担当者 */}
                <div className="space-y-2">
                  <Label htmlFor="assigner">担当者</Label>
                  <Input
                    id="assigner"
                    type="text"
                    placeholder="担当者名を入力"
                    value={manualData.assigner}
                    onChange={(e) =>
                      updateManualField("assigner", e.target.value)
                    }
                  />
                </div>

                {/* 点検項目 */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold">
                      点検・整備項目
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="border border-gray-500 rounded-md">
                      {/* ヘッダー */}
                      <div className="grid grid-cols-10 gap-2 border-b border-gray-500 p-2 bg-gray-200 text-sm">
                        <div className="col-span-2">点検項目</div>
                        <div className="col-span-2">状態</div>
                        <div className="col-span-1">交換</div>
                        <div className="col-span-5">備考</div>
                      </div>

                      {/* タイヤ */}
                      <div className="grid grid-cols-10 gap-2 p-2 border-b border-gray-500">
                        <div className="col-span-2">タイヤ</div>
                        <div className="col-span-2">
                          <Select
                            value={manualData.tire_inspection.state || ""}
                            onValueChange={(value) =>
                              updateManualField("tire_inspection.state", value)
                            }
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="状態選択" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="5mm">5mm(良好)</SelectItem>
                              <SelectItem value="4mm">4mm</SelectItem>
                              <SelectItem value="3mm">
                                3mm(交換おすすめ)
                              </SelectItem>
                              <SelectItem value="2mm">2mm(交換時期)</SelectItem>
                              <SelectItem value="1mm">1mm(要交換)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="col-span-1">
                          <input
                            type="checkbox"
                            checked={
                              manualData.tire_inspection.is_exchange || false
                            }
                            onChange={(e) =>
                              updateManualField(
                                "tire_inspection.is_exchange",
                                e.target.checked
                              )
                            }
                            className="w-4 h-4"
                          />
                        </div>
                        <div className="col-span-5">
                          <Input
                            type="text"
                            value={manualData.tire_inspection.note || ""}
                            onChange={(e) =>
                              updateManualField(
                                "tire_inspection.note",
                                e.target.value
                              )
                            }
                          />
                        </div>
                      </div>

                      {/* エンジンオイル */}
                      <div className="grid grid-cols-10 gap-2 p-2 border-b border-gray-500">
                        <div className="col-span-2">エンジンオイル</div>
                        <div className="col-span-2">
                          <Input
                            type="text"
                            value={manualData.oil_inspection.state || ""}
                            onChange={(e) =>
                              updateManualField(
                                "oil_inspection.state",
                                e.target.value
                              )
                            }
                          />
                        </div>
                        <div className="col-span-1">
                          <input
                            type="checkbox"
                            checked={
                              manualData.oil_inspection.is_exchange || false
                            }
                            onChange={(e) =>
                              updateManualField(
                                "oil_inspection.is_exchange",
                                e.target.checked
                              )
                            }
                            className="w-4 h-4"
                          />
                        </div>
                        <div className="col-span-5">
                          <Input
                            type="text"
                            value={manualData.oil_inspection.note || ""}
                            onChange={(e) =>
                              updateManualField(
                                "oil_inspection.note",
                                e.target.value
                              )
                            }
                          />
                        </div>
                      </div>

                      {/* バッテリー */}
                      <div className="grid grid-cols-10 gap-2 p-2 border-b border-gray-500">
                        <div className="col-span-2">バッテリー</div>
                        <div className="col-span-2">
                          <Input
                            type="text"
                            value={manualData.battery_inspection.state || ""}
                            onChange={(e) =>
                              updateManualField(
                                "battery_inspection.state",
                                e.target.value
                              )
                            }
                          />
                        </div>
                        <div className="col-span-1">
                          <input
                            type="checkbox"
                            checked={
                              manualData.battery_inspection.is_exchange || false
                            }
                            onChange={(e) =>
                              updateManualField(
                                "battery_inspection.is_exchange",
                                e.target.checked
                              )
                            }
                            className="w-4 h-4"
                          />
                        </div>
                        <div className="col-span-5">
                          <Input
                            type="text"
                            value={manualData.battery_inspection.note || ""}
                            onChange={(e) =>
                              updateManualField(
                                "battery_inspection.note",
                                e.target.value
                              )
                            }
                          />
                        </div>
                      </div>

                      {/* ワイパーゴム */}
                      <div className="grid grid-cols-10 gap-2 p-2 border-b border-gray-500">
                        <div className="col-span-2">ワイパーゴム</div>
                        <div className="col-span-2">
                          <Input
                            type="text"
                            value={manualData.wiper_inspection.state || ""}
                            onChange={(e) =>
                              updateManualField(
                                "wiper_inspection.state",
                                e.target.value
                              )
                            }
                          />
                        </div>
                        <div className="col-span-1">
                          <input
                            type="checkbox"
                            checked={
                              manualData.wiper_inspection.is_exchange || false
                            }
                            onChange={(e) =>
                              updateManualField(
                                "wiper_inspection.is_exchange",
                                e.target.checked
                              )
                            }
                            className="w-4 h-4"
                          />
                        </div>
                        <div className="col-span-5">
                          <Input
                            type="text"
                            value={manualData.wiper_inspection.note || ""}
                            onChange={(e) =>
                              updateManualField(
                                "wiper_inspection.note",
                                e.target.value
                              )
                            }
                          />
                        </div>
                      </div>

                      {/* その他 */}
                      <div className="grid grid-cols-10 gap-2 p-2">
                        <div className="col-span-2">その他</div>
                        <div className="col-span-8">
                          <Input
                            type="text"
                            value={manualData.other_inspection || ""}
                            onChange={(e) =>
                              updateManualField(
                                "other_inspection",
                                e.target.value
                              )
                            }
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Button onClick={handleManualAssign} className="w-full">
                  データを設定
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="clear" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">保管庫を空にする</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-sm text-yellow-800">
                    <strong>注意:</strong> この操作により、保管庫{" "}
                    {selectedSlot?.id} のすべてのデータがクリアされます。
                  </p>
                </div>
                <Button
                  variant="destructive"
                  onClick={handleClearSlot}
                  className="w-full"
                >
                  保管庫を空にする
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {alertMessage && (
          <div className="mt-4">
            <Alert
              variant={
                alertMessage.type === "error" ? "destructive" : "default"
              }
            >
              <AlertDescription>{alertMessage.message}</AlertDescription>
            </Alert>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
