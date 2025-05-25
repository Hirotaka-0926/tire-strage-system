"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  MapPin,
  User,
  Car,
  FootprintsIcon as Tire,
  Phone,
  Mail,
  Edit3,
  Trash2,
  Package,
  Clock,
  Home,
  Users,
  CalendarDays,
  Archive,
  BarChart3,
  Plus,
  CheckCircle,
  AlertCircle,
  Save,
  Loader2,
  AlertTriangle,
} from "lucide-react";

interface StorageData {
  id: number;
  customer: string;
  address: string;
  phone: string;
  brand: string;
  code: string;
  model: string;
  carNumber: string;
  year: string;
  plateNumber: string;
  tireGroove: string;
  status: string;
}

interface CurrentStorage {
  customer: string;
  phone: string;
  address: string;
  model: string;
  year: string;
  plateNumber: string;
  brand: string;
  size: string;
  manufacturingYear: string;
  tireGroove: string;
}

export default function TireStorageDetail() {
  const [selectedTask, setSelectedTask] = useState<string | null>(null);
  const [currentStorage, setCurrentStorage] = useState<CurrentStorage | null>({
    customer: "顧客274",
    phone: "080-1234-5678",
    address: "東京都○○区55丁目",
    model: "Model-B",
    year: "2023年式",
    plateNumber: "CAR-9362",
    brand: "Goodyear Winter",
    size: "218/60R19",
    manufacturingYear: "2015",
    tireGroove: "5mm",
  });
  const [savedStorage, setSavedStorage] = useState<CurrentStorage | null>(
    currentStorage
  );
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [notification, setNotification] = useState<{
    type: "success" | "info" | "error";
    message: string;
  } | null>(null);

  const navigationItems = [
    { icon: Home, label: "ホーム", active: false },
    { icon: Users, label: "顧客リスト", active: false },
    { icon: CalendarDays, label: "タイヤ交換予約リスト", active: false },
    { icon: Archive, label: "保管庫一覧", active: false },
    { icon: BarChart3, label: "保管庫状況確認", active: true },
  ];

  const pastStorageData: StorageData[] = [
    {
      id: 1,
      customer: "顧客711",
      address: "東京都○○区77丁目",
      phone: "080-1111-7777",
      brand: "Dunlop",
      code: "179/52R16",
      model: "Model-C",
      carNumber: "CAR-4028",
      year: "2022年式",
      plateNumber: "品川500あ1234",
      tireGroove: "6mm",
      status: "保管済み",
    },
    {
      id: 2,
      customer: "顧客892",
      address: "東京都○○区88丁目",
      phone: "080-2222-8888",
      brand: "Bridgestone",
      code: "205/55R16",
      model: "Model-A",
      carNumber: "CAR-5039",
      year: "2021年式",
      plateNumber: "世田谷300さ5678",
      tireGroove: "7mm",
      status: "保管済み",
    },
    {
      id: 3,
      customer: "顧客456",
      address: "東京都○○区45丁目",
      phone: "080-3333-4444",
      brand: "Michelin",
      code: "225/45R17",
      model: "Model-D",
      carNumber: "CAR-6789",
      year: "2023年式",
      plateNumber: "練馬400た9012",
      tireGroove: "8mm",
      status: "保管済み",
    },
  ];

  const unassignedTasks: StorageData[] = [
    {
      id: 1,
      customer: "顧客74",
      address: "東京都○○区42丁目",
      phone: "080-4444-7474",
      brand: "Yokohama",
      model: "Model-B",
      carNumber: "CAR-2559",
      code: "195/65R15",
      year: "2022年式",
      plateNumber: "新宿500な3456",
      tireGroove: "5mm",
      status: "未割当",
    },
    {
      id: 2,
      customer: "顧客805",
      address: "東京都○○区65丁目",
      phone: "080-5555-8080",
      brand: "Michelin",
      model: "Model-D",
      carNumber: "CAR-8822",
      code: "194/56R14",
      year: "2021年式",
      plateNumber: "渋谷300は7890",
      tireGroove: "6mm",
      status: "未割当",
    },
    {
      id: 3,
      customer: "顧客727",
      address: "東京都○○区73丁目",
      phone: "080-6666-7272",
      brand: "Bridgestone",
      model: "Model-B",
      carNumber: "CAR-2559",
      code: "190/62R16",
      year: "2023年式",
      plateNumber: "杉並400み1234",
      tireGroove: "7mm",
      status: "未割当",
    },
    {
      id: 4,
      customer: "顧客333",
      address: "東京都○○区33丁目",
      phone: "080-7777-3333",
      brand: "Continental",
      model: "Model-C",
      carNumber: "CAR-9999",
      code: "215/60R16",
      year: "2022年式",
      plateNumber: "中野500ゆ5678",
      tireGroove: "4mm",
      status: "未割当",
    },
    {
      id: 5,
      customer: "顧客888",
      address: "東京都○○区88丁目",
      phone: "080-8888-8888",
      brand: "Toyo Tires",
      model: "Model-A",
      carNumber: "CAR-7777",
      code: "185/70R14",
      year: "2021年式",
      plateNumber: "板橋300ら9012",
      tireGroove: "8mm",
      status: "未割当",
    },
  ];

  // 未保存の変更を検知
  useEffect(() => {
    const hasChanges =
      JSON.stringify(currentStorage) !== JSON.stringify(savedStorage);
    setHasUnsavedChanges(hasChanges);
  }, [currentStorage, savedStorage]);

  const showNotification = (
    type: "success" | "info" | "error",
    message: string
  ) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleInsertData = (data: StorageData) => {
    if (currentStorage) {
      showNotification(
        "error",
        "保管庫にはすでにデータが格納されています。先に取り出しを行ってください。"
      );
      return;
    }

    const newStorage: CurrentStorage = {
      customer: data.customer,
      phone: data.phone,
      address: data.address,
      model: data.model,
      year: data.year,
      plateNumber: data.plateNumber,
      brand: data.brand,
      size: data.code,
      manufacturingYear: data.year,
      tireGroove: data.tireGroove,
    };

    setCurrentStorage(newStorage);
    showNotification(
      "success",
      `${data.customer}のデータを保管庫A1に挿入しました。`
    );
  };

  const handleRemoveData = () => {
    if (!currentStorage) {
      showNotification("error", "保管庫にデータがありません。");
      return;
    }

    setCurrentStorage(null);
    showNotification("info", "保管庫A1からデータを取り出しました。");
  };

  const handleEditData = (updatedData: CurrentStorage) => {
    setCurrentStorage(updatedData);
    setIsEditDialogOpen(false);
    showNotification("success", "データを更新しました。");
  };

  // サーバーに保存する関数
  const handleSaveToServer = async () => {
    setIsSaving(true);

    try {
      // サーバー通信をシミュレート
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // 保存データを更新
      setSavedStorage(currentStorage);

      showNotification("success", "保管庫A1のデータをサーバーに保存しました。");
    } catch (error) {
      showNotification("error", "保存に失敗しました。再度お試しください。");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Notification */}
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

      {/* Header */}
      <header className="bg-slate-800 text-white p-4 shadow-lg">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">タイヤ保管管理システム</h1>
          <div className="flex items-center gap-4">
            <nav className="hidden md:flex space-x-1">
              {navigationItems.map((item, index) => (
                <Button
                  key={index}
                  variant={item.active ? "secondary" : "ghost"}
                  size="sm"
                  className="text-white hover:bg-slate-700"
                >
                  <item.icon className="w-4 h-4 mr-2" />
                  {item.label}
                </Button>
              ))}
            </nav>

            {/* Save Button in Header */}
            <div className="flex items-center gap-2">
              {hasUnsavedChanges && (
                <div className="flex items-center text-yellow-300 text-sm">
                  <AlertTriangle className="w-4 h-4 mr-1" />
                  未保存
                </div>
              )}
              <Button
                onClick={handleSaveToServer}
                disabled={isSaving || !hasUnsavedChanges}
                variant="secondary"
                size="sm"
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    保存中...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    保存
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-col lg:flex-row gap-6 p-6 max-w-7xl mx-auto">
        {/* Storage Location Details */}
        <div className="lg:w-1/3">
          <Card className="shadow-lg">
            <CardHeader className="bg-blue-50 border-b">
              <CardTitle className="flex items-center text-lg">
                <MapPin className="w-5 h-5 mr-2 text-blue-600" />
                保管庫内データ
                <Badge variant="outline" className="ml-auto">
                  位置: A1
                </Badge>
                {hasUnsavedChanges && (
                  <Badge variant="destructive" className="ml-2">
                    未保存
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
                        {currentStorage.customer}
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Phone className="w-4 h-4 mr-2" />
                        {currentStorage.phone}
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Mail className="w-4 h-4 mr-2" />
                        {currentStorage.address}
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Vehicle Information */}
                  <div className="space-y-4">
                    <div className="flex items-center text-base font-semibold text-gray-700">
                      <Car className="w-5 h-5 mr-2 text-green-600" />
                      車両情報
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">車種:</span>
                        <span className="font-semibold">
                          {currentStorage.model}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">年式:</span>
                        <span className="font-semibold">
                          {currentStorage.year}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">ナンバープレート:</span>
                        <span className="font-semibold">
                          {currentStorage.plateNumber}
                        </span>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Tire Information */}
                  <div className="space-y-4">
                    <div className="flex items-center text-base font-semibold text-gray-700">
                      <Tire className="w-5 h-5 mr-2 text-orange-600" />
                      タイヤ情報
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">ブランド:</span>
                        <span className="font-semibold">
                          {currentStorage.brand}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">サイズ:</span>
                        <span className="font-semibold">
                          {currentStorage.size}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">製造年:</span>
                        <span className="font-semibold">
                          {currentStorage.manufacturingYear}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">タイヤ溝:</span>
                        <span className="font-semibold">
                          {currentStorage.tireGroove}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
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

                    {/* Save Button */}
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

                  {/* Save Button for Empty State */}
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

        {/* Main Content Area */}
        <div className="lg:w-2/3 space-y-6">
          {/* Past Storage Data */}
          <Card className="shadow-lg">
            <CardHeader className="bg-green-50 border-b">
              <CardTitle className="flex items-center text-lg">
                <Package className="w-5 h-5 mr-2 text-green-600" />
                過去の保管庫データ
                <Badge variant="secondary" className="ml-2">
                  ({pastStorageData.length})
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <ScrollArea className="h-64">
                <div className="space-y-3">
                  {pastStorageData.map((item) => (
                    <Card
                      key={item.id}
                      className="border-l-4 border-l-green-500 hover:shadow-md transition-shadow"
                    >
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <div className="font-semibold text-lg">
                              {item.customer}
                            </div>
                            <div className="text-sm text-gray-600">
                              {item.address}
                            </div>
                            <div className="text-sm text-gray-600">
                              {item.phone}
                            </div>
                          </div>
                          <Badge variant="secondary">{item.status}</Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                          <div>
                            <span className="text-gray-600">ブランド: </span>
                            <span className="font-medium">{item.brand}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">サイズ: </span>
                            <span className="font-medium">{item.code}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">モデル: </span>
                            <span className="font-medium">{item.model}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">車番: </span>
                            <span className="font-medium">
                              {item.carNumber}
                            </span>
                          </div>
                        </div>
                        <Button
                          className="w-full"
                          variant="outline"
                          size="sm"
                          onClick={() => handleInsertData(item)}
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          保管庫A1に挿入
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Unassigned Tasks */}
          <Card className="shadow-lg">
            <CardHeader className="bg-orange-50 border-b">
              <CardTitle className="flex items-center text-lg">
                <Clock className="w-5 h-5 mr-2 text-orange-600" />
                未割当タスク
                <Badge variant="secondary" className="ml-2">
                  ({unassignedTasks.length})
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <ScrollArea className="h-96">
                <div className="space-y-3">
                  {unassignedTasks.map((task) => (
                    <Card
                      key={task.id}
                      className="border-l-4 border-l-orange-500 hover:shadow-md transition-shadow"
                    >
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <div className="font-semibold text-lg">
                              {task.customer}
                            </div>
                            <div className="text-sm text-gray-600">
                              {task.address}
                            </div>
                            <div className="text-sm text-gray-600">
                              {task.phone}
                            </div>
                          </div>
                          <Badge variant="outline">{task.status}</Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                          <div>
                            <span className="text-gray-600">ブランド: </span>
                            <span className="font-medium">{task.brand}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">サイズ: </span>
                            <span className="font-medium">{task.code}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">モデル: </span>
                            <span className="font-medium">{task.model}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">車番: </span>
                            <span className="font-medium">
                              {task.carNumber}
                            </span>
                          </div>
                        </div>
                        <Button
                          className="w-full"
                          variant="default"
                          size="sm"
                          onClick={() => handleInsertData(task)}
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          保管庫A1に挿入
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function EditForm({
  currentData,
  onSave,
}: {
  currentData: CurrentStorage;
  onSave: (data: CurrentStorage) => void;
}) {
  const [formData, setFormData] = useState<CurrentStorage>(currentData);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="customer">顧客名</Label>
          <Input
            id="customer"
            value={formData.customer}
            onChange={(e) =>
              setFormData({ ...formData, customer: e.target.value })
            }
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">電話番号</Label>
          <Input
            id="phone"
            value={formData.phone}
            onChange={(e) =>
              setFormData({ ...formData, phone: e.target.value })
            }
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">住所</Label>
        <Textarea
          id="address"
          value={formData.address}
          onChange={(e) =>
            setFormData({ ...formData, address: e.target.value })
          }
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="model">車種</Label>
          <Input
            id="model"
            value={formData.model}
            onChange={(e) =>
              setFormData({ ...formData, model: e.target.value })
            }
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="year">年式</Label>
          <Input
            id="year"
            value={formData.year}
            onChange={(e) => setFormData({ ...formData, year: e.target.value })}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="plateNumber">ナンバープレート</Label>
        <Input
          id="plateNumber"
          value={formData.plateNumber}
          onChange={(e) =>
            setFormData({ ...formData, plateNumber: e.target.value })
          }
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="brand">タイヤブランド</Label>
          <Input
            id="brand"
            value={formData.brand}
            onChange={(e) =>
              setFormData({ ...formData, brand: e.target.value })
            }
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="size">タイヤサイズ</Label>
          <Input
            id="size"
            value={formData.size}
            onChange={(e) => setFormData({ ...formData, size: e.target.value })}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="manufacturingYear">製造年</Label>
          <Input
            id="manufacturingYear"
            value={formData.manufacturingYear}
            onChange={(e) =>
              setFormData({ ...formData, manufacturingYear: e.target.value })
            }
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="tireGroove">タイヤ溝</Label>
          <Input
            id="tireGroove"
            value={formData.tireGroove}
            onChange={(e) =>
              setFormData({ ...formData, tireGroove: e.target.value })
            }
          />
        </div>
      </div>

      <div className="flex gap-3 pt-4">
        <Button type="submit" className="flex-1">
          保存
        </Button>
      </div>
    </form>
  );
}
