# Owner 作業の手順（ウカレル配信開始のサイト改修）

作成日：2026-10-18。上から順番に進めてください。

---

## 1. 本番サイトを「配信中」表示に切り替える（Vercel）

**順番が大事です。** 先に環境変数を入れてから PR をマージすると、マージ時の自動デプロイ1回で切り替わります。

### 1-1. 環境変数を入れる

1. https://vercel.com を開き、`dokugakulink-site` のプロジェクトを開く
2. 上のメニューの **Settings** → 左の **Environment Variables**
3. 次のとおり入力する
   - **Key**：`NEXT_PUBLIC_UKARERU_RELEASED`
   - **Value**：`1`
   - **Environments**：**Production だけ**にチェック（Preview と Development のチェックは外す）
4. **Save** を押す

※ 入れただけでは本番は変わりません。次の手順のデプロイで反映されます。

### 1-2. PR をマージする（＝本番へデプロイ）

1. https://github.com/dokugakullc/dokugakulink-site/pull/27 を開く
2. 下の **Merge pull request** → **Confirm merge** を押す
3. Vercel の **Deployments** を開き、一番上の Production のデプロイが **Ready** になるまで待つ（数分）

**もしマージ後に自動でデプロイされなかったら**：Deployments の一番上（Production）の右の「⋯」→ **Redeploy** → もう一度 **Redeploy**。

### 1-3. 切り替わったか確認する

スマホでも PC でも開いて、次を確かめてください。

| 開くページ | 確認すること |
|---|---|
| https://www.dokugakulink.com/services/takken | 一番上に黒い「App Store からダウンロード」のバッジがある。メールアドレスの入力欄がない |
| https://www.dokugakulink.com/landing/takken | 同上 |
| バッジを押す | App Store のウカレルのページが開く |
| https://www.dokugakulink.com/ | ウカレル欄が「配信中」になっている |
| https://www.dokugakulink.com/news | 先頭が「電子印鑑作るさん」、2番目が「ウカレルをApp Storeで配信開始しました」 |
| iPhone の Safari で /services/takken | 画面の上に App Store のバナー（ウカレル・開く）が出る |

### もとに戻したいとき

Settings → Environment Variables で `NEXT_PUBLIC_UKARERU_RELEASED` の値を `0` に変えて Save → Deployments の一番上で **Redeploy**。

---

## 2. App Store の説明文の無料期間の表現をそろえる（App Store Connect）

### 何を変えるか

【プレミアムプラン】の段落に、**「無料期間が終わっただけで自動的に課金されることはありません。」** の一文を足します。サイト（LP・利用規約・特商法）と同じ説明にするためです。差し替え後の全文は `docs/marketing/app-store-metadata-ja.md` の最後にあります。

### 注意：説明文は「次のアップデート」でしか変えられません

公開中のバージョン（1.0.0）の **説明文** は、Apple の仕組み上、そのままでは編集できません。新しいバージョン（例：1.0.1）を作って審査に出すときに一緒に変えます。

### 手順（次のアップデートのとき）

1. https://appstoreconnect.apple.com → **アプリ** → **ウカレル**
2. 左の「iOS アプリ」の **＋** で新しいバージョン（例：1.0.1）を作る
3. そのバージョンのページの **説明** 欄で、【プレミアムプラン】の段落を差し替える（全文は `docs/marketing/app-store-metadata-ja.md`）
4. ビルドを選んで審査に提出する

### 今すぐ何かしたい場合（任意）

**プロモーション用テキスト**（説明文の上に出る170文字までの文）は、審査なしでいつでも変えられます。ただし今の文はアピール用なので、無理に変えなくて大丈夫です。

---

## 3. Google に新しいページを読みに来てもらう（Search Console）

**手順1で本番が「配信中」になってから** 行ってください。

### 3-1. サイトマップを送り直す

1. https://search.google.com/search-console を開き、`dokugakulink.com` のプロパティを選ぶ
2. 左の **サイトマップ**
3. 「新しいサイトマップの追加」に `sitemap.xml` と入れて **送信**（すでにある場合も送り直してかまいません）

### 3-2. 主要ページの「インデックス登録をリクエスト」

1. 画面上の検索欄（「URL検査」）に、下の URL を1つ貼り付けて Enter
2. 結果が出たら **インデックス登録をリクエスト** を押す（1〜2分かかります）
3. 次の URL で繰り返す

```text
https://www.dokugakulink.com/
https://www.dokugakulink.com/services/takken
https://www.dokugakulink.com/business
https://www.dokugakulink.com/company
https://www.dokugakulink.com/news
https://www.dokugakulink.com/news/ukareru-app-store-release
https://www.dokugakulink.com/news/inkan-service-launch
https://www.dokugakulink.com/contact
https://www.dokugakulink.com/privacy
https://www.dokugakulink.com/terms
https://www.dokugakulink.com/legal/tokushoho
```

※ 1日にリクエストできる数には上限があります。「割り当て超過」と出たら、翌日に残りを行ってください。上から順に大事なページです。

### `/landing/takken` について

**リクエストしないでください。** このページは「検索結果に出さない」設定にしたので、Google が次に読みに来たときに自然に検索結果から外れます（数日〜数週間）。広告からのリンクはこれまでどおり使えます。
