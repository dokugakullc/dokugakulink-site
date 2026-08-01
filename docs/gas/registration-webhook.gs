/**
 * Waitlist registration webhook — dokugakulink.com  (/landing/takken, /services/takken)
 * ------------------------------------------------------------------------------------
 * PROPOSAL — rebuilt under info@dokugakulink.com to replace the test-account
 * (tomishere078@gmail.com) script. Receives POST JSON from the Next.js
 * `/api/register` route and appends one row to the `registrations` sheet.
 *
 * Backward compatible response contract (do NOT change): { success:boolean, duplicated:boolean }
 * `/api/register` reads exactly these two fields.
 *
 * Deploy (owner = info@dokugakulink.com):
 *   1. script.google.com → 新規プロジェクト（スプレッドシートに紐づけず standalone 推奨）
 *   2. このコードを Code.gs に貼り付け
 *   3. プロジェクトの設定 → スクリプト プロパティに以下を登録
 *        SHEET_ID       = 新しい registrations スプレッドシートの ID
 *        SHARED_SECRET  = 十分に長いランダム文字列（Vercel の GAS_SHARED_SECRET と同値）
 *        （任意）SHEET_NAME    = 既定 "registrations"
 *        （任意）TEST_MARKERS  = 既定 "+test,+lp-test,+meta-test"（明示的な plus タグのみ）
 *   4. デプロイ → 新しいデプロイ → 種類: ウェブアプリ
 *        - 次のユーザーとして実行: 自分（info@）
 *        - アクセスできるユーザー: 全員
 *   5. 権限承認（スプレッドシート編集）
 *   6. 発行された /exec URL を控え、Vercel の GAS_WEBHOOK_URL(Production) に設定
 *
 * 動作確認: ブラウザで /exec を開くと {"ok":true} が返ればデプロイ成功（doGet）。
 * 秘密情報（SHEET_ID / SHARED_SECRET）はコードへ直書きしない（スクリプトプロパティで管理）。
 * 個人情報・リクエスト全体はログへ出力しない。例外の詳細は外部レスポンスへ出さない。
 */

var HEADERS = [
  'registration_id', 'timestamp', 'email', 'problem', 'source', 'user_agent',
  'duplicated', 'is_test', 'utm_source', 'utm_medium', 'utm_campaign',
  'utm_content', 'utm_term', 'fbclid', 'landing_url', 'referrer',
  'created_by', 'schema_version'
];
var SCHEMA_VERSION = '2';
var CREATED_BY = 'info@dokugakulink.com';

function doGet() {
  return json_({ ok: true });
}

