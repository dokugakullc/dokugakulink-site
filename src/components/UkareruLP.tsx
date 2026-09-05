import Image from "next/image";
import EmailForm from "@/components/EmailForm";
import CtaLink from "@/components/CtaLink";
import AppStoreCta from "@/components/AppStoreCta";
import LPInit from "@/components/LPInit";
import LpShotsCarousel from "@/components/LpShotsCarousel";
import { WAITLIST_GUIDE_TITLE } from "@/lib/waitlistGuide";
import { isUkareruReleased } from "@/lib/ukareruRelease";

const FAQ = [
  {
    q: "ウカレルは何のアプリですか？",
    a: "宅地建物取引士（宅建）試験の独学者に向けた学習アプリです。今日やるべき学習、合格までの現在地、苦手分野が分かり、働きながらでも迷わず学習を進められます。",
  },
  {
    q: "いつリリースされますか？",
    a: "現在、App Storeでの公開に向けた手続きを進めています。公開時期はAppleの審査状況により前後するため、確定した日付はお伝えできません。公開開始は、事前登録いただいたメールアドレスへお知らせします。",
  },
  {
    q: "利用料金はいくらですか？",
    a: "プレミアムプランは月額580円（税込）です。登録から30日間は、すべての機能を無料で利用できます。30日を過ぎても、今日の15問と学習履歴の閲覧は無料でそのまま続けられ、無料期間の終了を理由に自動で課金されることはありません。プレミアム機能をご利用になる場合のみ、Apple App内課金で任意にご加入いただけます。加入後は解約されるまで自動更新され、いつでも解約できます。",
  },
  {
    q: "開発はどこまで進んでいますか？",
    a: "アプリ本体は完成し、App Storeでの公開に向けた手続きを進めています。審査の期間と結果はAppleの判断によるため、公開日を確約することはできません。",
  },
  {
    q: "どの資格に対応していますか？",
    a: "宅地建物取引士（宅建）試験に対応しています。",
  },
  {
    q: "事前登録すると何が届きますか？",
    a: "登録が完了した画面で、すぐに「宅建独学・15問活用ガイド」（PDF・2ページ）をお受け取りいただけます。そのあとは、App Store 審査への提出状況と、公開開始のお知らせをメールでお送りします。継続的な宣伝メールを大量に送ることはありません。",
  },
  {
    q: "登録後に解除できますか？",
    a: "いつでも解除できます。お問い合わせページから「事前登録の解除希望」とご登録のメールアドレスを添えてご連絡いただければ、こちらで削除します。理由をお伺いすることはありません。",
  },
] as const;

const RELEASED_FAQ = [
  {
    q: "ウカレルは何のアプリですか？",
    a: "宅建試験の独学者向け一問一答アプリです。今日の15問、苦手分析、合格までの現在地を通じて、次に何を学ぶか迷いにくくします。",
  },
  {
    q: "利用料金はいくらですか？",
    a: "ダウンロードは無料です。登録から30日間はすべての機能を無料で利用できます。無料期間が終わっただけで自動課金されることはありません。プレミアムプランは月額580円（税込）で、利用する場合のみApp内課金からご自身で加入します。",
  },
  {
    q: "無料期間の終了後も使えますか？",
    a: "はい。今日の15問と学習履歴の閲覧は、無料期間の終了後も利用できます。プレミアム機能を使う場合のみ、任意で月額プランへ加入できます。",
  },
  {
    q: "合格可能性はどのように表示されますか？",
    a: "アプリ内の学習データをもとにした目安として表示します。合格を保証するものではなく、学習データが十分にたまるまでは表示されない場合があります。",
  },
  {
    q: "どの端末で使えますか？",
    a: "現在はiPhoneに対応しています。App Storeからダウンロードできます。",
  },
] as const;

