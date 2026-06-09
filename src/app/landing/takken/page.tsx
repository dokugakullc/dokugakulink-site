import type { Metadata } from "next";
import Link from "next/link";
import { HomeScreen, ProblemScreen, AnalysisScreen, ReviewScreen } from "@/components/AppMockup";
import EmailForm from "@/components/EmailForm";

export const metadata: Metadata = {
  title: "宅建独学支援アプリ | 忘れた頃に、もう一度出題。",
  description:
    "独学者のために作られた宅建学習支援アプリ。間隔反復・理解度分析・合格予測で、宅建独学合格を支援します。リリース通知を受け取る。",
  keywords: [
    "宅建", "宅建士", "独学", "資格取得", "学習支援", "宅建アプリ", "間隔反復", "合格予測",
  ],
};

const roadmapItems = [
  {
    label: "宅地建物取引士",
    status: "開発中",
    current: true,
    goal: false,
    desc: "毎年20万人以上が受験する国家資格",
  },
  {
    label: "ファイナンシャルプランナー（FP）",
    status: "予定",
    current: false,
    goal: false,
    desc: "資産形成・保険・年金の専門資格",
  },
  {
    label: "簿記",
    status: "予定",
    current: false,
    goal: false,
    desc: "会計・経理の基礎を証明する資格",
  },
  {
    label: "行政書士",
    status: "予定",
    current: false,
    goal: false,
    desc: "法律の専門家として幅広く活躍できる資格",
  },
  {
    label: "オンライン学習プラットフォーム",
    status: "最終目標",
    current: false,
    goal: true,
    desc: "教材・システム・コミュニティの統合",
  },
];

