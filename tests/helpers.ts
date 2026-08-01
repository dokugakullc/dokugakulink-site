// テスト共通のフェイク Request。NextRequest ではなく最小インターフェース（headers.get / json）を満たす。
import type { HttpRequestLike } from "../src/lib/contactHandler";

export type MakeReqOptions = {
  contentType?: string | null;
  origin?: string | null;
  host?: string | null;
  userAgent?: string | null;
  body?: unknown; // json() が返す値
  throwOnJson?: boolean; // 不正 JSON を模す
};

export function makeReq(opts: MakeReqOptions = {}): HttpRequestLike {
  const headers = new Map<string, string>();
  const set = (k: string, v: string | null | undefined) => {
    if (v !== null && v !== undefined) headers.set(k.toLowerCase(), v);
  };
  set("content-type", opts.contentType === undefined ? "application/json" : opts.contentType);
  set("origin", opts.origin === undefined ? "https://www.dokugakulink.com" : opts.origin);
  set("host", opts.host === undefined ? "www.dokugakulink.com" : opts.host);
  set("user-agent", opts.userAgent === undefined ? "test-agent" : opts.userAgent);

  return {
    headers: {
      get: (name: string) => headers.get(name.toLowerCase()) ?? null,
    },
    json: async () => {
      if (opts.throwOnJson) throw new SyntaxError("invalid json");
      return opts.body;
    },
  };
}
