"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { blogPostSchema, type BlogPostInput } from "@/lib/validations/blog";
import { createBlogPost, updateBlogPost } from "@/lib/actions/blog";
import { AdminFormShell } from "./form-shell";
import { ImagePicker } from "./image-picker";
import { MultiSelect } from "./multi-select";
import { RichTextEditor } from "./rich-text-editor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { slugify } from "@/lib/format";
import type { BlogPost, BlogCategory, BlogTag } from "@prisma/client";

type PostWithRelations = BlogPost & { tags: BlogTag[] };

function toLocalInput(date?: Date | string | null) {
  if (!date) return "";
  const d = new Date(date);
  const offset = d.getTimezoneOffset();
  return new Date(d.getTime() - offset * 60000).toISOString().slice(0, 16);
}

export function BlogPostForm({
  post,
  categories,
  tags,
}: {
  post?: PostWithRelations;
  categories: BlogCategory[];
  tags: BlogTag[];
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
  } = useForm<BlogPostInput>({
    resolver: zodResolver(blogPostSchema),
    defaultValues: post
      ? { ...post, categoryId: post.categoryId ?? undefined, tagIds: post.tags.map((t) => t.id) }
      : { status: "DRAFT", tagIds: [], content: "" },
  });

  const status = watch("status");

  async function onSubmit(data: BlogPostInput) {
    setLoading(true);
    const result = post ? await updateBlogPost(post.id, data) : await createBlogPost(data);
    setLoading(false);
    if (result.success) {
      toast.success(post ? "Post updated." : "Post created.");
      router.push("/admin/blog");
      router.refresh();
    } else {
      toast.error(result.message ?? "Something went wrong.");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <AdminFormShell
        title={post ? "Edit Post" : "Write Blog Post"}
        backHref="/admin/blog"
        footer={
          <>
            <Button type="button" variant="outline" onClick={() => router.push("/admin/blog")}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving…" : "Save Post"}
            </Button>
          </>
        }
      >
        <div className="space-y-2">
          <Label>Title</Label>
          <Input
            {...register("title")}
            onChange={(e) => {
              register("title").onChange(e);
              if (!post) setValue("slug", slugify(e.target.value));
            }}
          />
          {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
        </div>
        <div className="space-y-2">
          <Label>Slug</Label>
          <Input {...register("slug")} />
          {errors.slug && <p className="text-xs text-destructive">{errors.slug.message}</p>}
        </div>

        <div className="space-y-2">
          <Label>Excerpt</Label>
          <Textarea rows={2} {...register("excerpt")} />
        </div>

        <Controller control={control} name="featuredImage" render={({ field }) => <ImagePicker label="Featured Image" value={field.value} onChange={field.onChange} folder="blog" />} />

        <div className="space-y-2">
          <Label>Content</Label>
          <Controller control={control} name="content" render={({ field }) => <RichTextEditor value={field.value} onChange={field.onChange} />} />
          {errors.content && <p className="text-xs text-destructive">{errors.content.message}</p>}
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
            <Label>Tags</Label>
            <Controller control={control} name="tagIds" render={({ field }) => <MultiSelect options={tags.map((t) => ({ id: t.id, label: t.name }))} value={field.value} onChange={field.onChange} />} />
          </div>
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
                    <SelectItem value="PUBLISHED">Publish Now</SelectItem>
                    <SelectItem value="SCHEDULED">Scheduled</SelectItem>
                    <SelectItem value="ARCHIVED">Archived</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>
          {status === "SCHEDULED" && (
            <div className="space-y-2">
              <Label>Publish Date & Time</Label>
              <Controller
                control={control}
                name="publishedAt"
                render={({ field }) => (
                  <Input
                    type="datetime-local"
                    value={toLocalInput(field.value)}
                    onChange={(e) => field.onChange(e.target.value ? new Date(e.target.value) : undefined)}
                  />
                )}
              />
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label>SEO Title</Label>
          <Input {...register("seoTitle")} />
        </div>
        <div className="space-y-2">
          <Label>SEO Description</Label>
          <Textarea rows={2} {...register("seoDescription")} />
        </div>
        <Controller control={control} name="ogImage" render={({ field }) => <ImagePicker label="OG Image (optional)" value={field.value} onChange={field.onChange} folder="blog" />} />
      </AdminFormShell>
    </form>
  );
}
