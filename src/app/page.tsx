import Link from "next/link";
import { HomeScreen, ProblemScreen } from "@/components/AppMockup";

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="bg-[#0d2545] text-white">
        <div className="mx-auto max-w-6xl px-6 lg:px-8 py-32 md:py-44">
          <div className="flex flex-wrap items-center gap-3 mb-8">
            <p className="text-xs font-semibold tracking-widest text-blue-300 uppercase">
              dokugaku link
            </p>
            <span className="inline-flex items-center gap-1.5 bg-white/10 border border-white/20 text-white text-xs font-medium px-3 py-1 rounded-full">
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
              開発中 — 宅建独学支援アプリ
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight mb-6">
            学びをもっと自由に。<br />
            人生をもっと豊かに。
          </h1>
          <div className="mt-8 space-y-1 text-blue-100 text-base md:text-lg leading-loose">
            <p>洗練された先端技術</p>
            <p>考え抜かれた学習教材</p>
            <p>学ぶことが楽しくなる仕組み</p>
            <p className="mt-4 text-white font-medium">この3つを通じて、学び続ける人を支援します。</p>
          </div>
          <div className="mt-12 flex flex-wrap gap-4">
            <Link
              href="/business"
              className="inline-flex items-center px-7 py-3.5 bg-white text-[#0d2545] text-sm font-semibold rounded hover:bg-blue-50 transition-colors"
            >
              事業内容を見る
            </Link>
            <Link
              href="/company"
              className="inline-flex items-center px-7 py-3.5 border border-white/30 text-white text-sm font-semibold rounded hover:bg-white/10 transition-colors"
            >
              会社について
            </Link>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="bg-white py-24 md:py-32">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-widest text-blue-700 mb-4">Mission</p>
            <h2 className="text-2xl md:text-3xl font-bold text-[#0d2545] mb-12 leading-tight">
              なぜ私たちは存在するのか
            </h2>
            <div className="space-y-8 text-gray-700 leading-loose text-base">
              <p>
                私たちは、「人生を変えたい」「もっと成長したい」と思いながらも、
                挑戦を諦めてしまう人を数多く見てきました。
              </p>
              <div className="border-l-4 border-[#0d2545] pl-6 py-2">
                <p className="text-xl md:text-2xl font-bold text-[#0d2545] leading-relaxed">
                  時間がない。<br />
                  お金がない。<br />
                  続けられない。
                </p>
              </div>
              <p className="text-lg font-semibold text-[#0d2545]">
                問題は意志の弱さではありません。<br />
                学び続けられる仕組みが存在しないことです。
              </p>
              <p>
                私たちはテクノロジーによってその課題を解決します。
                宅建・FP・行政書士・簿記など、キャリア形成に直結する資格の独学を支援し、
                学び続ける人が集まる環境を作ります。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Business */}
      <section className="bg-[#f5f7fa] py-24 md:py-32">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <div className="mb-14">
            <p className="text-xs font-semibold uppercase tracking-widest text-blue-700 mb-4">Business</p>
            <h2 className="text-2xl md:text-3xl font-bold text-[#0d2545]">事業紹介</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg p-8 border border-gray-200 flex flex-col">
              <p className="text-xs font-mono text-gray-400 mb-4">01</p>
              <h3 className="text-xl font-bold text-[#0d2545] mb-4 leading-snug">学習プラットフォーム事業</h3>
              <p className="text-sm text-gray-600 leading-loose mb-6">
                宅建・FP・行政書士・簿記など、キャリア形成に直結する資格の独学支援サービスを開発しています。
                継続・復習・進捗可視化の3つで、独学者の合格率向上を目指します。
              </p>
              <ul className="text-sm text-gray-600 space-y-2 mb-8">
                {["継続学習の仕組み化", "最適タイミングでの復習支援", "将来的にはオンライン予備校の実現へ"].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="text-blue-600 mt-0.5 shrink-0">—</span>
                    {item}
                  </li>
                ))}
              </ul>
              <div className="mt-auto">
                <Link href="/business#learning" className="inline-flex items-center text-sm font-medium text-blue-700 hover:text-blue-900 transition-colors">
                  詳細を見る &rarr;
                </Link>
              </div>
            </div>

            <div className="bg-white rounded-lg p-8 border border-gray-200 flex flex-col">
              <p className="text-xs font-mono text-gray-400 mb-4">02</p>
              <h3 className="text-xl font-bold text-[#0d2545] mb-4 leading-snug">ウェルスコンサルティング事業</h3>
              <p className="text-sm text-gray-600 leading-loose mb-6">
                資産家・地主・事業オーナーの意思決定を支援します。
                金融商品や不動産の販売を目的とせず、独立した立場から資産形成・不動産の調査・分析・比較を行います。
              </p>
              <ul className="text-sm text-gray-600 space-y-2 mb-8">
                {["市場調査・投資分析", "比較・シナリオ分析", "意思決定の振り返り支援"].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="text-blue-600 mt-0.5 shrink-0">—</span>
                    {item}
                  </li>
                ))}
              </ul>
              <div className="mt-auto">
                <Link href="/business#wealth" className="inline-flex items-center text-sm font-medium text-blue-700 hover:text-blue-900 transition-colors">
                  詳細を見る &rarr;
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 開発中のサービス */}
      <section className="bg-white py-24 md:py-32">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* テキスト */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-700 bg-blue-50 border border-blue-200 px-3 py-1 rounded-full">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
                  開発中
                </span>
                <p className="text-xs font-semibold uppercase tracking-widest text-blue-700">Service</p>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-[#0d2545] mb-4 leading-tight">
                宅建独学支援アプリ
              </h2>
              <p className="text-lg font-bold text-[#0d2545] mb-6 italic">
                「忘れた頃に、もう一度出題。」
              </p>
              <div className="space-y-2.5 mb-8">
                {[
                  "独学で始めても継続できない",
                  "一度学んでも忘れてしまう",
                  "自分の現在地が分からない",
                ].map((text) => (
                  <div key={text} className="flex items-start gap-2.5">
                    <span className="text-red-400 font-bold text-sm shrink-0 mt-0.5">✕</span>
                    <p className="text-sm text-gray-600">{text}</p>
                  </div>
                ))}
              </div>
              <p className="text-sm text-gray-600 leading-loose mb-8">
                科学的な間隔反復と学習継続支援の仕組みで、この3つの課題を解決します。
              </p>
              <Link
                href="/landing/takken"
                className="inline-flex items-center px-7 py-3.5 bg-[#0d2545] text-white text-sm font-semibold rounded hover:bg-[#142f5a] transition-colors"
              >
                詳しく見る &rarr;
              </Link>
            </div>

            {/* モックアップ */}
            <div className="flex items-start justify-center gap-4 md:gap-6 overflow-hidden">
              <HomeScreen />
              <div className="mt-12 hidden sm:block">
                <ProblemScreen />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 現在取り組んでいること */}
      <section className="bg-[#0d2545] text-white py-24 md:py-32">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-blue-300 mb-4">Now Building</p>
          <h2 className="text-2xl md:text-3xl font-bold mb-10 leading-tight">現在取り組んでいること</h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
            {/* アプリ概要 */}
            <div className="border border-white/20 rounded-lg p-8 bg-white/5">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-xs font-medium text-blue-300 border border-blue-400/40 px-3 py-1 rounded-full">開発中</span>
              </div>
              <h3 className="text-xl font-bold mb-3">宅地建物取引士試験 独学支援アプリ</h3>
              <p className="text-blue-100 text-sm leading-loose mb-5">
                「忘れた頃にもう一度出題する仕組み」と「学習継続を支援する体験設計」によって、
                独学での宅建合格率向上を目指しています。
              </p>
              <Link
                href="/services/takken"
                className="inline-flex items-center text-sm font-medium text-blue-300 hover:text-white transition-colors"
              >
                サービス詳細を見る &rarr;
              </Link>
            </div>

            {/* 数値・ゴール */}
            <div className="space-y-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-blue-300 mb-4">対応予定 4資格</p>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: "宅建士", note: "開発中" },
                    { label: "FP", note: "予定" },
                    { label: "行政書士", note: "予定" },
                    { label: "簿記", note: "予定" },
                  ].map(({ label, note }) => (
                    <div key={label} className="bg-white/10 rounded-lg px-4 py-3 flex items-center justify-between">
                      <span className="text-sm font-medium">{label}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${note === "開発中" ? "bg-blue-500/30 text-blue-200" : "bg-white/10 text-white/50"}`}>
                        {note}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-blue-300 mb-4">目標</p>
                <div className="space-y-2">
                  {[
                    { icon: "↑", label: "学習継続率向上", sub: "続けられる仕組みで離脱率を下げる" },
                    { icon: "↑", label: "独学合格率向上", sub: "効率的な復習で短期合格を支援" },
                    { icon: "↓", label: "資格学習コスト削減", sub: "予備校不要の独学支援" },
                  ].map(({ icon, label, sub }) => (
                    <div key={label} className="flex items-start gap-3 bg-white/5 rounded-lg px-4 py-3">
                      <span className="text-blue-300 font-bold text-lg shrink-0 leading-none mt-0.5">{icon}</span>
                      <div>
                        <p className="text-sm font-medium">{label}</p>
                        <p className="text-xs text-blue-200 mt-0.5">{sub}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 開発ロードマップ */}
      <section className="bg-[#f5f7fa] py-24 md:py-32">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <div className="mb-14">
            <p className="text-xs font-semibold uppercase tracking-widest text-blue-700 mb-4">Roadmap</p>
            <h2 className="text-2xl md:text-3xl font-bold text-[#0d2545]">開発ロードマップ</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                phase: "Phase 1",
                title: "宅建アプリ開発",
                status: "進行中",
                current: true,
                items: ["問題データベース構築", "間隔反復アルゴリズム実装", "学習継続UX設計"],
              },
              {
                phase: "Phase 2",
                title: "FP・簿記対応",
                status: "準備中",
                current: false,
                items: ["宅建実績をもとに展開", "FP試験対応コンテンツ", "簿記試験対応コンテンツ"],
              },
              {
                phase: "Phase 3",
                title: "プラットフォーム化",
                status: "構想中",
                current: false,
                items: ["教材・システム統合", "コミュニティ機能構築", "行政書士他へ展開"],
              },
            ].map(({ phase, title, status, current, items }) => (
              <div
                key={phase}
                className={`rounded-lg p-6 border ${
                  current ? "bg-white border-blue-200" : "bg-white border-gray-200"
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <p className="text-xs font-mono text-gray-400">{phase}</p>
                  <span
                    className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                      current ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {status}
                  </span>
                </div>
                <h3 className="text-base font-bold text-[#0d2545] mb-4">{title}</h3>
                <ul className="space-y-2">
                  {items.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-xs text-gray-600">
                      <span className={`shrink-0 mt-0.5 ${current ? "text-blue-500" : "text-gray-300"}`}>—</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Vision */}
      <section className="bg-white py-24 md:py-32 border-t border-gray-100">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <div className="mb-14">
            <p className="text-xs font-semibold uppercase tracking-widest text-blue-700 mb-4">Vision</p>
            <h2 className="text-2xl md:text-3xl font-bold text-[#0d2545]">私たちが目指す未来</h2>
          </div>
          <p className="text-base md:text-lg text-gray-700 leading-loose max-w-2xl mb-16">
            時間やお金など個人のリソースによって学ぶ機会を失う人をなくしたい。
            私たちは以下の3つを通じて、学び続ける人が集まる環境を作ります。
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { number: "01", title: "教材", body: "質が高く、独学者のペースに合わせた宅建・FP・行政書士・簿記など資格学習コンテンツの開発・提供" },
              { number: "02", title: "テクノロジー", body: "継続・復習・進捗可視化を実現する学習支援プラットフォーム" },
              { number: "03", title: "コミュニティ", body: "同じ志を持つ学習者が繋がり、互いに刺激しあえる場の創出" },
            ].map(({ number, title, body }) => (
              <div key={number} className="border-t-2 border-[#0d2545] pt-6">
                <p className="text-xs font-mono text-gray-400 mb-3">{number}</p>
                <h3 className="text-lg font-bold text-[#0d2545] mb-3">{title}</h3>
                <p className="text-sm text-gray-600 leading-loose">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
