"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TaskInput } from "@/utils/interface";
import {
  Clock,
  User,
  Hash,
  Car,
  Package,
  Save,
  FilePenLine,
  MapPin,
  Filter,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import EditForm from "./EditForm";
import AssignStorageDialog from "./AssignStorageDialog";
import SaveTaskDialog from "./SaveTaskDialog";
import { PDFPreviewModal } from "../emptyList/components/PDFPreviewModal";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { getYearAndSeason } from "@/utils/globalFunctions";

interface Props {
  tasks: TaskInput[];
}

const ReceptionList = ({ tasks }: Props) => {
  const [selectedItem, setSelectedItem] = useState<TaskInput | null>(null);
  const [isMaintenanceDialogOpen, setIsMaintenanceDialogOpen] = useState(false);
  const [isStorageDialogOpen, setIsStorageDialogOpen] = useState(false);
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);
  const [isPDFPreviewOpen, setIsPDFPreviewOpen] = useState(false);
  const [pdfData, setPdfData] = useState<any>(null);
  const [taskList, setTaskList] = useState<TaskInput[]>(() => tasks);
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const router = useRouter();
  const { year, season } = getYearAndSeason();

  // TaskInputをPDF用データに変換
  const convertTaskToPdfData = (task: TaskInput) => {
    return {
      id: task.id || 0,
      year: year,
      season: season,
      car: task.car || {},
      client: task.client || {},
      state: task.tire_state || {},
      storage: {
        id: task.storage_id || "",
        car_id: task.car?.id || null,
        client_id: task.client?.id || null,
        tire_state_id: task.tire_state?.id || null,
      },
    };
  };

  // IDを安定的にフォーマットするヘルパー関数
  const formatTaskId = (id: number | undefined) => {
    return id ? `#${id.toString().padStart(3, "0")}` : "#未割当";
  };

  // propsのtasksが変更された時に状態を同期
  useEffect(() => {
    setTaskList(tasks);
  }, [tasks]);

  // ステータスごとにグループ化されたタスクリスト
  const groupedTasks = useMemo(() => {
    const groups = {
      incomplete: taskList.filter((task) => task.status === "incomplete"),
      complete: taskList.filter((task) => task.status === "complete"),
      pending: taskList.filter((task) => task.status === "pending"),
    };
    return groups;
  }, [taskList]);

  const handleMaintenanceEdit = (item: TaskInput) => {
    setSelectedItem(item);
    console.log("Selected Item for Edit:", item);
    setIsMaintenanceDialogOpen(true);
  };

  const handleStorageAssignOpen = (item: TaskInput) => {
    setSelectedItem(item);
    setIsStorageDialogOpen(true);
  };

  const handleSaveDialogOpen = (item: TaskInput) => {
    setSelectedItem(item);
    setIsSaveDialogOpen(true);
  };

  const handleStorageAssign = (storageId: string) => {
    if (!selectedItem) return;
    setTaskList((prev) =>
      prev.map((t) =>
        t.id === selectedItem.id
          ? { ...t, storage_id: storageId, status: "complete" }
          : t
      )
    );

    setIsStorageDialogOpen(false);
    setSelectedItem(null);
  };

  const getActionButton = (item: TaskInput) => {
    if (item.status === "incomplete") {
      return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          <Button
            size="default"
            className="p-4"
            onClick={() => handleMaintenanceEdit(item)}
          >
            整備データ入力
          </Button>
        </div>
      );
    } else if (item.status === "complete") {
      return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          <Button
            variant="outline"
            size="default"
            onClick={() => handleMaintenanceEdit(item)}
          >
            <FilePenLine className="mr-2 h-4 w-4" />
            編集
          </Button>
          <Button size="default" onClick={() => handleStorageAssignOpen(item)}>
            <MapPin className="mr-2 h-4 w-4" />
            {item.storage_id ? "保管庫変更" : "保管庫割当"}
          </Button>
          <Button
            variant="default"
            size="default"
            onClick={() => handleSaveDialogOpen(item)}
          >
            <Save className="mr-2 h-4 w-4" />
            保存
          </Button>
        </div>
      );
    } else if (item.status === "pending") {
      return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          <Button
            variant="outline"
            size="default"
            onClick={() => handleMaintenanceEdit(item)}
          >
            <FilePenLine className="mr-2 h-4 w-4" />
            編集
          </Button>
          <Button size="default" onClick={() => handleStorageAssignOpen(item)}>
            <MapPin className="mr-2 h-4 w-4" />
            保管庫割当
          </Button>
        </div>
      );
    }
  };
  const getStatusColor = (status: string) => {
    switch (status) {
      case "incomplete":
        return "bg-yellow-50 text-yellow-700";
      case "complete":
        return "bg-green-50 text-green-700";
      case "pending":
        return "bg-blue-50 text-blue-700";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "incomplete":
        return "未完了";
      case "complete":
        return "完了";
      case "pending":
        return "保留中";
      default:
        return status;
    }
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          受付済み予約 ({taskList.length}件)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <EditForm
          isMaintenanceDialogOpen={isMaintenanceDialogOpen}
          setIsMaintenanceDialogOpen={setIsMaintenanceDialogOpen}
          selectedItem={selectedItem}
          setSelectedItem={setSelectedItem}
        />
        <AssignStorageDialog
          open={isStorageDialogOpen}
          setOpen={setIsStorageDialogOpen}
          selectedItem={selectedItem}
          onAssigned={handleStorageAssign}
        />
        <SaveTaskDialog
          open={isSaveDialogOpen}
          setOpen={setIsSaveDialogOpen}
          selectedData={selectedItem}
          onSave={() => {
            if (selectedItem) {
              const pdfDataForPreview = convertTaskToPdfData(selectedItem);
              setPdfData(pdfDataForPreview);
              setIsPDFPreviewOpen(true);
            }
            setIsSaveDialogOpen(false);
            setSelectedItem(null);
            router.refresh(); // Refresh the page to reflect changes
          }}
        />

        {/* PDFプレビューモーダル */}
        {pdfData && (
          <PDFPreviewModal
            storageData={pdfData}
            fileName={`予約_${
              pdfData.id?.toString().padStart(3, "0") || "未割当"
            }_${pdfData.client?.client_name || "不明"}.pdf`}
            open={isPDFPreviewOpen}
            onOpenChange={setIsPDFPreviewOpen}
          />
        )}

        <div className="space-y-6">
          {/* 未完了のタスク */}
          {groupedTasks.incomplete.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold flex items-center gap-3">
                <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100 text-base px-4 py-2">
                  未完了 ({groupedTasks.incomplete.length}件)
                </Badge>
              </h3>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">受付No.</TableHead>
                      <TableHead className="min-w-[120px]">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          顧客名
                        </div>
                      </TableHead>
                      <TableHead className="min-w-[150px]">
                        <div className="flex items-center gap-2">
                          <Hash className="h-4 w-4" />
                          車ナンバー
                        </div>
                      </TableHead>
                      <TableHead className="min-w-[140px]">
                        <div className="flex items-center gap-2">
                          <Car className="h-4 w-4" />
                          車種
                        </div>
                      </TableHead>
                      <TableHead className="min-w-[100px]">
                        <div className="flex items-center gap-2">
                          <Package className="h-4 w-4" />
                          保管庫ID
                        </div>
                      </TableHead>
                      <TableHead className="w-[400px]">操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {groupedTasks.incomplete.map((item) => (
                      <TableRow
                        key={`incomplete-${item.id || "unknown"}`}
                        className="hover:bg-gray-50"
                      >
                        <TableCell className="font-medium">
                          {formatTaskId(item.id)}
                        </TableCell>
                        <TableCell className="font-medium text-gray-900">
                          {item.client?.client_name || "未登録"}
                        </TableCell>
                        <TableCell className="font-mono text-sm">
                          {item.car?.car_number || "未登録"}
                        </TableCell>
                        <TableCell>{item.car?.car_model || "未登録"}</TableCell>
                        <TableCell className="font-mono text-sm">
                          {item.storage_id ? (
                            <Badge
                              variant="outline"
                              className="bg-blue-50 text-blue-700"
                            >
                              {item.storage_id}
                            </Badge>
                          ) : (
                            <span className="text-gray-400">未割当</span>
                          )}
                        </TableCell>
                        <TableCell>{getActionButton(item)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}

          {/* 完了のタスク */}
          {groupedTasks.complete.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold flex items-center gap-3">
                <Badge className="bg-green-100 text-green-800 hover:bg-green-100 text-base px-4 py-2">
                  完了 ({groupedTasks.complete.length}件)
                </Badge>
              </h3>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">受付No.</TableHead>
                      <TableHead className="min-w-[120px]">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          顧客名
                        </div>
                      </TableHead>
                      <TableHead className="min-w-[150px]">
                        <div className="flex items-center gap-2">
                          <Hash className="h-4 w-4" />
                          車ナンバー
                        </div>
                      </TableHead>
                      <TableHead className="min-w-[140px]">
                        <div className="flex items-center gap-2">
                          <Car className="h-4 w-4" />
                          車種
                        </div>
                      </TableHead>
                      <TableHead className="min-w-[100px]">
                        <div className="flex items-center gap-2">
                          <Package className="h-4 w-4" />
                          保管庫ID
                        </div>
                      </TableHead>
                      <TableHead className="w-[400px]">操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {groupedTasks.complete.map((item) => (
                      <TableRow
                        key={`complete-${item.id || "unknown"}`}
                        className="hover:bg-gray-50"
                      >
                        <TableCell className="font-medium">
                          {formatTaskId(item.id)}
                        </TableCell>
                        <TableCell className="font-medium text-gray-900">
                          {item.client?.client_name || "未登録"}
                        </TableCell>
                        <TableCell className="font-mono text-sm">
                          {item.car?.car_number || "未登録"}
                        </TableCell>
                        <TableCell>{item.car?.car_model || "未登録"}</TableCell>
                        <TableCell className="font-mono text-sm">
                          {item.storage_id ? (
                            <Badge
                              variant="outline"
                              className="bg-blue-50 text-blue-700"
                            >
                              {item.storage_id}
                            </Badge>
                          ) : (
                            <span className="text-gray-400">未割当</span>
                          )}
                        </TableCell>
                        <TableCell>{getActionButton(item)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}

          {/* 保留中のタスク */}
          {groupedTasks.pending.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold flex items-center gap-3">
                <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100 text-base px-4 py-2">
                  保留中 ({groupedTasks.pending.length}件)
                </Badge>
              </h3>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">受付No.</TableHead>
                      <TableHead className="min-w-[120px]">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          顧客名
                        </div>
                      </TableHead>
                      <TableHead className="min-w-[150px]">
                        <div className="flex items-center gap-2">
                          <Hash className="h-4 w-4" />
                          車ナンバー
                        </div>
                      </TableHead>
                      <TableHead className="min-w-[140px]">
                        <div className="flex items-center gap-2">
                          <Car className="h-4 w-4" />
                          車種
                        </div>
                      </TableHead>
                      <TableHead className="min-w-[100px]">
                        <div className="flex items-center gap-2">
                          <Package className="h-4 w-4" />
                          保管庫ID
                        </div>
                      </TableHead>
                      <TableHead className="w-[400px]">操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {groupedTasks.pending.map((item) => (
                      <TableRow
                        key={`pending-${item.id || "unknown"}`}
                        className="hover:bg-gray-50"
                      >
                        <TableCell className="font-medium">
                          {formatTaskId(item.id)}
                        </TableCell>
                        <TableCell className="font-medium text-gray-900">
                          {item.client?.client_name || "未登録"}
                        </TableCell>
                        <TableCell className="font-mono text-sm">
                          {item.car?.car_number || "未登録"}
                        </TableCell>
                        <TableCell>{item.car?.car_model || "未登録"}</TableCell>
                        <TableCell className="font-mono text-sm">
                          {item.storage_id ? (
                            <Badge
                              variant="outline"
                              className="bg-blue-50 text-blue-700"
                            >
                              {item.storage_id}
                            </Badge>
                          ) : (
                            <span className="text-gray-400">未割当</span>
                          )}
                        </TableCell>
                        <TableCell>{getActionButton(item)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ReceptionList;
