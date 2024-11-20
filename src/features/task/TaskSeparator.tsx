import React from "react";
import TaskBox from "./TaskBox";
import { getAllTasks } from "@/utils/supabaseFunction";

const TaskSeparator = async () => {
  const masterTasks = await getAllTasks();
  const incomplete = masterTasks.filter((task) => task.state === 1);
  const inprogress = masterTasks.filter((task) => task.state === 2);
  const complete = masterTasks.filter((task) => task.state === 3);

  return (
    <div>
      <h1>Task Window</h1>
      <div className="flex w-full">
        <TaskBox state={1} tasks={incomplete} />
        <TaskBox state={2} tasks={inprogress} />
        <TaskBox state={3} tasks={complete} />
      </div>
    </div>
  );
};

export default TaskSeparator;
