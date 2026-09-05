import sharp from "sharp";

const outDir = "assets/marketing/meta-ads/creatives/2026-08_appstore_launch";
const font = "Hiragino Sans, Noto Sans JP, sans-serif";

const lifestyle = await sharp(`${outDir}/source_lifestyle_commute.png`)
  .resize(1080, 1350, { fit: "cover" })
  .modulate({ brightness: 0.76 })
  .png()
  .toBuffer();

const missionCard = await sharp("public/screenshots/ukareru-b17/01_home.png")
  .extract({ left: 50, top: 600, width: 1220, height: 1050 })
  .resize({ width: 410 })
  .png()
  .toBuffer();

const lifestyleOverlay = Buffer.from(`
<svg width="1080" height="1350" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="shade" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#071a35" stop-opacity=".97"/>
      <stop offset=".62" stop-color="#071a35" stop-opacity=".38"/>
      <stop offset="1" stop-color="#071a35" stop-opacity=".9"/>
    </linearGradient>
  </defs>
  <rect width="1080" height="1350" fill="url(#shade)"/>
  <rect x="64" y="58" width="430" height="62" rx="31" fill="#0877f9"/>
  <text x="279" y="101" text-anchor="middle" fill="#fff" font-family="${font}" font-size="30" font-weight="800">宅建学習アプリ｜ウカレル</text>
  <text x="64" y="228" fill="#fff" font-family="${font}" font-size="76" font-weight="900">忙しくても、</text>
  <text x="64" y="322" fill="#fff" font-family="${font}" font-size="76" font-weight="900">宅建を1日15問。</text>
  <rect x="64" y="367" width="710" height="104" rx="22" fill="#fff" fill-opacity=".95"/>
  <text x="94" y="435" fill="#092548" font-family="${font}" font-size="43" font-weight="900">開けば、今日やる問題が決まる。</text>
  <rect x="64" y="530" width="430" height="430" rx="28" fill="#fff" fill-opacity=".97"/>
  <rect x="64" y="1082" width="952" height="96" rx="18" fill="#fff" fill-opacity=".95"/>
  <text x="540" y="1144" text-anchor="middle" fill="#092548" font-family="${font}" font-size="39" font-weight="900">App Store公開前｜事前登録受付中</text>
  <rect x="64" y="1200" width="952" height="100" rx="50" fill="#ffdb58"/>
  <text x="540" y="1265" text-anchor="middle" fill="#092548" font-family="${font}" font-size="40" font-weight="900">無料ガイドを今すぐ受け取る</text>
</svg>`);

await sharp(lifestyle)
  .composite([{ input: lifestyleOverlay }, { input: missionCard, left: 74, top: 540 }])
  .png({ compressionLevel: 9 })
  .toFile(`${outDir}/ad_waitlist_problem_solution-v2-4x5.png`);

const missionCrop = await sharp("public/screenshots/ukareru-b17/01_home.png")
  .extract({ left: 50, top: 600, width: 1220, height: 1050 })
  .resize({ width: 500 })
  .png()
  .toBuffer();

const proofBackground = Buffer.from(`
<svg width="1080" height="1350" xmlns="http://www.w3.org/2000/svg">
  <defs><linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#eef5ff"/><stop offset="1" stop-color="#d6e8ff"/></linearGradient><filter id="s"><feDropShadow dx="0" dy="18" stdDeviation="20" flood-opacity=".22"/></filter></defs>
  <rect width="1080" height="1350" fill="url(#bg)"/>
  <rect x="58" y="52" width="444" height="62" rx="31" fill="#0877f9"/>
  <text x="280" y="95" text-anchor="middle" fill="#fff" font-family="${font}" font-size="30" font-weight="800">宅建学習アプリ｜ウカレル</text>
  <text x="58" y="220" fill="#092548" font-family="${font}" font-size="72" font-weight="900">宅建の復習、</text>
  <text x="58" y="310" fill="#0877f9" font-family="${font}" font-size="72" font-weight="900">もう迷わない。</text>
  <text x="58" y="375" fill="#405a75" font-family="${font}" font-size="34" font-weight="700">間違いと苦手から、今日の15問を提案。</text>
  <rect x="520" y="440" width="512" height="470" rx="36" fill="#fff" filter="url(#s)"/>
  <g font-family="${font}" font-size="36" font-weight="900">
    <rect x="58" y="510" width="400" height="112" rx="22" fill="#fff"/><circle cx="108" cy="566" r="17" fill="#0877f9"/><text x="145" y="579" fill="#092548">今日の15問</text>
    <rect x="58" y="654" width="400" height="112" rx="22" fill="#fff"/><circle cx="108" cy="710" r="17" fill="#28a276"/><text x="145" y="723" fill="#092548">苦手を分析</text>
    <rect x="58" y="798" width="400" height="112" rx="22" fill="#fff"/><circle cx="108" cy="854" r="17" fill="#ff9d1a"/><text x="145" y="867" fill="#092548">復習を優先</text>
  </g>
  <rect x="58" y="1184" width="964" height="108" rx="54" fill="#092548"/>
  <text x="540" y="1253" text-anchor="middle" fill="#fff" font-family="${font}" font-size="39" font-weight="900">公開前に無料で事前登録</text>
  <text x="540" y="1330" text-anchor="middle" fill="#526b84" font-family="${font}" font-size="26" font-weight="700">登録特典：宅建独学・15問活用ガイド</text>
</svg>`);

await sharp(proofBackground)
  .composite([{ input: missionCrop, left: 526, top: 450 }])
  .png({ compressionLevel: 9 })
  .toFile(`${outDir}/ad_waitlist_product_proof-v2-4x5.png`);

console.log("Rendered two acquisition creatives.");
