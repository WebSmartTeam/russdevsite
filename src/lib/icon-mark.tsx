import { readFile } from "node:fs/promises";
import { join } from "node:path";

// The wordmark's initial: "P." in Fraunces, paper on ink, with the red full stop. Used by the icon
// routes; scripts/make-favicon.mjs draws the same mark into favicon.ico, so keep the two in step.
export function IconMark({ px, rounded }: { px: number; rounded: boolean }) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#1e1613",
        borderRadius: rounded ? Math.round(px * 0.1875) : 0,
        color: "#fbf6f4",
        fontFamily: "Fraunces",
        fontSize: Math.round(px * 0.86),
        lineHeight: 1,
        paddingBottom: Math.round(px * 0.06),
      }}
    >
      P<span style={{ color: "#f15f49" }}>.</span>
    </div>
  );
}

// Read once when the module loads, so the icon routes stay static and are drawn at build time.
const fraunces = await readFile(join(process.cwd(), "src/assets/og/Fraunces-SemiBold-opsz72.woff"));

export const ICON_FONTS = [{ name: "Fraunces", data: fraunces, weight: 600 as const, style: "normal" as const }];
