import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useStorageToCSV } from "@/utils/hooks/useStorageToCSV";

const StorageToCSVButton = () => {
  const { downloadAllStoragesCSV } = useStorageToCSV();
  return (
    <Button
      className="text-sm bg-green-500 hover:bg-green-600"
      onClick={() => downloadAllStoragesCSV()}
    >
      <Download className="w-4 h-4 mr-2" />
      CSVにエクスポート
    </Button>
  );
};

export default StorageToCSVButton;
