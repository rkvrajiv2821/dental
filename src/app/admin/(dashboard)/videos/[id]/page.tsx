import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { VideoForm } from "@/components/admin/video-form";

export const metadata: Metadata = { title: "Edit Video" };

export default async function EditVideoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const video = await prisma.video.findUnique({ where: { id } });
  if (!video) notFound();
  return <VideoForm video={video} />;
}
