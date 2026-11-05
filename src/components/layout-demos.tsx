"use client";

import { useEffect, useId, useRef, useState } from "react";

// A frame whose width you control. The card inside rearranges itself with container queries, which
// respond to the frame, not to the window. Drag the frame's corner, or use the slider.
export function ContainerDemo() {
  const id = useId();
  const frame = useRef<HTMLDivElement>(null);
  const [target, setTarget] = useState(720);
  const [measured, setMeasured] = useState<number | null>(null);
  const [rootPx, setRootPx] = useState(16);

  useEffect(() => {
    const el = frame.current;
    if (!el) return;
    setRootPx(parseFloat(getComputedStyle(document.documentElement).fontSize) || 16);
    const observer = new ResizeObserver(([entry]) => {
      // Container queries measure the content box, so report that, not the border box.
      setMeasured(Math.round(entry.contentBoxSize?.[0]?.inlineSize ?? entry.contentRect.width));
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="w-full max-w-sm">
          <label htmlFor={`${id}-width`} className="field-label">
            Frame width
          </label>
          <input
            id={`${id}-width`}
            type="range"
            className="range mt-2"
            min={240}
            max={960}
            step={10}
            value={target}
            aria-describedby={`${id}-readout`}
            onChange={(e) => {
              setTarget(Number(e.target.value));
              frame.current?.style.removeProperty("width");
            }}
          />
        </div>
        <p id={`${id}-readout`} className="mono-note">
          {measured === null
            ? "Measuring the frame…"
            : `Inside the frame: ${measured}px, which is ${(measured / rootPx).toFixed(1)}rem at your ${rootPx}px root. The window has not changed.`}
        </p>
      </div>

      <div ref={frame} className="cq-frame mt-6" style={{ width: `min(100%, ${target}px)` }}>
        <article className="cq-card">
          <div className="cq-plate" aria-hidden="true" />
          <div>
            <p className="mono-note">
              Layout: <span className="cq-state-narrow">stacked</span>
              <span className="cq-state-mid">side by side</span>
              <span className="cq-state-wide">three columns</span>
            </p>
            <h3 className="h3 mt-2">A card that reads its own room</h3>
            <p className="secondary mt-2">
              Below 28rem the picture sits on top. From 28rem it moves alongside. From 42rem a third column
              appears with the details.
            </p>
          </div>
          <dl className="cq-extra secondary">
            <dt className="mono-note">Stock</dt>
            <dd>Uncoated, 120gsm</dd>
            <dt className="mono-note mt-2">Size</dt>
            <dd>A4</dd>
          </dl>
        </article>
      </div>
    </div>
  );
}

const CHECKS = ["Spelling and punctuation", "Contrast on every ground", "Line lengths", "Crop marks"];

// The stamp is shown by CSS alone (:has). The live count is for screen readers, which cannot see a
// change made only in a stylesheet.
export function ProofChecks() {
  const [ticked, setTicked] = useState(0);
  const left = CHECKS.length - ticked;

  return (
    <fieldset
      className="checks"
      onChange={(e) => {
        const set = e.currentTarget.querySelectorAll<HTMLInputElement>("input[type=checkbox]:checked");
        setTicked(set.length);
      }}
    >
      <legend className="h3">Checks before press</legend>
      <div className="mt-4 grid gap-1">
        {CHECKS.map((c) => (
          <label key={c} className="choice">
            <input type="checkbox" name="check" value={c} />
            {c}
          </label>
        ))}
      </div>
      <p className="checks-status">
        <span className="stamp-pending mono-note">Tick all four to pass this proof.</span>
        <span className="stamp">Passed for press</span>
      </p>
      <p className="sr-only" aria-live="polite">
        {ticked === 0 ? "" : left === 0 ? "All checks done. Passed for press." : `${left} of ${CHECKS.length} checks left.`}
      </p>
    </fieldset>
  );
}
