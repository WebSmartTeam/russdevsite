import { ProofStrip } from "@/components/ornaments";
import { Palette } from "@/components/palette";
import { PageTransition, SpecimenFooter, SpecimenHeader } from "@/components/site-chrome";
import { pageMetadata } from "@/lib/metadata";
import { specimenBySlug } from "@/lib/specimens";

const specimen = specimenBySlug("colour");

export const metadata = pageMetadata({
  title: specimen.title,
  description: specimen.description,
  path: specimen.href,
});

export default function ColourPage() {
  return (
    <PageTransition>
      <SpecimenHeader slug="colour">
        <p className="lead">
          A warm paper, an ink with a little red in it, and one proofreader&rsquo;s red. The numbers below
          are not copied from a design file: your browser works them out from the stylesheet while you
          watch.
        </p>
      </SpecimenHeader>

      <section className="wrap section" aria-labelledby="palette-title">
        <div className="section-head">
          <p className="rail">The tokens</p>
          <h2 id="palette-title" className="h2 mt-4">
            Every colour, <em>checked</em>
            <span className="stop">.</span>
          </h2>
          <p className="secondary mt-4">
            The greys are not grey. They are mixed at the same hue as the red, with very little colour,
            so the accent reads as part of the page rather than something pasted on top.
          </p>
        </div>
        <Palette />
      </section>

      <section className="wrap section" aria-labelledby="focus-title">
        <div className="split">
          <div>
            <p className="rail">The state nobody designs</p>
            <h2 id="focus-title" className="h2 mt-4">
              A focus ring that <em>never disappears</em>
              <span className="stop">.</span>
            </h2>
          </div>
          <div className="prose">
            <p>
              Press Tab to move through the buttons below. The ring has a paper-coloured core and an ink
              edge, so it stays visible on the page, on the second ground and on a solid red fill, where a
              red ring would vanish into the button.
            </p>
            <div className="focus-demo">
              <div className="focus-ground" style={{ background: "var(--paper)" }}>
                <button type="button" className="button-quiet">
                  On paper
                </button>
              </div>
              <div className="focus-ground" style={{ background: "var(--paper-2)" }}>
                <button type="button" className="button-quiet">
                  On the second ground
                </button>
              </div>
              <div className="focus-ground" style={{ background: "var(--paper)" }}>
                <button type="button" className="button button-red">
                  On a red fill
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="wrap section" aria-labelledby="strip-title">
        <div className="split">
          <div>
            <p className="rail">The colour bar</p>
            <h2 id="strip-title" className="h2 mt-4">
              Borrowed from the <em>print room</em>
              <span className="stop">.</span>
            </h2>
          </div>
          <div className="prose">
            <ProofStrip />
            <p>
              Printers run a strip of solid inks and tints along the edge of a proof sheet to check the
              press is laying colour down evenly. This site uses one as an ornament: cyan, magenta, yellow
              and key, three tints of the key, and the proof red.
            </p>
            <p>
              It is decoration and nothing more, so it is hidden from screen readers and never carries text.
              The cyan and yellow would fail as text colours on this paper, and that is fine for a strip of
              ink.
            </p>
          </div>
        </div>
      </section>

      <SpecimenFooter slug="colour" />
    </PageTransition>
  );
}
