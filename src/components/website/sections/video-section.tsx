import { SectionHeading } from "@/components/website/section-heading";
import { FadeIn } from "@/components/animations/fade-in";

type Content = { url?: string; provider?: string };

function toEmbedUrl(url: string, provider?: string) {
  if (provider === "VIMEO" || url.includes("vimeo.com")) {
    const id = url.split("/").pop();
    return `https://player.vimeo.com/video/${id}`;
  }
  const ytMatch = url.match(/(?:youtu\.be\/|v=|embed\/)([\w-]{11})/);
  if (ytMatch) return `https://www.youtube-nocookie.com/embed/${ytMatch[1]}`;
  return url;
}

export function VideoSection({ title, subtitle, content }: { title?: string | null; subtitle?: string | null; content: Content }) {
  if (!content.url) return null;

  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <SectionHeading eyebrow={subtitle} title={title} align="center" className="mx-auto mb-10" />
        <FadeIn>
          <div className="aspect-video overflow-hidden rounded-2xl border border-border bg-black">
            <iframe
              src={toEmbedUrl(content.url, content.provider)}
              className="h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title={title ?? "Video"}
            />
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
