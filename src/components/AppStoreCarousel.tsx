"use client";
import { useRef, useState, useEffect, useCallback } from "react";
import {
  HomeScreen,
  AnalysisScreen,
  ReviewScreen,
  RoadmapScreen,
} from "@/components/AppMockup";

const SLIDES = [
  {
    id: "review",
    headline: "忘れた頃に、また出題。",
    benefit: "忘却タイミングを自動検知し、記憶が消える直前に再出題。復習を意識しなくていい状態を作ります。",
    Screen: ReviewScreen,
  },
  {
    id: "today",
    headline: "今日やるべき問題が分かる",
    benefit: "アプリを開いた瞬間に今日の課題が表示。「何を勉強しよう」の迷いがゼロになります。",
    Screen: HomeScreen,
  },
  {
    id: "analysis",
    headline: "苦手分野を自動分析",
    benefit: "分野別正答率を自動集計。「法令制限55%・あと7%で合格ライン」が数字で可視化されます。",
    Screen: AnalysisScreen,
  },
  {
    id: "prediction",
    headline: "合格可能性予測",
    benefit: "現在の学習ペースと正答率から合格確率をリアルタイム計算。ゴールまでの距離が常に分かります。",
    Screen: HomeScreen,
  },
  {
    id: "roadmap",
    headline: "学習ロードマップ",
    benefit: "試験日から逆算した学習計画を自動生成。今日何をすべきかが常に明確になります。",
    Screen: RoadmapScreen,
  },
] as const;

export default function AppStoreCarousel() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
            const idx = Array.from(track.children).indexOf(entry.target as HTMLElement);
            if (idx !== -1) setActive(idx);
          }
        }
      },
      { root: track, threshold: 0.5 },
    );

    Array.from(track.children).forEach((child) => observer.observe(child));
    return () => observer.disconnect();
  }, []);

  const scrollTo = useCallback((i: number) => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.children[i] as HTMLElement;
    const offset = card.offsetLeft - (track.clientWidth - card.offsetWidth) / 2;
    track.scrollTo({ left: offset, behavior: "smooth" });
  }, []);

  return (
    <div>
      <div
        ref={trackRef}
        className="carousel-track flex overflow-x-auto snap-x snap-mandatory gap-5 py-4"
        style={{
          scrollbarWidth: "none",
          paddingLeft: "max(16px, calc(50% - 150px))",
          paddingRight: "max(16px, calc(50% - 150px))",
        }}
      >
        {SLIDES.map(({ id, headline, benefit, Screen }, i) => (
          <div
            key={id}
            className="snap-center shrink-0 w-[300px] bg-white rounded-3xl shadow-md border border-gray-100 overflow-hidden cursor-pointer"
            onClick={() => scrollTo(i)}
          >
            <div className="flex justify-center pt-8 pb-6 bg-gradient-to-b from-[#f0f4f9] to-white px-6">
              <Screen />
            </div>
            <div className="px-6 pb-8 text-center">
              <h3 className="text-base font-bold text-[#0d2545] mb-2">{headline}</h3>
              <p className="text-xs text-gray-500 leading-relaxed">{benefit}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center gap-2 mt-3">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            aria-label={`スライド ${i + 1}`}
            onClick={() => scrollTo(i)}
            className={`rounded-full transition-all duration-200 ${
              i === active ? "w-5 h-2 bg-[#0d2545]" : "w-2 h-2 bg-gray-300 hover:bg-gray-400"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
