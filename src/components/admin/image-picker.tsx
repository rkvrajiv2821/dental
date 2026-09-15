"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ImagePlus, X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MediaUploader } from "./media-uploader";
import { listMedia } from "@/lib/actions/media";
import type { Media } from "@prisma/client";
import { cn } from "@/lib/utils";

export function ImagePicker({
  value,
  onChange,
  folder = "general",
  label = "Image",
}: {
  value?: string | null;
  onChange: (url: string) => void;
  folder?: string;
  label?: string;
}) {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<Media[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- loading flag gates the async fetch kicked off in this same effect
    setLoading(true);
    listMedia({ type: "IMAGE" })
      .then(setItems)
      .finally(() => setLoading(false));
  }, [open]);

  return (
    <div>
      {label && <p className="mb-2 text-sm font-medium">{label}</p>}
      <div className="flex items-center gap-3">
        {value ? (
          <div className="relative h-20 w-28 overflow-hidden rounded-lg border border-border bg-muted">
            <Image src={value} alt="" fill className="object-cover" />
            <button
              type="button"
              onClick={() => onChange("")}
              className="absolute right-1 top-1 rounded-full bg-black/60 p-1 text-white"
              aria-label="Remove image"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ) : (
          <div className="flex h-20 w-28 items-center justify-center rounded-lg border border-dashed border-border text-muted-foreground">
            <ImagePlus className="h-5 w-5" />
          </div>
        )}
        <Button type="button" variant="outline" size="sm" onClick={() => setOpen(true)}>
          {value ? "Change" : "Select Image"}
        </Button>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Select an image</DialogTitle>
          </DialogHeader>
          <Tabs defaultValue="library">
            <TabsList>
              <TabsTrigger value="library">Media Library</TabsTrigger>
              <TabsTrigger value="upload">Upload New</TabsTrigger>
              <TabsTrigger value="url">Image URL</TabsTrigger>
            </TabsList>
            <TabsContent value="library" className="max-h-[420px] overflow-y-auto">
              {loading && <p className="py-8 text-center text-sm text-muted-foreground">Loading…</p>}
              {!loading && items.length === 0 && (
                <p className="py-8 text-center text-sm text-muted-foreground">No media yet. Upload your first image.</p>
              )}
              <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
                {items.map((item) => (
                  <button
                    type="button"
                    key={item.id}
                    onClick={() => {
                      onChange(item.url);
                      setOpen(false);
                    }}
                    className={cn(
                      "group relative aspect-square overflow-hidden rounded-lg border",
                      value === item.url ? "border-primary ring-2 ring-primary" : "border-border"
                    )}
                  >
                    <Image src={item.url} alt={item.altText ?? item.filename} fill className="object-cover" />
                    {value === item.url && (
                      <span className="absolute right-1 top-1 rounded-full bg-primary p-0.5 text-primary-foreground">
                        <Check className="h-3 w-3" />
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="upload">
              <MediaUploader
                folder={folder}
                onUploaded={(media) => {
                  onChange(media.url);
                  setItems((prev) => [media, ...prev]);
                  setOpen(false);
                }}
              />
            </TabsContent>
            <TabsContent value="url">
              <UrlInput onSelect={(url) => { onChange(url); setOpen(false); }} />
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function UrlInput({ onSelect }: { onSelect: (url: string) => void }) {
  const [url, setUrl] = useState("");
  return (
    <div className="flex gap-2 py-2">
      <Input placeholder="https://…" value={url} onChange={(e) => setUrl(e.target.value)} />
      <Button type="button" onClick={() => url && onSelect(url)}>
        Use
      </Button>
    </div>
  );
}
