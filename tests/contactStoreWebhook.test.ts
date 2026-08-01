// docs/gas/contact-store-webhook.gs を実 GAS へ接続せず Node vm 上で検証する。
// PropertiesService / LockService / SpreadsheetApp / ContentService / Utilities をフェイク化し、
// 認証・入力検証・冪等（submission_id）・ロックのふるまいを固定する。実 GAS URL へ fetch しない。
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";

const GAS_SRC = readFileSync(new URL("../docs/gas/contact-store-webhook.gs", import.meta.url), "utf8");
const SECRET = "SECRET_DUMMY_contact_xxxxxxxx";

type Cell = string | number | boolean;

function makeSheet() {
  const rows: Cell[][] = [];
  return {
    getLastRow: () => rows.length,
    getLastColumn: () => rows.reduce((m, r) => Math.max(m, r.length), 0),
    getRange(r: number, c: number, nr = 1, nc = 1) {
      return {
        getValues(): Cell[][] {
          const out: Cell[][] = [];
          for (let i = 0; i < nr; i++) {
            const src = rows[r - 1 + i] ?? [];
            const row: Cell[] = [];
            for (let j = 0; j < nc; j++) row.push(src[c - 1 + j] ?? "");
            out.push(row);
          }
          return out;
        },
        setValue(v: Cell) {
          if (!rows[r - 1]) rows[r - 1] = [];
          rows[r - 1][c - 1] = v;
        },
        setValues(vals: Cell[][]) {
          for (let i = 0; i < vals.length; i++) {
            if (!rows[r - 1 + i]) rows[r - 1 + i] = [];
            for (let j = 0; j < vals[i].length; j++) rows[r - 1 + i][c - 1 + j] = vals[i][j];
          }
        },
      };
    },
    appendRow(row: Cell[]) {
      rows.push(row.slice());
    },
    setFrozenRows() {},
    _rows: () => rows,
  };
}

type Sheet = ReturnType<typeof makeSheet>;

type RunOpts = {
  props?: Record<string, string> | null;
  input?: Record<string, unknown>;
  rawContents?: string;
  sheet?: Sheet;
  failLock?: boolean;
  appendThrows?: boolean;
};

function run(opts: RunOpts) {
  const props: Record<string, string> = opts.props ?? {
    CONTACT_STORE_SHARED_SECRET: SECRET,
    CONTACT_STORE_SHEET_ID: "sheet-1",
  };
  const sheet = opts.sheet ?? makeSheet();
  if (opts.appendThrows) {
    sheet.appendRow = () => {
      throw new Error("append boom");
    };
  }
  const lockTrace = { acquired: 0, released: 0 };
  let uuid = 0;
  const sandbox: Record<string, unknown> = {
    console,
    PropertiesService: {
      getScriptProperties: () => ({ getProperty: (k: string) => (k in props ? props[k] : null) }),
    },
    LockService: {
      getScriptLock: () => ({
        waitLock: () => {
          if (opts.failLock) throw new Error("Could not obtain lock");
          lockTrace.acquired++;
        },
        releaseLock: () => {
          lockTrace.released++;
        },
      }),
    },
    SpreadsheetApp: {
      openById: () => ({ getSheetByName: () => sheet, insertSheet: () => sheet }),
    },
    Utilities: {
      getUuid: () => `uuid-${++uuid}`,
      formatDate: () => "2026-08-01T09:00:00+09:00",
    },
    ContentService: {
      createTextOutput: (s: string) => ({
        _t: s,
        setMimeType() {
          return this;
        },
        getContent() {
          return this._t;
        },
      }),
      MimeType: { JSON: "application/json" },
    },
  };
  const context = vm.createContext(sandbox);
  vm.runInContext(GAS_SRC, context);
  const doPost = (sandbox as { doPost: (e: unknown) => { getContent(): string } }).doPost;
  const contents = opts.rawContents !== undefined ? opts.rawContents : JSON.stringify(opts.input ?? {});
  const out = doPost({ postData: { contents } });
  const response = JSON.parse(out.getContent()) as {
    success: boolean;
    stored?: boolean;
    duplicate?: boolean;
    error?: string;
  };
  const rows = sheet._rows();
  const header = (rows[0] as string[]) ?? [];
  const dataRows = rows.slice(1);
  const cell = (rowIdx: number, headerName: string): Cell => {
    const i = header.indexOf(headerName);
    return i === -1 ? "" : (dataRows[rowIdx]?.[i] ?? "");
  };
  return { response, dataRows, header, cell, lockTrace, sheet };
}

