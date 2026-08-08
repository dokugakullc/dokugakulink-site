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
    title: "3. お問い合わせフォームでお預かりする情報と保存期間",
    content: (
      <>
        <p>
          お問い合わせフォームでは、以下の情報をお預かりし、アクセス権限を制限したクラウドサービス（Googleが提供するサービスを含みます）を利用して保管する場合があります。委託先には必要かつ適切な監督を行います。
        </p>
        <ul className="mt-4 list-disc space-y-2 pl-6">
          <li>お名前</li>
          <li>会社名（任意）</li>
          <li>メールアドレス</li>
          <li>お問い合わせ種別</li>
          <li>お問い合わせ内容</li>
          <li>受付日時</li>
          <li>その他、お問い合わせフォームに入力された情報および送信時の技術情報（アクセス経路・参照元・端末／ブラウザ情報等）</li>
        </ul>
        <p className="mt-4">
          利用目的は、お問い合わせへの回答、本人確認、対応履歴の管理、不正利用・迷惑送信の防止、ならびにサービスおよび対応品質の改善です。
        </p>
        <p className="mt-4">
          保存期間は、原則として最終対応日から1年間とします。営業目的のご連絡・迷惑送信・明らかなテストと確認できたものは、確認後90日以内に削除します。契約・請求・紛争対応や法令上の必要等がある場合は、その目的に必要な範囲・期間に限り継続して保管することがあります。保存の必要がなくなった情報は、適切な方法で削除します。
        </p>
        <p className="mt-4">
          お預かりした情報の開示・訂正・利用停止・削除等のお申し出には、本人確認のうえ、法令に従って対応いたします（下記「開示・訂正・削除について」および「お問い合わせ窓口」）。
        </p>
      </>
    ),
  },
  {
    title: "4. 第三者提供について",
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
    title: "5. 外部サービスおよびCookie等の利用",
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
          <li>
            PostHog（提供者：PostHog, Inc.）<br />
            利用目的：アプリ（ウカレル）のサービス利用状況の把握、機能改善および品質向上<br />
            <a href="https://posthog.com/privacy" className="text-blue-700 hover:underline">
              PostHog プライバシーポリシー
            </a>
          </li>
        </ul>
        <p className="mt-4">
          アプリ（ウカレル）では、上記 PostHog を利用して、アプリ内での操作・利用に関するイベント、端末・アプリに関する技術情報、およびアカウントに紐づく識別情報を取得する場合があります。当社は、分析目的で送信する情報を必要な範囲に限定し、識別情報を含む送信項目の最小化を継続的に行います。
        </p>
        <p className="mt-4">
          なお、アカウントを削除された場合でも、分析基盤（PostHog）へ既に送信された利用データが直ちに、または完全に削除されるものではありません。分析基盤上のデータの取扱いに関するご請求は、下記「お問い合わせ窓口」までご連絡ください。
        </p>
        <p className="mt-6">
          また弊社は、お問い合わせフォームおよび事前登録フォームの不正利用や自動送信を防止する目的で、Cloudflare, Inc. が提供する Cloudflare Turnstile を利用する場合があります（上記の分析・広告効果測定とは目的が異なり、bot 対策として利用します）。Turnstile の動作に伴い、端末、ブラウザ、ネットワークその他の技術情報が Cloudflare により処理される場合があります。これらの情報は、Cloudflare のプライバシーポリシーおよび Turnstile に関するポリシーに基づいて取り扱われます。Cookie 等の利用を含む具体的な取扱いは、当社の設定および Cloudflare の仕様によります。
        </p>
        <ul className="mt-4 list-disc space-y-4 pl-6">
          <li>
            Cloudflare Turnstile（提供者：Cloudflare, Inc.）<br />
            利用目的：お問い合わせ・事前登録フォームの不正利用および自動送信（bot）の防止<br />
            <a href="https://www.cloudflare.com/turnstile-privacy-policy/" className="text-blue-700 hover:underline">
              Cloudflare Turnstile プライバシーポリシー
            </a>
            <br />
            <a href="https://www.cloudflare.com/privacypolicy/" className="text-blue-700 hover:underline">
              Cloudflare プライバシーポリシー
            </a>
          </li>
        </ul>
        <p className="mt-4">
          また弊社は、広告の効果測定のため、流入時の広告パラメータ（UTM）、広告クリックID、参照元および着地ページのURLを、ブラウザのローカルストレージ等に一定期間（現在は約7日間）保存する場合があります。これらの情報に氏名・メールアドレス等は含みません。保存された情報は、ブラウザの設定やデータ消去により削除できます。
        </p>
        <p className="mt-4">
          利用者はブラウザの設定によりCookieを無効化できます。ただし、その場合はウェブサイトの一部機能が正常に動作しないことがあります。
        </p>
      </>
    ),
  },
  {
    title: "6. 安全管理措置",
    content: (
      <p>
        弊社は、取得した個人情報について、不正アクセス・紛失・改ざん・漏洩等を防止するための適切な安全管理措置を講じます。
        また、個人情報の取り扱いを委託する場合は、委託先において適切な管理が行われるよう監督します。
      </p>
    ),
  },
  {
    title: "7. 開示・訂正・削除について",
    content: (
      <p>
        お客様は、弊社が保有するご自身の個人情報について、開示・訂正・利用停止・削除をご請求いただけます。
        ご請求の際は、本人確認のうえ、合理的な範囲で対応いたします。
        ご請求・お問い合わせは、下記の窓口までご連絡ください。
      </p>
    ),
  },
  {
    title: "8. お問い合わせ窓口",
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
          最終改訂日：2026年8月8日<br />
          dokugaku link合同会社
        </p>
      </div>
    </div>
  );
}
