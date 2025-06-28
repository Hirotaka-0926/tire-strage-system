import { AlertTriangle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { StorageInput } from "@/utils/interface";

interface OverwriteWarningProps {
  show: boolean;
  selectedStorage: StorageInput | null;
}

export const OverwriteWarning = ({
  show,
  selectedStorage,
}: OverwriteWarningProps) => {
  if (!show || !selectedStorage) return null;

  return (
    <Alert className="border-orange-200 bg-orange-50">
      <AlertTriangle className="h-4 w-4 text-orange-600" />
      <AlertDescription className="text-orange-800">
        <div className="font-medium mb-1">この保管庫は現在使用中です</div>
        <div className="text-sm">
          <div>
            使用者: {selectedStorage.client?.client_name || "使用者はいません"}
          </div>
          <div>
            車両: {selectedStorage.car?.car_number || "車両はありません"}
          </div>
        </div>
        <div className="text-sm mt-2 font-medium">
          割り当てを続行すると上書きされます。
        </div>
      </AlertDescription>
    </Alert>
  );
};
