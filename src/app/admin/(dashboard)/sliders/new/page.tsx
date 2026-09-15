import type { Metadata } from "next";
import { SliderForm } from "@/components/admin/slider-form";

export const metadata: Metadata = { title: "Add Slide" };

export default function NewSliderPage() {
  return <SliderForm />;
}
