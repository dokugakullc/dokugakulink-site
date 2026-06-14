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
    stat: "3",
    statUnit: "問",
    statLabel: "復習タイミング到来",
    headline: "忘れた頃に、また出題。",
    Screen: ReviewScreen,
    accentClass: "from-[#0d2545] to-[#0a1937]",
  },
  {
    id: "today",
    slideName: "today_problems",
    badge: "毎日の課題",
    badgeClass: "bg-blue-400 text-white",
    stat: "20",
    statUnit: "問",
    statLabel: "今日やるべき問題",
    headline: "今日やるべき問題が分かる。",
    Screen: HomeScreen,
    accentClass: "from-[#0d2545] to-blue-900",
  },
  {
    id: "analysis",
    slideName: "weakness_analysis",
    badge: "苦手分析",
    badgeClass: "bg-amber-400 text-white",
    stat: "55",
    statUnit: "%",
    statLabel: "弱点分野の正答率",
    headline: "苦手をなくして点数を伸ばす。",
    Screen: AnalysisScreen,
    accentClass: "from-[#0d2545] to-[#0a1a2e]",
  },
  {
    id: "prediction",
    slideName: "pass_prediction",
    badge: "合格予測",
    badgeClass: "bg-green-400 text-white",
    stat: "68",
    statUnit: "%",
    statLabel: "現在の合格可能性",
    headline: "今の実力が見える。",
    Screen: PredictionScreen,
    accentClass: "from-blue-900 to-[#0d2545]",
  },
  {
    id: "roadmap",
    slideName: "roadmap",
    badge: "学習設計",
    badgeClass: "bg-purple-400 text-white",
    stat: "87",
    statUnit: "日",
    statLabel: "試験まで残り",
    headline: "合格まで迷わない。",
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
        {SLIDES.map(({ id, badge, badgeClass, stat, statUnit, statLabel, headline, Screen, accentClass }, i) => (
          <div
            key={id}
            onClick={() => scrollTo(i)}
            className={`snap-center shrink-0 w-[310px] rounded-3xl overflow-hidden shadow-lg border border-white/10 cursor-pointer transition-transform duration-200 ${
              i === active ? "scale-100" : "scale-[0.97]"
            }`}
          >
            {/* Gradient top */}
            <div className={`bg-gradient-to-b ${accentClass} flex flex-col items-center pt-4 pb-4 px-4`}>
              {/* Badge + Stat row */}
              <div className="flex items-start justify-between w-full mb-3">
                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${badgeClass}`}>
                  {badge}
                </span>
                <div className="text-right">
                  <p className="text-white font-black text-[26px] leading-none tabular-nums">
                    {stat}<span className="text-[13px] font-bold ml-0.5">{statUnit}</span>
                  </p>
                  <p className="text-white/50 text-[8px] mt-0.5">{statLabel}</p>
                </div>
              </div>
              {/* Phone mockup */}
              <div className="relative">
                <Screen />
              </div>
            </div>

            {/* Headline only — no description */}
            <div className="bg-white px-5 py-4">
              <h3 className="text-[15px] font-bold text-[#0d2545] leading-snug">
                {headline}
              </h3>
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

      <p className="text-center text-[11px] text-gray-400 mt-3 md:hidden select-none">
        ← スワイプして確認 →
      </p>
    </div>
  );
}
