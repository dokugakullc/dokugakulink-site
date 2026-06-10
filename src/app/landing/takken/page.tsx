import type { Metadata } from "next";
import Link from "next/link";
import { HomeScreen, ProblemScreen, AnalysisScreen, ReviewScreen } from "@/components/AppMockup";
import EmailForm from "@/components/EmailForm";

export const metadata: Metadata = {
  title: "独学で宅建合格を目指すあなたへ | dokugaku link",
  description:
    "勉強しているのに受からない。その原因は能力でも努力でもなく、仕組みの欠如です。あなた専用の学習スケジュールで、合格まで導く宅建アプリ。β版先行登録受付中。",
  keywords: ["宅建", "宅建士", "独学", "合格", "学習支援", "宅建アプリ", "間隔反復", "合格予測"],
};

const empathyItems = [
  { icon: "📚", text: "問題集を買っただけで、なかなか開けていない" },
  { icon: "😓", text: "一度覚えた内容を、数日後には忘れてしまう" },
  { icon: "⏳", text: "復習しようと思っても、いつも後回しになる" },
  { icon: "📊", text: "模試で35点の壁を越えられない" },
  { icon: "🤔", text: "合格まであと何点足りないか、正直分からない" },
  { icon: "😴", text: "仕事終わりに勉強しようとしても、続かない" },
];

const reasons = [
  {
    num: "01",
    title: "継続できない",
    body: "意志の力だけで勉強を続けるのには限界があります。習慣化の仕組みがなければ、モチベーションが下がった瞬間に止まります。",
    stat: "独学者の約70%が3ヶ月以内に挫折すると言われています",
  },
  {
    num: "02",
    title: "忘れる",
    body: "学んでも復習しなければ忘れます。しかし「いつ・何を復習するか」を自分で管理し続けるのは、現実的ではありません。",
    stat: "1週間後の記憶定着率は適切な復習なしで20%以下",
  },
  {
    num: "03",
    title: "現在地が分からない",
    body: "「なんとなく勉強している」状態では、合格に必要な得点が見えません。弱点が分からなければ、的外れな学習が続きます。",
    stat: "合格ラインを常に意識しながら学習している受験生は少数",
  },
];

const beforeAfterItems = [
  {
    before: "今日は何を勉強しよう…",
    after: "今日やるべき問題が自動で表示される",
  },
  {
    before: "復習できていない分野がある",
    after: "忘れる直前のタイミングで自動出題される",
  },
  {
    before: "受かるかどうか正直わからない",
    after: "合格可能性スコアがリアルタイムで見える",
  },
  {
    before: "どこが弱点か把握できていない",
    after: "分野別の正答率が自動でグラフ化される",
  },
];

const mockupFeatures = [
  {
    Screen: HomeScreen,
    title: "今日やることが、開いた瞬間にわかる",
    tag: "継続のカギ",
    reason:
      "「今日は何を勉強しようか」と迷う時間が、合格を遠ざけます。ホーム画面を開いた瞬間に、今日の学習目標・優先問題・復習タイミングが表示されます。迷いなく始められるから、習慣になります。",
  },
  {
    Screen: ProblemScreen,
    title: "1問からでも学習できる",
    tag: "隙間時間の活用",
    reason:
      "「30問こなさないと意味がない」という思い込みが挫折を生みます。このアプリは1問から始められます。移動中・休憩中・寝る前の3分が積み重なって、合格を作ります。",
  },
  {
    Screen: AnalysisScreen,
    title: "弱点が、自動で浮かび上がる",
    tag: "効率的な学習",
    reason:
      "「権利関係が苦手」と感じていても、実は「借地借家法だけ」が弱点というケースがほとんどです。分野別・単元別の正答率を自動分析し、今集中すべき場所を正確に教えます。",
  },
  {
    Screen: ReviewScreen,
    title: "忘れる前に、もう一度出題される",
    tag: "記憶の定着",
    reason:
      "人間は学んだ翌日に約70%を忘れます。しかしベストなタイミングで復習すれば、記憶は長期定着します。このリストが、あなたの記憶を守ります。",
  },
];

const faqItems = [
  {
    q: "本当に無料ですか？",
    a: "β版への参加は完全無料です。正式版のリリース後の料金については、β版参加者の方に最優先でご案内します。",
  },
  {
    q: "リリース時期はいつですか？",
    a: "2026年内のリリースを目標に開発中です。β版参加者の方には、開発進捗を定期的にご共有します。",
  },
  {
    q: "iPhoneで使えますか？",
    a: "はい、iOS（iPhone）に対応予定です。",
  },
  {
    q: "Androidでも使えますか？",
    a: "はい、Androidにも対応予定です。両OS同時リリースを目指して開発しています。",
  },
  {
    q: "他の資格にも対応しますか？",
    a: "宅建士の次は、FP・簿記・行政書士への展開を計画しています。β版参加者のご要望を優先的に開発へ反映します。",
  },
  {
    q: "登録後に何か送られてきますか？",
    a: "スパムは一切送りません。お送りするのは、リリース情報・β版招待・開発進捗の3種類のみです。",
  },
];

