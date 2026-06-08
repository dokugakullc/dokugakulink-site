import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "お問い合わせ",
  description:
    "独学リンク合同会社へのお問い合わせページです。取引先様・金融機関様・サービス利用者様からのご連絡をお待ちしています。",
};

const contactCategories = [
  {
    title: "取引先様",
    description:
      "事業提携・協業・仕入れ・受発注に関するご相談は、下記メールアドレスよりお問い合わせください。",
  },
  {
    title: "金融機関様",
    description:
      "融資・口座開設・各種金融サービスに関するご連絡は、下記メールアドレスよりお問い合わせください。",
  },
  {
    title: "サービス利用者様",
    description:
      "弊社サービスに関するご質問・ご要望・ご意見は、下記メールアドレスよりお問い合わせください。",
  },
];

export default function ContactPage() {
  return (
    <div className="bg-white">
      <div className="bg-[#f5f7fa] border-b border-gray-200">
        <div className="mx-auto max-w-6xl px-6 lg:px-8 py-12">
          <p className="text-xs font-semibold uppercase tracking-widest text-blue-700 mb-2">
            Contact
          </p>
          <h1 className="text-2xl font-bold text-[#0d2545]">お問い合わせ</h1>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-6 lg:px-8 py-16">
        <p className="text-sm text-gray-600 leading-loose mb-12">
          独学リンク合同会社へのお問い合わせは、下記のメールアドレスにてお受けしています。
          内容を確認のうえ、担当者よりご連絡いたします。
        </p>

        <div className="space-y-8 mb-16">
          {contactCategories.map((c) => (
            <div key={c.title} className="border-l-4 border-[#1e5799] pl-6">
              <h2 className="text-base font-bold text-[#0d2545] mb-2">{c.title}</h2>
              <p className="text-sm text-gray-600 leading-loose">{c.description}</p>
            </div>
          ))}
        </div>

        <div className="bg-[#f5f7fa] border border-gray-200 rounded p-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">
            Email
          </p>
          <a
            href="mailto:info@dokugakulink.com"
            className="text-xl font-medium text-[#0d2545] hover:text-blue-700 transition-colors"
          >
            info@dokugakulink.com
          </a>
          <p className="text-xs text-gray-400 mt-4 leading-loose">
            お問い合わせ内容によっては、回答までにお時間をいただく場合がございます。<br />
            あらかじめご了承ください。
          </p>
        </div>
      </div>
    </div>
  );
}
