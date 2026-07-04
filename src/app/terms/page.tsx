import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "利用規約",
  description:
    "dokugaku link合同会社が提供するウェブサイト、β版サービス、アプリケーションおよび関連サービスの利用規約です。",
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
          本利用規約（以下、「本規約」）は、dokugaku link合同会社（以下、「当社」）が提供するウェブサイト、β版サービス、アプリケーションおよび関連サービス（以下、「本サービス」）の利用条件を定めるものです。
        </p>
        <p>利用者は、本規約に同意した上で本サービスを利用するものとします。</p>
      </>
    ),
  },
  {
    title: "第2条（サービス内容）",
    body: (
      <>
        <p>当社は、以下のサービスを提供します。</p>
        <ul>
          <li>宅建学習支援サービス</li>
          <li>β版テストサービス</li>
          <li>メールによるリリース案内</li>
          <li>学習情報の提供</li>
          <li>将来的な資格学習プラットフォームの運営</li>
        </ul>
      </>
    ),
  },
  {
    title: "第3条（利用登録）",
    body: (
      <>
        <p>利用者は、当社が定める方法により利用登録を行うことができます。</p>
        <p>当社は、以下の場合、登録を拒否または削除することがあります。</p>
        <ul>
          <li>虚偽情報を登録した場合</li>
          <li>不正利用の恐れがある場合</li>
          <li>本規約に違反した場合</li>
          <li>その他、当社が不適切と判断した場合</li>
        </ul>
      </>
    ),
  },
  {
    title: "第4条（β版サービスについて）",
    body: (
      <>
        <p>β版サービスは、正式版リリース前の試験運用版です。</p>
        <p>そのため、以下の事項をあらかじめ了承するものとします。</p>
        <ul>
          <li>機能変更が行われる場合があります</li>
          <li>一部機能が利用できない場合があります</li>
          <li>サービス内容が予告なく変更される場合があります</li>
          <li>メンテナンス等により一時停止する場合があります</li>
        </ul>
      </>
    ),
  },
  {
    title: "第5条（禁止事項）",
    body: (
      <>
        <p>利用者は、以下の行為を行ってはなりません。</p>
        <ul>
          <li>法令または公序良俗に反する行為</li>
          <li>システムへの不正アクセス、改ざん、妨害行為</li>
          <li>第三者の権利や利益を侵害する行為</li>
          <li>本サービスの正常な運営を妨げる行為</li>
          <li>他人のメールアドレスや虚偽情報を登録する行為</li>
        </ul>
      </>
    ),
  },
  {
    title: "第6条（知的財産権）",
    body: (
      <>
        <p>
          本サービスに含まれる文章、画像、デザイン、ロゴ、ソフトウェアその他一切の知的財産権は、当社または正当な権利者に帰属します。
        </p>
        <p>利用者は、当社の許可なく複製、転載、改変、再配布を行ってはなりません。</p>
      </>
    ),
  },
  {
    title: "第7条（免責事項）",
    body: (
      <>
        <p>当社は、本サービスについて、完全性、正確性、有用性、継続性を保証するものではありません。</p>
        <p>
          利用者が本サービスを利用したことにより生じた損害について、当社は故意または重大な過失がある場合を除き責任を負いません。
        </p>
      </>
    ),
  },
  {
    title: "第8条（サービス変更・停止）",
    body: (
      <>
        <p>当社は、以下の場合、利用者への事前通知なくサービス内容を変更または停止できるものとします。</p>
        <ul>
          <li>システム保守</li>
          <li>災害</li>
          <li>通信障害</li>
          <li>その他、運営上必要と判断した場合</li>
        </ul>
      </>
    ),
  },
  {
    title: "第9条（個人情報の取り扱い）",
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
    title: "第10条（利用規約の変更）",
    body: (
      <>
        <p>当社は、必要に応じて本規約を変更できるものとします。</p>
        <p>重要な変更を行う場合は、当サイト上で告知します。</p>
        <p>変更後も利用を継続した場合、利用者は変更後の規約に同意したものとみなします。</p>
      </>
    ),
  },
  {
    title: "第11条（準拠法・管轄）",
    body: (
      <>
        <p>本規約は、日本法を準拠法とします。</p>
        <p>
          本サービスに関して紛争が生じた場合、大阪地方裁判所を第一審の専属的合意管轄裁判所とします。
        </p>
      </>
    ),
  },
];

export default function TermsPage() {
  return (
    <div className="bg-white">
      <div className="bg-[#0d2545] text-white">
        <div className="mx-auto max-w-4xl px-6 lg:px-8 py-20 md:py-28">
          <p className="text-xs font-semibold uppercase tracking-widest text-blue-300 mb-4">
            Terms of Service
          </p>
          <h1 className="text-3xl md:text-4xl font-bold leading-tight">利用規約</h1>
          <p className="text-blue-100 text-sm mt-5">最終更新日：2026年7月4日</p>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-6 lg:px-8 py-16 md:py-20">
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
            <h2 className="text-lg font-bold text-[#0d2545] mb-4">第12条（お問い合わせ）</h2>
            <dl className="grid grid-cols-1 gap-3 text-sm text-gray-600 sm:grid-cols-[9rem_1fr]">
              <dt className="font-medium text-[#0d2545]">事業者名</dt>
              <dd>dokugaku link合同会社</dd>
              <dt className="font-medium text-[#0d2545]">Mail</dt>
              <dd>
                <a href="mailto:info@dokugakulink.com" className="text-blue-700 hover:underline">
                  info@dokugakulink.com
                </a>
              </dd>
              <dt className="font-medium text-[#0d2545]">Tel</dt>
              <dd>
                <a href="tel:06-7652-1304" className="text-blue-700 hover:underline">
                  06-7652-1304
                </a>
              </dd>
              <dt className="font-medium text-[#0d2545]">受付時間</dt>
              <dd>平日 10:00〜18:00</dd>
            </dl>
          </section>
        </div>
      </div>
    </div>
  );
}
