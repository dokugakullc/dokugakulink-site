import type { Metadata } from "next";
import "./lp.css";
import UkareruLP from "@/components/UkareruLP";
import { isUkareruReleased } from "@/lib/ukareruRelease";

const title = "ウカレル｜宅建独学を合格まで導く学習アプリ";
const description = isUkareruReleased()
  ? "今日は15問だけ。今日やること、苦手分野、合格までの現在地が分かる、働きながら独学で宅建合格を目指す人のための一問一答アプリ。App Storeで無料配信中。"
  : "今日は15問だけ。毎日やること、苦手分野、合格までの現在地が分かる宅建一問一答アプリ。事前登録で15問活用ガイドをすぐに受け取り、App Store公開時にお知らせします。";

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: "/services/takken",
  },
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

export default function TakkenPage() {
  return <UkareruLP source="services_takken" />;
}
