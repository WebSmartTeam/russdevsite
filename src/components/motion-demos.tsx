"use client";

import { startTransition, useState, useSyncExternalStore, ViewTransition } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(onChange: () => void) {
  const media = window.matchMedia(QUERY);
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
}

// What this device is asking for right now. Changing the system setting updates it live.
export function MotionPreference() {
  const reduced = useSyncExternalStore(
    subscribe,
    () => window.matchMedia(QUERY).matches,
    () => null,
  );

  return (
    <div className="preference">
      <p className="mono-note">Your device, right now</p>
      <p className="h3 mt-2">
        {reduced === null ? "Checking…" : reduced ? "Asks for reduced motion" : "Has no motion preference"}
      </p>
      <p className="secondary mt-2">
        {reduced === null
          ? ""
          : reduced
            ? "So the progress bar is hidden, nothing fades in as you scroll, and page changes happen instantly."
            : "So you will see the progress bar, the gentle fade as sections arrive, and pages sliding when you move between specimens."}
      </p>
    </div>
  );
}

const PLATES = [
  { id: "a", label: "Galley", text: "Long columns of type, set and pulled before it is cut into pages." },
  { id: "b", label: "Page", text: "Type made up into pages, with headings, folios and margins in place." },
  { id: "c", label: "Press", text: "Signed off, plated and printed. Changes from here cost real money." },
] as const;

// Same place, different content: a crossfade rather than a slide.
export function CrossfadeDemo() {
  const [current, setCurrent] = useState<(typeof PLATES)[number]["id"]>("a");
  const plate = PLATES.find((p) => p.id === current) ?? PLATES[0];

  return (
    <div className="crossfade">
      <div role="group" aria-label="Proof stage" className="flex flex-wrap gap-2">
        {PLATES.map((p, i) => (
          <button
            key={p.id}
            type="button"
            className="button-quiet"
            aria-pressed={current === p.id}
            onClick={() => startTransition(() => setCurrent(p.id))}
          >
            <span className="mono-note" aria-hidden="true">
              0{i + 1}
            </span>
            {p.label}
          </button>
        ))}
      </div>
      {/* The live region stays mounted; only its content is swapped, so screen readers hear the change. */}
      <div aria-live="polite">
        <ViewTransition key={plate.id} name="crossfade-plate" share="auto" enter="auto" default="none">
          <div className="crossfade-plate">
            <p className="h2">
              {plate.label}
              <span className="stop">.</span>
            </p>
            <p className="secondary mt-3">{plate.text}</p>
          </div>
        </ViewTransition>
      </div>
    </div>
  );
}
