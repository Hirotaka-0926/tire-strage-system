"use client";

import { StorageInput, TaskInput, StorageLogInput } from "@/utils/interface";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Car,
  MapPin,
  Package,
  User,
  Phone,
  Loader2,
  Trash2,
  Edit3,
  Mail,
  CheckCircle,
  FootprintsIcon as Tire,
  Save,
  Clock,
  Plus,
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import EditForm from "./EditForm";

import { useParams } from "next/navigation";
import { useStorageManagement } from "@/utils/hooks/useStorageManagement";

const PLACEHOLDER_VALUES = {
  UNKNOWN: "不明",
  EMPTY_STORAGE_MESSAGE: "右側のデータから挿入してください",
  INCOMPLETE_DATA:
    "データが不完全な保管庫ログがあります。詳細を確認してください。",
  NO_PAST_DATA: "過去の保管庫データはありません",
  NO_PENDING_TASKS: "過去の保管庫データはありません",
} as const;

// カスタムフック: ストレージ管理ロジック

// サンプルデータ - 保管庫
interface DetailProps {
  initialStorageDetail: StorageInput | null;
  initialPendingTasks: TaskInput[] | null;
  initialLogs: StorageLogInput[] | null;
}

export const Detail = ({
  initialStorageDetail,
  initialPendingTasks,
  initialLogs,
}: DetailProps) => {
  const params = useParams();
  const storageId = params.storageId as string;

  const {
    currentStorage,
    isEditDialogOpen,
    setIsEditDialogOpen,
    isSaving,
    hasUnsavedChanges,
    handleRemoveData,
    handleEditData,
    handleSaveToServer,
    hasInsertLog,
    hasInsertTask,
  } = useStorageManagement(initialStorageDetail, storageId);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex flex-col lg:flex-row gap-6 p-6 max-w-7xl mx-auto">
        <div className="lg:w-1/3">
          <Card className="shadow-lg">
            <CardHeader className="bg-blue-50 border-b">
              <CardTitle className="flex items-center text-lg">
                <MapPin className="w-5 h-5 mr-2 text-blue-600" />
                保管庫内データ
                <Badge variant="outline" className="ml-auto rounded-full">
                  位置: {storageId}
                </Badge>
                {hasUnsavedChanges && (
                  <Badge variant={"destructive"} className="ml-2 rounded-full">
                    変更あり
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {/* 担当者情報を上部に表示 */}
              {currentStorage?.state && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <p className="text-sm font-semibold text-blue-800">担当者</p>
                  </div>
                  <p className="text-lg font-bold text-blue-900 mt-1">
                    {currentStorage.state?.assigner || "担当者無し"}
                  </p>
                </div>
              )}
              {currentStorage?.client ||
              currentStorage?.car ||
              currentStorage?.state ? (
                <div className="space-y-6">
                  {/* Customer Information */}
                  <div className="space-y-4">
                    <div className="flex items-center text-base font-semibold text-gray-700">
                      <User className="w-5 h-5 mr-2 text-blue-600" />
                      顧客情報
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                      <div className="text-xl font-bold text-gray-900">
                        {currentStorage.client?.client_name ||
                          PLACEHOLDER_VALUES.UNKNOWN}
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Phone className="w-4 h-4 mr-2" />
                        {currentStorage.client?.address ||
                          PLACEHOLDER_VALUES.UNKNOWN}
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Mail className="w-4 h-4 mr-2" />
                        {currentStorage.client?.post_number ||
                          PLACEHOLDER_VALUES.UNKNOWN}
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
                          {currentStorage.car?.car_model ||
                            PLACEHOLDER_VALUES.UNKNOWN}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">年式:</span>
                        <span className="font-semibold">
                          {currentStorage.car?.model_year ||
                            PLACEHOLDER_VALUES.UNKNOWN}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">ナンバープレート:</span>
                        <span className="font-semibold">
                          {currentStorage.car?.car_number ||
                            PLACEHOLDER_VALUES.UNKNOWN}
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
                          {currentStorage.state?.tire_maker ||
                            PLACEHOLDER_VALUES.UNKNOWN}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">サイズ:</span>
                        <span className="font-semibold">
                          {currentStorage.state?.tire_size ||
                            PLACEHOLDER_VALUES.UNKNOWN}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">製造年:</span>
                        <span className="font-semibold">
                          {currentStorage.state?.manufacture_year ||
                            PLACEHOLDER_VALUES.UNKNOWN}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">タイヤ溝:</span>
                        <span className="font-semibold">
                          {currentStorage.state?.tire_inspection?.state ||
                            PLACEHOLDER_VALUES.UNKNOWN}
                        </span>
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
                    {PLACEHOLDER_VALUES.EMPTY_STORAGE_MESSAGE}
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
                    initialLogs.map((log) => {
                      return (
                        <Card
                          key={log.id}
                          className="border-l-4 border-l-orange-500 hover:shadow-md transition-shadow"
                        >
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start mb-3">
                              <div>
                                <div className="text-lg font-semibold">
                                  {log.client?.client_name ||
                                    PLACEHOLDER_VALUES.UNKNOWN}
                                </div>
                                <div className="text-sm text-gray-600">
                                  {log.client.address ||
                                    PLACEHOLDER_VALUES.UNKNOWN}
                                </div>
                                <div className="text-sm text-gray-600">
                                  {log.client?.post_number ||
                                    PLACEHOLDER_VALUES.UNKNOWN}
                                </div>
                              </div>
                              <Badge
                                variant={"outline"}
                                className="rounded-full"
                              >
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
                                  {log.state?.tire_maker ||
                                    PLACEHOLDER_VALUES.UNKNOWN}
                                </span>
                              </div>
                              <div>
                                <span className="text-gray-600">
                                  タイヤサイズ
                                </span>
                                <span className="font-medium">
                                  {log.state?.tire_size ||
                                    PLACEHOLDER_VALUES.UNKNOWN}
                                </span>
                              </div>
                              <div>
                                <span className="text-gray-600">
                                  車両モデル
                                </span>
                                <span className="font-medium">
                                  {log.car?.car_model ||
                                    PLACEHOLDER_VALUES.UNKNOWN}
                                </span>
                              </div>
                              <div>
                                <span className="text-gray-600">
                                  ナンバープレート
                                </span>
                                <span className="font-medium">
                                  {log.car?.car_number ||
                                    PLACEHOLDER_VALUES.UNKNOWN}
                                </span>
                              </div>
                            </div>
                            <Button
                              variant={"default"}
                              className="w-full"
                              size="sm"
                              onClick={() => hasInsertLog(log)}
                            >
                              <Plus className="w-4 h-4 mr-2" />
                              保管庫{storageId}に挿入
                            </Button>
                          </CardContent>
                        </Card>
                      );
                    })
                  ) : (
                    <div className="text-center text-gray-500 py-10">
                      {PLACEHOLDER_VALUES.NO_PAST_DATA}
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
                                {task.client?.client_name || "不明な顧客"}
                              </div>
                              <div className="text-sm text-gray-600">
                                {task.client?.address || "不明な住所"}
                              </div>
                              <div className="text-sm text-gray-600">
                                {task.client?.post_number || "不明な郵便番号"}
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
                                {task.tire_state?.tire_maker ||
                                  "不明なタイヤメーカー"}
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-600 mr-2">
                                タイヤサイズ
                              </span>
                              <span className="font-medium">
                                {task.tire_state?.tire_size ||
                                  "不明なタイヤサイズ"}
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
                            onClick={() => hasInsertTask(task)}
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            保管庫{storageId}に挿入
                          </Button>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <div className="text-center text-gray-500 py-10">
                      {PLACEHOLDER_VALUES.NO_PENDING_TASKS}
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
