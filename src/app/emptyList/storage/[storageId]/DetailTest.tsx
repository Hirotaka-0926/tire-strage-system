"use client";
import { useState, useEffect } from "react";

import { StorageInput, TaskInput, StorageLogInput } from "@/utils/interface";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Car,
  MapPin,
  Package,
  AlertCircle,
  User,
  Phone,
  Loader2,
  Trash2,
  Edit3,
  Package as PackageIcon,
  Phone as PhoneIcon,
  Mail,
  CheckCircle,
  FootprintsIcon as Tire,
  Save,
  Clock,
  Plus,
} from "lucide-react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import EditForm from "./EditForm";

// サンプルデータ - 保管庫
interface Props {
  initialStorageDetail: StorageInput;
  initialPendingTasks: TaskInput[];
  initialLogs: StorageLogInput[];
}

export const Detail: React.FC<Props> = ({
  initialStorageDetail,
  initialPendingTasks,
  initialLogs,
}) => {
  const [currentStorage, setCurrentStorage] = useState<StorageInput | null>(
    initialStorageDetail
  );

  const [savedStorage, setSavedStorage] = useState<StorageInput | null>(
    currentStorage
  );
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [notification, setNotification] = useState<{
    type: "success" | "error" | "info";
    message: string;
  } | null>(null);

  useEffect(() => {
    const hasChanges =
      JSON.stringify(currentStorage) !== JSON.stringify(savedStorage);
    setHasUnsavedChanges(hasChanges);
  }, [currentStorage, savedStorage]);

  const showNotification = (
    type: "success" | "error" | "info",
    message: string
  ) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  const hasInsertData = (data: StorageInput) => {
    if (currentStorage) {
      showNotification(
        "error",
        "既に保管庫にはデータが格納されています。先に取り出してください"
      );
      return;
    }

    const newStorage = data;
    setCurrentStorage(newStorage);
    showNotification(
      "success",
      `${data.client.client_name}のデータを保管庫A1に挿入しました。`
    );
  };

  const handleRemoveData = () => {
    setCurrentStorage(null);
    showNotification("info", "保管庫のデータを取り出しました。");
  };

  const handleSaveToServer = async () => {
    setIsSaving(true);
    setSavedStorage(currentStorage);
    setIsSaving(false);
  };

  const handleEditData = (data: StorageInput) => {
    setCurrentStorage(data);
    showNotification("info", "保管庫データを更新しました。");
    setIsEditDialogOpen(false);
  };

  // const storedTire = null;

  return (
    <div className="min-h-screen bg-gray-50">
      {notification && (
        <div className="fixed top-20 right-4 z-50 w-80">
          <Alert
            className={`${
              notification.type === "success"
                ? "border-green-500 bg-green-50"
                : notification.type === "error"
                ? "border-red-500 bg-red-50"
                : "border-blue-500 bg-blue-50"
            }`}
          >
            {notification.type === "success" ? (
              <CheckCircle className="h-4 w-4 text-green-600" />
            ) : notification.type === "error" ? (
              <AlertCircle className="h-4 w-4 text-red-600" />
            ) : (
              <AlertCircle className="h-4 w-4 text-blue-600" />
            )}
            <AlertDescription
              className={`${
                notification.type === "success"
                  ? "text-green-800"
                  : notification.type === "error"
                  ? "text-red-800"
                  : "text-blue-800"
              }`}
            >
              {notification.message}
            </AlertDescription>
          </Alert>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-6 p-6 max-w-7xl mx-auto">
        <div className="lg:w-1/3">
          <Card className="shadow-lg">
            <CardHeader className="bg-blue-50 border-b">
              <CardTitle className="flex items-center text-lg">
                <MapPin className="w-5 h-5 mr-2 text-blue-600" />
                保管庫内データ
                <Badge variant="outline" className="ml-auto rounded-full">
                  位置: A1
                </Badge>
                {hasUnsavedChanges && (
                  <Badge variant={"destructive"} className="ml-2 rounded-full">
                    変更あり
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {currentStorage ? (
                <div className="space-y-6">
                  {/* Customer Information */}
                  <div className="space-y-4">
                    <div className="flex items-center text-base font-semibold text-gray-700">
                      <User className="w-5 h-5 mr-2 text-blue-600" />
                      顧客情報
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                      <div className="text-xl font-bold text-gray-900">
                        {currentStorage.client.client_name}
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Phone className="w-4 h-4 mr-2" />
                        {currentStorage.client.address}
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Mail className="w-4 h-4 mr-2" />
                        {currentStorage.client.post_number}
                      </div>
                    </div>
                  </div>
                  <Separator />

                  <div className="space-y-4">
                    <div className="flex items-center text-base font-semibold text-gray-700">
                      <Car className="w-5 h-5 mr-2 text-green-600" />
                      車両情報
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">車種:</span>
                        <span className="font-semibold">
                          {currentStorage.car.car_model}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">年式:</span>
                        <span className="font-semibold">
                          {"年式あとで入れる"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">ナンバープレート:</span>
                        <span className="font-semibold">
                          {currentStorage.car.car_number}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Separator />

                  <div className="space-y-4">
                    <div className="flex items-center text-base font-semibold text-gray-700">
                      <Tire className="w-5 h-5 mr-2 text-orange-600" />
                      タイヤ情報
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">ブランド:</span>
                        <span className="font-semibold">
                          {currentStorage.state.tire_maker}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">サイズ:</span>
                        <span className="font-semibold">
                          {currentStorage.state.tire_size}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">製造年:</span>
                        <span className="font-semibold">
                          {"とりあえず2010年"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">タイヤ溝:</span>
                        <span className="font-semibold">{"とりあえず5mm"}</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex gap-3">
                      <Dialog
                        open={isEditDialogOpen}
                        onOpenChange={setIsEditDialogOpen}
                      >
                        <DialogTrigger asChild>
                          <Button
                            className="flex-1"
                            variant="outline"
                            size="lg"
                          >
                            <Edit3 className="w-4 h-4 mr-2" />
                            編集
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>保管庫データ編集</DialogTitle>
                          </DialogHeader>
                          <EditForm
                            currentData={currentStorage}
                            onSave={handleEditData}
                          />
                        </DialogContent>
                      </Dialog>
                      <Button
                        className="flex-1"
                        variant="destructive"
                        size="lg"
                        onClick={handleRemoveData}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        取り出し
                      </Button>
                    </div>
                    <Button
                      onClick={handleSaveToServer}
                      disabled={isSaving || !hasUnsavedChanges}
                      className="w-full bg-green-600 hover:bg-green-700"
                      size="lg"
                    >
                      {isSaving ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          サーバーに保存中...
                        </>
                      ) : hasUnsavedChanges ? (
                        <>
                          <Save className="w-4 h-4 mr-2" />
                          変更をサーバーに保存
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-4 h-4 mr-2" />
                          保存済み
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <Package className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-500 text-lg mb-2">保管庫は空です</p>
                  <p className="text-gray-400 text-sm mb-6">
                    右側のデータから挿入してください
                  </p>
                  <Button
                    onClick={handleSaveToServer}
                    disabled={isSaving || !hasUnsavedChanges}
                    className="bg-green-600 hover:bg-green-700"
                    size="lg"
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        サーバーに保存中...
                      </>
                    ) : hasUnsavedChanges ? (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        空の状態をサーバーに保存
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        保存済み
                      </>
                    )}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        <div className="lg:w-2/3 space-y-6">
          <Card className="shadow-lg">
            <CardHeader className="bg-green-50 border-b">
              <CardTitle className="flex items-center text-lg">
                <Package className="w-5 h-5 mr-2 text-green-600" />
                過去の保管庫データ
                <Badge variant="secondary" className="ml-2 rounded-full">
                  {initialLogs?.length || 0}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <ScrollArea className="h-64">
                <div className="space-y-3">
                  {initialLogs && initialLogs.length > 0 ? (
                    initialLogs.map((log) => (
                      <Card
                        key={log.id}
                        className="border-l-4 border-l-orange-500 hover:shadow-md transition-shadow"
                      >
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <div className="text-lg font-semibold">
                                {log.client.client_name}
                              </div>
                              <div className="text-sm text-gray-600">
                                {log.client.address}
                              </div>
                              <div className="text-sm text-gray-600">
                                {log.client.post_number}
                              </div>
                            </div>
                            <Badge variant={"outline"} className="rounded-full">
                              {log.year}年
                              {log.season === "summer" ? "夏" : "冬"}
                            </Badge>
                          </div>
                          <div className="grid grid-col-2 gap-4">
                            <div>
                              <span className="text-gray-600">
                                タイヤメーカー
                              </span>
                              <span className="font-medium">
                                {log.state.tire_maker}
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-600">
                                タイヤサイズ
                              </span>
                              <span className="font-medium">
                                {log.state.tire_size}
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-600">車両モデル</span>
                              <span className="font-medium">
                                {log.car.car_model}
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-600">
                                ナンバープレート
                              </span>
                              <span className="font-medium">
                                {log.car.car_number}
                              </span>
                            </div>
                          </div>
                          <Button
                            variant={"default"}
                            className="w-full"
                            size="sm"
                            onClick={() => hasInsertData(log)}
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            保管庫A1に挿入
                          </Button>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <div className="text-center text-gray-500 py-10">
                      過去の保管庫データはありません
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader className="bg-orange-50 border-b">
              <CardTitle className="flex items-center text-lg">
                <Clock className="w-5 h-5 mr-2 text-orange-600" />
                未割り当て整備データ
                <Badge variant={"secondary"} className="ml-2 rounded-full">
                  {initialPendingTasks?.length || 0}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <ScrollArea className="h-64">
                <div className="space-y-3">
                  {initialPendingTasks && initialPendingTasks.length > 0 ? (
                    initialPendingTasks.map((task) => (
                      <Card
                        key={task.id}
                        className="border-l-4 border-l-orange-500 hover:shadow-md transition-shadow"
                      >
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <div className="font-semibold text-lg">
                                {task.client.client_name}
                              </div>
                              <div className="text-sm text-gray-600">
                                {task.client.address}
                              </div>
                              <div className="text-sm text-gray-600">
                                {task.client.post_number}
                              </div>
                            </div>
                            <Badge variant={"outline"} className="rounded-full">
                              ここに何時に整備したか記録
                            </Badge>
                          </div>
                          <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                            <div>
                              <span className="text-gray-600 mr-2">
                                タイヤメーカー
                              </span>
                              <span className="font-medium">
                                {task.tire_state.tire_maker}
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-600 mr-2">
                                タイヤサイズ
                              </span>
                              <span className="font-medium">
                                {task.tire_state.tire_size}
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-600 mr-2">
                                車両モデル
                              </span>
                              <span className="font-medium">
                                {task.car.car_model}
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-600 mr-2">
                                ナンバープレート
                              </span>
                              <span className="font-medium">
                                {task.car.car_number}
                              </span>
                            </div>
                          </div>
                          <Button
                            variant="default"
                            className="w-full"
                            size="lg"
                            onClick={() => hasInsertData(task)}
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            保管庫A1に挿入
                          </Button>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <div className="text-center text-gray-500 py-10">
                      過去の保管庫データはありません
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
