import { HistoryLogInput } from "@/app/domain/type/history";

export interface HistoryRepository {
  getAllHistoryLogs: () => Promise<HistoryLogInput[]>;
}

