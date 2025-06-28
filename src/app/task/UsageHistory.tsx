import { History } from "lucide-react";
import { StorageLogInput } from "@/utils/interface";

interface UsageHistoryProps {
  customerHistory: StorageLogInput[] | null;
}

export const UsageHistory = ({ customerHistory }: UsageHistoryProps) => {
  if (!customerHistory || customerHistory.length === 0) return null;

  return (
    <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
      <div className="flex items-center gap-2 mb-2">
        <History className="h-4 w-4 text-blue-600" />
        <span className="text-sm font-medium text-blue-800">
          過去の使用履歴
        </span>
      </div>
      <div className="space-y-1">
        {customerHistory.slice(0, 3).map((log: StorageLogInput, index) => (
          <div key={index} className="text-sm text-blue-700">
            {log.id}
          </div>
        ))}
      </div>
    </div>
  );
};
