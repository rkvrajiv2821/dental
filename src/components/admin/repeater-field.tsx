"use client";

import { useFieldArray, type Control, type FieldValues, type ArrayPath } from "react-hook-form";
import { Plus, Trash2, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";

export function RepeaterField<T extends FieldValues>({
  control,
  name,
  label,
  newItem,
  renderItem,
}: {
  control: Control<T>;
  name: ArrayPath<T>;
  label: string;
  newItem: Record<string, unknown>;
  renderItem: (index: number) => React.ReactNode;
}) {
  const { fields, append, remove } = useFieldArray({ control, name });

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium">{label}</p>
        <Button type="button" variant="outline" size="sm" onClick={() => append(newItem as never)}>
          <Plus className="h-3.5 w-3.5" /> Add
        </Button>
      </div>
      <div className="space-y-3">
        {fields.map((field, index) => (
          <div key={field.id} className="flex gap-2 rounded-lg border border-border p-3">
            <GripVertical className="mt-2 h-4 w-4 shrink-0 text-muted-foreground" />
            <div className="flex-1 space-y-2">{renderItem(index)}</div>
            <Button type="button" variant="ghost" size="icon-sm" onClick={() => remove(index)} aria-label="Remove">
              <Trash2 className="h-3.5 w-3.5 text-destructive" />
            </Button>
          </div>
        ))}
        {fields.length === 0 && <p className="text-xs text-muted-foreground">Nothing added yet.</p>}
      </div>
    </div>
  );
}
