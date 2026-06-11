import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Google Fontsから日本語サブセットを取得
async function fetchFont(): Promise<ArrayBuffer | null> {
  try {
    const chars = "忘れた頃にまた出題宅建独学者のための学習支援アプリβ版先行募集中先着名無料仕事終わりの分でも合格を目指せる";
    const cssRes = await fetch(
      `https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@700&text=${encodeURIComponent(chars)}&display=block`,
      { headers: { "User-Agent": "Mozilla/5.0 (compatible; bot)" } }
    );
    const css = await cssRes.text();
    const fontUrl = css.match(/url\((https:\/\/fonts\.gstatic\.com[^)]+)\)/)?.[1];
    if (!fontUrl) return null;
    return fetch(fontUrl).then((r) => r.arrayBuffer());
  } catch {
    return null;
  }
}

export default async function Image() {
  const font = await fetchFont();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          backgroundColor: "#0d2545",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-start",
          padding: "80px",
          fontFamily: font ? '"Noto Sans JP", sans-serif' : "sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* 背景グラデーション */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "60%",
            height: "100%",
            background:
              "linear-gradient(135deg, rgba(59,130,246,0.12) 0%, rgba(13,37,69,0) 100%)",
          }}
        />

        {/* カテゴリタグ */}
        <div
          style={{
            display: "flex",
            background: "rgba(255,255,255,0.08)",
            border: "1px solid rgba(255,255,255,0.18)",
            borderRadius: 9999,
            padding: "8px 20px",
            marginBottom: 36,
          }}
        >
          <span style={{ color: "#93c5fd", fontSize: 20, fontWeight: 700 }}>
            宅建独学者のための学習支援アプリ · β版先行募集中
          </span>
        </div>

        {/* メインコピー */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginBottom: 28,
          }}
        >
          <span
            style={{
              fontSize: 80,
              fontWeight: 700,
              color: "white",
              lineHeight: 1.15,
            }}
          >
            忘れた頃に、
          </span>
          <span
            style={{
              fontSize: 80,
              fontWeight: 700,
              color: "#93c5fd",
              lineHeight: 1.15,
            }}
          >
            また出題。
          </span>
        </div>

        {/* サブコピー */}
        <div
          style={{
            fontSize: 24,
            color: "#bfdbfe",
            lineHeight: 1.6,
            marginBottom: 52,
          }}
        >
          仕事終わりの30分でも、独学合格を目指せる。
        </div>

        {/* CTAバッジ */}
        <div
          style={{
            display: "flex",
            background: "white",
            color: "#0d2545",
            fontSize: 20,
            fontWeight: 700,
            padding: "14px 28px",
            borderRadius: 12,
          }}
        >
          先着100名 · 無料でβ版に参加する →
        </div>

        {/* ロゴ */}
        <div
          style={{
            position: "absolute",
            bottom: 40,
            right: 60,
            color: "rgba(255,255,255,0.25)",
            fontSize: 18,
          }}
        >
          dokugaku link
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: font
        ? [{ name: "Noto Sans JP", data: font, weight: 700, style: "normal" }]
        : [],
    }
  );
}
