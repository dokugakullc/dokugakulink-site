// 当社が公開している無料ツール「作るさんシリーズ」（コーポレートサイト各ページで共通利用）。
// 説明文は依頼者の指示書（2026-10-20）と各ツールの公開サイトにある表現だけを使う。
// 運営者情報の方針により、ツール紹介の近くに代表者名は載せない。

export type TsukurusanTool = {
  name: string;
  url: string;
  /** 各ツールのサイトのロゴ（favicon.svg） */
  logo: string;
  description: string;
  features: readonly string[];
};

export const TSUKURUSAN_SERIES_URL = "https://inkan.dokugakulink.com/series";

export const TSUKURUSAN_TOOLS: readonly TsukurusanTool[] = [
  {
    name: "電子印鑑作るさん",
    url: "https://inkan.dokugakulink.com/",
    logo: "https://inkan.dokugakulink.com/favicon.svg",
    description: "丸印・角印・日付印の電子印鑑（透過PNG）をブラウザで作れる",
    features: ["無料・商用利用OK", "会員登録なし", "名前を送信しない"],
  },
  {
    name: "書類作るさん",
    url: "https://shorui.dokugakulink.com/",
    logo: "https://shorui.dokugakulink.com/favicon.svg",
    description: "見積書・納品書・請求書・領収書をブラウザの中で作って PDF にできる",
    features: ["無料", "登録不要"],
  },
  {
    name: "PDF作るさん",
    url: "https://pdf.dokugakulink.com/",
    logo: "https://pdf.dokugakulink.com/favicon.svg",
    description: "PDF のまとめ・並べ替え・押印などを、ファイルを送らずにブラウザの中でできる",
    features: ["無料", "ファイルを送信しない"],
  },
];
