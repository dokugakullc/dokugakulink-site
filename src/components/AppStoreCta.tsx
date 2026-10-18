"use client";

import { appStoreCampaignUrl } from "@/lib/appStore";
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
      // ct = 置き場所（例: landing_takken-hero）。App Store Connect の流入元で比較できるようにする。
      href={appStoreCampaignUrl(`${source}-${location}`)}
      className={className}
      target="_blank"
      rel="noopener"
      onClick={() => trackAppStoreCtaClicked({ source, location })}
    >
      {children}
    </a>
  );
}
