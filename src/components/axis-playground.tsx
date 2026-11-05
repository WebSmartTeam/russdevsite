"use client";

import { useId, useState } from "react";

type Axes = { wght: number; opsz: number; SOFT: number; WONK: 0 | 1; italic: boolean };

const START: Axes = { wght: 320, opsz: 96, SOFT: 0, WONK: 0, italic: false };

const SLIDERS = [
  { axis: "wght", label: "Weight", min: 100, max: 900, step: 10, hint: "From hairline to black" },
  { axis: "opsz", label: "Optical size", min: 9, max: 144, step: 1, hint: "Small sizes get sturdier shapes" },
  { axis: "SOFT", label: "Softness", min: 0, max: 100, step: 1, hint: "Rounds off the corners" },
] as const;

export function AxisPlayground() {
  const id = useId();
  const [axes, setAxes] = useState<Axes>(START);
  const [text, setText] = useState("Handgloves & quick proofs");

  const settings = `"wght" ${axes.wght}, "opsz" ${axes.opsz}, "SOFT" ${axes.SOFT}, "WONK" ${axes.WONK}`;
  const css = `font-variation-settings: ${settings};${axes.italic ? "\nfont-style: italic;" : ""}`;

  return (
    <div className="playground">
      <div className="playground-stage">
        <p
          className="playground-sample"
          style={{ fontVariationSettings: settings, fontStyle: axes.italic ? "italic" : "normal" }}
        >
          {text || " "}
        </p>
      </div>

      <div className="playground-controls">
        <div>
          <label htmlFor={`${id}-text`} className="field-label">
            Sample text
          </label>
          <input
            id={`${id}-text`}
            className="input mt-2"
            value={text}
            maxLength={60}
            onChange={(e) => setText(e.target.value)}
          />
        </div>

        {SLIDERS.map((s) => (
          <div key={s.axis}>
            <div className="flex items-baseline justify-between gap-4">
              <label htmlFor={`${id}-${s.axis}`} className="field-label">
                {s.label}
              </label>
              <output htmlFor={`${id}-${s.axis}`} className="mono-note" aria-hidden="true">
                {axes[s.axis]}
              </output>
            </div>
            <span id={`${id}-${s.axis}-hint`} className="field-hint">
              {s.hint}
            </span>
            <input
              id={`${id}-${s.axis}`}
              type="range"
              className="range mt-2"
              min={s.min}
              max={s.max}
              step={s.step}
              value={axes[s.axis]}
              aria-describedby={`${id}-${s.axis}-hint`}
              onChange={(e) => setAxes((a) => ({ ...a, [s.axis]: Number(e.target.value) }))}
            />
          </div>
        ))}

        <div className="flex flex-wrap gap-x-6">
          <label className="choice">
            <input
              type="checkbox"
              checked={axes.WONK === 1}
              onChange={(e) => setAxes((a) => ({ ...a, WONK: e.target.checked ? 1 : 0 }))}
            />
            Wonky letters
          </label>
          <label className="choice">
            <input
              type="checkbox"
              checked={axes.italic}
              onChange={(e) => setAxes((a) => ({ ...a, italic: e.target.checked }))}
            />
            Italic
          </label>
        </div>

        <div className="flex flex-wrap gap-3">
          <button type="button" className="button-quiet" onClick={() => setAxes(START)}>
            Reset
          </button>
          <button
            type="button"
            className="button-quiet"
            onClick={() => setAxes({ wght: 900, opsz: 144, SOFT: 100, WONK: 1, italic: true })}
          >
            Push every axis
          </button>
        </div>
      </div>

      <figure className="playground-code">
        <figcaption className="mono-note">The CSS for what you see</figcaption>
        <pre tabIndex={0} role="region" aria-label="CSS for the sample">
          <code>{css}</code>
        </pre>
      </figure>
    </div>
  );
}
