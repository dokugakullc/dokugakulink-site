import type { Metadata } from "next";
import Link from "next/link";
import { HomeScreen, ProblemScreen, AnalysisScreen, ReviewScreen } from "@/components/AppMockup";

export const metadata: Metadata = {
  title: "宅建独学支援アプリ",
  description:
    "宅地建物取引士試験を独学で合格するためのスマートフォンアプリ。間隔反復・理解度分析・学習継続支援の3つで、宅建独学合格率の向上を目指します。",
};

const features = [
  {
    number: "01",
    title: "間隔反復",
    subtitle: "忘れた頃に、もう一度出題。",
    body: "人間の記憶は時間とともに薄れていきます。忘れかけたタイミングで再出題することで、最小の時間で最大の定着を実現します。やみくもに反復するのではなく、科学的な間隔で学習を設計します。",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="23 4 23 10 17 10" /><polyline points="1 20 1 14 7 14" />
        <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
      </svg>
    ),
  },
  {
    number: "02",
    title: "理解度分析",
    subtitle: "弱点を見える化する。",
    body: "どの分野が得意で、どこが弱点なのかをリアルタイムで可視化します。宅建試験の権利関係・法令上の制限・宅建業法・税その他の4分野について、学習進捗と理解度を把握できます。",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" />
      </svg>
    ),
  },
  {
    number: "03",
    title: "学習継続支援",
    subtitle: "続けられる仕組みを設計する。",
    body: "独学最大の壁は「続かないこと」です。隙間時間に使いやすいモバイルファースト設計と、学習習慣を定着させるUX設計によって、毎日少しずつでも学び続けられる仕組みを提供します。",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
      </svg>
    ),
  },
];

const problems = [
  { label: "参考書を買っても続かない", detail: "モチベーションが続かず積読になる" },
  { label: "一夜漬けでは忘れてしまう", detail: "復習のタイミングと頻度が分からない" },
  { label: "自分の弱点が分からない", detail: "何をどれだけ学べばよいか見えない" },
  { label: "予備校代が高い", detail: "独学したいが効率的な方法が分からない" },
];

