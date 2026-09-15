import type { Metadata } from "next";
import { getPublishedSmileCases } from "@/lib/data/gallery";
import { getPublishedGallery } from "@/lib/data/gallery";
import { BeforeAfterSlider } from "@/components/website/before-after-slider";
import { SectionHeading } from "@/components/website/section-heading";
import { Stagger, StaggerItem } from "@/components/animations/fade-in";
import Image from "next/image";

export const metadata: Metadata = { title: "Smile Gallery", description: "Real before and after results from our patients." };

export default async function SmileGalleryPage() {
  const [cases, clinicPhotos] = await Promise.all([getPublishedSmileCases(), getPublishedGallery(12)]);

  return (
    <div className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading eyebrow="Smile Gallery" title="Real Results, Real Confidence" description="Drag the slider to compare before and after outcomes." align="center" className="mx-auto" />
        <Stagger className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {cases.map((c) => (
            <StaggerItem key={c.id}>
              <BeforeAfterSlider beforeImage={c.beforeImage} afterImage={c.afterImage} />
              <p className="mt-3 text-sm font-medium">{c.title}</p>
              <p className="text-xs text-muted-foreground">
                {c.category} {c.treatment && `· ${c.treatment.name}`}
              </p>
              {c.description && <p className="mt-1 text-sm text-muted-foreground">{c.description}</p>}
            </StaggerItem>
          ))}
        </Stagger>

        {clinicPhotos.length > 0 && (
          <div className="mt-24">
            <SectionHeading eyebrow="Our Clinic" title="Inside Aurelia Dental Studio" align="center" className="mx-auto" />
            <div className="mt-10 columns-2 gap-4 sm:columns-3 lg:columns-4 [&>*]:mb-4">
              {clinicPhotos.map((photo) => (
                <div key={photo.id} className="relative overflow-hidden rounded-xl bg-muted">
                  <Image src={photo.image} alt={photo.title ?? ""} width={400} height={500} className="w-full object-cover" />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