const validInput = (over: Record<string, unknown> = {}) => ({
  token: SECRET,
  email: "taro@example.com",
  name: "山田 太郎",
  submission_id: "abcd1234efgh",
  contact_type: "service",
  message: "本文です",
  source: "web_contact",
  ...over,
});

// ── 認証 ─────────────────────────────────────────────────────────
test("SHARED_SECRET 未設定 → unauthorized・保存0", () => {
  const r = run({ props: { CONTACT_STORE_SHEET_ID: "s" }, input: validInput() });
  assert.equal(r.response.success, false);
  assert.equal(r.response.error, "unauthorized");
  assert.equal(r.dataRows.length, 0);
});

test("token 未設定 → unauthorized・保存0", () => {
  const r = run({ input: validInput({ token: undefined }) });
  assert.equal(r.response.error, "unauthorized");
  assert.equal(r.dataRows.length, 0);
});

test("token 不一致 → unauthorized・保存0", () => {
  const r = run({ input: validInput({ token: "WRONG" }) });
  assert.equal(r.response.error, "unauthorized");
  assert.equal(r.dataRows.length, 0);
});

test("token 一致 → 処理継続（新規保存・success/stored）", () => {
  const r = run({ input: validInput() });
  assert.equal(r.response.success, true);
  assert.equal(r.response.stored, true);
  assert.equal(r.response.duplicate, false);
  assert.equal(r.dataRows.length, 1);
});

test("token をシートへ保存しない・応答へ Secret を含めない", () => {
  const r = run({ input: validInput() });
  const flat = JSON.stringify(r.dataRows);
  assert.equal(flat.includes(SECRET), false, "sheet must not contain the secret");
  assert.equal(r.header.includes("token"), false);
  assert.equal(JSON.stringify(r.response).includes(SECRET), false);
});

// ── 入力検証 ─────────────────────────────────────────────────────
test("不正 JSON → bad_json・保存0", () => {
  const r = run({ rawContents: "not-json" });
  assert.equal(r.response.error, "bad_json");
  assert.equal(r.dataRows.length, 0);
});

test("email 欠落/不正 → invalid_email・保存0", () => {
  assert.equal(run({ input: validInput({ email: "" }) }).response.error, "invalid_email");
  assert.equal(run({ input: validInput({ email: "bad" }) }).response.error, "invalid_email");
  assert.equal(run({ input: validInput({ email: "bad" }) }).dataRows.length, 0);
});

test("name 欠落 → missing_name・保存0", () => {
  const r = run({ input: validInput({ name: "   " }) });
  assert.equal(r.response.error, "missing_name");
  assert.equal(r.dataRows.length, 0);
});

test("submission_id 欠落 → missing_submission_id・保存0（冪等キー必須）", () => {
  const r = run({ input: validInput({ submission_id: "" }) });
  assert.equal(r.response.error, "missing_submission_id");
  assert.equal(r.dataRows.length, 0);
});

test("email を trim+lowercase 正規化して保存", () => {
  const r = run({ input: validInput({ email: "  Taro@Example.COM  " }) });
  assert.equal(r.response.success, true);
  assert.equal(r.cell(0, "email"), "taro@example.com");
});

test("長すぎる値を制限（message 5000 / user_agent 300 / company 120）", () => {
  const r = run({
    input: validInput({ message: "m".repeat(6000), userAgent: "u".repeat(500), company: "c".repeat(200) }),
  });
  assert.equal(String(r.cell(0, "message")).length, 5000);
  assert.equal(String(r.cell(0, "user_agent")).length, 300);
  assert.equal(String(r.cell(0, "company")).length, 120);
});

test("CR/LF/tab は空白へ置換（clip_）", () => {
  const r = run({ input: validInput({ name: "山田\n太郎", message: "1行目\r\n2行目\tタブ" }) });
  assert.equal(r.cell(0, "name"), "山田 太郎");
  assert.equal(String(r.cell(0, "message")).includes("\n"), false);
  assert.equal(String(r.cell(0, "message")).includes("\t"), false);
});

