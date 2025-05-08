import { useStorageToPdf } from "@/hooks/useStorageToPdf";
import { Button } from "@/components/ui/button";
import { StorageLogsToDisplay } from "@/utils/interface";
import React from "react";
import { Printer, Loader2, X } from "lucide-react";

interface Props {
  selectedStorages: StorageLogsToDisplay[];
  setIsConvertPDF: React.Dispatch<React.SetStateAction<boolean>>;
  isConvertPDF: boolean;
  tabText: string;
}

const StoragesToPDF: React.FC<Props> = ({
  selectedStorages,
  setIsConvertPDF,
  isConvertPDF,
  tabText,
}) => {
  const { isLoading, error, renderBlobProvider } = useStorageToPdf();
  if (tabText === "detail") {
    return (
      <Button disabled className="ml-2 flex items-center">
        <Printer className="mr-2 h-4 w-4" />
        PDF出力
      </Button>
    );
  }

  if (error) {
    return (
      <div className="text-red-500">エラーが発生しました: {error.message}</div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center">
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        <span>PDFを生成中...</span>
      </div>
    );
  }

  // PDF選択モードの場合
  if (isConvertPDF) {
    return (
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          onClick={() => setIsConvertPDF(false)}
          className="flex items-center"
        >
          <X className="mr-2 h-4 w-4" />
          キャンセル
        </Button>

        {selectedStorages.length > 0 ? (
          renderBlobProvider(selectedStorages, ({ url, loading, error }) => {
            if (loading) {
              return (
                <Button disabled className="flex items-center">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  PDF生成中...
                </Button>
              );
            }

            if (error) {
              return (
                <div className="text-red-500">
                  エラーが発生しました: {error.message}
                </div>
              );
            }

            return (
              <Button
                onClick={() => window.open(url!, "_blank")}
                className="flex items-center"
              >
                <Printer className="mr-2 h-4 w-4" />
                {`PDFを表示 (${selectedStorages.length}件)`}
              </Button>
            );
          })
        ) : (
          <Button disabled className="flex items-center">
            <Printer className="mr-2 h-4 w-4" />
            保管庫を選択してください
          </Button>
        )}
      </div>
    );
  }

  // 通常モード
  return (
    <Button
      onClick={() => setIsConvertPDF(true)}
      className="ml-2 flex items-center"
    >
      <Printer className="mr-2 h-4 w-4" />
      PDF出力
    </Button>
  );
};

export default StoragesToPDF;
