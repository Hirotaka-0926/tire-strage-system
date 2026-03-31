"use client";

import { GroupedPitTasks } from "@/app/domain/type/pit";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PitStatusCardsProps {
  groupedTasks: GroupedPitTasks;
}

const PitStatusCards = ({ groupedTasks }: PitStatusCardsProps) => {
  return (
    <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle>整備データ未入力</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">{groupedTasks.incomplete.length}件</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>保管庫ID未入力</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">{groupedTasks.pending.length}件</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>整備完了</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">{groupedTasks.complete.length}件</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default PitStatusCards;
