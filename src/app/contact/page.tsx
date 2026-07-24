import type { Metadata } from "next";
import Link from "next/link";
import ContactForm from "@/components/ContactForm";
import SupportEmail from "@/components/SupportEmail";

const SUPPORT_EMAIL = "support@dokugakulink.com";

// 更新時はここだけ変更すればページ全体に反映されます
const appInfo: { term: string; value: string }[] = [
  { term: "アプリ名", value: "ウカレル" },
  { term: "対応OS", value: "iOS 13.0 以上" },
  { term: "最新バージョン", value: "v1.0.0" },
  { term: "最終更新日", value: "2026年7月" },
];

export const metadata: Metadata = {
  title: "お問い合わせ・サポート",
  description:
    "ウカレルに関するお問い合わせ・サポートページです。よくある質問やサポート窓口をご案内しています。",
  alternates: {
    canonical: "/contact",
  },
  openGraph: {
    title: "お問い合わせ・サポート | dokugaku link合同会社",
    description:
      "ウカレルに関するお問い合わせ・サポートページです。よくある質問やサポート窓口をご案内しています。",
    url: "https://www.dokugakulink.com/contact",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "お問い合わせ・サポート | dokugaku link合同会社",
    description:
      "ウカレルに関するお問い合わせ・サポートページです。よくある質問やサポート窓口をご案内しています。",
  },
};

type Faq = {
  q: string;
  a: React.ReactNode;
};

const faqs: Faq[] = [
  {
    q: "パスワードを忘れました",
    a: (
      <p>
        ログイン画面の「パスワードを忘れた方」から、ご登録のメールアドレスあてに再設定用のメールをお送りできます。メールの案内に沿って新しいパスワードを設定してください。
      </p>
    ),
  },
  {
    q: "購入を復元したい",
    a: (
      <p>
        アプリ内の「設定」→「購入を復元」から復元できます。機種変更後や再インストール後も、購入時と同じ Apple ID でサインインしていれば復元いただけます。
      </p>
    ),
  },
  {
    q: "30日間の無料期間が終わると、自動で課金されますか？",
    a: (
      <p>
        いいえ。無料期間の終了後にプレミアムプランへ自動的に加入したり、料金が発生したりすることはありません。30日経過後も「今日の15問」と学習履歴の閲覧は無料で利用できます。プレミアムプランは、必要な場合にのみ月額580円（税込）のApple App内課金で任意に加入できます。
      </p>
    ),
  },
  {
    q: "法改正には対応していますか？",
    a: (
      <p>
        毎年の試験範囲・法改正に合わせて、問題や解説を継続的にアップデートしています。最新の出題基準に沿った内容で学習いただけます。
      </p>
    ),
  },
  {
    q: "対応端末を教えてください",
    a: (
      <p>iOS 13 以上に対応しています。対応端末であれば、iPhone・iPad どちらでもご利用いただけます。</p>
    ),
  },
  {
    q: "データは引き継げますか？",
    a: (
      <p>
        同じアカウントでログインすると、学習履歴を引き継げます。機種変更やアプリの再インストールの前に、アカウント登録（メール／Google／Apple）を済ませておくことをおすすめします。
      </p>
    ),
  },
  {
    q: "機種変更した場合はどうなりますか？",
    a: (
      <p>
        同じアカウントでログインすると、学習データを引き継げます。機種変更の前に、アカウント登録（メール／Google／Apple）を済ませておくことをおすすめします。
      </p>
    ),
  },
  {
    q: "オフラインでも利用できますか？",
    a: (
      <p>
        一部の機能のご利用にはインターネット接続が必要です。購入情報の同期や最新データの取得の際は、接続された環境でのご利用をおすすめします。
      </p>
    ),
  },
  {
    q: "返金はできますか？",
    a: (
      <p>
        App Store で購入されたサブスクリプションの返金は、Apple のポリシーに従います。返金のお申し込みは Apple へ直接お願いいたします。
      </p>
    ),
  },
  {
    q: "不具合を見つけました",
    a: (
      <p>
        ご迷惑をおかけしております。発生した状況（端末・OS バージョン・操作手順など）を添えて、
        <a
          href={`mailto:${SUPPORT_EMAIL}`}
          className="text-blue-700 underline underline-offset-2 hover:text-blue-900"
        >
          {SUPPORT_EMAIL}
        </a>
        までご連絡ください。確認のうえ、対応いたします。
      </p>
    ),
  },
];

const relatedLinks: { href: string; label: string; description: string }[] = [
  { href: "/terms", label: "利用規約", description: "ウカレルのご利用条件" },
  { href: "/privacy", label: "プライバシーポリシー", description: "個人情報の取り扱いについて" },
  { href: "/services/takken", label: "ウカレル紹介ページ", description: "アプリの特徴と使い方" },
  { href: "/news", label: "News", description: "お知らせ・アップデート情報" },
];

