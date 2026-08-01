// 公開フォーム（/api/contact・/api/register）共通のセキュリティ／バリデーション基盤。
//
// このモジュールは next/server・resend など外部ランタイムに依存しない純粋関数のみで構成する。
// 目的は「ルートの副作用（メール送信・外部fetch）と、判定ロジックを分離し、
// 外部APIに接続せずユニットテストできる」ようにすること。
// PII（氏名・メール・本文）や Secret はここでは一切ログ出力しない。

// ── 入力長の上限（いずれも trim 後の文字数＝JavaScript の length＝UTF-16 コード単位）──
// 注意: 絵文字などサロゲートペアは 2 コード単位として数える。日本語の一般的な文字は 1 コード単位。
export const CONTACT_LIMITS = {
  NAME_MAX: 100,
  EMAIL_MAX: 254,
  MESSAGE_MAX: 5000,
} as const;

export const REGISTER_LIMITS = {
  EMAIL_MAX: 254,
} as const;

// ── 外部API呼び出しのタイムアウト（DL-002）──
export const RESEND_TIMEOUT_MS = 10_000;
export const GAS_TIMEOUT_MS = 10_000;

// ── Origin 検証（DL-003）で許可する本番の「完全な Origin」（scheme を含む）──
// scheme まで含めて照合するため、http:// は一致しない（＝拒否される）。
// apex（dokugakulink.com）は 308 で www へ転送されるが、転送前の POST を万一許すため https のみ許可。
// Preview（*.vercel.app）・ローカル（localhost 等）は「Origin === リクエスト由来の Origin」
// という同一オリジン一致で許可するため、ここには列挙しない。
export const ALLOWED_ORIGINS: readonly string[] = [
  "https://www.dokugakulink.com",
  "https://dokugakulink.com",
];

// honeypot フィールド名。ブラウザ／パスワードマネージャの自動入力と衝突しにくいよう、
// email/name/company/website/tel/address 等の一般的なプロフィール名を避けた独自トークンにする。
export const HONEYPOT_FIELD = "hp_token";

// メール形式（空白を許さない＝ヘッダーインジェクション対策も兼ねる）
export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// ── register 用の許可値（ルートから移設し、検証をテスト可能にする）──
export const ALLOWED_SOURCES: readonly string[] = [
  "takken_lp",
  "takken_lp_hero",
  "landing_takken",
  "services_takken",
  "fp_lp",
  "boki_lp",
  "gyosei_lp",
];

export const ALLOWED_PROBLEMS: readonly string[] = [
  "continue",
  "forget",
  "roadmap",
  "growth",
  "motivation",
];

// 広告帰属として保存を許可するキー（PII は含めない）
export const ATTRIBUTION_KEYS: readonly string[] = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  "fbclid",
  "landing_url",
  "referrer",
];

// ── 結果型（判別可能なユニオン）──
export type Ok<T> = { ok: true; value: T };
export type Err = { ok: false; code: string; error: string };
export type Result<T> = Ok<T> | Err;

const err = (code: string, error: string): Err => ({ ok: false, code, error });

/** Content-Type が JSON か（charset 付きも許容）。DL-003: 不正 Content-Type の拒否。 */
export function isJsonContentType(header: string | null | undefined): boolean {
  if (!header) return false;
  return header.split(";")[0].trim().toLowerCase() === "application/json";
}

/**
 * honeypot 判定。人間・支援技術には見えない隠しフィールドに値が入っていれば bot とみなす。
 * 空文字・空白のみ・未定義は「未入力（正常）」。それ以外の非空値（文字列/配列/オブジェクト等）は
 * すべて「作動（bot 疑い）」として扱う。
 */
export function isHoneypotTriggered(value: unknown): boolean {
  if (value === undefined || value === null) return false;
  if (typeof value === "string") return value.trim().length > 0;
  // 文字列以外の非 null 値をわざわざ送ってくるのは通常の利用者ではない
  return true;
}

// ホスト正規化（小文字化＋末尾ドット1つ除去）。
function normalizeHost(host: string): string {
  return host.toLowerCase().replace(/\.$/, "");
}

function isLocalHost(host: string): boolean {
  return /^(localhost|127\.0\.0\.1|\[::1\])(:\d+)?$/.test(host);
}

