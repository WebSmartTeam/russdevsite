import Link from "next/link";
import { ViewTransition, type ReactNode } from "react";
import { BUILDER, SITE_NAME, SPECIMENS, neighbours, specimenBySlug, type Specimen } from "@/lib/specimens";
import { NavLinks } from "./nav-links";
import { ProofStrip } from "./ornaments";
import { ThemeSwitch } from "./theme-switch";
import { Measure, WorkingToggle } from "./working";

export function SiteHeader() {
  return (
    <header className="site-header" style={{ viewTransitionName: "site-header" }}>
      <div className="wrap site-header-inner">
        <Link href="/" className="wordmark" transitionTypes={["nav-back"]}>
          {SITE_NAME}
          <span className="stop" aria-hidden="true">
            .
          </span>
          <span className="sr-only">, home</span>
        </Link>
        <NavLinks />
        <div className="site-tools">
          <WorkingToggle compact />
          <ThemeSwitch />
        </div>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="wrap">
        <ProofStrip />
        <div className="site-footer-grid">
          <div>
            <p className="wordmark-static">
              {SITE_NAME}
              <span className="stop" aria-hidden="true">
                .
              </span>
            </p>
            <p className="secondary mt-3">
              A test site that measures itself. It is not a business and nothing here is for sale. There
              are no cookies and no tracking, and the form on the Forms page keeps nothing you type.
            </p>
          </div>
          <nav aria-label="Footer">
            <p className="rail">Specimens</p>
            <ul className="mt-3 grid gap-1">
              {SPECIMENS.map((s) => (
                <li key={s.slug}>
                  <Link href={s.href} className="footer-link">
                    <span className="mono-note mr-2">{s.number}</span>
                    {s.title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div>
            <p className="rail">Built by</p>
            <p className="mt-3">
              <a href={BUILDER.url} className="arrow-link">
                {BUILDER.name}
                <span className="arrow" aria-hidden="true">
                  →
                </span>
              </a>
            </p>
          </div>
        </div>
        <p className="mono-note site-legal">
          COR Intelligence is a trading name of COR Solutions Services Ltd, registered in England and Wales,
          company number 15027891. Registered office: 7 Paynes Park, Hitchin, SG5 1EH.
        </p>
      </div>
    </footer>
  );
}

// The opening of every specimen page. The title carries the same view-transition name as its entry
// on the home page, so it moves into place when you open it from there.
export function SpecimenHeader({ slug, children }: { slug: Specimen["slug"]; children: ReactNode }) {
  const s = specimenBySlug(slug);
  return (
    <header className="specimen-header wrap">
      <p className="rail">
        Specimen {s.number} of {String(SPECIMENS.length).padStart(2, "0")}
      </p>
      <Measure as="h1" label="Page title" className="display mt-6">
        <ViewTransition name={`specimen-${s.slug}`}>
          <span className="inline-block">{s.title}</span>
        </ViewTransition>
        <span className="stop">.</span>
      </Measure>
      <div className="specimen-intro">{children}</div>
    </header>
  );
}

export function SpecimenFooter({ slug }: { slug: Specimen["slug"] }) {
  const { previous, next } = neighbours(slug);
  return (
    <nav aria-label="More specimens" className="wrap specimen-next">
      {previous ? (
        <Link href={previous.href} transitionTypes={["nav-back"]} className="specimen-next-link">
          <span className="mono-note">Previous · {previous.number}</span>
          <span className="h3">
            <span aria-hidden="true">← </span>
            {previous.title}
          </span>
        </Link>
      ) : (
        <Link href="/" transitionTypes={["nav-back"]} className="specimen-next-link">
          <span className="mono-note">Back to</span>
          <span className="h3">
            <span aria-hidden="true">← </span>
            All specimens
          </span>
        </Link>
      )}
      {next ? (
        <Link href={next.href} transitionTypes={["nav-forward"]} className="specimen-next-link text-right">
          <span className="mono-note">Next · {next.number}</span>
          <span className="h3">
            {next.title}
            <span aria-hidden="true"> →</span>
          </span>
        </Link>
      ) : (
        <Link href="/" transitionTypes={["nav-back"]} className="specimen-next-link text-right">
          <span className="mono-note">Back to</span>
          <span className="h3">
            All specimens
            <span aria-hidden="true"> →</span>
          </span>
        </Link>
      )}
    </nav>
  );
}

// Each page's content slides with the navigation direction; the header stays put.
export function PageTransition({ children }: { children: ReactNode }) {
  return (
    <ViewTransition
      enter={{ "nav-forward": "nav-forward", "nav-back": "nav-back", default: "none" }}
      exit={{ "nav-forward": "nav-forward", "nav-back": "nav-back", default: "none" }}
      default="none"
    >
      <div>{children}</div>
    </ViewTransition>
  );
}
