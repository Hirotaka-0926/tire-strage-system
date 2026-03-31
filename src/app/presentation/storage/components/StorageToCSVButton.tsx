import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useStorageToCsv } from "@/app/presentation/storage/hooks/useStorageToCsv";

const StorageToCSVButton = () => {
  const { downloadAllStoragesCSV } = useStorageToCsv();

  return (
    <Button
      className="bg-green-500 text-sm hover:bg-green-600"
      onClick={() => downloadAllStoragesCSV()}
    >
      <Download className="mr-2 h-4 w-4" />
      CSVにエクスポート
    </Button>
  );
};

export default StorageToCSVButton;
