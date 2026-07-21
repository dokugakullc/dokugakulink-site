import type { Metadata } from "next";
import "../../services/takken/lp.css";
import UkareruLP from "@/components/UkareruLP";

const title = "ウカレル｜宅建独学を合格まで導く学習アプリ";
const description =
  "独学でも、迷わない。今日やるべき学習と合格までの現在地が分かる、働きながら宅建合格を目指す人のための学習アプリ。現在リリース準備中。App Store 公開のお知らせを事前登録受付中。";

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    "宅建", "宅建士", "宅建アプリ", "独学", "宅建勉強法",
    "宅建過去問", "宅建一問一答", "宅建合格", "宅建 独学 アプリ", "宅建 学習管理",
  ],
  alternates: {
    canonical: "/landing/takken",
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
    url: "https://www.dokugakulink.com/landing/takken",
    siteName: "dokugaku link",
    locale: "ja_JP",
    type: "website",
    images: [
      {
        url: "https://www.dokugakulink.com/landing/takken/opengraph-image",
        width: 1200,
        height: 630,
        alt: "ウカレル｜今日の15問が、未来を変える。独学でも、迷わない。",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description: "独学でも、迷わない。今日やるべき学習と合格までの現在地が分かる宅建学習アプリ。",
    images: ["https://www.dokugakulink.com/landing/takken/opengraph-image"],
  },
};

export default function TakkenLandingPage() {
  return <UkareruLP source="landing_takken" />;
}
