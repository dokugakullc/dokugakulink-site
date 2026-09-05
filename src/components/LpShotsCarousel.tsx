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

const RELEASED_SHOTS = [
  { file: "01_home", alt: "ウカレルのホーム画面。今日の15問が表示されている。", cap: "今日やることは、15問。迷わず学習を始められます。" },
  { file: "02_question", alt: "ウカレルの一問一答画面。", cap: "一問ずつ答えて、理解度も記録できます。" },
  { file: "03_explanation", alt: "ウカレルの解説画面。", cap: "回答後すぐに、理由まで解説で確認できます。" },
  { file: "04_review", alt: "復習待ちの問題を表示する画面。", cap: "正誤と理解度をもとに、復習する問題を確認できます。" },
  { file: "05_weakness", alt: "苦手分野を分析する画面。", cap: "分野ごとの結果から、優先して学ぶ場所が分かります。" },
  { file: "06_position", alt: "合格可能性と現在地を表示する画面。", cap: "学習データがたまると、合格までの現在地を目安として確認できます。" },
] as const;

// 全ブレークポイント共通のカルーセル。
// - スワイプ: タッチ/トラックパッドはネイティブ横スクロール（scroll-snap）
// - ドラッグ: マウスはポインタで掴んでスクロール（PC対応）
// - 左右矢印 / ドット: タップで対象画面へ中央寄せ
// - 自動スクロールはしない
export default function LpShotsCarousel({ released = false }: { released?: boolean }) {
  const shots = released ? RELEASED_SHOTS : SHOTS;
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const targetRef = useRef(0); // 連続クリックでも正しく進むよう最新の目標indexを保持
  const drag = useRef({ active: false, startX: 0, startScroll: 0, moved: 0 });

  // スクロール位置から中央のスライドを特定してドット/強調を同期
  const nearestIndex = () => {
    const track = trackRef.current;
    if (!track) return 0;
    const items = Array.from(track.children) as HTMLElement[];
    const center = track.scrollLeft + track.clientWidth / 2;
    let idx = 0;
    let best = Infinity;
    items.forEach((el, i) => {
      const c = el.offsetLeft + el.offsetWidth / 2;
      const d = Math.abs(c - center);
      if (d < best) {
        best = d;
        idx = i;
      }
    });
    return idx;
  };

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const sync = () => {
      const idx = nearestIndex();
      targetRef.current = idx;
      setActive(idx);
    };
    track.addEventListener("scroll", sync, { passive: true });
    sync();
    return () => track.removeEventListener("scroll", sync);
  }, []);

  const goTo = (i: number) => {
    const track = trackRef.current;
    if (!track) return;
    const clamped = Math.max(0, Math.min(shots.length - 1, i));
    const el = track.children[clamped] as HTMLElement | undefined;
    if (!el) return;
    targetRef.current = clamped;
    setActive(clamped); // タップ時は即座に反映（スクロール完了を待たない）
    const trackRect = track.getBoundingClientRect();
    const elRect = el.getBoundingClientRect();
    const delta =
      elRect.left - trackRect.left - (track.clientWidth - el.offsetWidth) / 2;
    track.scrollBy({ left: delta, behavior: "smooth" });
  };

  // マウスのドラッグでスクロール（タッチ/ペンはネイティブに任せる）
  const onPointerDown = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    const track = trackRef.current;
    if (!track) return;
    drag.current = { active: true, startX: e.clientX, startScroll: track.scrollLeft, moved: 0 };
    track.style.scrollSnapType = "none";
    track.setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!drag.current.active) return;
    const track = trackRef.current;
    if (!track) return;
    const dx = e.clientX - drag.current.startX;
    drag.current.moved = Math.max(drag.current.moved, Math.abs(dx));
    track.scrollLeft = drag.current.startScroll - dx;
  };
  const endDrag = () => {
    if (!drag.current.active) return;
    const track = trackRef.current;
    if (!track) return;
    drag.current.active = false;
    const idx = nearestIndex();
    track.style.scrollSnapType = "";
    goTo(idx); // ドラッグ後は最寄りのスライドへスナップ
  };
  // ドラッグ直後の誤クリックを抑止
  const onClickCapture = (e: React.MouseEvent) => {
    if (drag.current.moved > 6) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  return (
    <div className="uk-carousel">
      <div className="uk-shots-viewport">
        <button
          type="button"
          className="uk-arrow uk-arrow-prev"
          aria-label="前の画面へ"
          onClick={() => goTo(targetRef.current - 1)}
          disabled={active === 0}
        >
          <span aria-hidden="true">‹</span>
        </button>

        <div
          className="uk-shots"
          ref={trackRef}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onClickCapture={onClickCapture}
        >
          {shots.map(({ file, alt, cap }, i) => (
            <figure key={file} className={`uk-shot ${i === active ? "is-active" : ""}`}>
              <div className="uk-phone uk-phone-sm">
                <Image
                  src={released ? `/screenshots/ukareru-b17/${file}.png` : `/screenshots/ukareru/${file}.webp`}
                  alt={alt}
                  width={828}
                  height={1792}
                  loading="lazy"
                  draggable={false}
                  sizes="(max-width: 640px) 78vw, 360px"
                  className="uk-phone-img"
                />
              </div>
              <figcaption className="uk-shot-cap">{cap}</figcaption>
            </figure>
          ))}
        </div>

        <button
          type="button"
          className="uk-arrow uk-arrow-next"
          aria-label="次の画面へ"
          onClick={() => goTo(targetRef.current + 1)}
          disabled={active === shots.length - 1}
        >
          <span aria-hidden="true">›</span>
        </button>
      </div>

      <div className="uk-shots-dots" aria-label="アプリ画面の切り替え">
        {shots.map(({ file }, i) => (
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
