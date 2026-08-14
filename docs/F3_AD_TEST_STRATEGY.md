# F3 — Meta 広告検証戦略（F3_AD_TEST_STRATEGY）

> 目的は「広告を出すこと」ではなく、**広告から何を学び、次の意思決定へどうつなげるか**を明確化すること。
> 本書は設計ドキュメントであり、広告作成・配信・予算投入・Campaign 作成・本番 Deploy は**含まない**。
> 正本参照：AIOS `00_Foundation/CONSTITUTION.md`（v1.0）／`08_Roadmap/KPI_SYSTEM.md`／
> Website Decision Log `DEC-WEB-2026-08-14`（First Touch Attribution）。

## Status

DRAFT —（commit / push は別承認。本ファイルは作成のみ）

---

## Step 0 — Existing Context

```yaml
User_Value_Principle:   Constitution §4/§14(Case A) = User Value 最優先。§13/§15 = ユーザーの喜び(量×質)が
                        最終成功。P14 = 必要な人へ徹底的に届ける。
Evidence_Rule:          §5 = 推測で結論を確定しない（Fact→Interpretation→Decision を分離）。
                        §6 = 速く出して学ぶ（不可逆は Risk に従う）。P11 = 競合を理由に判断しない。
Decision_Process:       広告開始・大幅予算変更 = HIGH / L3（CEO 承認）。本書は設計＝副作用なし。
                        Experiment System: 仮説 → 検証 → 学習 → 判断。
Attribution_Model:      DEC-WEB-2026-08-14 = First Touch（localStorage TTL 7日）。
                        ＝ Acquisition Memory（初回接触の記録）であって Causal Proof ではない。
Measurement_Availability:
  - waitlist_submitted（成功時のみ）== Meta "Lead" 1:1（重複・失敗は Lead 非発火）
  - GA4 / PostHog に first-touch UTM（utm_content=クリエイティブ枝番 含む）付与
  - Meta へは source / variant のみ送信 → クリエイティブ別比較は
    「Meta 広告マネージャの ad 単位指標」＋「GA4/PostHog を utm_content で分解」の二経路
  - fbclid はブラウザ計測へ送らずサーバー側のみ保持
  - ⚠ App 未公開のため install 以降（継続・学習行動・Premium）は現時点で観測不可
  - ⚠ 過去 CPA データなし（CD-4: 数値閾値 DEFERRED）
```

---

## 1. 広告目的（Primary / Secondary）

現フェーズ＝App Store 公開前・事前登録（waitlist）フェーズ。install 以降の価値指標は未観測、過去 CPA なし。
最初の広告費は「獲得の最大化」ではなく、**ユーザー価値仮説の検証**に投じる（§4 User Value 最優先・§5/§6・Experiment System）。

```yaml
Primary_Objective:
  ユーザー価値仮説の検証（最上位）
  ＝「合格ナビ／自分の合格可能性が分かる」等の価値仮説が、宅建受験者に
    "事前登録" という行動を生むかを検証する。
  （"学習" は手段。検証する対象はユーザー価値仮説そのもの。）
Secondary_Objective:
  - クリエイティブ / メッセージ適合の学習（どの訴求が価値仮説を最も引き出すか）
  - 事前登録獲得（価値仮説検証の測定可能なプロキシ・初期 waitlist 形成）
  - LP 流入ファネルデータ取得（到達 → CTA → 開始 → 登録の各段の把握）
```

**理由**：登録数や CTR を第一目的に置くと、データ皆無の段階で「獲得」を追い学びのない出稿になりやすい。
最上位に**ユーザー価値仮説の検証**を置き、その"物差し"として登録（最も強いユーザー行動シグナル）を用いる
＝ 獲得は結果、価値検証が目的（Constitution §4/§13）。

---

## 2. 検証仮説一覧

Message はブランド正本に接地：「合格ナビ／合格可能性が分かる」「15問だけ。」「忘れた頃に、もう一度出題」。
誇張・未確認合格率は禁止。すべて **First Touch = Acquisition Memory（関連性）** 前提で解釈する（因果を主張しない）。

