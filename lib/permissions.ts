export const MODULES = [
  "dashboard",
  "users",
  "programs",
  "blog",
  "gallery",
  "beneficiaries",
  "events",
  "partners",
  "team",
  "jobs",
  "contacts",
  "volunteers",
  "donations",
  "settings",
  "audit-logs",
] as const;

export type ModuleName = (typeof MODULES)[number];
export type PermissionLevel = "none" | "read" | "crud";

export type Permissions = Record<string, PermissionLevel>;

export const DEFAULT_PERMISSIONS: Permissions = Object.fromEntries(
  MODULES.map((m) => [m, "crud"]),
) as Permissions;

export const READONLY_PERMISSIONS: Permissions = Object.fromEntries(
  MODULES.map((m) => [m, "read"]),
) as Permissions;

export function canAccess(permissions: Permissions | null | undefined, module: ModuleName, level: "read" | "crud"): boolean {
  if (!permissions) return false;
  const p = permissions[module];
  if (!p || p === "none") return false;
  if (level === "read") return p === "read" || p === "crud";
  if (level === "crud") return p === "crud";
  return false;
}

export function moduleLabel(module: ModuleName): string {
  const labels: Record<string, string> = {
    dashboard: "Dashboard",
    users: "Users",
    programs: "Programs & Projects",
    blog: "Blog Posts",
    gallery: "Gallery",
    beneficiaries: "Beneficiaries",
    events: "Events",
    partners: "Partners",
    team: "Team Members",
    jobs: "Jobs",
    contacts: "Contact Messages",
    volunteers: "Volunteers",
    donations: "Donations",
    settings: "Site Settings",
    "audit-logs": "Audit Logs",
  };
  return labels[module] ?? module;
}
