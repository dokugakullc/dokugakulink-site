import type { Metadata } from "next";
import Link from "next/link";
import { HomeScreen, ProblemScreen, AnalysisScreen, ReviewScreen } from "@/components/AppMockup";
import AppStoreCarousel from "@/components/AppStoreCarousel";
import EmailForm from "@/components/EmailForm";
import LPTracker from "@/components/LPTracker";

// ─── 開発進捗数値（随時更新） ────────────────────────────────────────────────
// ※ registered は削除。固定値は信頼性を損なうため表示しない。
const STATS = {
  totalSlots: 100,
  problems: 305,
  features: 12,
  devProgress: 82,
};
// ─────────────────────────────────────────────────────────────────────────────

// ─── Hero ABテスト ──────────────────────────────────────────────────────────
// ここを "A" | "B" | "C" | "D" に変えるだけでHero文言が切り替わる
const HERO_VARIANT: "A" | "B" | "C" | "D" = "A";

const HERO_COPY = {
  A: {
    headline: (
      <>
        忘れた頃に、<br />
        <span className="text-blue-300">また出題。</span>
      </>
    ),
    sub: "仕事終わりの30分でも、独学合格を目指せる。宅建受験生専用の学習支援アプリ。",
  },
  B: {
    headline: (
      <>
        何を勉強すれば<br />
        <span className="text-blue-300">受かるか分かる。</span>
      </>
    ),
    sub: "仕事終わりの30分でも、独学合格を目指せる。宅建受験生専用の学習支援アプリ。",
  },
  C: {
    headline: (
      <>
        今年こそ<br />
        <span className="text-blue-300">受かる。</span>
      </>
    ),
    sub: "仕事終わりの30分でも、独学合格を目指せる。宅建受験生専用の学習支援アプリ。",
  },
  D: {
    headline: (
      <>
        苦手を<br />
        <span className="text-blue-300">自動分析。</span>
      </>
    ),
    sub: "仕事終わりの30分でも、独学合格を目指せる。宅建受験生専用の学習支援アプリ。",
  },
} as const;
// ─────────────────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: "宅建独学合格アプリ | β版先行登録 先着100名無料",
  description:
    "模試30〜35点で伸び悩む宅建受験生へ。あなたに足りないのは努力ではなく、復習の仕組みです。仕事終わりの30分でも独学合格を目指せる宅建学習アプリ。β版先着100名無料。",
  keywords: [
    "宅建", "宅建士", "宅建アプリ", "独学", "宅建勉強法",
    "宅建過去問", "宅建一問一答", "宅建合格", "宅建 独学 アプリ", "宅建 スマホ",
  ],
  openGraph: {
    title: "宅建独学合格アプリ | β版先行登録 先着100名無料",
    description:
      "模試30〜35点で伸び悩む宅建受験生へ。仕事終わりの30分でも独学合格を目指せる宅建学習アプリ。β版先着100名無料。",
    url: "https://www.dokugakulink.com/landing/takken",
    siteName: "dokugaku link",
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "宅建独学合格アプリ | β版先行登録 先着100名無料",
    description: "模試30〜35点で伸び悩む宅建受験生へ。β版先着100名無料。",
  },
};

const empathyItems = [
  { icon: "📚", text: "問題集を買ったけど、なかなか開けていない" },
  { icon: "😓", text: "一度覚えた内容を、数日後には忘れてしまう" },
  { icon: "⏳", text: "復習しようと思っても、いつも後回しになる" },
  { icon: "📊", text: "模試で35点の壁を超えられない" },
  { icon: "🤔", text: "合格まであと何点足りないか、正直分からない" },
  { icon: "😴", text: "仕事終わりに勉強しようとしても、続かない" },
];

const beforeAfterItems = [
  { before: "今日は何を勉強しよう…", after: "今日やるべき問題が自動で表示される" },
  { before: "復習できていない分野がある", after: "忘れる直前のタイミングで自動出題される" },
  { before: "受かるかどうか正直わからない", after: "合格可能性スコアがリアルタイムで見える" },
  { before: "どこが弱点か把握できていない", after: "分野別の正答率が自動でグラフ化される" },
];

