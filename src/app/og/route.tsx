import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get("title")?.slice(0, 90) ?? "MeneerMarketing";
  const subtitle = searchParams.get("subtitle")?.slice(0, 120) ?? "";
  const accent = searchParams.get("accent") ?? "FF5722";
  const accentColor = `#${accent.replace("#", "")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 72px",
          background: "#0F172A",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
          }}
        >
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 12,
              background: accentColor,
            }}
          />
          <span style={{ color: "#94A3B8", fontSize: 22, fontWeight: 600 }}>
            MeneerMarketing
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div
            style={{
              fontSize: title.length > 50 ? 52 : 60,
              fontWeight: 800,
              color: "#F8FAFC",
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
              maxWidth: 1000,
            }}
          >
            {title}
          </div>
          {subtitle ? (
            <div
              style={{
                fontSize: 28,
                color: "#CBD5E1",
                lineHeight: 1.35,
                maxWidth: 900,
              }}
            >
              {subtitle}
            </div>
          ) : null}
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span style={{ color: accentColor, fontSize: 20, fontWeight: 700 }}>
            meneermarketing.nl
          </span>
          <div
            style={{
              width: 120,
              height: 6,
              borderRadius: 3,
              background: accentColor,
            }}
          />
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
