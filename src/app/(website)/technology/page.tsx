import type { Metadata } from "next";
import Image from "next/image";
import { getPublishedTechnologies } from "@/lib/data/misc";
import { SectionHeading } from "@/components/website/section-heading";
import { Stagger, StaggerItem } from "@/components/animations/fade-in";

export const metadata: Metadata = { title: "Technology", description: "Explore the advanced dental technology behind our treatments." };

export default async function TechnologyPage() {
  const technologies = await getPublishedTechnologies();

  return (
    <div className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading eyebrow="Technology" title="Modern Dentistry, Powered by Precision" description="From digital scanning to same-day restorations, our equipment is chosen to make every visit faster and more comfortable." align="center" className="mx-auto" />
        <Stagger className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {technologies.map((tech) => (
            <StaggerItem key={tech.id} className="overflow-hidden rounded-2xl border border-border bg-card">
              <div className="relative aspect-[4/3] bg-muted">
                {tech.image && <Image src={tech.image} alt={tech.name} fill className="object-cover" />}
              </div>
              <div className="p-6">
                <h3 className="font-heading text-lg font-medium">{tech.name}</h3>
                {tech.description && <p className="mt-2 text-sm text-muted-foreground">{tech.description}</p>}
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </div>
  );
}
