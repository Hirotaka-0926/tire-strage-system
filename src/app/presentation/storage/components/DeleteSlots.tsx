"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
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
import { createStorageSlotManagementApplication } from "@/app/application/storage/storageSlotManagementApplication";
import type { StorageAreaConfig } from "@/app/domain/type/storage";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStorageUpdated?: () => void;
}

const DeleteSlots = ({ open, onOpenChange, onStorageUpdated }: Props) => {
  const app = useMemo(() => createStorageSlotManagementApplication(), []);
  const [areas, setAreas] = useState<StorageAreaConfig[]>([]);
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
      void loadAreas();
    }
  }, [open]);

  const loadAreas = async () => {
    try {
      const areaData = await app.getAreaConfigs();
      setAreas(areaData);
    } catch (error) {
      console.error("エリア情報の取得に失敗しました:", error);
    }
  };

  const handleAreaAdjustment = async () => {
    if (!selectedArea || !targetCount) {
      setAlertMessage({
        type: "error",
        message: "エリア名と目標個数を入力してください",
      });
      return;
    }

    setIsLoading(true);
    setAlertMessage(null);

    try {
      const result = await app.adjustStorageSlots(
        selectedArea,
        parseInt(targetCount, 10),
      );

      if (result.success) {
        setAlertMessage({ type: "success", message: result.message });
        setSelectedArea("");
        setTargetCount("");
        onStorageUpdated?.();

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
      const result = await app.deleteSpecificStorage(storageId);

      if (result.success) {
        setAlertMessage({ type: "success", message: result.message });
        setStorageId("");
        onStorageUpdated?.();

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
        <DialogTitle>保管庫管理</DialogTitle>
      </DialogHeader>
      <DialogContent>
        <Tabs defaultValue="delete-slots" className="w-full">
          <TabsList className="w-full">
            <TabsTrigger className="w-full" value="delete-slots">
              保管庫削除
            </TabsTrigger>
            <TabsTrigger className="w-full" value="delete-area">
              エリア調整
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
                    エリアの保管庫数を調整します。現在の数より少ない数を指定すると、末尾の大きい保管庫から削除されます。
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
                    <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-3">
                      <p className="text-sm text-yellow-800">
                        <strong>プレビュー:</strong> エリア{selectedArea}を
                        {areas.find((a) => a.name === selectedArea)
                          ?.totalSlots || 0}
                        個から{targetCount}個に調整します。
                        {parseInt(targetCount, 10) <
                          (areas.find((a) => a.name === selectedArea)
                            ?.totalSlots || 0) && (
                          <span className="mt-1 block text-red-600">
                            注意:
                            {(areas.find((a) => a.name === selectedArea)
                              ?.totalSlots || 0) - parseInt(targetCount, 10)}
                            個の保管庫が削除されます（末尾の大きい順）。
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
