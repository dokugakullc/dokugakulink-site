/** Previewでは公開後LPを確認し、本番はOwnerの手動リリースまで事前登録を維持する。 */
export function isUkareruReleased(): boolean {
  const explicit = process.env.NEXT_PUBLIC_UKARERU_RELEASED;
  if (explicit === "1") return true;
  if (explicit === "0") return false;
  return process.env.VERCEL_ENV === "preview";
}
