"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TaskInput } from "@/utils/interface";

interface CustomerInfoCardProps {
  selectedItem: TaskInput | null;
}

const CustomerInfoCard = ({ selectedItem }: CustomerInfoCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">顧客情報</CardTitle>
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
  );
};

export default CustomerInfoCard;