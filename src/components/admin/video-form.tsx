"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { videoSchema, type VideoInput } from "@/lib/validations/technology";
import { createVideo, updateVideo } from "@/lib/actions/technology";
import { AdminFormShell } from "./form-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Video } from "@prisma/client";

export function VideoForm({ video }: { video?: Video }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<VideoInput>({
    resolver: zodResolver(videoSchema),
    defaultValues: video ?? { provider: "YOUTUBE", status: "PUBLISHED", order: 0 },
  });

  async function onSubmit(data: VideoInput) {
    setLoading(true);
    const result = video ? await updateVideo(video.id, data) : await createVideo(data);
    setLoading(false);
    if (result.success) {
      toast.success(video ? "Updated." : "Created.");
      router.push("/admin/videos");
      router.refresh();
    } else toast.error(result.message ?? "Something went wrong.");
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <AdminFormShell
        title={video ? "Edit Video" : "Add Video"}
        backHref="/admin/videos"
        footer={
          <>
            <Button type="button" variant="outline" onClick={() => router.push("/admin/videos")}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving…" : "Save"}
            </Button>
          </>
        }
      >
        <div className="space-y-2">
          <Label>Title</Label>
          <Input {...register("title")} />
          {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Provider</Label>
            <Controller
              control={control}
              name="provider"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="YOUTUBE">YouTube</SelectItem>
                    <SelectItem value="VIMEO">Vimeo</SelectItem>
                    <SelectItem value="EXTERNAL">External</SelectItem>
                    <SelectItem value="UPLOADED">Uploaded</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>
          <div className="space-y-2">
            <Label>Video URL</Label>
            <Input {...register("url")} />
            {errors.url && <p className="text-xs text-destructive">{errors.url.message}</p>}
          </div>
        </div>
        <div className="space-y-2">
          <Label>Description</Label>
          <Textarea rows={2} {...register("description")} />
        </div>
      </AdminFormShell>
    </form>
  );
}
