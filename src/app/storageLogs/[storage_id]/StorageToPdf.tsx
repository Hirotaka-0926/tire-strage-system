"use client";
import React from "react";
import { StorageLogsToDisplay } from "@/utils/interface";
import { Button } from "@/components/ui/button";
import { useStorageToPdf } from "@/hooks/useStorageToPdf"; // 拡張子を明示的に指定
import { Loader2, FileDown } from "lucide-react";

interface Props {
  storage: StorageLogsToDisplay;
  className?: string;
}

const StorageToPdf: React.FC<Props> = ({ storage, className }) => {
  const { isLoading, error, renderBlobProvider } = useStorageToPdf();

  if (isLoading) {
    return (
      <div className={`flex items-center ${className}`}>
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        <span>フォントを読み込み中...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`text-red-500 ${className}`}>
        エラーが発生しました: {error.message}
      </div>
    );
  }

  return (
    <div className={className}>
      {renderBlobProvider(storage, ({ url, loading, error }) => {
        if (loading)
          return (
            <Button disabled>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              PDF生成中...
            </Button>
          );

        if (error)
          return (
            <div className="text-red-500">
              エラーが発生しました: {error.message}
            </div>
          );

        return (
          <Button onClick={() => window.open(url!, "_blank")}>
            <FileDown className="mr-2 h-4 w-4" />
            PDFを表示
          </Button>
        );
      })}
    </div>
  );
};

export default StorageToPdf;