test("attribution 列が保存される", () => {
  const r = run({
    input: validInput({
      utm_source: "meta",
      utm_content: "ad_b",
      fbclid: "fbc",
      landing_url: "/contact",
      referrer: "https://x",
    }),
  });
  assert.equal(r.cell(0, "utm_source"), "meta");
  assert.equal(r.cell(0, "utm_content"), "ad_b");
  assert.equal(r.cell(0, "fbclid"), "fbc");
  assert.equal(r.cell(0, "landing_url"), "/contact");
  assert.equal(r.cell(0, "referrer"), "https://x");
});

test("ヘッダーにない任意キーは保存しない（列非対応キーは無視）", () => {
  const r = run({ input: validInput({ evil: "EVILVAL", is_admin: "true" }) });
  assert.equal(r.response.success, true);
  assert.equal(r.header.includes("evil"), false);
  assert.equal(JSON.stringify(r.dataRows).includes("EVILVAL"), false);
});

test("source は本文値を保存（Next 側で web_contact 固定・GAS は信頼）", () => {
  const r = run({ input: validInput({ source: "web_contact" }) });
  assert.equal(r.cell(0, "source"), "web_contact");
});

test("contact_type は GAS では拒否せず clip して保存（allowlist は Next 側 validateContactInput）", () => {
  // GAS は種別の許可リスト検証を行わない。値の妥当性は Next 側で担保される。
  const r = run({ input: validInput({ contact_type: "x".repeat(60) }) });
  assert.equal(r.response.success, true);
  assert.equal(String(r.cell(0, "contact_type")).length, 40); // clip 40
});

// ── 冪等性 ───────────────────────────────────────────────────────
test("初回 submission_id → 1行保存（stored:true・duplicate:false）", () => {
  const r = run({ input: validInput({ submission_id: "id-0001" }) });
  assert.equal(r.dataRows.length, 1);
  assert.equal(r.response.stored, true);
  assert.equal(r.response.duplicate, false);
});

test("同一 submission_id 再送 → 新しい行を追加しない（stored:false・duplicate:true）", () => {
  const sheet = makeSheet();
  const r1 = run({ input: validInput({ submission_id: "id-dup", email: "a@b.co" }), sheet });
  const r2 = run({ input: validInput({ submission_id: "id-dup", email: "a@b.co" }), sheet });
  assert.equal(r1.response.stored, true);
  assert.equal(r2.response.stored, false);
  assert.equal(r2.response.duplicate, true);
  assert.equal(r2.dataRows.length, 1); // 1行のまま（timeout 後の再送でも二重保存しない）
});

test("別 submission_id は別問い合わせとして別行（email 重複でも除外しない）", () => {
  const sheet = makeSheet();
  run({ input: validInput({ submission_id: "id-A", email: "same@b.co" }), sheet });
  const r2 = run({ input: validInput({ submission_id: "id-B", email: "same@b.co" }), sheet });
  assert.equal(r2.response.stored, true);
  assert.equal(r2.dataRows.length, 2);
});

// ── ロック ───────────────────────────────────────────────────────
test("正常・重複・例外の全経路で lock を解放する", () => {
  const ok = run({ input: validInput() });
  assert.equal(ok.lockTrace.acquired, 1);
  assert.equal(ok.lockTrace.released, 1);

  const sheet = makeSheet();
  run({ input: validInput({ submission_id: "id-x" }), sheet });
  const dup = run({ input: validInput({ submission_id: "id-x" }), sheet });
  assert.equal(dup.lockTrace.acquired, 1);
  assert.equal(dup.lockTrace.released, 1);

  const ex = run({ input: validInput(), appendThrows: true });
  assert.equal(ex.response.error, "internal_error");
  assert.equal(ex.lockTrace.released, 1);
});

test("lock 取得失敗 → 保存0・internal_error・内部情報を応答へ出さない", () => {
  const r = run({ input: validInput(), failLock: true });
  assert.equal(r.dataRows.length, 0);
  assert.equal(r.response.success, false);
  assert.equal(r.response.error, "internal_error");
  assert.equal(JSON.stringify(r.response).includes("obtain lock"), false);
});

test("append 例外時に内部例外メッセージを応答へ出さない", () => {
  const r = run({ input: validInput(), appendThrows: true });
  assert.equal(r.response.error, "internal_error");
  assert.equal(JSON.stringify(r.response).includes("append boom"), false);
});
