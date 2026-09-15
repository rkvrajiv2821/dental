"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { sliderSchema, type SliderInput } from "@/lib/validations/slider";
import { createSlider, updateSlider } from "@/lib/actions/sliders";
import { AdminFormShell } from "./form-shell";
import { ImagePicker } from "./image-picker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Slider } from "@prisma/client";

export function SliderForm({ slider }: { slider?: Slider }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<SliderInput>({
    resolver: zodResolver(sliderSchema),
    defaultValues: slider
      ? {
          ...slider,
          startDate: slider.startDate ?? undefined,
          endDate: slider.endDate ?? undefined,
          subtitle: slider.subtitle ?? undefined,
          mobileImage: slider.mobileImage ?? undefined,
          backgroundVideo: slider.backgroundVideo ?? undefined,
          ctaText: slider.ctaText ?? undefined,
          ctaUrl: slider.ctaUrl ?? undefined,
          ctaText2: slider.ctaText2 ?? undefined,
          ctaUrl2: slider.ctaUrl2 ?? undefined,
          textPosition: slider.textPosition as SliderInput["textPosition"],
        }
      : { overlay: true, isActive: true, order: 0, textPosition: "left" as const },
  });

  async function onSubmit(data: SliderInput) {
    setLoading(true);
    const result = slider ? await updateSlider(slider.id, data) : await createSlider(data);
    setLoading(false);
    if (result.success) {
      toast.success(slider ? "Slide updated." : "Slide created.");
      router.push("/admin/sliders");
      router.refresh();
    } else {
      toast.error(result.message ?? "Something went wrong.");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <AdminFormShell
        title={slider ? "Edit Slide" : "Add Slide"}
        backHref="/admin/sliders"
        footer={
          <>
            <Button type="button" variant="outline" onClick={() => router.push("/admin/sliders")}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving…" : "Save Slide"}
            </Button>
          </>
        }
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Title</Label>
            <Input {...register("title")} />
            {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
          </div>
          <div className="space-y-2">
            <Label>Subtitle</Label>
            <Input {...register("subtitle")} />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Controller
            control={control}
            name="desktopImage"
            render={({ field }) => (
              <ImagePicker label="Desktop Image" value={field.value} onChange={field.onChange} folder="sliders" />
            )}
          />
          <Controller
            control={control}
            name="mobileImage"
            render={({ field }) => (
              <ImagePicker label="Mobile Image (optional)" value={field.value} onChange={field.onChange} folder="sliders" />
            )}
          />
        </div>
        {errors.desktopImage && <p className="text-xs text-destructive">{errors.desktopImage.message}</p>}

        <div className="space-y-2">
          <Label>Background Video URL (optional)</Label>
          <Input {...register("backgroundVideo")} placeholder="https://…mp4" />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>CTA Text</Label>
            <Input {...register("ctaText")} placeholder="Book Appointment" />
          </div>
          <div className="space-y-2">
            <Label>CTA Link</Label>
            <Input {...register("ctaUrl")} placeholder="/appointment" />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Secondary CTA Text (optional)</Label>
            <Input {...register("ctaText2")} />
          </div>
          <div className="space-y-2">
            <Label>Secondary CTA Link</Label>
            <Input {...register("ctaUrl2")} />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Text Position</Label>
            <Controller
              control={control}
              name="textPosition"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="left">Left</SelectItem>
                    <SelectItem value="center">Center</SelectItem>
                    <SelectItem value="right">Right</SelectItem>
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
            <p className="text-sm font-medium">Dark Overlay</p>
            <p className="text-xs text-muted-foreground">Improves text readability over the image.</p>
          </div>
          <Switch checked={watch("overlay")} onCheckedChange={(v) => setValue("overlay", v)} />
        </div>
        <div className="flex items-center justify-between rounded-lg border border-border p-3">
          <div>
            <p className="text-sm font-medium">Active</p>
            <p className="text-xs text-muted-foreground">Only active slides appear on the homepage.</p>
          </div>
          <Switch checked={watch("isActive")} onCheckedChange={(v) => setValue("isActive", v)} />
        </div>
      </AdminFormShell>
    </form>
  );
}
