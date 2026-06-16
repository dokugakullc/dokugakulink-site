import type { Metadata } from "next";
import "./lp.css";
import EmailForm from "@/components/EmailForm";

export const metadata: Metadata = {
  title: "ウカレル — 宅建独学を合格まで導く学習アプリ",
  description:
    "何を勉強すれば受かるか分かる宅建合格ナビゲーションアプリ。現在地・苦手分野・今日やるべき問題を見える化。2026年試験対応・法改正対応済み。",
};

export default function TakkenPage() {
  return (
    <div className="lp-root">

      {/* S1: Hero */}
      <section id="hero">
        <div className="hero-grid">

          {/* 左: キャッチコピー */}
          <div className="hero-left">
            <div className="pill">2026年宅建試験対応 · β版先行受付中</div>
            <h1>何を勉強すれば受かるか<br />分かれば受かる試験です。</h1>
            <p className="hero-tag">忘れた頃に、また出題。</p>
            <p className="hero-sub">宅建独学を合格まで導く学習アプリ</p>
          </div>

          {/* 右: 合体スマホモック（現在地 + 今日やるべき問題） */}
          <div className="hero-right">
            <div className="hero-mocks">
              <div className="hphone">
                <div className="hphone-s">
                  <div className="hphone-top">
                    <span className="hphone-time">9:41</span>
                    <span style={{fontSize:'10px',color:'var(--text)'}}>●●●</span>
                  </div>
                  <div className="hphone-nav"><div className="hphone-nav-t">現在地</div></div>
                  <div className="hphone-bd">
                    <div className="hp-lbl">推定得点</div>
                    <div className="hp-score-sm">31<span className="hp1-denom"> / 50点</span></div>
                    <div className="hp1-track"><div className="hp1-fill" style={{width:'62%'}}></div></div>
                    {/* PRIMARY: 合格圏までの距離 */}
                    <div className="hp-dist">
                      <span className="hp-dist-lbl">合格圏まで</span>
                      <span className="hp-dist-val">あと5点</span>
                    </div>
                    {/* Mini cards: 理解度 + 試験まで */}
                    <div className="hp-mini-row">
                      <div className="hp-mini-card">
                        <div className="hp-mini-lbl">理解度</div>
                        <div className="hp-mini-val">67%</div>
                      </div>
                      <div className="hp-mini-card">
                        <div className="hp-mini-lbl">試験まで</div>
                        <div className="hp-mini-val">126日</div>
                      </div>
                    </div>
                    {/* 苦手カテゴリ */}
                    <div className="hp-weak-card">
                      <div className="hp-weak-lbl">苦手カテゴリ</div>
                      <div className="hp-weak-val">権利関係</div>
                    </div>
                    <div className="hp-divider">今日やるべき問題</div>
                    <div className="hp2-subj">
                      <div className="hp2-dot"></div>
                      <div>
                        <div className="hp2-title">宅建業法</div>
                        <div className="hp2-sub">正答率 52%</div>
                      </div>
                    </div>
                    <div className="hp2-cnt">今日の10問</div>
                  </div>
                  {/* iOS home indicator */}
                  <div style={{textAlign:'center',padding:'10px 0 5px'}}>
                    <div style={{width:'88px',height:'4px',background:'rgba(0,0,0,.12)',borderRadius:'2px',display:'inline-block'}}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CTA: PC=左列2行目 / SP=モック直下 */}
          <div className="hero-cta">
            <a href="#register" className="btn btn-lg">β版先行登録</a>
            <div className="cta-badges">
              <div className="badge"><div className="badge-dot"></div>初回30日無料</div>
              <div className="badge"><div className="badge-dot"></div>全機能利用可能</div>
            </div>
            <p style={{marginTop:'14px',fontSize:'14px',color:'var(--t3)',fontWeight:'500'}}>2026年夏リリース予定</p>
          </div>

        </div>
      </section>

      {/* Bridge: premise */}
      <section id="premise">
        <div className="wrap">
          <p className="premise-ttl">
            宅建50問のうち<br />
            <em>約35〜40問</em>は<br />
            毎年の定番問題です。
          </p>
          <p className="premise-body">
            だから大切なのは<br />
            難問を解くことではなく<br />
            取れる問題を確実に取ること。
          </p>
          <p className="premise-cap">ウカレルは、そのためのアプリです。</p>
        </div>
      </section>

      {/* S2: 現在地モック */}
      <section id="nav-demo" className="alt">
        <div className="wrap">
          <p className="eyebrow" style={{textAlign:'center'}}>合格ナビゲーション</p>
          <h2 style={{textAlign:'center'}}>何を勉強すれば受かるか、<br />迷わない。</h2>
          <p className="nav-sub" style={{textAlign:'center',marginTop:'14px'}}>
            <em>現在地</em> · <em>苦手分野</em> · <em>次にやるべきこと</em><br />すべて見える化。
          </p>

          <div className="dash">
            <div className="dash-head">
              <div className="dash-head-lbl">現在の実力</div>
              <div className="dash-score">31<sub>点</sub></div>
            </div>
            <div className="dash-row">
              <div className="dash-cell">
                <div className="d-lbl">合格まで</div>
                <div className="d-val a">あと5点</div>
              </div>
              <div className="dash-cell">
                <div className="d-lbl">理解度</div>
                <div className="d-val">67%</div>
              </div>
            </div>
            <div className="dash-row">
              <div className="dash-cell">
                <div className="d-lbl">苦手分野</div>
                <div className="d-val w">権利関係</div>
              </div>
              <div className="dash-cell">
                <div className="d-lbl">正答率</div>
                <div className="d-val">52%</div>
              </div>
            </div>
            <div className="dash-row">
              <div className="dash-cell">
                <div className="d-lbl">試験まで</div>
                <div className="d-val">126<span style={{fontSize:'14px',fontWeight:'600',color:'var(--t2)'}}>日</span></div>
              </div>
              <div className="dash-cell">
                <div className="d-lbl">予測学習数</div>
                <div className="d-val g">420<span style={{fontSize:'14px',fontWeight:'600',color:'var(--t2)'}}>問</span></div>
              </div>
            </div>
            <div className="dash-today">
              <div className="d-lbl">今日やるべきこと</div>
              <div className="dash-today-row">
                <div className="d-dot"></div>宅建業法<span className="d-ct">10問</span>
              </div>
            </div>
          </div>

          <p className="nav-close" style={{textAlign:'center'}}>
            独学で最も難しいのは<br />勉強することではありません。<br /><br />
            <strong>何を勉強するかを判断することです。</strong>
          </p>
        </div>
      </section>

      {/* How it works: ウカレルが迷いをなくす仕組み */}
      <section id="how-it-works" className="alt">
        <div className="wrap">
          <p className="eyebrow" style={{textAlign:'center'}}>ウカレルの仕組み</p>
          <h2 style={{textAlign:'center'}}>ウカレルが迷いをなくす仕組み</h2>
          <div className="hiw-grid">
            <div className="hiw-card">
              <span className="hiw-icon">📉</span>
              <h3>苦手ランキング</h3>
              <p>苦手な論点を自動分析</p>
            </div>
            <div className="hiw-card">
              <span className="hiw-icon">📋</span>
              <h3>今日やるべき問題</h3>
              <p>今優先して解くべき問題を提案</p>
            </div>
            <div className="hiw-card">
              <span className="hiw-icon">🗺️</span>
              <h3>合格ロードマップ</h3>
              <p>試験日から逆算して学習を案内</p>
            </div>
          </div>
        </div>
      </section>

      {/* S3: 宅建試験の本質 */}
      <section id="essence">
        <div className="wrap">
          <p className="eyebrow" style={{textAlign:'center'}}>宅建試験の本質</p>
          <h2 style={{textAlign:'center'}}>宅建試験は50問。<br />難問を解かなくても<br />合格できます。</h2>

          <div className="bar-chart">
            <p className="bar-chart-ttl">宅建試験 50問の内訳</p>
            <div className="bi">
              <div className="bi-top">
                <span className="bi-lbl">基礎問題</span>
                <span className="bi-num">約20〜25問</span>
              </div>
              <div className="bar-track"><div className="bar-fill c-b" style={{width:'50%'}}></div></div>
            </div>
            <div className="bi">
              <div className="bi-top">
                <span className="bi-lbl">応用問題</span>
                <span className="bi-num">約10〜15問</span>
              </div>
              <div className="bar-track"><div className="bar-fill c-s" style={{width:'28%'}}></div></div>
            </div>
            <div className="bi">
              <div className="bi-top">
                <span className="bi-lbl">難問</span>
                <span className="bi-num">約5〜10問</span>
              </div>
              <div className="bar-track"><div className="bar-fill c-g" style={{width:'16%'}}></div></div>
            </div>
            <div className="bc-foot">
              <div className="bc-foot-lbl">近年の合格点</div>
              <span className="bc-foot-num">34〜38</span><span style={{fontSize:'13px',color:'var(--t2)'}}> 点 / 50問</span>
            </div>
          </div>

          {/* 積み上げフロー: 基礎 → 応用 → 合計得点 → 合格ライン */}
          <div style={{maxWidth:'320px',margin:'0 auto 16px',textAlign:'center'}}>
            <div style={{background:'var(--blue-s)',border:'2px solid var(--blue)',borderRadius:'16px',padding:'16px 20px'}}>
              <div style={{fontSize:'11px',fontWeight:'700',color:'var(--blue)',letterSpacing:'.07em',marginBottom:'4px'}}>基礎問題</div>
              <div style={{fontSize:'24px',fontWeight:'800',color:'var(--text)',letterSpacing:'-.02em'}}>20〜25問</div>
              <div style={{fontSize:'11px',color:'var(--t2)',marginTop:'4px'}}>誰でも取るべき問題</div>
            </div>
            <div style={{fontSize:'22px',color:'var(--t3)',lineHeight:'1.4',padding:'2px 0'}}>↓</div>
            <div style={{background:'rgba(90,200,250,.1)',border:'2px solid #5AC8FA',borderRadius:'16px',padding:'16px 20px'}}>
              <div style={{fontSize:'11px',fontWeight:'700',color:'#0080AA',letterSpacing:'.07em',marginBottom:'4px'}}>応用問題</div>
              <div style={{fontSize:'24px',fontWeight:'800',color:'var(--text)',letterSpacing:'-.02em'}}>10〜15問</div>
              <div style={{fontSize:'11px',color:'var(--t2)',marginTop:'4px'}}>理解している人だけ取れる問題</div>
            </div>
            <div style={{fontSize:'22px',color:'var(--t3)',lineHeight:'1.4',padding:'2px 0'}}>↓</div>
            <div style={{background:'var(--bg2)',border:'2px solid var(--bd)',borderRadius:'16px',padding:'16px 20px'}}>
              <div style={{fontSize:'11px',fontWeight:'700',color:'var(--t2)',letterSpacing:'.07em',marginBottom:'4px'}}>合計得点目安</div>
              <div style={{fontSize:'24px',fontWeight:'800',color:'var(--text)',letterSpacing:'-.02em'}}>35〜40点</div>
              <div style={{fontSize:'11px',color:'var(--t2)',marginTop:'4px'}}>基礎 + 応用の積み上げ</div>
            </div>
            <div style={{fontSize:'22px',color:'var(--t3)',lineHeight:'1.4',padding:'2px 0'}}>↓</div>
            <div style={{background:'var(--green)',borderRadius:'16px',padding:'16px 20px'}}>
              <div style={{fontSize:'11px',fontWeight:'700',color:'rgba(255,255,255,.8)',letterSpacing:'.07em',marginBottom:'4px'}}>近年の合格ライン</div>
              <div style={{fontSize:'26px',fontWeight:'800',color:'#fff',letterSpacing:'-.02em'}}>34〜38点</div>
              <div style={{fontSize:'11px',color:'rgba(255,255,255,.7)',marginTop:'4px'}}>積み上げれば届きます</div>
            </div>
          </div>
          <p style={{textAlign:'center',fontSize:'14px',color:'var(--t2)',lineHeight:'1.75',maxWidth:'320px',margin:'0 auto 44px'}}>
            基礎問題だけでは足りません。<br />応用問題まで取れると合格圏に入ります。
          </p>

          <p className="ess-close" style={{textAlign:'center'}}>
            難問を追いかける必要はありません。<br /><br />
            <em>取れる問題を確実に取ることが合格への近道です。</em>
          </p>
        </div>
      </section>

      {/* S4: 受験生の悩み */}
      <section id="empathy" className="alt">
        <div className="wrap">
          <p className="eyebrow" style={{textAlign:'center'}}>受験生の悩み</p>
          <h2>こんな悩みありませんか？</h2>
          <div className="pain-grid">
            <div className="pain-card">
              <div className="pain-icon">🔍</div>
              <p>何を勉強すればいいか<br />分からない</p>
            </div>
            <div className="pain-card">
              <div className="pain-icon">📖</div>
              <p>勉強しても<br />忘れてしまう</p>
            </div>
            <div className="pain-card">
              <div className="pain-icon">📊</div>
              <p>今の実力が<br />分からない</p>
            </div>
            <div className="pain-card">
              <div className="pain-icon">😰</div>
              <p>このままで受かるのか<br />不安</p>
            </div>
          </div>
        </div>
      </section>

      {/* S5: 不合格の原因 */}
      <section id="problem">
        <div className="wrap">
          <p className="eyebrow" style={{textAlign:'center'}}>不合格の本当の理由</p>
          <h2>知らない問題で落ちる人は<br />少ない。</h2>
          <div style={{marginTop:'40px',display:'flex',justifyContent:'center'}}>
            <div className="callout">
              知っていた問題を<br />本番で思い出せず落ちている。<br /><br />
              それが不合格の本当の原因です。
            </div>
          </div>
        </div>
      </section>

      {/* S6: 厳選1000問 */}
      <section id="approach" className="alt">
        <div className="wrap">
          <p className="eyebrow" style={{textAlign:'center'}}>ウカレルの問題設計</p>
          <h2 style={{textAlign:'center'}}>問題数No.1は<br />目指しません。</h2>
          <p className="approach-body">
            <strong>5,000問は必要ありません。</strong><br /><br />
            宅建50問のうち、毎年出題される重要論点と合否を分ける論点を中心に、
            合格に必要な問題だけを厳選しています。<br /><br />
            問題数No.1ではなく、<strong>合格に直結する問題を確実に取れること</strong>を目指して設計しています。
          </p>
          <div className="stats-3">
            <div className="stat-card">
              <div className="stat-num">1,000<sub>問</sub></div>
              <div className="stat-lbl">厳選問題数</div>
            </div>
            <div className="stat-card">
              <div className="stat-num">3<sub>回分</sub></div>
              <div className="stat-lbl">オリジナル模試</div>
            </div>
            <div className="stat-card">
              <div className="stat-num" style={{fontSize:'20px',letterSpacing:'0'}}>法改正<sub style={{fontSize:'12px'}}> 対応</sub></div>
              <div className="stat-lbl">2026年版対応</div>
            </div>
          </div>
        </div>
      </section>

      {/* S7: 5つのナビゲーション */}
      <section id="features">
        <div className="wrap">
          <p className="eyebrow" style={{textAlign:'center'}}>なぜ合格に近づけるのか</p>
          <h2 style={{textAlign:'center'}}>5つのナビゲーション</h2>
          <p className="feat-sub" style={{textAlign:'center'}}>「受かるためには何をすれば良いか」をアプリが教えます。</p>
          <div className="feat-grid">
            <div className="feat-card">
              <span className="feat-icon">🎯</span>
              <div className="feat-num">01</div>
              <h3>合格可能性を見える化</h3>
              <p>今の実力が合格ラインに対してどこにあるか、いつでも確認できます。現在地が分かれば、次の行動が分かります。</p>
            </div>
            <div className="feat-card">
              <span className="feat-icon">📋</span>
              <div className="feat-num">02</div>
              <h3>今日やるべき問題が分かる</h3>
              <p>アプリを開いたらすぐに学習開始。「何を勉強するか」で迷う時間をゼロにします。</p>
            </div>
            <div className="feat-card">
              <span className="feat-icon">📉</span>
              <div className="feat-num">03</div>
              <h3>苦手分野を自動分析</h3>
              <p>回答履歴から苦手なカテゴリを自動で特定。点数が最も伸びる場所に集中できます。</p>
            </div>
            <div className="feat-card">
              <span className="feat-icon">🔄</span>
              <div className="feat-num">04</div>
              <h3>忘れた頃に、また出題</h3>
              <p>忘却曲線に合わせて最適なタイミングで再出題。少ない繰り返しで記憶が定着します。</p>
            </div>
            <div className="feat-card full">
              <span className="feat-icon">🗺️</span>
              <div className="feat-num">05</div>
              <h3>学習ロードマップ</h3>
              <p>試験日から逆算して、次にやるべきことを提案。迷わず前に進められます。</p>
            </div>
          </div>
        </div>
      </section>

      {/* S8: 無料分析 */}
      <section id="free-analytics" className="alt">
        <div className="wrap">
          <p className="eyebrow" style={{textAlign:'center'}}>無料でできること</p>
          <h2>分析は無料です。</h2>
          <div className="free-chips">
            <div className="free-chip"><span className="fchk">✓</span> 現在地</div>
            <div className="free-chip"><span className="fchk">✓</span> 苦手分野</div>
            <div className="free-chip"><span className="fchk">✓</span> 理解度</div>
            <div className="free-chip"><span className="fchk">✓</span> 合格可能性</div>
          </div>
          <p className="free-note">
            これらは無料で確認できます。<br />私たちは分析機能を課金で隠しません。
          </p>
          <div className="pay-box">
            <div className="pay-box-lbl">有料プランで解放されるのは</div>
            <div className="pay-box-text">学習量の上限です。</div>
          </div>
          <div className="phone">
            <div className="p-screen">
              <div className="p-topbar">
                <span className="p-time">9:41</span>
                <span style={{fontSize:'11px',color:'var(--text)'}}>●●●</span>
              </div>
              <div className="p-nav"><div className="p-nav-ttl">現在の実力</div></div>
              <div className="p-body">
                <div className="p-card">
                  <div className="p-lbl">推定得点</div>
                  <div className="p-big">31<sub>点</sub></div>
                  <div className="p-track"><div className="p-fill" style={{width:'62%'}}></div></div>
                </div>
                <div className="p-row">
                  <div className="p-mini">
                    <div className="p-mini-lbl">合格圏まで</div>
                    <div className="p-mini-val a">あと5点</div>
                  </div>
                  <div className="p-mini">
                    <div className="p-mini-lbl">理解度</div>
                    <div className="p-mini-val">67<span style={{fontSize:'11px'}}>%</span></div>
                  </div>
                </div>
                <div className="p-hl">
                  <div className="p-hl-lbl">要強化カテゴリ</div>
                  <div className="p-hl-val">権利関係</div>
                  <div className="p-track" style={{marginTop:'8px'}}><div className="p-fill" style={{width:'45%',background:'var(--amber)'}}></div></div>
                </div>
                <div className="p-tags">
                  <div className="p-tag">✓ 現在地</div>
                  <div className="p-tag">✓ 理解度</div>
                  <div className="p-tag">✓ 苦手分野</div>
                  <div className="p-tag">✓ 合格可能性</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* S9: 合格者学習量 */}
      <section id="volume">
        <div className="wrap">
          <p className="eyebrow" style={{textAlign:'center'}}>学習量について</p>
          <h2>合格するには<br />十分な学習量も必要です</h2>
          <div className="vol-stat">
            <div className="vol-lbl">昨年の合格者平均</div>
            <div className="vol-num">800<span className="vol-unit">〜</span>1,200<span className="vol-unit">問</span></div>
            <div className="vol-note">合格に必要な学習量の目安</div>
            <div style={{marginTop:'14px',paddingTop:'14px',borderTop:'1px solid var(--bd)',fontSize:'13px',color:'var(--t2)',lineHeight:'1.75',textAlign:'left'}}>
              近年の合格者は過去問を中心に800〜1,200問程度解いているケースが多く見られます。
              <div style={{marginTop:'8px',fontSize:'12px',color:'var(--t3)'}}>※個人差があります</div>
            </div>
          </div>
          <p className="vol-body">
            ウカレルは<br />
            試験日までに<em>どれだけ問題を解けるか</em>を予測します。<br /><br />
            今日のペースを続ければ、<br />試験日までに何問解けるか分かります。
          </p>
        </div>
      </section>

      {/* S10: 料金プラン */}
      <section id="pricing" className="alt">
        <div className="wrap">
          <p className="eyebrow" style={{textAlign:'center'}}>料金プラン</p>
          <h2 style={{textAlign:'center'}}>まずは無料で<br />体験してください</h2>
          <p className="price-lead">
            初回30日間は全問題・全機能を完全開放。<br />
            あなたに合う学習方法か、じっくり試してください。
          </p>
          <div className="cta-badges" style={{marginBottom:'40px'}}>
            <div className="badge"><div className="badge-dot"></div>初回30日無料</div>
            <div className="badge"><div className="badge-dot"></div>全機能利用可能</div>
          </div>
          <div className="plan-grid">
            <div className="plan">
              <div className="plan-type">TRIAL</div>
              <div className="plan-price">初回30日<br />無料</div>
              <div className="plan-period">登録後30日間</div>
              <p className="plan-desc">すべての機能を制限なく使えます。</p>
              <hr className="dv" />
              <ul className="plan-list">
                <li><span className="chk">✓</span> 全問題（1,000問）</li>
                <li><span className="chk">✓</span> 模試（3回分）</li>
                <li><span className="chk">✓</span> 復習・分析機能</li>
                <li><span className="chk">✓</span> 自由演習</li>
                <li><span className="chk">✓</span> 学習ロードマップ</li>
              </ul>
            </div>
            <div className="plan featured">
              <div className="plan-badge">試験日まで学習を継続</div>
              <div className="plan-type">宅建プラン</div>
              <div className="plan-price">¥580<sub>/月</sub></div>
              <div className="plan-period">試験日まで自由に学習を継続</div>
              <div className="plan-perday">1日あたり約19円</div>
              <p className="plan-desc">
                無料期間終了後も<br />自由演習・過去問・模試・無制限復習を利用できます。
              </p>
              <hr className="dv" />
              <ul className="plan-list">
                <li><span className="chk">✓</span> 全問題（1,000問）</li>
                <li><span className="chk">✓</span> 模試（3回分）</li>
                <li><span className="chk">✓</span> 復習・分析機能</li>
                <li><span className="chk">✓</span> 自由演習</li>
                <li><span className="chk">✓</span> 学習ロードマップ</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Developer Story */}
      <section id="story">
        <div className="wrap" style={{maxWidth:'640px'}}>
          <p className="eyebrow" style={{textAlign:'center'}}>開発者より</p>
          <h2 style={{textAlign:'center'}}>なぜウカレルを<br />作ったのか</h2>
          <div style={{marginTop:'40px',background:'var(--bg2)',borderRadius:'20px',padding:'36px 40px',fontSize:'17px',color:'var(--text)',lineHeight:'1.9',fontWeight:'500'}}>
            <p style={{color:'var(--text)',marginBottom:'20px'}}>
              不動産業界で働く中で、<br />
              宅建に挑戦する人が何を勉強すれば良いか分からず<br />
              遠回りしている姿を数多く見てきました。
            </p>
            <p style={{color:'var(--text)',marginBottom:'20px'}}>
              宅建は難問を解く試験ではありません。<br />
              毎年出題される重要論点と合否を分ける論点を<br />
              確実に取れば、十分に合格を目指せます。
            </p>
            <p style={{color:'var(--text)',marginBottom:'0'}}>
              だからウカレルは<br />
              問題数No.1ではなく<br />
              <strong style={{color:'var(--blue)'}}>「何を勉強すれば受かるか分かる」</strong><br />
              ことを目指して開発しています。
            </p>
          </div>
        </div>
      </section>

      {/* Register — dark bg to match EmailForm's styling */}
      <section id="register" style={{background:'#0A0A0A',textAlign:'center',padding:'96px 0'}}>
        <div className="wrap">
          <p className="eyebrow" style={{color:'rgba(90,200,250,0.8)'}}>β版先行登録</p>
          <h2 style={{color:'#fff',marginBottom:'12px'}}>β版リリース時に<br />最初にご案内します。</h2>
          <p style={{margin:'8px auto 6px',fontSize:'14px',color:'#5AC8FA',fontWeight:'600'}}>2026年夏リリース予定</p>
          <p style={{margin:'0 auto 40px',maxWidth:'480px',color:'rgba(255,255,255,.5)',fontSize:'17px',lineHeight:'1.7'}}>
            メールアドレスを登録するだけ。<br />スパムは送りません。いつでも解除できます。
          </p>
          <div style={{maxWidth:'480px',margin:'0 auto',background:'#141414',borderRadius:'24px',padding:'36px 32px',boxShadow:'0 24px 64px rgba(0,0,0,.56)'}}>
            <EmailForm source="services_takken" />
          </div>
        </div>
      </section>

      {/* S11: Final CTA */}
      <section id="final-cta">
        <div className="wrap">
          <h2>何を勉強すれば受かるか。<br />それが分かれば<br />独学はもっと楽になる。</h2>
          <p className="fcta-sub">まずは30日無料で体験してください。</p>
          <a href="#register" className="btn btn-lg">β版先行登録</a>
          <div className="cta-badges" style={{marginTop:'20px'}}>
            <div className="badge" style={{background:'rgba(255,255,255,.1)',color:'#fff'}}><div className="badge-dot"></div>初回30日無料</div>
            <div className="badge" style={{background:'rgba(255,255,255,.1)',color:'#fff'}}><div className="badge-dot"></div>全機能利用可能</div>
          </div>
        </div>
      </section>

    </div>
  );
}
