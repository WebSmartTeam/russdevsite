"use client";

import { useSyncExternalStore, type ReactNode } from "react";
import { THEME_KEY } from "@/lib/theme";

type Choice = "system" | "light" | "dark";

const OPTIONS: { value: Choice; label: string; icon: ReactNode }[] = [
  {
    value: "system",
    label: "Match this device",
    icon: (
      <svg aria-hidden="true" viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="2.5" y="3.5" width="15" height="10" rx="1" />
        <path d="M7 17h6M10 13.5V17" />
      </svg>
    ),
  },
  {
    value: "light",
    label: "Light",
    icon: (
      <svg aria-hidden="true" viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="10" cy="10" r="3.5" />
        <path d="M10 1.5v2M10 16.5v2M1.5 10h2M16.5 10h2M4 4l1.4 1.4M14.6 14.6 16 16M4 16l1.4-1.4M14.6 5.4 16 4" />
      </svg>
    ),
  },
  {
    value: "dark",
    label: "Dark",
    icon: (
      <svg aria-hidden="true" viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M16.5 12.5A7 7 0 0 1 7.5 3.5a7 7 0 1 0 9 9Z" />
      </svg>
    ),
  },
];

function read(): Choice {
  const theme = document.documentElement.dataset.theme;
  return theme === "light" || theme === "dark" ? theme : "system";
}

function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => observer.disconnect();
}

function apply(choice: Choice) {
  const root = document.documentElement;
  if (choice === "system") delete root.dataset.theme;
  else root.dataset.theme = choice;
  try {
    if (choice === "system") localStorage.removeItem(THEME_KEY);
    else localStorage.setItem(THEME_KEY, choice);
  } catch {
    // Storage can be blocked (private windows, strict settings). The theme still applies for this visit.
  }
}

export function ThemeSwitch() {
  const choice = useSyncExternalStore(subscribe, read, () => "system" as Choice);

  return (
    <fieldset className="theme-switch">
      <legend className="sr-only">Colour theme</legend>
      {OPTIONS.map((option) => (
        <label key={option.value} className="theme-option" title={option.label}>
          <input
            type="radio"
            name="theme"
            value={option.value}
            checked={choice === option.value}
            onChange={() => apply(option.value)}
            className="sr-only"
          />
          {option.icon}
          <span className="sr-only">{option.label}</span>
        </label>
      ))}
    </fieldset>
  );
}
