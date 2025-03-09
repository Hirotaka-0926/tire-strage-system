import React from "react";
import TaskBox from "./TaskBox";
import { getAllTasks } from "@/utils/supabaseFunction";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const TaskSeparator = async () => {
  const masterTasks = await getAllTasks();
  const incomplete = masterTasks.filter((task) => task.state === 1);
  const inprogress = masterTasks.filter((task) => task.state === 2);
  const complete = masterTasks.filter((task) => task.state === 3);
  console.log(masterTasks);

  return (
    <div>
      <div className="block md:hidden">
        <Tabs defaultValue="incomplete" className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger
              value="incomplete"
              className="data-[state=active]:bg-blue-500 data-[state=active]:text-white"
            >
              未完了 ({incomplete.length})
            </TabsTrigger>
            <TabsTrigger
              value="inprogress"
              className="data-[state=active]:bg-yellow-500 data-[state=active]:text-white"
            >
              対応中 ({inprogress.length})
            </TabsTrigger>
            <TabsTrigger
              value="complete"
              className="data-[state=active]:bg-green-500 data-[state=active]:text-white"
            >
              完了済み ({complete.length})
            </TabsTrigger>
          </TabsList>
          <TabsContent value="incomplete">
            <TaskBox state={1} tasks={incomplete} />
          </TabsContent>
          <TabsContent value="inprogress">
            <TaskBox state={2} tasks={inprogress} />
          </TabsContent>
          <TabsContent value="complete">
            <TaskBox state={3} tasks={complete} />
          </TabsContent>
        </Tabs>
      </div>

      <div className="hidden md:grid grid-cols-3 gap-4">
        <TaskBox state={1} tasks={incomplete} />
        <TaskBox state={2} tasks={inprogress} />
        <TaskBox state={3} tasks={complete} />
      </div>
    </div>
  );
};

export default TaskSeparator;
