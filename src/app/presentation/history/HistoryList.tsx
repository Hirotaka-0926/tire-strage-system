import { HistoryListItem } from "@/app/domain/type/history";
import HistoryTable from "@/app/presentation/history/components/HistoryTable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { History } from "lucide-react";

interface HistoryListProps {
  items: HistoryListItem[];
}

const HistoryList = ({ items }: HistoryListProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <History className="h-5 w-5" />
          履歴リスト ({items.length}件)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <HistoryTable items={items} />
      </CardContent>
    </Card>
  );
};

export default HistoryList;
