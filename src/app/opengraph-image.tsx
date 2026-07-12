import { ImageResponse } from "next/og";
import { SITE_DESCRIPTION, SITE_NAME } from "@/lib/seo/metadata";

export const alt = SITE_NAME;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "72px",
          background: "linear-gradient(135deg, #0f172a 0%, #be123c 100%)",
          color: "white",
          fontFamily: "Inter, sans-serif",
        }}
      >
        <div style={{ fontSize: 72, fontWeight: 800, letterSpacing: "-0.04em" }}>
          {SITE_NAME}
        </div>
        <div style={{ marginTop: 24, fontSize: 32, maxWidth: 900, lineHeight: 1.35, opacity: 0.92 }}>
          {SITE_DESCRIPTION}
        </div>
      </div>
    ),
    { ...size }
  );
}