// 検索エンジン向けに、FAQ本文をプレーンテキストで持たせる
const faqPlainText: Record<string, string> = {
  "パスワードを忘れました":
    "ログイン画面の「パスワードを忘れた方」から、ご登録のメールアドレスあてに再設定用のメールをお送りできます。",
  "購入を復元したい":
    "アプリ内の「設定」→「購入を復元」から復元できます。購入時と同じ Apple ID でサインインしていれば復元いただけます。",
  "30日間の無料期間が終わると、自動で課金されますか？":
    "いいえ。無料期間の終了後に自動で課金されることはありません。30日経過後も今日の15問と学習履歴の閲覧は無料で利用でき、プレミアムプランは月額580円（税込）のApple App内課金で任意に加入できます。",
  "法改正には対応していますか？":
    "毎年の試験範囲・法改正に合わせて、問題や解説を継続的にアップデートしています。",
  "対応端末を教えてください": "iOS 13 以上に対応しています。iPhone・iPad どちらでもご利用いただけます。",
  "データは引き継げますか？": "同じアカウントでログインすると、学習履歴を引き継げます。",
  "機種変更した場合はどうなりますか？":
    "同じアカウントでログインすると、学習データを引き継げます。機種変更の前にアカウント登録を済ませておくことをおすすめします。",
  "オフラインでも利用できますか？":
    "一部の機能のご利用にはインターネット接続が必要です。購入情報の同期や最新データの取得の際は接続された環境でのご利用をおすすめします。",
  "返金はできますか？":
    "App Store で購入されたサブスクリプションの返金は Apple のポリシーに従います。返金のお申し込みは Apple へお願いいたします。",
  "不具合を見つけました": `ご迷惑をおかけしております。発生した状況を添えて ${SUPPORT_EMAIL} までご連絡ください。`,
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: {
      "@type": "Answer",
      text: faqPlainText[f.q] ?? "",
    },
  })),
};

