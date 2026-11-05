"use client";

import { useEffect, useState } from "react";
import { contrast, toHex, toRgba, tokenValue, verdict, type Rgba } from "@/lib/colour";

const TOKENS = [
  { name: "--paper", role: "Page ground" },
  { name: "--paper-2", role: "Second ground" },
  { name: "--rule", role: "Hairlines" },
  { name: "--ink-3", role: "Quiet text" },
  { name: "--ink-2", role: "Body text" },
  { name: "--ink", role: "Headings and controls" },
  { name: "--proof", role: "The red: marks and fills" },
  { name: "--proof-ink", role: "The red, as small text" },
  { name: "--on-proof", role: "Text on a red fill" },
] as const;

type TokenName = (typeof TOKENS)[number]["name"];

const TEXTS: TokenName[] = ["--ink", "--ink-2", "--ink-3", "--proof-ink", "--proof"];
const GROUNDS: TokenName[] = ["--paper", "--paper-2"];

type Reading = { declared: string; rgba: Rgba | null };

function useTokens() {
  const [readings, setReadings] = useState<Record<TokenName, Reading> | null>(null);
  const [scheme, setScheme] = useState<string>("");

  useEffect(() => {
    const read = () => {
      const next = {} as Record<TokenName, Reading>;
      for (const t of TOKENS) {
        const declared = tokenValue(t.name);
        next[t.name] = { declared, rgba: toRgba(declared) };
      }
      setReadings(next);
      setScheme(getComputedStyle(document.documentElement).colorScheme.includes("dark") ? "dark" : "light");
    };
    read();
    const observer = new MutationObserver(read);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    media.addEventListener("change", read);
    return () => {
      observer.disconnect();
      media.removeEventListener("change", read);
    };
  }, []);

  return { readings, scheme };
}

export function Palette() {
  const { readings, scheme } = useTokens();

  return (
    <div>
      <p className="mono-note">
        {readings
          ? `Read from the stylesheet just now, in the ${scheme} theme. Switch theme at the top of the page and everything here is measured again.`
          : "Reading the palette…"}
      </p>

      <ul className="swatches">
        {TOKENS.map((t) => {
          const r = readings?.[t.name];
          return (
            <li key={t.name} className="swatch">
              <span className="swatch-chip" style={{ background: `var(${t.name})` }} aria-hidden="true" />
              <span className="swatch-name">
                <code>{t.name}</code>
              </span>
              <span className="swatch-role">{t.role}</span>
              <span className="mono-note">
                {r ? (
                  <>
                    {r.declared}
                    <br />
                    renders as {r.rgba ? toHex(r.rgba) : "unknown"}
                  </>
                ) : (
                  "…"
                )}
              </span>
            </li>
          );
        })}
      </ul>

      <div className="table-scroll mt-12" tabIndex={0} role="region" aria-labelledby="contrast-caption">
        <table className="contrast-table">
          <caption id="contrast-caption" className="mono-note">
            WCAG 2.2 contrast for every text colour on every ground, {scheme || "current"} theme. AA needs
            4.5:1 for body text and 3:1 for large text.
          </caption>
          <thead>
            <tr>
              <th scope="col">Text colour</th>
              {GROUNDS.map((g) => (
                <th key={g} scope="col">
                  on <code>{g}</code>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {TEXTS.map((fg) => (
              <tr key={fg}>
                <th scope="row">
                  <span className="contrast-sample" style={{ color: `var(${fg})` }} aria-hidden="true">
                    Aa
                  </span>
                  <code>{fg}</code>
                </th>
                {GROUNDS.map((bg) => {
                  const a = readings?.[fg].rgba;
                  const b = readings?.[bg].rgba;
                  if (!a || !b) return <td key={bg}>…</td>;
                  const ratio = contrast(a, b);
                  const v = verdict(ratio, false);
                  const large = verdict(ratio, true);
                  return (
                    <td key={bg}>
                      <strong>{ratio.toFixed(2)}:1</strong>
                      <span className={v === "Fails" ? "verdict verdict-fail" : "verdict"}>
                        {v === "Fails" ? (large === "AA large" ? "Large text only" : "Fails AA") : `Passes ${v}`}
                      </span>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