export default function UkareruLP({ source }: { source: string }) {
  const isReleased = isUkareruReleased();
  // ヒーローの端末画像。カルーセル（LpShotsCarousel）と同じ公開判定で素材を切り替える。
  const heroShot = isReleased
    ? {
        src: "/screenshots/ukareru-b17/01_home.png",
        alt: "ウカレルのホーム画面。今日の15問が表示されている。",
        width: 1320,
        height: 2868,
      }
    : {
        src: "/screenshots/ukareru/01_home.webp",
        alt: "ウカレルのホーム画面。今日やるべき学習が表示されている。",
        width: 828,
        height: 1792,
      };

  return (
    <div className="lp-root">
      <LPInit source={source} />

      {/* S1: Hero */}
      <section id="hero" className="uk-hero">
        <div className="uk-hero-inner">
          <div className="uk-hero-copy">
            <div className="pill">
              {isReleased ? "App Storeで配信中 · iPhone対応" : "App Store公開前 · 事前登録受付中"}
            </div>
            <h1>今日は、<br />15問だけ。</h1>
            <p className="hero-tag">独学でも、<br />迷わない。</p>
            <p className="hero-sub">
              毎日やることが分かる、宅建の一問一答。<br />働きながら独学で合格を目指す人の学習アプリです。
            </p>
            {isReleased ? (
              <div className="uk-hero-cta">
                <p className="uk-hero-offer">
                  登録から<strong>30日間、すべての機能を無料</strong>で利用できます。
                  無料期間の終了だけで自動課金されることはありません。
                </p>
                <AppStoreCta source={source} location="hero" className="btn btn-lg">
                  App Storeで無料で始める
                </AppStoreCta>
                <div className="cta-badges">
                  <div className="badge"><span className="badge-dot" />ダウンロード無料</div>
                  <div className="badge"><span className="badge-dot" />30日間すべての機能が無料</div>
                  <div className="badge"><span className="badge-dot" />自動課金なし</div>
                </div>
              </div>
            ) : (
              <>
                <p className="uk-hero-offer">
                  事前登録すると、すぐに<strong>{WAITLIST_GUIDE_TITLE}</strong>（PDF）を受け取れます。
                  App Storeで公開されたら、メールでお知らせします。
                </p>
                <div className="uk-hero-cta">
                  <div className="uk-hero-form">
                    <EmailForm source={source} layout="compact" formLocation="hero" />
                  </div>
                  <div className="cta-badges">
                    <div className="badge"><span className="badge-dot" />メールアドレスだけ</div>
                    <div className="badge"><span className="badge-dot" />ガイドはすぐ読めます</div>
                    <div className="badge"><span className="badge-dot" />公開時にお知らせ</div>
                  </div>
                  <p className="uk-hero-form-alt">
                    あとで読みたい方は{" "}
                    <CtaLink source={source} location="hero" className="uk-hero-form-alt-link">
                      ウカレルの詳細を見る
                    </CtaLink>
                  </p>
                </div>
              </>
            )}
            <ul className="uk-hero-proof">
              {isReleased ? (
                <>
                  <li><span className="uk-proof-n">15</span>問から始める</li>
                  <li><span className="uk-proof-n">30</span>日間全機能無料</li>
                  <li><span className="uk-proof-n">0</span>円でダウンロード</li>
                </>
              ) : (
                <>
                  <li><span className="uk-proof-n">2</span>ページのガイド</li>
                  <li><span className="uk-proof-n">30</span>秒で登録</li>
                  <li><span className="uk-proof-n">0</span>円で受け取る</li>
                </>
              )}
            </ul>
          </div>
          <div className="uk-hero-visual">
            <div className="uk-phone">
              <Image
                src={heroShot.src}
                alt={heroShot.alt}
                width={heroShot.width}
                height={heroShot.height}
                preload
                sizes="(max-width: 720px) 60vw, 300px"
                className="uk-phone-img"
              />
            </div>
          </div>
        </div>
      </section>

      {/* S1.5: 開発状況。公開日を確約せず、いまの事実だけを書く。
          Apple の審査期間・結果・公開日は当社が確約できないため断定しない。 */}
      {!isReleased && <section id="status" className="uk-status">
        <div className="wrap">
          <h2 className="uk-status-h">ウカレルは、App Storeでの公開を準備しています</h2>
          <p className="uk-status-body">
            アプリ本体は完成し、<strong>App Storeでの公開に向けた手続き</strong>を進めています。
          </p>
          <p className="uk-status-body">
            事前登録いただいた方には、<strong>{WAITLIST_GUIDE_TITLE}</strong>をお届けし、
            公開開始をメールでお知らせします。
          </p>
          <p className="uk-status-note">
            ※公開時期は Apple の審査状況により前後する場合があります。
          </p>
        </div>
      </section>}

      {!isReleased && <section id="guide" className="uk-guide-showcase">
        <div className="wrap uk-guide-grid">
          <div className="uk-guide-preview">
            <Image
              src="/guide/ukareru-15q-guide-preview.png"
              alt="宅建独学・15問活用ガイドの1ページ目。時間の決め方、記録方法、復習ルールを確認できる。"
              width={759}
              height={1076}
              loading="lazy"
              sizes="(max-width: 720px) 82vw, 380px"
              className="uk-guide-preview-img"
            />
          </div>
          <div className="uk-guide-copy">
            <p className="eyebrow">登録直後に受け取れるもの</p>
            <h2>「勉強しよう」を、<br />今日の行動に変える2ページ。</h2>
            <p className="uk-guide-lead">
              {WAITLIST_GUIDE_TITLE}は、アプリ公開を待つだけの資料ではありません。
              15問の学習を<strong>今日から始め、1週間続けるためのチェックリスト</strong>です。
            </p>
            <ul className="uk-guide-benefits">
              <li><strong>いつ解くか決める</strong><span>生活の中で続けやすい時間を1つ選べます。</span></li>
              <li><strong>1行で記録する</strong><span>日付・分野・解いた数・間違えた番号だけを残します。</span></li>
              <li><strong>復習ルールを作る</strong><span>間違えた問題を見直す目安を決められます。</span></li>
              <li><strong>1週間を組み立てる</strong><span>新しい問題・復習・休む日の具体例を使えます。</span></li>
            </ul>
            <div className="uk-guide-outcome">
              読み終えたら、<strong>「今日いつ、何問やるか」</strong>を決めて始められます。
            </div>
            <CtaLink source={source} location="guide" className="btn">
              無料ガイドと公開通知を受け取る
            </CtaLink>
            <p className="uk-guide-note">PDF・2ページ／スマホで閲覧可／印刷してチェックリストとして使用可</p>
          </div>
        </div>
      </section>}

      {/* S2: 独学者の悩み */}
      <section id="empathy" className="alt">
        <div className="wrap">
          <p className="eyebrow" style={{ textAlign: "center" }}>独学のむずかしさ</p>
          <h2 style={{ textAlign: "center" }}>こんな悩み、<br />ありませんか？</h2>
          <div className="pain-grid">
            <div className="pain-card">
              <div className="pain-icon">🔍</div>
              <p>何から勉強すればいいか<br />分からない</p>
            </div>
            <div className="pain-card">
              <div className="pain-icon">⏳</div>
              <p>仕事や家事が忙しく<br />学習が続かない</p>
            </div>
            <div className="pain-card">
              <div className="pain-icon">📊</div>
              <p>合格に近づいているか<br />分からない</p>
            </div>
            <div className="pain-card">
              <div className="pain-icon">📖</div>
              <p>解いて終わりになり<br />復習につながらない</p>
            </div>
          </div>
        </div>
      </section>

      {/* S3: ウカレルが提供する価値 */}
      <section id="value">
        <div className="wrap">
          <p className="eyebrow" style={{ textAlign: "center" }}>ウカレルができること</p>
          <h2 style={{ textAlign: "center" }}>独学の「次に何をすればいい？」<br />をなくす。</h2>
          <ul className="uk-value-list">
            <li><span className="uk-check">✓</span> 今日やることが分かる</li>
            <li><span className="uk-check">✓</span> 合格までの現在地が分かる</li>
            <li><span className="uk-check">✓</span> 苦手分野が分かる</li>
            <li><span className="uk-check">✓</span> 学習の積み重ねが見える</li>
            <li><span className="uk-check">✓</span> 一問ずつ理解しながら進められる</li>
          </ul>
        </div>
      </section>

      {/* S3.5: 復習設計 */}
      <section id="review">
        <div className="wrap">
          <p className="eyebrow" style={{ textAlign: "center" }}>復習の設計</p>
          <h2 style={{ textAlign: "center" }}>間違いと理解度から、<br />復習につなげる。</h2>
          <p className="uk-review-lead">
            問題ごとの正誤と、自分で記録した理解度をもとに、復習する問題を確認できます。解いて終わりにせず、<strong>理解できなかった問題へ戻れる</strong>設計です。
          </p>
          <ul className="uk-review-list">
            <li>間違えた問題を、あとでもう一度確認する</li>
            <li>正誤と理解度から、復習する問題を確認する</li>
            <li>解説で「なぜそうなるか」まで確認できる</li>
          </ul>
          {!isReleased && <p className="uk-review-note">
            この復習の考え方は、事前登録でお渡しする{WAITLIST_GUIDE_TITLE}にも、
            アプリなしで今日から始められる形でまとめています。
          </p>}
        </div>
      </section>

      {/* S4: アプリ体験 — 実スクリーンショット */}
      <section id="experience" className="alt">
        <div className="wrap-wide">
          <p className="eyebrow" style={{ textAlign: "center" }}>アプリ体験</p>
          <h2 style={{ textAlign: "center" }}>迷わず学習を続けられる、<br />アプリ画面。</h2>
          <LpShotsCarousel released={isReleased} />
          <div className="uk-midcta">
            <p className="uk-midcta-lead">{isReleased ? "まずは今日の15問から始めてみませんか？" : "公開前に、15問の使い方を試してみませんか？"}</p>
            {isReleased ? (
              <AppStoreCta source={source} location="mid" className="btn">App Storeで無料で始める</AppStoreCta>
            ) : (
              <CtaLink source={source} location="mid" className="btn">学習ガイドと公開のお知らせを受け取る</CtaLink>
            )}
            <p className="uk-midcta-note">{isReleased ? "ダウンロード無料／30日間すべての機能が無料／終了だけでは自動課金なし" : "登録無料／メールアドレスだけ／ガイドはすぐ読めます"}</p>
          </div>
        </div>
      </section>

      {/* S5: 継続できる理由 */}
      <section id="continue">
        <div className="wrap">
          <p className="eyebrow" style={{ textAlign: "center" }}>続けられる理由</p>
          <h2 style={{ textAlign: "center" }}>毎日、迷わず続けられる。</h2>
          <div className="feat-grid">
            <div className="feat-card">
              <span className="feat-icon">🧭</span>
              <h3>迷う時間をなくす</h3>
              <p>毎日「今日やること」が決まっているから、何を勉強するか迷いません。</p>
            </div>
            <div className="feat-card">
              <span className="feat-icon">⏱️</span>
              <h3>短時間から始められる</h3>
              <p>今日の15問から。すきま時間でも学習を積み重ねられます。</p>
            </div>
            <div className="feat-card">
              <span className="feat-icon">📈</span>
              <h3>進捗が目に見える</h3>
              <p>正解数だけでなく、合格までの現在地を確認できます。</p>
            </div>
            <div className="feat-card">
              <span className="feat-icon">💡</span>
              <h3>解説で理解が深まる</h3>
              <p>問題を解いた後は解説で、なぜそうなるかまで理解できます。</p>
            </div>
          </div>
        </div>
      </section>

      {/* S6: こんな人におすすめ */}
      <section id="recommend" className="alt">
        <div className="wrap">
          <p className="eyebrow" style={{ textAlign: "center" }}>こんな人におすすめ</p>
          <h2 style={{ textAlign: "center" }}>ひとつでも当てはまるなら。</h2>
          <ul className="uk-reco-list">
            <li>働きながら宅建合格を目指している</li>
            <li>独学で何をすべきか迷っている</li>
            <li>問題集やアプリを始めても続かなかった</li>
            <li>自分の弱点を把握したい</li>
            <li>学習の成果を実感しながら進めたい</li>
            <li>毎日の学習内容を自分で考える負担を減らしたい</li>
          </ul>
        </div>
      </section>

      {/* S7: CTA */}
      <section id="register" className="uk-register">
        <div className="wrap">
          <p className="eyebrow" style={{ color: "rgba(147,197,253,0.9)" }}>{isReleased ? "30日間無料" : "無料の事前登録"}</p>
          <h2 style={{ color: "#fff", marginBottom: "12px" }}>
            {isReleased ? <>今日の15問から、<br />始めてみる。</> : <>公開を待つ間も、<br />15問から始める。</>}
          </h2>
          {isReleased ? <>
            <p className="uk-register-lead">登録から30日間、すべての機能を無料で利用できます。<br />無料期間の終了だけで自動課金されることはありません。</p>
            <AppStoreCta source={source} location="register" className="btn btn-lg">App Storeで無料で始める</AppStoreCta>
            <ul className="uk-register-trust">
              <li>ダウンロードは無料です。</li><li>プレミアムプランは月額580円（税込）です。</li><li>加入する場合のみ、ご自身でApp内課金を行います。</li><li>運営：dokugaku link合同会社（大阪）</li>
            </ul>
          </> : <>
          <p className="uk-register-lead">
            <strong>{WAITLIST_GUIDE_TITLE}</strong>（PDF・2ページ）をすぐにお渡しします。<br />
            App Storeで公開されたら、メールでお知らせします。
          </p>
          <div className="uk-form-card">
            <EmailForm source={source} formLocation="register" />
          </div>
          <ul className="uk-register-trust">
            <li>登録は無料。ガイドのお渡しと、公開開始のお知らせをお送りします。</li>
            <li>
              解除はいつでもできます。
              <a href="/contact" className="uk-register-trust-link">お問い合わせ</a>
              から「事前登録の解除希望」とご連絡いただければ、こちらで削除します。
            </li>
            <li>公開時期は Apple の審査状況により前後する場合があります。</li>
            <li>運営：dokugaku link合同会社（大阪）</li>
          </ul>
          </>}
        </div>
      </section>

      {/* S8: FAQ */}
      <section id="faq">
        <div className="wrap">
          <p className="eyebrow" style={{ textAlign: "center" }}>よくある質問</p>
          <h2 style={{ textAlign: "center" }}>FAQ</h2>
          <div className="uk-faq">
            {(isReleased ? RELEASED_FAQ : FAQ).map(({ q, a }) => (
              <details key={q} className="uk-faq-item">
                <summary className="uk-faq-q">{q}</summary>
                <p className="uk-faq-a">{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section id="final-cta" className="uk-final">
        <div className="wrap">
          <h2>独学は、<br />もっと迷わなくていい。</h2>
          <p className="uk-final-sub">
            {isReleased ? "毎日やることが分かるから、独学を続けやすく。" : <>公開を待つ間は、{WAITLIST_GUIDE_TITLE}を今日から使えます。</>}
          </p>
          {isReleased ? (
            <AppStoreCta source={source} location="final" className="btn btn-lg">App Storeで無料で始める</AppStoreCta>
          ) : (
            <CtaLink source={source} location="final" className="btn btn-lg">学習ガイドと公開のお知らせを受け取る</CtaLink>
          )}
          <p className="uk-final-note">{isReleased ? "ダウンロード無料・iPhone対応" : "登録無料・メールアドレスだけ・30秒で完了"}</p>
        </div>
      </section>

      {/* モバイル固定 CTA */}
      <div className="uk-sticky-cta">
        {isReleased ? (
          <AppStoreCta source={source} location="sticky" className="btn uk-sticky-btn">App Storeで無料で始める</AppStoreCta>
        ) : (
          <CtaLink source={source} location="sticky" className="btn uk-sticky-btn">無料ガイドと公開通知を受け取る</CtaLink>
        )}
      </div>
    </div>
  );
}
