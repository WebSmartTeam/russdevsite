// Browser-side colour reading. Any CSS colour the browser understands (oklch, color-mix, hex) is
// resolved by painting one canvas pixel and reading it back as sRGB, so the numbers shown on the
// page are what the browser actually renders, not what the stylesheet intended.

export type Rgba = readonly [r: number, g: number, b: number, a: number];

let context: CanvasRenderingContext2D | null | undefined;

function pixel(): CanvasRenderingContext2D | null {
  if (context === undefined) {
    const canvas = document.createElement("canvas");
    canvas.width = 1;
    canvas.height = 1;
    context = canvas.getContext("2d", { willReadFrequently: true });
  }
  return context;
}

export function toRgba(colour: string): Rgba | null {
  const g = pixel();
  if (!g || !colour) return null;
  g.clearRect(0, 0, 1, 1);
  g.fillStyle = "rgba(0, 0, 0, 0)";
  g.fillStyle = colour;
  g.fillRect(0, 0, 1, 1);
  const [r, gr, b, a] = g.getImageData(0, 0, 1, 1).data;
  return [r, gr, b, a / 255];
}

export function tokenValue(name: `--${string}`): string {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

const linear = (channel: number) => {
  const c = channel / 255;
  return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
};

export function luminance([r, g, b]: Rgba): number {
  return 0.2126 * linear(r) + 0.7152 * linear(g) + 0.0722 * linear(b);
}

// Composite a translucent foreground over an opaque background.
function over(fg: Rgba, bg: Rgba): Rgba {
  const a = fg[3];
  return [fg[0] * a + bg[0] * (1 - a), fg[1] * a + bg[1] * (1 - a), fg[2] * a + bg[2] * (1 - a), 1];
}

export function contrast(fg: Rgba, bg: Rgba): number {
  const a = luminance(fg[3] < 1 ? over(fg, bg) : fg);
  const b = luminance(bg);
  const [hi, lo] = a > b ? [a, b] : [b, a];
  return (hi + 0.05) / (lo + 0.05);
}

export function toHex([r, g, b]: Rgba): string {
  return "#" + [r, g, b].map((v) => Math.round(v).toString(16).padStart(2, "0")).join("");
}

// The nearest opaque background behind an element, walking up the tree.
export function backgroundBehind(el: Element): Rgba | null {
  let node: Element | null = el;
  while (node) {
    const rgba = toRgba(getComputedStyle(node).backgroundColor);
    if (rgba && rgba[3] >= 0.99) return rgba;
    node = node.parentElement;
  }
  return toRgba(tokenValue("--paper"));
}

export type Verdict = "AAA" | "AA" | "AA large" | "Fails";

export function verdict(ratio: number, largeText: boolean): Verdict {
  if (ratio >= 7) return "AAA";
  if (ratio >= 4.5) return "AA";
  if (largeText && ratio >= 3) return "AA large";
  return "Fails";
}
