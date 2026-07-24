import type { Metadata } from "next";
import { Noto_Sans_JP } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import MicrosoftClarity from "@/components/MicrosoftClarity";
import MetaPixel from "@/components/MetaPixel";

const notoSansJP = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-noto-sans-jp",
});

const siteTitle = "dokugaku link合同会社 | より良い意思決定を支援する仕組みをつくる";
const siteDescription =
  "dokugaku link合同会社は、独立した立場で資産形成・不動産の意思決定を支援するウェルスコンサルティング事業と、資格取得支援事業を展開しています。";
const corporateOgpTitle = "dokugaku link｜より良い意思決定を支援する仕組みをつくる";
const corporateOgpDescription =
  "ウェルスコンサルティング事業と資格取得支援事業を通じ、より良い意思決定を支援します。";

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "dokugaku link合同会社",
  url: "https://www.dokugakulink.com",
  email: "info@dokugakulink.com",
  telephone: "06-7652-1304",
  foundingDate: "2025-10-27",
  taxID: "2120003031128",
  address: {
    "@type": "PostalAddress",
    postalCode: "530-0001",
    addressCountry: "JP",
    addressRegion: "大阪府",
    addressLocality: "大阪市北区",
    streetAddress: "梅田1-1-3 大阪駅前第3ビル29階1-1-1号室",
  },
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "06-7652-1304",
    contactType: "customer support",
    availableLanguage: "Japanese",
  },
};

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
    title: corporateOgpTitle,
    description: corporateOgpDescription,
    images: [
      {
        url: "/og/company-og.png",
        width: 1200,
        height: 630,
        alt: corporateOgpTitle,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: corporateOgpTitle,
    description: corporateOgpDescription,
    images: ["/og/company-og.png"],
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <GoogleAnalytics />
        <MicrosoftClarity />
        <MetaPixel />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
