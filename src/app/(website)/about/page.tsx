import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FadeIn } from "@/components/animations/fade-in";
import { Counter } from "@/components/animations/counter";
import { getSiteSettings } from "@/lib/data/settings";
import { getPublishedDoctors } from "@/lib/data/doctors";
import { DoctorCard } from "@/components/website/doctor-card";
import { SectionHeading } from "@/components/website/section-heading";

export const metadata: Metadata = { title: "About Us" };

export default async function AboutPage() {
  const [settings, doctors] = await Promise.all([getSiteSettings(), getPublishedDoctors(4)]);

  return (
    <>
      <section className="bg-secondary/30 py-20 sm:py-28">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <FadeIn>
            <p className="text-sm font-semibold uppercase tracking-widest text-primary">About {settings.clinicName}</p>
            <h1 className="mt-3 font-heading text-4xl font-medium sm:text-5xl">{settings.tagline ?? "Premium dentistry, designed around you."}</h1>
            <p className="mt-6 text-lg text-muted-foreground">
              We combine advanced dental technology with genuinely attentive care. Every treatment plan starts with
              listening — because the best outcomes come from understanding exactly what you need.
            </p>
          </FadeIn>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {[
              { label: "Years of Experience", value: 18, suffix: "+" },
              { label: "Happy Patients", value: 24000, suffix: "+" },
              { label: "Specialist Doctors", value: 6 },
              { label: "5-Star Reviews", value: 3200, suffix: "+" },
            ].map((s) => (
              <FadeIn key={s.label} className="text-center">
                <div className="font-heading text-4xl font-semibold text-primary">
                  <Counter value={s.value} suffix={s.suffix} />
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{s.label}</p>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-secondary/30 py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="Our Team" title="Meet the Specialists Behind Your Smile" align="center" className="mx-auto" />
          <div className="mt-12 grid grid-cols-2 gap-6 lg:grid-cols-4">
            {doctors.map((d) => (
              <DoctorCard key={d.id} doctor={d} />
            ))}
          </div>
          <div className="mt-10 text-center">
            <Button asChild variant="outline" className="rounded-full">
              <Link href="/doctors">View All Doctors</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="py-20 text-center sm:py-28">
        <FadeIn>
          <h2 className="font-heading text-3xl font-medium sm:text-4xl">Ready to experience the difference?</h2>
          <div className="mt-8">
            <Button asChild size="lg" className="rounded-full px-8">
              <Link href="/appointment">Book Appointment</Link>
            </Button>
          </div>
        </FadeIn>
      </section>
    </>
  );
}
