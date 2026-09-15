import type { Metadata } from "next";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/db/prisma";
import { auth } from "@/lib/auth/auth";
import {
  CalendarClock,
  MessageSquareText,
  FileText,
  FileEdit,
  Stethoscope,
  ListChecks,
  Image as ImageIcon,
  Star,
} from "lucide-react";

export const metadata: Metadata = { title: "Dashboard" };

async function getStats() {
  const [
    newAppointments,
    newEnquiries,
    publishedBlogs,
    draftBlogs,
    doctors,
    treatments,
    galleryCount,
    mediaCount,
    testimonials,
  ] = await Promise.all([
    prisma.appointment.count({ where: { status: "NEW" } }),
    prisma.contactEnquiry.count({ where: { status: "NEW" } }),
    prisma.blogPost.count({ where: { status: "PUBLISHED" } }),
    prisma.blogPost.count({ where: { status: "DRAFT" } }),
    prisma.doctor.count(),
    prisma.treatment.count(),
    prisma.gallery.count(),
    prisma.media.count(),
    prisma.testimonial.count(),
  ]);
  return { newAppointments, newEnquiries, publishedBlogs, draftBlogs, doctors, treatments, galleryCount, mediaCount, testimonials };
}

export default async function AdminDashboardPage() {
  const [stats, session] = await Promise.all([getStats(), auth()]);

  const cards = [
    { label: "New Appointments", value: stats.newAppointments, icon: CalendarClock, href: "/admin/appointments" },
    { label: "New Enquiries", value: stats.newEnquiries, icon: MessageSquareText, href: "/admin/enquiries" },
    { label: "Published Blogs", value: stats.publishedBlogs, icon: FileText, href: "/admin/blog" },
    { label: "Draft Blogs", value: stats.draftBlogs, icon: FileEdit, href: "/admin/blog" },
    { label: "Doctors", value: stats.doctors, icon: Stethoscope, href: "/admin/doctors" },
    { label: "Treatments", value: stats.treatments, icon: ListChecks, href: "/admin/treatments" },
    { label: "Gallery Items", value: stats.galleryCount, icon: ImageIcon, href: "/admin/gallery" },
    { label: "Testimonials", value: stats.testimonials, icon: Star, href: "/admin/testimonials" },
  ];

  return (
    <div>
      <h1 className="font-heading text-2xl font-semibold">
        Welcome back, {session?.user.name?.split(" ")[0] ?? "Admin"}
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">Here&apos;s what&apos;s happening across your website.</p>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <Link key={c.label} href={c.href}>
            <Card className="transition-colors hover:border-primary/40">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{c.label}</CardTitle>
                <c.icon className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-semibold">{c.value}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2 text-sm">
            <Link className="rounded-full border border-border px-4 py-2 hover:bg-muted" href="/admin/sliders/new">
              Add Hero Slide
            </Link>
            <Link className="rounded-full border border-border px-4 py-2 hover:bg-muted" href="/admin/blog/new">
              Write Blog Post
            </Link>
            <Link className="rounded-full border border-border px-4 py-2 hover:bg-muted" href="/admin/treatments/new">
              Add Treatment
            </Link>
            <Link className="rounded-full border border-border px-4 py-2 hover:bg-muted" href="/admin/doctors/new">
              Add Doctor
            </Link>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Media Library</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold">{stats.mediaCount}</p>
            <p className="mt-1 text-sm text-muted-foreground">files stored</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
