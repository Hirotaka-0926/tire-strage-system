"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TaskInput } from "@/utils/interface";
import { Label } from "@/components/ui/label";

interface InspectionInfoCardProps {
  selectedItem: TaskInput | null;
}

const InspectionInfoCard = ({ selectedItem }: InspectionInfoCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">タイヤ基礎情報</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label>タイヤメーカー</Label>
            <div className="text-lg font-medium">
              {selectedItem?.tire_state?.tire_maker || "未設定"}
            </div>
          </div>

          <div>
            <Label>タイヤパターン</Label>
            <div className="text-lg font-medium">
              {selectedItem?.tire_state?.tire_pattern || "未設定"}
            </div>
          </div>
        </div>

        <div>
          <Label>タイヤサイズ</Label>
          <div className="text-lg font-medium">
            {selectedItem?.tire_state?.tire_size || "未設定"}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default InspectionInfoCard;
