import { AxisPlayground } from "@/components/axis-playground";
import { PageTransition, SpecimenFooter, SpecimenHeader } from "@/components/site-chrome";
import { TypeScale } from "@/components/type-scale";
import { Measure } from "@/components/working";
import { pageMetadata } from "@/lib/metadata";
import { specimenBySlug } from "@/lib/specimens";

const specimen = specimenBySlug("type");

export const metadata = pageMetadata({
  title: specimen.title,
  description: specimen.description,
  path: specimen.href,
});

export default function TypePage() {
  return (
    <PageTransition>
      <SpecimenHeader slug="type">
        <p className="lead">
          Three faces, one scale, and a floor nothing drops through. Every size on this page is worked out
          by your browser from your screen width and your own font-size setting.
        </p>
      </SpecimenHeader>

      <section className="wrap section" aria-labelledby="scale-title">
        <div className="split">
          <div>
            <p className="rail">The scale</p>
            <h2 id="scale-title" className="h2 mt-4">
              Fluid, with a <em>floor</em>
              <span className="stop">.</span>
            </h2>
          </div>
          <div className="prose">
            <p>
              Each step is a <code>clamp()</code> in rem: a minimum, a size that grows with the window, and
              a maximum. Because the limits are in rem, a reader who has set a larger default text size in
              their browser gets larger type everywhere, which a pixel-based scale would quietly ignore.
            </p>
            <p>
              The smallest step is 12px at the default setting. That is the house floor: no text on this
              site is smaller, at any width from a small phone to a wide monitor.
            </p>
          </div>
        </div>
        <div className="mt-10">
          <TypeScale />
        </div>
      </section>

      <section className="wrap section" aria-labelledby="axes-title">
        <div className="section-head">
          <p className="rail">The variable serif</p>
          <h2 id="axes-title" className="h2 mt-4">
            One font file, <em>four ways</em> to bend it
            <span className="stop">.</span>
          </h2>
          <p className="secondary mt-4">
            The headings are set in Fraunces, a variable font with axes for weight, optical size,
            softness and a set of deliberately wonky letterforms. Move the sliders and the sample is
            redrawn from the same file, with nothing else downloaded.
          </p>
        </div>
        <AxisPlayground />
      </section>

      <section className="wrap section" aria-labelledby="faces-title">
        <div className="section-head">
          <p className="rail">The pairing</p>
          <h2 id="faces-title" className="h2 mt-4">
            Three voices, <em>three jobs</em>
            <span className="stop">.</span>
          </h2>
        </div>
        <div className="faces">
          <article className="face">
            <p className="mono-note">Display · Fraunces</p>
            <Measure as="p" label="Display sample" className="face-sample font-display">
              Proof<span className="stop">.</span>
            </Measure>
            <p className="secondary">
              Headings and the large statements. Its italic, with the wonky forms switched on, is the second
              voice for the word that matters.
            </p>
          </article>
          <article className="face">
            <p className="mono-note">Text · Instrument Sans</p>
            <Measure as="p" label="Text sample" className="face-sample face-sample-sans font-sans">
              Plain reading
            </Measure>
            <p className="secondary">
              Everything you read at length, from paragraphs to buttons and form labels. It sits quietly
              beside the serif instead of competing with it.
            </p>
          </article>
          <article className="face">
            <p className="mono-note">Notes · JetBrains Mono</p>
            <Measure as="p" label="Notes sample" className="face-sample face-sample-mono font-mono">
              04/11/2026
            </Measure>
            <p className="secondary">
              Measurements, labels and the working itself. Every character the same width, so figures line
              up in columns.
            </p>
          </article>
        </div>
      </section>

      <SpecimenFooter slug="type" />
    </PageTransition>
  );
}
