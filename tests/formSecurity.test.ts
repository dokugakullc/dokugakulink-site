// 公開フォーム共通の検証ロジックのユニットテスト（外部APIに一切接続しない）。
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  CONTACT_LIMITS,
  REGISTER_LIMITS,
  TimeoutError,
  isHoneypotTriggered,
  isJsonContentType,
  isRequestOriginAllowed,
  isValidSubmissionId,
  sanitizeAttribution,
  validateContactInput,
  validateRegisterInput,
  withTimeout,
} from "../src/lib/formSecurity";

const validContact = {
  name: "山田 太郎",
  email: "taro@example.com",
  message: "問い合わせ本文です。",
  contact_type: "service",
};

// ── validateContactInput ─────────────────────────────────────────────
test("contact: 正常入力は ok=true・trim される", () => {
  const r = validateContactInput({
    name: "  太郎 ",
    email: " taro@example.com ",
    message: " 本文 ",
    contact_type: "service",
    company: "  テスト社  ",
  });
  assert.equal(r.ok, true);
  if (r.ok) {
    assert.equal(r.value.name, "太郎");
    assert.equal(r.value.email, "taro@example.com");
    assert.equal(r.value.message, "本文");
    assert.equal(r.value.contactType, "service");
    assert.equal(r.value.company, "テスト社");
  }
});

test("contact: contact_type は必須・許可リスト外/欠落は拒否、company は任意で上限のみ検証", () => {
  // 欠落 → 拒否
  assert.equal(validateContactInput({ name: "a", email: "a@b.co", message: "x" }).ok, false);
  // 許可リスト外 → 拒否
  assert.equal(validateContactInput({ ...validContact, contact_type: "hacker" }).ok, false);
  // 全許可値 → ok
  for (const t of ["service", "partnership", "media", "support", "other"]) {
    assert.equal(validateContactInput({ ...validContact, contact_type: t }).ok, true, t);
  }
  // company 未指定 → ok（空文字）
  const r = validateContactInput({ ...validContact, company: undefined });
  assert.equal(r.ok, true);
  if (r.ok) assert.equal(r.value.company, "");
  // company 上限超過 → 拒否
  assert.equal(validateContactInput({ ...validContact, company: "あ".repeat(121) }).ok, false);
});

test("contact: 空/空白のみ/改行のみを拒否", () => {
  assert.equal(validateContactInput({ name: "", email: "", message: "" }).ok, false);
  assert.equal(validateContactInput({ name: "   ", email: "  ", message: "\n\t " }).ok, false);
  assert.equal(validateContactInput({ ...validContact, message: "\n\n\n" }).ok, false);
});

test("contact: 型不正（配列/数値/オブジェクト/null/undefined/文字列）を拒否", () => {
  assert.equal(validateContactInput(null).ok, false);
  assert.equal(validateContactInput(undefined).ok, false);
  assert.equal(validateContactInput([]).ok, false);
  assert.equal(validateContactInput("string").ok, false);
  assert.equal(validateContactInput({ name: 123, email: "a@b.co", message: "x" }).ok, false);
  assert.equal(validateContactInput({ name: "a", email: ["a@b.co"], message: "x" }).ok, false);
  assert.equal(validateContactInput({ name: "a", email: "a@b.co", message: { t: 1 } }).ok, false);
});

test("contact: 不正メールを拒否", () => {
  for (const email of ["no-at", "a@b", "a b@c.co", "a@b .co", "@b.co", "a@.co"]) {
    assert.equal(validateContactInput({ ...validContact, email }).ok, false, email);
  }
});

test("contact: メール254境界は通過・255は拒否", () => {
  const at254 = "a".repeat(247) + "@ex.com";
  assert.equal(at254.length, CONTACT_LIMITS.EMAIL_MAX);
  assert.equal(validateContactInput({ ...validContact, email: at254 }).ok, true);
  const r = validateContactInput({ ...validContact, email: "a".repeat(248) + "@ex.com" });
  assert.equal(r.ok, false);
  if (!r.ok) assert.equal(r.code, "email_too_long");
});

