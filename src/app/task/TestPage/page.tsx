"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Clock,
  Settings,
  Save,
  MapPin,
  Check,
  ChevronsUpDown,
  History,
  AlertTriangle,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";

// 保管庫データ
const storageAreas = [
  { area: "A", slots: 20 },
  { area: "B", slots: 15 },
  { area: "C", slots: 25 },
  { area: "D", slots: 18 },
];

// 現在使用中の保管庫データ（実際のアプリでは外部データソースから取得）
const currentStorageUsage = [
  {
    storageId: "A-001",
    customerName: "鈴木 一郎",
    carNumber: "練馬 100 さ 9012",
    storageDate: "2024-06-14",
  },
  {
    storageId: "A-003",
    customerName: "伊藤 次郎",
    carNumber: "新宿 300 し 2468",
    storageDate: "2024-06-13",
  },
  {
    storageId: "B-002",
    customerName: "渡辺 三郎",
    carNumber: "港区 500 す 1357",
    storageDate: "2024-06-12",
  },
  {
    storageId: "C-005",
    customerName: "中村 四郎",
    carNumber: "目黒 200 せ 9753",
    storageDate: "2024-06-11",
  },
  {
    storageId: "C-010",
    customerName: "小林 五郎",
    carNumber: "品川 400 そ 8642",
    storageDate: "2024-06-10",
  },
];

// 過去の顧客ログデータ
const customerHistoryLogs = [
  {
    customerName: "田中 太郎",
    carNumber: "品川 500 あ 1234",
    storageId: "A-005",
    usedDate: "2024-05-15",
  },
  {
    customerName: "田中 太郎",
    carNumber: "品川 500 あ 1234",
    storageId: "A-007",
    usedDate: "2024-03-20",
  },
  {
    customerName: "佐藤 花子",
    carNumber: "世田谷 300 か 5678",
    storageId: "B-003",
    usedDate: "2024-04-10",
  },
  {
    customerName: "佐藤 花子",
    carNumber: "世田谷 300 か 5678",
    storageId: "B-005",
    usedDate: "2024-01-25",
  },
  {
    customerName: "鈴木 一郎",
    carNumber: "練馬 100 さ 9012",
    storageId: "C-012",
    usedDate: "2024-02-18",
  },
  {
    customerName: "高橋 健太",
    carNumber: "渋谷 400 な 7890",
    storageId: "D-008",
    usedDate: "2024-04-05",
  },
  {
    customerName: "高橋 健太",
    carNumber: "渋谷 400 な 7890",
    storageId: "D-010",
    usedDate: "2024-01-15",
  },
];

// サンプルデータ
const initialReceptionData = [
  {
    id: 1,
    customerName: "田中 太郎",
    carNumber: "品川 500 あ 1234",
    carModel: "トヨタ プリウス",
    receptionTime: "2024-06-14 09:30",
    status: "整備データ未入力",
    maintenanceData: null,
    storageId: null,
  },
  {
    id: 2,
    customerName: "佐藤 花子",
    carNumber: "世田谷 300 か 5678",
    carModel: "ホンダ フィット",
    receptionTime: "2024-06-14 10:15",
    status: "保管庫ID未入力",
    maintenanceData: {
      oldTireCondition: "摩耗度50%",
      newTireDetails: "ヨコハマ 185/65R15 2024年製",
      workContent: "4本交換、ホイールバランス調整",
      worker: "佐藤整備士",
      completionTime: "2024-06-14 11:30",
      notes: "特に問題なし",
    },
    storageId: null,
  },
  {
    id: 3,
    customerName: "鈴木 一郎",
    carNumber: "練馬 100 さ 9012",
    carModel: "日産 ノート",
    receptionTime: "2024-06-14 11:00",
    status: "作業完了",
    maintenanceData: {
      oldTireCondition: "摩耗度70%",
      newTireDetails: "ブリヂストン 195/65R15 2024年製",
      workContent: "4本交換、ホイールバランス調整",
      worker: "山田整備士",
      completionTime: "2024-06-14 12:30",
      notes: "特に問題なし",
    },
    storageId: "A-001",
  },
  {
    id: 4,
    customerName: "山田 美咲",
    carNumber: "杉並 200 た 3456",
    carModel: "マツダ デミオ",
    receptionTime: "2024-06-14 11:45",
    status: "整備データ未入力",
    maintenanceData: null,
    storageId: null,
  },
  {
    id: 5,
    customerName: "高橋 健太",
    carNumber: "渋谷 400 な 7890",
    carModel: "スバル インプレッサ",
    receptionTime: "2024-06-14 13:20",
    status: "保管庫ID未入力",
    maintenanceData: {
      oldTireCondition: "摩耗度60%",
      newTireDetails: "ダンロップ 205/55R16 2024年製",
      workContent: "4本交換、空気圧調整",
      worker: "田中整備士",
      completionTime: "2024-06-14 14:45",
      notes: "冬タイヤから夏タイヤへ交換",
    },
    storageId: null,
  },
];

