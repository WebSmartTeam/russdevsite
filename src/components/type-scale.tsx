"use client";

import { useEffect, useRef, useState } from "react";

const STEPS = [
  { token: "--step-5", use: "Page titles" },
  { token: "--step-4", use: "Section headings" },
  { token: "--step-3", use: "Large figures" },
  { token: "--step-2", use: "Sub-headings" },
  { token: "--step-1", use: "Lead paragraphs" },
  { token: "--step-0", use: "Body text" },
  { token: "--step--1", use: "Secondary copy" },
  { token: "--step-micro", use: "Rail labels and notes" },
] as const;

type Row = { size: number; min: number; max: number; formula: string };

// Reads each step's clamp() from the stylesheet and its computed size at the current width. Bounds
// are worked out from the visitor's own root font size, which this site never overrides.
function measure(samples: (HTMLElement | null)[]): Row[] {
  const rootStyle = getComputedStyle(document.documentElement);
  const root = parseFloat(rootStyle.fontSize);
  return STEPS.map((step, i) => {
    const formula = rootStyle.getPropertyValue(step.token).trim();
    const rems = [...formula.matchAll(/([\d.]+)rem/g)].map((m) => parseFloat(m[1]));
    const el = samples[i];
    return {
      size: el ? parseFloat(getComputedStyle(el).fontSize) : NaN,
      min: rems.length ? rems[0] * root : NaN,
      max: rems.length ? rems[rems.length - 1] * root : NaN,
      formula,
    };
  });
}

const fmt = (n: number) => (Number.isFinite(n) ? n.toFixed(1).replace(/\.0$/, "") : "?");

export function TypeScale() {
  const samples = useRef<(HTMLElement | null)[]>([]);
  const [rows, setRows] = useState<Row[] | null>(null);
  const [width, setWidth] = useState<number | null>(null);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        setRows(measure(samples.current));
        setWidth(document.documentElement.clientWidth);
      });
    };
    update();
    window.addEventListener("resize", update);
    void document.fonts?.ready.then(update);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", update);
    };
  }, []);

  const smallest = rows ? Math.min(...rows.map((r) => r.size)) : null;

  return (
    <div>
      <p className="mono-note">
        {width === null
          ? "Measuring at your screen width…"
          : `Measured at ${width}px wide. Smallest step here: ${fmt(smallest ?? NaN)}px. Resize the window to watch every size move between its limits.`}
      </p>
      <ol className="scale-list">
        {STEPS.map((step, i) => {
          const row = rows?.[i];
          return (
            <li key={step.token} className="scale-row">
              <div className="scale-meta">
                <code>{step.token}</code>
                <span>{step.use}</span>
                <span className="scale-size">
                  {row ? (
                    <>
                      <strong>{fmt(row.size)}px</strong> now, between {fmt(row.min)} and {fmt(row.max)}px
                    </>
                  ) : (
                    "Measuring…"
                  )}
                </span>
              </div>
              <p
                ref={(el) => {
                  samples.current[i] = el;
                }}
                className="scale-sample"
                style={{ fontSize: `var(${step.token})` }}
              >
                Set in proof, read in print
              </p>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
