import Image from "next/image";
import EmailForm from "@/components/EmailForm";
import CtaLink from "@/components/CtaLink";
import LPInit from "@/components/LPInit";
import LpShotsCarousel from "@/components/LpShotsCarousel";
import { WAITLIST_GUIDE_TITLE } from "@/lib/waitlistGuide";

const FAQ = [
  {
    q: "ウカレルは何のアプリですか？",
    a: "宅地建物取引士（宅建）試験の独学者に向けた学習アプリです。今日やるべき学習、合格までの現在地、苦手分野が分かり、働きながらでも迷わず学習を進められます。",
  },
  {
    q: "いつリリースされますか？",
    a: "現在、App Store への提出を予定している公開候補版を開発中です。完成後に実機で動作を確認し、問題がなければ Apple の審査へ提出します。公開時期は Apple の審査状況により前後する場合があるため、確定した日付はお伝えできません。審査への提出状況と公開開始は、事前登録いただいたメールアドレスへお知らせします。",
  },
  {
    q: "利用料金はいくらですか？",
    a: "プレミアムプランは月額580円（税込）です。登録から30日間は、すべての機能を無料で利用できます。30日を過ぎても、今日の15問と学習履歴の閲覧は無料でそのまま続けられ、無料期間の終了を理由に自動で課金されることはありません。プレミアム機能をご利用になる場合のみ、Apple App内課金で任意にご加入いただけます。加入後は解約されるまで自動更新され、いつでも解約できます。",
  },
  {
    q: "開発はどこまで進んでいますか？",
    a: "社内では「Build 15」と呼んでいる公開候補版を開発中です。完成後に実機で動作を確認し、問題がなければ App Store の審査へ提出する予定です。審査の期間と結果は Apple の判断によるため、公開日を確約することはできません。",
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

export default function UkareruLP({ source }: { source: string }) {
  return (
    <div className="lp-root">
      <LPInit source={source} />

      {/* S1: Hero */}
      <section id="hero" className="uk-hero">
        <div className="uk-hero-inner">
          <div className="uk-hero-copy">
            <div className="pill">リリース準備中 · 事前登録受付中</div>
            <h1>今日の15問が、<br />未来を変える。</h1>
            <p className="hero-tag">独学でも、<br />迷わない。</p>
            <p className="hero-sub">
              今日やるべき学習と、合格までの現在地が分かる。<br />
              働きながら独学で宅建合格を目指す人のための学習アプリです。
            </p>
            {/* ファーストビューで登録を完了できるようにする（従来はページ下部の #register まで
                約9画面スクロールが必要だった）。送信ロジック・API・保存先は #register と同一。 */}
            <p className="uk-hero-offer">
              登録するとすぐに<strong>{WAITLIST_GUIDE_TITLE}</strong>（PDF）をお渡しします。
              そのあと、審査への提出状況と公開開始をメールでお知らせします。
            </p>
            <div className="uk-hero-cta">
              <div className="uk-hero-form">
                <EmailForm source={source} layout="compact" formLocation="hero" />
              </div>
              <div className="cta-badges">
                <div className="badge"><span className="badge-dot" />メールアドレスだけ・30秒</div>
                <div className="badge"><span className="badge-dot" />登録後すぐガイドを受け取れます</div>
                <div className="badge"><span className="badge-dot" />しつこい宣伝メールなし</div>
              </div>
              <p className="uk-hero-form-alt">
                あとで読みたい方は{" "}
                <CtaLink source={source} location="hero" className="uk-hero-form-alt-link">
                  ウカレルの詳細を見る
                </CtaLink>
              </p>
            </div>
            <ul className="uk-hero-proof">
              <li><span className="uk-proof-n">913</span>問を収録</li>
              <li><span className="uk-proof-n">30</span>日間無料</li>
              <li><span className="uk-proof-n">30</span>秒で登録</li>
            </ul>
          </div>
          <div className="uk-hero-visual">
            <div className="uk-phone">
              <Image
                src="/screenshots/ukareru/01_home.webp"
                alt="ウカレルのホーム画面。今日やるべき学習が表示されている。"
                width={828}
                height={1792}
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
      <section id="status" className="uk-status">
        <div className="wrap">
          <h2 className="uk-status-h">ウカレルは、公開に向けた最終確認を進めています</h2>
          <p className="uk-status-body">
            現在、App Store への提出を予定している<strong>公開候補版</strong>を開発中です。
            完成後に実機で動作を確認し、問題がなければ Apple の審査へ提出します。
          </p>
          <p className="uk-status-body">
            事前登録いただいた方には、<strong>{WAITLIST_GUIDE_TITLE}</strong>をお届けし、
            審査への提出状況と公開開始をメールでお知らせします。
          </p>
          <p className="uk-status-note">
            ※公開時期は Apple の審査状況により前後する場合があります。
          </p>
        </div>
      </section>

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
              <p>過去問を解くだけで<br />終わってしまう</p>
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

      {/* S3.5: 復習設計。広告 H3「忘れた頃に、もう一度。」の約束を LP 側で回収する。 */}
      <section id="review">
        <div className="wrap">
          <p className="eyebrow" style={{ textAlign: "center" }}>復習の設計</p>
          <h2 style={{ textAlign: "center" }}>忘れた頃に、<br />もう一度。</h2>
          <p className="uk-review-lead">
            覚えたはずの問題が、しばらくすると解けなくなる。独学でいちばん起きやすいことです。
            ウカレルは、一度間違えた問題を<strong>忘れやすいタイミングであらためて出題</strong>し、
            もう一度出会わせます。
          </p>
          <ul className="uk-review-list">
            <li>間違えた問題を、あとでもう一度出題する</li>
            <li>復習が必要な問題を、こちらで管理する</li>
            <li>解説で「なぜそうなるか」まで確認できる</li>
          </ul>
          <p className="uk-review-note">
            この復習の考え方は、事前登録でお渡しする{WAITLIST_GUIDE_TITLE}にも、
            アプリなしで今日から始められる形でまとめています。
          </p>
        </div>
      </section>

      {/* S4: アプリ体験 — 実スクリーンショット */}
      <section id="experience" className="alt">
        <div className="wrap-wide">
          <p className="eyebrow" style={{ textAlign: "center" }}>アプリ体験</p>
          <h2 style={{ textAlign: "center" }}>迷わず学習を続けられる、<br />アプリ画面。</h2>
          <LpShotsCarousel />
          <div className="uk-midcta">
            <p className="uk-midcta-lead">この画面を、いちばんに使ってみませんか？</p>
            <CtaLink source={source} location="mid" className="btn">
              学習ガイドと公開のお知らせを受け取る
            </CtaLink>
            <p className="uk-midcta-note">メールアドレスだけ・30秒／登録後すぐガイドをお渡しします</p>
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

      {/* S7: 事前登録 CTA */}
      <section id="register" className="uk-register">
        <div className="wrap">
          <p className="eyebrow" style={{ color: "rgba(147,197,253,0.9)" }}>事前登録</p>
          <h2 style={{ color: "#fff", marginBottom: "12px" }}>
            ガイドを受け取って、<br />今日から始める。
          </h2>
          <p className="uk-register-lead">
            登録するとすぐに<strong>{WAITLIST_GUIDE_TITLE}</strong>（PDF・2ページ）をお渡しします。<br />
            そのあと、App Store 審査への提出状況と公開開始をメールでお知らせします。
          </p>
          <div className="uk-form-card">
            <EmailForm source={source} formLocation="register" />
          </div>
          <ul className="uk-register-trust">
            <li>登録は無料。ガイドのお渡しと、提出状況・公開開始のお知らせだけをお送りします。</li>
            <li>
              解除はいつでもできます。
              <a href="/contact" className="uk-register-trust-link">お問い合わせ</a>
              から「事前登録の解除希望」とご連絡いただければ、こちらで削除します。
            </li>
            <li>公開時期は Apple の審査状況により前後する場合があります。</li>
            <li>運営：dokugaku link合同会社（大阪）</li>
          </ul>
        </div>
      </section>

      {/* S8: FAQ */}
      <section id="faq">
        <div className="wrap">
          <p className="eyebrow" style={{ textAlign: "center" }}>よくある質問</p>
          <h2 style={{ textAlign: "center" }}>FAQ</h2>
          <div className="uk-faq">
            {FAQ.map(({ q, a }) => (
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
            いま登録すれば、{WAITLIST_GUIDE_TITLE}を今日から使えます。
          </p>
          <CtaLink source={source} location="final" className="btn btn-lg">
            学習ガイドと公開のお知らせを受け取る
          </CtaLink>
          <p className="uk-final-note">メールアドレスだけ・30秒で完了</p>
        </div>
      </section>

      {/* モバイル固定 CTA */}
      <div className="uk-sticky-cta">
        <CtaLink source={source} location="sticky" className="btn uk-sticky-btn">
          無料で事前登録する
        </CtaLink>
      </div>
    </div>
  );
}
