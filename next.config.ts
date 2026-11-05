import type { NextConfig } from "next";

// Content Security Policy for a statically rendered site. Next.js streams its page data as inline
// scripts, and nonces would force every page to render per request, so script-src allows inline
// scripts. Everything else is locked to this origin. Revisit once a deploy exists to measure a
// hash-based policy against (DECISIONS/0002).
const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' blob: data:",
  "font-src 'self'",
  "connect-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()",
  },
];

// DELIBERATELY NO `images` CONFIG. With no remotePatterns, /_next/image accepts no remote host, which
// keeps the image optimiser's remote-fetch advisories out of reach here.
// ADDING A remotePatterns ENTRY RE-OPENS THAT PATH. If one is ever needed, pin BOTH hostname and
// pathname to a host we control, never a wildcard, and check the Next.js version first.
const nextConfig: NextConfig = {
  experimental: {
    // Off on purpose: on 05/11/2026 a warm build cache kept shipping the previous globals.css after
    // it changed (reproduced by restoring that cache), and Vercel restores .next/cache between builds.
    // A site this size builds in seconds without it.
    turbopackFileSystemCacheForBuild: false,
  },
  cacheComponents: true,
  partialPrefetching: true,
  poweredByHeader: false,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      // Vercel deployment URLs and aliases are never the canonical site: keep them out of search.
      {
        source: "/:path*",
        has: [{ type: "host", value: "(?<host>.*\\.vercel\\.app)" }],
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
    ];
  },
};

export default nextConfig;
