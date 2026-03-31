import { HistoryListItem } from "@/app/domain/type/history";
import { HistoryRepository } from "@/app/application/history/historyRepository";
import { createSupabaseHistoryRepository } from "@/app/infrastructure/history/supabaseHistoryRepository";
import { toHistoryListItem } from "@/app/infrastructure/mapper/historyMapper";

export const createHistoryQueryApplication = (
  repository: HistoryRepository = createSupabaseHistoryRepository(),
) => {
  const getHistoryList = async (): Promise<HistoryListItem[]> => {
    const logs = await repository.getAllHistoryLogs();
    return logs.map(toHistoryListItem);
  };

  return {
    getHistoryList,
  };
};

