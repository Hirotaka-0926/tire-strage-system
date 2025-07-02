import { TaskInput } from "@/utils/interface";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
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
import useSaveTask from "@/utils/hooks/useSaveTask";
import { OverwriteWarning } from "./OverWriteWarning";

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
  selectedData: TaskInput | null;
  onSave: () => void;
  setNotification: React.Dispatch<
    React.SetStateAction<{
      type: "error" | "success" | "info";
      message: string;
    } | null>
  >;
}

const SaveTaskDialog = ({
  open,
  setOpen,
  selectedData,
  onSave,
  setNotification,
}: Props) => {
  const { saveTaskData, prevStorage } = useSaveTask(selectedData);
  if (!selectedData) return null;

  const formatDate = (date?: Date | string) => {
    if (!date) return "-";
    const d = typeof date === "string" ? new Date(date) : date;
    return d.toLocaleDateString();
  };

  const handleOnSave = async () => {
    if (!selectedData) return;
    const message = await saveTaskData();
    setNotification(message);
    onSave();
  };

  const close = () => setOpen(false);

  return (
    <Dialog open={open} onOpenChange={setOpen} modal>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto bg-gray-50">
        <DialogHeader>
          <DialogTitle>以下のデータを保管庫に保存しますか？</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/*保管庫情報 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">
                保管庫情報
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mt-4">
                <p className="text-sm text-gray-600">保管庫ID</p>
                <p className="font-bold text-xl">
                  {selectedData.storage_id ?? "-"}
                </p>
              </div>

              <OverwriteWarning selectedStorage={prevStorage} show={open} />
            </CardContent>
          </Card>
          {/* 顧客情報 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">顧客情報</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">顧客名</p>
                <p className="font-medium">
                  {selectedData.client?.client_name || "-"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">電話番号</p>
                <p className="font-medium">
                  {selectedData.client?.phone || "-"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">車種</p>
                <p className="font-medium">
                  {selectedData.car?.car_model || "-"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">車ナンバー</p>
                <p className="font-medium">
                  {selectedData.car?.car_number || "-"}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* タイヤ基礎情報 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">
                タイヤ基礎情報
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">タイヤメーカー</p>
                <p className="font-medium">
                  {selectedData.tire_state?.tire_maker || "-"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">パターン</p>
                <p className="font-medium">
                  {selectedData.tire_state?.tire_pattern || "-"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">サイズ</p>
                <p className="font-medium">
                  {selectedData.tire_state?.tire_size || "-"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">製造年</p>
                <p className="font-medium">
                  {selectedData.tire_state?.manufacture_year ?? "-"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">エアプレッシャー</p>
                <p className="font-medium">
                  {selectedData.tire_state?.air_pressure ?? "-"}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* 整備項目 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">整備項目</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-32">項目</TableHead>
                    <TableHead>状態</TableHead>
                    <TableHead>交換</TableHead>
                    <TableHead>備考</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[
                    {
                      label: "タイヤ",
                      data: selectedData.tire_state?.tire_inspection,
                    },
                    {
                      label: "ワイパーゴム",
                      data: selectedData.tire_state?.wiper_inspection,
                    },
                    {
                      label: "エンジンオイル",
                      data: selectedData.tire_state?.oil_inspection,
                    },
                    {
                      label: "バッテリー",
                      data: selectedData.tire_state?.battery_inspection,
                    },
                  ].map((row) => (
                    <TableRow key={row.label}>
                      <TableCell className="font-medium">{row.label}</TableCell>
                      <TableCell>{row.data?.state || "-"}</TableCell>
                      <TableCell>
                        {row.data
                          ? row.data.is_exchange
                            ? "交換済"
                            : "未交換"
                          : "-"}
                      </TableCell>
                      <TableCell>{row.data?.note || "-"}</TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell className="font-medium">その他</TableCell>
                    <TableCell>-</TableCell>
                    <TableCell>-</TableCell>
                    <TableCell>
                      {selectedData.tire_state?.other_inspection || "-"}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* 重要情報 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">重要情報</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-600">走行距離数</p>
                <p className="font-medium">
                  {selectedData.tire_state?.drive_distance ?? "-"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">車検日</p>
                <p className="font-medium">
                  {formatDate(selectedData.tire_state?.inspection_date)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">次回のテーマ</p>
                <p className="font-medium">
                  {selectedData.tire_state?.next_theme || "-"}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <DialogFooter className="pt-4">
          <Button variant="outline" onClick={close}>
            キャンセル
          </Button>
          <Button onClick={handleOnSave}>保存</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SaveTaskDialog;
