"use client";

import React, { useState } from "react";
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
import { Clock, User, Hash, Car, Package } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import EditForm from "./EditForm";
import AssignStorageDialog from "./AssignStorageDialog";

interface Props {
  tasks: TaskInput[];
}

const ReceptionList = ({ tasks }: Props) => {
  const [selectedItem, setSelectedItem] = useState<TaskInput | null>(null);
  const [isMaintenanceDialogOpen, setIsMaintenanceDialogOpen] = useState(false);
  const [isStorageDialogOpen, setIsStorageDialogOpen] = useState(false);
  const [taskList, setTaskList] = useState<TaskInput[]>(tasks);

  const handleMaintenanceEdit = (item: TaskInput) => {
    setSelectedItem(item);
    setIsMaintenanceDialogOpen(true);
  };

  const handleStorageAssignOpen = (item: TaskInput) => {
    setSelectedItem(item);
    setIsStorageDialogOpen(true);
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <Button
            variant="outline"
            size="default"
            onClick={() => handleMaintenanceEdit(item)}
          >
            編集
          </Button>
          <Button size="default" onClick={() => handleStorageAssignOpen(item)}>
            {item.storage_id ? "保管庫ID変更" : "保管庫ID割当"}
          </Button>
        </div>
      );
    } else if (item.status === "pending") {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <Button
            variant="outline"
            size="default"
            onClick={() => handleMaintenanceEdit(item)}
          >
            編集
          </Button>
          <Button size="default" onClick={() => handleStorageAssignOpen(item)}>
            保管庫ID割当
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
                <TableHead className="min-w-[120px]">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    受付時間
                  </div>
                </TableHead>
                <TableHead>
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4" />
                    保管庫ID
                  </div>
                </TableHead>
                <TableHead>ステータス</TableHead>
                <TableHead className="w-[400px]">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {taskList.map((item) => (
                <TableRow key={item.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium">
                    #{item.id?.toString().padStart(3, "0") || "未割当"}
                  </TableCell>
                  <TableCell className="font-medium text-gray-900">
                    {item.client?.client_name || "未登録"}
                  </TableCell>
                  <TableCell className="font-mono text-sm">
                    {item.car?.car_number || "未登録"}
                  </TableCell>
                  <TableCell>{item.car?.car_model || "未登録"}</TableCell>
                  <TableCell className="font-mono text-sm">
                    {/* {formatTime(item.receptionTime)} */}
                  </TableCell>
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
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className={getStatusColor(item.status)}
                    >
                      {item.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{getActionButton(item)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReceptionList;
