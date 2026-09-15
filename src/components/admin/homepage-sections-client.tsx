"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
import { GripVertical, Pencil, Trash2, Copy, Plus, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { SectionFormDialog } from "./section-form";
import { deleteSection, duplicateSection, reorderSections, toggleSectionVisibility } from "@/lib/actions/homepage";
import type { PageSection } from "@prisma/client";

const TYPE_LABELS: Record<string, string> = {
  HERO_SLIDER: "Hero Slider",
  STATISTICS: "Statistics",
  TEXT_IMAGE: "Text + Image",
  TREATMENTS: "Treatments",
  DOCTORS: "Doctors",
  TESTIMONIALS: "Testimonials",
  GALLERY: "Smile Gallery",
  VIDEO: "Video",
  PARALLAX_IMAGE: "Parallax Image",
  THREE_D: "3D Section",
  FAQ: "FAQ",
  CTA: "Call To Action",
  BLOG: "Blog",
};

function SortableRow({
  section,
  onEdit,
  onDelete,
  onDuplicate,
  onToggle,
}: {
  section: PageSection;
  onEdit: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onToggle: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: section.id });

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={`flex items-center gap-4 rounded-lg border border-border bg-card p-3 ${isDragging ? "opacity-60" : ""} ${!section.isVisible ? "opacity-50" : ""}`}
    >
      <button className="cursor-grab touch-none text-muted-foreground" {...attributes} {...listeners} aria-label="Drag to reorder">
        <GripVertical className="h-5 w-5" />
      </button>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-semibold uppercase tracking-wide text-primary">{TYPE_LABELS[section.type]}</p>
        <p className="truncate font-medium">{section.title || <span className="text-muted-foreground">Untitled</span>}</p>
      </div>
      <div className="flex gap-1">
        <Button variant="ghost" size="icon-sm" onClick={onToggle} aria-label={section.isVisible ? "Hide" : "Show"}>
          {section.isVisible ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
        </Button>
        <Button variant="ghost" size="icon-sm" onClick={onDuplicate} aria-label="Duplicate">
          <Copy className="h-3.5 w-3.5" />
        </Button>
        <Button variant="ghost" size="icon-sm" onClick={onEdit} aria-label="Edit">
          <Pencil className="h-3.5 w-3.5" />
        </Button>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="ghost" size="icon-sm" aria-label="Delete">
              <Trash2 className="h-3.5 w-3.5 text-destructive" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete this section?</AlertDialogTitle>
              <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={onDelete}>Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}

export function HomepageSectionsClient({ initialSections }: { initialSections: PageSection[] }) {
  const router = useRouter();
  const [sections, setSections] = useState(initialSections);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<PageSection | undefined>();
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  function refresh() {
    router.refresh();
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = sections.findIndex((s) => s.id === active.id);
    const newIndex = sections.findIndex((s) => s.id === over.id);
    const next = arrayMove(sections, oldIndex, newIndex);
    setSections(next);
    await reorderSections(next.map((s) => s.id));
  }

  async function handleDelete(id: string) {
    const result = await deleteSection(id);
    if (result.success) {
      setSections((prev) => prev.filter((s) => s.id !== id));
      toast.success("Section deleted.");
    } else toast.error("Failed to delete.");
  }

  async function handleDuplicate(id: string) {
    const result = await duplicateSection(id);
    if (result.success) {
      toast.success("Section duplicated.");
      refresh();
      window.location.reload();
    } else toast.error("Failed to duplicate.");
  }

  async function handleToggle(id: string, current: boolean) {
    setSections((prev) => prev.map((s) => (s.id === id ? { ...s, isVisible: !current } : s)));
    await toggleSectionVisibility(id, !current);
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-semibold">Homepage Sections</h1>
          <p className="mt-1 text-sm text-muted-foreground">Add, reorder, show/hide and edit each block of your homepage.</p>
        </div>
        <Button
          onClick={() => {
            setEditing(undefined);
            setDialogOpen(true);
          }}
        >
          <Plus className="h-4 w-4" /> Add Section
        </Button>
      </div>

      <div className="mt-6 space-y-2">
        {sections.length === 0 && <p className="py-10 text-center text-sm text-muted-foreground">No sections yet.</p>}
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={sections.map((s) => s.id)} strategy={verticalListSortingStrategy}>
            {sections.map((section) => (
              <SortableRow
                key={section.id}
                section={section}
                onEdit={() => {
                  setEditing(section);
                  setDialogOpen(true);
                }}
                onDelete={() => handleDelete(section.id)}
                onDuplicate={() => handleDuplicate(section.id)}
                onToggle={() => handleToggle(section.id, section.isVisible)}
              />
            ))}
          </SortableContext>
        </DndContext>
      </div>

      <SectionFormDialog open={dialogOpen} onOpenChange={setDialogOpen} section={editing} onSaved={refresh} />
    </div>
  );
}
