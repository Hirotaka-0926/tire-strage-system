import PitTaskList from "@/app/refactor/presentation/pit/PitTaskList";
import { createPitTaskQueryApplication } from "@/app/refactor/application/pit/pitTaskQueryApplication";

const PitPage = async () => {
  const app = createPitTaskQueryApplication();
  const pitTasks = await app.getPitTasks();

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
