"use client";
import React from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Task, Client, Car, State } from "@/utils/interface";
import { Badge } from "@/components/ui/badge";
import { Car as CarIcon, RectangleHorizontal, IdCard } from "lucide-react";

interface Props {
  state: 1 | 2 | 3;
  tasks: (Task & { tire_state: State & { car: Car & { client: Client } } })[];
}

const TaskBox: React.FC<Props> = ({ state, tasks }) => {
  const getButtonColor = (taskState: number) => {
    switch (taskState) {
      case 1:
        return "bg-blue-500";
      case 2:
        return "bg-yellow-500";
      case 3:
        return "bg-green-500";
    }
  };
  console.log(tasks);
  const getButtonText = (taskState: number) => {
    switch (taskState) {
      case 1:
        return "未完了";
      case 2:
        return "対応中";
      case 3:
        return "完了済み";
    }
  };
  console.log(tasks);

  const getBadgeVariant = (taskState: number) => {
    switch (taskState) {
      case 1:
        return "default";
      case 2:
        return "warning";
      case 3:
        return "success";
    }
  };

  return (
    <div className="flex-1">
      <div className=" sticky top-0 z-10 bg-background pb-2">
        <h2
          className={`${getButtonColor(
            state
          )} text-white p-2 rounded-md m-4 text-lg font-bold mb-2 `}
        >
          {getButtonText(state)} ({tasks.length})
        </h2>
        <div className="w-full bg-slate-200 h-1"></div>
      </div>
      <div className="space-y-4 mt-2 max-h-[calc(100vh-180px)] overflow-y-auto p-2">
        {tasks.length == 0 ? (
          <div className="text-center p-4 text-gray-500 bg-gray-100 rounded-md">
            作業予約はありません
          </div>
        ) : (
          tasks.map((task) => (
            <Link
              href={`/task/edit/${task.id}`}
              key={task.id}
              className="block"
            >
              <Card className="hover:shadow-md transition-all duration-200 border-l-4">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-base">
                      <IdCard className="h-4 w-4 mr-1 text-gray-500" />
                      <span>{task.tire_state.car.client.client_name}</span>
                    </CardTitle>
                    <Badge variant={getBadgeVariant(state)}>
                      {getButtonText(state)}
                    </Badge>
                  </div>
                  <CardDescription className="text-sm">
                    {task.tire_state.car.client?.client_name_kana}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="grid grid-cols-2 gap-1 text-sm">
                    <div className="flex items-center ">
                      <CarIcon className="h-4 w-4 mr-1 text-gray-500" />
                      <span>
                        {task.tire_state?.car?.car_model || "車種未登録"}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <RectangleHorizontal className="h-4 w-4 mr-1 text-gray-500" />
                      <span>
                        {task.tire_state?.car?.car_number || "ナンバー未登録"}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))
        )}
      </div>
    </div>
  );
};

export default TaskBox;
