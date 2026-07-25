"use client";
import { trackCtaClicked } from "@/lib/track";
import { resolveVariant, isAbSource } from "@/lib/ab";

// 事前登録 CTA。クリックで waitlist_cta_clicked を計測し、登録フォーム(#register)へ誘導する。
export default function CtaLink({
  source,
  location,
  className,
  children,
}: {
  source: string;
  location: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href="#register"
      className={className}
      onClick={() =>
        trackCtaClicked(
          isAbSource(source)
            ? { source, location, variant: resolveVariant() }
            : { source, location }
        )
      }
    >
      {children}
    </a>
  );
}
