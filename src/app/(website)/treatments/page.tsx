import type { Metadata } from "next";
import { getPublishedTreatments, getTreatmentCategories } from "@/lib/data/treatments";
import { TreatmentCard } from "@/components/website/treatment-card";
import { SectionHeading } from "@/components/website/section-heading";
import { Stagger, StaggerItem } from "@/components/animations/fade-in";

export const metadata: Metadata = {
  title: "Treatments",
  description: "Explore our full range of dental treatments, from general dentistry to advanced cosmetic and implant procedures.",
};

export default async function TreatmentsPage() {
  const [treatments, categories] = await Promise.all([getPublishedTreatments(), getTreatmentCategories()]);

  return (
    <div className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading eyebrow="Treatments" title="Comprehensive Dental Care" description="From routine checkups to advanced procedures, every treatment is tailored to your goals." align="center" className="mx-auto" />

        {categories.map((category) => {
          const items = treatments.filter((t) => t.categoryId === category.id);
          if (items.length === 0) return null;
          return (
            <div key={category.id} className="mt-16">
              <h2 className="font-heading text-2xl font-medium">{category.name}</h2>
              <Stagger className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((t) => (
                  <StaggerItem key={t.id}>
                    <TreatmentCard treatment={t} />
                  </StaggerItem>
                ))}
              </Stagger>
            </div>
          );
        })}

        {treatments.filter((t) => !t.categoryId).length > 0 && (
          <div className="mt-16">
            <h2 className="font-heading text-2xl font-medium">Other Treatments</h2>
            <Stagger className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {treatments
                .filter((t) => !t.categoryId)
                .map((t) => (
                  <StaggerItem key={t.id}>
                    <TreatmentCard treatment={t} />
                  </StaggerItem>
                ))}
            </Stagger>
          </div>
        )}
      </div>
    </div>
  );
}
