import type { Metadata } from "next";
import ContactForm from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "お問い合わせ",
  description:
    "dokugaku link合同会社へのお問い合わせページです。事業・サービスに関するご質問・ご相談をお気軽にどうぞ。",
  alternates: {
    canonical: "/contact",
  },
};

export default function ContactPage() {
  return (
    <div className="bg-white">
      <div className="bg-[#0d2545] text-white">
        <div className="mx-auto max-w-6xl px-6 lg:px-8 py-20 md:py-28">
          <p className="text-xs font-semibold uppercase tracking-widest text-blue-300 mb-4">
            Contact
          </p>
          <h1 className="text-3xl md:text-4xl font-bold leading-tight">
            お問い合わせ
          </h1>
          <p className="text-blue-100 text-base mt-6 max-w-xl leading-loose">
            事業に関するご質問・ご相談は、フォームまたは直接メールにてお気軽にどうぞ。
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-2xl px-6 lg:px-8 py-20">
        <ContactForm />

        <div className="mt-12 pt-12 border-t border-gray-100 text-center">
          <p className="text-xs text-gray-400 mb-2">直接メールでのお問い合わせも受け付けています</p>
          <a
            href="mailto:info@dokugakulink.com"
            className="text-base font-medium text-[#0d2545] hover:text-blue-700 transition-colors"
          >
            info@dokugakulink.com
          </a>
          <p className="text-xs text-gray-400 mt-4 leading-loose">
            電話番号：<a href="tel:06-7652-1304" className="hover:text-[#0d2545]">06-7652-1304</a><br />
            受付時間：平日 10:00〜18:00<br />
            お問い合わせ内容によっては、回答までにお時間をいただく場合がございます。
          </p>
        </div>
      </div>
    </div>
  );
}
