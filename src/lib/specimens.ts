// Shared by server and client code. Nothing here may read server-only environment variables.

export const SITE_NAME = "Proof";
export const SITE_TAGLINE = "A website that shows its working";

// The date the content last changed. Update it with the content, never from the build clock.
export const LAST_UPDATED = "2026-11-04T00:00:00+00:00";

export const BUILDER = {
  name: "COR Intelligence",
  url: "https://corsolutions.co.uk",
} as const;

export type Specimen = {
  slug: "type" | "colour" | "layout" | "motion" | "forms";
  number: string;
  title: string;
  href: `/${string}`;
  summary: string;
  description: string;
};

export const SPECIMENS: readonly Specimen[] = [
  {
    slug: "type",
    number: "01",
    title: "Type",
    href: "/type",
    summary:
      "A fluid scale that never drops below 12px, and a variable serif you can bend yourself.",
    description:
      "A fluid type scale measured live at your screen width, and a variable serif with four axes to play with.",
  },
  {
    slug: "colour",
    number: "02",
    title: "Colour",
    href: "/colour",
    summary:
      "Every colour token, measured against the others for contrast in both themes.",
    description:
      "The palette, read from the stylesheet and checked for WCAG contrast in your browser, in light and dark.",
  },
  {
    slug: "layout",
    number: "03",
    title: "Layout",
    href: "/layout",
    summary:
      "Components that respond to the space they are given, not the size of the screen.",
    description:
      "Container queries, subgrid and :has(), with a frame you can resize to watch a component rearrange itself.",
  },
  {
    slug: "motion",
    number: "04",
    title: "Motion",
    href: "/motion",
    summary:
      "Movement tied to scrolling and navigation, and switched off when you ask for less.",
    description:
      "Scroll-driven animation and view transitions, each one switched off when your device asks for reduced motion.",
  },
  {
    slug: "forms",
    number: "05",
    title: "Forms",
    href: "/forms",
    summary:
      "A form that works without JavaScript, explains its errors and keeps nothing.",
    description:
      "A test-print order form that validates on the server, works without JavaScript and stores nothing you type.",
  },
];

export function specimenBySlug(slug: Specimen["slug"]): Specimen {
  const found = SPECIMENS.find((s) => s.slug === slug);
  if (!found) throw new Error(`Unknown specimen: ${slug}`);
  return found;
}

export function neighbours(slug: Specimen["slug"]) {
  const i = SPECIMENS.findIndex((s) => s.slug === slug);
  return {
    previous: i > 0 ? SPECIMENS[i - 1] : undefined,
    next: i < SPECIMENS.length - 1 ? SPECIMENS[i + 1] : undefined,
  };
}
