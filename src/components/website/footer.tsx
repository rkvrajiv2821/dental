import Link from "next/link";
import { MapPin, Phone, Mail } from "lucide-react";
import { getNavigation, getSiteSettings } from "@/lib/data/settings";
import { HeaderLogo } from "./header-logo";
import { SocialIcon } from "./social-icon";

export async function Footer() {
  const [settings, footerNav] = await Promise.all([getSiteSettings(), getNavigation("FOOTER")]);
  const socials = (settings.socialLinks as Record<string, string> | null) ?? {};
  const hours = (settings.openingHours as { day: string; open: string; close: string; closed: boolean }[] | null) ?? [];

  return (
    <footer className="border-t border-border bg-secondary/40">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
          <div className="md:col-span-1">
            <HeaderLogo clinicName={settings.clinicName} logoUrl={settings.logoUrl} />
            {settings.tagline && <p className="mt-4 text-sm text-muted-foreground">{settings.tagline}</p>}
            <div className="mt-6 flex gap-3">
              {Object.entries(socials)
                .filter(([, url]) => Boolean(url))
                .map(([key, url]) => (
                  <a
                    key={key}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={key}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                  >
                    <SocialIcon name={key} className="h-4 w-4" />
                  </a>
                ))}
            </div>
          </div>

          <div>
            <h3 className="font-heading text-sm font-semibold uppercase tracking-wider text-foreground">Explore</h3>
            <ul className="mt-4 space-y-3">
              {(footerNav.length
                ? footerNav
                : [
                    { id: "treatments", label: "Treatments", url: "/treatments" },
                    { id: "doctors", label: "Doctors", url: "/doctors" },
                    { id: "gallery", label: "Smile Gallery", url: "/smile-gallery" },
                    { id: "blog", label: "Blog", url: "/blog" },
                  ]
              ).map((item) => (
                <li key={item.id}>
                  <Link href={item.url} className="text-sm text-muted-foreground hover:text-primary">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-heading text-sm font-semibold uppercase tracking-wider text-foreground">Contact</h3>
            <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
              {settings.addressLine && (
                <li className="flex gap-2">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0" /> {settings.addressLine}
                </li>
              )}
              {settings.phone && (
                <li className="flex gap-2">
                  <Phone className="mt-0.5 h-4 w-4 shrink-0" /> {settings.phone}
                </li>
              )}
              {settings.email && (
                <li className="flex gap-2">
                  <Mail className="mt-0.5 h-4 w-4 shrink-0" /> {settings.email}
                </li>
              )}
            </ul>
          </div>

          <div>
            <h3 className="font-heading text-sm font-semibold uppercase tracking-wider text-foreground">Opening Hours</h3>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              {hours.map((h) => (
                <li key={h.day} className="flex justify-between gap-4">
                  <span>{h.day}</span>
                  <span>{h.closed ? "Closed" : `${h.open} – ${h.close}`}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-border pt-6 text-xs text-muted-foreground">
          {settings.footerText ?? `© ${new Date().getFullYear()} ${settings.clinicName}. All rights reserved.`}
        </div>
      </div>
    </footer>
  );
}
