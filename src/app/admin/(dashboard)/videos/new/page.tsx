import type { Metadata } from "next";
import { VideoForm } from "@/components/admin/video-form";

export const metadata: Metadata = { title: "Add Video" };

export default function NewVideoPage() {
  return <VideoForm />;
}
