"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
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
import { updateEnquiryStatus, deleteEnquiry } from "@/lib/actions/leads";
import { formatDate } from "@/lib/format";
import type { ContactEnquiry } from "@prisma/client";

const STATUSES = ["NEW", "RESPONDED", "CLOSED"] as const;

export function EnquiriesTable({ initialRows }: { initialRows: ContactEnquiry[] }) {
  const [rows, setRows] = useState(initialRows);

  async function handleStatusChange(id: string, status: string) {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, status: status as ContactEnquiry["status"] } : r)));
    const result = await updateEnquiryStatus(id, { status });
    if (!result.success) toast.error(result.message ?? "Failed to update.");
  }

  async function handleDelete(id: string) {
    const result = await deleteEnquiry(id);
    if (result.success) {
      setRows((prev) => prev.filter((r) => r.id !== id));
      toast.success("Deleted.");
    } else toast.error(result.message ?? "Failed to delete.");
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Message</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Received</TableHead>
            <TableHead className="w-10" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="py-10 text-center text-muted-foreground">
                No enquiries yet.
              </TableCell>
            </TableRow>
          )}
          {rows.map((row) => (
            <TableRow key={row.id}>
              <TableCell className="font-medium">{row.name}</TableCell>
              <TableCell className="text-sm text-muted-foreground">
                <div>{row.email}</div>
                {row.phone && <div>{row.phone}</div>}
              </TableCell>
              <TableCell className="max-w-xs truncate text-sm">{row.message}</TableCell>
              <TableCell>
                <Select value={row.status} onValueChange={(v) => handleStatusChange(row.id, v)}>
                  <SelectTrigger className="h-8 w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUSES.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s.charAt(0) + s.slice(1).toLowerCase()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">{formatDate(row.createdAt)}</TableCell>
              <TableCell>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="icon-sm" aria-label="Delete">
                      <Trash2 className="h-3.5 w-3.5 text-destructive" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete this enquiry?</AlertDialogTitle>
                      <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDelete(row.id)}>Delete</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
