// Decorative marks borrowed from the printer's proof sheet. All are hidden from assistive technology.

export function CropMarks() {
  return (
    <>
      {(["tl", "tr", "bl", "br"] as const).map((corner) => (
        <span key={corner} aria-hidden="true" className={`crop ${corner}`} />
      ))}
    </>
  );
}

const STRIP = [
  "var(--cyan)",
  "var(--magenta)",
  "var(--yellow)",
  "var(--key)",
  "color-mix(in oklch, var(--key) 70%, var(--paper))",
  "color-mix(in oklch, var(--key) 45%, var(--paper))",
  "color-mix(in oklch, var(--key) 20%, var(--paper))",
  "var(--proof)",
];

export function ProofStrip({ className = "" }: { className?: string }) {
  return (
    <div aria-hidden="true" className={`proof-strip ${className}`}>
      {STRIP.map((colour) => (
        <span key={colour} style={{ background: colour }} />
      ))}
    </div>
  );
}

export function RegistrationMark({ className = "", size = 24 }: { className?: string; size?: number }) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <circle cx="12" cy="12" r="6.5" />
      <path d="M12 1v22M1 12h22" />
    </svg>
  );
}