export default function TakkenLandingPage() {
  return (
    <div>
      {/* ─── Hero ─── */}
      <section className="bg-[#0d2545] text-white">
        <div className="mx-auto max-w-6xl px-6 lg:px-8 py-20 md:py-28">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Text */}
            <div>
              <div className="flex items-center gap-3 mb-8">
                <span className="inline-flex items-center gap-1.5 bg-white/10 border border-white/20 text-white text-xs font-medium px-3 py-1.5 rounded-full">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                  開発中
                </span>
                <p className="text-xs font-semibold uppercase tracking-widest text-blue-300">宅建学習アプリ</p>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-5xl font-bold leading-tight tracking-tight mb-6">
                忘れた頃に、<br />
                もう一度出題。
              </h1>
              <p className="text-xl text-blue-100 mb-8 leading-relaxed">
                独学者のために作られた<br />
                宅建学習支援アプリ
              </p>
              <div className="space-y-3 mb-8">
                {[
                  "独学で始めても続かない",
                  "一度覚えても忘れてしまう",
                  "合格まで何をすればいいか分からない",
                ].map((text) => (
                  <div key={text} className="flex items-center gap-2.5">
                    <span className="text-red-400 font-bold text-sm shrink-0">✕</span>
                    <p className="text-sm text-blue-100">{text}</p>
                  </div>
                ))}
              </div>
              <p className="text-sm text-blue-200 leading-loose mb-10 max-w-md">
                科学的な間隔反復と学習継続設計でこれらを解決します。
              </p>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <a
                  href="#notify"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-white text-[#0d2545] text-sm font-bold rounded-lg hover:bg-blue-50 transition-colors"
                >
                  リリース通知を受け取る
                  <span className="text-base">↓</span>
                </a>
                <Link
                  href="/services/takken"
                  className="text-sm text-blue-300 hover:text-white transition-colors"
                >
                  サービス詳細を見る →
                </Link>
              </div>
              <p className="text-white/30 text-xs mt-4">無料 · スパムなし · リリース時のみ連絡</p>
            </div>

            {/* Large Phone Mockup */}
            <div className="flex justify-center lg:justify-end">
              <div className="relative">
                <div className="absolute -inset-10 bg-blue-500/15 blur-3xl rounded-full" />
                <div className="relative z-10">
                  {/* 1.3x scaled phone: 240*1.3=312px, 480*1.3=624px */}
                  <div
                    className="relative mx-auto"
                    style={{ width: "312px", height: "624px" }}
                  >
                    <div
                      style={{
                        transformOrigin: "top left",
                        transform: "scale(1.3)",
                        position: "absolute",
                        top: 0,
                        left: 0,
                      }}
                    >
                      <HomeScreen />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Section 1: Problems ─── */}
      <section className="py-20 md:py-28 bg-white">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-xs font-semibold uppercase tracking-widest text-blue-700 mb-4">Problem</p>
            <h2 className="text-2xl md:text-3xl font-bold text-[#0d2545]">なぜ独学者は挫折するのか</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: "💤",
                title: "続かない",
                sub: "勉強習慣が定着しない",
                body: "参考書を買っても数週間で止まる。モチベーションが続かず、いつの間にか積読になってしまう。",
              },
              {
                icon: "🌫️",
                title: "忘れる",
                sub: "覚えた内容を忘れる",
                body: "一度覚えたはずの知識も時間とともに消えていく。復習のタイミングと頻度が分からない。",
              },
              {
                icon: "📍",
                title: "現在地が分からない",
                sub: "合格まで何をすれば良いか見えない",
                body: "何をどれだけ学べばいいのか不明確。自分の弱点がどこにあるのかも把握できない。",
              },
            ].map(({ icon, title, sub, body }) => (
              <div key={title} className="bg-[#f5f7fa] rounded-xl p-8 border-t-4 border-[#0d2545]">
                <div className="text-3xl mb-5">{icon}</div>
                <h3 className="text-lg font-bold text-[#0d2545] mb-1">{title}</h3>
                <p className="text-xs font-semibold text-blue-700 mb-4">{sub}</p>
                <p className="text-sm text-gray-600 leading-loose">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Section 2: Solutions ─── */}
      <section className="py-20 md:py-28 bg-[#0d2545] text-white">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-xs font-semibold uppercase tracking-widest text-blue-300 mb-4">Solution</p>
            <h2 className="text-2xl md:text-3xl font-bold">このアプリが解決すること</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {
                num: "01",
                icon: "↺",
                title: "忘れた頃に再出題",
                sub: "間隔反復",
                body: "科学的なタイミングで問題を再出題。最小の時間で最大の定着を実現します。",
              },
              {
                num: "02",
                icon: "📊",
                title: "理解度を可視化",
                sub: "分野別分析",
                body: "4分野の正答率をリアルタイムで可視化。弱点分野を自動で特定します。",
              },
              {
                num: "03",
                icon: "🎯",
                title: "合格予測",
                sub: "現在地を見える化",
                body: "現在の学習状況から合格予測スコアを算出。ゴールまでの距離が分かります。",
              },
              {
                num: "04",
                icon: "⚡",
                title: "スキマ時間学習",
                sub: "1問から学習可能",
                body: "通勤・休憩・隙間時間に1問から学習可能。無理なく習慣化できます。",
              },
            ].map(({ num, icon, title, sub, body }) => (
              <div key={num} className="bg-white/5 border border-white/10 rounded-xl p-6">
                <div className="text-2xl mb-4">{icon}</div>
                <p className="text-xs font-mono text-blue-400 mb-2">{num}</p>
                <h3 className="text-base font-bold mb-1">{title}</h3>
                <p className="text-xs text-blue-300 font-semibold mb-3">{sub}</p>
                <p className="text-sm text-blue-100 leading-loose">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Section 3: App Screens ─── */}
      <section className="py-20 md:py-28 bg-[#f5f7fa]">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-xs font-semibold uppercase tracking-widest text-blue-700 mb-4">Screens</p>
            <h2 className="text-2xl md:text-3xl font-bold text-[#0d2545]">アプリ画面紹介</h2>
            <p className="text-xs text-gray-400 mt-3">※ 開発中のデザインイメージです</p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            <div className="space-y-4">
              <HomeScreen />
              <div className="text-center">
                <p className="text-xs font-semibold text-[#0d2545]">ホーム</p>
                <p className="text-[11px] text-gray-500 mt-0.5">学習状況・合格予測</p>
              </div>
            </div>
            <div className="space-y-4">
              <ProblemScreen />
              <div className="text-center">
                <p className="text-xs font-semibold text-[#0d2545]">問題演習</p>
                <p className="text-[11px] text-gray-500 mt-0.5">○×形式・解説表示</p>
              </div>
            </div>
            <div className="space-y-4">
              <AnalysisScreen />
              <div className="text-center">
                <p className="text-xs font-semibold text-[#0d2545]">学習分析</p>
                <p className="text-[11px] text-gray-500 mt-0.5">分野別正答率・弱点発見</p>
              </div>
            </div>
            <div className="space-y-4">
              <ReviewScreen />
              <div className="text-center">
                <p className="text-xs font-semibold text-[#0d2545]">要復習リスト</p>
                <p className="text-[11px] text-gray-500 mt-0.5">忘却タイミング管理</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Section 4: Roadmap ─── */}
      <section className="py-20 md:py-28 bg-white">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-xs font-semibold uppercase tracking-widest text-blue-700 mb-4">Vision</p>
            <h2 className="text-2xl md:text-3xl font-bold text-[#0d2545]">将来構想</h2>
            <p className="text-sm text-gray-600 mt-4 max-w-xl mx-auto leading-loose">
              宅建士での実績をもとに、キャリア形成に役立つ資格全般へ展開していきます。
            </p>
          </div>
          <div className="max-w-xl mx-auto">
            <div>
              {roadmapItems.map(({ label, status, current, goal, desc }, i) => (
                <div key={label} className="flex gap-6">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-4 h-4 rounded-full border-2 shrink-0 mt-1 ${
                        goal
                          ? "bg-[#0d2545] border-[#0d2545]"
                          : current
                          ? "bg-blue-600 border-blue-600"
                          : "bg-white border-gray-300"
                      }`}
                    />
                    {i < roadmapItems.length - 1 && (
                      <div className="w-px flex-1 bg-gray-200 my-1" style={{ minHeight: "40px" }} />
                    )}
                  </div>
                  <div className="pb-8">
                    <div className="flex items-center gap-3 mb-1">
                      <p
                        className={`text-sm font-bold ${
                          current || goal ? "text-[#0d2545]" : "text-gray-500"
                        }`}
                      >
                        {label}
                      </p>
                      <span
                        className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                          current
                            ? "bg-blue-100 text-blue-700"
                            : goal
                            ? "bg-[#0d2545]/10 text-[#0d2545]"
                            : "bg-gray-100 text-gray-400"
                        }`}
                      >
                        {status}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── Section 5: Email CTA ─── */}
      <section id="notify" className="py-20 md:py-28 bg-[#0d2545] text-white">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-blue-300 mb-4">
              Early Access
            </p>
            <h2 className="text-2xl md:text-3xl font-bold mb-4">リリース通知を受け取る</h2>
            <p className="text-blue-100 leading-loose mb-10">
              宅建独学支援アプリのリリース時にお知らせします。
              <br />
              先行ユーザーとして登録してください。
            </p>
            <EmailForm />
          </div>
        </div>
      </section>

      {/* ─── Footer link bar ─── */}
      <div className="bg-[#081a38] border-t border-white/10 py-8">
        <div className="mx-auto max-w-6xl px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <Link href="/" className="text-sm font-bold text-white hover:text-blue-200 transition-colors">
            dokugaku link合同会社
          </Link>
          <div className="flex flex-wrap gap-6 text-xs text-gray-400">
            <Link href="/" className="hover:text-white transition-colors">ホーム</Link>
            <Link href="/services/takken" className="hover:text-white transition-colors">サービス詳細</Link>
            <Link href="/company" className="hover:text-white transition-colors">会社概要</Link>
            <Link href="/contact" className="hover:text-white transition-colors">お問い合わせ</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
