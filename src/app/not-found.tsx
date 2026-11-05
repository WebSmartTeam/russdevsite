import type { Metadata } from "next";
import Link from "next/link";
import { CropMarks } from "@/components/ornaments";
import { SPECIMENS } from "@/lib/specimens";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <section className="wrap hero" aria-labelledby="nf-title">
      <div className="cropped hero-sheet">
        <CropMarks />
        <p className="rail">Error 404</p>
        <h1 id="nf-title" className="display mt-6">
          This page didn&rsquo;t make it <em>to press</em>
          <span className="stop">.</span>
        </h1>
        <p className="lead mt-8">
          There is nothing at this address. It may have been mistyped, or it never existed. These do:
        </p>
        <ul className="mt-6 grid gap-2">
          <li>
            <Link href="/" className="arrow-link">
              The home page
              <span className="arrow" aria-hidden="true">
                →
              </span>
            </Link>
          </li>
          {SPECIMENS.map((s) => (
            <li key={s.slug}>
              <Link href={s.href} className="arrow-link">
                {s.number} {s.title}
                <span className="arrow" aria-hidden="true">
                  →
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
