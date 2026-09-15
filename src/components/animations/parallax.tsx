"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

/** GSAP ScrollTrigger-driven parallax. Registers the plugin lazily, client-side only. */
export function Parallax({
  children,
  className,
  speed = 0.25,
}: {
  children: React.ReactNode;
  className?: string;
  speed?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let ctx: { revert: () => void } | undefined;

    (async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      gsap.registerPlugin(ScrollTrigger);
      if (!ref.current) return;

      ctx = gsap.context(() => {
        gsap.to(ref.current, {
          yPercent: speed * 100,
          ease: "none",
          scrollTrigger: {
            trigger: ref.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });
      });
    })();

    return () => ctx?.revert();
  }, [speed]);

  return (
    <div ref={ref} className={cn("will-change-transform", className)}>
      {children}
    </div>
  );
}
