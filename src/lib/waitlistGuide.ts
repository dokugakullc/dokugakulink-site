// 事前登録の即時特典「宅建独学・15問活用ガイド」の配布設定。
//
// 配布方式: public/ 配下の静的PDFを、推測困難なファイル名で公開する。
// 個人情報を扱わないため、アクセス制御（署名付きURL・ログイン等）は設けない。
// 差し替える場合は PDF を新しいトークン名で置き、ここのパスを更新する
// （既存URLを踏んだ人が404にならないよう、旧ファイルはしばらく残す）。
export const WAITLIST_GUIDE_PATH =
  "/guide/ukareru-15q-guide-c818e5e965a28f1302bc.pdf";

/** 特典の正式名称。LP・完了画面・文書で表記を揃えるため一箇所に置く。 */
export const WAITLIST_GUIDE_TITLE = "宅建独学・15問活用ガイド";

/** ダウンロード時のファイル名（内部トークンをユーザーに見せない）。 */
export const WAITLIST_GUIDE_FILENAME = "ウカレル_宅建独学15問活用ガイド.pdf";
