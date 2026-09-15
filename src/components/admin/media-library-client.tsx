"use client";

import { useState } from "react";
import Image from "next/image";
import { Copy, Trash2, Search, Film } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
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
import { MediaUploader } from "./media-uploader";
import { deleteMedia } from "@/lib/actions/media";
import type { Media } from "@prisma/client";

export function MediaLibraryClient({ initialMedia }: { initialMedia: Media[] }) {
  const [items, setItems] = useState(initialMedia);
  const [query, setQuery] = useState("");

  const filtered = items.filter((i) => i.filename.toLowerCase().includes(query.toLowerCase()));

  async function handleDelete(id: string) {
    const result = await deleteMedia(id);
    if (result.success) {
      setItems((prev) => prev.filter((i) => i.id !== id));
      toast.success("Deleted.");
    } else {
      toast.error(result.message ?? "Failed to delete.");
    }
  }

  return (
    <div>
      <h1 className="font-heading text-2xl font-semibold">Media Library</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Centralized image and video library, reusable across sliders, treatments, blogs and galleries.
      </p>

      <div className="mt-6">
        <MediaUploader onUploaded={(media) => setItems((prev) => [media, ...prev])} />
      </div>

      <div className="relative mt-6 max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search files…" className="pl-9" />
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {filtered.map((item) => (
          <div key={item.id} className="group relative overflow-hidden rounded-xl border border-border bg-card">
            <div className="relative aspect-square bg-muted">
              {item.type === "VIDEO" ? (
                <div className="flex h-full items-center justify-center">
                  <Film className="h-8 w-8 text-muted-foreground" />
                </div>
              ) : (
                <Image src={item.url} alt={item.altText ?? item.filename} fill className="object-cover" />
              )}
            </div>
            <div className="p-2">
              <p className="truncate text-xs font-medium">{item.filename}</p>
              <p className="text-[10px] text-muted-foreground">{item.width ? `${item.width}×${item.height}` : item.type}</p>
            </div>
            <div className="absolute inset-x-0 top-0 flex justify-end gap-1 bg-gradient-to-b from-black/50 to-transparent p-1.5 opacity-0 transition-opacity group-hover:opacity-100">
              <Button
                type="button"
                size="icon-sm"
                variant="secondary"
                onClick={() => {
                  navigator.clipboard.writeText(item.url);
                  toast.success("URL copied.");
                }}
                aria-label="Copy URL"
              >
                <Copy className="h-3.5 w-3.5" />
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button type="button" size="icon-sm" variant="secondary" aria-label="Delete">
                    <Trash2 className="h-3.5 w-3.5 text-destructive" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete this file?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This removes it from storage permanently. Make sure it isn&apos;t used elsewhere first.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => handleDelete(item.id)}>Delete</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="col-span-full py-10 text-center text-sm text-muted-foreground">No media found.</p>
        )}
      </div>
    </div>
  );
}
