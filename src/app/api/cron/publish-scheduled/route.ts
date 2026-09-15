import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { revalidatePath } from "next/cache";

/** Flips any SCHEDULED blog posts whose publishedAt has arrived to PUBLISHED. Triggered by Vercel Cron. */
export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const due = await prisma.blogPost.findMany({
    where: { status: "SCHEDULED", publishedAt: { lte: new Date() } },
    select: { id: true, slug: true },
  });

  if (due.length > 0) {
    await prisma.blogPost.updateMany({
      where: { id: { in: due.map((p) => p.id) } },
      data: { status: "PUBLISHED" },
    });
    revalidatePath("/blog");
    for (const p of due) revalidatePath(`/blog/${p.slug}`);
  }

  return NextResponse.json({ published: due.length });
}
