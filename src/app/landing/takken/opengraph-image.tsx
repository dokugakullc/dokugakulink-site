import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

async function fetchFont(): Promise<ArrayBuffer | null> {
  try {
    const chars =
      "ウカレル忘れた頃にまた出題復習を自動化して合格まで迷わないβ版参加受付中継続復習進捗可視化dokugakulink.com";
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
  const fontFamily = font ? '"Noto Sans JP", sans-serif' : "sans-serif";

  const features = ["継続学習", "復習支援", "進捗可視化"];
  const stats = [
    { num: "継続", unit: "", label: "学習の仕組み化" },
    { num: "復習", unit: "", label: "タイミングを提案" },
    { num: "進捗", unit: "", label: "現在地を可視化" },
  ];

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          backgroundColor: "#0d2545",
          display: "flex",
          flexDirection: "row",
          fontFamily,
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
            width: "65%",
            height: "100%",
            background:
              "linear-gradient(135deg, rgba(59,130,246,0.12) 0%, rgba(13,37,69,0) 70%)",
          }}
        />

        {/* 左カラム */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "72px 72px 72px 80px",
          }}
        >
          {/* ブランドタグ */}
          <div
            style={{
              display: "flex",
              marginBottom: 32,
            }}
          >
            <div
              style={{
                display: "flex",
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(147,197,253,0.30)",
                borderRadius: 9999,
                padding: "7px 20px",
              }}
            >
              <span style={{ color: "#93c5fd", fontSize: 18, fontWeight: 700 }}>
                ウカレル
              </span>
            </div>
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
                fontSize: 78,
                fontWeight: 700,
                color: "white",
                lineHeight: 1.2,
              }}
            >
              忘れた頃に、
            </span>
            <span
              style={{
                fontSize: 78,
                fontWeight: 700,
                color: "#93c5fd",
                lineHeight: 1.2,
              }}
            >
              また出題。
            </span>
          </div>

          {/* β版バッジ */}
          <div
            style={{
              display: "flex",
              marginBottom: 36,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                background: "rgba(255,255,255,0.10)",
                border: "1px solid rgba(255,255,255,0.20)",
                borderRadius: 9999,
                padding: "8px 18px",
              }}
            >
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: "#4ade80",
                }}
              />
              <span style={{ color: "white", fontSize: 20, fontWeight: 700 }}>
                β版参加受付中
              </span>
            </div>
          </div>

          {/* フィーチャーリスト */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 14,
            }}
          >
            {features.map((feat) => (
              <div
                key={feat}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                }}
              >
                <div
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: "#60a5fa",
                  }}
                />
                <span style={{ color: "#bfdbfe", fontSize: 22, fontWeight: 700 }}>
                  {feat}
                </span>
              </div>
            ))}
          </div>

          {/* ドメイン */}
          <div
            style={{
              display: "flex",
              marginTop: 40,
            }}
          >
            <span
              style={{
                color: "rgba(255,255,255,0.25)",
                fontSize: 16,
                fontWeight: 700,
              }}
            >
              dokugakulink.com
            </span>
          </div>
        </div>

        {/* 右カラム — 数値バッジ群 */}
        <div
          style={{
            width: 290,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "stretch",
            padding: "72px 48px 72px 24px",
            gap: 16,
          }}
        >
          {stats.map(({ num, unit, label }) => (
            <div
              key={label}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.10)",
                borderRadius: 16,
                padding: "20px 24px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  gap: 3,
                }}
              >
                <span
                  style={{
                    color: "white",
                    fontSize: 42,
                    fontWeight: 700,
                    lineHeight: 1,
                  }}
                >
                  {num}
                </span>
                <span
                  style={{
                    color: "#93c5fd",
                    fontSize: 20,
                    fontWeight: 700,
                  }}
                >
                  {unit}
                </span>
              </div>
              <span
                style={{
                  color: "rgba(255,255,255,0.40)",
                  fontSize: 13,
                  marginTop: 6,
                }}
              >
                {label}
              </span>
            </div>
          ))}
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
