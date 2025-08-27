"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  adjustStorageSlots,
  deleteSpecificStorage,
  getAreaConfig,
} from "@/utils/supabaseFunction";
import type { AreaConfig } from "@/utils/storage";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStorageUpdated?: () => void;
}
const DeleteSlots = ({ open, onOpenChange, onStorageUpdated }: Props) => {
  const [areas, setAreas] = useState<AreaConfig[]>([]);
  const [selectedArea, setSelectedArea] = useState("");
  const [targetCount, setTargetCount] = useState("");
  const [storageId, setStorageId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const [alertMessage, setAlertMessage] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  useEffect(() => {
    if (open) {
      loadAreas();
    }
  }, [open]);

  const loadAreas = async () => {
    try {
      const areaData = await getAreaConfig();
      setAreas(areaData);
    } catch (error) {
      console.error("エリア情報の取得に失敗しました:", error);
    }
  };

  const handleAreaAdjustment = async () => {
    if (!selectedArea || !targetCount) {
      setAlertMessage({
        type: "error",
        message: "エリア名と目標数を入力してください",
      });
      return;
    }

    setIsLoading(true);
    setAlertMessage(null);

    try {
      const result = await adjustStorageSlots(
        selectedArea,
        parseInt(targetCount)
      );

      if (result.success) {
        setAlertMessage({ type: "success", message: result.message });
        setSelectedArea("");
        setTargetCount("");
        onStorageUpdated?.();

        // 成功時は少し遅延してからダイアログを閉じる
        setTimeout(() => {
          onOpenChange(false);
        }, 2000);
      } else {
        setAlertMessage({ type: "error", message: result.message });
      }
    } catch (error) {
      setAlertMessage({
        type: "error",
        message: "予期しないエラーが発生しました",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSpecificStorageDeletion = async () => {
    if (!storageId) {
      setAlertMessage({ type: "error", message: "保管庫IDを入力してください" });
      return;
    }

    setIsLoading(true);
    setAlertMessage(null);

    try {
      const result = await deleteSpecificStorage(storageId);

      if (result.success) {
        setAlertMessage({ type: "success", message: result.message });
        setStorageId("");
        onStorageUpdated?.();

        // 成功時は少し遅延してからダイアログを閉じる
        setTimeout(() => {
          onOpenChange(false);
        }, 2000);
        router.refresh();
      } else {
        setAlertMessage({ type: "error", message: result.message });
      }
    } catch (error) {
      setAlertMessage({
        type: "error",
        message: "予期しないエラーが発生しました",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangeDialogStatus = () => {
    onOpenChange(!open);
    setAlertMessage(null);
    setSelectedArea("");
    setTargetCount("");
    setStorageId("");
  };
  return (
    <Dialog open={open} onOpenChange={() => handleChangeDialogStatus()}>
      <DialogHeader>
        <DialogTitle>保管庫削除</DialogTitle>
      </DialogHeader>
      <DialogContent>
        <Tabs defaultValue="delete-slots" className="w-full">
          <TabsList className="w-full">
            <TabsTrigger className="w-full" value="delete-slots">
              保管庫調整
            </TabsTrigger>
            <TabsTrigger className="w-full" value="delete-area">
              エリア削除
            </TabsTrigger>
          </TabsList>
          <TabsContent value="delete-slots">
            <Card>
              <CardHeader>
                <CardTitle>保管庫削除</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm text-gray-600">
                    特定の保管庫を削除します。使用中の保管庫は削除できません。
                  </p>
                  <div className="space-y-2">
                    <Label htmlFor="storage-id">保管庫ID</Label>
                    <Input
                      id="storage-id"
                      placeholder="例: A_001"
                      value={storageId}
                      onChange={(e) => setStorageId(e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                  <Button
                    variant="destructive"
                    onClick={handleSpecificStorageDeletion}
                    disabled={isLoading || !storageId}
                    className="w-full"
                  >
                    {isLoading ? "削除中..." : "削除"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="delete-area">
            <Card>
              <CardHeader>
                <CardTitle>エリア調整</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm text-gray-600">
                    エリアの保管庫数を調整します。現在の数より少ない数を指定すると、番号の大きい保管庫から削除されます。
                  </p>
                  <div className="space-y-2">
                    <Label htmlFor="area-select">エリア選択</Label>
                    <Select
                      value={selectedArea}
                      onValueChange={setSelectedArea}
                      disabled={isLoading}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="エリアを選択" />
                      </SelectTrigger>
                      <SelectContent>
                        {areas.map((area) => (
                          <SelectItem key={area.name} value={area.name}>
                            エリア{area.name} (現在: {area.totalSlots}個)
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="target-count">目標保管庫数</Label>
                    <Input
                      id="target-count"
                      type="number"
                      placeholder="例: 50"
                      value={targetCount}
                      onChange={(e) => setTargetCount(e.target.value)}
                      min="0"
                      disabled={isLoading}
                    />
                  </div>
                  {selectedArea && targetCount && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                      <p className="text-sm text-yellow-800">
                        <strong>プレビュー:</strong> エリア{selectedArea}を
                        {areas.find((a) => a.name === selectedArea)
                          ?.totalSlots || 0}
                        個から{targetCount}個に調整します
                        {parseInt(targetCount) <
                          (areas.find((a) => a.name === selectedArea)
                            ?.totalSlots || 0) && (
                          <span className="block mt-1 text-red-600">
                            ⚠️{" "}
                            {(areas.find((a) => a.name === selectedArea)
                              ?.totalSlots || 0) - parseInt(targetCount)}
                            個の保管庫が削除されます（番号の大きい順）
                          </span>
                        )}
                      </p>
                    </div>
                  )}
                  <Button
                    variant="destructive"
                    onClick={handleAreaAdjustment}
                    disabled={isLoading || !selectedArea || !targetCount}
                    className="w-full"
                  >
                    {isLoading ? "調整中..." : "保管庫数を調整"}
                  </Button>
                </div>
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

export default DeleteSlots;
