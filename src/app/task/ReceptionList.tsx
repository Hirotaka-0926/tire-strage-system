import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TaskInput } from "@/utils/interface";

interface Props {
  tasks: TaskInput[];
}

const ReceptionList = ({ tasks }: Props) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold">受付済み作業一覧</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        {/* ここに作業予約の一覧を表示するコンポーネントを追加 */}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">受付No.</TableHead>
                <TableHead className="w-[100px]">受付日時</TableHead>
                <TableHead className="w-[100px]">顧客名</TableHead>
                <TableHead className="w-[100px]">車両番号</TableHead>
                <TableHead className="w-[100px]">車種</TableHead>
                <TableHead className="w-[100px]">受付時間</TableHead>
                <TableHead className="w-[100px]">保管庫ID</TableHead>
                <TableHead className="w-[100px]">ステータス</TableHead>
                <TableHead className="w-[100px]">操作</TableHead>
              </TableRow>
              <TableBody></TableBody>
            </TableHeader>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReceptionList;
