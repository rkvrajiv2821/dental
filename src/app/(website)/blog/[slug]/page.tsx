import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/db/prisma";
import { getPostBySlug, getPublishedPosts } from "@/lib/data/blog";
import { formatDate, readingTime } from "@/lib/format";
import { FadeIn } from "@/components/animations/fade-in";
import { Badge } from "@/components/ui/badge";
import { articleJsonLd, breadcrumbJsonLd } from "@/lib/seo/json-ld";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};
  return {
    title: post.seoTitle ?? post.title,
    description: post.seoDescription ?? post.excerpt ?? undefined,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      title: post.seoTitle ?? post.title,
      description: post.seoDescription ?? post.excerpt ?? undefined,
      images: post.ogImage ?? post.featuredImage ? [post.ogImage ?? post.featuredImage!] : undefined,
      type: "article",
    },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  await prisma.blogPost.update({ where: { id: post.id }, data: { views: { increment: 1 } } }).catch(() => {});

  const related = await prisma.blogPost.findMany({
    where: { status: "PUBLISHED", id: { not: post.id }, categoryId: post.categoryId ?? undefined },
    take: 3,
    orderBy: { publishedAt: "desc" },
  });

  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            articleJsonLd({
              title: post.title,
              excerpt: post.excerpt,
              featuredImage: post.featuredImage,
              slug: post.slug,
              publishedAt: post.publishedAt,
              updatedAt: post.updatedAt,
              authorName: post.author?.name,
            })
          ),
        }}
      />
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: "Home", url: "/" },
              { name: "Blog", url: "/blog" },
              { name: post.title, url: `/blog/${post.slug}` },
            ])
          ),
        }}
      />

      <article className="py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <FadeIn>
            {post.category && (
              <Link href={`/blog?category=${post.category.slug}`} className="text-sm font-semibold uppercase tracking-widest text-primary">
                {post.category.name}
              </Link>
            )}
            <h1 className="mt-3 font-heading text-3xl font-medium sm:text-4xl">{post.title}</h1>
            <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              {post.author && <span>By {post.author.name}</span>}
              {post.publishedAt && <span>· {formatDate(post.publishedAt)}</span>}
              <span>· {readingTime(post.content)} min read</span>
            </div>
          </FadeIn>

          {post.featuredImage && (
            <FadeIn delay={0.1} className="relative mt-8 aspect-[16/9] overflow-hidden rounded-2xl bg-muted">
              <Image src={post.featuredImage} alt={post.title} fill priority className="object-cover" />
            </FadeIn>
          )}

          <FadeIn delay={0.15}>
            <div className="prose prose-neutral mt-10 max-w-none" dangerouslySetInnerHTML={{ __html: post.content }} />
          </FadeIn>

          {post.tags.length > 0 && (
            <div className="mt-8 flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <Badge key={tag.id} variant="secondary" className="font-normal">
                  {tag.name}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </article>

      {related.length > 0 && (
        <section className="bg-secondary/30 py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="font-heading text-2xl font-medium">Related Articles</h2>
            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
              {related.map((r) => (
                <Link key={r.id} href={`/blog/${r.slug}`} className="group">
                  <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-muted">
                    {r.featuredImage && <Image src={r.featuredImage} alt={r.title} fill className="object-cover transition-transform duration-700 group-hover:scale-105" />}
                  </div>
                  <h3 className="mt-3 font-heading text-base font-medium group-hover:text-primary">{r.title}</h3>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}

export async function generateStaticParams() {
  const posts = await getPublishedPosts();
  return posts.map((p) => ({ slug: p.slug }));
}
