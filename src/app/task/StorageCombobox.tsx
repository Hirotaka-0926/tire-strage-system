import { useState } from "react";
import { Check, ChevronsUpDown, History, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { StorageInput, StorageLogInput } from "@/utils/interface";

interface StorageComboboxProps {
  selectedStorage: StorageInput | null;
  emptyOptions: StorageInput[];
  embeddedOptions: StorageInput[];
  customerHistory: StorageLogInput[] | null;
  onSelect: (storageId: string) => void;
}

export const StorageCombobox = ({
  selectedStorage,
  emptyOptions,
  embeddedOptions,
  customerHistory,
  onSelect,
}: StorageComboboxProps) => {
  const [open, setOpen] = useState(false);

  const handleSelect = (storageId: string) => {
    onSelect(storageId);
    setOpen(false);
  };

  return (
    <div>
      <Label>保管庫ID</Label>
      <Popover open={open} onOpenChange={setOpen} modal>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            {selectedStorage?.id || "保管庫を選択..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[400px] p-0">
          <Command>
            <CommandInput placeholder="保管庫IDを検索..." />
            <CommandList>
              <CommandEmpty>該当する保管庫が見つかりません。</CommandEmpty>

              {/* 過去の使用履歴 */}
              {customerHistory && customerHistory.length > 0 && (
                <CommandGroup heading="📝 過去の使用履歴">
                  {customerHistory.map((storage, index) => {
                    if (!storage.id) return null;
                    return (
                      <CommandItem
                        key={`history-${storage.id}-${index}`}
                        value={storage.storage.id}
                        onSelect={() => handleSelect(storage.storage.id!)}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            selectedStorage?.id === storage.storage.id
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                        <History className="mr-2 h-4 w-4 text-blue-500" />
                        {storage.id}
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
              )}

              {/* 利用可能な保管庫 */}
              <CommandGroup heading="✅ 利用可能な保管庫">
                {emptyOptions
                  .filter(
                    (storage) =>
                      !customerHistory
                        ?.map((s) => s.storage.id)
                        .includes(storage.id!)
                  )
                  .map((storage) => {
                    if (!storage.id) return null;
                    return (
                      <CommandItem
                        key={`empty-${storage.id}`}
                        value={storage.id}
                        onSelect={() => handleSelect(storage.id!)}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            selectedStorage?.id === storage.id
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                        {storage.id}
                      </CommandItem>
                    );
                  })}
              </CommandGroup>

              {/* 使用中の保管庫 */}
              <CommandGroup heading="⚠️ 使用中の保管庫">
                {embeddedOptions
                  .filter(
                    (storage) =>
                      !customerHistory
                        ?.map((log) => log.storage.id)
                        .includes(storage.id!)
                  )
                  .map((storage) => {
                    if (!storage.id) return null;
                    return (
                      <CommandItem
                        key={`embedded-${storage.id}`}
                        value={storage.id}
                        onSelect={() => handleSelect(storage.id!)}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            selectedStorage?.id === storage.id
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                        <User className="mr-2 h-4 w-4 text-orange-500" />
                        {storage.id} (使用中)
                      </CommandItem>
                    );
                  })}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      <p className="text-sm text-gray-500 mt-1">
        利用可能: {emptyOptions.length}箇所 / 使用中: {embeddedOptions.length}
        箇所
        {customerHistory && customerHistory.length > 0 && (
          <span className="text-blue-600">
            {" "}
            (履歴: {customerHistory.length}箇所)
          </span>
        )}
      </p>
    </div>
  );
};
