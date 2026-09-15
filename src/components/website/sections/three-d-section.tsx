import { ThreeDToothSection } from "@/components/three/three-d-tooth-section";

type Content = { enabled?: boolean; labels?: string[] };

export function ThreeDSection({ title, subtitle, content }: { title?: string | null; subtitle?: string | null; content: Content }) {
  if (content.enabled === false) return null;
  return <ThreeDToothSection title={title} subtitle={subtitle} labels={content.labels} />;
}
