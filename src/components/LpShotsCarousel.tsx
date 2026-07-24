"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";

// アプリ体験セクションのスクリーンショット（実 App Store 素材 01〜06）
const SHOTS = [
  { file: "01_home", alt: "ウカレルのホーム画面。今日やるべき学習が表示されている。", cap: "今日やるべき学習が、ひと目で分かる。" },
  { file: "02_probability", alt: "合格可能性・現在地を表示する画面。", cap: "正解数だけでなく、合格までの現在地を確認。" },
  { file: "03_analysis", alt: "苦手分野を分析する画面。", cap: "苦手な分野を把握し、次の学習へつなげる。" },
  { file: "04_quiz", alt: "問題演習の画面。", cap: "一問ずつ、理解しながら進められる。" },
  { file: "05_explanation", alt: "解説画面。", cap: "解説で、なぜそうなるかまで理解できる。" },
  { file: "06_result", alt: "演習結果を振り返る画面。", cap: "解いた学習を振り返り、積み重ねが見える。" },
] as const;

// モバイルでは左右スワイプ + ドットタップで移動できるカルーセル、
// PC（>640px）では CSS グリッド（3列）のまま。自動スクロールはしない。
export default function LpShotsCarousel() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const sync = () => {
      const items = Array.from(track.children) as HTMLElement[];
      if (items.length === 0) return;
      const center = track.scrollLeft + track.clientWidth / 2;
      let idx = 0;
      let best = Infinity;
      items.forEach((el, i) => {
        const elCenter = el.offsetLeft + el.offsetWidth / 2;
        const d = Math.abs(elCenter - center);
        if (d < best) {
          best = d;
          idx = i;
        }
      });
      setActive(idx);
    };

    track.addEventListener("scroll", sync, { passive: true });
    sync();
    return () => track.removeEventListener("scroll", sync);
  }, []);

  const goTo = (i: number) => {
    const track = trackRef.current;
    if (!track) return;
    const el = track.children[i] as HTMLElement | undefined;
    if (!el) return;
    // タップ時は即座にドットを反映（スクロール完了を待たない）
    setActive(i);
    // rect ベースで現在のスクロール位置に依存せず中央寄せする
    const trackRect = track.getBoundingClientRect();
    const elRect = el.getBoundingClientRect();
    const delta =
      elRect.left - trackRect.left - (track.clientWidth - el.offsetWidth) / 2;
    track.scrollBy({ left: delta, behavior: "smooth" });
  };

  return (
    <div className="uk-shots-wrap">
      <div className="uk-shots" ref={trackRef}>
        {SHOTS.map(({ file, alt, cap }) => (
          <figure key={file} className="uk-shot">
            <div className="uk-phone uk-phone-sm">
              <Image
                src={`/screenshots/ukareru/${file}.webp`}
                alt={alt}
                width={828}
                height={1792}
                loading="lazy"
                sizes="(max-width: 640px) 80vw, 300px"
                className="uk-phone-img"
              />
            </div>
            <figcaption className="uk-shot-cap">{cap}</figcaption>
          </figure>
        ))}
      </div>

      {/* ドットインジケータ（モバイルのみ表示・CSS 制御） */}
      <div className="uk-shots-dots" aria-label="アプリ画面の切り替え">
        {SHOTS.map(({ file }, i) => (
          <button
            key={file}
            type="button"
            className={`uk-dot ${i === active ? "is-active" : ""}`}
            aria-label={`${i + 1}枚目の画面を表示`}
            aria-current={i === active ? "true" : undefined}
            onClick={() => goTo(i)}
          />
        ))}
      </div>
    </div>
  );
}
