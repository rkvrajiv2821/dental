import type { Metadata } from "next";
import { prisma } from "@/lib/db/prisma";
import { EnquiriesTable } from "@/components/admin/enquiries-table";

export const metadata: Metadata = { title: "Enquiries" };

export default async function AdminEnquiriesPage() {
  const enquiries = await prisma.contactEnquiry.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <h1 className="font-heading text-2xl font-semibold">Contact Enquiries</h1>
      <p className="mt-1 text-sm text-muted-foreground">Messages submitted through the contact form.</p>
      <div className="mt-6">
        <EnquiriesTable initialRows={enquiries} />
      </div>
    </div>
  );
}