test("contact: 氏名100境界は通過・101は拒否", () => {
  assert.equal(validateContactInput({ ...validContact, name: "あ".repeat(100) }).ok, true);
  const r = validateContactInput({ ...validContact, name: "あ".repeat(101) });
  assert.equal(r.ok, false);
  if (!r.ok) assert.equal(r.code, "name_too_long");
});

test("contact: 本文5000境界は通過・5001は拒否", () => {
  assert.equal(validateContactInput({ ...validContact, message: "あ".repeat(5000) }).ok, true);
  assert.equal(validateContactInput({ ...validContact, message: "あ".repeat(5001) }).ok, false);
});

test("contact: 絵文字はUTF-16コード単位（2）で数える境界", () => {
  assert.equal("😀".repeat(50).length, 100);
  assert.equal(validateContactInput({ ...validContact, name: "😀".repeat(50) }).ok, true);
  assert.equal(validateContactInput({ ...validContact, name: "😀".repeat(51) }).ok, false);
  assert.equal(validateContactInput({ ...validContact, message: "あ".repeat(4999) + "😀" }).ok, false);
});

// ── validateRegisterInput ────────────────────────────────────────────
test("register: 正常（source未指定は既定 takken_lp）", () => {
  const r = validateRegisterInput({ email: "a@b.co" });
  assert.equal(r.ok, true);
  if (r.ok) assert.equal(r.value.source, "takken_lp");
});

test("register: 許可 source / problem", () => {
  const r = validateRegisterInput({ email: "a@b.co", source: "landing_takken", problem: "forget" });
  assert.equal(r.ok, true);
  if (r.ok) {
    assert.equal(r.value.source, "landing_takken");
    assert.equal(r.value.problem, "forget");
  }
});

test("register: 不正 source は拒否・不正 problem は空に落とす", () => {
  assert.equal(validateRegisterInput({ email: "a@b.co", source: "__invalid__" }).ok, false);
  const r = validateRegisterInput({ email: "a@b.co", problem: "__nope__" });
  assert.equal(r.ok, true);
  if (r.ok) assert.equal(r.value.problem, "");
});

test("register: メール254超過・空・型不正・不正メールを拒否", () => {
  const r = validateRegisterInput({ email: "a".repeat(248) + "@ex.com" });
  assert.equal(r.ok, false);
  if (!r.ok) assert.equal(r.code, "email_too_long");
  assert.equal(REGISTER_LIMITS.EMAIL_MAX, 254);
  assert.equal(validateRegisterInput({ email: "" }).ok, false);
  assert.equal(validateRegisterInput({ email: 123 }).ok, false);
  assert.equal(validateRegisterInput({ email: "bad" }).ok, false);
  assert.equal(validateRegisterInput([]).ok, false);
});

// ── isJsonContentType ────────────────────────────────────────────────
test("content-type: JSON のみ許可", () => {
  assert.equal(isJsonContentType("application/json"), true);
  assert.equal(isJsonContentType("application/json; charset=utf-8"), true);
  assert.equal(isJsonContentType("APPLICATION/JSON"), true);
  assert.equal(isJsonContentType("text/plain"), false);
  assert.equal(isJsonContentType("multipart/form-data"), false);
  assert.equal(isJsonContentType(null), false);
  assert.equal(isJsonContentType(undefined), false);
  assert.equal(isJsonContentType(""), false);
});

// ── isHoneypotTriggered ──────────────────────────────────────────────
test("honeypot: 空/空白/未定義は未作動、値ありは作動", () => {
  assert.equal(isHoneypotTriggered(undefined), false);
  assert.equal(isHoneypotTriggered(null), false);
  assert.equal(isHoneypotTriggered(""), false);
  assert.equal(isHoneypotTriggered("   "), false);
  assert.equal(isHoneypotTriggered("bot"), true);
  assert.equal(isHoneypotTriggered(["x"]), true);
  assert.equal(isHoneypotTriggered({ a: 1 }), true);
});

