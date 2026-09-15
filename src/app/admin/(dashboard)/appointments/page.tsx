import type { Metadata } from "next";
import { prisma } from "@/lib/db/prisma";
import { AppointmentsTable } from "@/components/admin/appointments-table";

export const metadata: Metadata = { title: "Appointments" };

export default async function AdminAppointmentsPage() {
  const appointments = await prisma.appointment.findMany({
    include: { treatment: true, doctor: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="font-heading text-2xl font-semibold">Appointments</h1>
      <p className="mt-1 text-sm text-muted-foreground">Requests submitted through the public booking form.</p>
      <div className="mt-6">
        <AppointmentsTable initialRows={appointments} />
      </div>
    </div>
  );
}
