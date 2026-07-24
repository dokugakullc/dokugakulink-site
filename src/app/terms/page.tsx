import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "ウカレル 利用規約",
  description: "ウカレルの利用規約です。",
  alternates: {
    canonical: "/terms",
  },
};

const sections = [
  {
    title: "第1条（適用）",
    body: (
      <>
        <p>
          本規約は、dokugaku link合同会社（以下「当社」といいます。）が提供する「ウカレル」（以下「本サービス」といいます。）の利用条件を定めるものです。
        </p>
        <p>利用者は、本規約に同意した上で本サービスを利用するものとします。</p>
      </>
    ),
  },
  {
    title: "第2条（利用登録）",
    body: (
      <>
        <p>利用者は、当社が定める方法により利用登録を行うことができます。登録方法には、以下の手段があります。</p>
        <ul>
          <li>メールアドレス登録</li>
          <li>Googleログイン</li>
          <li>Appleログイン</li>
        </ul>
        <p>
          当社は、虚偽の情報を登録した場合、過去に本規約に違反したことがある場合その他当社が不適切と判断した場合、登録を拒否または登録を取り消すことがあります。
        </p>
      </>
    ),
  },
  {
    title: "第3条（禁止事項）",
    body: (
      <>
        <p>利用者は、本サービスの利用にあたり、以下の行為を行ってはなりません。</p>
        <ul>
          <li>本サービスのサーバーまたはシステムへの不正アクセス</li>
          <li>本サービスのソフトウェアの解析、リバースエンジニアリング、逆コンパイル、逆アセンブル</li>
          <li>当社の許可なく本サービスを営利目的で利用する行為</li>
          <li>法令または公序良俗に違反する行為</li>
          <li>他の利用者その他の第三者に対する迷惑行為</li>
        </ul>
      </>
    ),
  },
  {
    title: "第4条（知的財産権）",
    body: (
      <p>
        本サービスに含まれる問題、解説、デザイン、文章等の著作権は、当社または正当な権利者に帰属します。利用者は、当社の許可なくこれらを複製、転載、改変、再配布してはなりません。
      </p>
    ),
  },
  {
    title: "第5条（サブスクリプション）",
    body: (
      <>
        <p>
          利用登録日から30日間は、本サービスのすべての機能を無料で利用できます。この無料期間は、Appleのサブスクリプション契約を伴う無料トライアルではありません。
        </p>
        <p>
          無料期間の終了後も、「今日の15問」および学習履歴の閲覧は無料で利用できます。無料期間の終了を理由として、プレミアムプランへ自動的に加入したり、料金が発生したりすることはありません。
        </p>
        <p>
          プレミアムプランは、利用者が任意に加入手続きを行った場合に限り開始されます。料金は月額580円（税込）で、Apple App内課金を通じてApple IDに請求されます。
        </p>
        <p>
          プレミアムプランは、解約されるまで1か月ごとに自動更新されます。更新を停止する場合は、現在の契約期間が終了する24時間前までに、Apple IDのサブスクリプション設定から自動更新をオフにしてください。解約手続きはいつでも行うことができます。
        </p>
      </>
    ),
  },
  {
    title: "第6条（免責事項）",
    body: (
      <>
        <p>本サービスは、宅地建物取引士試験の合格を保証するものではありません。</p>
        <p>
          法改正への対応には万全を期しておりますが、利用者は最新の法令等を適宜確認するものとします。
        </p>
        <p>
          当社は、本サービスについて、完全性、正確性、有用性、継続性を保証するものではなく、利用者が本サービスを利用したことにより生じた損害について、当社に故意または重大な過失がある場合を除き責任を負いません。
        </p>
      </>
    ),
  },
  {
    title: "第7条（サービス変更・終了）",
    body: (
      <p>
        当社は、必要に応じて本サービスの内容を変更、停止または終了することがあります。当社は、これによって利用者に生じた損害について、当社に故意または重大な過失がある場合を除き責任を負いません。
      </p>
    ),
  },
  {
    title: "第8条（個人情報）",
    body: (
      <p>
        当社による個人情報の取り扱いについては、
        <Link href="/privacy" className="text-blue-700 hover:underline">
          プライバシーポリシー
        </Link>
        に従うものとします。
      </p>
    ),
  },
  {
    title: "第9条（準拠法・管轄）",
    body: (
      <>
        <p>本規約は日本法に準拠します。</p>
        <p>
          本サービスに関する紛争については、大阪地方裁判所を第一審の専属的合意管轄裁判所とします。
        </p>
      </>
    ),
  },
];

export default function TermsPage() {
  return (
    <div className="bg-white">
      <div className="bg-[#0d2545] text-white">
        <div className="mx-auto max-w-[800px] px-6 lg:px-8 py-20 md:py-28">
          <p className="text-xs font-semibold uppercase tracking-widest text-blue-300 mb-4">
            Terms of Service
          </p>
          <h1 className="text-3xl md:text-4xl font-bold leading-tight">利用規約</h1>
          <p className="text-blue-100 text-sm mt-5">最終更新日：2026年7月24日</p>
        </div>
      </div>

      <div className="mx-auto max-w-[800px] px-6 lg:px-8 py-16 md:py-20">
        <div className="space-y-12">
          {sections.map(({ title, body }) => (
            <section key={title}>
              <h2 className="text-lg font-bold text-[#0d2545] mb-4">{title}</h2>
              <div className="space-y-4 text-sm text-gray-600 leading-loose [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-6">
                {body}
              </div>
            </section>
          ))}

          <section>
            <h2 className="text-lg font-bold text-[#0d2545] mb-4">第10条（お問い合わせ）</h2>
            <dl className="grid grid-cols-1 gap-3 text-sm text-gray-600 sm:grid-cols-[9rem_1fr]">
              <dt className="font-medium text-[#0d2545]">事業者名</dt>
              <dd>dokugaku link合同会社</dd>
              <dt className="font-medium text-[#0d2545]">Mail</dt>
              <dd>
                <a
                  href="mailto:support@dokugakulink.com"
                  className="text-blue-700 hover:underline"
                >
                  support@dokugakulink.com
                </a>
              </dd>
            </dl>
          </section>
        </div>
      </div>
    </div>
  );
}
