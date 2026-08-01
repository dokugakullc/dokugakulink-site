import { test } from "node:test";
import assert from "node:assert/strict";
import { resolveRegistrationOutcome, outcomeFiresMetaLead } from "../src/lib/registrationOutcome";

test("新規成功 → submitted（Meta Lead 発火）", () => {
  const o = resolveRegistrationOutcome({ ok: true, success: true, duplicated: false });
  assert.equal(o, "submitted");
  assert.equal(outcomeFiresMetaLead(o), true);
});

test("重複成功 → duplicated（Meta Lead 発火しない）", () => {
  const o = resolveRegistrationOutcome({ ok: true, success: true, duplicated: true });
  assert.equal(o, "duplicated");
  assert.equal(outcomeFiresMetaLead(o), false);
});

test("API 失敗（!ok / !success）→ failed（Meta Lead 発火しない）", () => {
  for (const res of [
    { ok: false, success: true, duplicated: false },
    { ok: true, success: false, duplicated: false },
    { ok: false, success: false },
    { ok: true }, // success undefined
    { ok: true, success: true }, // duplicated undefined → 新規扱い
  ]) {
    const o = resolveRegistrationOutcome(res as { ok: boolean; success?: boolean; duplicated?: boolean });
    if (res.ok && res.success) {
      // duplicated 未定義は新規（submitted）
      assert.equal(o, "submitted");
      assert.equal(outcomeFiresMetaLead(o), true);
    } else {
      assert.equal(o, "failed");
      assert.equal(outcomeFiresMetaLead(o), false);
    }
  }
});

test("Meta Lead を発火するのは submitted のみ", () => {
  assert.equal(outcomeFiresMetaLead("submitted"), true);
  assert.equal(outcomeFiresMetaLead("duplicated"), false);
  assert.equal(outcomeFiresMetaLead("failed"), false);
});
