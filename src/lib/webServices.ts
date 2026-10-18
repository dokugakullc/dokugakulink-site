// 当社が公開している Web サービス（コーポレートサイト各ページで共通利用）。
// 文言は公開サイト（inkan.dokugakulink.com）に既にある表現だけを使う。
export const INKAN_SERVICE = {
  name: "電子印鑑作るさん",
  url: "https://inkan.dokugakulink.com/",
  tagline: "ブラウザで電子印鑑を3秒で作るサービス",
  description:
    "丸印・角印・日付印の電子印鑑（背景が透明なPNG画像）を、ブラウザだけで作れるWebサービスです。入力した名前はお使いのスマホ・パソコンの中だけで印影にし、インターネットへ送信・保存しません。",
  features: ["無料・商用利用OK", "会員登録なし", "名前を送信しない", "背景が透明なPNG"],
} as const;
