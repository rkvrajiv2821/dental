"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
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
import { slugify } from "@/lib/format";

type CategoryLike = { id: string; name: string; slug: string; order?: number };

export function CategoryManager({
  title,
  backHref,
  categories,
  onCreate,
  onDelete,
}: {
  title: string;
  backHref: string;
  categories: CategoryLike[];
  onCreate: (input: { name: string; slug: string; order: number }) => Promise<{ success: boolean; message?: string }>;
  onDelete: (id: string) => Promise<{ success: boolean; message?: string }>;
}) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleCreate() {
    if (!name.trim()) return;
    setLoading(true);
    const result = await onCreate({ name, slug: slugify(name), order: categories.length });
    setLoading(false);
    if (result.success) {
      setName("");
      toast.success("Category added.");
      router.refresh();
    } else {
      toast.error(result.message ?? "Failed to add category.");
    }
  }

  async function handleDelete(id: string) {
    const result = await onDelete(id);
    if (result.success) {
      toast.success("Category deleted.");
      router.refresh();
    } else {
      toast.error(result.message ?? "Failed to delete. It may still be in use.");
    }
  }

  return (
    <div className="mx-auto max-w-xl">
      <Link href={backHref} className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary">
        <ArrowLeft className="h-4 w-4" /> Back
      </Link>
      <h1 className="font-heading text-2xl font-semibold">{title}</h1>

      <Card className="mt-6">
        <CardContent className="pt-6">
          <div className="flex gap-2">
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="New category name"
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleCreate())}
            />
            <Button type="button" onClick={handleCreate} disabled={loading}>
              <Plus className="h-4 w-4" /> Add
            </Button>
          </div>

          <div className="mt-4 space-y-1">
            {categories.length === 0 && <p className="py-6 text-center text-sm text-muted-foreground">No categories yet.</p>}
            {categories.map((c) => (
              <div key={c.id} className="flex items-center justify-between rounded-md border border-border px-3 py-2">
                <span className="text-sm">{c.name}</span>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="icon-sm" aria-label="Delete">
                      <Trash2 className="h-3.5 w-3.5 text-destructive" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete &quot;{c.name}&quot;?</AlertDialogTitle>
                      <AlertDialogDescription>Items in this category will become uncategorized.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDelete(c.id)}>Delete</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
