import React, { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TaskInput } from "@/utils/interface";

interface Props {
  taskList: TaskInput[];
}

const NumberOfStatus = ({ taskList }: Props) => {
  const groupedTasks = useMemo(() => {
    const groups = {
      incomplete: taskList.filter((task) => task.status === "incomplete"),
      complete: taskList.filter((task) => task.status === "complete"),
      pending: taskList.filter((task) => task.status === "pending"),
    };
    return groups;
  }, [taskList]);
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <Card>
        <CardHeader>
          <CardTitle>整備データ未入力</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">{groupedTasks.incomplete.length}件</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>保管庫ID未入力</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">{groupedTasks.pending.length}件</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>作業完了</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">{groupedTasks.complete.length}件</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default NumberOfStatus;
