/**
 * Contact STORE webhook — dokugakulink.com /contact （提案・未デプロイ）
 * ------------------------------------------------------------------------
 * 目的: /api/contact から届く問い合わせを `contacts` シートへ「記録」する専用 GAS。
 *   メール通知(Resend)とは責務分離。これは「保存」だけを行い、メール送信はしない。
 *   事前登録用 GAS（registration-webhook.gs）とは別プロジェクト・別シークレット・別権限。
 *
 * 冪等性: email では重複除外しない（同一人物の別問い合わせを消さない）。
 *   submission_id をキーに、同一 submission_id が既にあれば追記しない（再送の二重保存防止）。
 *
 * Owner=info@dokugakulink.com。Script Properties:
 *   CONTACT_STORE_SHEET_ID       … 問い合わせ用スプレッドシートID（registrations とは別ファイル推奨）
 *   CONTACT_STORE_SHARED_SECRET  … Vercel CONTACT_STORE_SHARED_SECRET と同値（register とは別値）
 *   （任意）SHEET_NAME=contacts / TEST_MARKERS="+test,+lp-test,+meta-test"
 *
 * 返却: { success:boolean, stored:boolean, duplicate?:boolean, error?:string }
 *   （/api/contact 側は「保存の成否」をメール送信の成否と分けて扱う）
 * PII・本文・例外詳細は外部レスポンス／ログに出さない。
 */

var HEADERS = [
  'contact_id', 'submission_id', 'reference', 'timestamp',
  'name', 'email', 'company', 'contact_type', 'subject', 'message',
  'status', 'owner', 'responded_at',
  'source', 'is_test',
  'utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term',
  'fbclid', 'landing_url', 'referrer', 'user_agent',
  'created_by', 'schema_version'
];
var SCHEMA_VERSION = '1';
var CREATED_BY = 'contact-webhook';
var DEFAULT_STATUS = '未対応';

function doGet() { return json_({ ok: true }); }

function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    if (!e || !e.postData || !e.postData.contents) return json_({ success: false, error: 'bad_request' });
    var data;
    try { data = JSON.parse(e.postData.contents); } catch (_) { return json_({ success: false, error: 'bad_json' }); }

    var props = PropertiesService.getScriptProperties();
    var secret = props.getProperty('CONTACT_STORE_SHARED_SECRET') || '';
    if (!secret || String(data.token || '') !== secret) return json_({ success: false, error: 'unauthorized' });

    var email = String(data.email || '').trim().toLowerCase().slice(0, 254);
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return json_({ success: false, error: 'invalid_email' });
    var name = clip_(data.name, 100);
    if (!name) return json_({ success: false, error: 'missing_name' });

    // submission_id は必須（冪等性の保証キー）。空なら拒否＝シートへ書き込まない。
    // Next.js 側は常に非空の submission_id を送る（無ければサーバーで生成）。
    var submissionId = clip_(data.submission_id, 64);
    if (!submissionId) return json_({ success: false, error: 'missing_submission_id' });

    lock.waitLock(20000);

    var ss = SpreadsheetApp.openById(props.getProperty('CONTACT_STORE_SHEET_ID'));
    var sheet = ss.getSheetByName(props.getProperty('SHEET_NAME') || 'contacts') ||
                ss.insertSheet(props.getProperty('SHEET_NAME') || 'contacts');
    ensureHeaders_(sheet);

    // 冪等: submission_id 一致は追記しない（再送の二重保存防止）。email では判定しない。
    if (valueExists_(sheet, 'submission_id', submissionId)) {
      return json_({ success: true, stored: false, duplicate: true });
    }

    var markers = (props.getProperty('TEST_MARKERS') || '+test,+lp-test,+meta-test')
      .split(',').map(function (m) { return m.trim(); }).filter(String);
    var isTest = markers.some(function (m) { return email.indexOf(m) !== -1; });

    appendByHeader_(sheet, {
      contact_id: Utilities.getUuid(),
      submission_id: submissionId,
      reference: clip_(data.reference, 40),
      timestamp: nowJst_(),
      name: name,
      email: email,
      company: clip_(data.company, 120),
      contact_type: clip_(data.contact_type, 40),
      subject: clip_(data.subject, 160),
      message: clip_(data.message, 5000),
      status: DEFAULT_STATUS,
      owner: '',
      responded_at: '',
      source: clip_(data.source, 64),
      is_test: isTest ? 'TRUE' : 'FALSE',
      utm_source: clip_(data.utm_source, 200),
      utm_medium: clip_(data.utm_medium, 200),
      utm_campaign: clip_(data.utm_campaign, 200),
      utm_content: clip_(data.utm_content, 200),
      utm_term: clip_(data.utm_term, 200),
      fbclid: clip_(data.fbclid, 200),
      landing_url: clip_(data.landing_url, 300),
      referrer: clip_(data.referrer, 300),
      user_agent: clip_(data.userAgent || data.user_agent, 300),
      created_by: CREATED_BY,
      schema_version: SCHEMA_VERSION
    });

    return json_({ success: true, stored: true, duplicate: false });
  } catch (err) {
    return json_({ success: false, error: 'internal_error' });
  } finally {
    try { lock.releaseLock(); } catch (_) {}
  }
}

function ensureHeaders_(sheet) {
  if (sheet.getLastRow() === 0) {
    sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
    sheet.setFrozenRows(1);
    return;
  }
  var lastCol = sheet.getLastColumn();
  var existing = sheet.getRange(1, 1, 1, lastCol).getValues()[0].map(function (h) { return String(h).trim(); });
  HEADERS.forEach(function (h) {
    if (existing.indexOf(h) === -1) { sheet.getRange(1, sheet.getLastColumn() + 1).setValue(h); existing.push(h); }
  });
}

function appendByHeader_(sheet, obj) {
  var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0].map(function (h) { return String(h).trim(); });
  sheet.appendRow(headers.map(function (h) { return Object.prototype.hasOwnProperty.call(obj, h) ? obj[h] : ''; }));
}

function valueExists_(sheet, header, value) {
  var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0].map(function (h) { return String(h).trim(); });
  var idx = headers.indexOf(header);
  if (idx === -1) return false;
  var last = sheet.getLastRow();
  if (last < 2) return false;
  var col = sheet.getRange(2, idx + 1, last - 1, 1).getValues();
  for (var i = 0; i < col.length; i++) if (String(col[i][0]).trim() === value) return true;
  return false;
}

function nowJst_() { return Utilities.formatDate(new Date(), 'Asia/Tokyo', "yyyy-MM-dd'T'HH:mm:ssXXX"); }
function clip_(v, n) { return String(v == null ? '' : v).replace(/[\r\n\t]/g, ' ').trim().slice(0, n); }
function json_(obj) { return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON); }
