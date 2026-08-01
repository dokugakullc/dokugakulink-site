// docs/gas/registration-webhook.gs を実 GAS へ接続せず Node vm 上で検証する。
// PropertiesService / LockService / SpreadsheetApp / ContentService / Utilities をフェイク化し、
// 認証・入力検証・重複（監査行）・ロックのふるまいを固定する。実 GAS URL へ fetch しない。
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";

const GAS_SRC = readFileSync(new URL("../docs/gas/registration-webhook.gs", import.meta.url), "utf8");
const SECRET = "SECRET_DUMMY_xxxxxxxxxxxxxxxx";

type Cell = string | number | boolean;

// 在メモリの2次元シート（1-indexed）。
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
  props?: Record<string, string> | null; // null = SHARED_SECRET 無し等を明示
  input?: Record<string, unknown>;
  rawContents?: string; // 不正 JSON テスト用
  sheet?: Sheet;
  failLock?: boolean;
  appendThrows?: boolean;
};

function run(opts: RunOpts) {
  const props: Record<string, string> = opts.props ?? { SHARED_SECRET: SECRET, SHEET_ID: "sheet-1" };
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
  const response = JSON.parse(out.getContent()) as { success: boolean; duplicated?: boolean; error?: string };
  const rows = sheet._rows();
  const header = (rows[0] as string[]) ?? [];
  const dataRows = rows.slice(1);
  const cell = (rowIdx: number, headerName: string): Cell => {
    const i = header.indexOf(headerName);
    return i === -1 ? "" : (dataRows[rowIdx]?.[i] ?? "");
  };
  return { response, dataRows, header, cell, lockTrace, sheet };
}

const validInput = (over: Record<string, unknown> = {}) => ({ token: SECRET, email: "taro@example.com", source: "landing_takken", ...over });

// ── 認証 ─────────────────────────────────────────────────────────
test("SHARED_SECRET 未設定 → unauthorized・保存0", () => {
  const r = run({ props: { SHEET_ID: "s" }, input: validInput() });
  assert.equal(r.response.success, false);
  assert.equal(r.response.error, "unauthorized");
  assert.equal(r.dataRows.length, 0);
});

test("token 未設定 → unauthorized・保存0", () => {
  const r = run({ input: { email: "a@b.co", source: "landing_takken" } });
  assert.equal(r.response.error, "unauthorized");
  assert.equal(r.dataRows.length, 0);
});

test("token 不一致 → unauthorized・保存0", () => {
  const r = run({ input: validInput({ token: "WRONG" }) });
  assert.equal(r.response.error, "unauthorized");
  assert.equal(r.dataRows.length, 0);
});

test("token 一致 → 処理継続（新規保存・success）", () => {
  const r = run({ input: validInput() });
  assert.equal(r.response.success, true);
  assert.equal(r.response.duplicated, false);
  assert.equal(r.dataRows.length, 1);
});

test("token をシートへ保存しない・応答へ Secret を含めない", () => {
  const r = run({ input: validInput() });
  // 追記行のどのセルにも Secret が無い
  const flat = JSON.stringify(r.dataRows);
  assert.equal(flat.includes(SECRET), false, "sheet must not contain the secret");
  // header に token 列が無い
  assert.equal(r.header.includes("token"), false);
  // 応答にも Secret 無し
  assert.equal(JSON.stringify(r.response).includes(SECRET), false);
});

// ── 入力検証 ─────────────────────────────────────────────────────
test("不正 JSON → bad_json・保存0", () => {
  const r = run({ rawContents: "not-json" });
  assert.equal(r.response.error, "bad_json");
  assert.equal(r.dataRows.length, 0);
});

test("email 欠落 / 不正 email → invalid_email・保存0", () => {
  assert.equal(run({ input: validInput({ email: "" }) }).response.error, "invalid_email");
  assert.equal(run({ input: validInput({ email: "bad" }) }).response.error, "invalid_email");
  assert.equal(run({ input: validInput({ email: "bad" }) }).dataRows.length, 0);
});

