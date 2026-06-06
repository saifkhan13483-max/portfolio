/** Public paths to the logo variants served from /public. */
export const LOGO_LIGHT = "/logo-light.png";
export const LOGO_DARK = "/logo-dark.png";

/**
 * Canonical production URL of the site.
 * Reads from VITE_SITE_URL at build time; falls back to the primary domain.
 * Used in page-level JSON-LD schemas — keep this in sync with seo.ts.
 */
export const SITE_URL = import.meta.env.VITE_SITE_URL || "https://saifcraft.dev";

/**
 * Site-wide stats shown across the home, portfolio, and about pages.
 * Update these here so they stay consistent everywhere.
 */
export const SITE_STATS = {
  projectsDelivered: "48+",
  happyClients: "29+",
  yearsExperience: "7+",
  satisfactionRate: "94%",
} as const;
