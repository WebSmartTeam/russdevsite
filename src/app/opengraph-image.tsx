import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { SITE_NAME, SITE_TAGLINE, SPECIMENS } from "@/lib/specimens";

// The link preview shown when the site is shared. Rendered once at build time.
// Fonts: Fraunces and JetBrains Mono (SIL Open Font Licence), static WOFF instances read at build only.

export const alt = `${SITE_NAME}. ${SITE_TAGLINE}.`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const INK = "#1e1613";
const INK_3 = "#635854";
const PAPER = "#fbf6f4";
const PROOF = "#d0271d";
const STRIP = [
  "#09b7dc",
  "#d0268c",
  "#fbd530",
  INK,
  "#5d5350",
  "#938a87",
  "#cdc5c2",
  PROOF,
];

function Crop({ top, left }: { top: boolean; left: boolean }) {
  const edge = 48;
  const len = 22;
  const gap = 8;
  return (
    <div
      style={{
        position: "absolute",
        display: "flex",
        width: 1,
        height: 1,
        [top ? "top" : "bottom"]: edge,
        [left ? "left" : "right"]: edge,
      }}
    >
      <div
        style={{
          position: "absolute",
          width: len,
          height: 2,
          background: INK_3,
          [top ? "top" : "bottom"]: 0,
          [left ? "right" : "left"]: gap,
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 2,
          height: len,
          background: INK_3,
          [top ? "bottom" : "top"]: gap,
          [left ? "left" : "right"]: 0,
        }}
      />
    </div>
  );
}

// Read when the module loads, so the image is drawn once at build time and served as a static file.
const dir = join(process.cwd(), "src/assets/og");
const [light, italic, mono] = await Promise.all([
  readFile(join(dir, "Fraunces-Light-opsz144.woff")),
  readFile(join(dir, "Fraunces-LightItalic-opsz144.woff")),
  readFile(join(dir, "JetBrainsMono-Medium.woff")),
]);

export default function OpenGraphImage() {

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          position: "relative",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: PAPER,
          color: INK,
          padding: "88px 96px",
        }}
      >
        <Crop top left />
        <Crop top left={false} />
        <Crop top={false} left />
        <Crop top={false} left={false} />

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              fontFamily: "JetBrains Mono",
              fontSize: 22,
              letterSpacing: 2,
              color: INK_3,
            }}
          >
            <div style={{ width: 14, height: 14, borderRadius: 7, background: PROOF }} />
            {`${SITE_NAME.toUpperCase()} · A SPECIMEN SHEET`}
          </div>
          <svg width="56" height="56" viewBox="0 0 24 24">
            <g fill="none" stroke={PROOF} strokeWidth="1.25">
              <circle cx="12" cy="12" r="6.5" />
              <path d="M12 1v22M1 12h22" />
            </g>
          </svg>
        </div>

        <div style={{ display: "flex", flexDirection: "column", fontFamily: "Fraunces", lineHeight: 1 }}>
          <div style={{ fontSize: 112, letterSpacing: -3 }}>A website that</div>
          <div style={{ display: "flex", fontSize: 112, letterSpacing: -3, fontStyle: "italic" }}>
            shows its working
            <span style={{ color: PROOF, fontStyle: "normal" }}>.</span>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", gap: 4 }}>
            {STRIP.map((c) => (
              <div key={c} style={{ width: 40, height: 16, background: c }} />
            ))}
          </div>
          <div style={{ display: "flex", fontFamily: "JetBrains Mono", fontSize: 22, color: INK_3 }}>
            {SPECIMENS.map((s) => s.title).join(" · ")}
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Fraunces", data: light, style: "normal", weight: 300 },
        { name: "Fraunces", data: italic, style: "italic", weight: 300 },
        { name: "JetBrains Mono", data: mono, style: "normal", weight: 500 },
      ],
    },
  );
}
