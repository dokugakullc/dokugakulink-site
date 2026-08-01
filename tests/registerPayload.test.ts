import { test } from "node:test";
import assert from "node:assert/strict";
import { buildGasBody } from "../src/lib/registerPayload";
import type { RegisterPayload } from "../src/lib/registerHandler";

function payload(over: Partial<RegisterPayload> = {}): RegisterPayload {
  return {
    email: "taro@example.com",
    interest: "takken",
    problem: "forget",
    source: "landing_takken",
    userAgent: "ua",
    attribution: { utm_source: "meta", fbclid: "abc" },
    ...over,
  };
}

test("token が送信ボディに含まれ、渡した値と一致する", () => {
  const body = buildGasBody(payload(), "SECRET_DUMMY");
  assert.equal(body.token, "SECRET_DUMMY");
});

test("token はユーザー入力（rest 相当）で上書きされない", () => {
  // email 等に token というキーは無いが、防御的に rest 相当へ token を混ぜても最後の token が勝つ
  const p = { ...payload(), token: "evil" } as unknown as RegisterPayload;
  const body = buildGasBody(p, "SECRET_DUMMY");
  assert.equal(body.token, "SECRET_DUMMY");
});

test("token は attribution で上書きされない（token 最後確定）", () => {
  const body = buildGasBody(payload({ attribution: { utm_source: "x", token: "evil" } }), "SECRET_DUMMY");
  assert.equal(body.token, "SECRET_DUMMY");
});

test("attribution 8キーがトップレベルへ平坦化される", () => {
  const attribution = {
    utm_source: "s", utm_medium: "m", utm_campaign: "c", utm_content: "co",
    utm_term: "t", fbclid: "f", landing_url: "/landing/takken", referrer: "https://x",
  };
  const body = buildGasBody(payload({ attribution }), "S");
  for (const [k, v] of Object.entries(attribution)) {
    assert.equal(body[k], v, `top-level ${k}`);
  }
  // rest のキーもトップレベル
  assert.equal(body.email, "taro@example.com");
  assert.equal(body.source, "landing_takken");
});

test("attribution が空でも token と rest は含まれる", () => {
  const body = buildGasBody(payload({ attribution: {} }), "S");
  assert.equal(body.token, "S");
  assert.equal(body.email, "taro@example.com");
  assert.equal("utm_source" in body, false);
});
