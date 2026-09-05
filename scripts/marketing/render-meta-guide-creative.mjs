import sharp from "sharp";

const width = 1080;
const height = 1350;
const guidePath = "public/guide/ukareru-15q-guide-preview.png";
const outputPath =
  "assets/marketing/meta-ads/creatives/2026-08_appstore_launch/ad_waitlist_guide_benefit-4x5.png";

const guide = await sharp(guidePath)
  .resize({ width: 390 })
  .png()
  .toBuffer();

const background = Buffer.from(`
<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#07162f"/>
      <stop offset="1" stop-color="#123d66"/>
    </linearGradient>
    <filter id="shadow" x="-30%" y="-30%" width="160%" height="160%">
      <feDropShadow dx="0" dy="20" stdDeviation="20" flood-color="#020b18" flood-opacity="0.45"/>
    </filter>
  </defs>
  <rect width="1080" height="1350" fill="url(#bg)"/>
  <circle cx="1000" cy="100" r="310" fill="#2e79b7" opacity="0.18"/>
  <circle cx="65" cy="1270" r="270" fill="#00a9a4" opacity="0.12"/>

  <text x="72" y="95" fill="#c7e7ff" font-family="Hiragino Sans, Noto Sans JP, sans-serif" font-size="34" font-weight="700">宅建独学の事前登録特典</text>
  <rect x="72" y="129" width="194" height="62" rx="31" fill="#ffdc63"/>
  <text x="169" y="172" text-anchor="middle" fill="#14243b" font-family="Hiragino Sans, Noto Sans JP, sans-serif" font-size="34" font-weight="800">無料</text>

  <text x="72" y="282" fill="#ffffff" font-family="Hiragino Sans, Noto Sans JP, sans-serif" font-size="72" font-weight="900">今日いつ、何問やるかが</text>
  <text x="72" y="372" fill="#ffffff" font-family="Hiragino Sans, Noto Sans JP, sans-serif" font-size="72" font-weight="900">決まる。</text>
  <text x="72" y="436" fill="#a9cbe7" font-family="Hiragino Sans, Noto Sans JP, sans-serif" font-size="35" font-weight="600">宅建独学・15問活用ガイド｜PDF 2ページ</text>

  <g filter="url(#shadow)">
    <rect x="615" y="500" width="405" height="575" rx="24" fill="#ffffff"/>
  </g>

  <g font-family="Hiragino Sans, Noto Sans JP, sans-serif">
    <rect x="72" y="531" width="480" height="104" rx="22" fill="#ffffff" opacity="0.09"/>
    <circle cx="117" cy="583" r="13" fill="#51d1c8"/>
    <text x="150" y="595" fill="#ffffff" font-size="36" font-weight="700">学習時間の決め方</text>

    <rect x="72" y="655" width="480" height="104" rx="22" fill="#ffffff" opacity="0.09"/>
    <circle cx="117" cy="707" r="13" fill="#51d1c8"/>
    <text x="150" y="719" fill="#ffffff" font-size="36" font-weight="700">1行で終わる記録</text>

    <rect x="72" y="779" width="480" height="104" rx="22" fill="#ffffff" opacity="0.09"/>
    <circle cx="117" cy="831" r="13" fill="#51d1c8"/>
    <text x="150" y="843" fill="#ffffff" font-size="36" font-weight="700">間違いの復習ルール</text>

    <rect x="72" y="903" width="480" height="104" rx="22" fill="#ffffff" opacity="0.09"/>
    <circle cx="117" cy="955" r="13" fill="#51d1c8"/>
    <text x="150" y="967" fill="#ffffff" font-size="36" font-weight="700">1週間の組み立て例</text>
  </g>

  <rect x="72" y="1131" width="936" height="122" rx="61" fill="#ffdc63"/>
  <text x="540" y="1208" text-anchor="middle" fill="#14243b" font-family="Hiragino Sans, Noto Sans JP, sans-serif" font-size="43" font-weight="900">メールだけで、すぐ受け取る</text>
  <text x="540" y="1307" text-anchor="middle" fill="#a9cbe7" font-family="Hiragino Sans, Noto Sans JP, sans-serif" font-size="27" font-weight="600">ウカレル｜App Store公開時もお知らせ</text>
</svg>`);

await sharp(background)
  .composite([{ input: guide, left: 623, top: 508 }])
  .png({ compressionLevel: 9 })
  .toFile(outputPath);

console.log(outputPath);
