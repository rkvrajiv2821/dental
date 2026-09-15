"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { treatmentSchema, type TreatmentInput } from "@/lib/validations/treatment";
import { createTreatment, updateTreatment } from "@/lib/actions/treatments";
import { AdminFormShell } from "./form-shell";
import { ImagePicker } from "./image-picker";
import { MultiSelect } from "./multi-select";
import { RepeaterField } from "./repeater-field";
import { RichTextEditor } from "./rich-text-editor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { slugify } from "@/lib/format";
import type { Treatment, TreatmentCategory, Technology, Doctor } from "@prisma/client";

type TreatmentWithRelations = Treatment & {
  technologies: Technology[];
  doctors: { doctorId: string }[];
  relatedTo: Treatment[];
};

export function TreatmentForm({
  treatment,
  categories,
  technologies,
  doctors,
  allTreatments,
}: {
  treatment?: TreatmentWithRelations;
  categories: TreatmentCategory[];
  technologies: Technology[];
  doctors: Doctor[];
  allTreatments: Treatment[];
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<TreatmentInput>({
    resolver: zodResolver(treatmentSchema),
    defaultValues: treatment
      ? {
          ...treatment,
          categoryId: treatment.categoryId ?? undefined,
          benefits: (treatment.benefits as never) ?? [],
          procedureSteps: (treatment.procedureSteps as never) ?? [],
          technologyIds: treatment.technologies.map((t) => t.id),
          doctorIds: treatment.doctors.map((d) => d.doctorId),
          relatedTreatmentIds: treatment.relatedTo.map((t) => t.id),
        }
      : { status: "DRAFT", order: 0, gallery: [], benefits: [], procedureSteps: [], technologyIds: [], doctorIds: [], relatedTreatmentIds: [] },
  });

  const nameValue = watch("name");

  async function onSubmit(data: TreatmentInput) {
    setLoading(true);
    const result = treatment ? await updateTreatment(treatment.id, data) : await createTreatment(data);
    setLoading(false);
    if (result.success) {
      toast.success(treatment ? "Treatment updated." : "Treatment created.");
      router.push("/admin/treatments");
      router.refresh();
    } else {
      toast.error(result.message ?? "Something went wrong.");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <AdminFormShell
        title={treatment ? "Edit Treatment" : "Add Treatment"}
        backHref="/admin/treatments"
        footer={
          <>
            <Button type="button" variant="outline" onClick={() => router.push("/admin/treatments")}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving…" : "Save Treatment"}
            </Button>
          </>
        }
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Name</Label>
            <Input
              {...register("name")}
              onChange={(e) => {
                register("name").onChange(e);
                if (!treatment) setValue("slug", slugify(e.target.value));
              }}
            />
            {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
          </div>
          <div className="space-y-2">
            <Label>Slug</Label>
            <Input {...register("slug")} />
            {errors.slug && <p className="text-xs text-destructive">{errors.slug.message}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Category</Label>
            <Controller
              control={control}
              name="categoryId"
              render={({ field }) => (
                <Select value={field.value ?? undefined} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>
          <div className="space-y-2">
            <Label>Status</Label>
            <Controller
              control={control}
              name="status"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DRAFT">Draft</SelectItem>
                    <SelectItem value="PUBLISHED">Published</SelectItem>
                    <SelectItem value="ARCHIVED">Archived</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Short Description</Label>
          <Textarea rows={2} {...register("shortDescription")} />
        </div>

        <Controller
          control={control}
          name="heroImage"
          render={({ field }) => <ImagePicker label="Hero Image" value={field.value} onChange={field.onChange} folder="treatments" />}
        />

        <div className="space-y-2">
          <Label>Full Description</Label>
          <Controller
            control={control}
            name="fullDescription"
            render={({ field }) => <RichTextEditor value={field.value ?? ""} onChange={field.onChange} />}
          />
        </div>

        <RepeaterField
          control={control}
          name="benefits"
          label="Benefits"
          newItem={{ title: "", description: "", icon: "" }}
          renderItem={(index) => (
            <>
              <Input placeholder="Title" {...register(`benefits.${index}.title` as const)} />
              <Textarea placeholder="Description" rows={2} {...register(`benefits.${index}.description` as const)} />
            </>
          )}
        />

        <RepeaterField
          control={control}
          name="procedureSteps"
          label="Procedure Steps"
          newItem={{ step: 1, title: "", description: "" }}
          renderItem={(index) => (
            <>
              <div className="flex gap-2">
                <Input type="number" className="w-20" placeholder="#" {...register(`procedureSteps.${index}.step` as const, { valueAsNumber: true })} />
                <Input placeholder="Title" {...register(`procedureSteps.${index}.title` as const)} />
              </div>
              <Textarea placeholder="Description" rows={2} {...register(`procedureSteps.${index}.description` as const)} />
            </>
          )}
        />

        <div className="space-y-2">
          <Label>Technologies Used</Label>
          <Controller
            control={control}
            name="technologyIds"
            render={({ field }) => (
              <MultiSelect
                options={technologies.map((t) => ({ id: t.id, label: t.name }))}
                value={field.value}
                onChange={field.onChange}
                placeholder="Select technologies"
              />
            )}
          />
        </div>

        <div className="space-y-2">
          <Label>Related Doctors</Label>
          <Controller
            control={control}
            name="doctorIds"
            render={({ field }) => (
              <MultiSelect
                options={doctors.map((d) => ({ id: d.id, label: d.name }))}
                value={field.value}
                onChange={field.onChange}
                placeholder="Select doctors"
              />
            )}
          />
        </div>

        <div className="space-y-2">
          <Label>Related Treatments</Label>
          <Controller
            control={control}
            name="relatedTreatmentIds"
            render={({ field }) => (
              <MultiSelect
                options={allTreatments.filter((t) => t.id !== treatment?.id).map((t) => ({ id: t.id, label: t.name }))}
                value={field.value}
                onChange={field.onChange}
                placeholder="Select related treatments"
              />
            )}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>SEO Title</Label>
            <Input {...register("seoTitle")} placeholder={nameValue} />
          </div>
          <div className="space-y-2">
            <Label>Order</Label>
            <Input type="number" {...register("order", { valueAsNumber: true })} />
          </div>
        </div>
        <div className="space-y-2">
          <Label>SEO Description</Label>
          <Textarea rows={2} {...register("seoDescription")} />
        </div>
      </AdminFormShell>
    </form>
  );
}
