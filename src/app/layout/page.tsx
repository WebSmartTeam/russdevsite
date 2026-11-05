import { ContainerDemo, ProofChecks } from "@/components/layout-demos";
import { PageTransition, SpecimenFooter, SpecimenHeader } from "@/components/site-chrome";
import { pageMetadata } from "@/lib/metadata";
import { specimenBySlug } from "@/lib/specimens";

const specimen = specimenBySlug("layout");

export const metadata = pageMetadata({
  title: specimen.title,
  description: specimen.description,
  path: specimen.href,
});

const CARDS = [
  {
    title: "A short one",
    body: "One line of copy.",
    meta: "Footer lines up",
  },
  {
    title: "A heading that runs onto a second line on purpose",
    body: "A longer paragraph, the kind that pushes everything below it further down the card than its neighbours would like.",
    meta: "Footer lines up",
  },
  {
    title: "Middling",
    body: "Two sentences of copy. Enough to be different.",
    meta: "Footer lines up",
  },
];

export default function LayoutPage() {
  return (
    <PageTransition>
      <SpecimenHeader slug="layout">
        <p className="lead">
          Components that answer to the space they are given. The same card works in a sidebar, a column
          or the full width, because it measures its container, not the screen.
        </p>
      </SpecimenHeader>

      <section className="wrap section" aria-labelledby="cq-title">
        <div className="section-head">
          <p className="rail">Container queries</p>
          <h2 id="cq-title" className="h2 mt-4">
            Resize the <em>frame</em>, not the window
            <span className="stop">.</span>
          </h2>
          <p className="secondary mt-4">
            Use the slider, or drag the bottom-right corner of the dashed frame. The card changes layout at
            28rem and again at 42rem of frame width, whatever size your screen is.
          </p>
        </div>
        <ContainerDemo />
      </section>

      <section className="wrap section" aria-labelledby="subgrid-title">
        <div className="section-head">
          <p className="rail">Subgrid</p>
          <h2 id="subgrid-title" className="h2 mt-4">
            Cards that <em>agree</em> with each other
            <span className="stop">.</span>
          </h2>
          <p className="secondary mt-4">
            Each card shares its rows with the grid around it, so titles, copy and footers line up across
            the row however much each one says. No fixed heights and no JavaScript.
          </p>
        </div>
        <div className="subgrid-cards">
          {CARDS.map((c) => (
            <article key={c.title}>
              <h3 className="h3">{c.title}</h3>
              <p className="secondary">{c.body}</p>
              <footer className="mono-note">{c.meta}</footer>
            </article>
          ))}
        </div>
      </section>

      <section className="wrap section" aria-labelledby="has-title">
        <div className="split">
          <div>
            <p className="rail">:has()</p>
            <h2 id="has-title" className="h2 mt-4">
              A parent that <em>notices</em>
              <span className="stop">.</span>
            </h2>
            <p className="secondary mt-4">
              The stamp appears when every box is ticked, using one CSS rule that asks whether the list still
              has an unticked box. A short message is also read out to screen readers, because a change made
              only in a stylesheet is silent to them.
            </p>
          </div>
          <ProofChecks />
        </div>
      </section>

      <SpecimenFooter slug="layout" />
    </PageTransition>
  );
}