const devFeatures = [
  { name: "問題データベース構築", done: true, beta: false },
  { name: "学習履歴管理", done: true, beta: false },
  { name: "復習タイミング自動計算", done: true, beta: false },
  { name: "分野別分析ダッシュボード", done: false, beta: true },
  { name: "合格予測スコア", done: false, beta: true },
  { name: "通知・リマインダー", done: false, beta: false },
];

const mockupFeatures = [
  {
    Screen: HomeScreen,
    title: "今日やることが、開いた瞬間にわかる",
    tag: "継続のカギ",
    reason:
      "毎日「今日の目標」と「復習タイミング到来の問題」が表示されます。開いた瞬間に始められるから、習慣になります。",
  },
  {
    Screen: ProblemScreen,
    title: "1問から学習できる",
    tag: "隙間時間の活用",
    reason:
      "通勤中でも、昼休みでも、1問から。「まとまった時間がないと勉強できない」という思い込みを壊します。",
  },
  {
    Screen: AnalysisScreen,
    title: "弱点が数字で浮かび上がる",
    tag: "効率的な学習",
    reason:
      "分野別の正答率が自動で可視化。「法令制限が55%」「あと7%で合格ライン」など、具体的な数字で現在地がわかります。",
  },
  {
    Screen: ReviewScreen,
    title: "忘れる前に、もう一度出題される",
    tag: "記憶の定着",
    reason:
      "忘却タイミングを迎えた問題が自動でリストアップ。「復習しなきゃと思いつつ...」が完全に解消されます。",
  },
];

const betaPerks = [
  { icon: "🚀", title: "正式版を優先利用", desc: "正式リリース時、最速でご案内します" },
  { icon: "💬", title: "要望を開発に反映", desc: "あなたのフィードバックが機能に直接なります" },
  { icon: "📬", title: "進捗を先行共有", desc: "非公開の開発状況をリアルタイムでお届け" },
  { icon: "🧪", title: "テスト先行参加", desc: "正式版前のテストに真っ先に参加できます" },
];

const faqItems = [
  {
    q: "本当に無料ですか？",
    a: "β版への参加は完全無料です。正式版リリース後の料金については、β版参加者の方に最優先でご案内します。課金が始まるのは「使ってよかった」と感じてもらえる状態になってからです。",
  },
  {
    q: "いつリリース予定ですか？",
    a: "2026年内のリリースを目標に開発中です。β版参加者の方には、開発進捗を定期的にご共有します。",
  },
  {
    q: "iPhone・Android両方で使えますか？",
    a: "はい。iOS（iPhone）・Android両OSに対応予定です。同時リリースを目指して開発しています。",
  },
  {
    q: "宅建以外の資格にも対応予定ですか？",
    a: "宅建士の次は、FP・簿記・行政書士への展開を計画しています。β版参加者のご要望を優先的に開発へ反映します。",
  },
  {
    q: "登録したら営業メールは届きますか？",
    a: "一切届きません。お送りするのは「β版招待」「リリース情報」「開発進捗レポート」の3種類のみです。登録後の営業・勧誘は行いません。",
  },
  {
    q: "登録情報は何に使いますか？",
    a: "メールアドレスはリリース連絡にのみ使用します。「学習の悩み」はアプリ開発の優先度判断に活用します。第三者への提供・販売は一切行いません。",
  },
];

const roadmapItems = [
  {
    period: "2026年 夏",
    label: "β版リリース",
    current: true,
    goal: false,
    desc: "先着100名でテスト運用開始",
  },
  {
    period: "2026年 秋",
    label: "正式リリース",
    current: false,
    goal: false,
    desc: "App Store / Google Play 正式公開",
  },
  {
    period: "2027年",
    label: "FP（ファイナンシャルプランナー）展開",
    current: false,
    goal: false,
    desc: "第2弾資格対応開始",
  },
  {
    period: "2027年〜",
    label: "簿記 / 行政書士展開",
    current: false,
    goal: false,
    desc: "資格ラインナップを順次拡大",
  },
  {
    period: "2028年〜",
    label: "学習コミュニティ",
    current: false,
    goal: true,
    desc: "資格を起点に人生を変える人たちのためのプラットフォーム",
  },
];