| Hypothesis_ID | Target | Message | Creative | Expected_User_Action | Evidence_To_Collect | Decision_If_Confirmed | Decision_If_Rejected |
|---|---|---|---|---|---|---|---|
| **H1** | 宅建受験者（独学中心） | 「自分の合格可能性が分かる」 | 合格可能性を可視化する画面イメージ（人を写さない・名詞タイトル） | クリック → LP 到達 → 事前登録 | waitlist_submitted（utm_content別）→ CTR → CPC | 合格可能性訴求を主軸に採用し次段で深掘り | 訴求軸を H2/H3 へ切替え、合格可能性は補助へ |
| **H2** | 学習継続に不安がある層 | 「15問だけ。」（低負荷・続けやすさ） | 1日15問の軽さを示す静止画 | クリック → 登録 | waitlist_submitted（utm_content別）→ CTR → CPC | 低負荷訴求を有効軸として拡張 | 主軸にせず価値/合格可能性訴求へ寄せる |
| **H3** | 暗記で挫折経験のある層 | 「忘れた頃に、もう一度出題」（想起・復習設計） | 忘却 → 再出題の仕組み図 | クリック → 登録 | waitlist_submitted（utm_content別）→ CTR → CPC | 仕組み訴求で差別化を強化 | 仕組み説明は LP 内へ後退、広告は便益訴求 |
| **H4** | 独学者 vs 通信講座離脱者（層 × 訴求の交差） | H1〜H3 をセグメント別に出し分け | 各訴求のバリアント | クリック → 登録 | セグメント × utm_content の登録関連性差 | 反応の高い(層×訴求)へ配分を寄せる | セグメント差が非有意なら訴求単体で判断 |

---

## 3. 評価指標の優先順位（Evaluation Priority）

意思決定は次の優先順位で読む。**登録（行動）を最上位**とし、CTR・CPC は補助。

```
waitlist_submitted  >  CTR  >  CPC
```

- **waitlist_submitted（最優先）**：最も強いユーザー行動シグナル。North Star（ユーザーの喜び）に最も近く、
  価値仮説が"行動"を生んだかを示す（== Meta Lead 1:1）。utm_content で訴求別に関連を読む。
- **CTR（次位）**：メッセージ/クリエイティブの注意喚起・訴求適合の代理。ただしクリックは登録を保証しない。
- **CPC（最下位）**：効率指標。相対比較にのみ使用し、**保証値・目標値としては扱わない**（CD-4 DEFERRED）。

理由：KPI_SYSTEM.md の階層（Conversion > Leading）と §4 User Value 最優先に整合。安いクリックより「価値に反応した登録」を上に置く。

---

## 4. Creative Test 方式（Pattern A / B）

| | Pattern A（厳密比較型） | Pattern B（Meta 最適化型） |
|---|---|---|
| 目的 | どの訴求/画像が反応されるかを**学ぶ** | 最終成果（獲得効率）最大化 |
| 配信 | 比較的均等・最適化を抑制 | Meta AI が勝ち面へ寄せる |
| 向き | 勝者発見・学習 | 獲得効率 |
| 弱み | 結果あたり単価が割高になりやすい | クリエイティブ単体比較が困難 |

**採用：初期は Pattern A（学習優先）→ 勝者確定後に Pattern B（最適化）へ移行。**

Evidence ベースの理由：
1. 過去データ皆無（CPA・勝ちクリエイティブ未知）。段階目的は学習（§5/§6・Experiment System）。
2. Pattern B は転換ボリューム前提。プリローンチの登録数では Meta 最適化に必要なコンバージョン量が不足しやすい。
3. クリエイティブ別学習が計測上可能：utm_content（first-touch）が GA4/PostHog の waitlist_submitted に載り、
   Meta 広告マネージャに ad 単位指標もある → Pattern A の関連性測定が実測できる。
4. Pattern B 単独は配信が偏り、訴求単体を切り分けられない → 学習目的に反する。

---

## 5. Phase 設計（Validation → Winner Discovery → Optimization → Scale）

```
Phase 1  Validation        価値仮説とメッセージ適合を検証する（Pattern A・均等配信）。
                           主指標 = waitlist_submitted（utm_content別）。学びが出るまで。
   ↓
Phase 2  Winner Discovery   訴求/クリエイティブの"勝ち筋"を発見する（相対比較で優劣を確定）。
                           一貫して高い登録関連性＋CTR を示す訴求を特定。
   ↓
Phase 3  Optimization       勝ち訴求で Pattern B（Meta 最適化）へ移行し、獲得効率を上げる。
                           転換ボリュームが最適化に足る段階で実施。
   ↓
Phase 4  Scale              成果が安定したら予算を拡大する。
                           予算拡大・大幅変更は HIGH / L3 = CEO 承認（実データ蓄積後）。
```

各 Phase の遷移は §7 Success / Failure Criteria のシグナルで判断する。前 Phase の学びが出ない場合は
仮説（§2）を差し替えて再検証（失敗も学び・§11）。

---

## 6. Target Hypothesis（競合を理由にしない・§10/P11）

