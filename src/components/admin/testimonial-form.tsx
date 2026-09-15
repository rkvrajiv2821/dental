"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { testimonialSchema, type TestimonialInput } from "@/lib/validations/testimonial";
import { createTestimonial, updateTestimonial } from "@/lib/actions/testimonials";
import { AdminFormShell } from "./form-shell";
import { ImagePicker } from "./image-picker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Testimonial, Treatment, Doctor } from "@prisma/client";

export function TestimonialForm({
  testimonial,
  treatments,
  doctors,
}: {
  testimonial?: Testimonial;
  treatments: Treatment[];
  doctors: Doctor[];
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
  } = useForm<TestimonialInput>({
    resolver: zodResolver(testimonialSchema),
    defaultValues: testimonial
      ? { ...testimonial, treatmentId: testimonial.treatmentId ?? undefined, doctorId: testimonial.doctorId ?? undefined }
      : { rating: 5, featured: false, status: "PUBLISHED", order: 0, date: new Date() },
  });

  async function onSubmit(data: TestimonialInput) {
    setLoading(true);
    const result = testimonial ? await updateTestimonial(testimonial.id, data) : await createTestimonial(data);
    setLoading(false);
    if (result.success) {
      toast.success(testimonial ? "Testimonial updated." : "Testimonial created.");
      router.push("/admin/testimonials");
      router.refresh();
    } else {
      toast.error(result.message ?? "Something went wrong.");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <AdminFormShell
        title={testimonial ? "Edit Testimonial" : "Add Testimonial"}
        backHref="/admin/testimonials"
        footer={
          <>
            <Button type="button" variant="outline" onClick={() => router.push("/admin/testimonials")}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving…" : "Save Testimonial"}
            </Button>
          </>
        }
      >
        <Controller
          control={control}
          name="photo"
          render={({ field }) => <ImagePicker label="Patient Photo" value={field.value} onChange={field.onChange} folder="testimonials" />}
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Patient Name</Label>
            <Input {...register("patientName")} />
            {errors.patientName && <p className="text-xs text-destructive">{errors.patientName.message}</p>}
          </div>
          <div className="space-y-2">
            <Label>Rating (1–5)</Label>
            <Input type="number" min={1} max={5} {...register("rating", { valueAsNumber: true })} />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Review</Label>
          <Textarea rows={4} {...register("review")} />
          {errors.review && <p className="text-xs text-destructive">{errors.review.message}</p>}
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Treatment</Label>
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
          <div className="space-y-2">
            <Label>Doctor</Label>
            <Controller
              control={control}
              name="doctorId"
              render={({ field }) => (
                <Select value={field.value ?? undefined} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select doctor" />
                  </SelectTrigger>
                  <SelectContent>
                    {doctors.map((d) => (
                      <SelectItem key={d.id} value={d.id}>
                        {d.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Video URL (optional)</Label>
          <Input {...register("videoUrl")} placeholder="https://youtube.com/…" />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
          <div className="space-y-2">
            <Label>Order</Label>
            <Input type="number" {...register("order", { valueAsNumber: true })} />
          </div>
        </div>

        <div className="flex items-center justify-between rounded-lg border border-border p-3">
          <div>
            <p className="text-sm font-medium">Featured</p>
            <p className="text-xs text-muted-foreground">Featured testimonials are prioritized on the homepage.</p>
          </div>
          <Switch checked={watch("featured")} onCheckedChange={(v) => setValue("featured", v)} />
        </div>
      </AdminFormShell>
    </form>
  );
}