/**
 * Origin 検証（DL-003 の「補助策」）。
 *
 * ★重要な位置づけ: これは CSRF の完全な対策ではない。
 *   Origin ヘッダーを付けずに直接 API を叩く bot（curl 等）は素通りする（下記 fail-open）。
 *   本命のスパム／濫用対策はレート制限＋Turnstile であり、それらが未実装の現段階で
 *   DL-003 を「解消済み」とはしない。本関数は「明示的に別オリジンから来たものだけを弾く」補助。
 *
 * 方針:
 *  - Origin が無い（サーバー間 / 一部プロキシが除去）→ 拒否しない（fail-open）。正規利用者を巻き込まないため。
 *  - Origin があれば scheme まで含めて厳格照合し、別オリジンや http:// を拒否する。
 *
 * 許可条件（いずれか）:
 *  1. Origin（scheme+host[:port]）が ALLOWED_ORIGINS に一致（http:// は不一致＝拒否）。
 *  2. 同一オリジン: Origin のホスト === リクエスト由来のホスト。
 *     - 本番/Preview（Vercel）は https のみ許可。
 *     - localhost/127.0.0.1/[::1] は開発用に http も許可。
 *
 * 個別ケース:
 *  - `Origin: null`（サンドボックス iframe 等）→ new URL("null") が throw → malformed として拒否。
 *  - 不正ポート/大文字/末尾ドット → 正規化のうえ host 一致で判定（別ポートは別オリジン＝拒否）。
 *  - 国際化ドメイン（IDN）→ ブラウザは punycode を送るため、当社 ASCII ドメインと綴りが違えば不一致＝拒否。
 *
 * 注: host はプロキシ下では詐称され得るが、ブラウザからの正規リクエストでは実ホストが入る。
 *     Vercel では公開ホストが `host` に入る（`x-forwarded-host` も存在し得る）。ここでは `host` を用いる。
 *
 * CORS ≠ CSRF: これはブラウザへ返す Access-Control-* の話ではなく、サーバー側の送信元判定である。
 */
export function isRequestOriginAllowed(input: {
  origin: string | null | undefined;
  host: string | null | undefined;
}): { allowed: boolean; reason: string } {
  const { origin, host } = input;

  // Origin なし → 拒否しない（fail-open。補助策のため）
  if (!origin) return { allowed: true, reason: "no-origin" };

  let u: URL;
  try {
    u = new URL(origin);
  } catch {
    // "null" や壊れた値を含む → 拒否
    return { allowed: false, reason: "malformed-origin" };
  }

  const originOrigin = `${u.protocol}//${normalizeHost(u.host)}`;

  // 1) 完全 Origin 許可リスト（scheme を含むため http:// は一致しない）
  const allow = ALLOWED_ORIGINS.map((o) => {
    const p = new URL(o);
    return `${p.protocol}//${normalizeHost(p.host)}`;
  });
  if (allow.includes(originOrigin)) {
    return { allowed: true, reason: "allowlisted-origin" };
  }

  // 2) 同一オリジン（Preview / localhost を追加設定なしで許容）
  if (host) {
    const reqHost = normalizeHost(host);
    if (normalizeHost(u.host) === reqHost) {
      if (isLocalHost(reqHost)) return { allowed: true, reason: "same-origin-local" };
      if (u.protocol === "https:") return { allowed: true, reason: "same-origin" };
      return { allowed: false, reason: "insecure-scheme" }; // 非ローカルの http は拒否
    }
  }

  return { allowed: false, reason: "cross-origin" };
}

// submissionId（クライアント生成の冪等キー種）の妥当性。UUID 形式または英数字ハイフン 8〜64 文字。
export function isValidSubmissionId(value: unknown): value is string {
  return typeof value === "string" && /^[A-Za-z0-9-]{8,64}$/.test(value);
}

/**
 * 指定ミリ秒で必ず解決/拒否させるタイムアウトラッパー（DL-002）。
 * タイムアウト時は TimeoutError を throw する（＝呼び出し側で成功を返させない）。
 * 注意: Resend SDK は AbortSignal を直接受け取れないため race で打ち切る。
 *       この場合、下層の HTTP は完了する可能性があるが、こちらは成功を報告しない。
 *       fetch ベースの呼び出し側では AbortController で実際に中断する。
 */
