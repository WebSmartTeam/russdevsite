# Proof.

A test website that shows its working. Its subject is itself: every number on it is measured live in
the visitor's browser, so nothing on it is invented. Built by COR Intelligence.

| Page | What it demonstrates |
|---|---|
| `/` | The "Show the working" overlay and live performance numbers for the visit |
| `/type` | A fluid type scale with a 12px floor, and a four-axis variable font playground |
| `/colour` | The palette read from the stylesheet and contrast-checked in the browser, light and dark |
| `/layout` | Container queries in a resizable frame, subgrid, and a CSS `:has()` checklist |
| `/motion` | Scroll-driven animation and view transitions, all off under reduced motion |
| `/forms` | A Server Action form that validates on the server, works without JavaScript and stores nothing |

## Build

```bash
npm ci
SITE_URL=https://russdevsite.invalid npm run build
npm run lint
```

`SITE_URL` sets the canonical origin and is required off Vercel; on Vercel it comes from
`VERCEL_PROJECT_PRODUCTION_URL`. There is no default on purpose. There is no local dev server in this
workflow: changes are checked on a deployed preview.

`favicon.ico` is generated: after changing the mark in `src/lib/icon-mark.tsx`, run
`node scripts/make-favicon.mjs`.

## Stack

Next.js 16 (App Router, Cache Components), React 19, Tailwind CSS 4, TypeScript. Hosted on Vercel in
London (`lhr1`). Fonts are self-hosted through `next/font`.
