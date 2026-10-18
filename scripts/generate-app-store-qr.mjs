// App Store（ウカレル）への QR コードを静的 SVG として生成する。
// LP の PC 表示で使う（スマホ表示では出さない）。URL を変えたら再実行する。
//   node scripts/generate-app-store-qr.mjs
import { writeFile } from "node:fs/promises";
import QRCode from "qrcode";
import { APP_STORE_URL } from "../src/lib/appStore.ts";

const outFile = "public/qr/app-store-ukareru.svg";

const svg = await QRCode.toString(APP_STORE_URL, {
  type: "svg",
  errorCorrectionLevel: "M",
  margin: 2,
  color: { dark: "#0d2545", light: "#ffffff" },
});

await writeFile(outFile, svg);
console.log(`${outFile} ← ${APP_STORE_URL}`);
