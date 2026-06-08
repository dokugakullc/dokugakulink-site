import Link from "next/link";

const navLinks = [
  { href: "/", label: "ホーム" },
  { href: "/business", label: "事業内容" },
  { href: "/company", label: "会社概要" },
  { href: "/contact", label: "お問い合わせ" },
];

export default function Header() {
  return (
    <header className="border-b border-gray-200 bg-white sticky top-0 z-50">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex flex-col leading-tight">
            <span className="text-sm font-bold tracking-wide text-[#0d2545]">
              独学リンク合同会社
            </span>
            <span className="text-[10px] tracking-widest text-gray-400 uppercase">
              Dokugaku Link LLC
            </span>
          </Link>
          <nav className="flex items-center gap-6">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="text-sm text-gray-600 hover:text-[#0d2545] transition-colors"
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
