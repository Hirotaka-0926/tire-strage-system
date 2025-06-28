import { TaskInput } from "@/utils/interface";

interface CustomerInfoProps {
  selectedItem: TaskInput | null;
}

export const CustomerInfo = ({ selectedItem }: CustomerInfoProps) => {
  return (
    <div className="p-3 bg-gray-50 rounded-lg">
      <div className="font-medium">{selectedItem?.client?.client_name}</div>
      <div className="text-sm text-gray-600">
        {selectedItem?.car?.car_number || "未登録"}
      </div>
    </div>
  );
};
