"use client";

import { APP_STORE_URL } from "@/lib/appStore";
import { trackAppStoreCtaClicked } from "@/lib/track";

export default function AppStoreCta({
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
      href={APP_STORE_URL}
      className={className}
      target="_blank"
      rel="noopener"
      onClick={() => trackAppStoreCtaClicked({ source, location })}
    >
      {children}
    </a>
  );
}
