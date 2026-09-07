import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Visionary Masters Global AI automation services";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", padding: 80, color: "white", background: "linear-gradient(135deg, #111827, #1f2937)" }}>
      <div style={{ color: "#f59e0b", fontSize: 30, letterSpacing: 4 }}>VISIONARY MASTERS GLOBAL</div>
      <div style={{ fontSize: 68, fontWeight: 700, lineHeight: 1.1, marginTop: 30 }}>AI solutions that get your business work done.</div>
      <div style={{ fontSize: 30, color: "#d1d5db", marginTop: 30 }}>Automation · AI Voice · Excel · Power BI · Ad Creatives</div>
    </div>,
    size
  );
}
