import { getNavigation, getSiteSettings } from "@/lib/data/settings";
import { HeaderClient } from "./header-client";

export async function Header() {
  const [navItems, settings] = await Promise.all([getNavigation("HEADER"), getSiteSettings()]);

  return (
    <HeaderClient
      clinicName={settings.clinicName}
      logoUrl={settings.logoUrl}
      phone={settings.phone}
      navItems={navItems.map((n) => ({
        id: n.id,
        label: n.label,
        url: n.url,
        openInNewTab: n.openInNewTab,
        children: n.children.map((c) => ({ id: c.id, label: c.label, url: c.url, openInNewTab: c.openInNewTab })),
      }))}
    />
  );
}
