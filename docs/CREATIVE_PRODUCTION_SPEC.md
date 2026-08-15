# Creative Production Specification（H1〜H3）

> 目的は「広告素材を作ること」ではなく、H1〜H3 を**実際に広告画像を制作できるレベルまで具体化**すること。
> 本書は設計。画像生成・広告作成・Meta 操作・配信・本番 Deploy は**含まない**。
> 正本参照：`docs/CREATIVE_STRATEGY.md`／`docs/F3_AD_TEST_STRATEGY.md`／AIOS `CONSTITUTION.md`(v1.0)／
> `KPI_SYSTEM.md`／`DEC-WEB-2026-08-14`（First Touch＝Acquisition Memory）／実 LP `src/components/UkareruLP.tsx`／
> ウカレル ブランド記憶辞典（Obsidian 正本）。

## Status

DRAFT — OWNER REVIEW REQUIRED

### 全体前提（必ず維持）

- **H1〜H3 は Core Message そのものではなく「広告仮説」**。Core（会社が届ける価値＝独学でも合格までの現在地が分かる）は前提、H1〜H3 は「どのユーザー心理に、どの表現で当てると登録行動が生まれるか」の検証項目。
- **1 Creative = 1 Message**（複数価値を1枚に詰め込まない）。
- **評価優先順位：`waitlist_submitted > CTR > CPC`**。CTR だけで勝敗を決めない。
- **First Touch = Acquisition Memory / association**（関連性）であり **causal proof ではない**。
- **Product UI を AI で捏造しない**。実在する機能・画面は実 UI を使う。
- 誇張・合格保証・根拠のない数字・過度な不安煽り・競合比較をしない。

---

## 1. Objective

| 仮説 | 検証するユーザー心理 | 提示価値 |
|------|--------------------|---------|
| **H1 — 現在地** | 「自分が合格までどの位置にいるか分からない」不安 | 現在地の可視化 |
| **H2 — 15問だけ。** | 「勉強を続ける負担が大きい」不安 | 小さく始められる |
| **H3 — 忘れた頃に、もう一度** | 「覚えても忘れてしまう」不安 | 適切なタイミングでの復習 |

これらは Core Message の言い換えではなく、独立した**広告仮説**として検証する。

---

## 2. Creative Concept

### H1 — 現在地（`h1_current_position_a`）
```yaml
User_Tension:        独学で「今どこにいる／受かるのか」が見えず不安。
User_Insight:        点数より「合格までの現在地」が見えると安心して続けられる。
Value_Proposition:   今日やるべき学習と、合格までの現在地が分かる。
Single_Message:      独学でも、合格までの「現在地」が分かる。
Hook:                「独学、今どこにいる？」
Supporting_Copy:     今日やるべき学習と、合格までの現在地が分かる。
CTA:                 無料で事前登録
Visual_Concept:      実アプリのホーム/現在地表示を主役に、余白を活かして静かに提示。
UI_Product_Element:  ホーム画面（今日やること）＋合格までの現在地表示（実UI）。
Emotional_Tone:      安心・誠実・前向き（煽らない）。
Understood_in_1_2s:  「宅建・独学の学習アプリで、合格までの現在地が分かる」。
Must_NOT_Communicate: 合格保証／合格率／“必ず受かる”の含意。予測の断定と誤認させない。
```

### H2 — 15問だけ。（`h2_15_questions_a`）
```yaml
User_Tension:        勉強を続ける負担・時間のなさで挫折しやすい。
User_Insight:        「まず15問」の小ささが、始める/続けるハードルを下げる。
Value_Proposition:   今日の15問から、すきま時間でも積み重ねられる。
Single_Message:      今日は、15問だけ。
Hook:                「今日は、15問だけ。」
Supporting_Copy:     今日の15問から。すきま時間でも学習を積み重ねられる。
CTA:                 無料で事前登録
Visual_Concept:      「15問」の軽さを一語で。実UIの“今日の15問”を控えめに添える。
UI_Product_Element:  今日の15問（実UI）。
Emotional_Tone:      軽やか・肯定的（“続けられる”手応え）。
Understood_in_1_2s:  「1日15問だけでいい学習アプリ」。
Must_NOT_Communicate: 「15問で受かる」等の効果断定。手軽さ＝合格保証の誤読。
```

### H3 — 忘れた頃に、もう一度（`h3_recall_timing_a`）
```yaml
User_Tension:        覚えても忘れる。復習のタイミングが自分で分からない。
User_Insight:        忘れる前提で「もう一度」出会えると定着の実感が生まれる。
Value_Proposition:   忘れやすい問題に、適切なタイミングでもう一度出会える。
Single_Message:      忘れた頃に、もう一度。
Hook:                「覚えても、忘れる。だから――」
Supporting_Copy:     忘れた頃に、もう一度出題。解説で“なぜ”まで理解できる。
CTA:                 無料で事前登録
Visual_Concept:      忘却→再出題の“仕組み”を静かに示す。実UI（結果画面の復習表示／今日の15問に混在する復習問題）を根拠に使う。
UI_Product_Element:  復習スケジュール（実装済・テスト済）。回答後に再出題日を算出・保存し、期限到来分を「今日の15問」に優先投入。
Emotional_Tone:      共感・安心（挫折を責めない）。
Understood_in_1_2s:  「忘れた頃に復習できる仕組みがある」。
Must_NOT_Communicate: 「絶対忘れない」等の断定。存在しない画面の偽装。
```

