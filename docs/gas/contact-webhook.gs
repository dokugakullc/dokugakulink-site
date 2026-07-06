/**
 * Contact form webhook for dokugakulink.com (/contact)
 * ------------------------------------------------------------
 * /api/contact から { name, email, message, timestamp } を受け取り、
 * 問い合わせ内容をサポート宛にメール送信する専用スクリプト。
 * （LP登録保存用の GAS_WEBHOOK_URL とは別物・分離すること）
 *
 * デプロイ手順:
 *   1. https://script.google.com で新規プロジェクトを作成
 *   2. このコードを Code.gs に貼り付けて保存
 *   3. 「デプロイ」→「新しいデプロイ」→ 種類: ウェブアプリ
 *        - 説明: contact webhook
 *        - 次のユーザーとして実行: 自分
 *        - アクセスできるユーザー: 全員
 *   4. 初回は権限承認（Gmail送信の許可）が必要
 *   5. 発行された /exec で終わる URL を控える
 *   6. その URL を Vercel の CONTACT_WEBHOOK_URL(Production) に設定
 *
 * 動作確認: ブラウザで /exec を開くと {"ok":true} が返ればデプロイ成功。
 *
 * 迷惑メール対策メモ:
 *   - MailApp は差出人を実行アカウント(@gmail 等)に固定する（from偏光は不可）。
 *   - name（表示名）と replyTo（送信者本人）のみ指定する。
 *   - プレーンテキスト(body)とHTML(htmlBody)を両方付ける（マルチパート）。
 *   - 根本的なドメイン認証(SPF/DKIM/DMARC)が要るなら送信基盤の切替を検討。
 */

// 通知の届く先（実際に受信するボックス）
var SUPPORT_TO = 'support@dokugakulink.com';

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var name = String(data.name || '').trim();
    var email = String(data.email || '').trim();
    var message = String(data.message || '').trim();
    var timestamp = String(data.timestamp || new Date().toISOString());

    if (!name || !email || !message) {
      return json({ success: false, error: 'missing required fields' });
    }

    var subject = '【ウカレル】新しいお問い合わせ（' + name + ' 様）';

    // プレーンテキスト版（必須・スパム対策のマルチパート用）
    var body =
      'お問い合わせフォームに新しい送信がありました。\n\n' +
      '■ お名前\n' + name + '\n\n' +
      '■ メールアドレス\n' + email + '\n\n' +
      '■ お問い合わせ内容\n' + message + '\n\n' +
      '■ 受信日時\n' + timestamp + '\n\n' +
      '------------------------------------------------------------\n' +
      'このメールは dokugakulink.com のお問い合わせフォームから自動送信されました。\n' +
      '「返信」すると送信者本人（' + email + '）宛に返信されます。';

    // HTML版
    var htmlBody =
      '<div style="font-family:sans-serif;font-size:14px;line-height:1.7;color:#0d2545;">' +
        '<p style="margin:0 0 16px;">お問い合わせフォームに新しい送信がありました。</p>' +
        '<table style="border-collapse:collapse;width:100%;max-width:560px;">' +
          row_('お名前', esc_(name)) +
          row_('メールアドレス', '<a href="mailto:' + esc_(email) + '">' + esc_(email) + '</a>') +
          row_('お問い合わせ内容', esc_(message).replace(/\n/g, '<br>')) +
          row_('受信日時', esc_(timestamp)) +
        '</table>' +
        '<p style="margin:16px 0 0;color:#6b7280;font-size:12px;">' +
          'このメールは dokugakulink.com のお問い合わせフォームから自動送信されました。' +
          '「返信」すると送信者本人宛に返信されます。' +
        '</p>' +
      '</div>';

    MailApp.sendEmail({
      to: SUPPORT_TO,
      subject: subject,
      body: body,           // プレーンテキスト
      htmlBody: htmlBody,    // HTML（両方付ける）
      replyTo: email,        // 返信でそのまま問い合わせ者へ返せる
      name: 'ウカレル お問い合わせ'
    });

    return json({ success: true });
  } catch (err) {
    return json({ success: false, error: String(err) });
  }
}

// デプロイ動作確認用（ブラウザでURLを開いたとき）
function doGet() {
  return json({ ok: true });
}

// 手動実行用テスト（エディタのドロップダウンで選び ▶実行 する）
// 初回の権限承認 & support@ の受信確認に使う。
function testSend() {
  MailApp.sendEmail({
    to: SUPPORT_TO,
    subject: '【ウカレル】送信テスト',
    body: 'これはGAS単体の送信テストです。このメールが届けば送信・受信ともに正常です。',
    htmlBody: '<p>これはGAS単体の送信テストです。このメールが届けば送信・受信ともに正常です。</p>',
    name: 'ウカレル お問い合わせ'
  });
}

function row_(label, value) {
  return '<tr>' +
    '<td style="padding:8px 12px;border:1px solid #e5e7eb;background:#f5f7fa;white-space:nowrap;font-weight:bold;">' + label + '</td>' +
    '<td style="padding:8px 12px;border:1px solid #e5e7eb;">' + value + '</td>' +
  '</tr>';
}

function esc_(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function json(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
