import type { Metadata } from "next";
import "./lp.css";
import UkareruLP from "@/components/UkareruLP";
import { isUkareruReleased } from "@/lib/ukareruRelease";
import { APP_STORE_ID, APP_STORE_URL } from "@/lib/appStore";

// アプリの呼び方は「宅建士学習アプリ」に統一（2026-10-18 Owner 決定）。配信後は検索向けに「一問一答・iPhone・無料」を添える。
const title = isUkareruReleased()
  ? "ウカレル｜宅建士学習アプリ（一問一答・iPhone・無料）"
  : "ウカレル｜独学で宅建合格を目指す宅建士学習アプリ";
const description = isUkareruReleased()
  ? "今日は15問だけ。今日やること、苦手分野、合格までの現在地が分かる、働きながら独学で宅建合格を目指す人のための宅建士学習アプリ（一問一答）。App Storeで無料配信中。"
  : "今日は15問だけ。毎日やること、苦手分野、合格までの現在地が分かる宅建士学習アプリ（一問一答）。事前登録で15問活用ガイドをすぐに受け取り、App Store公開時にお知らせします。";

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: "/services/takken",
  },
  // Safari のスマートアプリバナー（apple-itunes-app）。公開前は出さない。
  ...(isUkareruReleased() ? { itunes: { appId: APP_STORE_ID } } : {}),
  icons: {
    icon: [
      { url: "/favicon-ukareru.svg", type: "image/svg+xml" },
      { url: "/favicon-ukareru.ico", sizes: "32x32" },
    ],
    apple: { url: "/apple-touch-icon-ukareru.png", sizes: "180x180" },
    shortcut: "/favicon-ukareru.ico",
  },
  openGraph: {
    title,
    description,
    url: "https://www.dokugakulink.com/services/takken",
    siteName: "dokugaku link",
    locale: "ja_JP",
    type: "website",
    images: [
      {
        url: "https://www.dokugakulink.com/services/takken/opengraph-image",
        width: 1200,
        height: 630,
        alt: "ウカレル｜今日は、15問だけ。独学でも、迷わない。",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["https://www.dokugakulink.com/services/takken/opengraph-image"],
  },
};

// 配信後のみ出す構造化データ。評価（aggregateRating）は件数が無いため入れない。
const mobileApplicationJsonLd = {
  "@context": "https://schema.org",
  "@type": "MobileApplication",
  name: "ウカレル",
  operatingSystem: "iOS",
  applicationCategory: "EducationalApplication",
  url: APP_STORE_URL,
  description,
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "JPY",
  },
  publisher: {
    "@type": "Organization",
    name: "dokugaku link合同会社",
    url: "https://www.dokugakulink.com",
  },
};

export default function TakkenPage() {
  return (
    <>
      {isUkareruReleased() && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(mobileApplicationJsonLd) }}
        />
      )}
      <UkareruLP source="services_takken" />
    </>
  );
}