---

## 3. Copy Variants（すべて“検証候補”・勝ちコピーの決定ではない）

制約：短い／一読で分かる／宅建受験者が自分事化／誇張しない／合格保証しない／根拠のない数字を使わない／過度に不安を煽らない／競合比較しない／実際の価値・機能から逸脱しない。

### H1 — 現在地
- **Hook ×3**：①「独学、今どこにいる？」 ②「合格まで、あと何を？」 ③「今日やることが、分かる。」
- **Supporting ×2**：①「今日やるべき学習と、合格までの現在地が分かる。」 ②「正解数だけでなく、合格までの現在地を確認できる。」
- **CTA ×2**：①「無料で事前登録」 ②「リリースをいちばんに受け取る」

### H2 — 15問だけ。
- **Hook ×3**：①「今日は、15問だけ。」 ②「続かない、を変える。まず15問。」 ③「すきま時間で、15問。」
- **Supporting ×2**：①「今日の15問から。すきま時間でも積み重ねられる。」 ②「毎日“今日やること”が決まっているから、迷わない。」
- **CTA ×2**：①「無料で事前登録」 ②「まずは事前登録」

### H3 — 忘れた頃に、もう一度
- **Hook ×3**：①「覚えても、忘れる。だから――」 ②「忘れた頃に、もう一度。」 ③「復習のタイミング、迷わない。」
- **Supporting ×2**：①「忘れやすい問題に、もう一度出会える。」 ②「解説で“なぜ”まで理解して、次に活かす。」
- **CTA ×2**：①「無料で事前登録」 ②「リリースをいちばんに受け取る」

> 注：CTA は現フェーズ＝事前登録に限定。「今すぐ使う／始める」等、公開済みと誤認させる表現は使わない。

---

## 4. Visual Specification

共通ブランド方針：人物を主役にしない／静か／誠実／信頼できる／Product First／実 UI を価値の証拠に使う／過度な広告感を避ける／1枚1メッセージ。

### 共通
```yaml
Canvas_AspectRatio候補: 1:1（フィード）／4:5（フィード・縦優先）／9:16（ストーリー/リール）。初回は 1:1 と 4:5 を基本。
Composition:            上=一言メッセージ / 中=実UIの一要素 / 下=CTA。視線は上→中→下。
Visual_Hierarchy:      ① Single Message → ② UI 証拠 → ③ CTA。
Main_Object:           該当仮説の実UI要素（H1:現在地/ホーム、H2:今日の15問）。
Product_UIの見せ方:     実スクリーンショットをそのまま。加工で機能を偽装しない。
Text_Placement:        Safe Area 内。UI に重ねすぎない。
Background_Direction:   無地〜微グラデの落ち着いた基調（LP 整合）。原色の煽り配色は不可。
Typography_Direction:   可読性優先のゴシック。1〜2 ウェイト。装飾過多にしない。
Information_Density:     低（1メッセージ＋1 UI＋1 CTA）。3秒で伝わる情報量。
Mobile_Feed可読性:       小さい表示でも Hook が読める字サイズ・コントラスト。
Safe_Area:              各配置比の上下トリミング/UIオーバーレイを避ける余白を確保。
禁止表現:               人物の主役化・合格者演出／合格率・順位などの数字捏造／
                       競合比較／過度な不安演出／存在しない画面の合成。
```

### 仮説別の要点
- **H1**：中央に「現在地」表示（実UI）。メッセージは「現在地が分かる」に集中。
- **H2**：「15」を視覚的アンカーに。実UI“今日の15問”を小さく添える。詰め込まない。
- **H3**：忘却→再出題の時間経過を最小限の図で示す。**実UIが無い機能を画面として偽装しない**（概念図と明示）。

---

## 5. Creative Variants（初回）

初回検証は本数を増やさず **3 Creative**：`H1-A` / `H2-A` / `H3-A`。

- これは**デザイン違いではなく「価値仮説違い」の比較**。各1枚で H1/H2/H3 の心理仮説を当てる。
- Meta は同一広告セット内でも**均等配信するとは限らない**。厳密比較（Pattern A）と Meta 最適化（Pattern B）は別物。初回は学習目的（F3 Phase: Validation）。
- デザインの微差（色・レイアウト違い）による比較は、価値仮説の勝ち筋が見えた後段（Winner Discovery 以降）に回す。

---

