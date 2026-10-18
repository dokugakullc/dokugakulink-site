export type NewsTag = { label: string; active: boolean };

export type NewsItem = {
  slug: string;
  /** 公開日。`YYYY-MM-DD`（日まで分かる場合）または `YYYY-MM`（月まで）。並べ替えはこの値で行う。 */
  date: string;
  category: string;
  title: string;
  summary: string;
  body: string[];
  /** 公開前（事前登録期）のタグ。 */
  tag: string | null;
  /** ウカレル配信開始後のタグ。未指定なら配信後はタグを出さない（過去記事の「受付中」等を残さない）。 */
  releasedTag?: string | null;
  /** true の記事はウカレル配信開始後にだけ公開する。 */
  releasedOnly?: boolean;
  /** true の記事は本文の下に App Store への CTA を出す（配信開始後のみ）。 */
  appStoreCta?: boolean;
  /** 本文の下に出す外部サイトへのリンク。 */
  externalLink?: { href: string; label: string };
};

const items: NewsItem[] = [
  {
    slug: "inkan-service-launch",
    date: "2026-10-17",
    category: "サービス",
    title: "電子印鑑を3秒で作れるWebサービス「電子印鑑作るさん」を公開しました",
    summary:
      "丸印・角印・日付印の電子印鑑（背景が透明なPNG画像）を、ブラウザだけで無料で作れるWebサービス「電子印鑑作るさん」を公開しました。",
    body: [
      "ブラウザで電子印鑑を作れるWebサービス「電子印鑑作るさん」（https://inkan.dokugakulink.com/）を公開しました。",
      "丸印・角印・日付印から選び、書体・色・大きさ・質感を整えて、背景が透明なPNG画像として保存できます。会員登録は不要で、無料・商用利用もできます。",
      "入力した名前は、お使いのスマホ・パソコンの中だけで印影にします。インターネットに送ったり、どこかに保存したりすることはありません。",
      "なお、作成した画像に法的な効力はありません。",
    ],
    tag: "公開中",
    releasedTag: "公開中",
    externalLink: { href: "https://inkan.dokugakulink.com/", label: "電子印鑑作るさんを開く" },
  },
  {
    slug: "ukareru-app-store-release",
    // 配信開始日は Owner 確認済み（2026-10-18）。
    date: "2026-09-20",
    category: "サービス",
    title: "宅建士学習アプリ「ウカレル」をApp Storeで配信開始しました",
    summary:
      "働きながら独学で宅建合格を目指す人のための宅建士学習アプリ「ウカレル」をApp Storeで配信開始しました。ダウンロードは無料です。",
    body: [
      "宅建試験の独学者に向けた宅建士学習アプリ「ウカレル」を、App Store（iPhone）で配信開始しました。",
      "ウカレルは「今日やることは、15問だけ。」をコンセプトに、毎日の学習を続けやすくするアプリです。2026年度の法改正に対応した913問を収録し、今日の15問、一問一答、間違えた問題の復習、苦手分野の確認、学習履歴の振り返りを1つのアプリで行えます。十分な回答データがたまった後は、学習状況をもとに合格可能性の目安も表示します（合格を保証するものではありません）。",
      "ダウンロードは無料です。登録から30日間はすべての機能を無料で利用でき、無料期間の終了だけで自動課金されることはありません。30日を過ぎても、今日の15問と学習履歴の閲覧は無料で続けられます。プレミアムプラン（月額580円・税込）は、ご希望の場合のみApp内課金で任意に加入いただけます。",
      "アプリに関するお問い合わせは、お問い合わせページからご連絡ください。",
    ],
    tag: null,
    releasedTag: "配信中",
    releasedOnly: true,
    appStoreCta: true,
  },
  {
    slug: "beta-registration-open",
    date: "2026-06",
    category: "お知らせ",
    title: "宅建独学支援アプリ「ウカレル」事前登録を開始しました",
    summary: "ウカレルの事前登録受付を開始しました。リリース時に、登録いただいた方へご案内します。",
    body: [
      "宅建独学支援アプリ「ウカレル」の事前登録受付を開始しました。",
      "リリースに向けて開発を進めています。事前登録いただいた方へ、App Store 公開時にご案内します。",
      "ウカレルは、記憶定着の考え方として知られる間隔反復学習を参考に、復習タイミングを自動で提案する宅建独学支援アプリです。",
    ],
    tag: "事前登録受付中",
    releasedTag: "受付終了",
  },
  {
    slug: "company-established",
    date: "2025-10",
    category: "会社情報",
    title: "dokugaku link合同会社を設立しました",
    summary: "2025年10月27日、dokugaku link合同会社を設立しました。資格取得支援事業とウェルスコンサルティング事業の2軸で事業を開始します。",
    body: [
      "2025年10月27日、dokugaku link合同会社を設立しました。",
      "資格取得支援事業とウェルスコンサルティング事業の2軸で事業を開始します。資格取得支援事業では、宅建をはじめとする資格の独学支援アプリ「ウカレル」の開発を進めています。",
      "ウェルスコンサルティング事業では、金融商品や不動産の販売を目的とせず、独立した立場から資産形成・不動産の調査、分析、比較を行います。",
    ],
    tag: null,
  },
  {
    slug: "takken-app-development-start",
    date: "2026-06",
    category: "開発進捗",
    title: "宅建独学支援アプリ「ウカレル」開発を開始",
    summary: "問題データベースの構築と学習体験の設計を開始しました。間隔反復学習を参考にした復習の仕組みを中心に開発を進めています。",
    body: [
      "問題データベースの構築と学習体験の設計を開始しました。記憶定着の考え方として知られる間隔反復学習を参考にした復習の仕組みと、継続学習を支援するUX設計を中心に開発を進めています。",
      "宅建試験の4分野（権利関係・法令上の制限・宅建業法・税その他）に対応した問題データベースの構築に取り組んでいます。単なる問題集ではなく、記憶定着の考え方として知られる間隔反復学習を参考に、復習タイミングを最適化することを重視しています。",
      "あわせて、学習継続を支援するアプリ体験の設計も進めており、モバイルファーストのUI/UX設計で「隙間時間でも学べる」環境の実現を目指しています。",
    ],
    tag: "開発中",
  },
  {
    slug: "corporate-site-launch",
    date: "2026-05",
    category: "会社情報",
    title: "コーポレートサイトを公開しました",
    summary: "dokugaku link合同会社の公式コーポレートサイトを公開しました。資格取得支援事業とウェルスコンサルティング事業の2軸で活動を開始しています。",
    body: [
      "dokugaku link合同会社の公式コーポレートサイトを公開しました。資格取得支援事業とウェルスコンサルティング事業の2軸で活動を開始しています。",
      "資格取得支援事業では、宅建・FP・行政書士・簿記など、キャリア形成に直結する資格の独学支援サービス「ウカレル」の開発を進めています。ウェルスコンサルティング事業では、資産家・地主・事業オーナーの意思決定を独立した立場で支援しています。",
      "今後も活動状況・開発進捗を随時このサイトでお知らせしていきます。",
    ],
    tag: null,
  },
];

/** `YYYY-MM-DD` → 「2026年9月20日」、`YYYY-MM` → 「2026年6月」。 */
export function formatNewsDate(date: string): string {
  const m = /^(\d{4})-(\d{2})(?:-(\d{2}))?$/.exec(date);
  if (!m) throw new Error(`invalid news date: ${date}`);
  const [, y, mo, d] = m;
  return d ? `${y}年${Number(mo)}月${Number(d)}日` : `${y}年${Number(mo)}月`;
}

/** 表示用タグ。配信開始後は過去の「受付中」「開発中」を出さない。 */
export function newsTag(item: NewsItem, released: boolean): NewsTag | null {
  if (!released) return item.tag ? { label: item.tag, active: true } : null;
  const label = item.releasedTag ?? null;
  if (!label) return null;
  return { label, active: label === "配信中" || label === "公開中" };
}

/** 公開状態に応じた記事一覧（日付の新しい順。同じ日付は定義順を保つ）。 */
export function getNewsItems(released: boolean): NewsItem[] {
  return items
    .filter((item) => released || !item.releasedOnly)
    .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
}
