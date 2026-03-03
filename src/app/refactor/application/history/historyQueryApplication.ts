import { HistoryListItem } from "@/app/refactor/domain/type/history";
import { HistoryRepository } from "@/app/refactor/application/history/historyRepository";
import { createSupabaseHistoryRepository } from "@/app/refactor/infrastructure/history/supabaseHistoryRepository";
import { toHistoryListItem } from "@/app/refactor/infrastructure/mapper/historyMapper";

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

