import NumberOfStatus from "./NumberOfStatus";
import ReceptionList from "./ReceptionList";

import { getAllTasks } from "@/utils/supabaseServerFunction";

const TaskPage = async () => {
  const tasks = await getAllTasks();

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

        <NumberOfStatus taskList={tasks} />
        <ReceptionList tasks={tasks} />
      </div>
    </div>
  );
};

export default TaskPage;
