"use client";

import { useState, useEffect } from "react";
import { Package, User, Car } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { getPendingTasks } from "@/utils/supabaseFunction";
import type { StorageData, TaskOutput } from "@/utils/interface";

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
  const [pendingTasks, setPendingTasks] = useState<TaskOutput[]>([]);
  const [manualData, setManualData] = useState({
    car_id: "",
    client_id: "",
    tire_state_id: "",
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
        setManualData({
          car_id: selectedSlot.car_id?.toString() || "",
          client_id: selectedSlot.client_id?.toString() || "",
          tire_state_id: selectedSlot.tire_state_id?.toString() || "",
        });
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

  const handleTaskAssign = (task: TaskOutput) => {
    if (!selectedSlot) return;

    const updates = {
      car_id: task.car_id,
      client_id: task.client_id,
      tire_state_id: task.tire_state_id,
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

    const updates = {
      car_id: manualData.car_id ? parseInt(manualData.car_id) : null,
      client_id: manualData.client_id ? parseInt(manualData.client_id) : null,
      tire_state_id: manualData.tire_state_id
        ? parseInt(manualData.tire_state_id)
        : null,
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
                            <p>車両ID: {task.car_id}</p>
                            <p>顧客ID: {task.client_id}</p>
                            <p>タイヤ状態ID: {task.tire_state_id}</p>
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
                <div className="space-y-2">
                  <Label htmlFor="car-id">車両ID</Label>
                  <Input
                    id="car-id"
                    type="number"
                    placeholder="車両IDを入力"
                    value={manualData.car_id}
                    onChange={(e) =>
                      setManualData({ ...manualData, car_id: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="client-id">顧客ID</Label>
                  <Input
                    id="client-id"
                    type="number"
                    placeholder="顧客IDを入力"
                    value={manualData.client_id}
                    onChange={(e) =>
                      setManualData({
                        ...manualData,
                        client_id: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tire-state-id">タイヤ状態ID</Label>
                  <Input
                    id="tire-state-id"
                    type="number"
                    placeholder="タイヤ状態IDを入力"
                    value={manualData.tire_state_id}
                    onChange={(e) =>
                      setManualData({
                        ...manualData,
                        tire_state_id: e.target.value,
                      })
                    }
                  />
                </div>
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
