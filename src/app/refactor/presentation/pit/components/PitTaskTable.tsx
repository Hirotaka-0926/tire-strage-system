"use client";

import { PitTask } from "@/app/refactor/domain/type/pit";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Car,
  FilePenLine,
  Hash,
  MapPin,
  Package,
  Save,
  Trash2,
  User,
} from "lucide-react";

interface PitTaskTableProps {
  tasks: PitTask[];
  label: string;
  badgeClassName: string;
  formatTaskId: (id?: number) => string;
  onEditTask: (task: PitTask) => void;
  onAssignStorage: (task: PitTask) => void;
  onSaveTask: (task: PitTask) => void;
  onDeleteTask: (task: PitTask) => void;
}

const PitTaskTable = ({
  tasks,
  label,
  badgeClassName,
  formatTaskId,
  onEditTask,
  onAssignStorage,
  onSaveTask,
  onDeleteTask,
}: PitTaskTableProps) => {
  if (tasks.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h3 className="flex items-center gap-3 text-xl font-semibold">
        <Badge className={badgeClassName}>
          {label} ({tasks.length}件)
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
              <TableHead className="min-w-[280px]">操作</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {tasks.map((task) => (
              <TableRow key={`${task.status}-${task.id ?? "unknown"}`}>
                <TableCell className="font-medium">{formatTaskId(task.id)}</TableCell>
                <TableCell className="font-medium text-gray-900">
                  {task.clientName || "未登録"}
                </TableCell>
                <TableCell className="font-mono text-sm">
                  {task.carNumber || "未登録"}
                </TableCell>
                <TableCell>{task.carModel || "未登録"}</TableCell>
                <TableCell className="font-mono text-sm">
                  {task.storageId ? (
                    <Badge variant="outline" className="bg-blue-50 text-blue-700">
                      {task.storageId}
                    </Badge>
                  ) : (
                    <span className="text-gray-400">未割り当て</span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      type="button"
                      variant={task.status === "incomplete" ? "default" : "outline"}
                      onClick={() => onEditTask(task)}
                    >
                      <FilePenLine className="mr-2 h-4 w-4" />
                      {task.status === "incomplete" ? "整備データ入力" : "整備データ編集"}
                    </Button>
                    {task.status !== "incomplete" && (
                      <Button type="button" onClick={() => onAssignStorage(task)}>
                        <MapPin className="mr-2 h-4 w-4" />
                        {task.storageId ? "保管庫変更" : "保管庫割り当て"}
                      </Button>
                    )}
                    {task.status === "complete" && (
                      <Button type="button" onClick={() => onSaveTask(task)}>
                        <Save className="mr-2 h-4 w-4" />
                        保管庫へ保存
                      </Button>
                    )}
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={() => onDeleteTask(task)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      削除
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default PitTaskTable;
