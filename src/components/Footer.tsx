"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/", label: "ホーム" },
  { href: "/business", label: "事業内容" },
  { href: "/services/takken", label: "ウカレル" },
  { href: "/company", label: "会社概要" },
  { href: "/news", label: "お知らせ" },
  { href: "/contact", label: "お問い合わせ" },
  { href: "/privacy", label: "プライバシーポリシー" },
  { href: "/terms", label: "利用規約" },
  { href: "/legal/tokushoho", label: "特定商取引法に基づく表記" },
];

// 広告LPで残す最小リンク（法務＋登録解除の連絡先のみ。回遊ナビは持たない）
const adLpLinks = [
  { href: "/privacy", label: "プライバシーポリシー" },
  { href: "/terms", label: "利用規約" },
  { href: "/legal/tokushoho", label: "特定商取引法に基づく表記" },
  { href: "/contact", label: "お問い合わせ" },
];

export default function Footer() {
  const pathname = usePathname();
  const isAdLP = pathname === "/landing/takken";
  const year = new Date().getFullYear();

  // 広告LP専用の最小フッター: 運営者の明示（信頼）と法務リンクのみ。
  if (isAdLP) {
    return (
      <footer className="bg-[#0d2545] text-white">
        <div className="mx-auto max-w-3xl px-6 py-12 text-center">
          <p className="text-base font-bold tracking-tight">dokugaku link合同会社</p>
          <p className="mt-2 text-sm text-blue-100/80 leading-relaxed">
            宅建学習アプリ「ウカレル」を提供しています。
          </p>
          <nav className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
            {adLpLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                target="_blank"
                className="text-xs text-gray-300 hover:text-white underline underline-offset-2 transition-colors"
              >
                {label}
              </Link>
            ))}
          </nav>
          <p className="mt-8 text-xs text-gray-500">
            &copy; {year} dokugaku link合同会社 All Rights Reserved.
          </p>
        </div>
      </footer>
    );
  }

  return (
    <footer className="bg-[#0d2545] text-white">
      <div className="mx-auto max-w-6xl px-6 lg:px-8 pt-14 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 pb-12 border-b border-white/10">
          {/* ブランド */}
          <div>
            <p className="text-base font-bold tracking-tight">dokugaku link合同会社</p>
            <div className="mt-5 border-l-2 border-blue-400/40 pl-4">
              <p className="text-xs font-semibold uppercase tracking-widest text-blue-300 mb-1">Mission</p>
              <p className="text-sm text-blue-100 leading-loose">
                より良い意思決定を支援する<br />
                仕組みをつくる
              </p>
            </div>
          </div>

          {/* ナビゲーション */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-5">Navigation</p>
            <ul className="space-y-2.5">
              {navLinks.map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="text-sm text-gray-300 hover:text-white transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* コンタクト */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-5">Contact</p>
            <div className="space-y-4">
              <div>
                <p className="text-xs text-gray-500 mb-1">所在地</p>
                <p className="text-sm text-gray-300 leading-loose">
                  〒530-0001<br />
                  大阪市北区梅田1-1-3<br />
                  大阪駅前第3ビル29階1-1-1号室
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">電話番号</p>
                <a
                  href="tel:06-7652-1304"
                  className="text-sm text-gray-300 hover:text-white transition-colors"
                >
                  06-7652-1304
                </a>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">受付時間</p>
                <p className="text-sm text-gray-300">平日 10:00〜18:00</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">メール</p>
                <a
                  href="mailto:info@dokugakulink.com"
                  className="text-sm text-gray-300 hover:text-white transition-colors"
                >
                  info@dokugakulink.com
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-6">
          <p className="text-xs text-gray-500 text-center">
            &copy; {year} dokugaku link合同会社 All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
