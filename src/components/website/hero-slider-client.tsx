"use client";

import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type SlideData = {
  id: string;
  title: string;
  subtitle: string | null;
  desktopImage: string;
  mobileImage: string | null;
  backgroundVideo: string | null;
  overlay: boolean;
  ctaText: string | null;
  ctaUrl: string | null;
  ctaText2: string | null;
  ctaUrl2: string | null;
  textPosition: string;
};

export function HeroSliderClient({ slides }: { slides: SlideData[] }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: slides.length > 1 });
  const [selected, setSelected] = useState(0);
  const reduceMotion = useReducedMotion();

  const onSelect = useCallback(() => {
    if (emblaApi) setSelected(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    // Sync the initially-selected slide once the carousel API attaches; further
    // updates come through the "select" subscription below, not this call.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    onSelect();
    emblaApi.on("select", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect]);

  useEffect(() => {
    if (!emblaApi || slides.length <= 1 || reduceMotion) return;
    const id = setInterval(() => emblaApi.scrollNext(), 6500);
    return () => clearInterval(id);
  }, [emblaApi, slides.length, reduceMotion]);

  if (slides.length === 0) return null;

  return (
    <section className="relative h-[92vh] min-h-[560px] w-full overflow-hidden bg-foreground">
      <div className="h-full" ref={emblaRef}>
        <div className="flex h-full">
          {slides.map((slide, i) => (
            <div key={slide.id} className="relative h-full min-w-0 flex-[0_0_100%]">
              <Image
                src={slide.desktopImage}
                alt={slide.title}
                fill
                priority={i === 0}
                sizes="100vw"
                className="hidden object-cover md:block"
              />
              <Image
                src={slide.mobileImage ?? slide.desktopImage}
                alt={slide.title}
                fill
                priority={i === 0}
                sizes="100vw"
                className="block object-cover md:hidden"
              />
              {slide.overlay && (
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-black/10" />
              )}

              <div
                className={cn(
                  "absolute inset-0 flex items-end pb-24 sm:items-center sm:pb-0",
                  slide.textPosition === "center" && "sm:justify-center sm:text-center",
                  slide.textPosition === "right" && "sm:justify-end sm:text-right"
                )}
              >
                <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
                  <div className={cn("max-w-2xl", slide.textPosition === "right" && "ml-auto")}>
                    <motion.p
                      initial={{ opacity: 0, y: 16 }}
                      animate={selected === i ? { opacity: 1, y: 0 } : {}}
                      transition={{ delay: 0.1, duration: 0.6 }}
                      className="mb-4 inline-block rounded-full bg-white/10 px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-white backdrop-blur-sm"
                    >
                      {slide.subtitle ?? "Premium Dental Care"}
                    </motion.p>
                    <motion.h1
                      initial={{ opacity: 0, y: 24 }}
                      animate={selected === i ? { opacity: 1, y: 0 } : {}}
                      transition={{ delay: 0.2, duration: 0.7 }}
                      className="font-heading text-4xl font-medium leading-[1.08] text-white sm:text-5xl lg:text-6xl"
                    >
                      {slide.title}
                    </motion.h1>
                    <motion.div
                      initial={{ opacity: 0, y: 16 }}
                      animate={selected === i ? { opacity: 1, y: 0 } : {}}
                      transition={{ delay: 0.35, duration: 0.6 }}
                      className="mt-8 flex flex-wrap gap-4"
                    >
                      {slide.ctaText && slide.ctaUrl && (
                        <Button asChild size="lg" className="rounded-full px-7 text-base">
                          <Link href={slide.ctaUrl}>{slide.ctaText}</Link>
                        </Button>
                      )}
                      {slide.ctaText2 && slide.ctaUrl2 && (
                        <Button
                          asChild
                          size="lg"
                          variant="outline"
                          className="rounded-full border-white/60 bg-white/5 px-7 text-base text-white backdrop-blur-sm hover:bg-white/15 hover:text-white"
                        >
                          <Link href={slide.ctaUrl2}>{slide.ctaText2}</Link>
                        </Button>
                      )}
                    </motion.div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {slides.length > 1 && (
        <>
          <button
            aria-label="Previous slide"
            onClick={() => emblaApi?.scrollPrev()}
            className="absolute left-4 top-1/2 hidden -translate-y-1/2 rounded-full border border-white/30 p-2.5 text-white transition-colors hover:bg-white/10 sm:flex"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            aria-label="Next slide"
            onClick={() => emblaApi?.scrollNext()}
            className="absolute right-4 top-1/2 hidden -translate-y-1/2 rounded-full border border-white/30 p-2.5 text-white transition-colors hover:bg-white/10 sm:flex"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
          <div className="absolute bottom-8 left-1/2 flex -translate-x-1/2 gap-2">
            {slides.map((s, i) => (
              <button
                key={s.id}
                aria-label={`Go to slide ${i + 1}`}
                onClick={() => emblaApi?.scrollTo(i)}
                className={cn(
                  "h-1.5 rounded-full transition-all",
                  i === selected ? "w-8 bg-white" : "w-4 bg-white/40"
                )}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
