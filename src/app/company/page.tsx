import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "会社概要",
  description:
    "dokugaku link合同会社の会社概要。ミッション・ビジョン・バリュー・創業ストーリー・ロードマップ・会社情報をご紹介します。",
  alternates: {
    canonical: "/company",
  },
};

const milestones = [
  { year: "2025", label: "宅建アプリ開発開始", current: true, goal: false },
  { year: "2026", label: "宅建学習サービス提供開始", current: false, goal: false },
  { year: "2027", label: "FP・簿記へ展開", current: false, goal: false },
  { year: "2028", label: "行政書士へ展開", current: false, goal: false },
  { year: "2030", label: "オンライン学習プラットフォーム完成", current: false, goal: true },
];

const features = [
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" />
      </svg>
    ),
    title: "金融機関での実務経験",
    body: "融資・資産運用業務で培った定量分析・リスク評価の能力を意思決定支援に活かします。",
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
    title: "不動産業界での実務経験",
    body: "不動産投資・運用の現場での経験をもとに、市場調査から出口戦略まで幅広く支援します。",
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" />
      </svg>
    ),
    title: "教育サービス開発経験",
    body: "テクノロジーを活用した学習支援プロダクトの企画・設計・開発を自社で手がけます。",
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
    title: "販売を目的としない独立した立場",
    body: "金融商品・不動産の販売を行わず、利益相反のない独立した立場での意思決定支援を行います。",
  },
];

const companyInfo = [
  { label: "会社名", value: "dokugaku link合同会社" },
  { label: "設立", value: "2025年10月27日（令和7年10月27日）" },
  { label: "法人番号", value: "2120003031128" },
  { label: "所在地", value: "〒530-0001\n大阪市北区梅田1-1-3\n大阪駅前第3ビル29階1-1-1号室" },
  { label: "事業内容", value: "ウェルスコンサルティング事業\n資格取得支援事業" },
  { label: "メール", value: "info@dokugakulink.com" },
  { label: "電話番号", value: "06-7652-1304" },
  { label: "受付時間", value: "平日 10:00〜18:00" },
  { label: "適格請求書発行事業者登録番号", value: "未登録（免税事業者）" },
];

