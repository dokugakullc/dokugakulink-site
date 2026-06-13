"use client";
import { useRef, useState, useEffect, useCallback } from "react";
import {
  ReviewScreen,
  HomeScreen,
  AnalysisScreen,
  PredictionScreen,
  RoadmapScreen,
} from "@/components/AppMockup";
import { sendGAEvent } from "@/lib/gtag";

const SLIDES = [
  {
    id: "review",
    slideName: "review",
    badge: "SRS記憶法",
    badgeClass: "bg-orange-400 text-white",
    headline: "忘れた頃に、\nまた出題。",
    benefit: "記憶が薄れるタイミングで自動出題。「復習しなきゃ」という悩みが完全に消えます。",
    Screen: ReviewScreen,
    accentClass: "from-[#0d2545] to-[#0a1937]",
  },
  {
    id: "today",
    slideName: "today_problems",
    badge: "毎日の課題",
    badgeClass: "bg-blue-400 text-white",
    headline: "今日やるべき問題が\n開いた瞬間に分かる",
    benefit: "今日の目標が即座に表示。「どこから始めよう」という迷いがゼロになります。",
    Screen: HomeScreen,
    accentClass: "from-[#0d2545] to-blue-900",
  },
  {
    id: "analysis",
    slideName: "weakness_analysis",
    badge: "苦手分析",
    badgeClass: "bg-amber-400 text-white",
    headline: "苦手が見えるから\n点数が伸びる",
    benefit: "分野別の正答率が自動で可視化。弱点を把握して、効率よく点数を上げられます。",
    Screen: AnalysisScreen,
    accentClass: "from-[#0d2545] to-[#0a1a2e]",
  },
  {
    id: "prediction",
    slideName: "pass_prediction",
    badge: "合格予測",
    badgeClass: "bg-green-400 text-white",
    headline: "今の実力が\nリアルタイムに分かる",
    benefit: "現在の学習状況から合格確率を自動計算。ゴールまでの距離が常に見えます。",
    Screen: PredictionScreen,
    accentClass: "from-blue-900 to-[#0d2545]",
  },
  {
    id: "roadmap",
    slideName: "roadmap",
    badge: "学習設計",
    badgeClass: "bg-purple-400 text-white",
    headline: "合格までの\n道筋が見える",
    benefit: "試験日から逆算した学習計画を自動生成。やるべきことが常に明確になります。",
    Screen: RoadmapScreen,
    accentClass: "from-[#0d2545] to-[#1a0d45]",
  },
] as const;

export default function AppStoreCarousel() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const firedRef = useRef<Set<number>>(new Set());

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
            const idx = Array.from(track.children).indexOf(entry.target as HTMLElement);
            if (idx === -1) continue;
            setActive(idx);
            if (!firedRef.current.has(idx)) {
              firedRef.current.add(idx);
              sendGAEvent("carousel_slide_view", { slide_name: SLIDES[idx].slideName });
            }
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
      {/* Track */}
      <div
        ref={trackRef}
        className="flex overflow-x-auto snap-x snap-mandatory gap-4 py-4"
        style={{
          scrollbarWidth: "none",
          paddingLeft: "max(16px, calc(50% - 155px))",
          paddingRight: "max(16px, calc(50% - 155px))",
        }}
      >
        {SLIDES.map(({ id, badge, badgeClass, headline, benefit, Screen, accentClass }, i) => (
          <div
            key={id}
            onClick={() => scrollTo(i)}
            className={`snap-center shrink-0 w-[310px] rounded-3xl overflow-hidden shadow-lg border border-white/10 cursor-pointer transition-transform duration-200 ${
              i === active ? "scale-100" : "scale-[0.97]"
            }`}
          >
            {/* Gradient top — app screenshot area */}
            <div className={`bg-gradient-to-b ${accentClass} flex flex-col items-center pt-5 pb-0 px-4`}>
              <div className="flex items-center gap-2 mb-4 self-start">
                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${badgeClass}`}>
                  {badge}
                </span>
              </div>
              {/* Phone mockup — no bottom rounding so it bleeds into the white section */}
              <div className="relative">
                <Screen />
              </div>
            </div>

            {/* Text section */}
            <div className="bg-white px-6 py-5">
              <h3 className="text-[15px] font-bold text-[#0d2545] mb-2 leading-snug whitespace-pre-line">
                {headline}
              </h3>
              <p className="text-[11px] text-gray-500 leading-relaxed">{benefit}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Indicators */}
      <div className="flex justify-center items-center gap-2 mt-2">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            aria-label={`スライド ${i + 1}`}
            onClick={() => scrollTo(i)}
            className={`rounded-full transition-all duration-200 ${
              i === active
                ? "w-6 h-2 bg-[#0d2545]"
                : "w-2 h-2 bg-gray-300 hover:bg-gray-400"
            }`}
          />
        ))}
      </div>

      {/* Swipe hint — visible only on mobile, disappears after first interaction */}
      <p className="text-center text-[11px] text-gray-400 mt-3 md:hidden select-none">
        ← スワイプして確認 →
      </p>
    </div>
  );
}