const roadmapItems = [
  {
    label: "宅建士",
    status: "開発中",
    current: true,
    goal: false,
    desc: "毎年20万人以上が受験する国家資格。第一弾として開発中。",
  },
  {
    label: "FP（ファイナンシャルプランナー）",
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
    label: "学び続ける人のコミュニティ",
    status: "最終目標",
    current: false,
    goal: true,
    desc: "資格を起点に、人生を変えていく仲間が集まる場所。教材・システム・人のつながりを統合する学習プラットフォーム。",
  },
];

export default function TakkenLandingPage() {
  return (
    <div>
      {/* ─── Hero ─── */}
      <section className="bg-[#0d2545] text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-800/30 via-transparent to-transparent pointer-events-none" />
        <div className="mx-auto max-w-5xl px-6 lg:px-8 py-24 md:py-36 relative">
          <div className="max-w-3xl">
            <div className="flex flex-wrap items-center gap-3 mb-10">
              <span className="inline-flex items-center gap-1.5 bg-white/10 border border-white/20 text-white text-xs font-medium px-3 py-1.5 rounded-full">
                <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                β版先行募集中
              </span>
              <span className="text-xs text-blue-300 font-medium">先着100名限定・参加費無料</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.2] tracking-tight mb-8">
              宅建に落ちる人の<br />
              共通点は、<br />
              <span className="text-blue-300">勉強不足では<br className="sm:hidden" />ありません。</span>
            </h1>

            <p className="text-xl md:text-2xl text-blue-100 font-medium mb-6 leading-relaxed">
              「何を、いつ復習するか」が<br className="sm:hidden" />分からないだけです。
            </p>

            <p className="text-sm md:text-base text-blue-200 leading-loose mb-12 max-w-2xl">
              あなた専用の学習スケジュールが、今日やるべきことを自動で示します。<br />
              独学でも、合格できる仕組みをアプリで実現しました。
            </p>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
              <a
                href="#beta"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-[#0d2545] text-base font-bold rounded-xl hover:bg-blue-50 transition-colors shadow-xl"
              >
                β版に無料で参加する
                <span className="text-lg">→</span>
              </a>
              <p className="text-xs text-white/40">スパムなし・いつでも退会可能</p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 共感セクション ─── */}
      <section className="py-20 md:py-28 bg-[#f5f7fa]">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-2xl md:text-3xl font-bold text-[#0d2545]">
              こんな経験、ありませんか？
            </h2>
            <p className="text-sm text-gray-500 mt-4 max-w-md mx-auto leading-loose">
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

      {/* ─── 問題提起セクション ─── */}
      <section className="py-20 md:py-28 bg-white">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-xs font-semibold uppercase tracking-widest text-red-500 mb-4">Why</p>
            <h2 className="text-2xl md:text-3xl font-bold text-[#0d2545] mb-4">
              宅建受験生の多くが落ちる理由
            </h2>
            <p className="text-base text-gray-600 max-w-xl mx-auto leading-loose">
              能力の問題ではありません。<br />
              <span className="font-bold text-[#0d2545]">仕組みの問題です。</span>
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {reasons.map(({ num, title, body, stat }) => (
              <div key={num} className="bg-[#f5f7fa] rounded-2xl p-8 border-l-4 border-[#0d2545]">
                <p className="text-6xl font-black text-[#0d2545]/8 mb-4 font-mono leading-none">{num}</p>
                <h3 className="text-xl font-bold text-[#0d2545] mb-4">{title}</h3>
                <p className="text-sm text-gray-600 leading-loose mb-6">{body}</p>
                <div className="bg-white rounded-lg px-4 py-3 border border-red-100">
                  <p className="text-xs text-red-500 font-semibold leading-relaxed">{stat}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Before / After ─── */}
      <section className="py-20 md:py-28 bg-[#0d2545] text-white">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-xs font-semibold uppercase tracking-widest text-blue-300 mb-4">Before / After</p>
            <h2 className="text-2xl md:text-3xl font-bold">
              アプリを使うと、何が変わるか
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
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

      {/* ─── モックアップ + 解説 ─── */}
      <section className="py-20 md:py-28 bg-[#f5f7fa]">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-xs font-semibold uppercase tracking-widest text-blue-700 mb-4">Features</p>
            <h2 className="text-2xl md:text-3xl font-bold text-[#0d2545]">
              すべての機能に、理由があります
            </h2>
            <p className="text-sm text-gray-500 mt-4 max-w-md mx-auto">
              「かっこいいから」ではなく、「合格に必要だから」設計しました。
            </p>
          </div>

          <div className="space-y-20 md:space-y-28">
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
                  <h3 className="text-xl md:text-2xl font-bold text-[#0d2545] mb-5">{title}</h3>
                  <p className="text-sm text-gray-600 leading-loose max-w-md">{reason}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 創業ストーリー ─── */}
      <section className="py-20 md:py-28 bg-white">
        <div className="mx-auto max-w-3xl px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold uppercase tracking-widest text-blue-700 mb-4">Story</p>
            <h2 className="text-2xl md:text-3xl font-bold text-[#0d2545]">
              なぜ、このアプリを作るのか
            </h2>
          </div>
          <div className="space-y-6 text-sm md:text-base text-gray-700 leading-loose">
            <p>
              「人生を変えたい」と思いながら、一歩を踏み出せない人をたくさん見てきました。
            </p>
            <p>
              時間がない。お金がない。どこから始めればいいか分からない。<br />
              そうやって、夢を「いつか」に後回しにしてしまう。
            </p>
            <p>
              でも、本当の問題は意志の弱さでも、環境でもないと私は思っています。<br />
              <span className="font-bold text-[#0d2545]">適切な仕組みがないだけです。</span>
            </p>
            <p>
              教育は、人生を豊かにするインフラです。<br />
              良質な学習の機会は、誰にでも平等に届くべきだと信じています。
            </p>
            <p>
              だからこそ、独学でも合格できる仕組みを作りたいと考えました。<br />
              その第一歩が、この宅建アプリです。
            </p>
          </div>
          <p className="text-right text-xs text-gray-400 mt-10">dokugaku link合同会社 代表</p>
        </div>
      </section>

      {/* ─── 将来構想 ─── */}
      <section className="py-20 md:py-28 bg-[#f5f7fa]">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-xs font-semibold uppercase tracking-widest text-blue-700 mb-4">Vision</p>
            <h2 className="text-2xl md:text-3xl font-bold text-[#0d2545]">
              目指しているのは、アプリではなく<br />
              学び続ける人のコミュニティ
            </h2>
            <p className="text-sm text-gray-600 mt-6 max-w-xl mx-auto leading-loose">
              宅建士を皮切りに、FP・簿記・行政書士へと対応資格を拡大します。<br />
              最終的には、資格を起点に人生を変えていく人たちが集まる場所を作ります。
            </p>
          </div>
          <div className="max-w-xl mx-auto">
            {roadmapItems.map(({ label, status, current, goal, desc }, i) => (
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
                  <div className="flex items-center gap-3 mb-1">
                    <p
                      className={`text-sm font-bold ${
                        current || goal ? "text-[#0d2545]" : "text-gray-400"
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
                  <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── β版募集セクション ─── */}
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
                先着100名限定で、正式版リリース前にアプリを体験できます。
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
              {[
                { icon: "🎯", title: "優先利用権", desc: "正式版を最速でご案内します" },
                { icon: "💬", title: "要望を反映", desc: "改善要望を開発へ直接フィードバック" },
                { icon: "📬", title: "進捗を先行共有", desc: "開発状況をリアルタイムでお届け" },
              ].map(({ icon, title, desc }) => (
                <div
                  key={title}
                  className="bg-white/10 border border-white/20 rounded-xl p-5 text-center"
                >
                  <div className="text-2xl mb-2">{icon}</div>
                  <p className="text-sm font-bold mb-1">{title}</p>
                  <p className="text-xs text-blue-200 leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>

            <div className="bg-white/5 border border-white/20 rounded-2xl p-8">
              <div className="flex items-center justify-between mb-8 pb-6 border-b border-white/10">
                <div>
                  <p className="text-xs text-blue-300 mb-1">募集人数</p>
                  <p className="text-3xl font-black">
                    100
                    <span className="text-base font-normal text-blue-300 ml-1">名限定</span>
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-blue-300 mb-1">参加費</p>
                  <p className="text-3xl font-black">無料</p>
                </div>
              </div>
              <EmailForm />
            </div>
          </div>
        </div>
      </section>

      {/* ─── FAQ ─── */}
      <section className="py-20 md:py-28 bg-white">
        <div className="mx-auto max-w-3xl px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-2xl md:text-3xl font-bold text-[#0d2545]">よくある質問</h2>
          </div>
          <div className="divide-y divide-gray-100">
            {faqItems.map(({ q, a }) => (
              <div key={q} className="py-6">
                <p className="text-sm font-bold text-[#0d2545] mb-3">Q. {q}</p>
                <p className="text-sm text-gray-600 leading-loose pl-4 border-l-2 border-blue-200">
                  {a}
                </p>
              </div>
            ))}
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