test("email を trim+lowercase 正規化して保存", () => {
  const r = run({ input: validInput({ email: "  Taro@Example.COM  " }) });
  assert.equal(r.response.success, true);
  assert.equal(r.cell(0, "email"), "taro@example.com");
});

test("長すぎる値を制限（user_agent 300 / email 254）", () => {
  const r = run({ input: validInput({ userAgent: "u".repeat(500) }) });
  assert.equal(String(r.cell(0, "user_agent")).length, 300);
});

test("attribution 列が正しく保存される", () => {
  const r = run({
    input: validInput({
      utm_source: "meta", utm_medium: "cpc", utm_campaign: "camp", utm_content: "ad1",
      utm_term: "kw", fbclid: "fbc", landing_url: "/landing/takken", referrer: "https://x",
    }),
  });
  assert.equal(r.cell(0, "utm_source"), "meta");
  assert.equal(r.cell(0, "fbclid"), "fbc");
  assert.equal(r.cell(0, "landing_url"), "/landing/takken");
  assert.equal(r.cell(0, "referrer"), "https://x");
});

// ── 重複（監査行仕様） ───────────────────────────────────────────
test("初回 → duplicated:false（新規行 duplicated=FALSE）", () => {
  const r = run({ input: validInput() });
  assert.equal(r.response.duplicated, false);
  assert.equal(r.cell(0, "duplicated"), "FALSE");
});

test("大文字小文字違いの再登録 → duplicated:true・監査行 duplicated=TRUE を追記", () => {
  const sheet = makeSheet();
  run({ input: validInput({ email: "a@b.co" }), sheet });
  const r2 = run({ input: validInput({ email: "A@B.CO" }), sheet });
  assert.equal(r2.response.duplicated, true);
  assert.equal(r2.dataRows.length, 2); // 監査目的で行が増える（現行仕様）
  assert.equal(r2.cell(1, "duplicated"), "TRUE"); // 2行目=重複監査行
});

test("前後空白違いの再登録 → duplicated:true", () => {
  const sheet = makeSheet();
  run({ input: validInput({ email: "a@b.co" }), sheet });
  const r2 = run({ input: validInput({ email: "  a@b.co  " }), sheet });
  assert.equal(r2.response.duplicated, true);
});

test("新規行と重複監査行を区別でき、応答とシート値が一致", () => {
  const sheet = makeSheet();
  const r1 = run({ input: validInput({ email: "x@y.co" }), sheet });
  const r2 = run({ input: validInput({ email: "x@y.co" }), sheet });
  assert.equal(r1.cell(0, "duplicated"), "FALSE");
  // r2 の 2行目が TRUE、応答も true
  assert.equal(r2.cell(1, "duplicated"), "TRUE");
  assert.equal(r2.response.duplicated, true);
});

// ── ロック ───────────────────────────────────────────────────────
test("正常・重複・例外の全経路で lock を解放する", () => {
  const ok = run({ input: validInput() });
  assert.equal(ok.lockTrace.acquired, 1);
  assert.equal(ok.lockTrace.released, 1);

  const sheet = makeSheet();
  run({ input: validInput({ email: "d@e.co" }), sheet });
  const dup = run({ input: validInput({ email: "d@e.co" }), sheet });
  assert.equal(dup.lockTrace.released, 1);

  const ex = run({ input: validInput(), appendThrows: true });
  assert.equal(ex.response.error, "internal_error");
  assert.equal(ex.lockTrace.released, 1);
});

test("lock 取得失敗時は保存しない・内部情報を応答へ出さない", () => {
  const r = run({ input: validInput(), failLock: true });
  assert.equal(r.dataRows.length, 0);
  assert.equal(r.response.success, false);
  assert.equal(r.response.error, "internal_error"); // 汎用コードのみ（詳細/例外メッセージ非出力）
  assert.equal(r.lockTrace.released, 1);
});

test("例外時に内部情報（例外メッセージ）を応答へ出さない", () => {
  const r = run({ input: validInput(), appendThrows: true });
  assert.equal(r.response.error, "internal_error");
  assert.equal(JSON.stringify(r.response).includes("append boom"), false);
});
