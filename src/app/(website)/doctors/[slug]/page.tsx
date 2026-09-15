import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Star, Calendar, Clock, Award } from "lucide-react";
import { getDoctorBySlug, getPublishedDoctors } from "@/lib/data/doctors";
import { Button } from "@/components/ui/button";
import { TreatmentCard } from "@/components/website/treatment-card";
import { FadeIn } from "@/components/animations/fade-in";
import { SocialIcon } from "@/components/website/social-icon";
import { breadcrumbJsonLd } from "@/lib/seo/json-ld";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const doctor = await getDoctorBySlug(slug);
  if (!doctor) return {};
  return {
    title: doctor.seoTitle ?? doctor.name,
    description: doctor.seoDescription ?? doctor.bio?.slice(0, 160) ?? undefined,
    alternates: { canonical: `/doctors/${doctor.slug}` },
  };
}

export default async function DoctorDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const doctor = await getDoctorBySlug(slug);
  if (!doctor) notFound();

  const socials = (doctor.socialLinks as Record<string, string> | null) ?? {};

  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: "Home", url: "/" },
              { name: "Doctors", url: "/doctors" },
              { name: doctor.name, url: `/doctors/${doctor.slug}` },
            ])
          ),
        }}
      />

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[380px_1fr]">
            <FadeIn>
              <div className="relative aspect-[3/4] overflow-hidden rounded-3xl bg-muted">
                {doctor.profilePhoto ? (
                  <Image src={doctor.profilePhoto} alt={doctor.name} fill className="object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center font-heading text-6xl text-muted-foreground">
                    {doctor.name.charAt(0)}
                  </div>
                )}
              </div>
              {Object.values(socials).some(Boolean) && (
                <div className="mt-4 flex gap-2">
                  {Object.entries(socials)
                    .filter(([, url]) => Boolean(url))
                    .map(([key, url]) => (
                      <a key={key} href={url} target="_blank" rel="noopener noreferrer" className="flex h-9 w-9 items-center justify-center rounded-full border border-border hover:border-primary hover:text-primary">
                        <SocialIcon name={key} className="h-4 w-4" />
                      </a>
                    ))}
                </div>
              )}
            </FadeIn>

            <FadeIn delay={0.1}>
              {doctor.specialization && <p className="text-sm font-semibold uppercase tracking-widest text-primary">{doctor.specialization.name}</p>}
              <h1 className="mt-2 font-heading text-4xl font-medium">{doctor.name}</h1>
              <p className="mt-1 text-lg text-muted-foreground">{doctor.designation}</p>

              <div className="mt-6 flex flex-wrap gap-6 text-sm text-muted-foreground">
                {doctor.qualification && (
                  <span className="flex items-center gap-1.5">
                    <Award className="h-4 w-4 text-primary" /> {doctor.qualification}
                  </span>
                )}
                {doctor.experienceYears && (
                  <span className="flex items-center gap-1.5">
                    <Star className="h-4 w-4 text-primary" /> {doctor.experienceYears}+ years experience
                  </span>
                )}
                {doctor.availableDays.length > 0 && (
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4 text-primary" /> {doctor.availableDays.join(", ")}
                  </span>
                )}
                {doctor.availableTime && (
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-4 w-4 text-primary" /> {doctor.availableTime}
                  </span>
                )}
              </div>

              {doctor.bio && <p className="mt-6 leading-relaxed text-foreground/90">{doctor.bio}</p>}

              {doctor.languages.length > 0 && (
                <p className="mt-4 text-sm text-muted-foreground">Languages: {doctor.languages.join(", ")}</p>
              )}

              <div className="mt-8">
                <Button asChild size="lg" className="rounded-full px-8">
                  <Link href="/appointment">Book with {doctor.name.split(" ")[0]}</Link>
                </Button>
              </div>
            </FadeIn>
          </div>

          {doctor.treatments.length > 0 && (
            <div className="mt-20">
              <h2 className="font-heading text-2xl font-medium">Treatments Handled</h2>
              <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {doctor.treatments.map(({ treatment }) => (
                  <TreatmentCard key={treatment.id} treatment={treatment} />
                ))}
              </div>
            </div>
          )}

          {doctor.testimonials.length > 0 && (
            <div className="mt-20">
              <h2 className="font-heading text-2xl font-medium">Patient Reviews</h2>
              <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {doctor.testimonials.map((t) => (
                  <div key={t.id} className="rounded-2xl border border-border bg-card p-6">
                    <div className="flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className={i < t.rating ? "h-4 w-4 fill-gold text-gold" : "h-4 w-4 text-muted-foreground/30"} />
                      ))}
                    </div>
                    <p className="mt-3 text-sm text-foreground/90">&ldquo;{t.review}&rdquo;</p>
                    <p className="mt-3 text-sm font-medium">{t.patientName}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

export async function generateStaticParams() {
  const doctors = await getPublishedDoctors();
  return doctors.map((d) => ({ slug: d.slug }));
}
