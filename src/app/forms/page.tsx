import { PageTransition, SpecimenFooter, SpecimenHeader } from "@/components/site-chrome";
import { pageMetadata } from "@/lib/metadata";
import { specimenBySlug } from "@/lib/specimens";
import { OrderForm } from "./order-form";

const specimen = specimenBySlug("forms");

export const metadata = pageMetadata({
  title: specimen.title,
  description: specimen.description,
  path: specimen.href,
});

export default function FormsPage() {
  return (
    <PageTransition>
      <SpecimenHeader slug="forms">
        <p className="lead">
          An order form for a test print that does not exist. Try leaving things out, or asking for a date
          last week. It is there to show how a form should behave when things go wrong.
        </p>
      </SpecimenHeader>

      <section className="wrap section" aria-labelledby="order-title">
        <div className="form-layout">
          <div>
            <p className="rail">Order a test print</p>
            <h2 id="order-title" className="h2 mt-4">
              Nothing is <em>ordered</em>, nothing is kept
              <span className="stop">.</span>
            </h2>
            <div className="prose mt-6">
              <p>
                Your answers go to the server, which checks them and sends back either a list of problems
                or a summary. It does not save, email or log anything, and the form asks for nothing about
                you.
              </p>
              <p>
                It works with JavaScript switched off: the browser posts the form and the server sends back
                the whole page with your answers and any errors in place. With JavaScript on, the same check
                happens without a page load and focus moves to whatever needs your attention.
              </p>
            </div>
            <ul className="form-notes mono-note">
              <li>Errors are listed at the top, each one a link to its field.</li>
              <li>Each field keeps what you typed when something else is wrong.</li>
              <li>Dates are checked against today in London.</li>
            </ul>
          </div>
          <OrderForm />
        </div>
      </section>

      <SpecimenFooter slug="forms" />
    </PageTransition>
  );
}
