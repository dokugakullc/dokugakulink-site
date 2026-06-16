import type { Metadata } from "next";
import Link from "next/link";
import { newsItems } from "@/lib/news";

export const metadata: Metadata = {
  title: "お知らせ",
  description:
    "dokugaku link合同会社からの最新情報・開発進捗・お知らせ。宅建独学支援アプリの開発状況など、会社の活動情報を発信しています。",
  keywords: [
    "宅建", "宅建士", "独学", "資格取得", "学習支援", "FP", "行政書士", "簿記",
    "資産形成", "不動産", "ウェルスコンサルティング",
  ],
};

export default function NewsPage() {
  return (
    <div className="bg-white">
      <div className="bg-[#0d2545] text-white">
        <div className="mx-auto max-w-6xl px-6 lg:px-8 py-20 md:py-28">
          <p className="text-xs font-semibold uppercase tracking-widest text-blue-300 mb-4">News</p>
          <h1 className="text-3xl md:text-4xl font-bold leading-tight">お知らせ</h1>
          <p className="text-blue-100 text-base mt-6 max-w-xl leading-loose">
            最新情報・開発進捗・会社からのお知らせをお届けします。
          </p>
        </div>
      </div>

      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <div className="space-y-5">
            {newsItems.map(({ slug, date, category, title, summary, tag }) => (
              <Link
                key={slug}
                href={`/news/${slug}`}
                className="group block border border-gray-200 rounded-lg p-8 hover:border-blue-200 hover:shadow-sm transition-all"
              >
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <span className="text-xs text-gray-400">{date}</span>
                  <span className="text-xs font-medium text-blue-700 bg-blue-50 px-3 py-1 rounded-full">
                    {category}
                  </span>
                  {tag && (
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
                      <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                      {tag}
                    </span>
                  )}
                </div>
                <h2 className="text-lg font-bold text-[#0d2545] mb-3 leading-snug group-hover:text-blue-800 transition-colors">
                  {title}
                </h2>
                <p className="text-sm text-gray-500 leading-loose line-clamp-2">{summary}</p>
                <p className="text-sm font-medium text-blue-700 mt-4 group-hover:text-blue-900 transition-colors">
                  続きを読む →
                </p>
              </Link>
            ))}
          </div>

          <div className="mt-16 border-t border-gray-100 pt-12">
            <p className="text-xs font-semibold uppercase tracking-widest text-blue-700 mb-6">開発中サービス</p>
            <div className="bg-[#f5f7fa] rounded-lg p-8">
              <div className="flex items-center gap-3 mb-4">
                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-700 bg-blue-50 border border-blue-200 px-3 py-1 rounded-full">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
                  開発中
                </span>
              </div>
              <p className="text-sm font-bold text-[#0d2545] mb-1">ウカレル</p>
              <p className="text-sm font-bold text-[#0d2545] mb-2">宅建独学を合格まで導く学習アプリ</p>
              <p className="text-sm text-gray-600 leading-loose mb-5">
                「忘れた頃に、また出題する」仕組みと継続学習支援で、
                独学での宅建合格率向上を目指しています。現在開発中（2026年夏リリース予定）。
              </p>
              <Link
                href="/services/takken"
                className="inline-flex items-center text-sm font-medium text-blue-700 hover:text-blue-900 transition-colors"
              >
                詳細を見る・リリース通知を受け取る →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
