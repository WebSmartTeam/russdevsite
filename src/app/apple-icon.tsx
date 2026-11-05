import { ImageResponse } from "next/og";
import { ICON_FONTS, IconMark } from "@/lib/icon-mark";

// The iOS home-screen icon. iOS rounds the corners itself, so the mark is drawn square.
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(<IconMark px={size.width} rounded={false} />, {
    ...size,
    fonts: ICON_FONTS,
  });
}
