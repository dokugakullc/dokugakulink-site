"use client";
import Link from "next/link";
import { useState } from "react";

const navLinks = [
  { href: "/", label: "ホーム" },
  { href: "/business", label: "事業内容" },
  { href: "/company", label: "会社概要" },
  { href: "/news", label: "お知らせ" },
  { href: "/contact", label: "お問い合わせ" },
];

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="border-b border-gray-200 bg-white sticky top-0 z-50">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex flex-col leading-tight" onClick={() => setOpen(false)}>
            <span className="text-base font-bold tracking-tight text-[#0d2545]">
              dokugaku link
            </span>
            <span className="text-[9px] tracking-widest text-gray-400">
              合同会社
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
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

          <button
            className="md:hidden p-2 -mr-2"
            onClick={() => setOpen(!open)}
            aria-label={open ? "メニューを閉じる" : "メニューを開く"}
          >
            <div className="w-6 space-y-1.5">
              <span
                className={`block h-0.5 bg-[#0d2545] transition-all duration-300 origin-center ${
                  open ? "rotate-45 translate-y-2" : ""
                }`}
              />
              <span
                className={`block h-0.5 bg-[#0d2545] transition-all duration-300 ${
                  open ? "opacity-0 scale-x-0" : ""
                }`}
              />
              <span
                className={`block h-0.5 bg-[#0d2545] transition-all duration-300 origin-center ${
                  open ? "-rotate-45 -translate-y-2" : ""
                }`}
              />
            </div>
          </button>
        </div>
      </div>

      {open && (
        <nav className="md:hidden border-t border-gray-100 bg-white">
          <div className="mx-auto max-w-6xl px-6">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="block py-4 text-sm text-gray-700 hover:text-[#0d2545] border-b border-gray-100 last:border-0 transition-colors"
                onClick={() => setOpen(false)}
              >
                {label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
