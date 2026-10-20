# Search Console：サイトマップとインデックス登録リクエストのURL一覧

- 作成日：2026-10-18
- 根拠：本番の https://www.dokugakulink.com/sitemap.xml を 2026-10-18 に取得した内容（15件）
- 手順の詳細：`OWNER_STEPS.md` の「3. Google に新しいページを読みに来てもらう」

---

## 1. サイトマップとして送信するURL

Search Console の左メニュー **サイトマップ** →「新しいサイトマップの追加」に、次の1つを入れて **送信** します。

```text
https://www.dokugakulink.com/sitemap.xml
```

（入力欄に `https://www.dokugakulink.com/` が最初から表示されている場合は、`sitemap.xml` だけを入れます）

---

## 2. サイトマップに入っているURL（全15件）

Google にサイトマップを送ると、この15件をまとめて読みに来ます。

| # | URL | 更新日（lastmod） |
|---:|---|---|
| 1 | https://www.dokugakulink.com | デプロイした日 |
| 2 | https://www.dokugakulink.com/company | デプロイした日 |
| 3 | https://www.dokugakulink.com/business | デプロイした日 |
| 4 | https://www.dokugakulink.com/services/takken | デプロイした日 |
| 5 | https://www.dokugakulink.com/contact | デプロイした日 |
| 6 | https://www.dokugakulink.com/news | デプロイした日 |
| 7 | https://www.dokugakulink.com/privacy | デプロイした日 |
| 8 | https://www.dokugakulink.com/legal/tokushoho | デプロイした日 |
| 9 | https://www.dokugakulink.com/terms | デプロイした日 |
| 10 | https://www.dokugakulink.com/news/inkan-service-launch | 2026-10-17 |
| 11 | https://www.dokugakulink.com/news/ukareru-app-store-release | 2026-09-20 |
| 12 | https://www.dokugakulink.com/news/beta-registration-open | 2026-06 |
| 13 | https://www.dokugakulink.com/news/takken-app-development-start | 2026-06 |
| 14 | https://www.dokugakulink.com/news/corporate-site-launch | 2026-05 |
| 15 | https://www.dokugakulink.com/news/company-established | 2025-10 |

### サイトマップに入れていないURL（意図どおり）

| URL | 理由 |
|---|---|
| https://www.dokugakulink.com/landing/takken | 広告・SNS専用のページ。検索結果に出さない設定（noindex）にしたため。**インデックス登録はリクエストしない**。 |

---

## 3. 「インデックス登録をリクエスト」の進み具合

画面上の **URL検査** に1件ずつ貼り付けて、**インデックス登録をリクエスト** を押します。1日にリクエストできる数に上限があるため、残りは翌日以降に続けます。

### 済み（2026-10-18）

- [x] https://www.dokugakulink.com/
- [x] https://www.dokugakulink.com/services/takken
- [x] https://www.dokugakulink.com/business
- [x] https://www.dokugakulink.com/company
- [x] https://www.dokugakulink.com/news
- [x] https://www.dokugakulink.com/news/ukareru-app-store-release

### 残り（次回はここから）

- [ ] https://www.dokugakulink.com/news/inkan-service-launch
- [ ] https://www.dokugakulink.com/contact
- [ ] https://www.dokugakulink.com/privacy
- [ ] https://www.dokugakulink.com/terms
- [ ] https://www.dokugakulink.com/legal/tokushoho

### やらなくてよいもの

- 過去のお知らせ4件（#12〜15）：内容は変わっていないので、サイトマップ経由で読まれれば十分です。
- `/landing/takken`：上記のとおりリクエストしない。

---

## 4. 数日後に確認すること

- **サイトマップ** 画面で、`sitemap.xml` のステータスが「成功しました」になり、検出されたページ数が **15** になっている。
- **ページ（インデックス作成）** 画面で、`/landing/takken` が「noindex タグによって除外されました」に入っている（数日〜数週間かかります）。
