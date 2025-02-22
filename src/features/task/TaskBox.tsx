import React from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Task, Client, Car } from "@/interface/interface";

interface Props {
  state: 1 | 2 | 3;
  tasks: (Task & { client: Client } & { car: Car })[];
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

  return (
    <div className="flex-1 mb-4">
      <div className=" mb-2">
        <button
          className={`${getButtonColor(
            state
          )} text-white py-2 px-4 rounded-md m-4`}
        >
          {getButtonText(state)}
        </button>
        <div className="w-full bg-black h-1 mt-4"></div>

        {tasks.map((task) => (
          <Link href={`/task/edit/${task.id}`} key={task.id}>
            <Card className="m-4">
              <CardHeader>
                <CardTitle>{task.client.client_name}</CardTitle>
                <CardDescription>
                  {task.client.client_name_kana}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CardTitle>{task.car.car_model}</CardTitle>
                <CardTitle>{task.car.car_number}</CardTitle>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default TaskBox;
