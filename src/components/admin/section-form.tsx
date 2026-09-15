"use client";

/**
 * PageSection.content is a free-form JSON blob whose shape depends on the selected section type
 * (see the Prisma schema and SectionRenderer on the public site) — it can't be statically typed
 * against react-hook-form's `Path<T>`, so the per-type field components below bind dynamic
 * `content.*` paths through loosely-typed `register`/`control` props by design.
 */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";
import { createSection, updateSection } from "@/lib/actions/homepage";
import { ImagePicker } from "./image-picker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import type { PageSection, SectionType } from "@prisma/client";

const SECTION_TYPES: { value: SectionType; label: string }[] = [
  { value: "HERO_SLIDER", label: "Hero Slider (uses Hero Sliders module)" },
  { value: "STATISTICS", label: "Statistics" },
  { value: "TEXT_IMAGE", label: "Text + Image" },
  { value: "TREATMENTS", label: "Treatments" },
  { value: "DOCTORS", label: "Doctors" },
  { value: "TESTIMONIALS", label: "Testimonials" },
  { value: "GALLERY", label: "Smile Gallery" },
  { value: "VIDEO", label: "Video" },
  { value: "PARALLAX_IMAGE", label: "Parallax Image" },
  { value: "THREE_D", label: "3D Section" },
  { value: "FAQ", label: "FAQ" },
  { value: "CTA", label: "Call To Action" },
  { value: "BLOG", label: "Blog" },
];

type FormValues = {
  type: SectionType;
  title: string;
  subtitle: string;
  isVisible: boolean;
  content: Record<string, unknown>;
};

type SectionFieldsProps = {
  control: any;
  register: any;
};

function StatisticsFields({ control, register }: SectionFieldsProps) {
  const { fields, append, remove } = useFieldArray({ control, name: "content.items" });
  return (
    <div className="space-y-2">
      <Label>Stat Items</Label>
      {fields.map((f: any, i: number) => (
        <div key={f.id} className="flex gap-2">
          <Input placeholder="Label" {...register(`content.items.${i}.label`)} />
          <Input type="number" placeholder="Value" {...register(`content.items.${i}.value`, { valueAsNumber: true })} />
          <Input placeholder="Suffix" className="w-20" {...register(`content.items.${i}.suffix`)} />
          <Button type="button" variant="ghost" size="icon-sm" onClick={() => remove(i)}>
            <Trash2 className="h-3.5 w-3.5 text-destructive" />
          </Button>
        </div>
      ))}
      <Button type="button" variant="outline" size="sm" onClick={() => append({ label: "", value: 0, suffix: "" })}>
        <Plus className="h-3.5 w-3.5" /> Add Stat
      </Button>
    </div>
  );
}

