"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Check, ChevronsUpDown, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { TaskInput } from "@/utils/interface";

import useAssignStorage from "@/utils/hooks/useAssignStorage";


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
  const [selectedStorageId, setSelectedStorageId] = useState("");
  const [comboboxOpen, setComboboxOpen] = useState(false);
  const { options, assignStorage, loading } = useAssignStorage();

  const handleAssign = async () => {
    if (!selectedStorageId || !selectedItem) return;
    await assignStorage(selectedItem, selectedStorageId);
    onAssigned?.(selectedStorageId);

    setSelectedStorageId("");
    setOpen(false);
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

        {selectedItem && (
          <div className="p-3 bg-gray-50 rounded-lg">
            <div className="font-medium">
              {selectedItem.client?.client_name}
            </div>
            <div className="text-sm text-gray-600">
              {selectedItem.car?.car_number}
            </div>
          </div>
        )}

        <div className="space-y-2">
          <Label>保管庫ID</Label>
          <Popover open={comboboxOpen} onOpenChange={setComboboxOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={comboboxOpen}
                className="w-full justify-between"
              >
                {selectedStorageId || "保管庫を選択..."}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
              <Command>
                <CommandInput placeholder="保管庫IDを検索..." />
                <CommandList>
                  <CommandEmpty>該当する保管庫が見つかりません。</CommandEmpty>
                  <CommandGroup>

                    {options.map((id) => (


                      <CommandItem
                        key={id}
                        value={id}
                        onSelect={(currentValue) => {
                          setSelectedStorageId(
                            currentValue === selectedStorageId ? "" : currentValue
                          );
                          setComboboxOpen(false);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            selectedStorageId === id ? "opacity-100" : "opacity-0"
                          )}
                        />
                        <span className="font-mono">{id}</span>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={() => setOpen(false)}>
            キャンセル
          </Button>

          <Button onClick={handleAssign} disabled={!selectedStorageId || loading}>


            割当
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AssignStorageDialog;
