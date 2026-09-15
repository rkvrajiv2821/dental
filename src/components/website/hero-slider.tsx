import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getActiveSliders } from "@/lib/data/sliders";
import { HeroSliderClient } from "./hero-slider-client";

export async function HeroSlider() {
  const slides = await getActiveSliders();

  if (slides.length === 0) {
    return (
      <section className="relative flex h-[92vh] min-h-[560px] w-full items-center overflow-hidden bg-gradient-to-br from-primary/95 via-primary to-accent-foreground/90 text-primary-foreground">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="mb-4 inline-block rounded-full bg-white/10 px-4 py-1.5 text-xs font-medium uppercase tracking-widest backdrop-blur-sm">
              Premium Dental Care
            </p>
            <h1 className="font-heading text-4xl font-medium leading-[1.08] sm:text-5xl lg:text-6xl">
              A Smile Designed Around You
            </h1>
            <p className="mt-6 max-w-lg text-lg text-primary-foreground/80">
              Add a slide from Admin → Hero Sliders to replace this default hero with your own imagery and messaging.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button asChild size="lg" className="rounded-full bg-white px-7 text-base text-primary hover:bg-white/90">
                <Link href="/appointment">Book Appointment</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return <HeroSliderClient slides={slides} />;
}
