"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MapPin, Save } from "lucide-react";
import { TaskInput, StorageInput } from "@/utils/interface";
import useAssignStorage from "@/utils/hooks/useAssignStorage";

// 分割したコンポーネントをインポート
import { CustomerInfo } from "./CustomerInfo";
import { UsageHistory } from "./UsageHistory";
import { OverwriteWarning } from "./OverWriteWarning";
import { StorageCombobox } from "./StorageCombobox";

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
  selectedItem: TaskInput | null;
  onAssigned?: (storageId: string) => void;
}

const AssignStorageDialog = ({
  open,
  setOpen,
  selectedItem,
  onAssigned,
}: Props) => {
  const [selectedStorage, setSelectedStorage] = useState<StorageInput | null>(
    null
  );
  const [showOverwriteWarning, setShowOverwriteWarning] = useState(false);

  const { embeddedOptions, emptyOptions, assignStorage, customerHistory } =
    useAssignStorage(open, selectedItem?.client?.id || null);

  const handleAssign = async () => {
    if (!selectedStorage || !selectedItem) return;
    await assignStorage(selectedItem, selectedStorage.id!);
    onAssigned?.(selectedStorage.id!);
    handleClose();
  };

  const handleSelectStorage = (storageId: string) => {
    if (storageId.endsWith("-header")) return;

    const foundStorage =
      emptyOptions.find((s) => s.id === storageId) ||
      embeddedOptions.find((s) => s.id === storageId);

    if (!foundStorage) return;

    const isOccupied = embeddedOptions.find((s) => s.id === storageId);
    setShowOverwriteWarning(!!isOccupied);
    setSelectedStorage(foundStorage);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedStorage(null);
    setShowOverwriteWarning(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            保管庫割当
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <CustomerInfo selectedItem={selectedItem} />

          <UsageHistory
            customerHistory={customerHistory ? customerHistory : null}
          />

          <OverwriteWarning
            show={showOverwriteWarning}
            selectedStorage={selectedStorage}
          />

          <StorageCombobox
            selectedStorage={selectedStorage}
            emptyOptions={emptyOptions}
            embeddedOptions={embeddedOptions}
            customerHistory={customerHistory ? customerHistory : null}
            onSelect={handleSelectStorage}
          />

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={handleClose}>
              キャンセル
            </Button>
            <Button
              disabled={!selectedStorage}
              variant={showOverwriteWarning ? "destructive" : "default"}
              onClick={handleAssign}
            >
              <Save className="h-4 w-4 mr-2" />
              {showOverwriteWarning ? "上書き割当" : "割当"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AssignStorageDialog;
