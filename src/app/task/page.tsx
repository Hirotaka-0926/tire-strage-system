import NumberOfStatus from "./NumberOfStatus";
import ReceptionList from "./ReceptionList";
import { getAllTasks } from "@/utils/supabaseFunction";

const TaskPage = () => {
  const fetchTasks = async () => {
    try {
      const tasks = await getAllTasks();
      console.log("取得したタスク:", tasks);
    } catch (error) {
      console.error("タスクの取得に失敗:", error);
    }
  };

  return (
    <div className=" p-4 bg-gray-50 min-h-screen min-w-h-screen">
      <div className="mx-auto">
        <div className="flex flex-col mb-6">
          <h1 className="font-bold text-3xl mb-2 text-left text-gray-900">
            タイヤ交換受付
          </h1>
          <p className="font-semibold text-gray-600 mb-4">
            タイヤ交換の予約を受け付けます。
          </p>
        </div>

        <NumberOfStatus />
        <ReceptionList />
      </div>
    </div>
  );
};

export default TaskPage;
