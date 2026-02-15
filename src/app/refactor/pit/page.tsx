import PitTaskList from "@/app/refactor/presentation/pit/PitTaskList";
import { PitTask } from "@/app/refactor/domain/type/pit";
import { getAllTasks } from "@/utils/supabaseServerFunction";

const toPitStatus = (status: string): PitTask["status"] => {
  if (status === "complete" || status === "pending") {
    return status;
  }
  return "incomplete";
};

const PitPage = async () => {
  const tasks = await getAllTasks();

  const pitTasks: PitTask[] = tasks.map((task) => ({
    id: task.id,
    status: toPitStatus(task.status),
    clientName: task.client?.client_name ?? "",
    carNumber: task.car?.car_number ?? "",
    carModel: task.car?.car_model ?? "",
    storageId: task.storage_id ?? "",
  }));

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="mx-auto">
        <div className="mb-6 flex flex-col">
          <h1 className="mb-2 text-left text-3xl font-bold text-gray-900">
            ピット整備項目
          </h1>
          <p className="mb-4 font-semibold text-gray-600">
            受付済みの整備項目をステータス別に確認できます。
          </p>
        </div>

        <PitTaskList tasks={pitTasks} />
      </div>
    </div>
  );
};

export default PitPage;
