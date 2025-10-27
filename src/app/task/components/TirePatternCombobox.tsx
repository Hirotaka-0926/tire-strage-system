"use client";

import { useEffect, useMemo, useState } from "react";
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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Check, ChevronsUpDown, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { getTirePatternsFromPrice } from "@/utils/supabaseFunction";

type Props = {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  label?: string;
};

const TirePatternCombobox = ({ value, onChange, disabled, label = "タイヤパターン" }: Props) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [options, setOptions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const list = await getTirePatternsFromPrice();
        if (mounted) setOptions(list);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options;
    return options.filter((o) => o.toLowerCase().includes(q));
  }, [options, query]);

  const handleSelect = (v: string) => {
    onChange(v);
    setOpen(false);
    setQuery("");
  };

  const showCreate = query.trim().length > 0 && !options.some((o) => o.toLowerCase() === query.trim().toLowerCase());

  return (
    <div>
      <Label>{label}</Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
            disabled={disabled}
          >
            {value || (loading ? "読込中..." : "選択または入力...")}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[400px] p-0">
          <Command>
            <CommandInput
              placeholder="パターンを検索..."
              value={query}
              onValueChange={setQuery}
            />
            <CommandList>
              <CommandEmpty>候補が見つかりません</CommandEmpty>
              {showCreate && (
                <CommandGroup heading="新規入力">
                  <CommandItem value={query} onSelect={() => handleSelect(query)}>
                    <Plus className="mr-2 h-4 w-4" />
                    このまま使用: {query}
                  </CommandItem>
                </CommandGroup>
              )}
              <CommandGroup heading="候補">
                {filtered.map((opt) => (
                  <CommandItem key={opt} value={opt} onSelect={() => handleSelect(opt)}>
                    <Check className={cn("mr-2 h-4 w-4", value === opt ? "opacity-100" : "opacity-0")} />
                    {opt}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default TirePatternCombobox;