export default function ContactPage() {
  return (
    <div className="bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      {/* Hero */}
      <div className="bg-[#0d2545] text-white">
        <div className="mx-auto max-w-6xl px-6 lg:px-8 py-20 md:py-24">
          <p className="text-xs font-semibold uppercase tracking-widest text-blue-300 mb-4">
            Support
          </p>
          <h1 className="text-3xl md:text-4xl font-bold leading-tight">お問い合わせ・サポート</h1>
          <p className="text-blue-100 text-base mt-6 max-w-2xl leading-loose">
            ウカレルに関するご質問・不具合報告・ご要望など、お気軽にお問い合わせください。
            <br />
            内容を確認後、通常2営業日以内に返信いたします。
          </p>
        </div>
      </div>

      {/* お問い合わせ方法 */}
      <section aria-labelledby="contact-methods" className="border-b border-gray-100">
        <div className="mx-auto max-w-5xl px-6 lg:px-8 py-16 md:py-20">
          <h2 id="contact-methods" className="text-xl font-bold text-[#0d2545]">
            お問い合わせ方法
          </h2>
          <p className="text-sm text-gray-600 leading-loose mt-3 mb-8">
            メールまたは下記フォームよりお問い合わせいただけます。
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
            {/* メールサポート */}
            <div className="rounded-2xl border border-gray-200 bg-[#f5f7fa] p-8">
              <div className="flex items-center gap-3 mb-4">
                <span
                  aria-hidden="true"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0d2545] text-white"
                >
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    viewBox="0 0 24 24"
                  >
                    <rect x="3" y="5" width="18" height="14" rx="2" />
                    <path d="m3 7 9 6 9-6" />
                  </svg>
                </span>
                <h3 className="text-base font-bold text-[#0d2545]">メールサポート</h3>
              </div>
              <SupportEmail email={SUPPORT_EMAIL} />
              <p className="text-sm text-gray-600 leading-loose mt-4">
                不具合報告・ご質問・ご要望などはこちらまでご連絡ください。
              </p>
            </div>

            {/* フォーム案内 */}
            <div className="rounded-2xl border border-gray-200 bg-white p-8">
              <div className="flex items-center gap-3 mb-4">
                <span
                  aria-hidden="true"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-[#0d2545]"
                >
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    viewBox="0 0 24 24"
                  >
                    <path d="M4 5h16M4 12h16M4 19h10" />
                  </svg>
                </span>
                <h3 className="text-base font-bold text-[#0d2545]">お問い合わせフォーム</h3>
              </div>
              <p className="text-sm text-gray-600 leading-loose">
                メールソフトをお使いでない場合は、下記フォームからもお問い合わせいただけます。内容を確認のうえ、ご登録のメールアドレスへご連絡いたします。
              </p>
              <a
                href="#contact-form"
                className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-blue-700 hover:text-blue-900"
              >
                フォームへ移動
                <svg
                  aria-hidden="true"
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 5v14M5 12l7 7 7-7" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* よくある質問 */}
      <section aria-labelledby="faq" className="bg-[#f5f7fa] border-b border-gray-100">
        <div className="mx-auto max-w-3xl px-6 lg:px-8 py-16 md:py-20">
          <h2 id="faq" className="text-xl font-bold text-[#0d2545]">
            よくあるご質問
          </h2>
          <p className="text-sm text-gray-600 leading-loose mt-3 mb-8">
            お問い合わせの前に、こちらもご確認ください。
          </p>

          <div className="space-y-3">
            {faqs.map((faq) => (
              <details
                key={faq.q}
                className="group rounded-xl border border-gray-200 bg-white px-5 open:shadow-sm"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 text-left text-[15px] font-semibold text-[#0d2545] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0d2545] [&::-webkit-details-marker]:hidden">
                  <span>{faq.q}</span>
                  <svg
                    aria-hidden="true"
                    className="h-5 w-5 shrink-0 text-gray-400 transition-transform duration-200 group-open:rotate-180"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </summary>
                <div className="pb-5 -mt-1 text-sm text-gray-600 leading-loose">{faq.a}</div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* アプリ情報 */}
      <section aria-labelledby="app-info" className="border-b border-gray-100">
        <div className="mx-auto max-w-5xl px-6 lg:px-8 py-16 md:py-20">
          <h2 id="app-info" className="text-xl font-bold text-[#0d2545]">
            アプリ情報
          </h2>
          <div className="mt-8 max-w-2xl rounded-2xl border border-gray-200 overflow-hidden">
            <dl className="divide-y divide-gray-100">
              {appInfo.map((row) => (
                <div
                  key={row.term}
                  className="flex flex-col gap-1 px-6 py-4 sm:flex-row sm:items-center sm:gap-4"
                >
                  <dt className="w-full shrink-0 text-sm font-semibold text-gray-500 sm:w-40">
                    {row.term}
                  </dt>
                  <dd className="text-sm font-semibold text-[#0d2545]">{row.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* サポート情報 */}
      <section aria-labelledby="support-info" className="bg-[#f5f7fa] border-b border-gray-100">
        <div className="mx-auto max-w-5xl px-6 lg:px-8 py-16 md:py-20">
          <h2 id="support-info" className="text-xl font-bold text-[#0d2545]">
            サポート情報
          </h2>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="rounded-2xl border border-gray-200 p-8">
              <p className="text-xs font-semibold uppercase tracking-wider text-blue-700 mb-3">
                サポート窓口
              </p>
              <p className="text-sm text-gray-500 mb-1">メール</p>
              <a
                href={`mailto:${SUPPORT_EMAIL}`}
                className="text-base font-semibold text-[#0d2545] hover:text-blue-700 transition-colors break-all"
              >
                {SUPPORT_EMAIL}
              </a>
            </div>

            <div className="rounded-2xl border border-gray-200 p-8">
              <p className="text-xs font-semibold uppercase tracking-wider text-blue-700 mb-3">
                対応時間
              </p>
              <p className="text-base font-semibold text-[#0d2545]">平日 10:00〜18:00</p>
              <p className="text-sm text-gray-600 leading-loose mt-2">
                （土日祝を除く）
                <br />
                順次返信しております。通常2営業日以内に返信いたします。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* お問い合わせフォーム */}
      <section aria-labelledby="contact-form" className="border-b border-gray-100">
        <div className="mx-auto max-w-2xl px-6 lg:px-8 py-16 md:py-20">
          <h2 id="contact-form" className="text-xl font-bold text-[#0d2545] scroll-mt-24">
            お問い合わせフォーム
          </h2>
          <p className="text-sm text-gray-600 leading-loose mt-3 mb-8">
            下記フォームに必要事項をご入力ください。内容を確認後、通常2営業日以内に返信いたします。
          </p>
          <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8">
            <ContactForm />
          </div>
        </div>
      </section>

      {/* 関連リンク */}
      <section aria-labelledby="related-links" className="bg-[#f5f7fa] border-b border-gray-100">
        <div className="mx-auto max-w-5xl px-6 lg:px-8 py-16 md:py-20">
          <h2 id="related-links" className="text-xl font-bold text-[#0d2545]">
            関連リンク
          </h2>
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {relatedLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="group flex items-center justify-between gap-4 rounded-xl border border-gray-200 p-6 transition-colors hover:border-[#0d2545] hover:bg-[#f5f7fa] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0d2545]"
              >
                <span>
                  <span className="block text-base font-bold text-[#0d2545]">{link.label}</span>
                  <span className="mt-1 block text-sm text-gray-500">{link.description}</span>
                </span>
                <svg
                  aria-hidden="true"
                  className="h-5 w-5 shrink-0 text-gray-300 transition-colors group-hover:text-[#0d2545]"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 最下部 */}
      <div className="mx-auto max-w-5xl px-6 lg:px-8 py-12 text-center">
        <p className="text-sm text-gray-500 leading-loose">
          ご不明点がございましたら、お気軽にお問い合わせください。
        </p>
      </div>
    </div>
  );
}
