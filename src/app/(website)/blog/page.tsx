import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/db/prisma";
import { getBlogCategories } from "@/lib/data/blog";
import { formatDate, readingTime } from "@/lib/format";
import { SectionHeading } from "@/components/website/section-heading";
import { FadeIn, Stagger, StaggerItem } from "@/components/animations/fade-in";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Blog", description: "Educational articles from our dental team." };

const PAGE_SIZE = 9;

export default async function BlogListPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; page?: string }>;
}) {
  const { category, page } = await searchParams;
  const pageNum = Math.max(1, Number(page) || 1);
  const categories = await getBlogCategories();
  const activeCategory = categories.find((c) => c.slug === category);

  const where = {
    status: "PUBLISHED" as const,
    publishedAt: { lte: new Date() },
    ...(activeCategory ? { categoryId: activeCategory.id } : {}),
  };

  const [posts, total, featured] = await Promise.all([
    prisma.blogPost.findMany({
      where,
      include: { category: true, author: true },
      orderBy: { publishedAt: "desc" },
      skip: pageNum === 1 ? 1 : (pageNum - 1) * PAGE_SIZE + 1,
      take: PAGE_SIZE,
    }),
    prisma.blogPost.count({ where }),
    pageNum === 1 ? prisma.blogPost.findFirst({ where, include: { category: true }, orderBy: { publishedAt: "desc" } }) : null,
  ]);

  const totalPages = Math.max(1, Math.ceil((total - 1) / PAGE_SIZE) + 1);

  return (
    <div className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading eyebrow="Journal" title="Dental Health & Care Insights" align="center" className="mx-auto" />

        <div className="mt-8 flex flex-wrap justify-center gap-2">
          <Link
            href="/blog"
            className={cn("rounded-full border px-4 py-1.5 text-sm", !activeCategory ? "border-primary bg-primary text-primary-foreground" : "border-border text-muted-foreground hover:border-primary")}
          >
            All
          </Link>
          {categories.map((c) => (
            <Link
              key={c.id}
              href={`/blog?category=${c.slug}`}
              className={cn("rounded-full border px-4 py-1.5 text-sm", activeCategory?.id === c.id ? "border-primary bg-primary text-primary-foreground" : "border-border text-muted-foreground hover:border-primary")}
            >
              {c.name}
            </Link>
          ))}
        </div>

        {featured && (
          <FadeIn className="mt-12">
            <Link href={`/blog/${featured.slug}`} className="group grid grid-cols-1 gap-6 overflow-hidden rounded-3xl border border-border bg-card lg:grid-cols-2">
              <div className="relative aspect-[16/10] bg-muted lg:aspect-auto">
                {featured.featuredImage && <Image src={featured.featuredImage} alt={featured.title} fill className="object-cover transition-transform duration-700 group-hover:scale-105" />}
              </div>
              <div className="flex flex-col justify-center p-8">
                {featured.category && <span className="text-xs font-semibold uppercase tracking-wider text-primary">{featured.category.name}</span>}
                <h2 className="mt-3 font-heading text-2xl font-medium group-hover:text-primary">{featured.title}</h2>
                {featured.excerpt && <p className="mt-3 text-muted-foreground">{featured.excerpt}</p>}
                <p className="mt-4 text-xs text-muted-foreground">
                  {featured.publishedAt && formatDate(featured.publishedAt)} · {readingTime(featured.content)} min read
                </p>
              </div>
            </Link>
          </FadeIn>
        )}

        <Stagger className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <StaggerItem key={post.id}>
              <Link href={`/blog/${post.slug}`} className="group flex flex-col">
                <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-muted">
                  {post.featuredImage && <Image src={post.featuredImage} alt={post.title} fill className="object-cover transition-transform duration-700 group-hover:scale-105" />}
                </div>
                <div className="mt-4">
                  {post.category && <span className="text-xs font-semibold uppercase tracking-wider text-primary">{post.category.name}</span>}
                  <h3 className="mt-2 font-heading text-lg font-medium group-hover:text-primary">{post.title}</h3>
                  {post.publishedAt && <p className="mt-2 text-xs text-muted-foreground">{formatDate(post.publishedAt)}</p>}
                </div>
              </Link>
            </StaggerItem>
          ))}
        </Stagger>

        {posts.length === 0 && !featured && (
          <p className="mt-12 text-center text-muted-foreground">No articles published yet.</p>
        )}

        {totalPages > 1 && (
          <div className="mt-12 flex justify-center gap-2">
            {Array.from({ length: totalPages }).map((_, i) => (
              <Link
                key={i}
                href={`/blog?${activeCategory ? `category=${activeCategory.slug}&` : ""}page=${i + 1}`}
                className={cn("flex h-9 w-9 items-center justify-center rounded-full border text-sm", pageNum === i + 1 ? "border-primary bg-primary text-primary-foreground" : "border-border text-muted-foreground hover:border-primary")}
              >
                {i + 1}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
