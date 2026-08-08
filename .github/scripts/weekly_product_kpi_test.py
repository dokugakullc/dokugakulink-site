#!/usr/bin/env python3
"""Fixture tests for weekly_product_kpi.py.

No network, no secrets: only the pure functions are exercised with canned
data. Also guards against drift between the committed module and the copy
embedded in the workflow (which cannot use actions/checkout).

Run: python3 .github/scripts/weekly_product_kpi_test.py
"""
import os
import socket
import ssl
import sys
import urllib.error
from datetime import datetime, timezone, date

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
import weekly_product_kpi as m  # noqa: E402

FAILS = []


def check(name, cond):
    print(("PASS  " if cond else "FAIL  ") + name)
    if not cond:
        FAILS.append(name)


def expect_raises(name, fn):
    try:
        fn()
        check(name + " (raises)", False)
    except ValueError:
        check(name + " (raises)", True)
    except Exception as ex:  # wrong exception type
        print("FAIL  %s (raised %s, want ValueError)" % (name, type(ex).__name__))
        FAILS.append(name)


def _row(**over):
    base = dict(
        wau=4, q_answered=45, q_answered_users=1, quiz_completed_cnt=3,
        quiz_completed_users=1, onboarding_completed_cnt=2, paywall_viewed_cnt=2,
        purchase_started_cnt=2, purchase_completed_cnt=0,
    )
    base.update(over)
    return [base[c] for c in m.EXPECTED_COLUMNS]


def payload(row, columns=None):
    return {"results": [row], "columns": columns if columns is not None else list(m.EXPECTED_COLUMNS)}


# 1. JST week window: Monday 09:00 JST run -> previous Mon..this Mon (UTC).
s, e, ps, pe = m.jst_week_window(datetime(2026, 8, 3, 0, 0, 0, tzinfo=timezone.utc))
check("window start UTC", s == datetime(2026, 7, 26, 15, 0, 0, tzinfo=timezone.utc))
check("window end UTC", e == datetime(2026, 8, 2, 15, 0, 0, tzinfo=timezone.utc))
check("period start (Mon)", ps == date(2026, 7, 27))
check("period end (Sun)", pe == date(2026, 8, 2))

# Mid-week run resolves to the same just-completed week.
s2, e2, ps2, pe2 = m.jst_week_window(datetime(2026, 8, 6, 0, 0, 0, tzinfo=timezone.utc))
check("mid-week same window", (s2, e2, ps2, pe2) == (s, e, ps, pe))

# 2. HogQL build.
sql = m.build_hogql(s, e)
check("sql starts SELECT", sql.startswith("SELECT "))
check("sql has start bound", "toDateTime('2026-07-26 15:00:00')" in sql)
check("sql has end bound", "toDateTime('2026-08-02 15:00:00')" in sql)
check("sql bounds via WHERE timestamp", "WHERE timestamp >=" in sql)
check("sql has allowlist filter", "event IN (" in sql)
check("sql lists all allowlist events", all(("'%s'" % ev) in sql for ev in m.ALLOWLIST_EVENTS))
check("sql no persons table", "persons" not in sql.lower())
check("sql no properties access", "properties" not in sql.lower())

# 3. validate_results OK.
ok = m.validate_results(payload(_row()))
check("validate returns dict", ok == {
    "wau": 4, "q_answered": 45, "q_answered_users": 1, "quiz_completed_cnt": 3,
    "quiz_completed_users": 1, "onboarding_completed_cnt": 2, "paywall_viewed_cnt": 2,
    "purchase_started_cnt": 2, "purchase_completed_cnt": 0,
})
check("validate ok without columns echo", m.validate_results({"results": [_row()]}) == ok)

# 4. validate_results rejects bad shapes.
expect_raises("empty results", lambda: m.validate_results({"results": []}))
expect_raises("two rows", lambda: m.validate_results({"results": [_row(), _row()]}))
expect_raises("short row", lambda: m.validate_results({"results": [_row()[:-1]]}))
expect_raises("non-int value", lambda: m.validate_results(payload(_row()[:-1] + ["x"])))
expect_raises("negative value", lambda: m.validate_results(payload(_row(wau=-1))))
expect_raises("bool value", lambda: m.validate_results({"results": [[True] + _row()[1:]]}))
expect_raises("wrong columns", lambda: m.validate_results(payload(_row(), columns=["a"] * 9)))
expect_raises("not an object", lambda: m.validate_results([1, 2, 3]))

