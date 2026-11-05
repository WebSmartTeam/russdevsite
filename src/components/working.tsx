"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ElementType,
  type ReactNode,
} from "react";
import { backgroundBehind, contrast, toRgba, verdict } from "@/lib/colour";
import { RegistrationMark } from "./ornaments";

type Working = { on: boolean; toggle: () => void };

const WorkingContext = createContext<Working | null>(null);

export function useWorking(): Working {
  const value = useContext(WorkingContext);
  if (!value) throw new Error("useWorking must be used inside <WorkingProvider>");
  return value;
}

export function WorkingProvider({ children }: { children: ReactNode }) {
  const [on, setOn] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    if (on) root.dataset.working = "on";
    else delete root.dataset.working;
  }, [on]);

  // Escape turns the overlay off from anywhere.
  useEffect(() => {
    if (!on) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOn(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [on]);

  const toggle = useCallback(() => setOn((value) => !value), []);
  const value = useMemo(() => ({ on, toggle }), [on, toggle]);

  return <WorkingContext value={value}>{children}</WorkingContext>;
}

export function WorkingToggle({ compact = false }: { compact?: boolean }) {
  const { on, toggle } = useWorking();
  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={toggle}
      className={compact ? "button-quiet" : "button"}
    >
      <RegistrationMark size={compact ? 16 : 20} />
      {compact ? (
        <span>
          <span className="sr-only sm:not-sr-only">Show the </span>working
        </span>
      ) : (
        <span>Show the working</span>
      )}
    </button>
  );
}

// next/font names its families with a hash ("__Fraunces_2b5d1a"); turn that back into a face name.
function faceName(fontFamily: string): string {
  const first = fontFamily.split(",")[0]?.trim().replace(/^["']|["']$/g, "") ?? "";
  const match = first.match(/^_*(.+?)(?:_Fallback)?_[0-9a-f]{5,}$/i);
  return (match ? match[1] : first).replace(/_/g, " ");
}

// If the web font has not arrived (or failed), say so rather than name a face that is not showing.
function fontLoaded(style: CSSStyleDeclaration): boolean {
  const family = style.fontFamily.split(",")[0]?.trim();
  if (!family || typeof document.fonts?.check !== "function") return true;
  try {
    return document.fonts.check(`${style.fontStyle} ${style.fontWeight} 16px ${family}`);
  } catch {
    return true;
  }
}

const px = (value: number) => (Number.isInteger(value) ? `${value}` : value.toFixed(1));

function describe(el: HTMLElement, label: string): string {
  const style = getComputedStyle(el);
  const size = parseFloat(style.fontSize);
  const lineHeight = parseFloat(style.lineHeight);
  const weight = Number(style.fontWeight);
  const fg = toRgba(style.color);
  const bg = backgroundBehind(el);
  const width = document.documentElement.clientWidth;

  const face = fontLoaded(style)
    ? faceName(style.fontFamily)
    : `${faceName(style.fontFamily)} (not loaded, so a fallback is showing)`;
  const parts = [`${label}: ${face} at weight ${weight}`];
  parts.push(
    Number.isFinite(lineHeight)
      ? `${px(size)}px on a ${px(lineHeight)}px line (${(lineHeight / size).toFixed(2)})`
      : `${px(size)}px`,
  );
  if (fg && bg) {
    const ratio = contrast(fg, bg);
    const large = size >= 24 || (size >= 18.66 && weight >= 700);
    const result = verdict(ratio, large);
    parts.push(
      `contrast ${ratio.toFixed(2)}:1, ${result === "Fails" ? "fails WCAG AA" : `passes WCAG ${result}`}`,
    );
  } else {
    parts.push("contrast could not be measured in this browser");
  }
  parts.push(`measured at ${width}px wide`);
  return parts.join(" · ");
}

type MeasureProps = {
  as?: ElementType;
  label: string;
  className?: string;
  children: ReactNode;
};

// Renders its element as normal. When the working is shown, a note after it reports the element's
// real computed type and contrast, re-measured whenever its size, the theme or the fonts change.
export function Measure({ as: Tag = "div", label, className = "", children }: MeasureProps) {
  const { on } = useWorking();
  const ref = useRef<HTMLElement>(null);
  const [note, setNote] = useState("");

  useEffect(() => {
    const el = ref.current;
    if (!on || !el) return;
    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => setNote(describe(el, label)));
    };
    update();
    const resize = new ResizeObserver(update);
    resize.observe(el);
    const theme = new MutationObserver(update);
    theme.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    const scheme = window.matchMedia("(prefers-color-scheme: dark)");
    scheme.addEventListener("change", update);
    window.addEventListener("resize", update);
    void document.fonts?.ready.then(update);
    return () => {
      cancelAnimationFrame(frame);
      resize.disconnect();
      theme.disconnect();
      scheme.removeEventListener("change", update);
      window.removeEventListener("resize", update);
    };
  }, [on, label]);

  return (
    <>
      <Tag ref={ref} className={`measure-target ${className}`}>
        {children}
      </Tag>
      <p className="measure-note" hidden={!on}>
        {note}
      </p>
    </>
  );
}
