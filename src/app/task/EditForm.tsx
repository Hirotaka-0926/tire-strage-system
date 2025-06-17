"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Car, Save, Settings } from "lucide-react";
import { TaskInput } from "@/utils/interface";
import { getInspectionData } from "@/utils/supabaseFunction";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Props {
  isMaintenanceDialogOpen: boolean;
  setIsMaintenanceDialogOpen: (open: boolean) => void;
  selectedItem: TaskInput | null;
  setSelectedItem: (item: TaskInput | null) => void;
}

const EditForm = ({
  isMaintenanceDialogOpen,
  setIsMaintenanceDialogOpen,
  selectedItem,
  setSelectedItem,
}: Props) => {
  const [maintenanceFormData, setMaintenanceFormData] =
    useState<TaskInput | null>(selectedItem);

  useEffect(() => {
    const fetchInspectionData = async () => {
      if (selectedItem?.tire_state) {
        const data = await getInspectionData(selectedItem.tire_state);

        setMaintenanceFormData({
          ...selectedItem,
          tire_state: data,
        });
      }
    };
  }, [selectedItem]);

  return (
    <Dialog
      open={isMaintenanceDialogOpen}
      onOpenChange={setIsMaintenanceDialogOpen}
    >
      <DialogContent className="max-w-2xl w-full bg-gray-50">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            整備データ入力
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4 overflow-y-scroll h-[calc(100vh-200px)]">
          {/* 顧客情報 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">
                {"顧客情報"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="font-medium">
                {selectedItem?.client?.client_name}
              </div>
              <div className="text-sm text-gray-600">
                {selectedItem?.car?.car_model}
              </div>
              <div className="text-sm text-gray-600">
                {selectedItem?.car?.car_number}
              </div>
            </CardContent>
          </Card>

          {/* フォーム */}
          <form className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold">
                  タイヤ基礎情報
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>タイヤメーカー</Label>
                    <Input
                      className=""
                      value={maintenanceFormData?.tire_state?.tire_maker}
                    />
                  </div>
                  <div>
                    <Label>タイヤパターン</Label>
                    <Input
                      className=""
                      value={maintenanceFormData?.tire_state?.tire_pattern}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>タイヤサイズ</Label>
                    <Input
                      className=""
                      value={maintenanceFormData?.tire_state?.tire_size}
                    />
                  </div>
                  <div>
                    <Label>製造年</Label>
                    <Input
                      className=""
                      value={maintenanceFormData?.tire_state?.manufacture_year}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>タイヤ状態</Label>
                    <Select>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="タイヤ状態を選択" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5">5mm(良好)</SelectItem>
                        <SelectItem value="4">4mm</SelectItem>
                        <SelectItem value="3">3mm(交換おすすめ)</SelectItem>
                        <SelectItem value="2">2mm</SelectItem>
                        <SelectItem value="1">1mm(交換時期)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>お預かり品</Label>
                    <Input />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 点検・整備項目 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold">
                  点検・整備項目
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="border border-gray-500 rounded-md">
                  <div className="grid grid-cols-1 md:grid-cols-10 gap-2 border-b border-gray-500 p-2 bg-gray-200">
                    <div className="col-span-2">点検項目</div>
                    <div className="col-span-2">状態</div>
                    <div className="col-span-1">交換</div>
                    <div className="col-span-5">備考</div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-10 gap-2 p-2 border-b border-gray-500">
                    <div className="col-span-2">タイヤ</div>
                    <div className="col-span-2">
                      <Input
                        type="number"
                        value={
                          maintenanceFormData?.tire_state?.tire_inspection
                            ?.state || ""
                        }
                      />
                    </div>
                    <div className="col-span-1">
                      <Input
                        type="checkbox"
                        checked={
                          maintenanceFormData?.tire_state?.tire_inspection
                            ?.isExchange || false
                        }
                      />
                    </div>
                    <div className="col-span-5">
                      <Input
                        type="text"
                        value={
                          maintenanceFormData?.tire_state?.tire_inspection
                            ?.note || ""
                        }
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-10 gap-4 p-2 border-b border-gray-500">
                    <div className="col-span-2 text-sm">エンジンオイル</div>
                    <div className="col-span-2">
                      <Input
                        type="number"
                        value={
                          maintenanceFormData?.tire_state?.oil_inspection
                            ?.state || ""
                        }
                      />
                    </div>
                    <div className="col-span-1">
                      <Input
                        type="checkbox"
                        checked={
                          maintenanceFormData?.tire_state?.oil_inspection
                            ?.isExchange || false
                        }
                      />
                    </div>
                    <div className="col-span-5">
                      <Input
                        type="text"
                        value={
                          maintenanceFormData?.tire_state?.oil_inspection
                            ?.note || ""
                        }
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-10 gap-4 p-2 border-b border-gray-500">
                    <div className="col-span-2">バッテリー</div>
                    <div className="col-span-2">
                      <Input
                        type="number"
                        value={
                          maintenanceFormData?.tire_state?.battery_inspection
                            ?.state || ""
                        }
                      />
                    </div>
                    <div className="col-span-1">
                      <Input
                        type="checkbox"
                        checked={
                          maintenanceFormData?.tire_state?.battery_inspection
                            ?.isExchange || false
                        }
                      />
                    </div>
                    <div className="col-span-5">
                      <Input
                        type="text"
                        value={
                          maintenanceFormData?.tire_state?.battery_inspection
                            ?.note || ""
                        }
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-10 gap-4 p-2 border-b border-gray-500">
                    <div className="col-span-2">ワイパーゴム</div>
                    <div className="col-span-2">
                      <Input
                        type="number"
                        value={
                          maintenanceFormData?.tire_state?.wiper_inspection
                            ?.state || ""
                        }
                      />
                    </div>
                    <div className="col-span-1">
                      <Input
                        type="checkbox"
                        checked={
                          maintenanceFormData?.tire_state?.wiper_inspection
                            ?.isExchange || false
                        }
                      />
                    </div>
                    <div className="col-span-5">
                      <Input
                        type="text"
                        value={
                          maintenanceFormData?.tire_state?.wiper_inspection
                            ?.note || ""
                        }
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-10 gap-4 p-2">
                    <div className="col-span-2">その他</div>
                    <div className="col-span-8">
                      <Input
                        type="text"
                        value={
                          maintenanceFormData?.tire_state?.other_inspection ||
                          ""
                        }
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold">メモ</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <div className="flex flex-col gap-2">
                    <Label>車検期日</Label>
                    <Input type="date" />
                  </div>
                  <div className="flex flex-col gap-2 mb-2">
                    <Label>入庫時距離数</Label>
                    <Input type="number" />
                  </div>
                </div>
                <Label className="mt-2">次回のテーマ</Label>
                <Textarea
                  className="mt-2"
                  placeholder="ここにメモを入力してください"
                  rows={4}
                  value={maintenanceFormData?.tire_state?.next_theme || ""}
                  onChange={(e) =>
                    setMaintenanceFormData({
                      ...maintenanceFormData,
                      tire_state: {
                        ...maintenanceFormData.tire_state,
                        next_theme: e.target.value,
                      },
                    })
                  }
                />
              </CardContent>
            </Card>
          </form>

          {/* ボタン */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => setIsMaintenanceDialogOpen(false)}
            >
              キャンセル
            </Button>
            <Button>
              <Save className="h-4 w-4 mr-2" />
              保存
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditForm;
