"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { smileCaseSchema, type SmileCaseInput } from "@/lib/validations/gallery";
import { createSmileCase, updateSmileCase } from "@/lib/actions/gallery";
import { AdminFormShell } from "./form-shell";
import { ImagePicker } from "./image-picker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { SmileCase, Treatment } from "@prisma/client";

export function SmileCaseForm({ smileCase, treatments }: { smileCase?: SmileCase; treatments: Treatment[] }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<SmileCaseInput>({
    resolver: zodResolver(smileCaseSchema),
    defaultValues: smileCase ? { ...smileCase, treatmentId: smileCase.treatmentId ?? undefined } : { status: "PUBLISHED", order: 0 },
  });

  async function onSubmit(data: SmileCaseInput) {
    setLoading(true);
    const result = smileCase ? await updateSmileCase(smileCase.id, data) : await createSmileCase(data);
    setLoading(false);
    if (result.success) {
      toast.success(smileCase ? "Updated." : "Created.");
      router.push("/admin/smile-cases");
      router.refresh();
    } else toast.error(result.message ?? "Something went wrong.");
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <AdminFormShell
        title={smileCase ? "Edit Smile Case" : "Add Smile Case"}
        backHref="/admin/smile-cases"
        footer={
          <>
            <Button type="button" variant="outline" onClick={() => router.push("/admin/smile-cases")}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving…" : "Save"}
            </Button>
          </>
        }
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Controller control={control} name="beforeImage" render={({ field }) => <ImagePicker label="Before Image" value={field.value} onChange={field.onChange} folder="smile-cases" />} />
          <Controller control={control} name="afterImage" render={({ field }) => <ImagePicker label="After Image" value={field.value} onChange={field.onChange} folder="smile-cases" />} />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Title</Label>
            <Input {...register("title")} />
            {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
          </div>
          <div className="space-y-2">
            <Label>Case ID</Label>
            <Input {...register("caseId")} placeholder="SC-001" />
            {errors.caseId && <p className="text-xs text-destructive">{errors.caseId.message}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Category</Label>
            <Input {...register("category")} placeholder="Implants, Veneers, Braces…" />
          </div>
          <div className="space-y-2">
            <Label>Related Treatment</Label>
            <Controller
              control={control}
              name="treatmentId"
              render={({ field }) => (
                <Select value={field.value ?? undefined} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select treatment" />
                  </SelectTrigger>
                  <SelectContent>
                    {treatments.map((t) => (
                      <SelectItem key={t.id} value={t.id}>
                        {t.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Description</Label>
          <Textarea rows={3} {...register("description")} />
        </div>
      </AdminFormShell>
    </form>
  );
}
