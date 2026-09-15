import type { Metadata } from "next";
import { Header } from "@/components/website/header";
import { Footer } from "@/components/website/footer";
import { WhatsAppButton } from "@/components/website/whatsapp-button";
import { GoogleAnalytics } from "@/components/website/google-analytics";
import { getSiteSettings, getSeoSettings } from "@/lib/data/settings";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSeoSettings();
  return {
    title: { default: seo.defaultTitle, template: seo.titleTemplate },
    description: seo.defaultDescription ?? undefined,
    robots: { index: seo.robotsIndex, follow: seo.robotsFollow },
    verification: {
      google: seo.gscVerification ?? undefined,
      other: seo.bingVerification ? { "msvalidate.01": seo.bingVerification } : undefined,
    },
    openGraph: {
      title: seo.defaultTitle,
      description: seo.defaultDescription ?? undefined,
      images: seo.defaultOgImage ? [seo.defaultOgImage] : undefined,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: seo.defaultTitle,
      description: seo.defaultDescription ?? undefined,
    },
  };
}

export default async function WebsiteLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSiteSettings();

  return (
    <>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <WhatsAppButton
        number={settings.whatsappNumber}
        message={settings.whatsappMessage}
        position={settings.whatsappPosition}
        enabled={settings.whatsappEnabled}
      />
      <GoogleAnalytics id={settings.googleAnalyticsId} />
    </>
  );
}
