// 問い合わせ保存 payload（純粋関数 buildContactStoreBody）のテスト。外部接続なし。
// 検証観点: allowlist / attribution 許可キー / 任意キー非転送 / source サーバー固定 /
//           submission_id・reference 維持 / token を最後に確定・上書き不可 / Secret を保存対象へ含めない。
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  buildContactStoreBody,
  CONTACT_STORE_TOP_LEVEL_KEYS,
  type ContactStoreRecord,
} from "../src/lib/contactStorePayload";

const SECRET = "SECRET_DUMMY_TOKEN";

function record(over: Partial<ContactStoreRecord> = {}): ContactStoreRecord {
  return {
    name: "山田 太郎",
    email: "taro@example.com",
    company: "テスト株式会社",
    contact_type: "service",
    message: "本文です",
    source: "web_contact",
    submission_id: "abcd1234efgh",
    reference: "REF-0001",
    userAgent: "test-agent",
    attribution: { utm_source: "meta", fbclid: "fbc" },
    ...over,
  };
}

test("token は最後に確定し、body に含まれる", () => {
  const body = buildContactStoreBody(record(), SECRET);
  assert.equal(body.token, SECRET);
  // オブジェクトの最後のキーが token（挿入順で末尾）
  const keys = Object.keys(body);
  assert.equal(keys[keys.length - 1], "token");
});

test("token は rest / attribution / ユーザー入力で上書きできない", () => {
  // 悪意ある record: トップレベルにも attribution にも token を潜り込ませる
  const malicious = record({
    // @ts-expect-error 故意に未知キー token を混入
    token: "HACKED_TOP",
    attribution: { utm_source: "meta", token: "HACKED_ATTR", fbclid: "fbc" } as Record<string, string>,
  });
  const body = buildContactStoreBody(malicious, SECRET);
  assert.equal(body.token, SECRET, "token は必ず本物の Secret");
});

test("トップレベルは allowlist のみ・クライアント由来の任意キーを転送しない", () => {
  const withExtra = record({
    // @ts-expect-error 故意に未知キーを複数混入（超過プロパティは最初のキーで型エラー）
    evil: "x",
    is_admin: "true",
  });
  const body = buildContactStoreBody(withExtra, SECRET);
  assert.equal("evil" in body, false);
  assert.equal("is_admin" in body, false);
  // allowlist キー＋attribution 許可キー＋token だけ
  const allowed = new Set<string>([
    ...CONTACT_STORE_TOP_LEVEL_KEYS,
    "utm_source",
    "utm_medium",
    "utm_campaign",
    "utm_content",
    "utm_term",
    "fbclid",
    "landing_url",
    "referrer",
    "token",
  ]);
  for (const k of Object.keys(body)) assert.equal(allowed.has(k), true, `未知キーが混入: ${k}`);
});

test("attribution は許可キーのみ（未知キーは落とす）", () => {
  const body = buildContactStoreBody(
    record({ attribution: { utm_content: "ad_b", fbclid: "abc", evil: "x" } as Record<string, string> }),
    SECRET,
  );
  assert.equal(body.utm_content, "ad_b");
  assert.equal(body.fbclid, "abc");
  assert.equal("evil" in body, false);
});

test("source はサーバー固定値を維持・submission_id / reference を維持", () => {
  const body = buildContactStoreBody(record({ source: "web_contact" }), SECRET);
  assert.equal(body.source, "web_contact");
  assert.equal(body.submission_id, "abcd1234efgh");
  assert.equal(body.reference, "REF-0001");
});

test("Secret は token 以外の保存対象へ含まれない", () => {
  const body = buildContactStoreBody(record(), SECRET);
  for (const [k, v] of Object.entries(body)) {
    if (k === "token") continue;
    assert.notEqual(v, SECRET, `Secret が ${k} に漏れている`);
  }
});

test("欠落・非文字列のトップレベルは空文字に正規化", () => {
  const body = buildContactStoreBody(
    record({ company: undefined as unknown as string, contact_type: 123 as unknown as string }),
    SECRET,
  );
  assert.equal(body.company, "");
  assert.equal(body.contact_type, "");
});