function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return json_({ success: false, error: 'bad_request' });
    }

    var data;
    try {
      data = JSON.parse(e.postData.contents);
    } catch (_) {
      return json_({ success: false, error: 'bad_json' });
    }

    var props = PropertiesService.getScriptProperties();

    // --- 認証（共有シークレット）: GAS は doPost で HTTP ヘッダーを読めないため本文で受ける ---
    var secret = props.getProperty('SHARED_SECRET') || '';
    if (!secret || String(data.token || '') !== secret) {
      return json_({ success: false, error: 'unauthorized' });
    }

    // --- 入力検証 ---
    var email = String(data.email || '').trim().toLowerCase().slice(0, 254);
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return json_({ success: false, error: 'invalid_email' });
    }
    var source = clip_(data.source, 64);
    if (!source) {
      return json_({ success: false, error: 'missing_source' });
    }

    // --- 排他制御（同時登録の競合防止） ---
    lock.waitLock(20000);

    var ss = SpreadsheetApp.openById(props.getProperty('SHEET_ID'));
    var sheetName = props.getProperty('SHEET_NAME') || 'registrations';
    var sheet = ss.getSheetByName(sheetName) || ss.insertSheet(sheetName);
    ensureHeaders_(sheet);

    var duplicated = emailExists_(sheet, 'email', email);

    // 明示的な plus タグ（+test / +lp-test / +meta-test）だけを test 判定に使う。
    // 広すぎる部分一致（例: 会社名）は正規利用者を誤って test 扱いするため既定に含めない。
    var markers = (props.getProperty('TEST_MARKERS') || '+test,+lp-test,+meta-test')
      .split(',').map(function (m) { return m.trim(); }).filter(String);
    var isTest = markers.some(function (m) { return email.indexOf(m) !== -1; });

    // 重複でも監査目的で1行追記し duplicated 列で識別（現行の返却契約を維持）
    appendByHeader_(sheet, {
      registration_id: Utilities.getUuid(),
      timestamp: nowJst_(),
      email: email,
      problem: clip_(data.problem, 64),
      source: source,
      user_agent: clip_(data.userAgent, 300),
      duplicated: duplicated ? 'TRUE' : 'FALSE',
      is_test: isTest ? 'TRUE' : 'FALSE',
      utm_source: clip_(data.utm_source, 200),
      utm_medium: clip_(data.utm_medium, 200),
      utm_campaign: clip_(data.utm_campaign, 200),
      utm_content: clip_(data.utm_content, 200),
      utm_term: clip_(data.utm_term, 200),
      fbclid: clip_(data.fbclid, 200),
      landing_url: clip_(data.landing_url, 300),
      referrer: clip_(data.referrer, 300),
      created_by: CREATED_BY,
      schema_version: SCHEMA_VERSION
    });

    return json_({ success: true, duplicated: duplicated });
  } catch (err) {
    // 例外詳細は外部へ出さない・ログにも本文/PIIは残さない
    return json_({ success: false, error: 'internal_error' });
  } finally {
    try { lock.releaseLock(); } catch (_) {}
  }
}

/** ヘッダー行を保証。既存シートに無いヘッダーは末尾へ追加（列追加に強い）。 */
function ensureHeaders_(sheet) {
  if (sheet.getLastRow() === 0) {
    sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
    sheet.setFrozenRows(1);
    return;
  }
  var lastCol = sheet.getLastColumn();
  var existing = sheet.getRange(1, 1, 1, lastCol).getValues()[0]
    .map(function (h) { return String(h).trim(); });
  HEADERS.forEach(function (h) {
    if (existing.indexOf(h) === -1) {
      sheet.getRange(1, sheet.getLastColumn() + 1).setValue(h);
      existing.push(h);
    }
  });
}

/** ヘッダー名基準で1行追記（列順が変わっても壊れない）。未知フィールドは無視。 */
function appendByHeader_(sheet, obj) {
  var lastCol = sheet.getLastColumn();
  var headers = sheet.getRange(1, 1, 1, lastCol).getValues()[0]
    .map(function (h) { return String(h).trim(); });
  var row = headers.map(function (h) {
    return Object.prototype.hasOwnProperty.call(obj, h) ? obj[h] : '';
  });
  sheet.appendRow(row);
}

/** email 列（ヘッダー名で解決）を走査して重複判定。 */
function emailExists_(sheet, emailHeader, email) {
  var lastCol = sheet.getLastColumn();
  var headers = sheet.getRange(1, 1, 1, lastCol).getValues()[0]
    .map(function (h) { return String(h).trim(); });
  var idx = headers.indexOf(emailHeader);
  if (idx === -1) return false;
  var last = sheet.getLastRow();
  if (last < 2) return false;
  var col = sheet.getRange(2, idx + 1, last - 1, 1).getValues();
  for (var i = 0; i < col.length; i++) {
    if (String(col[i][0]).trim().toLowerCase() === email) return true;
  }
  return false;
}

function nowJst_() {
  return Utilities.formatDate(new Date(), 'Asia/Tokyo', "yyyy-MM-dd'T'HH:mm:ssXXX");
}

function clip_(v, n) {
  return String(v == null ? '' : v).replace(/[\r\n\t]/g, ' ').trim().slice(0, n);
}

function json_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
