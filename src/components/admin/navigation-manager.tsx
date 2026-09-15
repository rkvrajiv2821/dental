"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Pencil, Trash2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
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
import { navigationSchema, type NavigationInput } from "@/lib/validations/settings";
import { createNavItem, updateNavItem, deleteNavItem } from "@/lib/actions/navigation";
import type { Navigation } from "@prisma/client";

function NavList({ location, items }: { location: "HEADER" | "FOOTER"; items: Navigation[] }) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Navigation | null>(null);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, reset, watch, setValue } = useForm<NavigationInput>({
    resolver: zodResolver(navigationSchema),
    defaultValues: { location, order: items.length, isActive: true, openInNewTab: false, label: "", url: "" },
  });

  function openNew() {
    setEditing(null);
    reset({ location, order: items.length, isActive: true, openInNewTab: false, label: "", url: "" });
    setDialogOpen(true);
  }

  function openEdit(item: Navigation) {
    setEditing(item);
    reset({ ...item, parentId: item.parentId ?? undefined });
    setDialogOpen(true);
  }

  async function onSubmit(data: NavigationInput) {
    setLoading(true);
    const result = editing ? await updateNavItem(editing.id, data) : await createNavItem(data);
    setLoading(false);
    if (result.success) {
      toast.success("Saved.");
      setDialogOpen(false);
      window.location.reload();
    } else toast.error(result.message ?? "Failed to save.");
  }

  async function handleDelete(id: string) {
    const result = await deleteNavItem(id);
    if (result.success) {
      toast.success("Deleted.");
      window.location.reload();
    } else toast.error("Failed to delete.");
  }

  return (
    <div>
      <div className="flex justify-end">
        <Button size="sm" onClick={openNew}>
          <Plus className="h-4 w-4" /> Add Item
        </Button>
      </div>
      <div className="mt-4 space-y-2">
        {items.length === 0 && <p className="py-8 text-center text-sm text-muted-foreground">No items yet.</p>}
        {items.map((item) => (
          <div key={item.id} className="flex items-center justify-between rounded-lg border border-border p-3">
            <div>
              <p className="text-sm font-medium">{item.label}</p>
              <p className="text-xs text-muted-foreground">{item.url}</p>
            </div>
            <div className="flex items-center gap-1">
              {!item.isActive && <span className="mr-2 text-xs text-muted-foreground">Hidden</span>}
              <Button variant="ghost" size="icon-sm" onClick={() => openEdit(item)} aria-label="Edit">
                <Pencil className="h-3.5 w-3.5" />
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="ghost" size="icon-sm" aria-label="Delete">
                    <Trash2 className="h-3.5 w-3.5 text-destructive" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete &quot;{item.label}&quot;?</AlertDialogTitle>
                    <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
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
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Navigation Item" : "Add Navigation Item"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label>Label</Label>
              <Input {...register("label")} />
            </div>
            <div className="space-y-2">
              <Label>URL</Label>
              <Input {...register("url")} placeholder="/treatments" />
            </div>
            <div className="space-y-2">
              <Label>Order</Label>
              <Input type="number" {...register("order", { valueAsNumber: true })} />
            </div>
            <div className="flex items-center justify-between rounded-lg border border-border p-3">
              <p className="text-sm">Open in new tab</p>
              <Switch checked={watch("openInNewTab")} onCheckedChange={(v) => setValue("openInNewTab", v)} />
            </div>
            <div className="flex items-center justify-between rounded-lg border border-border p-3">
              <p className="text-sm">Active</p>
              <Switch checked={watch("isActive")} onCheckedChange={(v) => setValue("isActive", v)} />
            </div>
            <DialogFooter>
              <Button type="submit" disabled={loading}>
                {loading ? "Saving…" : "Save"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export function NavigationManager({ headerItems, footerItems }: { headerItems: Navigation[]; footerItems: Navigation[] }) {
  return (
    <div>
      <h1 className="font-heading text-2xl font-semibold">Navigation</h1>
      <p className="mt-1 text-sm text-muted-foreground">Controls the header menu and footer links across the site.</p>
      <Tabs defaultValue="header" className="mt-6">
        <TabsList>
          <TabsTrigger value="header">Header</TabsTrigger>
          <TabsTrigger value="footer">Footer</TabsTrigger>
        </TabsList>
        <TabsContent value="header">
          <NavList location="HEADER" items={headerItems} />
        </TabsContent>
        <TabsContent value="footer">
          <NavList location="FOOTER" items={footerItems} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
