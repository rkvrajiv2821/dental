"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Trash2, Plus, Search } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
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

export type Column<T> = {
  header: string;
  cell: (row: T) => React.ReactNode;
  className?: string;
};

export function AdminDataTable<T extends { id: string }>({
  title,
  newHref,
  columns,
  rows,
  editHref,
  onDelete,
  searchPlaceholder = "Search…",
  searchKey,
}: {
  title: string;
  newHref?: string;
  columns: Column<T>[];
  rows: T[];
  editHref?: (row: T) => string;
  onDelete?: (id: string) => Promise<{ success: boolean; message?: string }>;
  searchPlaceholder?: string;
  searchKey?: (row: T) => string;
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filtered = query && searchKey ? rows.filter((r) => searchKey(r).toLowerCase().includes(query.toLowerCase())) : rows;

  async function handleDelete(id: string) {
    if (!onDelete) return;
    setDeletingId(id);
    const result = await onDelete(id);
    setDeletingId(null);
    if (result.success) {
      toast.success("Deleted successfully.");
      router.refresh();
    } else {
      toast.error(result.message ?? "Failed to delete.");
    }
  }

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="font-heading text-2xl font-semibold">{title}</h1>
        {newHref && (
          <Button asChild className="rounded-full">
            <Link href={newHref}>
              <Plus className="h-4 w-4" /> Add New
            </Link>
          </Button>
        )}
      </div>

      {searchKey && (
        <div className="relative mt-4 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={searchPlaceholder}
            className="pl-9"
          />
        </div>
      )}

      <div className="mt-4 overflow-x-auto rounded-lg border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((col) => (
                <TableHead key={col.header} className={col.className}>
                  {col.header}
                </TableHead>
              ))}
              {(editHref || onDelete) && <TableHead className="w-24 text-right">Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={columns.length + 1} className="py-10 text-center text-muted-foreground">
                  No records yet.
                </TableCell>
              </TableRow>
            )}
            {filtered.map((row) => (
              <TableRow key={row.id}>
                {columns.map((col) => (
                  <TableCell key={col.header} className={col.className}>
                    {col.cell(row)}
                  </TableCell>
                ))}
                {(editHref || onDelete) && (
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      {editHref && (
                        <Button asChild variant="ghost" size="icon-sm">
                          <Link href={editHref(row)} aria-label="Edit">
                            <Pencil className="h-3.5 w-3.5" />
                          </Link>
                        </Button>
                      )}
                      {onDelete && (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon-sm" aria-label="Delete" disabled={deletingId === row.id}>
                              <Trash2 className="h-3.5 w-3.5 text-destructive" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete this record?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDelete(row.id)}>Delete</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
                    </div>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
