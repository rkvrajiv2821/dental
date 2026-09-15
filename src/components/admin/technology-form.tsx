"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { technologySchema, type TechnologyInput } from "@/lib/validations/technology";
import { createTechnology, updateTechnology } from "@/lib/actions/technology";
import { AdminFormShell } from "./form-shell";
import { ImagePicker } from "./image-picker";
import { MultiSelect } from "./multi-select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { slugify } from "@/lib/format";
import type { Technology, Treatment } from "@prisma/client";

type TechnologyWithTreatments = Technology & { treatments: Treatment[] };

export function TechnologyForm({ technology, treatments }: { technology?: TechnologyWithTreatments; treatments: Treatment[] }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<TechnologyInput>({
    resolver: zodResolver(technologySchema),
    defaultValues: technology
      ? { ...technology, treatmentIds: technology.treatments.map((t) => t.id) }
      : { status: "PUBLISHED", order: 0, treatmentIds: [] },
  });

  async function onSubmit(data: TechnologyInput) {
    setLoading(true);
    const result = technology ? await updateTechnology(technology.id, data) : await createTechnology(data);
    setLoading(false);
    if (result.success) {
      toast.success(technology ? "Updated." : "Created.");
      router.push("/admin/technology");
      router.refresh();
    } else toast.error(result.message ?? "Something went wrong.");
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <AdminFormShell
        title={technology ? "Edit Technology" : "Add Technology"}
        backHref="/admin/technology"
        footer={
          <>
            <Button type="button" variant="outline" onClick={() => router.push("/admin/technology")}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving…" : "Save"}
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
                if (!technology) setValue("slug", slugify(e.target.value));
              }}
            />
            {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
          </div>
          <div className="space-y-2">
            <Label>Slug</Label>
            <Input {...register("slug")} />
          </div>
        </div>

        <Controller control={control} name="image" render={({ field }) => <ImagePicker label="Image" value={field.value} onChange={field.onChange} folder="technology" />} />

        <div className="space-y-2">
          <Label>Description</Label>
          <Textarea rows={3} {...register("description")} />
        </div>

        <div className="space-y-2">
          <Label>Video URL (optional)</Label>
          <Input {...register("videoUrl")} />
        </div>

        <div className="space-y-2">
          <Label>Used In Treatments</Label>
          <Controller
            control={control}
            name="treatmentIds"
            render={({ field }) => (
              <MultiSelect options={treatments.map((t) => ({ id: t.id, label: t.name }))} value={field.value} onChange={field.onChange} />
            )}
          />
        </div>

        <div className="space-y-2">
          <Label>Order</Label>
          <Input type="number" {...register("order", { valueAsNumber: true })} />
        </div>
      </AdminFormShell>
    </form>
  );
}
