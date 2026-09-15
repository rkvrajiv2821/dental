import Image from "next/image";
import { Parallax } from "@/components/animations/parallax";
import { FadeIn } from "@/components/animations/fade-in";

type Content = { image?: string; caption?: string };

export function ParallaxImageSection({ title, content }: { title?: string | null; content: Content }) {
  if (!content.image) return null;

  return (
    <section className="relative h-[70vh] min-h-[420px] overflow-hidden">
      <Parallax speed={0.18} className="absolute inset-0 h-[130%] w-full">
        <Image src={content.image} alt={title ?? ""} fill sizes="100vw" className="object-cover" />
      </Parallax>
      <div className="absolute inset-0 bg-black/35" />
      {(title || content.caption) && (
        <div className="relative flex h-full items-center justify-center px-4 text-center">
          <FadeIn>
            {title && <h2 className="font-heading text-3xl font-medium text-white sm:text-5xl">{title}</h2>}
            {content.caption && <p className="mt-4 text-white/85">{content.caption}</p>}
          </FadeIn>
        </div>
      )}
    </section>
  );
}
