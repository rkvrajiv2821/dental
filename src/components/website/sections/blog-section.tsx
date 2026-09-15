import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/website/section-heading";
import { Stagger, StaggerItem } from "@/components/animations/fade-in";
import { formatDate } from "@/lib/format";
import { getPublishedPosts } from "@/lib/data/blog";

export async function BlogSection({ title, subtitle, content }: { title?: string | null; subtitle?: string | null; content: { limit?: number } }) {
  const posts = await getPublishedPosts(content.limit ?? 3);
  if (posts.length === 0) return null;

  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <SectionHeading eyebrow={subtitle} title={title} />
          <Button asChild variant="outline" className="rounded-full">
            <Link href="/blog">Read the Journal</Link>
          </Button>
        </div>
        <Stagger className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <StaggerItem key={post.id}>
              <Link href={`/blog/${post.slug}`} className="group flex flex-col">
                <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-muted">
                  {post.featuredImage && (
                    <Image
                      src={post.featuredImage}
                      alt={post.title}
                      fill
                      sizes="(min-width: 1024px) 33vw, 100vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  )}
                </div>
                <div className="mt-4">
                  {post.category && (
                    <span className="text-xs font-semibold uppercase tracking-wider text-primary">{post.category.name}</span>
                  )}
                  <h3 className="mt-2 font-heading text-lg font-medium text-foreground group-hover:text-primary">{post.title}</h3>
                  {post.publishedAt && (
                    <p className="mt-2 text-xs text-muted-foreground">{formatDate(post.publishedAt)}</p>
                  )}
                </div>
              </Link>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
