"use client";

import { useRef, useState, Suspense } from "react";
import dynamic from "next/dynamic";
import { useScroll, useMotionValueEvent, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

const ToothModel = dynamic(() => import("./tooth-model"), {
  ssr: false,
  loading: () => <div className="h-full w-full animate-pulse rounded-3xl bg-white/5" />,
});

const STAGES = [
  { label: "Enamel", description: "The hardest substance in the human body — a translucent shield that protects against decay and daily wear." },
  { label: "Dentin", description: "A dense, bony layer beneath the enamel that absorbs pressure and transmits sensation to the nerve." },
  { label: "Pulp", description: "The living core of the tooth, containing nerves and blood vessels that keep it nourished." },
  { label: "Root", description: "Anchors the tooth into the jawbone, held firmly in place by the periodontal ligament." },
];

export function ThreeDToothSection({
  title,
  subtitle,
  labels,
}: {
  title?: string | null;
  subtitle?: string | null;
  labels?: string[];
}) {
  const reduceMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const [stage, setStage] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setStage(Math.min(STAGES.length - 1, Math.floor(v * STAGES.length)));
  });

  if (reduceMotion) {
    return (
      <section className="bg-foreground py-20 text-background sm:py-28">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          {subtitle && <p className="text-sm font-semibold uppercase tracking-widest text-primary">{subtitle}</p>}
          {title && <h2 className="mt-2 font-heading text-3xl font-medium sm:text-4xl">{title}</h2>}
          <div className="mt-10 grid grid-cols-2 gap-4 text-left sm:grid-cols-4">
            {STAGES.map((s) => (
              <div key={s.label} className="rounded-xl border border-white/10 p-4">
                <p className="font-heading text-base">{labels?.[STAGES.indexOf(s)] ?? s.label}</p>
                <p className="mt-1 text-xs text-white/60">{s.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section ref={containerRef} className="relative bg-foreground text-background" style={{ height: "320vh" }}>
      <div className="sticky top-0 flex h-screen flex-col overflow-hidden">
        <div className="mx-auto w-full max-w-7xl flex-1 px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid h-full grid-cols-1 items-center gap-10 lg:grid-cols-2">
            <div>
              {subtitle && <p className="text-sm font-semibold uppercase tracking-widest text-primary">{subtitle}</p>}
              {title && <h2 className="mt-2 font-heading text-3xl font-medium sm:text-4xl">{title}</h2>}
              <div className="mt-8 space-y-3">
                {STAGES.map((s, i) => (
                  <div
                    key={s.label}
                    className={cn(
                      "rounded-xl border p-4 transition-all duration-300",
                      i === stage ? "border-primary bg-primary/10" : "border-white/10 opacity-50"
                    )}
                  >
                    <p className="font-heading text-base">{labels?.[i] ?? s.label}</p>
                    {i === stage && <p className="mt-1 text-sm text-white/70">{s.description}</p>}
                  </div>
                ))}
              </div>
            </div>
            <div className="relative h-[50vh] lg:h-[70vh]">
              <Suspense fallback={<div className="h-full w-full animate-pulse rounded-3xl bg-white/5" />}>
                <ToothModel stage={stage} />
              </Suspense>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
