"use client";

import { useEffect, useState } from "react";

// Numbers read from the browser's own Performance APIs for this visit. Nothing is estimated: where a
// browser does not expose a measure, the tile says so instead of showing a number.

type Reading = { value: string; unit?: string; note: string } | { unavailable: string };

type Readings = {
  weight: Reading;
  requests: Reading;
  response: Reading;
  paint: Reading;
  shift: Reading;
};

const PENDING: Reading = { unavailable: "Measuring…" };

interface LayoutShiftEntry extends PerformanceEntry {
  value: number;
  hadRecentInput: boolean;
}

const supports = (type: string) =>
  typeof PerformanceObserver !== "undefined" &&
  (PerformanceObserver.supportedEntryTypes ?? []).includes(type);

function kb(bytes: number) {
  return (bytes / 1000).toLocaleString("en-GB", { maximumFractionDigits: bytes < 10_000 ? 1 : 0 });
}

function ms(value: number) {
  return Math.round(value).toLocaleString("en-GB");
}

function transfer(): { weight: Reading; requests: Reading } {
  const nav = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
  const resources = performance.getEntriesByType("resource") as PerformanceResourceTiming[];
  const all = [...(nav ? [nav] : []), ...resources];
  const bytes = all.reduce((sum, e) => sum + (e.transferSize || 0), 0);
  const cached = all.filter((e) => e.transferSize === 0 && e.decodedBodySize > 0).length;
  return {
    weight: {
      value: kb(bytes),
      unit: "kB",
      note:
        cached > 0
          ? `Transferred over the network. ${cached} more came from your browser's cache at no cost.`
          : "Transferred over the network, compressed, for everything loaded so far.",
    },
    requests: {
      value: String(all.length),
      note: "The page itself plus every file it has fetched on this visit.",
    },
  };
}

export function LiveMetrics() {
  const [r, setR] = useState<Readings>({
    weight: PENDING,
    requests: PENDING,
    response: PENDING,
    paint: PENDING,
    shift: PENDING,
  });

  useEffect(() => {
    const observers: PerformanceObserver[] = [];
    const update = (patch: Partial<Readings>) => setR((prev) => ({ ...prev, ...patch }));

    const nav = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
    update({
      ...transfer(),
      response: nav
        ? {
            value: ms(nav.responseStart),
            unit: "ms",
            note: "From starting the visit to the first byte of the page arriving.",
          }
        : { unavailable: "This browser does not expose navigation timing." },
    });

    if (supports("resource")) {
      const o = new PerformanceObserver(() => update(transfer()));
      o.observe({ type: "resource", buffered: false });
      observers.push(o);
    }

    if (supports("largest-contentful-paint")) {
      const o = new PerformanceObserver((list) => {
        const last = list.getEntries().at(-1) as LargestContentfulPaint | undefined;
        if (!last) return;
        const tag = last.element?.tagName.toLowerCase();
        update({
          paint: {
            value: ms(last.startTime),
            unit: "ms",
            note: `When the largest element${tag ? ` (a <${tag}>)` : ""} was painted. It measures paint, not when the page became usable.`,
          },
        });
      });
      o.observe({ type: "largest-contentful-paint", buffered: true });
      observers.push(o);
    } else {
      update({ paint: { unavailable: "This browser does not report largest paint." } });
    }

    if (supports("layout-shift")) {
      let total = 0;
      update({ shift: { value: "0.000", note: "How much the layout has jumped about. Under 0.1 is good." } });
      const o = new PerformanceObserver((list) => {
        for (const entry of list.getEntries() as LayoutShiftEntry[]) {
          if (!entry.hadRecentInput) total += entry.value;
        }
        update({
          shift: { value: total.toFixed(3), note: "How much the layout has jumped about. Under 0.1 is good." },
        });
      });
      o.observe({ type: "layout-shift", buffered: true });
      observers.push(o);
    } else {
      update({ shift: { unavailable: "This browser does not report layout shift." } });
    }

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  const tiles: { key: keyof Readings; label: string }[] = [
    { key: "weight", label: "Page weight" },
    { key: "requests", label: "Requests" },
    { key: "response", label: "First byte" },
    { key: "paint", label: "Largest paint" },
    { key: "shift", label: "Layout shift" },
  ];

  return (
    <dl className="metrics">
      {tiles.map(({ key, label }) => {
        const reading = r[key];
        return (
          <div key={key} className="tile metric">
            <dt className="metric-label">{label}</dt>
            {"unavailable" in reading ? (
              <dd className="metric-unavailable">{reading.unavailable}</dd>
            ) : (
              <>
                <dd className="metric-value">
                  {reading.value}
                  {reading.unit ? <span className="metric-unit"> {reading.unit}</span> : null}
                </dd>
                <dd className="metric-note">{reading.note}</dd>
              </>
            )}
          </div>
        );
      })}
    </dl>
  );
}
