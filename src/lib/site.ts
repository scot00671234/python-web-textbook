/** Visible site name (header, titles, Open Graph). */
export const SITE_NAME = "pylearn";

/** Default meta description when a page omits its own. */
export const DEFAULT_DESCRIPTION =
  "pylearn: free, browser-based Python lessons in order, with flashcards, plain-English readings, and typing practice. No account required.";

/**
 * Canonical / absolute URL base for SEO (Open Graph, JSON-LD).
 * Set `VITE_SITE_URL` in production (e.g. https://example.com) so previews and crawlers
 * get a stable origin before client navigation. Falls back to `window.location.origin`.
 * Production builds also emit `dist/sitemap.xml` and a `Sitemap:` line in `dist/robots.txt` when this is set.
 */
export function getCanonicalBase(): string {
  const raw = import.meta.env.VITE_SITE_URL as string | undefined;
  const trimmed = raw?.trim().replace(/\/$/, "");
  if (trimmed && /^https?:\/\//i.test(trimmed)) return trimmed;
  if (typeof window !== "undefined") return window.location.origin;
  return "";
}
