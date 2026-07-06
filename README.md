This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## お問い合わせメール（Resend）

`/contact` の送信フォーム（`src/app/api/contact/route.ts`）は **Resend** でメールを送信する。
`RESEND_API_KEY` が設定されていれば Resend を使用し、未設定時のみ従来の GAS Webhook
（`CONTACT_WEBHOOK_URL` / `GAS_WEBHOOK_URL`）にフォールバックする。

送信内容:

- From: `ウカレル サポート <support@dokugakulink.com>`
- To: `support@dokugakulink.com`
- Reply-To: フォーム入力者のメールアドレス
- 件名: `【ウカレル】新しいお問い合わせ（氏名）`
- 本文: HTML（カード形式）＋プレーンテキストの両方

### 1. Resend 設定

1. [resend.com](https://resend.com) でアカウント作成
2. **Domains → Add Domain** で `dokugakulink.com` を追加
3. 表示された DNS レコード（SPF/DKIM）を Cloudflare に追加（下記）→ **Verify**
4. **API Keys → Create** で `Sending access` のキーを発行（`re_...`）

### 2. Cloudflare DNS

Resend のダッシュボードに表示される値を正としてコピーする（DKIM の公開鍵はドメインごとに固有）。
既存の受信用 MX（Cloudflare Email Routing）はそのまま残す。Resend は送信用に
`send` サブドメインを使うため衝突しない。

| Type | Name | Value | 備考 |
| --- | --- | --- | --- |
| TXT | `send` | `v=spf1 include:amazonses.com ~all` | 送信用SPF |
| MX | `send` | `feedback-smtp.<region>.amazonses.com`（優先度10） | バウンス受信 |
| TXT | `resend._domainkey` | `p=<Resendが発行するDKIM公開鍵>` | DKIM署名 |
| TXT | `_dmarc` | `v=DMARC1; p=none; rua=mailto:support@dokugakulink.com` | DMARC（監視から開始） |

> `<region>` と DKIM 公開鍵は Resend の Domain 詳細画面に表示される実値を使う。
> Cloudflare でレコード追加時は **Proxy status を「DNS only」**（グレー雲）にする。

### 3. Vercel Environment Variables

Production に以下を設定（Preview/Development にも必要なら追加）:

| Key | 値 | 用途 |
| --- | --- | --- |
| `RESEND_API_KEY` | `re_...` | Resend 送信キー（優先経路） |
| `CONTACT_WEBHOOK_URL` | `https://script.google.com/.../exec` | フォールバック（任意・移行後は削除可） |

```bash
# CLI で追加する場合
printf "re_XXXX" | vercel env add RESEND_API_KEY production
```

env を追加・変更したら **再デプロイ**（新しいコミット push か Vercel の Redeploy）で反映する。

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
