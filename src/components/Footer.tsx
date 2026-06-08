import Link from "next/link";

const navLinks = [
  { href: "/", label: "ホーム" },
  { href: "/business", label: "事業内容" },
  { href: "/company", label: "会社概要" },
];

const services = [
  "宅地建物取引士試験向け学習支援アプリ",
  "資格試験学習支援サービス",
  "学習データを活用した復習支援サービス",
];

export default function Footer() {
  return (
    <footer className="bg-[#0d2545] text-white">
      <div className="mx-auto max-w-6xl px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <p className="text-sm font-bold tracking-wide">独学リンク合同会社</p>
            <p className="text-[10px] tracking-widest text-gray-400 uppercase mt-0.5">
              Dokugaku Link LLC
            </p>
            <p className="text-sm text-gray-400 mt-5 leading-loose">
              〒530-0001<br />
              大阪府大阪市北区梅田1-1-3
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-4">
              Navigation
            </p>
            <ul className="space-y-2">
              {navLinks.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm text-gray-300 hover:text-white transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-4">
              Services（開発中）
            </p>
            <ul className="space-y-2">
              {services.map((s) => (
                <li key={s} className="text-sm text-gray-400 leading-snug">
                  {s}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10 mt-10 pt-6">
          <p className="text-xs text-gray-500 text-center">
            &copy; {new Date().getFullYear()} 独学リンク合同会社 All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