export default function TakkenPage() {
  return (
    <div className="bg-white">

      {/* Hero */}
      <div className="bg-[#0d2545] text-white">
        <div className="mx-auto max-w-6xl px-6 lg:px-8 py-20 md:py-32">
          <div className="flex items-center gap-3 mb-8">
            <span className="text-xs font-medium text-blue-300 border border-blue-400/40 px-3 py-1 rounded-full">開発中</span>
            <p className="text-xs font-semibold uppercase tracking-widest text-blue-300">Service</p>
          </div>
          <p className="text-lg md:text-xl font-bold text-blue-200 mb-4">宅地建物取引士試験 独学支援アプリ</p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight mb-8">
            忘れた頃に、<br />もう一度出題。
          </h1>
          <p className="text-blue-100 text-base md:text-lg max-w-xl leading-loose">
            間隔反復・理解度分析・学習継続支援の3つで、
            宅建独学合格を目指すすべての人を支援します。
          </p>
        </div>
      </div>

      {/* コンセプト */}
      <section className="py-20 md:py-28 border-b border-gray-100">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-widest text-blue-700 mb-4">Concept</p>
            <h2 className="text-2xl md:text-3xl font-bold text-[#0d2545] mb-8">コンセプト</h2>
            <div className="space-y-5 text-gray-700 leading-loose text-sm md:text-base">
              <p>
                宅建試験の合格率は毎年15〜17%前後。
                多くの受験者が独学で挑みながら、継続できずに諦めています。
              </p>
              <p>
                問題は能力ではありません。<strong className="text-[#0d2545]">仕組みがないことです。</strong>
              </p>
              <p>
                科学的な間隔反復アルゴリズムと、独学者のリアルな課題に向き合った体験設計で、
                「続けられる」宅建独学支援アプリを開発しています。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* アプリ画面モックアップ */}
      <section className="py-20 md:py-28 bg-[#f5f7fa] border-b border-gray-100">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <div className="mb-12">
            <p className="text-xs font-semibold uppercase tracking-widest text-blue-700 mb-4">Screens</p>
            <h2 className="text-2xl md:text-3xl font-bold text-[#0d2545]">アプリ画面イメージ</h2>
            <p className="text-sm text-gray-500 mt-3">※ 開発中のデザインイメージです</p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            <div className="space-y-3">
              <HomeScreen />
              <div className="text-center">
                <p className="text-xs font-semibold text-[#0d2545]">ホーム</p>
                <p className="text-[11px] text-gray-500 mt-0.5">学習状況・合格予測</p>
              </div>
            </div>
            <div className="space-y-3">
              <ProblemScreen />
              <div className="text-center">
                <p className="text-xs font-semibold text-[#0d2545]">問題演習</p>
                <p className="text-[11px] text-gray-500 mt-0.5">○×形式・解説表示</p>
              </div>
            </div>
            <div className="space-y-3">
              <AnalysisScreen />
              <div className="text-center">
                <p className="text-xs font-semibold text-[#0d2545]">学習分析</p>
                <p className="text-[11px] text-gray-500 mt-0.5">分野別正答率・弱点発見</p>
              </div>
            </div>
            <div className="space-y-3">
              <ReviewScreen />
              <div className="text-center">
                <p className="text-xs font-semibold text-[#0d2545]">要復習リスト</p>
                <p className="text-[11px] text-gray-500 mt-0.5">忘却タイミング管理</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* なぜ作るのか */}
      <section className="py-20 md:py-28 border-b border-gray-100">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-widest text-blue-700 mb-4">Why</p>
            <h2 className="text-2xl md:text-3xl font-bold text-[#0d2545] mb-8">なぜ作るのか</h2>
            <div className="space-y-5 text-gray-700 leading-loose text-sm md:text-base">
              <p>
                資格試験に挑戦する人の多くは、勉強ができないのではありません。
              </p>
              <div className="border-l-4 border-[#0d2545] pl-6 py-2 my-6">
                <p className="text-xl font-bold text-[#0d2545] leading-relaxed">
                  継続できない。<br />
                  復習できない。<br />
                  現在地が分からない。
                </p>
              </div>
              <p>
                この3つの問題を抱えています。問題は意志の弱さではなく、
                <strong className="text-[#0d2545]">仕組みの不在</strong>です。
              </p>
              <p>
                私たちは「忘れた頃にもう一度出題する」という考え方を軸に、
                独学者の継続学習を支援するアプリを作っています。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 解決したい課題 */}
      <section className="py-20 md:py-28 bg-[#f5f7fa] border-b border-gray-100">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <div className="mb-12">
            <p className="text-xs font-semibold uppercase tracking-widest text-blue-700 mb-4">Problem</p>
            <h2 className="text-2xl md:text-3xl font-bold text-[#0d2545]">独学者が直面する壁</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {problems.map(({ label, detail }) => (
              <div key={label} className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-start gap-3">
                  <span className="text-red-400 font-bold text-xl shrink-0 leading-none mt-0.5">✕</span>
                  <div>
                    <p className="text-sm font-bold text-[#0d2545] mb-1">{label}</p>
                    <p className="text-xs text-gray-500">{detail}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3つの特徴 */}
      <section className="py-20 md:py-28 border-b border-gray-100">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <div className="mb-14">
            <p className="text-xs font-semibold uppercase tracking-widest text-blue-700 mb-4">Features</p>
            <h2 className="text-2xl md:text-3xl font-bold text-[#0d2545]">3つの特徴</h2>
          </div>
          <div className="space-y-12">
            {features.map(({ number, title, subtitle, body, icon }) => (
              <div key={number} className="grid grid-cols-1 md:grid-cols-4 gap-8 items-start">
                <div className="md:col-span-1">
                  <div className="w-14 h-14 bg-[#0d2545] rounded-xl flex items-center justify-center text-white mb-4">
                    {icon}
                  </div>
                  <p className="text-xs font-mono text-gray-400 mb-1">{number}</p>
                  <h3 className="text-lg font-bold text-[#0d2545]">{title}</h3>
                </div>
                <div className="md:col-span-3 border-l border-gray-200 pl-8">
                  <p className="text-base font-semibold text-[#0d2545] mb-3">{subtitle}</p>
                  <p className="text-sm text-gray-600 leading-loose">{body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 対象資格・将来構想 */}
      <section className="py-20 md:py-28 bg-[#0d2545] text-white border-b border-gray-100">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-blue-300 mb-4">Launch</p>
              <h2 className="text-xl font-bold mb-6">まず宅建士から始める</h2>
              <div className="border border-white/20 rounded-lg p-6 bg-white/5 mb-4">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-xs font-medium text-blue-300 border border-blue-400/40 px-3 py-1 rounded-full">開発中</span>
                </div>
                <p className="text-base font-bold">宅地建物取引士試験</p>
                <p className="text-blue-200 text-sm mt-2 leading-loose">
                  毎年20万人以上が受験する国家資格。
                  不動産業界への就職・転職・副業・独立に直結します。
                </p>
              </div>
              <p className="text-blue-200 text-sm leading-loose">
                宅建士での実績をもとに、キャリア形成に役立つ資格全般へ展開していきます。
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-blue-300 mb-4">Roadmap</p>
              <h2 className="text-xl font-bold mb-6">将来構想</h2>
              <div className="space-y-3">
                {[
                  { label: "宅地建物取引士", status: "開発中", current: true },
                  { label: "ファイナンシャルプランナー（FP）", status: "予定", current: false },
                  { label: "行政書士", status: "予定", current: false },
                  { label: "簿記", status: "予定", current: false },
                ].map(({ label, status, current }) => (
                  <div key={label} className={`flex items-center justify-between rounded-lg px-4 py-3 ${current ? "bg-white/15" : "bg-white/5"}`}>
                    <span className="text-sm">{label}</span>
                    <span className={`text-xs px-2.5 py-1 rounded-full ${current ? "bg-blue-500/40 text-blue-200" : "bg-white/10 text-white/40"}`}>
                      {status}
                    </span>
                  </div>
                ))}
              </div>
              <p className="text-blue-200 text-sm mt-5 leading-loose">
                最終的には教材・学習システム・コミュニティ・情報発信を統合した
                オンライン学習プラットフォームの実現を目指します。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 開発ロードマップ */}
      <section className="py-20 md:py-28 bg-[#f5f7fa] border-b border-gray-100">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <div className="mb-12">
            <p className="text-xs font-semibold uppercase tracking-widest text-blue-700 mb-4">Development</p>
            <h2 className="text-2xl md:text-3xl font-bold text-[#0d2545]">開発ロードマップ</h2>
          </div>
          <div className="relative">
            {/* Line connector (desktop) */}
            <div className="hidden md:block absolute top-5 left-[calc(12.5%+6px)] right-[calc(12.5%+6px)] h-px bg-gray-200" />
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[
                { step: "01", title: "設計・開発", status: "進行中", current: true },
                { step: "02", title: "ベータ版公開", status: "次のステップ", current: false },
                { step: "03", title: "正式リリース", status: "予定", current: false },
                { step: "04", title: "資格横展開", status: "予定", current: false },
              ].map(({ step, title, status, current }) => (
                <div key={step} className="flex md:flex-col items-start md:items-center gap-4 md:gap-3 md:text-center">
                  <div className={`relative shrink-0 w-11 h-11 rounded-full flex items-center justify-center border-2 z-10 ${
                    current
                      ? "bg-[#0d2545] border-[#0d2545] text-white"
                      : "bg-white border-gray-300 text-gray-400"
                  }`}>
                    <span className="text-xs font-bold">{step}</span>
                  </div>
                  <div>
                    <p className={`text-sm font-bold ${current ? "text-[#0d2545]" : "text-gray-500"}`}>
                      {title}
                    </p>
                    <span className={`text-xs font-medium mt-1 inline-block px-2 py-0.5 rounded-full ${
                      current ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-400"
                    }`}>
                      {status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* LP誘導 */}
      <section className="py-16 bg-[#0d2545] text-white">
        <div className="mx-auto max-w-6xl px-6 lg:px-8 text-center">
          <p className="text-blue-200 text-sm mb-6">
            リリースをいち早くお知らせします
          </p>
          <h2 className="text-2xl font-bold mb-4">宅建独学支援アプリ</h2>
          <p className="text-blue-100 text-sm leading-loose mb-8 max-w-md mx-auto">
            「忘れた頃にもう一度出題する」間隔反復で、独学合格を支援します。
          </p>
          <Link
            href="/landing/takken"
            className="inline-flex items-center px-8 py-4 bg-white text-[#0d2545] text-sm font-bold rounded-lg hover:bg-blue-50 transition-colors"
          >
            詳しくはこちら・リリース通知を受け取る →
          </Link>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-6 lg:px-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-blue-700 mb-4">Contact</p>
          <h2 className="text-2xl font-bold text-[#0d2545] mb-4">
            サービスに関するお問い合わせ
          </h2>
          <p className="text-sm text-gray-600 leading-loose mb-8 max-w-md mx-auto">
            β版テストへのご参加、ご意見・ご要望は下記よりお気軽にお問い合わせください。
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center px-8 py-3.5 bg-[#0d2545] text-white text-sm font-semibold rounded hover:bg-[#142f5a] transition-colors"
            >
              お問い合わせ
            </Link>
            <Link
              href="/business#learning"
              className="inline-flex items-center px-8 py-3.5 border border-gray-300 text-[#0d2545] text-sm font-semibold rounded hover:bg-gray-50 transition-colors"
            >
              事業詳細を見る
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
