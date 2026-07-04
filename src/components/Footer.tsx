import Link from "next/link";

const navLinks = [
  { href: "/", label: "ホーム" },
  { href: "/business", label: "事業内容" },
  { href: "/services/takken", label: "ウカレル" },
  { href: "/company", label: "会社概要" },
  { href: "/news", label: "お知らせ" },
  { href: "/contact", label: "お問い合わせ" },
  { href: "/privacy", label: "プライバシーポリシー" },
  { href: "/legal/tokushoho", label: "特定商取引法に基づく表記" },
];

export default function Footer() {
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
                  href="tel:0676521304"
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
            &copy; {new Date().getFullYear()} dokugaku link合同会社 All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
