export type Role = "SUPER_ADMIN" | "CONTENT_MANAGER" | "RECEPTION" | "SEO_MANAGER";

export type Resource =
  | "homepage"
  | "sliders"
  | "treatments"
  | "doctors"
  | "testimonials"
  | "gallery"
  | "technology"
  | "videos"
  | "faq"
  | "blog"
  | "media"
  | "appointments"
  | "enquiries"
  | "seo"
  | "settings"
  | "navigation"
  | "users";

const CONTENT_RESOURCES: Resource[] = [
  "homepage",
  "sliders",
  "treatments",
  "doctors",
  "testimonials",
  "gallery",
  "technology",
  "videos",
  "faq",
  "blog",
  "media",
  "navigation",
];

const PERMISSIONS: Record<Role, Resource[] | "*"> = {
  SUPER_ADMIN: "*",
  CONTENT_MANAGER: CONTENT_RESOURCES,
  RECEPTION: ["appointments", "enquiries", "testimonials"],
  SEO_MANAGER: ["seo", "blog"],
};

export function can(role: Role | undefined, resource: Resource): boolean {
  if (!role) return false;
  const allowed = PERMISSIONS[role];
  if (allowed === "*") return true;
  return allowed.includes(resource);
}

export function assertCan(role: Role | undefined, resource: Resource) {
  if (!can(role, resource)) {
    throw new Error(`Forbidden: role "${role ?? "none"}" cannot access "${resource}"`);
  }
}
