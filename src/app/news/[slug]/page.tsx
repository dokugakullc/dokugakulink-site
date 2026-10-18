import type { Metadata } from "next";
import Link from "next/link";
import AppStoreCta from "@/components/AppStoreCta";
import { formatNewsDate, getNewsItems, newsTag } from "@/lib/news";
import { isUkareruReleased } from "@/lib/ukareruRelease";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return getNewsItems(isUkareruReleased()).map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = getNewsItems(isUkareruReleased()).find((item) => item.slug === slug);
  return {
    title: article?.title ?? "お知らせ",
    description: article?.summary ?? "",
  };
}

export default async function NewsDetailPage({ params }: Props) {
  const { slug } = await params;
  const released = isUkareruReleased();
  const article = getNewsItems(released).find((item) => item.slug === slug);

  if (!article) {
    return (
      <div className="py-20 text-center">
        <p className="text-gray-500">記事が見つかりません。</p>
        <Link href="/news" className="mt-4 inline-block text-sm text-blue-700 hover:underline">
          お知らせ一覧へ
        </Link>
      </div>
    );
  }

  const tag = newsTag(article, released);

  return (
    <div className="bg-white">
      <div className="bg-[#0d2545] text-white">
        <div className="mx-auto max-w-6xl px-6 lg:px-8 py-16 md:py-20">
          <Link
            href="/news"
            className="inline-flex items-center gap-1.5 text-xs text-blue-300 hover:text-white transition-colors mb-6"
          >
            ← お知らせ一覧
          </Link>
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="text-xs text-blue-300">{formatNewsDate(article.date)}</span>
            <span className="text-xs font-medium text-blue-200 bg-white/10 px-3 py-1 rounded-full">
              {article.category}
            </span>
            {tag && (
              <span
                className={`inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full ${
                  tag.active ? "text-emerald-300 bg-emerald-500/20" : "text-blue-200 bg-white/10"
                }`}
              >
                {tag.active && <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />}
                {tag.label}
              </span>
            )}
          </div>
          <h1 className="text-2xl md:text-3xl font-bold leading-tight">{article.title}</h1>
        </div>
      </div>

      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-3xl px-6 lg:px-8">
          <div className="space-y-6 text-gray-700 leading-loose text-sm md:text-base">
            {article.body.map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>

          <div className="mt-14 pt-8 border-t border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <Link
              href="/news"
              className="inline-flex items-center gap-1.5 text-sm text-blue-700 hover:text-blue-900 transition-colors font-medium"
            >
              ← お知らせ一覧に戻る
            </Link>
            {article.externalLink && (
              <a
                href={article.externalLink.href}
                target="_blank"
                rel="noopener"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#0d2545] text-white text-sm font-semibold rounded-lg hover:bg-[#142f5a] transition-colors"
              >
                {article.externalLink.label} &rarr;
              </a>
            )}
            {released && article.appStoreCta && (
              <AppStoreCta
                source="news"
                location={`article_${article.slug}`}
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#007AFF] text-white text-sm font-semibold rounded-lg hover:bg-[#0055CC] transition-colors"
              >
                App Storeで無料ダウンロード
              </AppStoreCta>
            )}
            {!released && article.tag === "開発中" && (
              <Link
                href="/services/takken"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#0d2545] text-white text-sm font-semibold rounded-lg hover:bg-[#142f5a] transition-colors"
              >
                リリース通知を受け取る
              </Link>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