# 5. format_message.
cur = m.validate_results(payload(_row()))
prev = m.validate_results(payload(_row(wau=6, q_answered=30)))
msg = m.format_message(cur, prev, ps, pe)
check("msg prelaunch label", "プリローンチ・参考値（QA/テスト混在）" in msg)
check("msg period", "期間: 2026-07-27〜2026-08-02 JST" in msg)
check("msg wau", "週間アクティブ利用者: 4人" in msg)
check("msg answered", "問題回答数: 45件（回答者 1人）" in msg)
check("msg purchase completed count", "購入完了数: 0件" in msg)
check("msg no revenue amount (yen)", "円" not in msg and "¥" not in msg)
check("msg mock exam not instrumented", "模試合格率: 未計装" in msg)
check("msg signup not instrumented", "新規登録: 未計装" in msg)
check("msg wow active", "前週比(アクティブ): 先週6人→今週4人（-33.3%" in msg)
check("msg dashboard link", m.DASHBOARD_URL in msg)

# denominator 0 -> em dash
prev0 = m.validate_results(payload(_row(wau=0, q_answered=0)))
msg0 = m.format_message(cur, prev0, ps, pe)
check("wow zero denominator active", "先週0人→今週4人（—" in msg0)
check("wow zero denominator answered", "先週0件→今週45件（—" in msg0)

# 6. _pct.
check("pct zero denom", m._pct(4, 0) == "—")
check("pct up", m._pct(6, 4) == "+50.0%")
check("pct down", m._pct(2, 4) == "-50.0%")

# 7. assert_message_safe.
check("safe message passes", m.assert_message_safe(msg) is True)
expect_raises("email marker blocked", lambda: m.assert_message_safe(msg + "\nx a@b.com"))
expect_raises("distinct_id blocked", lambda: m.assert_message_safe(msg + "\ndistinct_id=1"))
expect_raises("replay link blocked", lambda: m.assert_message_safe(msg + "\nreplay/123"))
expect_raises("stray http blocked", lambda: m.assert_message_safe(msg + "\nhttp://evil"))

# 7b. classify_transport_error: map transport exceptions to SAFE tokens only.
def _httperr(code):
    return urllib.error.HTTPError(url="https://secret.example/query", code=code,
                                  msg="secret-reason", hdrs=None, fp=None)


check("classify 400", m.classify_transport_error(_httperr(400)) == "HTTP_400")
check("classify 401", m.classify_transport_error(_httperr(401)) == "HTTP_401")
check("classify 403", m.classify_transport_error(_httperr(403)) == "HTTP_403")
check("classify 404", m.classify_transport_error(_httperr(404)) == "HTTP_404")
check("classify 409", m.classify_transport_error(_httperr(409)) == "HTTP_409")
check("classify 422", m.classify_transport_error(_httperr(422)) == "HTTP_422")
check("classify 429", m.classify_transport_error(_httperr(429)) == "HTTP_429")
check("classify 500 -> HTTP_5XX", m.classify_transport_error(_httperr(500)) == "HTTP_5XX")
check("classify 503 -> HTTP_5XX", m.classify_transport_error(_httperr(503)) == "HTTP_5XX")
check("classify unexpected 418 -> HTTP_OTHER", m.classify_transport_error(_httperr(418)) == "HTTP_OTHER")
check("classify socket.timeout -> TIMEOUT", m.classify_transport_error(socket.timeout()) == "TIMEOUT")
check("classify TimeoutError -> TIMEOUT", m.classify_transport_error(TimeoutError()) == "TIMEOUT")
check("classify SSLError -> TLS_ERROR", m.classify_transport_error(ssl.SSLError("boom")) == "TLS_ERROR")
check("classify URLError -> URL_ERROR",
      m.classify_transport_error(urllib.error.URLError("https://secret/x")) == "URL_ERROR")
