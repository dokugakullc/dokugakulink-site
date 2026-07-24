import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "プライバシーポリシー",
  description:
    "dokugaku link合同会社のプライバシーポリシーページです。個人情報の取り扱いについてご確認いただけます。",
  alternates: {
    canonical: "/privacy",
  },
};

const sections = [
  {
    title: "1. 取得する情報",
    content: (
      <p>
        弊社は、サービスの提供・改善・お問い合わせ対応のために、以下の情報を取得することがあります。
        <br /><br />
        ・お名前、メールアドレス等のお問い合わせ時にご提供いただいた情報<br />
        ・サービス利用時のIPアドレス、アクセスログ、閲覧ページ、操作情報、端末・ブラウザ情報、Cookieその他の識別子等の技術情報<br />
        ・アンケートやフォーム入力を通じてご提供いただいた情報
      </p>
    ),
  },
  {
    title: "2. 利用目的",
    content: (
      <p>
        取得した個人情報は、以下の目的で利用します。
        <br /><br />
        ・弊社サービスの提供および運営<br />
        ・お問い合わせへの対応<br />
        ・サービスの改善・新機能の開発<br />
        ・ウェブサイトの利用状況の分析および広告効果の測定<br />
        ・法令に基づく対応
      </p>
    ),
  },
  {
    title: "3. 第三者提供について",
    content: (
      <p>
        弊社は、以下の場合を除き、お客様の個人情報を第三者に提供しません。
        <br /><br />
        ・お客様ご本人の同意がある場合<br />
        ・法令に基づく場合<br />
        ・人命・身体・財産の保護のために必要な場合<br />
        ・公衆衛生の向上または児童の健全育成のために特に必要な場合
      </p>
    ),
  },
  {
    title: "4. 外部サービスおよびCookie等の利用",
    content: (
      <>
        <p>
          弊社は、ウェブサイトの利用状況の分析、サービス改善および広告効果の測定のため、以下の外部サービスを利用しています。これらのサービスは、Cookieその他の識別子を使用し、閲覧ページ、操作情報、端末・ブラウザ情報、IPアドレス等を各提供事業者へ送信する場合があります。取得された情報は、各提供事業者のプライバシーポリシーに基づいて取り扱われます。
        </p>
        <ul className="mt-4 list-disc space-y-4 pl-6">
          <li>
            Google Analytics 4（提供者：Google LLC）<br />
            利用目的：アクセス状況の分析およびウェブサイト・サービスの改善<br />
            <a href="https://policies.google.com/privacy" className="text-blue-700 hover:underline">
              Google プライバシーポリシー
            </a>
          </li>
          <li>
            Microsoft Clarity（提供者：Microsoft Corporation）<br />
            利用目的：ヒートマップ、セッション記録等による利用状況の分析およびUI・UXの改善<br />
            <a href="https://privacy.microsoft.com/ja-jp/privacystatement" className="text-blue-700 hover:underline">
              Microsoft プライバシーステートメント
            </a>
          </li>
        </ul>
        <p className="mt-4">
          利用者はブラウザの設定によりCookieを無効化できます。ただし、その場合はウェブサイトの一部機能が正常に動作しないことがあります。
        </p>
      </>
    ),
  },
  {
    title: "5. 安全管理措置",
    content: (
      <p>
        弊社は、取得した個人情報について、不正アクセス・紛失・改ざん・漏洩等を防止するための適切な安全管理措置を講じます。
        また、個人情報の取り扱いを委託する場合は、委託先において適切な管理が行われるよう監督します。
      </p>
    ),
  },
  {
    title: "6. 開示・訂正・削除について",
    content: (
      <p>
        お客様は、弊社が保有するご自身の個人情報について、開示・訂正・利用停止・削除をご請求いただけます。
        ご請求の際は、本人確認のうえ、合理的な範囲で対応いたします。
        ご請求・お問い合わせは、下記の窓口までご連絡ください。
      </p>
    ),
  },
  {
    title: "7. お問い合わせ窓口",
    content: (
      <p>
        個人情報の取り扱いに関するご質問・ご請求は、下記までお問い合わせください。
        <br /><br />
        dokugaku link合同会社<br />
        〒530-0001 大阪市北区梅田1-1-3<br />
        大阪駅前第3ビル29階1-1-1号室<br />
        メール：
        <a
          href="mailto:info@dokugakulink.com"
          className="text-blue-700 hover:underline"
        >
          info@dokugakulink.com
        </a><br />
        電話番号：<a href="tel:06-7652-1304" className="text-blue-700 hover:underline">06-7652-1304</a><br />
        受付時間：平日 10:00〜18:00
      </p>
    ),
  },
];

export default function PrivacyPage() {
  return (
    <div className="bg-white">
      <div className="bg-[#f5f7fa] border-b border-gray-200">
        <div className="mx-auto max-w-6xl px-6 lg:px-8 py-12">
          <p className="text-xs font-semibold uppercase tracking-widest text-blue-700 mb-2">
            Privacy Policy
          </p>
          <h1 className="text-2xl font-bold text-[#0d2545]">プライバシーポリシー</h1>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-6 lg:px-8 py-16">
        <p className="text-sm text-gray-600 leading-loose mb-12">
          dokugaku link合同会社（以下「弊社」）は、お客様の個人情報の保護を重要な責務と認識し、
          以下のとおりプライバシーポリシーを定めます。
        </p>

        <div className="space-y-10">
          {sections.map((s) => (
            <div key={s.title} className="border-b border-gray-100 pb-10 last:border-0 last:pb-0">
              <h2 className="text-base font-bold text-[#0d2545] mb-4">{s.title}</h2>
              <div className="text-sm text-gray-600 leading-loose">{s.content}</div>
            </div>
          ))}
        </div>

        <p className="text-xs text-gray-400 mt-12 pt-8 border-t border-gray-100">
          制定日：2025年10月27日<br />
          最終改訂日：2026年7月24日<br />
          dokugaku link合同会社
        </p>
      </div>
    </div>
  );
}
