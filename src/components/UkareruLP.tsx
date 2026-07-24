import Image from "next/image";
import EmailForm from "@/components/EmailForm";
import CtaLink from "@/components/CtaLink";
import LPInit from "@/components/LPInit";
import LpShotsCarousel from "@/components/LpShotsCarousel";

const FAQ = [
  {
    q: "ウカレルは何のアプリですか？",
    a: "宅地建物取引士（宅建）試験の独学者に向けた学習アプリです。今日やるべき学習、合格までの現在地、苦手分野が分かり、働きながらでも迷わず学習を進められます。",
  },
  {
    q: "いつリリースされますか？",
    a: "現在、正式リリースに向けて準備を進めています。公開時期が決まり次第、事前登録いただいたメールアドレスへお知らせします。",
  },
  {
    q: "利用料金はいくらですか？",
    a: "プレミアムプランは月額580円（税込）です。登録から30日間は、すべての機能を無料で利用できます。30日を過ぎても、今日の15問と学習履歴の閲覧は無料でそのまま続けられ、無料期間の終了を理由に自動で課金されることはありません。プレミアム機能をご利用になる場合のみ、Apple App内課金で任意にご加入いただけます。加入後は解約されるまで自動更新され、いつでも解約できます。",
  },
  {
    q: "どの資格に対応していますか？",
    a: "宅地建物取引士（宅建）試験に対応しています。",
  },
  {
    q: "事前登録すると何が届きますか？",
    a: "ウカレルの App Store 公開時に、案内メールが届きます。継続的な宣伝メールを大量に送ることはありません。",
  },
  {
    q: "登録後に解除できますか？",
    a: "いつでも解除できます。お手数ですが、お問い合わせページよりご連絡ください。",
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
            <div className="uk-hero-cta">
              <CtaLink source={source} location="hero" className="btn btn-lg">
                リリース通知を受け取る
              </CtaLink>
              <div className="cta-badges">
                <div className="badge"><span className="badge-dot" />無料で事前登録</div>
                <div className="badge"><span className="badge-dot" />メールアドレスだけ</div>
              </div>
            </div>
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

      {/* S4: アプリ体験 — 実スクリーンショット */}
      <section id="experience" className="alt">
        <div className="wrap-wide">
          <p className="eyebrow" style={{ textAlign: "center" }}>アプリ体験</p>
          <h2 style={{ textAlign: "center" }}>迷わず学習を続けられる、<br />アプリ画面。</h2>
          <LpShotsCarousel />
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
            リリースしたら、<br />いちばんに。
          </h2>
          <p className="uk-register-lead">
            ウカレルは現在、正式リリースに向けて準備中です。<br />
            事前登録いただいた方へ、App Store 公開時にメールでお知らせします。
          </p>
          <div className="uk-form-card">
            <EmailForm source={source} />
          </div>
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
          <p className="uk-final-sub">リリース通知を受け取って、準備を始めましょう。</p>
          <CtaLink source={source} location="final" className="btn btn-lg">
            リリース通知を受け取る
          </CtaLink>
        </div>
      </section>

      {/* モバイル固定 CTA */}
      <div className="uk-sticky-cta">
        <CtaLink source={source} location="sticky" className="btn uk-sticky-btn">
          リリース通知を受け取る
        </CtaLink>
      </div>
    </div>
  );
}
