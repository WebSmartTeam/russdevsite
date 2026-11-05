// Server-side only: the canonical origin used for metadata, the sitemap and robots.txt.
//
// On Vercel it comes from VERCEL_PROJECT_PRODUCTION_URL, so a preview build still points its canonical
// at production. Anywhere else, SITE_URL must be set. There is deliberately no default: a guessed
// origin would ship wrong canonicals silently.

function resolveSiteUrl(): URL {
  const explicit = process.env.SITE_URL?.trim();
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  const raw = explicit || (vercel ? `https://${vercel}` : "");
  if (!raw) {
    throw new Error(
      "SITE_URL is not set. On Vercel it comes from VERCEL_PROJECT_PRODUCTION_URL; " +
        "for a build anywhere else, set SITE_URL to the canonical origin (for example https://example.com).",
    );
  }
  const url = new URL(raw);
  if (url.protocol !== "https:") {
    throw new Error(`SITE_URL must use https, got ${url.protocol}`);
  }
  return new URL(url.origin);
}

export const SITE_URL = resolveSiteUrl();

// Absolute URL for a site path. Paths are written without a trailing slash, so only the root keeps one.
export function absolute(path: `/${string}`): string {
  if (path !== "/" && path.endsWith("/")) {
    throw new Error(`Site paths take no trailing slash: ${path}`);
  }
  return new URL(path, SITE_URL).toString();
}
