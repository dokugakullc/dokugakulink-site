"use client";
import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { trackCtaClicked } from "@/lib/track";
import { resolveVariant } from "@/lib/ab";
import AppStoreCta from "@/components/AppStoreCta";

const navLinks = [
  { href: "/", label: "ホーム" },
  { href: "/business", label: "事業内容" },
  { href: "/services/takken", label: "ウカレル" },
  { href: "/company", label: "会社概要" },
  { href: "/news", label: "お知らせ" },
  { href: "/contact", label: "お問い合わせ" },
];

export default function Header({ ukareruReleased = false }: { ukareruReleased?: boolean }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  // 広告LP（Meta広告の正本遷移先）。回遊導線を排し、登録一点に集中させる。
  const isAdLP = pathname === "/landing/takken";
  // サイト内のウカレル紹介ページ。ヘッダーCTAは出すが会社ナビは維持する。
  const isServiceLP = pathname === "/services/takken";

  // 広告LP専用の最小ヘッダー: ブランド表示（サイトへは戻さない）＋単一CTAのみ。
  if (isAdLP) {
    return (
      <header className="border-b border-gray-200 bg-white sticky top-0 z-50">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <div className="flex h-14 sm:h-16 items-center justify-between">
            {/* ブランド（信頼のため表示するが、離脱を生まないよう非遷移） */}
            <span className="flex flex-col leading-tight select-none">
              <span className="text-sm sm:text-base font-bold tracking-tight text-[#0d2545]">
                ウカレル
              </span>
              <span className="text-[9px] tracking-widest text-gray-400">
                dokugaku link
              </span>
            </span>
            {ukareruReleased ? (
              <AppStoreCta
                source="landing_takken"
                location="header"
                className="px-4 sm:px-5 py-2 sm:py-2.5 bg-[#007AFF] text-white text-[13px] sm:text-sm font-bold rounded-full hover:bg-[#0055CC] transition-colors whitespace-nowrap"
              >
                App Storeで始める
              </AppStoreCta>
            ) : (
              <a
                href="#register"
                onClick={() =>
                  trackCtaClicked({ source: "landing_takken", location: "header", variant: resolveVariant() })
                }
                className="px-4 sm:px-5 py-2 sm:py-2.5 bg-[#007AFF] text-white text-[13px] sm:text-sm font-bold rounded-full hover:bg-[#0055CC] transition-colors whitespace-nowrap"
              >
                無料ガイドを受け取る
              </a>
            )}
          </div>
        </div>
      </header>
    );
  }

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

          <div className="hidden md:flex items-center gap-6">
            <nav className="flex items-center gap-8">
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
            {isServiceLP && (ukareruReleased ? (
              <AppStoreCta
                source="services_takken"
                location="header"
                className="px-5 py-2.5 bg-[#007AFF] text-white text-sm font-bold rounded-full hover:bg-[#0055CC] transition-colors whitespace-nowrap"
              >
                App Storeで始める
              </AppStoreCta>
            ) : (
              <a href="#register" className="px-5 py-2.5 bg-[#007AFF] text-white text-sm font-bold rounded-full hover:bg-[#0055CC] transition-colors whitespace-nowrap">
                無料ガイドを受け取る
              </a>
            ))}
          </div>

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
