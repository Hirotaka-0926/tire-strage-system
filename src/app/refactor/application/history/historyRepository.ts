import { HistoryLogInput } from "@/app/refactor/domain/type/history";

export interface HistoryRepository {
  getAllHistoryLogs: () => Promise<HistoryLogInput[]>;
}

