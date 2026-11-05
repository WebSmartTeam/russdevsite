// Writes src/app/favicon.ico: the wordmark's initial, "P." in Fraunces on ink, at 16, 32 and 48px.
// It uses the same renderer as the app's icon routes (next/og), so the .ico for older browsers and
// the PNG icons match. Keep the drawing in step with src/app/icon.tsx.
// Run from the deployable folder: node scripts/make-favicon.mjs
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { createElement as h } from "react";
import { ImageResponse } from "next/dist/compiled/@vercel/og/index.node.js";

const root = new URL("../", import.meta.url);
const font = readFileSync(new URL("src/assets/og/Fraunces-SemiBold-opsz72.woff", root));

function mark(size) {
  return h(
    "div",
    {
      style: {
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#1e1613",
        borderRadius: Math.round(size * 0.1875),
        color: "#fbf6f4",
        fontFamily: "Fraunces",
        fontSize: Math.round(size * 0.86),
        lineHeight: 1,
        paddingBottom: Math.round(size * 0.06),
      },
    },
    "P",
    h("span", { style: { color: "#f15f49" } }, "."),
  );
}

async function png(size) {
  const res = new ImageResponse(mark(size), {
    width: size,
    height: size,
    fonts: [{ name: "Fraunces", data: font, weight: 600, style: "normal" }],
  });
  return Buffer.from(await res.arrayBuffer());
}

const sizes = [16, 32, 48];
const images = await Promise.all(sizes.map(png));

const header = Buffer.alloc(6);
header.writeUInt16LE(0, 0);
header.writeUInt16LE(1, 2); // type: icon
header.writeUInt16LE(images.length, 4);
let offset = 6 + 16 * images.length;
const entries = images.map((img, k) => {
  const e = Buffer.alloc(16);
  e[0] = sizes[k];
  e[1] = sizes[k];
  e.writeUInt16LE(1, 4); // colour planes
  e.writeUInt16LE(32, 6); // bits per pixel
  e.writeUInt32LE(img.length, 8);
  e.writeUInt32LE(offset, 12);
  offset += img.length;
  return e;
});

const out = fileURLToPath(new URL("src/app/favicon.ico", root));
writeFileSync(out, Buffer.concat([header, ...entries, ...images]));
console.log(`wrote src/app/favicon.ico (${sizes.join(", ")}px, ${images.map((i) => i.length).join("/")} bytes)`);