## 6. Measurement Mapping（今回は広告・URL・Meta 設定を変更しない）

各 Creative を将来の `utm_content` に接続できる形で識別子化する。

| Creative ID | Hypothesis | Message | utm_content（将来） | 転換イベント |
|-------------|-----------|---------|--------------------|-------------|
| `h1_current_position_a` | H1 現在地 | 独学でも合格までの現在地が分かる | `h1_current_position_a` | `waitlist_submitted`（== Meta Lead 1:1） |
| `h2_15_questions_a` | H2 15問だけ | 今日は、15問だけ。 | `h2_15_questions_a` | `waitlist_submitted` |
| `h3_recall_timing_a` | H3 忘れた頃に | 忘れた頃に、もう一度 | `h3_recall_timing_a` | `waitlist_submitted` |

追跡経路：`Creative ID → Hypothesis → Message → utm_content → waitlist_submitted`。
- GA4/PostHog は first-touch UTM（`utm_content` 含む）で分解、Meta は ad 単位指標で補完。
- **First Touch = Acquisition Memory / association。causal proof ではない**（初回接触と登録の関連であり、そのクリエイティブが登録を“引き起こした”証明ではない）。
- 本書では URL・Meta・実装を変更しない。命名規約の提案のみ。

---

## 7. Evaluation Principle

```
1. waitlist_submitted   （最優先：価値が行動を生んだか）
2. CTR                  （注意・訴求適合の代理）
3. CPC                  （効率・相対比較のみ）
```
- **CTR だけで勝敗を決めない**。高 CTR でも登録に繋がらなければ「強いユーザー価値シグナル」とは判断しない。
- **データ量が不足している場合は Winner / Loser と断定せず「Need More Data」**として扱う（CD-4：数値閾値 DEFERRED）。

---

## 8. Production Readiness

### H1 — 現在地
```yaml
必要なUIスクショ:      ホーム（今日やること）／合格までの現在地表示（最新ビルド実UI）。
必要なブランド素材:     ロゴ、ブランド配色/余白テンプレート。
Owner確認が必要な文言:  「現在地が分かる」表現の可否（“可能性/予測”と誤認させない範囲）。
ImageGen可の要素:      背景の抽象・余白・非UIの装飾のみ。
実UIから取得すべき要素:  現在地表示・ホーム。
AI生成禁止:            Product UI（画面・数値・グラフ）。実在画面のみ使用。
```
### H2 — 15問だけ。
```yaml
必要なUIスクショ:      今日の15問（実UI）。
必要なブランド素材:     ロゴ、配色テンプレート。
Owner確認が必要な文言:  「15問だけ」を効果断定と誤読させないか。
ImageGen可の要素:      「15」のタイポ演出・背景装飾（UIでない部分）。
実UIから取得すべき要素:  今日の15問画面。
AI生成禁止:            出題画面・問題文・数値の捏造。
```
### H3 — 忘れた頃に、もう一度（Product Fact: SUPPORTED）
```yaml
必要なUIスクショ:      結果画面の“復習に追加されました／復習バッジ”、今日の15問（期限到来の復習問題を含む）。
必要なブランド素材:     ロゴ、配色テンプレート。
Owner確認が必要な文言:  「忘れた頃に」を科学的精度（忘却曲線/SM-2 等）まで含意しないか。
                      現行は単純な間隔表（3/7/14/30日）。事実（間隔を空けて再出題／解いた問題が後日また出る）の範囲で表現。
ImageGen可の要素:      忘却→再出題の“概念図”（実画面と誤認させない図解）。
実UIから取得すべき要素:  結果画面の復習表示・今日の15問（実在・実装済）。
AI生成禁止:            存在しない復習画面、または間隔/日数など数値の捏造。
```

> ★H3 Product Fact（2026-08-16 コード検証済・**SUPPORTED**）：復習スケジュール機能は実装・テスト済で、ユーザー体験にも表出する。
> `ReviewScheduleService.computeReviewDueAt`（confidence × 正誤 × reviewCount → 3/7/14/30日 or 卒業）で再出題日を算出し、
> `quiz_provider` が回答後に Firestore `users/{uid}/reviewSchedule` へ `reviewDueAt` を保存、`today_question_service.generate`
> が期限到来の復習問題を「今日の15問」に優先投入する。結果画面の“復習に追加”・復習バッジ、topic_list の復習優先で
> ユーザーにも表出する（→ H3 の実UIは実在）。ただし表現は事実の範囲に留め、忘却曲線/AI 等の科学的精度を過大に含意しない（§5 No Fabrication）。

---

## Quality Rules（遵守）

広告成果予測をしない／CPA を保証しない／勝ちクリエイティブを断定しない／配信設定をしない／予算判断をしない。
本書は設計のみ。画像/動画/広告素材制作・Meta 操作・Campaign/Ad Set/Ad/Audience・Budget・広告配信・本番 Deploy は含まない。
