import Link from "next/link";

const businesses = [
  {
    number: "01",
    title: "教育・学習支援事業",
    description:
      "資格取得やスキル向上を目指す方に向けた学習支援サービスの企画、開発、運営を行っています。独学で学ぶ方々を対象に、効率的かつ継続しやすい学習環境の提供を目指しています。",
  },
  {
    number: "02",
    title: "コンテンツ・コミュニティ事業",
    description:
      "学習コンテンツの企画・制作・提供のほか、イベントやコミュニティ運営を通じて学習者同士の交流や成長を支援します。",
  },
  {
    number: "03",
    title: "不動産情報サービス事業",
    description:
      "不動産に関する情報提供、調査、分析およびコンサルティング業務を行っています。市場データや実務経験を活用し、利用者に有益な情報提供を行います。",
  },
  {
    number: "04",
    title: "インターネットサービス事業",
    description:
      "Webサービスの企画・開発・運営、広告事業、アフィリエイト事業およびシステム開発を行っています。テクノロジーを活用し、ユーザーの課題解決につながるサービスの提供を目指しています。",
  },
];

const services = [
  {
    name: "宅地建物取引士試験向け学習支援アプリ",
    description:
      "宅建士試験の合格を目指す方のための、継続しやすい学習習慣を支援するモバイルアプリ。",
  },
  {
    name: "資格試験学習支援サービス",
    description:
      "宅建士をはじめとする各種資格試験に対応した、総合的な学習サポートプラットフォーム。",
  },
  {
    name: "学習データを活用した復習支援サービス",
    description:
      "学習履歴データを分析し、最適なタイミングで復習を促す次世代の学習支援サービス。",
  },
];

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="bg-[#0d2545] text-white">
        <div className="mx-auto max-w-6xl px-6 lg:px-8 py-24 md:py-32">
          <p className="text-xs font-semibold tracking-widest text-blue-300 uppercase mb-6">
            Dokugaku Link LLC
          </p>
          <h1 className="text-3xl md:text-4xl font-bold leading-tight tracking-tight mb-6 max-w-2xl">
            学習のインフラを、<br />独学者の手に届ける。
          </h1>
          <p className="text-base text-blue-100 max-w-xl leading-loose">
            独学リンク合同会社は、独学で成長を目指すすべての人々に向けた学習支援サービスの開発・運営を中心に、コンテンツ・不動産情報・インターネットサービスを展開しています。
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/business"
              className="inline-flex items-center px-6 py-3 bg-white text-[#0d2545] text-sm font-semibold rounded hover:bg-blue-50 transition-colors"
            >
              事業内容を見る
            </Link>
            <Link
              href="/company"
              className="inline-flex items-center px-6 py-3 border border-white/30 text-white text-sm font-semibold rounded hover:bg-white/10 transition-colors"
            >
              会社概要
            </Link>
          </div>
        </div>
      </section>

      {/* Business Overview */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <div className="mb-10">
            <p className="text-xs font-semibold uppercase tracking-widest text-blue-700 mb-2">
              Business
            </p>
            <h2 className="text-2xl font-bold text-[#0d2545]">事業内容</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-gray-200">
            {businesses.map((b) => (
              <div key={b.number} className="bg-white p-8">
                <p className="text-xs font-mono text-gray-400 mb-3">{b.number}</p>
                <h3 className="text-base font-bold text-[#0d2545] mb-3">{b.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{b.description}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 text-right">
            <Link href="/business" className="text-sm text-blue-700 font-medium hover:underline">
              事業内容の詳細 &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* Services in Development */}
      <section className="bg-[#f5f7fa] py-20">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <div className="mb-10">
            <p className="text-xs font-semibold uppercase tracking-widest text-blue-700 mb-2">
              Services
            </p>
            <h2 className="text-2xl font-bold text-[#0d2545]">開発中のサービス</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {services.map((s, i) => (
              <div key={s.name} className="bg-white border border-gray-200 rounded p-6">
                <div className="flex items-center justify-between mb-5">
                  <span className="text-xs font-medium text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full">
                    開発中
                  </span>
                  <span className="text-xs font-mono text-gray-300">0{i + 1}</span>
                </div>
                <h3 className="text-sm font-bold text-[#0d2545] mb-3 leading-snug">{s.name}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{s.description}</p>
              </div>
            ))}
          </div>
          <p className="mt-8 text-sm text-gray-500 text-center">
            今後は宅建士以外の資格領域への展開も視野に入れています。
          </p>
        </div>
      </section>

      {/* Company Snapshot */}
      <section className="bg-white py-20 border-t border-gray-100">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <div className="mb-10">
            <p className="text-xs font-semibold uppercase tracking-widest text-blue-700 mb-2">
              Company
            </p>
            <h2 className="text-2xl font-bold text-[#0d2545]">会社概要</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
            <dl className="divide-y divide-gray-100">
              <div className="flex py-4">
                <dt className="w-28 text-sm text-gray-500 shrink-0">会社名</dt>
                <dd className="text-sm font-medium text-gray-900">
                  独学リンク合同会社
                  <span className="block text-xs text-gray-400 mt-0.5 font-normal">
                    Dokugaku Link LLC
                  </span>
                </dd>
              </div>
              <div className="flex py-4">
                <dt className="w-28 text-sm text-gray-500 shrink-0">所在地</dt>
                <dd className="text-sm text-gray-900 leading-loose">
                  〒530-0001<br />
                  大阪府大阪市北区梅田1-1-3
                </dd>
              </div>
              <div className="flex py-4">
                <dt className="w-28 text-sm text-gray-500 shrink-0">事業内容</dt>
                <dd className="text-sm text-gray-700 leading-loose">
                  教育・学習支援事業<br />
                  コンテンツ・コミュニティ事業<br />
                  不動産情報サービス事業<br />
                  インターネットサービス事業
                </dd>
              </div>
            </dl>
            <div className="text-sm text-gray-600 leading-loose space-y-4">
              <p>
                独学リンク合同会社は、「独学で成長したい」というすべての人の学習を支援することを目的に設立された会社です。
              </p>
              <p>
                デジタルテクノロジーを活用し、学習者一人ひとりの習慣形成と継続学習を支援するサービスの開発・運営を行っています。
              </p>
            </div>
          </div>
          <div className="mt-8">
            <Link href="/company" className="text-sm text-blue-700 font-medium hover:underline">
              会社概要の詳細 &rarr;
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
