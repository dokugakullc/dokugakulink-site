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

    var subject = '【ウカレル お問い合わせ】' + name + ' 様';
    var body =
      'お問い合わせフォームに新しい送信がありました。\n\n' +
      '■ お名前\n' + name + '\n\n' +
      '■ メールアドレス\n' + email + '\n\n' +
      '■ お問い合わせ内容\n' + message + '\n\n' +
      '■ 受信日時\n' + timestamp + '\n\n' +
      '------------------------------------------------------------\n' +
      'このメールは https://www.dokugakulink.com/contact から自動送信されました。\n' +
      '「返信」すると送信者本人（上記メールアドレス）宛に返信されます。';

    MailApp.sendEmail({
      to: SUPPORT_TO,
      subject: subject,
      body: body,
      replyTo: email,          // 返信でそのまま問い合わせ者へ返せる
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

function json(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