// ── isRequestOriginAllowed（scheme 込み厳格化） ──────────────────────
test("origin: 本番の完全Origin（https）は許可", () => {
  assert.equal(isRequestOriginAllowed({ origin: "https://www.dokugakulink.com", host: "www.dokugakulink.com" }).allowed, true);
  assert.equal(isRequestOriginAllowed({ origin: "https://dokugakulink.com", host: "www.dokugakulink.com" }).allowed, true);
});

test("origin: 本番ホストの http:// は拒否", () => {
  const r = isRequestOriginAllowed({ origin: "http://www.dokugakulink.com", host: "www.dokugakulink.com" });
  assert.equal(r.allowed, false);
  assert.equal(r.reason, "insecure-scheme");
});

test("origin: 同一オリジン（Preview https / localhost http）は許可", () => {
  assert.equal(
    isRequestOriginAllowed({ origin: "https://dokugakulink-site-git-x.vercel.app", host: "dokugakulink-site-git-x.vercel.app" }).allowed,
    true,
  );
  assert.equal(isRequestOriginAllowed({ origin: "http://localhost:3000", host: "localhost:3000" }).allowed, true);
});

test("origin: 別オリジン / 別ポート / null は拒否", () => {
  assert.equal(isRequestOriginAllowed({ origin: "https://evil.example.com", host: "www.dokugakulink.com" }).reason, "cross-origin");
  // 別ポートは別オリジン
  assert.equal(isRequestOriginAllowed({ origin: "https://www.dokugakulink.com:8443", host: "www.dokugakulink.com" }).allowed, false);
  // Origin: null（サンドボックス iframe 等）
  assert.equal(isRequestOriginAllowed({ origin: "null", host: "www.dokugakulink.com" }).allowed, false);
  assert.equal(isRequestOriginAllowed({ origin: "not a url", host: "www.dokugakulink.com" }).allowed, false);
});

test("origin: 大文字・末尾ドットは正規化して許可", () => {
  assert.equal(isRequestOriginAllowed({ origin: "https://WWW.DokugakuLink.com.", host: "www.dokugakulink.com" }).allowed, true);
});

test("origin: Origin なしは拒否しない（fail-open・補助策）", () => {
  const r = isRequestOriginAllowed({ origin: null, host: "www.dokugakulink.com" });
  assert.equal(r.allowed, true);
  assert.equal(r.reason, "no-origin");
});

// ── withTimeout ──────────────────────────────────────────────────────
test("withTimeout: 期限内は値、超過は TimeoutError", async () => {
  assert.equal(await withTimeout(Promise.resolve(42), 1000, "t"), 42);
  const never = new Promise((resolve) => setTimeout(resolve, 1000));
  await assert.rejects(() => withTimeout(never, 10, "t"), (e: unknown) => e instanceof TimeoutError);
});

// ── isValidSubmissionId ──────────────────────────────────────────────
test("submissionId: UUID/英数ハイフンは可・短すぎ/記号は不可", () => {
  assert.equal(isValidSubmissionId("550e8400-e29b-41d4-a716-446655440000"), true);
  assert.equal(isValidSubmissionId("abc12345"), true);
  assert.equal(isValidSubmissionId("short"), false);
  assert.equal(isValidSubmissionId("has space here"), false);
  assert.equal(isValidSubmissionId(123), false);
  assert.equal(isValidSubmissionId(undefined), false);
});

// ── sanitizeAttribution ──────────────────────────────────────────────
test("attribution: 許可キーのみ・改行除去・200字切り詰め", () => {
  const out = sanitizeAttribution({
    utm_source: "meta",
    utm_campaign: "line1\nline2\tend",
    email: "leak@example.com",
    password: "secret",
    landing_url: "x".repeat(300),
  });
  assert.equal(out.utm_source, "meta");
  assert.equal(out.utm_campaign, "line1 line2 end");
  assert.equal(out.landing_url.length, 200);
  assert.equal("email" in out, false);
  assert.equal("password" in out, false);
});