function TextImageFields({ control, register }: SectionFieldsProps) {
  return (
    <>
      <div className="space-y-2">
        <Label>Body Text</Label>
        <Textarea rows={3} {...register("content.body")} />
      </div>
      <Controller control={control} name="content.image" render={({ field }) => <ImagePicker label="Image" value={field.value} onChange={field.onChange} folder="homepage" />} />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>CTA Text</Label>
          <Input {...register("content.ctaText")} />
        </div>
        <div className="space-y-2">
          <Label>CTA URL</Label>
          <Input {...register("content.ctaUrl")} />
        </div>
      </div>
      <div className="space-y-2">
        <Label>Image Position</Label>
        <Controller
          control={control}
          name="content.imagePosition"
          render={({ field }) => (
            <Select value={field.value ?? "right"} onValueChange={field.onChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="right">Right</SelectItem>
                <SelectItem value="left">Left</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
      </div>
    </>
  );
}

function LimitField({ register, label = "Number of items to show" }: SectionFieldsProps & { label?: string }) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Input type="number" {...register("content.limit", { valueAsNumber: true })} />
    </div>
  );
}

function CTAFields({ register }: SectionFieldsProps) {
  return (
    <>
      <div className="space-y-2">
        <Label>Heading</Label>
        <Input {...register("content.title")} />
      </div>
      <div className="space-y-2">
        <Label>Subtitle</Label>
        <Input {...register("content.subtitle")} />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>CTA Text</Label>
          <Input {...register("content.ctaText")} />
        </div>
        <div className="space-y-2">
          <Label>CTA URL</Label>
          <Input {...register("content.ctaUrl")} />
        </div>
      </div>
    </>
  );
}

function VideoFields({ register }: SectionFieldsProps) {
  return (
    <div className="space-y-2">
      <Label>Video URL</Label>
      <Input {...register("content.url")} placeholder="https://youtube.com/watch?v=…" />
    </div>
  );
}

function ParallaxFields({ control, register }: SectionFieldsProps) {
  return (
    <>
      <Controller control={control} name="content.image" render={({ field }) => <ImagePicker label="Background Image" value={field.value} onChange={field.onChange} folder="homepage" />} />
      <div className="space-y-2">
        <Label>Caption</Label>
        <Input {...register("content.caption")} />
      </div>
    </>
  );
}

function ThreeDFields({ register }: SectionFieldsProps) {
  return (
    <div className="space-y-2">
      <Label>Layer Labels (comma separated)</Label>
      <Input {...register("content.labelsRaw")} placeholder="Enamel, Dentin, Pulp, Root" />
    </div>
  );
}

function FAQFields({ register }: SectionFieldsProps) {
  return (
    <div className="space-y-2">
      <Label>Category filter (optional)</Label>
      <Input {...register("content.category")} placeholder="general" />
    </div>
  );
}

const FIELD_COMPONENTS: Partial<Record<SectionType, React.ComponentType<any>>> = {
  STATISTICS: StatisticsFields,
  TEXT_IMAGE: TextImageFields,
  TREATMENTS: LimitField,
  DOCTORS: LimitField,
  TESTIMONIALS: LimitField,
  GALLERY: LimitField,
  BLOG: LimitField,
  CTA: CTAFields,
  VIDEO: VideoFields,
  PARALLAX_IMAGE: ParallaxFields,
  THREE_D: ThreeDFields,
  FAQ: FAQFields,
};

export function SectionFormDialog({
  open,
  onOpenChange,
  section,
  onSaved,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  section?: PageSection;
  onSaved: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, control, watch, reset } = useForm<FormValues>({
    defaultValues: section
      ? {
          type: section.type,
          title: section.title ?? "",
          subtitle: section.subtitle ?? "",
          isVisible: section.isVisible,
          content: {
            ...(section.content as Record<string, unknown>),
            labelsRaw: Array.isArray((section.content as any)?.labels) ? (section.content as any).labels.join(", ") : "",
          },
        }
      : { type: "TEXT_IMAGE", title: "", subtitle: "", isVisible: true, content: {} },
  });

  const type = watch("type");
  const FieldComponent = FIELD_COMPONENTS[type];

  async function onSubmit(data: FormValues) {
    setLoading(true);
    const content = { ...data.content } as Record<string, unknown>;
    if (typeof content.labelsRaw === "string") {
      content.labels = content.labelsRaw.split(",").map((s) => s.trim()).filter(Boolean);
      delete content.labelsRaw;
    }
    const payload = { ...data, content };
    const result = section ? await updateSection(section.id, payload) : await createSection(payload);
    setLoading(false);
    if (result.success) {
      toast.success("Section saved.");
      onOpenChange(false);
      onSaved();
    } else toast.error(result.message ?? "Failed to save.");
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        onOpenChange(o);
        if (o)
          reset(
            section
              ? { type: section.type, title: section.title ?? "", subtitle: section.subtitle ?? "", isVisible: section.isVisible, content: section.content as Record<string, unknown> }
              : { type: "TEXT_IMAGE", title: "", subtitle: "", isVisible: true, content: {} }
          );
      }}
    >
      <DialogContent className="max-h-[85vh] max-w-xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{section ? "Edit Section" : "Add Section"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label>Section Type</Label>
            <Controller
              control={control}
              name="type"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange} disabled={!!section}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SECTION_TYPES.map((t) => (
                      <SelectItem key={t.value} value={t.value}>
                        {t.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          {type !== "HERO_SLIDER" && type !== "CTA" && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input {...register("title")} />
              </div>
              <div className="space-y-2">
                <Label>Subtitle / Eyebrow</Label>
                <Input {...register("subtitle")} />
              </div>
            </div>
          )}

          {FieldComponent && <FieldComponent control={control} register={register} />}

          <DialogFooter>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving…" : "Save Section"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
