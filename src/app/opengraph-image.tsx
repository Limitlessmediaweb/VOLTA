import { ImageResponse } from "next/og";

export const alt = "VOLTA — Accendi la casa che hai in mente";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Immagine Open Graph generata (nessuna foto): buio, un alone caldo e il wordmark. */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          padding: 80,
          background: "radial-gradient(circle at 75% 20%, rgba(255,200,87,0.45), rgba(10,9,8,1) 55%)",
          backgroundColor: "#0A0908",
          color: "#FFF6E5",
        }}
      >
        <div style={{ fontSize: 28, letterSpacing: 8, color: "#FFC857" }}>VOLTA</div>
        <div style={{ fontSize: 84, fontWeight: 700, lineHeight: 1, marginTop: 24, textTransform: "uppercase", maxWidth: 900 }}>
          Accendi la casa che hai in mente.
        </div>
        <div style={{ fontSize: 26, marginTop: 28, color: "#B8AD9B" }}>Impianti elettrici · Luce · Domotica — progetto concept</div>
      </div>
    ),
    size,
  );
}
