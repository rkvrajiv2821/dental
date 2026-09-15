import type { Metadata } from "next";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { ContactForm } from "@/components/website/contact-form";
import { FadeIn } from "@/components/animations/fade-in";
import { getSiteSettings } from "@/lib/data/settings";

export const metadata: Metadata = { title: "Contact Us" };

export default async function ContactPage() {
  const settings = await getSiteSettings();
  const hours = (settings.openingHours as { day: string; open: string; close: string; closed: boolean }[] | null) ?? [];

  return (
    <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <FadeIn className="max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-widest text-primary">Contact</p>
        <h1 className="mt-2 font-heading text-4xl font-medium">We&apos;d Love to Hear From You</h1>
        <p className="mt-4 text-muted-foreground">Reach out with any questions, or send us a message below.</p>
      </FadeIn>

      <div className="mt-12 grid grid-cols-1 gap-12 lg:grid-cols-2">
        <FadeIn>
          <ContactForm />
        </FadeIn>
        <FadeIn delay={0.1} className="space-y-6">
          <div className="space-y-4 rounded-2xl border border-border bg-card p-6">
            {settings.addressLine && (
              <div className="flex gap-3">
                <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <p className="text-sm text-foreground/90">{settings.addressLine}</p>
              </div>
            )}
            {settings.phone && (
              <div className="flex gap-3">
                <Phone className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <a href={`tel:${settings.phone.replace(/\s+/g, "")}`} className="text-sm text-foreground/90 hover:text-primary">
                  {settings.phone}
                </a>
              </div>
            )}
            {settings.email && (
              <div className="flex gap-3">
                <Mail className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <a href={`mailto:${settings.email}`} className="text-sm text-foreground/90 hover:text-primary">
                  {settings.email}
                </a>
              </div>
            )}
            {hours.length > 0 && (
              <div className="flex gap-3">
                <Clock className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <div className="space-y-1 text-sm text-foreground/90">
                  {hours.map((h) => (
                    <div key={h.day} className="flex justify-between gap-6">
                      <span>{h.day}</span>
                      <span>{h.closed ? "Closed" : `${h.open} – ${h.close}`}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          {settings.googleMapsEmbed && (
            <div className="overflow-hidden rounded-2xl border border-border">
              <iframe src={settings.googleMapsEmbed} className="h-72 w-full" loading="lazy" title="Clinic location" />
            </div>
          )}
        </FadeIn>
      </div>
    </div>
  );
}
