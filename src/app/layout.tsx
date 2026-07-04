import type { Metadata } from "next";
import { Noto_Sans_JP } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import MicrosoftClarity from "@/components/MicrosoftClarity";

const notoSansJP = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-noto-sans-jp",
});

const siteTitle = "dokugaku link合同会社 | より良い意思決定を支援する仕組みをつくる";
const siteDescription =
  "dokugaku link合同会社は、独立した立場で資産形成・不動産の意思決定を支援するウェルスコンサルティング事業と、資格取得支援事業を展開しています。";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.dokugakulink.com"),
  title: {
    default: siteTitle,
    template: "%s | dokugaku link合同会社",
  },
  description: siteDescription,
  keywords: [
    "宅建", "宅建士", "独学", "資格取得", "学習支援", "FP", "ファイナンシャルプランナー",
    "行政書士", "簿記", "資産形成", "不動産", "ウェルスコンサルティング", "独学合格",
  ],
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "32x32" },
    ],
    apple: { url: "/apple-touch-icon.png", sizes: "180x180" },
    shortcut: "/favicon.ico",
  },
  openGraph: {
    type: "website",
    locale: "ja_JP",
    siteName: "dokugaku link合同会社",
    title: siteTitle,
    description: siteDescription,
  },
  twitter: {
    card: "summary",
    title: siteTitle,
    description: siteDescription,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className={`${notoSansJP.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-white text-gray-900">
        <GoogleAnalytics />
        <MicrosoftClarity />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
