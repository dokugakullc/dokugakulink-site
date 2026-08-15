import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = process.cwd();
const outDir = path.join(root, "assets/marketing/meta-ads/creatives/2026-08");
await fs.mkdir(outDir, { recursive: true });

const W = 1080;
const H = 1350;

function esc(value) {
  return value.replace(/[&<>"']/g, (ch) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;",
  })[ch]);
}

function layoutSvg(spec) {
  const lines = spec.title.map((line, i) =>
    `<text x="72" y="${300 + i * 92}" font-size="78" font-weight="800" fill="${spec.accentLines.includes(i) ? "#55A7FF" : "#FFFFFF"}">${esc(line)}</text>`,
  ).join("");
  return Buffer.from(`
    <svg width="1080" height="1350" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#07182D"/><stop offset="1" stop-color="#0D2B50"/>
        </linearGradient>
        <filter id="glow"><feGaussianBlur stdDeviation="55"/></filter>
        <clipPath id="screen"><rect x="572" y="445" width="500" height="780" rx="34"/></clipPath>
      </defs>
      <rect width="1080" height="1350" fill="url(#bg)"/>
      <circle cx="1040" cy="100" r="230" fill="#1478F2" opacity="0.18" filter="url(#glow)"/>
      <circle cx="70" cy="1300" r="230" fill="#1478F2" opacity="0.14" filter="url(#glow)"/>
      <text x="72" y="90" font-family="Hiragino Kaku Gothic ProN, sans-serif" font-size="34" font-weight="700" fill="#FFFFFF">ウカレル</text>
      <text x="1008" y="88" text-anchor="end" font-family="Hiragino Kaku Gothic ProN, sans-serif" font-size="23" font-weight="600" letter-spacing="2" fill="#8FB9E8">宅建 × 独学</text>
      <rect x="72" y="142" width="94" height="7" rx="4" fill="#268BFF"/>
      <g font-family="Hiragino Kaku Gothic ProN, sans-serif">${lines}</g>
      <text x="75" y="${spec.supportY}" font-family="Hiragino Kaku Gothic ProN, sans-serif" font-size="31" font-weight="500" fill="#C8D9ED">${esc(spec.support[0])}</text>
      <text x="75" y="${spec.supportY + 48}" font-family="Hiragino Kaku Gothic ProN, sans-serif" font-size="31" font-weight="500" fill="#C8D9ED">${esc(spec.support[1])}</text>
      <rect x="72" y="1162" width="390" height="82" rx="41" fill="#1478F2"/>
      <text x="267" y="1216" text-anchor="middle" font-family="Hiragino Kaku Gothic ProN, sans-serif" font-size="30" font-weight="700" fill="#FFFFFF">無料で事前登録</text>
      <text x="72" y="1292" font-family="Hiragino Kaku Gothic ProN, sans-serif" font-size="22" font-weight="500" fill="#7FA6CF">App Store 公開時にお知らせ</text>
      <path d="M486 1202h38m-11-11 11 11-11 11" fill="none" stroke="#55A7FF" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `);
}

const specs = [
  {
    id: "h1_current_position_a",
    title: ["独学、", "今どこ？"],
    accentLines: [1],
    supportY: 540,
    support: ["今日やることと、", "合格までの現在地が分かる。"],
    screenshot: "public/screenshots/ukareru/02_probability.webp",
  },
  {
    id: "h2_15_questions_a",
    title: ["今日は、", "15問だけ。"],
    accentLines: [1],
    supportY: 540,
    support: ["すきま時間から、", "宅建学習を積み重ねる。"],
    screenshot: "public/screenshots/ukareru/01_home.webp",
  },
  {
    id: "h3_recall_timing_a",
    title: ["覚えても、", "忘れる。", "だから、", "もう一度。"],
    accentLines: [2, 3],
    supportY: 710,
    support: ["解いた問題を、後日もう一度。", "復習のタイミングに迷わない。"],
    screenshot: "public/screenshots/ukareru/06_result.webp",
  },
];

for (const spec of specs) {
  const screenshot = await sharp(path.join(root, spec.screenshot))
    .resize({ width: 500 })
    .png()
    .toBuffer();
  const portraitPath = path.join(outDir, `${spec.id}-4x5.png`);
  await sharp({ create: { width: W, height: H, channels: 4, background: "#07182D" } })
    .composite([
      { input: layoutSvg(spec), left: 0, top: 0 },
      { input: screenshot, left: 572, top: 445 },
    ])
    .png({ compressionLevel: 9 })
    .toFile(portraitPath);

  const squareInner = await sharp(portraitPath).resize({ height: 1080 }).png().toBuffer();
  await sharp({ create: { width: 1080, height: 1080, channels: 4, background: "#07182D" } })
    .composite([{ input: squareInner, left: 108, top: 0 }])
    .png({ compressionLevel: 9 })
    .toFile(path.join(outDir, `${spec.id}-1x1.png`));
}

console.log(`Generated ${specs.length} creatives in ${outDir}`);
