import { ImageResponse } from "next/og";
import { ICON_FONTS, IconMark } from "@/lib/icon-mark";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(<IconMark px={size.width} rounded />, {
    ...size,
    fonts: ICON_FONTS,
  });
}
