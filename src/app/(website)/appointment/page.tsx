import type { Metadata } from "next";
import { AppointmentForm } from "@/components/website/appointment-form";
import { FadeIn } from "@/components/animations/fade-in";
import { getPublishedTreatments } from "@/lib/data/treatments";
import { getSiteSettings } from "@/lib/data/settings";
import { Phone } from "lucide-react";

export const metadata: Metadata = { title: "Book Appointment" };

export default async function AppointmentPage({
  searchParams,
}: {
  searchParams: Promise<{ treatment?: string }>;
}) {
  const [treatments, settings, { treatment }] = await Promise.all([
    getPublishedTreatments(),
    getSiteSettings(),
    searchParams,
  ]);
  const defaultTreatment = treatments.find((t) => t.slug === treatment);

  return (
    <div className="mx-auto max-w-2xl px-4 py-20 sm:px-6 lg:px-8">
      <FadeIn className="text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-primary">Book Appointment</p>
        <h1 className="mt-2 font-heading text-4xl font-medium">Let&apos;s Plan Your Visit</h1>
        <p className="mt-4 text-muted-foreground">
          Fill in your details and our team will confirm your appointment within one business day.
          {settings.phone && (
            <>
              {" "}
              Prefer to call?{" "}
              <a href={`tel:${settings.phone.replace(/\s+/g, "")}`} className="inline-flex items-center gap-1 font-medium text-primary">
                <Phone className="h-3.5 w-3.5" /> {settings.phone}
              </a>
            </>
          )}
        </p>
      </FadeIn>
      <FadeIn delay={0.1} className="mt-10">
        <AppointmentForm treatments={treatments} defaultTreatmentId={defaultTreatment?.id} />
      </FadeIn>
    </div>
  );
}
