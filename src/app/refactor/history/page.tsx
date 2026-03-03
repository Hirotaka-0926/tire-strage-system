import { createHistoryQueryApplication } from "@/app/refactor/application/history/historyQueryApplication";
import HistoryList from "@/app/refactor/presentation/history/HistoryList";

const RefactorHistoryPage = async () => {
  const app = createHistoryQueryApplication();
  const items = await app.getHistoryList();

  return (
    <div className="container mx-auto bg-gray-50 px-4 py-6">
      <h1 className="mb-6 text-2xl font-bold">履歴一覧</h1>
      <HistoryList items={items} />
    </div>
  );
};

export default RefactorHistoryPage;
