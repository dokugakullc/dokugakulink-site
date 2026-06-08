import type { Metadata } from "next";
import { Noto_Sans_JP } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const notoSansJP = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-noto-sans-jp",
});

const siteTitle = "独学リンク合同会社 | 教育・学習支援サービスの企画・開発・運営";
const siteDescription =
  "独学リンク合同会社は教育・学習支援サービス、コンテンツ・コミュニティ事業、不動産情報サービス事業、インターネットサービス事業を展開しています。";

export const metadata: Metadata = {
  title: {
    default: siteTitle,
    template: "%s | 独学リンク合同会社",
  },
  description: siteDescription,
  openGraph: {
    type: "website",
    locale: "ja_JP",
    siteName: "独学リンク合同会社",
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
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
