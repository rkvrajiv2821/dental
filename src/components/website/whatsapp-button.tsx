import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export function WhatsAppButton({
  number,
  message,
  position = "bottom-right",
  enabled = true,
}: {
  number?: string | null;
  message?: string | null;
  position?: string;
  enabled?: boolean;
}) {
  if (!enabled || !number) return null;

  const href = `https://wa.me/${number.replace(/\D/g, "")}?text=${encodeURIComponent(
    message ?? "Hello! I would like to book an appointment."
  )}`;

  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className={cn(
        "fixed z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-black/20 transition-transform hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#25D366]",
        position === "bottom-left" ? "bottom-5 left-5 md:bottom-8 md:left-8" : "bottom-5 right-5 md:bottom-8 md:right-8"
      )}
    >
      <MessageCircle className="h-7 w-7" fill="white" strokeWidth={0} />
      <span className="absolute inset-0 -z-10 animate-ping rounded-full bg-[#25D366]/60 motion-reduce:animate-none" />
    </Link>
  );
}
