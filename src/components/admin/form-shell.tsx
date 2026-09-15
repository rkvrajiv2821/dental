"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function AdminFormShell({
  title,
  backHref,
  children,
  footer,
}: {
  title: string;
  backHref: string;
  children: React.ReactNode;
  footer: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-3xl">
      <Link href={backHref} className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary">
        <ArrowLeft className="h-4 w-4" /> Back
      </Link>
      <h1 className="font-heading text-2xl font-semibold">{title}</h1>
      <Card className="mt-6">
        <CardContent className="space-y-5 pt-6">{children}</CardContent>
      </Card>
      <div className="mt-4 flex justify-end gap-3">{footer}</div>
    </div>
  );
}

export function FieldRow({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">{children}</div>;
}
