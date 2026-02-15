"use client";

import { createPitTaskApplication } from "@/app/refactor/application/pit/pitTaskApplication";
import { PitFilterStatus, PitTask } from "@/app/refactor/domain/type/pit";
import PitStatusCards from "@/app/refactor/presentation/pit/components/PitStatusCards";
import PitTaskTable from "@/app/refactor/presentation/pit/components/PitTaskTable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Filter, Wrench } from "lucide-react";
import { useMemo, useState } from "react";
import PitMaintenanceDialog from "@/app/refactor/presentation/pit/components/PitMaintenanceDialog";
import { useRouter } from "next/navigation";
import { PitTaskInput } from "@/app/refactor/domain/type/pit";

interface PitTaskListProps {
  tasks: PitTask[];
}

const PitTaskList = ({ tasks }: PitTaskListProps) => {
  const app = useMemo(() => createPitTaskApplication(), []);
  const router = useRouter();
  const [filterStatus, setFilterStatus] = useState<PitFilterStatus>("all");
  const [isMaintenanceDialogOpen, setIsMaintenanceDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<PitTaskInput | null>(null);

  const groupedAllTasks = useMemo(() => app.groupTasksByStatus(tasks), [app, tasks]);
  const filteredTasks = useMemo(
    () => app.filterTasks(tasks, filterStatus),
    [app, tasks, filterStatus],
  );
  const groupedFilteredTasks = useMemo(
    () => app.groupTasksByStatus(filteredTasks),
    [app, filteredTasks],
  );

  return (
    <Card>
      <CardHeader className="space-y-4">
        <CardTitle className="flex items-center gap-2">
          <Wrench className="h-5 w-5" />
          ピット整備項目一覧 ({tasks.length}件)
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
              <SelectItem value="incomplete">未完了のみ</SelectItem>
              <SelectItem value="complete">完了のみ</SelectItem>
              <SelectItem value="pending">保留中のみ</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <PitStatusCards groupedTasks={groupedAllTasks} />

        <PitTaskTable
          tasks={groupedFilteredTasks.incomplete}
          label="未完了"
          badgeClassName="bg-yellow-100 px-4 py-2 text-base text-yellow-800 hover:bg-yellow-100"
          formatTaskId={app.formatTaskId}
          onEditTask={(task) => {
            setSelectedTask(task.sourceTask);
            setIsMaintenanceDialogOpen(true);
          }}
        />
        <PitTaskTable
          tasks={groupedFilteredTasks.complete}
          label="完了"
          badgeClassName="bg-green-100 px-4 py-2 text-base text-green-800 hover:bg-green-100"
          formatTaskId={app.formatTaskId}
          onEditTask={(task) => {
            setSelectedTask(task.sourceTask);
            setIsMaintenanceDialogOpen(true);
          }}
        />
        <PitTaskTable
          tasks={groupedFilteredTasks.pending}
          label="保留中"
          badgeClassName="bg-blue-100 px-4 py-2 text-base text-blue-800 hover:bg-blue-100"
          formatTaskId={app.formatTaskId}
          onEditTask={(task) => {
            setSelectedTask(task.sourceTask);
            setIsMaintenanceDialogOpen(true);
          }}
        />

        <PitMaintenanceDialog
          open={isMaintenanceDialogOpen}
          onOpenChange={(open) => {
            setIsMaintenanceDialogOpen(open);
            if (!open) {
              setSelectedTask(null);
            }
          }}
          selectedTask={selectedTask}
          onSaved={() => {
            setIsMaintenanceDialogOpen(false);
            setSelectedTask(null);
            router.refresh();
          }}
        />
      </CardContent>
    </Card>
  );
};

export default PitTaskList;
