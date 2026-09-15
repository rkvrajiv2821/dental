import type { Metadata } from "next";
import { prisma } from "@/lib/db/prisma";
import { AdminDataTable } from "@/components/admin/data-table";
import { StatusBadge } from "@/components/admin/status-badge";
import { deleteTestimonial } from "@/lib/actions/testimonials";

export const metadata: Metadata = { title: "Testimonials" };

export default async function AdminTestimonialsPage() {
  const testimonials = await prisma.testimonial.findMany({ orderBy: { order: "asc" } });

  return (
    <AdminDataTable
      title="Testimonials"
      newHref="/admin/testimonials/new"
      rows={testimonials}
      searchKey={(t) => t.patientName}
      editHref={(t) => `/admin/testimonials/${t.id}`}
      onDelete={async (id) => deleteTestimonial(id)}
      columns={[
        { header: "Patient", cell: (t) => <span className="font-medium">{t.patientName}</span> },
        { header: "Rating", cell: (t) => "★".repeat(t.rating) },
        { header: "Featured", cell: (t) => (t.featured ? "Yes" : "—") },
        { header: "Status", cell: (t) => <StatusBadge status={t.status} /> },
      ]}
    />
  );
}
