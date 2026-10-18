import type { Metadata } from "next";
import "../../services/takken/lp.css";
import UkareruLP from "@/components/UkareruLP";
import { isUkareruReleased } from "@/lib/ukareruRelease";
import { APP_STORE_ID } from "@/lib/appStore";

const title = "ウカレル｜独学で宅建合格を目指す宅建士学習アプリ";
const description = isUkareruReleased()
  ? "今日は15問だけ。今日やること、苦手分野、合格までの現在地が分かる、働きながら独学で宅建合格を目指す人のための宅建士学習アプリ（一問一答）。App Storeで無料配信中。"
  : "今日は15問だけ。毎日やること、苦手分野、合格までの現在地が分かる宅建士学習アプリ（一問一答）。事前登録で15問活用ガイドをすぐに受け取り、App Store公開時にお知らせします。";

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    "宅建", "宅建士", "宅建アプリ", "独学", "宅建勉強法",
    "宅建一問一答", "宅建合格", "宅建 独学 アプリ", "宅建 学習管理",
  ],
  alternates: {
    canonical: "/landing/takken",
  },
  // 広告専用LP。検索結果には /services/takken だけを出す（2026-10-18 Owner 決定）。
  // URL・route・canonical は変えない（DEC-WEB-2026-07-21）。リンクは辿らせる。
  robots: {
    index: false,
    follow: true,
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
    url: "https://www.dokugakulink.com/landing/takken",
    siteName: "dokugaku link",
    locale: "ja_JP",
    type: "website",
    images: [
      {
        url: "https://www.dokugakulink.com/landing/takken/opengraph-image",
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
    images: ["https://www.dokugakulink.com/landing/takken/opengraph-image"],
  },
};

export default function TakkenLandingPage() {
  return <UkareruLP source="landing_takken" />;
}
