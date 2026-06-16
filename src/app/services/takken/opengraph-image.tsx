import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

async function fetchFont(): Promise<ArrayBuffer | null> {
  try {
    const chars =
      "何を勉強すれば受かるか分かる宅建独学合格まで導く学習アプリナビゲーション現在地苦手分野今日やるべき問題見える化β版先行登録受付中無料30日1000問厳選あと5点圏dokugakulink.com";
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

  const features = ["現在地・苦手分野を見える化", "今日やるべき問題が分かる", "合格可能性をリアルタイム確認"];
  const stats = [
    { num: "あと5", unit: "点", label: "合格圏まで" },
    { num: "1,000", unit: "問", label: "厳選問題" },
    { num: "30", unit: "日", label: "初回無料" },
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
              "linear-gradient(135deg, rgba(0,122,255,0.14) 0%, rgba(13,37,69,0) 70%)",
          }}
        />

        {/* 左カラム */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "72px 64px 72px 80px",
          }}
        >
          {/* タグ */}
          <div style={{ display: "flex", marginBottom: 28 }}>
            <div
              style={{
                display: "flex",
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(147,197,253,0.30)",
                borderRadius: 9999,
                padding: "7px 20px",
              }}
            >
              <span style={{ color: "#93c5fd", fontSize: 17, fontWeight: 700 }}>
                宅建独学合格ナビゲーションアプリ
              </span>
            </div>
          </div>

          {/* メインコピー */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              marginBottom: 24,
            }}
          >
            <span style={{ fontSize: 66, fontWeight: 700, color: "white", lineHeight: 1.25 }}>
              何を勉強すれば
            </span>
            <span style={{ fontSize: 66, fontWeight: 700, color: "#60a5fa", lineHeight: 1.25 }}>
              受かるか分かる。
            </span>
          </div>

          {/* β版バッジ */}
          <div style={{ display: "flex", marginBottom: 32 }}>
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
                style={{ width: 8, height: 8, borderRadius: "50%", background: "#4ade80" }}
              />
              <span style={{ color: "white", fontSize: 19, fontWeight: 700 }}>
                β版先行登録受付中
              </span>
            </div>
          </div>

          {/* フィーチャーリスト */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {features.map((feat) => (
              <div key={feat} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div
                  style={{ width: 6, height: 6, borderRadius: "50%", background: "#60a5fa" }}
                />
                <span style={{ color: "#bfdbfe", fontSize: 20, fontWeight: 700 }}>
                  {feat}
                </span>
              </div>
            ))}
          </div>

          {/* ドメイン */}
          <div style={{ display: "flex", marginTop: 36 }}>
            <span style={{ color: "rgba(255,255,255,0.25)", fontSize: 15, fontWeight: 700 }}>
              dokugakulink.com/services/takken
            </span>
          </div>
        </div>

        {/* 右カラム — 数値バッジ群 */}
        <div
          style={{
            width: 280,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "stretch",
            padding: "72px 48px 72px 20px",
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
                padding: "18px 20px",
              }}
            >
              <div style={{ display: "flex", alignItems: "baseline", gap: 3 }}>
                <span style={{ color: "white", fontSize: 36, fontWeight: 700, lineHeight: 1 }}>
                  {num}
                </span>
                <span style={{ color: "#93c5fd", fontSize: 18, fontWeight: 700 }}>
                  {unit}
                </span>
              </div>
              <span style={{ color: "rgba(255,255,255,0.40)", fontSize: 13, marginTop: 5 }}>
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
