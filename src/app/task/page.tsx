import TaskSeparator from "@/features/task/TaskSeparator";

const TaskPage = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="font-bold text-3xl mb-6 text-center">予約リスト</h1>
      <TaskSeparator />
    </div>
  );
};

export default TaskPage;
