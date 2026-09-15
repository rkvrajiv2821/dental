import type { Resource } from "@/lib/auth/rbac";

export type NavItem = { label: string; href: string; resource: Resource };
export type NavGroup = { label: string; items: NavItem[] };

export const ADMIN_NAV: NavGroup[] = [
  {
    label: "Overview",
    items: [{ label: "Dashboard", href: "/admin/dashboard", resource: "homepage" }],
  },
  {
    label: "Website",
    items: [
      { label: "Homepage Sections", href: "/admin/homepage", resource: "homepage" },
      { label: "Hero Sliders", href: "/admin/sliders", resource: "sliders" },
      { label: "Navigation", href: "/admin/navigation", resource: "navigation" },
    ],
  },
  {
    label: "Content",
    items: [
      { label: "Treatments", href: "/admin/treatments", resource: "treatments" },
      { label: "Doctors", href: "/admin/doctors", resource: "doctors" },
      { label: "Testimonials", href: "/admin/testimonials", resource: "testimonials" },
      { label: "Smile Gallery", href: "/admin/smile-cases", resource: "gallery" },
      { label: "Clinic Gallery", href: "/admin/gallery", resource: "gallery" },
      { label: "Technology", href: "/admin/technology", resource: "technology" },
      { label: "Videos", href: "/admin/videos", resource: "videos" },
      { label: "FAQs", href: "/admin/faqs", resource: "faq" },
    ],
  },
  {
    label: "Blog",
    items: [
      { label: "All Posts", href: "/admin/blog", resource: "blog" },
      { label: "Categories", href: "/admin/blog/categories", resource: "blog" },
      { label: "Tags", href: "/admin/blog/tags", resource: "blog" },
    ],
  },
  {
    label: "Leads",
    items: [
      { label: "Appointments", href: "/admin/appointments", resource: "appointments" },
      { label: "Enquiries", href: "/admin/enquiries", resource: "enquiries" },
    ],
  },
  {
    label: "System",
    items: [
      { label: "Media Library", href: "/admin/media", resource: "media" },
      { label: "SEO", href: "/admin/seo", resource: "seo" },
      { label: "Settings", href: "/admin/settings", resource: "settings" },
      { label: "Users", href: "/admin/users", resource: "users" },
    ],
  },
];