export default function CompanyPage() {
  return (
    <div className="bg-white">

      {/* Hero */}
      <div className="bg-[#0d2545] text-white">
        <div className="mx-auto max-w-6xl px-6 lg:px-8 py-20 md:py-28">
          <p className="text-xs font-semibold uppercase tracking-widest text-blue-300 mb-4">Company</p>
          <h1 className="text-3xl md:text-4xl font-bold leading-tight">会社概要</h1>
          <p className="text-blue-100 text-base mt-6 max-w-xl leading-loose">
            学びと資産形成を通じて、人生の選択肢を広げる支援をしています。
          </p>
        </div>
      </div>

      {/* Mission / Vision / Value */}
      <section className="bg-[#0d2545] text-white border-t border-white/10">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 md:divide-x divide-white/10 divide-y md:divide-y-0 border-y border-white/10">
            <div className="px-8 py-12 first:pl-0 last:pr-0">
              <p className="text-xs font-semibold uppercase tracking-widest text-blue-300 mb-4">Mission</p>
              <p className="text-lg font-bold leading-relaxed mb-3">
                より良い意思決定を支援する仕組みをつくる
              </p>
              <p className="text-sm text-blue-100 leading-loose">
                学習や資産形成など人生の重要な場面において、複雑な情報を整理し、より良い選択ができる仕組みを提供します。
              </p>
            </div>
            <div className="px-8 py-12">
              <p className="text-xs font-semibold uppercase tracking-widest text-blue-300 mb-4">Vision</p>
              <p className="text-lg font-bold leading-relaxed mb-3">
                すべての人が、より賢く豊かな選択ができる社会を実現する
              </p>
              <p className="text-sm text-blue-100 leading-loose">
                情報格差や経験の差によって選択肢が狭まることのない社会を目指し、学びと意思決定を支援するサービスを提供し続けます。
              </p>
            </div>
            <div className="px-8 py-12 first:pl-0 last:pr-0">
              <p className="text-xs font-semibold uppercase tracking-widest text-blue-300 mb-4">Value</p>
              <p className="text-xl font-bold leading-relaxed">
                正直に<br />
                誠実に<br />
                長期的な価値を届ける
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Numbers */}
      <section className="py-14 md:py-20 bg-[#f5f7fa] border-b border-gray-100">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {[
              { number: "1", unit: "件", label: "開発中サービス", sub: "宅建独学支援アプリ" },
              { number: "1", unit: "事業", label: "提供中サービス", sub: "ウェルスコンサルティング" },
              { number: "4", unit: "資格", label: "展開予定資格", sub: "宅建・FP・行政書士・簿記" },
              { number: "4", unit: "領域", label: "対象領域", sub: "教育・資産形成・不動産・テクノロジー" },
            ].map(({ number, unit, label, sub }) => (
              <div key={label} className="bg-white border border-gray-200 rounded-lg p-6 text-center">
                <p className="text-3xl md:text-4xl font-bold text-[#0d2545]">
                  {number}<span className="text-base md:text-lg ml-1 font-normal text-gray-500">{unit}</span>
                </p>
                <p className="text-sm font-semibold text-[#0d2545] mt-2">{label}</p>
                <p className="text-xs text-gray-500 mt-1 leading-snug">{sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 代表者略歴 */}
      <section className="py-20 md:py-28 border-b border-gray-100">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="md:col-span-1">
              <p className="text-xs font-semibold uppercase tracking-widest text-blue-700 mb-2">Background</p>
              <h2 className="text-lg font-bold text-[#0d2545]">私たちの背景</h2>
            </div>
            <div className="md:col-span-3">
              <div className="space-y-5 text-sm text-gray-700 leading-loose">
                <p className="text-base font-bold text-[#0d2545]">創業の背景</p>
                <p>
                  dokugaku link合同会社は、金融機関での営業・新規出店支援、中堅企業での事業企画、不動産会社での売買・建設事業といった実務経験を背景に、2025年に設立されました。
                </p>
                <p>
                  金融と不動産の現場で培った定量分析・リスク評価・事業運営の知見を、資格取得支援と資産形成の意思決定支援に活かしています。
                </p>
                <p>
                  資格学習における継続の難しさや、何を学習すべきか分からないという課題を解決するため、資格取得支援サービス「ウカレル」の開発を進めるとともに、資産形成および不動産分野に関するコンサルティング事業を展開しています。
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ウカレル創業ストーリー */}
      <section className="py-20 md:py-28 bg-[#f5f7fa] border-b border-gray-100">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="md:col-span-1">
              <p className="text-xs font-semibold uppercase tracking-widest text-blue-700 mb-2">Story</p>
              <h2 className="text-lg font-bold text-[#0d2545]">なぜウカレルを作ったのか</h2>
            </div>
            <div className="md:col-span-3">
              <div className="space-y-5 text-sm text-gray-700 leading-loose">
                <p>
                  金融機関・不動産会社・中堅企業での業務を通じ、資格取得を目指す人が途中で学習を止めてしまうケースを多く見てきました。
                </p>
                <p>その主な原因は3点です。</p>
                <div className="space-y-1 pl-4">
                  <p>・何を学べば合格に近づくか分からない</p>
                  <p>・一度学んだ内容を定期的に復習する仕組みがない</p>
                  <p>・仕事と並行した学習時間の確保が難しい</p>
                </div>
                <p>
                  これらは意欲の問題ではなく、学習の仕組みが整っていないことが原因と考えます。
                </p>
                <p>
                  この課題を解決するため、何をいつ復習すべきかを自動で提案する学習支援アプリ「ウカレル」を開発しています。
                </p>
                <p className="text-right text-gray-400 pt-4">dokugaku link合同会社</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 私たちの強み */}
      <section className="py-20 md:py-28 bg-[#f5f7fa] border-b border-gray-100">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <div className="mb-12">
            <p className="text-xs font-semibold uppercase tracking-widest text-blue-700 mb-4">Strengths</p>
            <h2 className="text-2xl md:text-3xl font-bold text-[#0d2545]">私たちの強み</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {features.map(({ icon, title, body }) => (
              <div key={title} className="flex gap-5 p-6 bg-white border border-gray-200 rounded-lg">
                <div className="shrink-0 w-11 h-11 bg-[#f5f7fa] rounded-lg flex items-center justify-center text-[#0d2545]">
                  {icon}
                </div>
                <div>
                  <p className="text-sm font-bold text-[#0d2545] mb-2 leading-snug">{title}</p>
                  <p className="text-xs text-gray-600 leading-loose">{body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Roadmap */}
      <section className="py-20 md:py-28 border-b border-gray-100">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="md:col-span-1">
              <p className="text-xs font-semibold uppercase tracking-widest text-blue-700 mb-2">Roadmap</p>
              <h2 className="text-lg font-bold text-[#0d2545]">ロードマップ</h2>
            </div>
            <div className="md:col-span-3">
              <div className="relative">
                <div className="absolute top-2 bottom-2 left-[4.25rem] w-px bg-gray-200" />
                {milestones.map(({ year, label, current, goal }) => (
                  <div key={year} className="flex items-start mb-8 last:mb-0">
                    <div className="w-16 pt-0.5 text-right pr-4 shrink-0">
                      <span className={`text-sm font-bold ${current ? "text-blue-700" : "text-gray-400"}`}>
                        {year}
                      </span>
                    </div>
                    <div className="relative z-10 shrink-0 mt-1.5">
                      <div className={`w-3 h-3 rounded-full border-2 ${
                        goal
                          ? "border-[#0d2545] bg-[#0d2545]"
                          : current
                          ? "border-blue-600 bg-blue-600"
                          : "border-gray-300 bg-white"
                      }`} />
                    </div>
                    <div className="pl-5">
                      <p className={`text-sm font-medium leading-snug ${
                        current || goal ? "text-[#0d2545]" : "text-gray-500"
                      }`}>
                        {label}
                      </p>
                      {current && (
                        <span className="text-xs text-blue-600 font-medium mt-1 inline-block">現在</span>
                      )}
                      {goal && (
                        <span className="text-xs font-medium text-[#0d2545] mt-1 inline-block">最終目標</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 価値観 */}
      <section className="py-20 md:py-28 bg-[#f5f7fa] border-b border-gray-100">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="md:col-span-1">
              <p className="text-xs font-semibold uppercase tracking-widest text-blue-700 mb-2">Values</p>
              <h2 className="text-lg font-bold text-[#0d2545]">私たちの価値観</h2>
            </div>
            <div className="md:col-span-3 space-y-6 text-sm text-gray-700 leading-loose">
              <p>
                私たちは、人を騙したり、人を貶めたり、不安を煽ったりすることで利益を得る事業は行いません。
              </p>
              <p>
                長期的に価値を提供し、顧客とともに成長することを大切にしています。
                学びも資産形成も、人生を豊かにするための手段であるべきだと考えています。
              </p>
              <div className="border-l-4 border-[#0d2545] pl-5 py-2">
                <p className="text-base font-semibold text-[#0d2545]">
                  正直に、誠実に、長期的な価値を届ける。
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5年後のビジョン */}
      <section className="py-20 md:py-28 border-b border-gray-100">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="md:col-span-1">
              <p className="text-xs font-semibold uppercase tracking-widest text-blue-700 mb-2">Outlook</p>
              <h2 className="text-lg font-bold text-[#0d2545]">5年後のビジョン</h2>
            </div>
            <div className="md:col-span-3 space-y-6 text-sm text-gray-700 leading-loose">
              <p>
                年収向上につながる資格学習領域を網羅したオンライン学習プラットフォームを構築します。
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {["教材", "学習支援システム", "コミュニティ", "情報発信"].map((item) => (
                  <div key={item} className="bg-[#f5f7fa] border border-gray-200 rounded px-3 py-3 text-sm font-medium text-[#0d2545] text-center">
                    {item}
                  </div>
                ))}
              </div>
              <p className="text-base font-semibold text-[#0d2545]">
                時間やお金の制約によって学ぶ機会を失う人をなくし、<br />
                学び続ける人が集まる場所を作ることが私たちの目標です。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 事業一覧・開発中プロジェクト */}
      <section className="py-20 md:py-28 bg-[#f5f7fa] border-b border-gray-100">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-blue-700 mb-4">Business</p>
              <h2 className="text-lg font-bold text-[#0d2545] mb-6">事業一覧</h2>
              <div className="space-y-4">
                {[
                  { num: "01", title: "学習プラットフォーム事業", desc: "宅建・FP・行政書士・簿記など資格学習者向け独学支援サービスの開発・運営" },
                  { num: "02", title: "ウェルスコンサルティング事業", desc: "資産家・地主・企業オーナー向け不動産・資産形成の意思決定支援" },
                ].map(({ num, title, desc }) => (
                  <div key={num} className="bg-white border border-gray-200 rounded-lg p-5">
                    <p className="text-xs font-mono text-gray-400 mb-2">{num}</p>
                    <p className="text-sm font-bold text-[#0d2545] mb-1">{title}</p>
                    <p className="text-xs text-gray-600">{desc}</p>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-blue-700 mb-4">Projects</p>
              <h2 className="text-lg font-bold text-[#0d2545] mb-6">開発中プロジェクト</h2>
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <span className="text-xs font-medium text-blue-700 bg-blue-50 px-3 py-1 rounded-full">開発中</span>
                <p className="text-sm font-bold text-[#0d2545] mt-4 mb-2">宅建試験 独学支援アプリ</p>
                <p className="text-xs text-gray-600 leading-loose">
                  今日やるべき学習が分かる仕組みと、学習継続を支援する体験設計で、
                  独学者の宅建合格率向上を目指すモバイルアプリ。
                </p>
                <div className="mt-4">
                  <Link
                    href="/services/takken"
                    className="text-sm text-blue-700 font-medium hover:underline"
                  >
                    サービス詳細を見る &rarr;
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 会社情報 */}
      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="md:col-span-1">
              <p className="text-xs font-semibold uppercase tracking-widest text-blue-700 mb-2">Info</p>
              <h2 className="text-lg font-bold text-[#0d2545]">会社情報</h2>
            </div>
            <div className="md:col-span-3">
              <dl className="divide-y divide-gray-100">
                {companyInfo.map(({ label, value }) => (
                  <div key={label} className="flex gap-8 py-5">
                    <dt className="w-24 text-sm text-gray-500 shrink-0">{label}</dt>
                    <dd className="text-sm text-gray-900 leading-loose whitespace-pre-line">
                      {label === "メール" ? (
                        <a href={`mailto:${value}`} className="text-blue-700 hover:underline">{value}</a>
                      ) : label === "電話番号" ? (
                        <a href="tel:06-7652-1304" className="text-blue-700 hover:underline">{value}</a>
                      ) : value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#f5f7fa] py-16 border-t border-gray-200">
        <div className="mx-auto max-w-6xl px-6 lg:px-8 text-center">
          <p className="text-sm text-gray-600 mb-6">ご質問・ご相談はお気軽にどうぞ</p>
          <Link
            href="/contact"
            className="inline-flex items-center px-8 py-3.5 bg-[#0d2545] text-white text-sm font-semibold rounded hover:bg-[#142f5a] transition-colors"
          >
            お問い合わせ
          </Link>
        </div>
      </section>
    </div>
  );
}
