"use client";

import { PitTaskInput } from "@/app/domain/type/pit";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PitCustomerInfoCardProps {
  selectedTask: PitTaskInput | null;
}

const PitCustomerInfoCard = ({ selectedTask }: PitCustomerInfoCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">顧客情報</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="font-medium">
          {selectedTask?.client?.client_name || "未設定"}
        </div>
        <div className="text-sm text-gray-600">
          {selectedTask?.car?.car_model || "未設定"}
        </div>
        <div className="text-sm text-gray-600">
          {selectedTask?.car?.car_number || "未設定"}
        </div>
      </CardContent>
    </Card>
  );
};

export default PitCustomerInfoCard;
