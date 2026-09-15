"use client";

import { useState } from "react";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function MultiSelect({
  options,
  value,
  onChange,
  placeholder = "Select…",
}: {
  options: { id: string; label: string }[];
  value: string[] | undefined;
  onChange: (ids: string[]) => void;
  placeholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const safeValue = value ?? [];
  const selected = options.filter((o) => safeValue.includes(o.id));

  function toggle(id: string) {
    onChange(safeValue.includes(id) ? safeValue.filter((v) => v !== id) : [...safeValue, id]);
  }

  return (
    <div className="space-y-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button type="button" variant="outline" role="combobox" className="w-full justify-between font-normal">
            {selected.length > 0 ? `${selected.length} selected` : placeholder}
            <ChevronsUpDown className="h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[--radix-popover-trigger-width] p-1" align="start">
          <div className="max-h-64 overflow-y-auto">
            {options.length === 0 && <p className="p-3 text-sm text-muted-foreground">No options available.</p>}
            {options.map((option) => (
              <button
                type="button"
                key={option.id}
                onClick={() => toggle(option.id)}
                className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm hover:bg-muted"
              >
                <span
                  className={cn(
                    "flex h-4 w-4 items-center justify-center rounded border border-border",
                    safeValue.includes(option.id) && "border-primary bg-primary text-primary-foreground"
                  )}
                >
                  {safeValue.includes(option.id) && <Check className="h-3 w-3" />}
                </span>
                {option.label}
              </button>
            ))}
          </div>
        </PopoverContent>
      </Popover>
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {selected.map((s) => (
            <Badge key={s.id} variant="secondary" className="gap-1 font-normal">
              {s.label}
              <button type="button" onClick={() => toggle(s.id)} aria-label={`Remove ${s.label}`}>
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
