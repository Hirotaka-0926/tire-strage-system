"use client";

import { useState } from "react";
import { FileText, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useStorageToPdf } from "@/utils/hooks/useStorageToPdf";
import type { StorageLogInput } from "@/utils/interface";

interface PDFPreviewModalProps {
  storageData: StorageLogInput;
  fileName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const PDFPreviewModal = ({
  storageData,
  fileName,
  open,
  onOpenChange,
}: PDFPreviewModalProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { renderBlobProvider } = useStorageToPdf();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto w-[95vw] sm:w-[90vw]">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <FileText className="w-5 h-5 mr-2" />
            PDFプレビュー
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {renderBlobProvider(storageData, ({ blob, url, loading, error }) => (
            <div className="space-y-4">
              {loading && (
                <div className="text-center py-8">
                  <p>PDFを生成中...</p>
                </div>
              )}

              {error && (
                <div className="text-center py-8 text-red-500">
                  <p>PDFの生成に失敗しました: {error.message}</p>
                </div>
              )}

              {url && !loading && !error && (
                <>
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-gray-600">PDFプレビュー</p>
                    <Button
                      size="default"
                      className="h-10 text-sm font-medium touch-manipulation"
                      onClick={() => {
                        const a = document.createElement("a");
                        a.href = url;
                        a.download = fileName;
                        a.click();
                      }}
                      disabled={!url}
                    >
                      <Download className="w-4 h-4 mr-1" />
                      ダウンロード
                    </Button>
                  </div>

                  <div className="border rounded-lg overflow-hidden">
                    <iframe
                      src={url}
                      width="100%"
                      height="500px"
                      title="PDF Preview"
                      className="border-none rounded-lg"
                    />
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};