export class TimeoutError extends Error {
  constructor(label = "operation") {
    super(`${label} timed out`);
    this.name = "TimeoutError";
  }
}

export function withTimeout<T>(promise: Promise<T>, ms: number, label?: string): Promise<T> {
  let timer: ReturnType<typeof setTimeout>;
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new TimeoutError(label)), ms);
  });
  return Promise.race([promise, timeout]).finally(() => clearTimeout(timer)) as Promise<T>;
}

// ── お問い合わせ入力の検証（DL-006）──
export type ContactInput = { name: string; email: string; message: string };

export function validateContactInput(raw: unknown): Result<ContactInput> {
  if (typeof raw !== "object" || raw === null || Array.isArray(raw)) {
    return err("invalid_body", "リクエストが不正です");
  }
  const { name, email, message } = raw as Record<string, unknown>;

  // 型不正（配列・数値・オブジェクト・null 等）は空欄チェックの前に string 型で弾く
  if (typeof name !== "string" || !name.trim()) {
    return err("name_required", "お名前を入力してください");
  }
  if (typeof email !== "string" || !email.trim()) {
    return err("email_required", "メールアドレスを入力してください");
  }
  if (!EMAIL_RE.test(email.trim())) {
    return err("email_invalid", "正しいメールアドレスを入力してください");
  }
  if (typeof message !== "string" || !message.trim()) {
    return err("message_required", "お問い合わせ内容を入力してください");
  }

  const name_ = name.trim();
  const email_ = email.trim();
  const message_ = message.trim();

  if (name_.length > CONTACT_LIMITS.NAME_MAX) {
    return err("name_too_long", "お名前が長すぎます");
  }
  if (email_.length > CONTACT_LIMITS.EMAIL_MAX) {
    return err("email_too_long", "メールアドレスが長すぎます");
  }
  if (message_.length > CONTACT_LIMITS.MESSAGE_MAX) {
    return err("message_too_long", `お問い合わせ内容が長すぎます（${CONTACT_LIMITS.MESSAGE_MAX}文字以内）`);
  }

  return { ok: true, value: { name: name_, email: email_, message: message_ } };
}

// ── 事前登録入力の検証（DL-006）──
export type RegisterInput = { email: string; source: string; problem: string };

export function validateRegisterInput(raw: unknown): Result<RegisterInput> {
  if (typeof raw !== "object" || raw === null || Array.isArray(raw)) {
    return err("invalid_body", "リクエストが不正です");
  }
  const { email, source, problem } = raw as Record<string, unknown>;

  if (typeof email !== "string" || !email.trim()) {
    return err("email_required", "メールアドレスを入力してください");
  }
  const email_ = email.trim();
  if (!EMAIL_RE.test(email_)) {
    return err("email_invalid", "正しいメールアドレスを入力してください");
  }
  if (email_.length > REGISTER_LIMITS.EMAIL_MAX) {
    return err("email_too_long", "メールアドレスが長すぎます");
  }

  // source は未指定なら既定値。指定があれば許可リストで照合。
  const normalizedSource = typeof source === "string" && source ? source : "takken_lp";
  if (!ALLOWED_SOURCES.includes(normalizedSource)) {
    return err("invalid_source", "不正なリクエストです");
  }

  const normalizedProblem =
    typeof problem === "string" && ALLOWED_PROBLEMS.includes(problem) ? problem : "";

  return { ok: true, value: { email: email_, source: normalizedSource, problem: normalizedProblem } };
}

/** interest はソースから自動導出（LP別に固定値）。 */
export function deriveInterest(source: string): string {
  if (source.includes("takken")) return "takken";
  if (source.includes("fp")) return "fp";
  if (source.includes("boki")) return "boki";
  if (source.includes("gyosei")) return "gyosei";
  return "";
}

/** クライアントから来た帰属情報を許可キーだけに詰め替える（構造的に PII 混入を防ぐ）。 */
export function sanitizeAttribution(input: unknown): Record<string, string> {
  const out: Record<string, string> = {};
  if (typeof input !== "object" || input === null) return out;
  const src = input as Record<string, unknown>;
  for (const key of ATTRIBUTION_KEYS) {
    const v = src[key];
    if (typeof v === "string" && v.trim()) {
      out[key] = v.trim().replace(/[\r\n\t]/g, " ").slice(0, 200);
    }
  }
  return out;
}