export default function TakkenLandingPage() {
  const hero = HERO_COPY[HERO_VARIANT];

  return (
    <div>
      <LPTracker heroVariant={HERO_VARIANT} />

      {/* ━━━ 1. Hero ━━━ */}
      <section id="hero" className="bg-[#0d2545] text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-800/20 via-transparent to-transparent pointer-events-none" />
        <div className="mx-auto max-w-5xl px-6 lg:px-8 py-10 md:py-24 relative">
          {/* 対象者明示 — 広告流入ユーザーが3秒以内に宅建アプリだと分かるように */}
          <p className="text-blue-400 text-xs font-black tracking-[0.18em] uppercase mb-4">
            宅建独学者のための学習支援アプリ
          </p>

          <div className="flex flex-wrap items-center gap-3 mb-8">
            <span className="inline-flex items-center gap-1.5 bg-white/10 border border-white/20 text-white text-xs font-medium px-3 py-1.5 rounded-full">
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
              β版先行募集中 · 先着{STATS.totalSlots}名限定
            </span>
          </div>

          <p className="text-blue-300 text-sm font-semibold mb-5 tracking-wide">
            模試で30〜35点を行ったり来たりしている人へ
          </p>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.2] tracking-tight mb-6">
            {hero.headline}
          </h1>

          <p className="text-base md:text-lg text-blue-100 leading-loose mb-10 max-w-xl">
            {hero.sub}
          </p>

          {/* ─ Hero直下 簡易登録フォーム ─ */}
          <div className="max-w-md">
            <EmailForm source="takken_lp_hero" />
          </div>

          <div className="mt-8">
            <a
              href="#features"
              className="inline-flex items-center gap-1.5 text-xs text-white/40 hover:text-white/70 transition-colors"
            >
              詳細を見る
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <path d="M12 5v14M5 12l7 7 7-7" />
              </svg>
            </a>
          </div>
        </div>
      </section>

      {/* ━━━ 2. Stats bar ━━━ */}
      <section className="bg-[#0a1e3d] border-t border-white/5 py-10">
        <div className="mx-auto max-w-5xl px-6 lg:px-8">
          <div className="grid grid-cols-3 divide-x divide-white/10 text-white text-center">
            <div className="px-4 py-2">
              <p className="text-4xl md:text-5xl font-black tabular-nums">{STATS.problems}<span className="text-2xl font-bold">問</span></p>
              <p className="text-xs text-blue-300 mt-2 whitespace-nowrap">収録予定</p>
            </div>
            <div className="px-4 py-2">
              <p className="text-4xl md:text-5xl font-black">4<span className="text-2xl font-bold">科目</span></p>
              <p className="text-xs text-blue-300 mt-2 whitespace-nowrap">全範囲対応</p>
            </div>
            <div className="px-4 py-2">
              <p className="text-4xl md:text-5xl font-black tabular-nums">
                {STATS.totalSlots}<span className="text-2xl font-bold">名</span>
              </p>
              <p className="text-xs text-blue-300 mt-2">β版参加費無料</p>
            </div>
          </div>
        </div>
      </section>

      {/* ━━━ 3. 共感セクション ━━━ */}
      <section className="py-20 md:py-28 bg-[#f5f7fa]">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-2xl md:text-3xl font-bold text-[#0d2545]">
              こんな経験、ありませんか？
            </h2>
            <p className="text-sm text-gray-500 mt-4">
              1つでも当てはまるなら、このアプリはあなたのために作られました。
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {empathyItems.map(({ icon, text }) => (
              <div
                key={text}
                className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm flex items-start gap-4"
              >
                <span className="text-2xl shrink-0 mt-0.5">{icon}</span>
                <p className="text-sm text-gray-700 leading-relaxed font-medium">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━ 4. 原因セクション ━━━ */}
      <section className="py-20 md:py-28 bg-[#0d2545] text-white">
        <div className="mx-auto max-w-3xl px-6 lg:px-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-blue-300 mb-6">Why</p>
          <h2 className="text-2xl md:text-4xl font-bold mb-10 leading-tight">
            なぜ宅建受験生は落ちるのか
          </h2>

          <div className="bg-white/5 border border-white/10 rounded-2xl px-8 py-10 text-left space-y-6 text-base md:text-lg leading-loose">
            <p className="text-blue-100">
              能力不足ではありません。
            </p>
            <p className="text-white/70 text-sm">多くの人は</p>
            <ul className="space-y-3">
              {[
                "復習設計がない",
                "現在地が分からない",
                "何をやるべきか分からない",
              ].map((item) => (
                <li key={item} className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
                  <span className="text-white font-semibold">{item}</span>
                </li>
              ))}
            </ul>
            <p className="text-white/70 text-sm">という問題を抱えています。</p>
            <div className="border-t border-white/10 pt-6">
              <p className="text-white/70 text-sm mb-2">その結果</p>
              <p className="text-xl font-bold text-white leading-relaxed">
                勉強しているのに<br />点数が伸びません。
              </p>
            </div>
          </div>

          <div className="mt-10">
            <a
              href="#beta"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-[#0d2545] text-base font-bold rounded-xl hover:bg-blue-50 transition-colors"
            >
              仕組みで解決する →
            </a>
          </div>
        </div>
      </section>

      {/* ━━━ 5. 実績 + 開発進捗 ━━━ */}
      <section className="py-20 md:py-28 bg-[#f5f7fa]">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-xs font-semibold uppercase tracking-widest text-blue-700 mb-4">Progress</p>
            <h2 className="text-2xl md:text-3xl font-bold text-[#0d2545]">現在の開発状況</h2>
            <p className="text-sm text-gray-500 mt-4">「本当に出るの？」という疑問にお答えします。</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            {[
              { value: `${STATS.problems}問`, label: "収録予定問題数", sub: "過去問ベース" },
              { value: "4分野", label: "対象範囲", sub: "宅建全範囲カバー" },
              { value: `${STATS.features}機能`, label: "開発予定機能", sub: "随時追加" },
              { value: `${STATS.devProgress}%`, label: "全体進捗", sub: "開発中" },
            ].map(({ value, label, sub }) => (
              <div key={label} className="bg-white rounded-2xl p-6 text-center shadow-sm border border-gray-100">
                <p className="text-3xl md:text-4xl font-black text-[#0d2545] mb-1">{value}</p>
                <p className="text-xs font-bold text-gray-700 mb-1">{label}</p>
                <p className="text-[10px] text-gray-400">{sub}</p>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 mb-6">
            <div className="flex items-center justify-between mb-4">
              <p className="font-bold text-[#0d2545]">開発進捗</p>
              <p className="text-2xl font-black text-[#0d2545]">{STATS.devProgress}%</p>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-4 mb-2">
              <div
                className="bg-blue-600 rounded-full h-full"
                style={{ width: `${STATS.devProgress}%` }}
              />
            </div>
            <p className="text-xs text-gray-400 text-right mt-2">
              {STATS.totalSlots}名のβ版参加者を迎えてリリース予定
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <p className="font-bold text-[#0d2545] mb-6">機能開発状況</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {devFeatures.map(({ name, done, beta }) => (
                <div
                  key={name}
                  className={`flex items-center gap-3 p-4 rounded-xl ${done ? "bg-green-50" : beta ? "bg-blue-50" : "bg-gray-50"}`}
                >
                  <span className="text-base shrink-0">{done ? "✅" : beta ? "✨" : "🔄"}</span>
                  <p className={`text-sm font-medium flex-1 ${done ? "text-gray-700" : beta ? "text-blue-700" : "text-gray-400"}`}>
                    {name}
                  </p>
                  <span
                    className={`text-xs font-bold px-2 py-0.5 rounded-full shrink-0 ${
                      done
                        ? "bg-green-100 text-green-700"
                        : beta
                        ? "bg-blue-100 text-blue-700"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {done ? "完成" : beta ? "β版で体験予定" : "開発中"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ━━━ 6. App Storeカルーセル ━━━ */}
      <section id="features" className="py-20 md:py-28 bg-white overflow-hidden">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold uppercase tracking-widest text-blue-700 mb-4">Features</p>
            <h2 className="text-2xl md:text-3xl font-bold text-[#0d2545]">
              これがあれば、勉強が変わる
            </h2>
            <p className="text-sm text-gray-500 mt-4">左右にスワイプして確認できます</p>
          </div>
        </div>
        <AppStoreCarousel />
      </section>

      {/* ━━━ 7. Before / After ━━━ */}
      <section className="py-20 md:py-28 bg-[#0d2545] text-white">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-xs font-semibold uppercase tracking-widest text-blue-300 mb-4">Before / After</p>
            <h2 className="text-2xl md:text-3xl font-bold">アプリを使うと、何が変わるか</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {beforeAfterItems.map(({ before, after }, i) => (
              <div key={i} className="grid grid-cols-2 gap-3">
                <div className="bg-white/5 border border-white/10 rounded-xl p-5">
                  <p className="text-[10px] font-bold text-red-400 mb-3 uppercase tracking-wider">Before</p>
                  <p className="text-sm text-blue-100 leading-relaxed">{before}</p>
                </div>
                <div className="bg-white/15 border border-white/30 rounded-xl p-5">
                  <p className="text-[10px] font-bold text-green-400 mb-3 uppercase tracking-wider">After</p>
                  <p className="text-sm text-white font-semibold leading-relaxed">{after}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━ 8. モックアップ + 設計の意図 ━━━ */}
      <section className="py-20 md:py-28 bg-[#f5f7fa]">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-xs font-semibold uppercase tracking-widest text-blue-700 mb-4">Screens</p>
            <h2 className="text-2xl md:text-3xl font-bold text-[#0d2545]">
              すべての画面に、合格のための設計があります
            </h2>
          </div>
          <div className="space-y-16">
            {mockupFeatures.map(({ Screen, title, tag, reason }, i) => (
              <div
                key={title}
                className={`flex flex-col ${
                  i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                } items-center gap-10 md:gap-16`}
              >
                <div className="shrink-0">
                  <Screen />
                </div>
                <div>
                  <span className="inline-block bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full mb-4">
                    {tag}
                  </span>
                  <h3 className="text-xl md:text-2xl font-bold text-[#0d2545] mb-4">{title}</h3>
                  <p className="text-sm text-gray-600 leading-loose max-w-md">{reason}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━ 9. なぜ無料なのか ━━━ */}
      <section className="py-20 md:py-28 bg-white">
        <div className="mx-auto max-w-3xl px-6 lg:px-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-blue-700 mb-4">Why Free</p>
          <h2 className="text-2xl md:text-3xl font-bold text-[#0d2545] mb-10">なぜ、無料なのか？</h2>
          <div className="bg-[#f5f7fa] rounded-2xl p-8 md:p-12 text-left space-y-5 text-sm md:text-base text-gray-700 leading-loose">
            <p>私たちがβ版を無料で提供する理由はシンプルです。</p>
            <p>
              <span className="font-bold text-[#0d2545]">まず、合格する人を増やしたい。</span><br />
              そのために、実際に使ってもらいながら、本当に役立つプロダクトを作り上げていく必要があります。
            </p>
            <p>
              β版参加者からのフィードバックは、開発に直接反映されます。<br />
              あなたの声が、次の宅建受験生を助けることになります。
            </p>
            <p className="font-bold text-[#0d2545]">
              課金が始まるのは、「使ってよかった」と思える状態になってからです。
            </p>
          </div>
        </div>
      </section>

      {/* ━━━ 10. 創業ストーリー ━━━ */}
      <section className="py-20 md:py-28 bg-white">
        <div className="mx-auto max-w-3xl px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-xs font-semibold uppercase tracking-widest text-blue-700 mb-4">Story</p>
            <h2 className="text-2xl md:text-3xl font-bold text-[#0d2545]">なぜ、このアプリを作るのか</h2>
          </div>

          {/* 冒頭メッセージ */}
          <div className="mb-10">
            <p className="text-xl md:text-2xl font-bold text-[#0d2545] leading-relaxed text-center">
              教育は人生を変える力を持っています。
            </p>
          </div>

          {/* 現実の障壁 */}
          <div className="bg-[#f5f7fa] rounded-2xl p-8 mb-8">
            <p className="text-sm text-gray-500 mb-5">しかし現実には、</p>
            <ul className="space-y-4 mb-6">
              {[
                { icon: "⏱", label: "時間がない" },
                { icon: "💴", label: "お金がない" },
                { icon: "🔄", label: "続かない" },
              ].map(({ icon, label }) => (
                <li key={label} className="flex items-center gap-4">
                  <span className="text-2xl">{icon}</span>
                  <span className="text-lg font-bold text-[#0d2545]">{label}</span>
                </li>
              ))}
            </ul>
            <p className="text-sm text-gray-600 leading-loose">
              という理由で学ぶ機会を失う人がいます。<br />
              私はそんな人をたくさん見てきました。
            </p>
          </div>

          {/* ミッション */}
          <div className="bg-[#0d2545] text-white rounded-2xl p-8 mb-8">
            <p className="text-sm text-blue-300 mb-4">だからこそ、</p>
            <p className="text-lg md:text-xl font-bold leading-relaxed mb-6">
              時間やお金の制約によって<br />
              人生を豊かにする機会を失う人をなくしたい。
            </p>
            <p className="text-blue-200 text-sm leading-loose">
              その想いから<br />
              <span className="text-white font-bold">dokugaku link</span>を設立しました。
            </p>
          </div>

          {/* 現在と未来 */}
          <div className="space-y-6 text-sm md:text-base text-gray-700 leading-loose">
            <p>
              最初の挑戦が<span className="font-bold text-[#0d2545]">宅建</span>です。
            </p>

            <div className="bg-[#f5f7fa] rounded-xl p-6">
              <p className="text-sm text-gray-500 mb-4">将来的には</p>
              <div className="flex flex-wrap gap-3 mb-4">
                {["FP", "簿記", "行政書士"].map((q) => (
                  <span
                    key={q}
                    className="inline-block bg-blue-100 text-blue-700 text-sm font-bold px-4 py-2 rounded-full"
                  >
                    {q}
                  </span>
                ))}
              </div>
              <p className="text-sm text-gray-600 leading-loose">
                などへ広げ、<br />
                <span className="font-bold text-[#0d2545]">学び続ける人が集まるプラットフォーム</span>を作ります。
              </p>
            </div>
          </div>

          <p className="text-right text-xs text-gray-400 mt-10">dokugaku link合同会社 代表</p>
        </div>
      </section>

      {/* ━━━ 12. β版募集（CTA #3）━━━ */}
      <section id="beta" className="py-20 md:py-28 bg-[#0d2545] text-white">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-12">
              <span className="inline-flex items-center gap-1.5 bg-white/10 border border-white/20 text-white text-xs font-medium px-3 py-1.5 rounded-full mb-6">
                <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                β版先行募集中
              </span>
              <h2 className="text-2xl md:text-3xl font-bold mb-4">β版に無料で参加する</h2>
              <p className="text-blue-100 leading-loose">
                先着{STATS.totalSlots}名限定。正式版リリース前に、アプリを体験できます。
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-10">
              {betaPerks.map(({ icon, title, desc }) => (
                <div key={title} className="bg-white/10 border border-white/20 rounded-xl p-5">
                  <div className="text-2xl mb-3">{icon}</div>
                  <p className="text-sm font-bold mb-1">{title}</p>
                  <p className="text-xs text-blue-200 leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>

            <div className="bg-white/5 border border-white/20 rounded-2xl p-8">
              <div className="grid grid-cols-2 divide-x divide-white/10 text-center mb-6 pb-6 border-b border-white/10">
                <div className="px-3">
                  <p className="text-xs text-blue-300 mb-1">募集枠</p>
                  <p className="text-3xl font-black tabular-nums">
                    {STATS.totalSlots}<span className="text-sm font-normal text-blue-300 ml-0.5">名限定</span>
                  </p>
                </div>
                <div className="px-3">
                  <p className="text-xs text-blue-300 mb-1">参加費</p>
                  <p className="text-3xl font-black">無料</p>
                </div>
              </div>

              <EmailForm />
            </div>
          </div>
        </div>
      </section>

      {/* ━━━ 13. リリースロードマップ ━━━ */}
      <section className="py-20 md:py-28 bg-[#f5f7fa]">
        <div className="mx-auto max-w-5xl px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-xs font-semibold uppercase tracking-widest text-blue-700 mb-4">Roadmap</p>
            <h2 className="text-2xl md:text-3xl font-bold text-[#0d2545]">リリースまでのロードマップ</h2>
            <p className="text-sm text-gray-500 mt-4">
              目指しているのは、学び続ける人のコミュニティです
            </p>
          </div>
          <div className="max-w-xl mx-auto">
            {roadmapItems.map(({ period, label, current, goal, desc }, i) => (
              <div key={label} className="flex gap-6">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-5 h-5 rounded-full border-2 shrink-0 mt-0.5 ${
                      goal
                        ? "bg-[#0d2545] border-[#0d2545]"
                        : current
                        ? "bg-blue-600 border-blue-600"
                        : "bg-white border-gray-300"
                    }`}
                  />
                  {i < roadmapItems.length - 1 && (
                    <div className="w-px flex-1 bg-gray-200 my-1" style={{ minHeight: "48px" }} />
                  )}
                </div>
                <div className="pb-8">
                  <p className="text-xs text-blue-600 font-bold mb-1">{period}</p>
                  <div className="flex items-center gap-3 mb-1">
                    <p
                      className={`text-sm font-bold ${
                        current || goal ? "text-[#0d2545]" : "text-gray-400"
                      }`}
                    >
                      {label}
                    </p>
                    {current && (
                      <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                        進行中
                      </span>
                    )}
                    {goal && (
                      <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-[#0d2545]/10 text-[#0d2545]">
                        最終目標
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━ 14. FAQ ━━━ */}
      <section className="py-20 md:py-28 bg-white">
        <div className="mx-auto max-w-3xl px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-2xl md:text-3xl font-bold text-[#0d2545]">よくある質問</h2>
          </div>
          <div className="divide-y divide-gray-100">
            {faqItems.map(({ q, a }) => (
              <div key={q} className="py-6">
                <p className="text-sm font-bold text-[#0d2545] mb-3">Q. {q}</p>
                <p className="text-sm text-gray-600 leading-loose pl-4 border-l-2 border-blue-200">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━ FAQ後CTA ━━━ */}
      <section className="py-16 md:py-20 bg-[#f5f7fa]">
        <div className="mx-auto max-w-xl px-6 lg:px-8 text-center">
          <p className="text-sm text-gray-500 mb-4">まだ迷っていますか？</p>
          <h2 className="text-xl md:text-2xl font-bold text-[#0d2545] mb-6">
            登録は30秒、参加費は無料です。
          </h2>
          <a
            href="#beta"
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#0d2545] text-white text-base font-bold rounded-xl hover:bg-[#142f5a] transition-colors"
          >
            無料でβ版に参加する →
          </a>
          <p className="text-xs text-gray-400 mt-4">クレジットカード不要 · いつでも退会可</p>
        </div>
      </section>

      {/* ━━━ Footer link bar ━━━ */}
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
            <Link href="/legal/tokushoho" className="hover:text-white transition-colors">特定商取引法</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
