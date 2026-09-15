"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, useSortable, arrayMove } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Pencil, Trash2, Copy, Plus, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { deleteSlider, duplicateSlider, reorderSliders, toggleSliderActive } from "@/lib/actions/sliders";
import type { Slider } from "@prisma/client";

function SortableRow({ slider, onDelete, onDuplicate, onToggle }: {
  slider: Slider;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
  onToggle: (id: string, active: boolean) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: slider.id });

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={`flex items-center gap-4 rounded-lg border border-border bg-card p-3 ${isDragging ? "opacity-60" : ""}`}
    >
      <button className="cursor-grab touch-none text-muted-foreground" {...attributes} {...listeners} aria-label="Drag to reorder">
        <GripVertical className="h-5 w-5" />
      </button>
      <div className="relative h-14 w-20 shrink-0 overflow-hidden rounded-md bg-muted">
        {slider.desktopImage && <Image src={slider.desktopImage} alt="" fill className="object-cover" />}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium">{slider.title}</p>
        <p className="truncate text-xs text-muted-foreground">{slider.subtitle}</p>
      </div>
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Switch checked={slider.isActive} onCheckedChange={(v) => onToggle(slider.id, v)} />
        {slider.isActive ? "Active" : "Inactive"}
      </div>
      <div className="flex gap-1">
        <Button asChild variant="ghost" size="icon-sm">
          <Link href="/" target="_blank" aria-label="Preview">
            <Eye className="h-3.5 w-3.5" />
          </Link>
        </Button>
        <Button variant="ghost" size="icon-sm" onClick={() => onDuplicate(slider.id)} aria-label="Duplicate">
          <Copy className="h-3.5 w-3.5" />
        </Button>
        <Button asChild variant="ghost" size="icon-sm">
          <Link href={`/admin/sliders/${slider.id}`} aria-label="Edit">
            <Pencil className="h-3.5 w-3.5" />
          </Link>
        </Button>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="ghost" size="icon-sm" aria-label="Delete">
              <Trash2 className="h-3.5 w-3.5 text-destructive" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete this slide?</AlertDialogTitle>
              <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => onDelete(slider.id)}>Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}

export function SlidersListClient({ initialSliders }: { initialSliders: Slider[] }) {
  const [sliders, setSliders] = useState(initialSliders);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = sliders.findIndex((s) => s.id === active.id);
    const newIndex = sliders.findIndex((s) => s.id === over.id);
    const next = arrayMove(sliders, oldIndex, newIndex);
    setSliders(next);
    await reorderSliders(next.map((s) => s.id));
  }

  async function handleDelete(id: string) {
    const result = await deleteSlider(id);
    if (result.success) {
      setSliders((prev) => prev.filter((s) => s.id !== id));
      toast.success("Slide deleted.");
    } else toast.error(result.message ?? "Failed to delete.");
  }

  async function handleDuplicate(id: string) {
    const result = await duplicateSlider(id);
    if (result.success) {
      toast.success("Slide duplicated.");
      window.location.reload();
    } else toast.error(result.message ?? "Failed to duplicate.");
  }

  async function handleToggle(id: string, active: boolean) {
    setSliders((prev) => prev.map((s) => (s.id === id ? { ...s, isActive: active } : s)));
    await toggleSliderActive(id, active);
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-semibold">Hero Sliders</h1>
          <p className="mt-1 text-sm text-muted-foreground">Drag to reorder. Changes appear on the homepage instantly.</p>
        </div>
        <Button asChild className="rounded-full">
          <Link href="/admin/sliders/new">
            <Plus className="h-4 w-4" /> Add Slide
          </Link>
        </Button>
      </div>

      <div className="mt-6 space-y-2">
        {sliders.length === 0 && (
          <p className="py-10 text-center text-sm text-muted-foreground">No slides yet. Add your first one.</p>
        )}
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={sliders.map((s) => s.id)} strategy={verticalListSortingStrategy}>
            {sliders.map((slider) => (
              <SortableRow
                key={slider.id}
                slider={slider}
                onDelete={handleDelete}
                onDuplicate={handleDuplicate}
                onToggle={handleToggle}
              />
            ))}
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
}
