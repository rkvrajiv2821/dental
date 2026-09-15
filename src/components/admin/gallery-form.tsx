"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { gallerySchema, type GalleryInput } from "@/lib/validations/gallery";
import { createGalleryItem, updateGalleryItem } from "@/lib/actions/gallery";
import { AdminFormShell } from "./form-shell";
import { ImagePicker } from "./image-picker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Gallery, GalleryCategory } from "@prisma/client";

export function GalleryForm({ item, categories }: { item?: Gallery; categories: GalleryCategory[] }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<GalleryInput>({
    resolver: zodResolver(gallerySchema),
    defaultValues: item ? { ...item, categoryId: item.categoryId ?? undefined } : { status: "PUBLISHED", order: 0 },
  });

  async function onSubmit(data: GalleryInput) {
    setLoading(true);
    const result = item ? await updateGalleryItem(item.id, data) : await createGalleryItem(data);
    setLoading(false);
    if (result.success) {
      toast.success(item ? "Updated." : "Created.");
      router.push("/admin/gallery");
      router.refresh();
    } else toast.error(result.message ?? "Something went wrong.");
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <AdminFormShell
        title={item ? "Edit Gallery Item" : "Add Gallery Item"}
        backHref="/admin/gallery"
        footer={
          <>
            <Button type="button" variant="outline" onClick={() => router.push("/admin/gallery")}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving…" : "Save"}
            </Button>
          </>
        }
      >
        <Controller control={control} name="image" render={({ field }) => <ImagePicker label="Image" value={field.value} onChange={field.onChange} folder="gallery" />} />
        {errors.image && <p className="text-xs text-destructive">{errors.image.message}</p>}

        <div className="space-y-2">
          <Label>Title</Label>
          <Input {...register("title")} />
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
            <Label>Order</Label>
            <Input type="number" {...register("order", { valueAsNumber: true })} />
          </div>
        </div>
      </AdminFormShell>
    </form>
  );
}