check("classify URLError(timeout reason) -> TIMEOUT",
      m.classify_transport_error(urllib.error.URLError(socket.timeout())) == "TIMEOUT")
check("classify URLError(ssl reason) -> TLS_ERROR",
      m.classify_transport_error(urllib.error.URLError(ssl.SSLError("boom"))) == "TLS_ERROR")
check("classify ValueError -> INVALID_HEADER", m.classify_transport_error(ValueError("Bearer abc")) == "INVALID_HEADER")
check("classify unknown OSError -> UNKNOWN_TRANSPORT_ERROR",
      m.classify_transport_error(OSError("boom")) == "UNKNOWN_TRANSPORT_ERROR")

# Classification returns ONLY allowlisted tokens, never body/url/reason/key text.
_ALLOWED_TOKENS = {
    "HTTP_400", "HTTP_401", "HTTP_403", "HTTP_404", "HTTP_409", "HTTP_422",
    "HTTP_429", "HTTP_5XX", "HTTP_OTHER", "TIMEOUT", "URL_ERROR", "TLS_ERROR",
    "INVALID_HEADER", "UNKNOWN_TRANSPORT_ERROR",
}
_samples = [m.classify_transport_error(_httperr(c)) for c in (400, 401, 403, 404, 409, 422, 429, 500, 418)]
_samples += [
    m.classify_transport_error(socket.timeout()),
    m.classify_transport_error(ssl.SSLError("secret-reason")),
    m.classify_transport_error(urllib.error.URLError("https://secret/path?key=phc_abc")),
    m.classify_transport_error(ValueError("Bearer phc_secret")),
    m.classify_transport_error(OSError("secret")),
]
check("classification only returns allowlisted tokens", all(s in _ALLOWED_TOKENS for s in _samples))
check("classification leaks no url/body/reason/key text",
      all(("secret" not in s and "http" not in s and "phc_" not in s and "Bearer" not in s) for s in _samples))

# retry count unchanged, and _http_post_json raises a SAFE TransportError code
# without ever posting to Slack (offline monkeypatch of urlopen).
check("retry count unchanged (HTTP_RETRIES==2)", m.HTTP_RETRIES == 2)
_calls = {"n": 0}


def _boom(*_a, **_k):
    _calls["n"] += 1
    raise _httperr(403)


_orig_urlopen = m.urllib.request.urlopen
m.urllib.request.urlopen = _boom
_raised_code = None
try:
    try:
        m._http_post_json("https://x/query", {"a": 1}, {"Content-Type": "application/json"})
    except m.TransportError as te:
        _raised_code = te.code
finally:
    m.urllib.request.urlopen = _orig_urlopen
check("http_post_json attempts == HTTP_RETRIES+1", _calls["n"] == m.HTTP_RETRIES + 1)
check("http_post_json raises safe TransportError code", _raised_code == "HTTP_403")

# 8. Drift guard: the workflow embeds this module verbatim.
WF = os.path.abspath(os.path.join(HERE, "..", "workflows", "weekly-product-kpi.yml"))
module_lines = open(os.path.join(HERE, "weekly_product_kpi.py"), encoding="utf-8").read().splitlines()
wf_raw = open(WF, encoding="utf-8").read().splitlines()
start_marker = next(i for i, ln in enumerate(wf_raw) if "python3 - <<'WEEKLY_KPI_PY'" in ln)
indent = len(wf_raw[start_marker]) - len(wf_raw[start_marker].lstrip())
body = []
for ln in wf_raw[start_marker + 1:]:
    if ln.strip() == "WEEKLY_KPI_PY":
        break
    body.append(ln[indent:] if len(ln) >= indent else ln.lstrip())
check("workflow embed matches module verbatim", body == module_lines)

print("\n%d checks, %d failed" % (0, len(FAILS)) if False else "")
if FAILS:
    print("FAILED: %d -> %s" % (len(FAILS), ", ".join(FAILS)))
    sys.exit(1)
print("ALL FIXTURE TESTS PASSED")