```yaml
Audience:          宅建（宅地建物取引士）試験の受験者。まずは独学中心・学習継続に不安のある層。
User_Problem:      「今の自分が受かるか分からない」「暗記しても忘れる」「続けられるか不安」。
Current_Behavior:  市販テキスト/過去問アプリ/通信講座で独学。進捗と合格可能性が見えず、
                   忘却で手応えが得られず離脱しやすい。
Why_Ukareru:       合格可能性を可視化する"合格ナビ"＋「忘れた頃に、もう一度出題」の想起設計＋
                   「15問だけ。」の低負荷継続。ユーザーがまだ言語化していない
                   「見通しの不安」への価値提供（P4）。
Message:           「自分の合格可能性が分かる」を主軸候補（H1）に、H2/H3 を訴求バリアントで検証。
```
判断根拠は競合動向ではなく、ユーザーの問題と価値仮説（P11）。対象を広げず、必要な受験者へ徹底（P14）。

---

## 7. KPI Framework（KPI_SYSTEM.md 接続・CPA 予測禁止）

```yaml
Leading_Metrics（先行・Weekly）:
  - Impression / Reach
  - CTR（訴求の反応）
  - CPC（相対比較のみ・保証値でない）
  - LP_View（landing_page_view）／到達率
Funnel（LP内・段階把握）:
  - waitlist_cta_clicked → waitlist_form_started → waitlist_submitted
Conversion_Metrics:
  - waitlist_submitted（== Meta Lead 1:1、成功時のみ）
  - utm_content 別の登録関連性（GA4/PostHog、first-touch = Acquisition Memory）
User_Value_Metrics（将来・App 公開後に観測／現在は不可）:
  - 継続（retention）／学習行動／Premium conversion
```
これらは North Star（ユーザーの喜び 量×質）の**代理指標**。数字は目的でなく、
Question → Evidence → Decision へ必ずつなぐ（Vanity 化させない）。**CPA の予測値・保証値は書かない**。

---

## 8. Budget Decision Framework（金額でなく"判断方法"）

保証（「月◯円で◯件」等）は書かない。予算は"獲得"ではなく**"学習に必要な情報量"から逆算**する枠組み。

```yaml
Assumption:
  - 初期出稿の目的は価値仮説検証。各クリエイティブ/セグメントが相対比較に足る
    インプレッション/クリック量に達すれば足りる。
Unknown:
  - 実 CTR / 実 CPC / LP CVR / 登録関連性の水準（未実測）
  - Meta 審査・配信の実挙動、クリエイティブ本数に対する必要露出量
Required_Data:
  - Phase 1(Validation) の短期配信で得る：クリエイティブ別 Impression/CTR/CPC、
    LP 到達、utm_content別 waitlist_submitted
Decision_Point:
  - 各クリエイティブが相対比較に足るクリック量に達したか → 継続/停止/再配分
  - 学びが出た → Phase 3(Optimization) へ配分移行を判断
  - 予算の増減・大幅変更は HIGH / L3 = CEO 承認
```

---

## 9. Success / Failure Criteria（固定数値なし・CD-4 DEFERRED）

数値閾値は設定しない（実データ蓄積後に CD-4 で定義）。相対・方向性シグナルで記述。

```yaml
Success_Signal:
  - ある訴求/クリエイティブが、他より一貫して高い waitlist_submitted 関連性（＋補助的に CTR）を示す
  - ファネル各段（到達→CTA→開始→登録）が想定どおり流れ、極端な離脱段がない
  - 本番でも Meta Lead == waitlist_submitted の 1:1 整合が維持（計測健全性）
Failure_Signal:
  - どの訴求も登録関連性に差が出ず学びが得られない（仮説の見直し）
  - クリックは来るが LP 到達/登録に繋がらない（LP またはメッセージ整合の問題）
  - 計測不整合（Lead ≠ submitted、utm_content 欠落）→ まず計測を止めて是正
Need_More_Data:
  - クリエイティブ別クリック量が相対比較に不足（露出が薄い）→ 期間/配分を調整して継続
Next_Action:
  - 勝ち訴求が出た → Phase 2→3（Optimization）へ移行を提案（L3 判断）
  - 学びが出ない → 仮説(§2)を差し替えて再検証（失敗も学び・§11）
  - 計測不整合 → 出稿を止め、実装/DEC 側で是正（不確実は先に Evidence）
```

---

## 10. 未確定事項

- 本番 Pixel の実受信確認（公開後・Owner が F3 実測で確認）
- 実 CTR / CPC / LP CVR / 登録関連性の水準（未実測）
- 予算の具体額・クリエイティブ本数（L3 判断・CD-4 DEFERRED）
- App 公開後の User Value 指標（現在観測不可）
- Cookie 同意（配信地域が EU/EEA を含む場合の CMP 要否）
- Success/Failure の数値閾値（実データ蓄積後に CD-4 で確定）

---

## Rules（遵守事項）

推測で成果予測しない／CPA 保証しない／広告配信しない／予算投入しない／実装変更しない／
Decision Log（First Touch = Acquisition Memory・関連性であり因果でない）に反する判断をしない。
本書は設計のみ。広告作成・Meta 設定変更・Campaign 作成・本番 Deploy は含まない。
