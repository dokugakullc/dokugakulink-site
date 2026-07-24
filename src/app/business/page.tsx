import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "事業内容",
  description:
    "dokugaku link合同会社の事業内容。不動産・資産形成コンサルティングと、宅建・FP・行政書士・簿記などの独学支援アプリ開発を展開しています。",
  alternates: {
    canonical: "/business",
  },
};

export default function BusinessPage() {
  return (
    <div className="bg-white">
      <div className="bg-[#0d2545] text-white">
        <div className="mx-auto max-w-6xl px-6 lg:px-8 py-20 md:py-28">
          <p className="text-xs font-semibold uppercase tracking-widest text-blue-300 mb-4">
            Business
          </p>
          <h1 className="text-3xl md:text-4xl font-bold leading-tight">
            事業内容
          </h1>
          <p className="text-blue-100 text-base mt-6 max-w-xl leading-loose">
            ウェルスコンサルティングと<br className="hidden sm:block" />資格取得支援の2つの事業を展開しています。
          </p>
        </div>
      </div>

      {/* ウェルスコンサルティング事業 */}
      <section id="wealth" className="py-20 md:py-28 border-b border-gray-100">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 items-start">
            <div className="md:col-span-1">
              <p className="text-xs font-mono text-gray-400 mb-3">01</p>
              <h2 className="text-xl font-bold text-[#0d2545] leading-snug">
                ウェルスコンサルティング事業
              </h2>
            </div>
            <div className="md:col-span-3 space-y-14">
              <div className="border-l-4 border-[#0d2545] pl-5 py-2">
                <p className="text-sm text-gray-600 leading-loose">
                  資産家・地主・事業オーナーの意思決定を支援します。
                  金融商品や不動産の販売を目的とせず、独立した立場から資産形成・不動産の調査・分析・比較を行います。
                </p>
              </div>

              {/* なぜ始めたのか */}
              <div>
                <h3 className="text-sm font-bold text-[#0d2545] uppercase tracking-wider mb-5">
                  なぜウェルスコンサルティング事業を始めたのか
                </h3>
                <div className="space-y-4 text-sm text-gray-600 leading-loose mb-5">
                  <p>
                    不動産会社や建設会社、資産家の方々から、
                  </p>
                  <div className="space-y-1 pl-4">
                    <p>・この物件は購入すべきか</p>
                    <p>・将来の出口戦略はどう考えるべきか</p>
                    <p>・保有資産の価値を高めるにはどうすれば良いか</p>
                  </div>
                  <p>
                    といった相談を受ける機会が増えたことがきっかけです。
                  </p>
                  <p>
                    不動産投資や資産形成は、大きな金額が動く一方で、十分な情報や判断材料を得られないまま意思決定を迫られることも少なくありません。
                  </p>
                  <p>
                    そこで私たちは、市場環境・資金計画・出口戦略・リスク要因を総合的に整理し、相談者ごとの状況に応じた意思決定支援を行っています。
                  </p>
                  <div className="border-l-4 border-[#0d2545] pl-5 py-2">
                    <p className="text-sm font-semibold text-[#0d2545]">
                      投資判断を代行するのではなく、より納得感のある判断ができるよう伴走すること。それが私たちのウェルスコンサルティング事業の役割です。
                    </p>
                  </div>
                </div>
              </div>

              {/* 対象顧客 */}
              <div>
                <h3 className="text-sm font-bold text-[#0d2545] uppercase tracking-wider mb-5">
                  対象顧客
                </h3>
                <p className="text-sm text-gray-600 leading-loose mb-5">
                  現在、<strong className="text-[#0d2545]">資産家・地主・事業オーナー</strong>を中心に、
                  個別プロジェクト単位でご支援しています。
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { label: "資産家", body: "不動産・金融資産の運用・活用を検討されている方" },
                    { label: "地主", body: "土地・収益物件を複数保有し、最適な活用方法を模索されている方" },
                    { label: "企業オーナー", body: "事業経営と資産管理を並行して行い、意思決定の質を高めたい方" },
                  ].map(({ label, body }) => (
                    <div key={label} className="bg-[#f5f7fa] rounded-lg p-5">
                      <p className="text-sm font-bold text-[#0d2545] mb-2">{label}</p>
                      <p className="text-xs text-gray-600 leading-loose">{body}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* 提供価値 */}
              <div>
                <h3 className="text-sm font-bold text-[#0d2545] uppercase tracking-wider mb-5">
                  提供価値
                </h3>
                <p className="text-sm text-gray-600 leading-loose mb-6">
                  資産運用や不動産活用において、重要なのは特定の商品ではなく「判断軸」です。
                  私たちは情報収集から意思決定の振り返りまでを一貫して支援します。
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  {[
                    { step: "01", title: "市場調査", body: "不動産市況・金融市場・競合物件など、意思決定に必要な情報を収集・整理します" },
                    { step: "02", title: "投資分析", body: "キャッシュフロー、利回り、リスク評価など定量的な分析を行います" },
                    { step: "03", title: "比較・戦略設計", body: "複数の選択肢をシナリオ別に比較し、最適な戦略の判断材料を提供します" },
                    { step: "04", title: "実行後の振り返り", body: "投資後のモニタリングと振り返りを通じ、次の意思決定の質を高めます" },
                  ].map(({ step, title, body }) => (
                    <div key={step} className="border border-gray-200 rounded-lg p-5">
                      <p className="text-xs font-mono text-gray-400 mb-2">{step}</p>
                      <p className="text-sm font-bold text-[#0d2545] mb-2">{title}</p>
                      <p className="text-xs text-gray-600 leading-loose">{body}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* サービスの流れ */}
              <div>
                <h3 className="text-sm font-bold text-[#0d2545] uppercase tracking-wider mb-5">
                  サービスの流れ
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    "お問い合わせ",
                    "ヒアリング",
                    "提案・見積",
                    "契約",
                    "調査・分析",
                    "成果物提出",
                    "納品",
                  ].map((step, i) => (
                    <div key={step} className="border border-gray-200 rounded-lg bg-white px-5 py-4">
                      <p className="text-xs font-mono text-blue-700 mb-2">
                        {String(i + 1).padStart(2, "0")}
                      </p>
                      <p className="text-sm font-bold text-[#0d2545]">{step}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* 相談実績 */}
              <div>
                <h3 className="text-sm font-bold text-[#0d2545] uppercase tracking-wider mb-5">
                  相談事例
                </h3>
                <div className="space-y-3 mb-4">
                  {[
                    "収益不動産購入の意思決定支援",
                    "保有不動産の売却戦略立案",
                    "資金計画策定支援",
                  ].map((item) => (
                    <div key={item} className="flex items-start gap-2 text-sm text-gray-600">
                      <span className="text-blue-600 shrink-0 mt-0.5">—</span>
                      {item}
                    </div>
                  ))}
                </div>
                <p className="text-sm text-gray-500">ご相談内容に応じ、個別プロジェクト単位で支援します。</p>
              </div>

              {/* 私たちが提供しないもの */}
              <div>
                <h3 className="text-sm font-bold text-[#0d2545] uppercase tracking-wider mb-5">
                  私たちが提供しないもの
                </h3>
                <p className="text-sm text-gray-600 leading-loose mb-6">
                  私たちは以下を目的とした会社ではありません。
                </p>
                <div className="space-y-3 mb-8">
                  {[
                    "金融商品の販売",
                    "保険商品の販売",
                    "不動産仲介",
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-3 border border-gray-200 rounded-lg px-5 py-4">
                      <span className="text-red-400 font-bold text-lg shrink-0">✕</span>
                      <span className="text-sm text-gray-600">{item}</span>
                    </div>
                  ))}
                </div>
                <div className="bg-[#f5f7fa] border-l-4 border-[#0d2545] rounded-r-lg px-6 py-5 mb-5">
                  <p className="text-sm font-bold text-[#0d2545] mb-2">重要なのは商品を売ることではなく、判断軸を提供することです。</p>
                  <p className="text-sm text-gray-600 leading-loose">
                    私たちは利益相反のない独立した立場から、純粋に「より良い意思決定」だけを支援します。
                    不動産・金融機関での実務経験と資産形成支援を通じて培った分析力で、お客様の判断軸を磨きます。
                  </p>
                </div>
                <div className="border border-gray-200 rounded-lg px-6 py-4 text-sm text-gray-600 leading-loose">
                  当社は宅地建物取引業者ではありません。物件の媒介・売買は行わず、調査・分析・意思決定支援を提供しています。
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* 資格取得支援事業 */}
      <section id="learning" className="py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 items-start">
            <div className="md:col-span-1">
              <p className="text-xs font-mono text-gray-400 mb-3">02</p>
              <h2 className="text-xl font-bold text-[#0d2545] leading-snug">
                資格取得支援事業
              </h2>
            </div>
            <div className="md:col-span-3 space-y-14">

              {/* 私たちが解決したいこと */}
              <div>
                <h3 className="text-sm font-bold text-[#0d2545] uppercase tracking-wider mb-5">
                  私たちが解決したいこと
                </h3>
                <p className="text-sm text-gray-600 leading-loose mb-6">
                  資格取得はゴールではありません。
                </p>
                <p className="text-sm text-gray-600 leading-loose mb-6">
                  宅建・FP・行政書士・簿記といった資格を取得することで、その先にある本当の価値を手にできます。
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
                  {["年収向上", "転職・キャリアチェンジ", "副業・独立", "人生の選択肢の拡大", "自信と専門性の獲得"].map((item) => (
                    <div key={item} className="bg-[#f5f7fa] rounded px-4 py-3 text-sm font-medium text-[#0d2545]">
                      {item}
                    </div>
                  ))}
                </div>
                <p className="text-sm text-gray-600 leading-loose">
                  私たちは資格学習の支援を通じて、学習者の人生をより豊かにすることを目指しています。
                  独学で学ぶすべての人が、持っている可能性を最大限に発揮できる環境を作ります。
                </p>
              </div>

              {/* 現在の課題 */}
              <div>
                <h3 className="text-sm font-bold text-[#0d2545] uppercase tracking-wider mb-5">
                  独学者が直面する3つの課題
                </h3>
                <p className="text-sm text-gray-600 leading-loose mb-5">
                  資格取得を目指して学び始めても、多くの独学者が途中で挫折します。
                  問題は意志の弱さではありません。仕組みの不在です。
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { label: "継続できない", body: "日常の中に学習習慣を組み込めず、やる気が続かない" },
                    { label: "復習できない", body: "一度学んでも忘れた頃に再確認する仕組みがない" },
                    { label: "現在地が分からない", body: "どこまで理解できているのか、何が弱点なのか見えない" },
                  ].map(({ label, body }) => (
                    <div key={label} className="bg-[#f5f7fa] rounded-lg p-5">
                      <p className="text-sm font-bold text-[#0d2545] mb-2">{label}</p>
                      <p className="text-xs text-gray-600 leading-loose">{body}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* 現在開発中 */}
              <div>
                <h3 className="text-sm font-bold text-[#0d2545] uppercase tracking-wider mb-5">
                  現在開発中のサービス
                </h3>
                <div className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-xs font-medium text-blue-700 bg-blue-50 px-3 py-1 rounded-full">開発中</span>
                  </div>
                  <p className="text-xl font-bold text-[#0d2545] mb-1">ウカレル</p>
                  <p className="text-base font-bold text-[#0d2545] mb-1">独学社会人のための合格ナビゲーションアプリ</p>
                  <p className="text-sm text-gray-500 mb-1">リリース準備中</p>
                  <p className="text-sm font-medium text-blue-700 mb-4">事前登録受付中</p>
                  <p className="text-sm text-gray-600 leading-loose mb-5">
                    ウカレルは、独学で資格取得を目指す社会人のための合格ナビゲーションアプリです。
                    Phase 1では宅地建物取引士試験に対応し、将来的にFP・簿記・行政書士へ展開します。
                  </p>
                  <ul className="space-y-2">
                    {[
                      "記憶定着の考え方として知られる間隔反復学習を参考に、復習タイミングを自動で提案",
                      "学習継続を支援するUI・UX設計",
                      "弱点分野の可視化と重点学習サポート",
                      "隙間時間に使いやすいモバイルファースト設計",
                    ].map((item) => (
                      <li key={item} className="flex items-start gap-2 text-sm text-gray-600">
                        <span className="text-blue-600 shrink-0 mt-0.5">—</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* 将来構想 */}
              <div>
                <h3 className="text-sm font-bold text-[#0d2545] uppercase tracking-wider mb-5">
                  将来構想
                </h3>
                <p className="text-sm text-gray-600 leading-loose mb-5">
                  宅建士試験での実績をもとに、キャリア形成に役立つ資格学習領域へ順次展開していきます。
                </p>
                <div className="flex flex-wrap gap-2">
                  {["宅地建物取引士", "ファイナンシャルプランナー", "行政書士", "簿記", "その他資格"].map((item) => (
                    <span key={item} className="text-xs px-3 py-1.5 border border-gray-200 rounded-full text-gray-600">
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              {/* 最終構想 */}
              <div className="bg-[#0d2545] text-white rounded-lg p-8">
                <p className="text-xs font-semibold uppercase tracking-widest text-blue-300 mb-4">
                  Final Vision
                </p>
                <h3 className="text-lg font-bold mb-5">5年後の最終構想</h3>
                <p className="text-blue-100 text-sm leading-loose mb-6">
                  5年後には、年収向上につながる資格学習領域を網羅した学習プラットフォームを構築します。
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                  {["教材", "学習システム", "コミュニティ", "コンテンツ配信"].map((item) => (
                    <div key={item} className="bg-white/10 rounded px-3 py-3 text-sm font-medium text-center">
                      {item}
                    </div>
                  ))}
                </div>
                <p className="text-blue-100 text-sm leading-loose">
                  この4つを統合したオンライン予備校の実現を目指します。
                  時間やお金の制約があっても、誰もが手軽に学べる環境を提供します。
                </p>
              </div>

              {/* コミュニティ構想 */}
              <div>
                <h3 className="text-sm font-bold text-[#0d2545] uppercase tracking-wider mb-5">
                  コミュニティ構想
                </h3>
                <p className="text-sm text-gray-600 leading-loose">
                  学習プラットフォームの先に、向上心ある学習者同士が繋がれるコミュニティを構築します。
                  同じ目標を持つ人が互いに刺激しあい、孤独になりがちな独学をより豊かな体験に変えます。
                  教材・テクノロジー・コミュニティの三位一体で、学び続ける人のインフラを目指します。
                </p>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#f5f7fa] py-16 border-t border-gray-200">
        <div className="mx-auto max-w-6xl px-6 lg:px-8 text-center">
          <p className="text-sm text-gray-600 mb-6">事業に関するお問い合わせはこちら</p>
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
