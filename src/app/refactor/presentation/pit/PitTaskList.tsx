"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Filter, Wrench } from "lucide-react";
import { createPitTaskApplication } from "@/app/refactor/application/pit/pitTaskApplication";
import {
  PitFilterStatus,
  PitTask,
  PitTaskInput,
} from "@/app/refactor/domain/type/pit";
import PitStatusCards from "@/app/refactor/presentation/pit/components/PitStatusCards";
import PitTaskTable from "@/app/refactor/presentation/pit/components/PitTaskTable";
import PitMaintenanceDialog from "@/app/refactor/presentation/pit/components/PitMaintenanceDialog";
import PitAssignStorageDialog from "@/app/refactor/presentation/pit/components/PitAssignStorageDialog";
import PitSaveTaskDialog from "@/app/refactor/presentation/pit/components/PitSaveTaskDialog";
import PitDeleteTaskDialog from "@/app/refactor/presentation/pit/components/PitDeleteTaskDialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PitTaskListProps {
  tasks: PitTask[];
}

const PitTaskList = ({ tasks }: PitTaskListProps) => {
  const app = useMemo(() => createPitTaskApplication(), []);
  const router = useRouter();

  const [filterStatus, setFilterStatus] = useState<PitFilterStatus>("all");
  const [isMaintenanceDialogOpen, setIsMaintenanceDialogOpen] = useState(false);
  const [isStorageDialogOpen, setIsStorageDialogOpen] = useState(false);
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedMaintenanceTask, setSelectedMaintenanceTask] =
    useState<PitTaskInput | null>(null);
  const [selectedStorageTask, setSelectedStorageTask] =
    useState<PitTaskInput | null>(null);
  const [selectedSaveTask, setSelectedSaveTask] = useState<PitTaskInput | null>(null);
  const [selectedDeleteTask, setSelectedDeleteTask] = useState<PitTaskInput | null>(
    null,
  );

  const groupedAllTasks = useMemo(() => app.groupTasksByStatus(tasks), [app, tasks]);
  const filteredTasks = useMemo(
    () => app.filterTasks(tasks, filterStatus),
    [app, tasks, filterStatus],
  );
  const groupedFilteredTasks = useMemo(
    () => app.groupTasksByStatus(filteredTasks),
    [app, filteredTasks],
  );

  const openMaintenanceDialog = (task: PitTask) => {
    setSelectedMaintenanceTask(task.sourceTask);
    setIsMaintenanceDialogOpen(true);
  };

  const openStorageDialog = (task: PitTask) => {
    setSelectedStorageTask(task.sourceTask);
    setIsStorageDialogOpen(true);
  };

  const openSaveDialog = (task: PitTask) => {
    setSelectedSaveTask(task.sourceTask);
    setIsSaveDialogOpen(true);
  };

  const openDeleteDialog = (task: PitTask) => {
    setSelectedDeleteTask(task.sourceTask);
    setIsDeleteDialogOpen(true);
  };

  return (
    <Card>
      <CardHeader className="space-y-4">
        <CardTitle className="flex items-center gap-2">
          <Wrench className="h-5 w-5" />
          ピット整備一覧 ({tasks.length}件)
        </CardTitle>

        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-500" />
          <Select
            value={filterStatus}
            onValueChange={(value) => setFilterStatus(value as PitFilterStatus)}
          >
            <SelectTrigger className="w-[220px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">すべて</SelectItem>
              <SelectItem value="incomplete">未対応のみ</SelectItem>
              <SelectItem value="complete">対応済みのみ</SelectItem>
              <SelectItem value="pending">保管庫待ちのみ</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <PitStatusCards groupedTasks={groupedAllTasks} />

        <PitTaskTable
          tasks={groupedFilteredTasks.incomplete}
          label="未対応"
          badgeClassName="bg-yellow-100 px-4 py-2 text-base text-yellow-800 hover:bg-yellow-100"
          formatTaskId={app.formatTaskId}
          onEditTask={openMaintenanceDialog}
          onAssignStorage={openStorageDialog}
          onSaveTask={openSaveDialog}
          onDeleteTask={openDeleteDialog}
        />
        <PitTaskTable
          tasks={groupedFilteredTasks.complete}
          label="対応済み"
          badgeClassName="bg-green-100 px-4 py-2 text-base text-green-800 hover:bg-green-100"
          formatTaskId={app.formatTaskId}
          onEditTask={openMaintenanceDialog}
          onAssignStorage={openStorageDialog}
          onSaveTask={openSaveDialog}
          onDeleteTask={openDeleteDialog}
        />
        <PitTaskTable
          tasks={groupedFilteredTasks.pending}
          label="保管庫待ち"
          badgeClassName="bg-blue-100 px-4 py-2 text-base text-blue-800 hover:bg-blue-100"
          formatTaskId={app.formatTaskId}
          onEditTask={openMaintenanceDialog}
          onAssignStorage={openStorageDialog}
          onSaveTask={openSaveDialog}
          onDeleteTask={openDeleteDialog}
        />

        <PitMaintenanceDialog
          open={isMaintenanceDialogOpen}
          onOpenChange={(open) => {
            setIsMaintenanceDialogOpen(open);
            if (!open) {
              setSelectedMaintenanceTask(null);
            }
          }}
          selectedTask={selectedMaintenanceTask}
          onSaved={() => {
            setIsMaintenanceDialogOpen(false);
            setSelectedMaintenanceTask(null);
            router.refresh();
          }}
        />

        <PitAssignStorageDialog
          open={isStorageDialogOpen}
          onOpenChange={(open) => {
            setIsStorageDialogOpen(open);
            if (!open) {
              setSelectedStorageTask(null);
            }
          }}
          selectedTask={selectedStorageTask}
          onAssigned={() => {
            setIsStorageDialogOpen(false);
            setSelectedStorageTask(null);
            router.refresh();
          }}
        />

        <PitSaveTaskDialog
          open={isSaveDialogOpen}
          onOpenChange={(open) => {
            setIsSaveDialogOpen(open);
            if (!open) {
              setSelectedSaveTask(null);
            }
          }}
          selectedTask={selectedSaveTask}
          onSaved={() => {
            setIsSaveDialogOpen(false);
            setSelectedSaveTask(null);
            router.refresh();
          }}
        />

        <PitDeleteTaskDialog
          open={isDeleteDialogOpen}
          onOpenChange={(open) => {
            setIsDeleteDialogOpen(open);
            if (!open) {
              setSelectedDeleteTask(null);
            }
          }}
          selectedTask={selectedDeleteTask}
          onDeleted={() => {
            setIsDeleteDialogOpen(false);
            setSelectedDeleteTask(null);
            router.refresh();
          }}
        />
      </CardContent>
    </Card>
  );
};

export default PitTaskList;
