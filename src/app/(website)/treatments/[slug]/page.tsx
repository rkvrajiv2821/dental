import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { CheckCircle2 } from "lucide-react";
import { getTreatmentBySlug, getPublishedTreatments } from "@/lib/data/treatments";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { FadeIn, Stagger, StaggerItem } from "@/components/animations/fade-in";
import { DoctorCard } from "@/components/website/doctor-card";
import { breadcrumbJsonLd, faqJsonLd } from "@/lib/seo/json-ld";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const treatment = await getTreatmentBySlug(slug);
  if (!treatment) return {};
  return {
    title: treatment.seoTitle ?? treatment.name,
    description: treatment.seoDescription ?? treatment.shortDescription ?? undefined,
    alternates: { canonical: `/treatments/${treatment.slug}` },
    openGraph: {
      title: treatment.seoTitle ?? treatment.name,
      description: treatment.seoDescription ?? treatment.shortDescription ?? undefined,
      images: treatment.ogImage ?? treatment.heroImage ? [treatment.ogImage ?? treatment.heroImage!] : undefined,
    },
  };
}

export default async function TreatmentDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const treatment = await getTreatmentBySlug(slug);
  if (!treatment) notFound();

  const benefits = (treatment.benefits as { title: string; description: string; icon?: string }[]) ?? [];
  const steps = (treatment.procedureSteps as { step: number; title: string; description: string }[]) ?? [];

  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: "Home", url: "/" },
              { name: "Treatments", url: "/treatments" },
              { name: treatment.name, url: `/treatments/${treatment.slug}` },
            ])
          ),
        }}
      />
      {treatment.faqs.length > 0 && (
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(treatment.faqs.map((f) => ({ question: f.question, answer: f.answer })))) }}
        />
      )}

      {/* Hero */}
      <section className="relative flex h-[60vh] min-h-[420px] items-end overflow-hidden bg-foreground text-white">
        {treatment.heroImage && <Image src={treatment.heroImage} alt={treatment.name} fill priority className="object-cover opacity-70" />}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/20" />
        <div className="relative mx-auto w-full max-w-7xl px-4 pb-14 sm:px-6 lg:px-8">
          {treatment.category && (
            <p className="text-sm font-semibold uppercase tracking-widest text-white/80">{treatment.category.name}</p>
          )}
          <h1 className="mt-3 font-heading text-4xl font-medium sm:text-5xl">{treatment.name}</h1>
          {treatment.shortDescription && <p className="mt-4 max-w-2xl text-white/85">{treatment.shortDescription}</p>}
        </div>
      </section>

      {/* Overview */}
      {treatment.fullDescription && (
        <section className="py-16">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <FadeIn>
              <div className="prose prose-neutral max-w-none" dangerouslySetInnerHTML={{ __html: treatment.fullDescription }} />
            </FadeIn>
          </div>
        </section>
      )}

      {/* Benefits */}
      {benefits.length > 0 && (
        <section className="bg-secondary/30 py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="font-heading text-2xl font-medium">Why Choose This Treatment</h2>
            <Stagger className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
              {benefits.map((b) => (
                <StaggerItem key={b.title} className="rounded-2xl border border-border bg-card p-6">
                  <CheckCircle2 className="h-6 w-6 text-primary" />
                  <h3 className="mt-3 font-heading text-lg font-medium">{b.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{b.description}</p>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </section>
      )}

      {/* Procedure */}
      {steps.length > 0 && (
        <section className="py-16">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <h2 className="font-heading text-2xl font-medium">The Procedure</h2>
            <div className="mt-8 space-y-6">
              {steps
                .sort((a, b) => a.step - b.step)
                .map((s) => (
                  <FadeIn key={s.step} className="flex gap-5">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                      {s.step}
                    </div>
                    <div>
                      <h3 className="font-heading text-lg font-medium">{s.title}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">{s.description}</p>
                    </div>
                  </FadeIn>
                ))}
            </div>
          </div>
        </section>
      )}

      {/* Technology */}
      {treatment.technologies.length > 0 && (
        <section className="bg-secondary/30 py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="font-heading text-2xl font-medium">Technology We Use</h2>
            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {treatment.technologies.map((tech) => (
                <div key={tech.id} className="rounded-2xl border border-border bg-card p-6">
                  <h3 className="font-heading text-lg font-medium">{tech.name}</h3>
                  {tech.description && <p className="mt-2 text-sm text-muted-foreground">{tech.description}</p>}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Doctors */}
      {treatment.doctors.length > 0 && (
        <section className="py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="font-heading text-2xl font-medium">Specialists for This Treatment</h2>
            <div className="mt-8 grid grid-cols-2 gap-6 lg:grid-cols-4">
              {treatment.doctors.map(({ doctor }) => (
                <DoctorCard key={doctor.id} doctor={doctor} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FAQ */}
      {treatment.faqs.length > 0 && (
        <section className="bg-secondary/30 py-16">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <h2 className="font-heading text-2xl font-medium">Frequently Asked Questions</h2>
            <Accordion type="single" collapsible className="mt-6">
              {treatment.faqs.map((f) => (
                <AccordionItem key={f.id} value={f.id}>
                  <AccordionTrigger className="text-left">{f.question}</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">{f.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="bg-primary py-16 text-center text-primary-foreground">
        <h2 className="font-heading text-3xl font-medium">Ready to get started with {treatment.name}?</h2>
        <div className="mt-6">
          <Button asChild size="lg" className="rounded-full bg-white px-8 text-primary hover:bg-white/90">
            <Link href={`/appointment?treatment=${treatment.slug}`}>Book a Consultation</Link>
          </Button>
        </div>
      </section>
    </>
  );
}

export async function generateStaticParams() {
  const treatments = await getPublishedTreatments();
  return treatments.map((t) => ({ slug: t.slug }));
}