interface MaintenanceData {
  oldTireCondition: string;
  newTireDetails: string;
  workContent: string;
  worker: string;
  completionTime: string;
  notes: string;
}

export default function Component() {
  const [receptionData, setReceptionData] = useState(initialReceptionData);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [isMaintenanceDialogOpen, setIsMaintenanceDialogOpen] = useState(false);
  const [isStorageDialogOpen, setIsStorageDialogOpen] = useState(false);
  const [maintenanceFormData, setMaintenanceFormData] =
    useState<MaintenanceData>({
      oldTireCondition: "",
      newTireDetails: "",
      workContent: "",
      worker: "",
      completionTime: "",
      notes: "",
    });
  const [selectedStorageId, setSelectedStorageId] = useState("");
  const [comboboxOpen, setComboboxOpen] = useState(false);
  const [showOverwriteWarning, setShowOverwriteWarning] = useState(false);

  const formatTime = (timeString: string) => {
    const date = new Date(timeString);
    return date.toLocaleString("ja-JP", {
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "整備データ未入力":
        return "bg-red-50 text-red-700 border-red-200";
      case "保管庫ID未入力":
        return "bg-yellow-50 text-yellow-700 border-yellow-200";
      case "作業完了":
        return "bg-green-50 text-green-700 border-green-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const generateAllStorageIds = () => {
    const options: string[] = [];
    storageAreas.forEach((area) => {
      for (let i = 1; i <= area.slots; i++) {
        const storageId = `${area.area}-${i.toString().padStart(3, "0")}`;
        options.push(storageId);
      }
    });
    return options.sort();
  };

  const getStorageUsageInfo = (storageId: string) => {
    return currentStorageUsage.find((usage) => usage.storageId === storageId);
  };

  const isStorageOccupied = (storageId: string) => {
    return currentStorageUsage.some((usage) => usage.storageId === storageId);
  };

  const getCustomerHistory = (customerName: string, carNumber: string) => {
    if (!customerName || !carNumber) {
      return [];
    }

    return customerHistoryLogs
      .filter(
        (log) =>
          log.customerName === customerName && log.carNumber === carNumber
      )
      .sort(
        (a, b) =>
          new Date(b.usedDate).getTime() - new Date(a.usedDate).getTime()
      );
  };

  const getStorageOptions = () => {
    if (!selectedItem) {
      return {
        historical: [],
        available: [],
        occupied: [],
        all: [],
      };
    }

    const customerHistory = getCustomerHistory(
      selectedItem.customerName,
      selectedItem.carNumber
    );
    const allStorageIds = generateAllStorageIds();

    // 過去に使用した保管庫IDのうち、現在利用可能なもの
    const historicalAvailable = customerHistory
      .map((log) => log.storageId)
      .filter(
        (storageId) =>
          allStorageIds.includes(storageId) && !isStorageOccupied(storageId)
      )
      .filter((storageId, index, self) => self.indexOf(storageId) === index); // 重複除去

    // 過去に使用した保管庫IDのうち、現在使用中のもの
    const historicalOccupied = customerHistory
      .map((log) => log.storageId)
      .filter(
        (storageId) =>
          allStorageIds.includes(storageId) && isStorageOccupied(storageId)
      )
      .filter((storageId, index, self) => self.indexOf(storageId) === index); // 重複除去

    // その他の利用可能な保管庫ID
    const otherAvailable = allStorageIds.filter(
      (storageId) =>
        !historicalAvailable.includes(storageId) &&
        !isStorageOccupied(storageId)
    );

    // その他の使用中の保管庫ID
    const otherOccupied = allStorageIds.filter(
      (storageId) =>
        !historicalOccupied.includes(storageId) && isStorageOccupied(storageId)
    );

    return {
      historical: [...historicalAvailable, ...historicalOccupied],
      available: [...historicalAvailable, ...otherAvailable],
      occupied: [...historicalOccupied, ...otherOccupied],
      all: allStorageIds,
    };
  };

  const openMaintenanceDialog = (item: any) => {
    setSelectedItem(item);
    if (item.maintenanceData) {
      setMaintenanceFormData(item.maintenanceData);
    } else {
      setMaintenanceFormData({
        oldTireCondition: "",
        newTireDetails: "",
        workContent: "",
        worker: "",
        completionTime: new Date().toISOString().slice(0, 16),
        notes: "",
      });
    }
    setIsMaintenanceDialogOpen(true);
  };

  const openStorageDialog = (item: any) => {
    setSelectedItem(item);
    setSelectedStorageId(item.storageId || "");
    setShowOverwriteWarning(false);
    setIsStorageDialogOpen(true);
  };

  const saveMaintenanceData = () => {
    if (!selectedItem) return;

    const updatedData = receptionData.map((item) => {
      if (item.id === selectedItem.id) {
        return {
          ...item,
          maintenanceData: maintenanceFormData,
          status: "保管庫ID未入力",
        };
      }
      return item;
    });

    setReceptionData(updatedData);
    setIsMaintenanceDialogOpen(false);
    setSelectedItem(null);
  };

  const saveStorageId = () => {
    if (!selectedItem || !selectedStorageId) return;

    const updatedData = receptionData.map((item) => {
      if (item.id === selectedItem.id) {
        return {
          ...item,
          storageId: selectedStorageId,
          status: "作業完了",
        };
      }
      return item;
    });

    setReceptionData(updatedData);
    setIsStorageDialogOpen(false);
    setSelectedItem(null);
    setSelectedStorageId("");
    setShowOverwriteWarning(false);
  };

  const handleMaintenanceInputChange = (
    field: keyof MaintenanceData,
    value: string
  ) => {
    setMaintenanceFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleStorageSelection = (storageId: string) => {
    setSelectedStorageId(storageId);
    setShowOverwriteWarning(isStorageOccupied(storageId));
    setComboboxOpen(false);
  };

  const getNextAction = (item: any) => {
    switch (item.status) {
      case "整備データ未入力":
        return (
          <Button size="sm" onClick={() => openMaintenanceDialog(item)}>
            整備データ入力
          </Button>
        );
      case "保管庫ID未入力":
        return (
          <Button size="sm" onClick={() => openStorageDialog(item)}>
            保管庫割当
          </Button>
        );
      case "作業完了":
        return <span className="text-sm text-green-600 font-medium">完了</span>;
      default:
        return null;
    }
  };

  const storageOptions = selectedItem
    ? getStorageOptions()
    : { historical: [], available: [], occupied: [], all: [] };
  const currentUsageInfo = selectedStorageId
    ? getStorageUsageInfo(selectedStorageId)
    : null;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* ヘッダー */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            タイヤ交換受付一覧
          </h1>
          <p className="text-gray-600">本日の受付: {receptionData.length}件</p>
        </div>

        {/* メインテーブル */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Clock className="h-5 w-5" />
              受付一覧
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">No.</TableHead>
                  <TableHead>顧客情報</TableHead>
                  <TableHead className="w-[120px]">受付時間</TableHead>
                  <TableHead className="w-[100px]">保管庫</TableHead>
                  <TableHead className="w-[140px]">ステータス</TableHead>
                  <TableHead className="w-[120px]">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {receptionData.map((item) => (
                  <TableRow key={item.id} className="hover:bg-gray-50">
                    <TableCell className="font-medium">
                      #{item.id.toString().padStart(3, "0")}
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium text-gray-900">
                          {item.customerName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {item.carNumber}
                        </div>
                        <div className="text-sm text-gray-500">
                          {item.carModel}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">
                      {formatTime(item.receptionTime)}
                    </TableCell>
                    <TableCell>
                      {item.storageId ? (
                        <Badge variant="outline" className="font-mono">
                          {item.storageId}
                        </Badge>
                      ) : (
                        <span className="text-sm text-gray-400">未割当</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={getStatusColor(item.status)}
                      >
                        {item.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{getNextAction(item)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* 整備データ入力モーダル */}
        <Dialog
          open={isMaintenanceDialogOpen}
          onOpenChange={setIsMaintenanceDialogOpen}
        >
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                整備データ入力
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4 py-4">
              {/* 顧客情報 */}
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="font-medium">{selectedItem?.customerName}</div>
                <div className="text-sm text-gray-600">
                  {selectedItem?.carNumber}
                </div>
              </div>

              {/* フォーム */}
              <div className="space-y-4">
                <div>
                  <Label>旧タイヤの状態</Label>
                  <Select
                    value={maintenanceFormData.oldTireCondition}
                    onValueChange={(value) =>
                      handleMaintenanceInputChange("oldTireCondition", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="選択してください" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="摩耗度30%">摩耗度30%</SelectItem>
                      <SelectItem value="摩耗度50%">摩耗度50%</SelectItem>
                      <SelectItem value="摩耗度70%">摩耗度70%</SelectItem>
                      <SelectItem value="摩耗度90%">摩耗度90%</SelectItem>
                      <SelectItem value="パンク">パンク</SelectItem>
                      <SelectItem value="ひび割れ">ひび割れ</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>新タイヤ詳細</Label>
                  <Input
                    value={maintenanceFormData.newTireDetails}
                    onChange={(e) =>
                      handleMaintenanceInputChange(
                        "newTireDetails",
                        e.target.value
                      )
                    }
                    placeholder="メーカー、サイズ、製造年"
                  />
                </div>

                <div>
                  <Label>作業内容</Label>
                  <Textarea
                    value={maintenanceFormData.workContent}
                    onChange={(e) =>
                      handleMaintenanceInputChange(
                        "workContent",
                        e.target.value
                      )
                    }
                    placeholder="実施した作業内容"
                    rows={2}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>作業者</Label>
                    <Input
                      value={maintenanceFormData.worker}
                      onChange={(e) =>
                        handleMaintenanceInputChange("worker", e.target.value)
                      }
                      placeholder="作業者名"
                    />
                  </div>
                  <div>
                    <Label>完了時間</Label>
                    <Input
                      type="datetime-local"
                      value={maintenanceFormData.completionTime}
                      onChange={(e) =>
                        handleMaintenanceInputChange(
                          "completionTime",
                          e.target.value
                        )
                      }
                    />
                  </div>
                </div>

                <div>
                  <Label>備考</Label>
                  <Textarea
                    value={maintenanceFormData.notes}
                    onChange={(e) =>
                      handleMaintenanceInputChange("notes", e.target.value)
                    }
                    placeholder="特記事項"
                    rows={2}
                  />
                </div>
              </div>

              {/* ボタン */}
              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => setIsMaintenanceDialogOpen(false)}
                >
                  キャンセル
                </Button>
                <Button onClick={saveMaintenanceData}>
                  <Save className="h-4 w-4 mr-2" />
                  保存
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* 保管庫ID割り振りモーダル */}
        <Dialog
          open={isStorageDialogOpen}
          onOpenChange={setIsStorageDialogOpen}
        >
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
                <div className="font-medium">{selectedItem?.customerName}</div>
                <div className="text-sm text-gray-600">
                  {selectedItem?.carNumber}
                </div>
              </div>

              {/* 過去の使用履歴表示 */}
              {selectedItem &&
                getCustomerHistory(
                  selectedItem.customerName,
                  selectedItem.carNumber
                ).length > 0 && (
                  <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center gap-2 mb-2">
                      <History className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-medium text-blue-800">
                        過去の使用履歴
                      </span>
                    </div>
                    <div className="space-y-1">
                      {getCustomerHistory(
                        selectedItem.customerName,
                        selectedItem.carNumber
                      )
                        .slice(0, 3)
                        .map((log, index) => (
                          <div key={index} className="text-sm text-blue-700">
                            {log.storageId} (
                            {new Date(log.usedDate).toLocaleDateString("ja-JP")}
                            )
                          </div>
                        ))}
                    </div>
                  </div>
                )}

              {/* 上書き警告 */}
              {showOverwriteWarning && currentUsageInfo && (
                <Alert className="border-orange-200 bg-orange-50">
                  <AlertTriangle className="h-4 w-4 text-orange-600" />
                  <AlertDescription className="text-orange-800">
                    <div className="font-medium mb-1">
                      この保管庫は現在使用中です
                    </div>
                    <div className="text-sm">
                      <div>使用者: {currentUsageInfo.customerName}</div>
                      <div>車両: {currentUsageInfo.carNumber}</div>
                      <div>
                        保管日:{" "}
                        {new Date(
                          currentUsageInfo.storageDate
                        ).toLocaleDateString("ja-JP")}
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
                <Popover open={comboboxOpen} onOpenChange={setComboboxOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={comboboxOpen}
                      className="w-full justify-between"
                    >
                      {selectedStorageId || "保管庫を選択..."}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput placeholder="保管庫IDを検索..." />
                      <CommandList>
                        <CommandEmpty>
                          該当する保管庫が見つかりません。
                        </CommandEmpty>

                        {/* 過去の使用履歴がある場合 */}
                        {storageOptions.historical.length > 0 && (
                          <CommandGroup heading="過去の使用履歴">
                            {storageOptions.historical.map((storageId) => {
                              const isOccupied = isStorageOccupied(storageId);
                              const usageInfo = getStorageUsageInfo(storageId);
                              return (
                                <CommandItem
                                  key={storageId}
                                  value={storageId}
                                  onSelect={() =>
                                    handleStorageSelection(storageId)
                                  }
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      selectedStorageId === storageId
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                  />
                                  <div className="flex items-center gap-2 flex-1">
                                    <History className="h-3 w-3 text-blue-500" />
                                    <span className="font-mono">
                                      {storageId}
                                    </span>
                                    {isOccupied ? (
                                      <div className="flex items-center gap-1">
                                        <User className="h-3 w-3 text-orange-500" />
                                        <span className="text-xs text-orange-600">
                                          使用中
                                        </span>
                                      </div>
                                    ) : (
                                      <span className="text-xs text-blue-600">
                                        (履歴あり)
                                      </span>
                                    )}
                                  </div>
                                  {isOccupied && usageInfo && (
                                    <div className="text-xs text-gray-500 ml-auto">
                                      {usageInfo.customerName}
                                    </div>
                                  )}
                                </CommandItem>
                              );
                            })}
                          </CommandGroup>
                        )}

                        {/* 利用可能な保管庫 */}
                        <CommandGroup heading="利用可能な保管庫">
                          {storageOptions.available
                            .filter(
                              (storageId) =>
                                !storageOptions.historical.includes(storageId)
                            )
                            .map((storageId) => (
                              <CommandItem
                                key={storageId}
                                value={storageId}
                                onSelect={() =>
                                  handleStorageSelection(storageId)
                                }
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    selectedStorageId === storageId
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                                <span className="font-mono">{storageId}</span>
                              </CommandItem>
                            ))}
                        </CommandGroup>

                        {/* 使用中の保管庫 */}
                        <CommandGroup heading="使用中の保管庫">
                          {storageOptions.occupied
                            .filter(
                              (storageId) =>
                                !storageOptions.historical.includes(storageId)
                            )
                            .map((storageId) => {
                              const usageInfo = getStorageUsageInfo(storageId);
                              return (
                                <CommandItem
                                  key={storageId}
                                  value={storageId}
                                  onSelect={() =>
                                    handleStorageSelection(storageId)
                                  }
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      selectedStorageId === storageId
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                  />
                                  <div className="flex items-center gap-2 flex-1">
                                    <User className="h-3 w-3 text-orange-500" />
                                    <span className="font-mono">
                                      {storageId}
                                    </span>
                                    <span className="text-xs text-orange-600">
                                      使用中
                                    </span>
                                  </div>
                                  {usageInfo && (
                                    <div className="text-xs text-gray-500 ml-auto">
                                      {usageInfo.customerName}
                                    </div>
                                  )}
                                </CommandItem>
                              );
                            })}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                <p className="text-sm text-gray-500 mt-1">
                  利用可能: {storageOptions.available.length}箇所 / 使用中:{" "}
                  {storageOptions.occupied.length}箇所
                  {storageOptions.historical.length > 0 && (
                    <span className="text-blue-600">
                      {" "}
                      (履歴: {storageOptions.historical.length}箇所)
                    </span>
                  )}
                </p>
              </div>

              {/* ボタン */}
              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => setIsStorageDialogOpen(false)}
                >
                  キャンセル
                </Button>
                <Button
                  onClick={saveStorageId}
                  disabled={!selectedStorageId}
                  variant={showOverwriteWarning ? "destructive" : "default"}
                >
                  <Save className="h-4 w-4 mr-2" />
                  {showOverwriteWarning ? "上書き割当" : "割当"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
