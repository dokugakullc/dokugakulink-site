import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = process.cwd();
const outDir = path.join(root, "assets/marketing/meta-ads/creatives/2026-08");
await fs.mkdir(outDir, { recursive: true });

const W = 1080;
const H = 1350;
const blue = "#1478F2";
const navy = "#102A4C";

function escapeXml(value) {
  return value.replace(/[&<>"']/g, (ch) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;",
  })[ch]);
}

function textSvg(spec) {
  const titleLines = spec.title.map((line, i) =>
    `<text x="74" y="${268 + i * 78}" font-size="66" font-weight="700" fill="${spec.accentLines.includes(i) ? blue : navy}">${escapeXml(line)}</text>`,
  ).join("");
  const supportTop = 468 + Math.max(0, spec.title.length - 2) * 76;
  const supportLines = spec.support.map((line, i) =>
    `<text x="76" y="${supportTop + i * 43}" font-size="30" font-weight="500" fill="#425B78">${escapeXml(line)}</text>`,
  ).join("");
  return Buffer.from(`
    <svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#F8FBFF"/><stop offset="1" stop-color="#EAF3FF"/>
        </linearGradient>
        <filter id="shadow" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="18" stdDeviation="22" flood-color="#16385F" flood-opacity="0.18"/>
        </filter>
      </defs>
      <rect width="1080" height="1350" fill="url(#bg)"/>
      <circle cx="990" cy="100" r="210" fill="#DCEBFF" opacity="0.72"/>
      <circle cx="110" cy="1250" r="260" fill="#DCEBFF" opacity="0.65"/>
      <rect x="64" y="62" width="175" height="60" rx="30" fill="#E4F0FF"/>
      <text x="151" y="102" text-anchor="middle" font-size="31" font-weight="700" fill="${navy}">ウカレル</text>
      <text x="74" y="196" font-size="28" font-weight="600" fill="#54708F">宅建を独学で学ぶ社会人へ</text>
      ${titleLines}
      ${supportLines}
      <g filter="url(#shadow)">
        <rect x="74" y="1138" width="420" height="92" rx="46" fill="${blue}"/>
      </g>
      <text x="284" y="1197" text-anchor="middle" font-size="34" font-weight="700" fill="white">無料で事前登録</text>
      <text x="76" y="1278" font-size="24" font-weight="500" fill="#607994">App Store公開時にお知らせ</text>
      <text x="1004" y="1292" text-anchor="end" font-size="22" font-weight="600" fill="#7890AA">dokugakulink.com</text>
    </svg>
  `);
}

const creatives = [
  {
    id: "h1_current_position_a",
    title: ["独学でも、", "合格までの", "「現在地」が", "分かる。"],
    accentLines: [1, 2, 3],
    support: ["今日やるべき学習と、", "合格までの現在地をひと目で。"],
    screenshot: "public/screenshots/ukareru/02_probability.webp",
  },
  {
    id: "h2_15_questions_a",
    title: ["今日は、", "15問だけ。"],
    accentLines: [1],
    support: ["今日の15問から。", "すきま時間でも積み重ねられる。"],
    screenshot: "public/screenshots/ukareru/01_home.webp",
  },
  {
    id: "h3_recall_timing_a",
    title: ["忘れた頃に、", "もう一度。"],
    accentLines: [1],
    support: ["解いた問題を、後日もう一度。", "復習のタイミングに迷わない。"],
    screenshot: "public/screenshots/ukareru/06_result.webp",
  },
];

for (const spec of creatives) {
  const screenshot = await sharp(path.join(root, spec.screenshot))
    .resize({ width: 510 })
    .png()
    .toBuffer();
  const phoneHeight = (await sharp(screenshot).metadata()).height ?? 1100;
  const top = Math.max(150, H - phoneHeight + 85);
  const portraitPath = path.join(outDir, `${spec.id}-4x5.png`);
  await sharp({ create: { width: W, height: H, channels: 4, background: "#F8FBFF" } })
    .composite([
      { input: textSvg(spec), left: 0, top: 0 },
      { input: screenshot, left: 550, top },
    ])
    .png({ compressionLevel: 9 })
    .toFile(portraitPath);

  const squareInner = await sharp(portraitPath).resize({ height: 1080 }).png().toBuffer();
  await sharp({ create: { width: 1080, height: 1080, channels: 4, background: "#F3F8FF" } })
    .composite([{ input: squareInner, left: 108, top: 0 }])
    .png({ compressionLevel: 9 })
    .toFile(path.join(outDir, `${spec.id}-1x1.png`));
}

console.log(`Generated ${creatives.length} creatives in ${outDir}`);
