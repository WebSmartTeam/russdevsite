import Link from "next/link";
import { ViewTransition } from "react";
import { LiveMetrics } from "@/components/live-metrics";
import { CropMarks, ProofStrip, RegistrationMark } from "@/components/ornaments";
import { PageTransition } from "@/components/site-chrome";
import { Measure, WorkingToggle } from "@/components/working";
import { formatUkDate } from "@/lib/format";
import { pageMetadata } from "@/lib/metadata";
import { absolute } from "@/lib/site-url";
import { BUILDER, LAST_UPDATED, SITE_NAME, SITE_TAGLINE, SPECIMENS } from "@/lib/specimens";

export const metadata = pageMetadata({
  description:
    "A test website that measures itself. Turn on the working and it marks up its own type sizes and contrast, live, in your browser.",
  path: "/",
});

function JsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    alternateName: SITE_TAGLINE,
    url: absolute("/"),
    inLanguage: "en-GB",
    dateModified: LAST_UPDATED,
    creator: { "@type": "Organization", name: BUILDER.name, url: BUILDER.url },
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}

export default function Home() {
  return (
    <PageTransition>
      <JsonLd />

      <section className="wrap hero" aria-labelledby="hero-title">
        <div className="cropped hero-sheet">
          <CropMarks />
          <div className="hero-top">
            <p className="rail">
              Proof 01 · {formatUkDate(LAST_UPDATED)}
            </p>
            <RegistrationMark size={44} className="hero-mark" />
          </div>

          <Measure as="h1" label="Headline" className="display hero-title">
            <span id="hero-title">
              A website that <em>shows its working</em>
              <span className="stop">.</span>
            </span>
          </Measure>

          <div className="hero-copy">
            <p className="lead">
              Every number on this site comes from the page you are looking at. Turn on the working and it
              marks up its own type sizes and contrast as your browser measures them.
            </p>
            <p className="secondary">
              It is a test bench, not a business. Nothing is for sale and there are no cookies. Press Escape
              to put the working away again.
            </p>
          </div>

          <div className="hero-actions">
            <WorkingToggle />
            <Link href="/type" className="arrow-link" transitionTypes={["nav-forward"]}>
              Or start with the type specimen
              <span className="arrow" aria-hidden="true">
                →
              </span>
            </Link>
          </div>
        </div>
        <ProofStrip className="mt-6" />
      </section>

      <section className="wrap section" aria-labelledby="specimens-title">
        <div className="section-head">
          <p className="rail">The specimens</p>
          <Measure as="h2" label="Section heading" className="h2">
            <span id="specimens-title">
              Five things every page has to <em>get right</em>
              <span className="stop">.</span>
            </span>
          </Measure>
        </div>

        <ol className="specimen-list">
          {SPECIMENS.map((s) => (
            <li key={s.slug} className="specimen-row">
              <span className="specimen-num" aria-hidden="true">
                {s.number}
              </span>
              <h3 className="specimen-name">
                <Link href={s.href} transitionTypes={["nav-forward"]} className="specimen-link">
                  <ViewTransition name={`specimen-${s.slug}`}>
                    <span className="inline-block">{s.title}</span>
                  </ViewTransition>
                </Link>
              </h3>
              <p className="specimen-summary">{s.summary}</p>
              <span className="specimen-arrow" aria-hidden="true">
                →
              </span>
            </li>
          ))}
        </ol>
      </section>

      <section className="wrap section" aria-labelledby="measured-title">
        <div className="section-head">
          <p className="rail">Measured just now</p>
          <h2 id="measured-title" className="h2">
            This visit, <em>in numbers</em>
            <span className="stop">.</span>
          </h2>
          <p className="secondary mt-4">
            Read from your browser&rsquo;s own performance timings for this visit: the first page you
            loaded and everything fetched since. Reload and they will change.
          </p>
        </div>
        <LiveMetrics />
      </section>

      <section className="wrap section" aria-labelledby="working-title">
        <div className="split">
          <div>
            <p className="rail">How to read it</p>
            <h2 id="working-title" className="h2 mt-4">
              What the <em>working</em> shows
              <span className="stop">.</span>
            </h2>
          </div>
          <div className="prose">
            <p>
              Faint red rules every eight pixels give you a spacing grid to judge the page against. Headings
              and type samples get a dashed outline and a note underneath: which face, what size and line
              height, and how strongly the text contrasts with whatever is behind it.
            </p>
            <p>
              None of those notes is typed in. Each one asks the browser for the element&rsquo;s computed
              style, paints its colours to a single canvas pixel to read them back as screen colours, and
              works out the WCAG ratio from that. Resize the window or change the theme and they update.
            </p>
            <p>
              The specimens go further: a type scale you can watch respond to your screen width, a
              palette that checks itself, a layout that responds to its container, motion that steps aside
              when asked, and a form that works with JavaScript switched off.
            </p>
          </div>
        </div>
      </section>
    </PageTransition>
  );
}
