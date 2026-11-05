import { CrossfadeDemo, MotionPreference } from "@/components/motion-demos";
import { PageTransition, SpecimenFooter, SpecimenHeader } from "@/components/site-chrome";
import { pageMetadata } from "@/lib/metadata";
import { specimenBySlug } from "@/lib/specimens";

const specimen = specimenBySlug("motion");

export const metadata = pageMetadata({
  title: specimen.title,
  description: specimen.description,
  path: specimen.href,
});

export default function MotionPage() {
  return (
    <PageTransition>
      <div className="scroll-progress" aria-hidden="true" />

      <SpecimenHeader slug="motion">
        <p className="lead">
          Movement here has a job: showing where you are, what changed and which way you went. And every
          piece of it stops when your device says it would rather it didn&rsquo;t.
        </p>
      </SpecimenHeader>

      <section className="wrap section" aria-labelledby="pref-title">
        <div className="split">
          <div>
            <p className="rail">First, your setting</p>
            <h2 id="pref-title" className="h2 mt-4">
              Motion is <em>opt-out</em>, and it listens
              <span className="stop">.</span>
            </h2>
            <p className="secondary mt-4">
              Turn on Reduce motion in your system&rsquo;s accessibility settings and this page changes
              without a reload.
            </p>
          </div>
          <MotionPreference />
        </div>
      </section>

      <section className="wrap section reveal" aria-labelledby="scroll-title">
        <div className="split">
          <div>
            <p className="rail">Scroll-driven</p>
            <h2 id="scroll-title" className="h2 mt-4">
              Tied to the <em>scrollbar</em>, not a timer
              <span className="stop">.</span>
            </h2>
          </div>
          <div className="prose">
            <p>
              The thin red line at the very top of the window is this page&rsquo;s reading progress. It is a
              CSS animation whose timeline is the scroll position, so it costs no JavaScript and cannot fall
              out of step with your scrolling.
            </p>
            <p>
              The sections below fade up as they arrive, on the same principle: each one&rsquo;s timeline is
              its own journey into view. Browsers that do not support scroll timelines simply show
              everything, fully visible, from the start.
            </p>
          </div>
        </div>
      </section>

      <section className="wrap section reveal" aria-labelledby="vt-title">
        <div className="split">
          <div>
            <p className="rail">View transitions</p>
            <h2 id="vt-title" className="h2 mt-4">
              Moving <em>between</em> pages
              <span className="stop">.</span>
            </h2>
          </div>
          <div className="prose">
            <p>
              Go back to the home page and open a specimen from the list. Its title lifts out of the list and
              settles into place as this page&rsquo;s heading: the browser treats the two as one object.
            </p>
            <p>
              The links at the foot of each specimen slide the page in the direction you are travelling,
              forward to the next or back to the last, while the header stays still as a fixed point. Your
              browser&rsquo;s own back button changes the page without a slide, because it carries no
              direction.
            </p>
          </div>
        </div>
      </section>

      <section className="wrap section reveal" aria-labelledby="xfade-title">
        <div className="section-head">
          <p className="rail">Same place, new content</p>
          <h2 id="xfade-title" className="h2 mt-4">
            A crossfade, <em>not</em> a slide
            <span className="stop">.</span>
          </h2>
          <p className="secondary mt-4">
            Switching what a panel shows is not going somewhere new, so it fades rather than moves.
          </p>
        </div>
        <CrossfadeDemo />
      </section>

      <SpecimenFooter slug="motion" />
    </PageTransition>
  );
}
